import { createHash } from "node:crypto";
import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";
import * as oidc from "openid-client";
import { RETURNING_COOKIE, SESSION_COOKIE, SSO_CHECKED_COOKIE } from "@/lib/authCookies";
import { trimSlash } from "@/lib/env";

// Server-only: sign-in through authentik (OpenID Connect, authorization code + PKCE), the same way
// as the User Directory. The site is public; signing in unlocks the colour palette for members.
// Any authentik account can sign in (single sign-on across the apps); what they may use comes
// from the token's `groups` claim: portfolio-members (or authentik Admins) are members. Someone
// signed in without it gets a link to authentik's shared "Request access" page.
//
// Single sign-on: src/proxy.ts sends a signed-out page view from a browser that has signed in
// here before through a silent check (prompt=none). authentik answers at once, with a code when it has a session and with
// error=login_required when it hasn't, and either way the visitor lands back on the same page.
//
// The session is an encrypted cookie (no session table) with the name, email and groups. The
// site calls nothing with authentik's tokens, so it doesn't keep them.

export type SiteUser = { sub: string; name: string; email: string; member: boolean };

/** The groups that unlock the members' extras. Approving a request adds people to the first. */
const MEMBER_GROUPS = ["portfolio-members", "authentik Admins"];

const LOGIN_COOKIE = "pf_login";
const SESSION_HOURS = 8;
/** How long to wait before checking again after a check found no authentik session. */
const SSO_RECHECK_MINUTES = 10;
const RETURNING_DAYS = 365;
/** authentik's answers to prompt=none that just mean "not signed in here". */
const SILENT_MISSES = new Set(["login_required", "consent_required", "interaction_required"]);

type AuthEnv = {
  issuer: string;
  clientId: string;
  clientSecret: string;
  appUrl: string;
  secret: string;
  internalUrl?: string;
};

function readEnv(): AuthEnv | null {
  const {
    OIDC_ISSUER_URL: issuer,
    OIDC_CLIENT_ID: clientId,
    OIDC_CLIENT_SECRET: clientSecret,
    SITE_URL: appUrl,
    AUTH_SECRET: secret,
    OIDC_INTERNAL_URL: internalUrl,
  } = process.env;
  if (!issuer || !clientId || !clientSecret || !appUrl || !secret) return null;
  return {
    // Exactly as given: authentik's issuer ends in a slash and must match character for character.
    issuer,
    clientId,
    clientSecret,
    appUrl: trimSlash(appUrl),
    secret,
    internalUrl: internalUrl ? trimSlash(internalUrl) || undefined : undefined,
  };
}

function requireEnv(): AuthEnv {
  const env = readEnv();
  if (!env) throw new Error("Sign-in isn't configured (see .env.example).");
  return env;
}

/** True when the OIDC variables are set, so the sign-in button can work. */
export function authConfigured(): boolean {
  return readEnv() !== null;
}

/** One of authentik's flow pages (from the blueprint), opened for this app. */
function flowUrl(
  env: AuthEnv,
  flow: "account" | "request-access" | "sign-out",
  app = "portfolio",
): string {
  return new URL(`/if/flow/${flow}/?app=${encodeURIComponent(app)}`, env.issuer).href;
}

/** authentik's "Your account" page: name, email and password. */
export function accountUrl(): string | null {
  const env = readEnv();
  return env ? flowUrl(env, "account") : null;
}

/** authentik's shared "Request access" page with Portfolio (or `app`, such as "cms") ticked. */
export function requestAccessUrl(app?: string): string | null {
  const env = readEnv();
  return env ? flowUrl(env, "request-access", app) : null;
}

/** The `groups` claim as strings; anything else counts as no groups. */
const groupsOf = (value: unknown): string[] => (Array.isArray(value) ? value.map(String) : []);

// Cookies are encrypted with a key derived from AUTH_SECRET.
const keyFor = (secret: string) => createHash("sha256").update(secret).digest();

async function seal(payload: Record<string, unknown>, expiresIn: string, secret: string) {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .encrypt(keyFor(secret));
}

async function unseal(token: string | undefined, secret: string) {
  if (!token) return null;
  try {
    return (await jwtDecrypt(token, keyFor(secret))).payload;
  } catch {
    return null;
  }
}

let configPromise: Promise<oidc.Configuration> | undefined;

/**
 * Discovers authentik once per process. With OIDC_INTERNAL_URL (the local Docker stack),
 * server-to-server calls go to that origin, with the public host as X-Forwarded-Host so
 * authentik's issuer still matches. The browser always uses the public URL.
 */
function getConfig(env: AuthEnv): Promise<oidc.Configuration> {
  configPromise ??= (async () => {
    const publicUrl = new URL(env.issuer);
    const fetchVia: oidc.CustomFetch = (url, options) => {
      const init = options as RequestInit;
      const target = new URL(url);
      if (!env.internalUrl || target.origin !== publicUrl.origin) return fetch(url, init);
      const internal = new URL(env.internalUrl);
      target.protocol = internal.protocol;
      target.host = internal.host;
      const headers = new Headers(init.headers);
      headers.set("X-Forwarded-Host", publicUrl.host);
      headers.set("X-Forwarded-Proto", publicUrl.protocol.replace(":", ""));
      return fetch(target, { ...init, headers });
    };
    const insecure = env.issuer.startsWith("http://") ? [oidc.allowInsecureRequests] : [];
    const config = await oidc.discovery(
      new URL(env.issuer),
      env.clientId,
      env.clientSecret,
      undefined,
      { [oidc.customFetch]: fetchVia, execute: insecure },
    );
    config[oidc.customFetch] = fetchVia;
    return config;
  })().catch((err) => {
    configPromise = undefined;
    throw err;
  });
  return configPromise;
}

const cookieOptions = (env: AuthEnv, maxAgeSeconds?: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.appUrl.startsWith("https://"),
  path: "/",
  maxAge: maxAgeSeconds,
});

/** Only same-site paths, so the login can't be used to redirect somewhere else. */
export function safeReturnTo(value: string | null | undefined): string {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")
    ? value
    : "/";
}

/**
 * Starts a sign-in: remembers state and the PKCE verifier, returns authentik's URL. A silent one
 * (prompt=none) never shows a page: authentik sends the browser straight back either way.
 */
export async function beginLogin(returnTo: string, { silent = false } = {}): Promise<URL> {
  const env = requireEnv();
  const jar = await cookies();
  // Set first: if authentik can't be reached, the visitor still gets the page.
  if (silent) jar.set(SSO_CHECKED_COOKIE, "1", cookieOptions(env, SSO_RECHECK_MINUTES * 60));
  const config = await getConfig(env);
  const verifier = oidc.randomPKCECodeVerifier();
  const state = oidc.randomState();

  jar.set(
    LOGIN_COOKIE,
    await seal({ verifier, state, returnTo: safeReturnTo(returnTo), silent }, "15m", env.secret),
    cookieOptions(env, 15 * 60),
  );

  return oidc.buildAuthorizationUrl(config, {
    redirect_uri: `${env.appUrl}/auth/callback`,
    scope: "openid profile email",
    code_challenge: await oidc.calculatePKCECodeChallenge(verifier),
    code_challenge_method: "S256",
    state,
    ...(silent && { prompt: "none" }),
  });
}

/** Finishes a sign-in from authentik's redirect. Returns where to send the person next. */
export async function completeLogin(search: string): Promise<string> {
  const env = requireEnv();
  const jar = await cookies();
  const pending = await unseal(jar.get(LOGIN_COOKIE)?.value, env.secret);
  jar.delete(LOGIN_COOKIE);
  if (typeof pending?.verifier !== "string" || typeof pending.state !== "string") {
    throw new Error("The sign-in expired. Please try again.");
  }

  const returnTo = safeReturnTo(typeof pending.returnTo === "string" ? pending.returnTo : null);
  const error = new URLSearchParams(search).get("error");
  if (pending.silent === true && error && SILENT_MISSES.has(error)) return returnTo;

  const config = await getConfig(env);
  // Rebuilt from SITE_URL: behind the proxy, the request's own URL is the container's.
  const callbackUrl = new URL(`${env.appUrl}/auth/callback${search}`);
  const tokens = await oidc.authorizationCodeGrant(config, callbackUrl, {
    pkceCodeVerifier: pending.verifier,
    expectedState: pending.state,
  });
  const claims = tokens.claims();
  if (!claims) throw new Error("authentik didn't return an ID token.");

  const groups = groupsOf(claims.groups);
  jar.set(
    SESSION_COOKIE,
    await seal(
      {
        sub: claims.sub,
        name: String(claims.name ?? claims.preferred_username ?? claims.email ?? "Signed in"),
        email: String(claims.email ?? ""),
        groups,
        // authentik's session id, matched by front-channel logout.
        sid: typeof claims.sid === "string" ? claims.sid : undefined,
      },
      `${SESSION_HOURS}h`,
      env.secret,
    ),
    cookieOptions(env, SESSION_HOURS * 3600),
  );
  jar.set(RETURNING_COOKIE, "1", cookieOptions(env, RETURNING_DAYS * 86400));
  jar.delete(SSO_CHECKED_COOKIE);
  return returnTo;
}

/** The signed-in person, or null. Always null when sign-in isn't configured. */
export async function currentUser(): Promise<SiteUser | null> {
  const env = readEnv();
  if (!env) return null;
  const payload = await unseal((await cookies()).get(SESSION_COOKIE)?.value, env.secret);
  if (typeof payload?.sub !== "string") return null;
  const groups = groupsOf(payload.groups);
  return {
    sub: payload.sub,
    name: String(payload.name ?? ""),
    email: String(payload.email ?? ""),
    member: groups.some((group) => MEMBER_GROUPS.includes(group)),
  };
}

/**
 * Signs out everywhere (single logout): drops this site's session and returns authentik's
 * "Sign out" page (flow `sign-out`), which ends the authentik session, signs the other apps out
 * through their front-channel logout and sends the person back here.
 */
export async function signOut(): Promise<string> {
  (await cookies()).delete(SESSION_COOKIE);
  const env = readEnv();
  return env ? flowUrl(env, "sign-out") : "/";
}

/**
 * Front-channel logout: authentik's "Sign out" page (flow `sign-out`, used by every app) loads
 * this in a hidden frame after ending the authentik session, so signing out anywhere signs out
 * here too. Only for this app's issuer, and only the session from that authentik session (sid)
 * when both know it. Returns false for a request that isn't for this app.
 */
export async function frontchannelLogout(iss: string | null, sid: string | null): Promise<boolean> {
  const env = readEnv();
  if (!env || iss !== env.issuer) return false;
  const jar = await cookies();
  const payload = await unseal(jar.get(SESSION_COOKIE)?.value, env.secret);
  if (typeof payload?.sid === "string" && sid && payload.sid !== sid) return true;
  jar.delete(SESSION_COOKIE);
  return true;
}

/** The origin allowed to frame the front-channel logout page (authentik's). */
export function issuerOrigin(): string | null {
  const env = readEnv();
  return env ? new URL(env.issuer).origin : null;
}
