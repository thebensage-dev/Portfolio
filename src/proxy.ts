import { NextResponse, userAgent, type NextRequest } from "next/server";
import { DRAFT_COOKIE, securityPolicy } from "@thebensage-dev/cms-client";
import { RETURNING_COOKIE, SESSION_COOKIE, SSO_CHECKED_COOKIE } from "@/lib/authCookies";

// Automatic single sign-on: a signed-out page view from a browser that has signed in here before
// (RETURNING_COOKIE) first goes through a silent check with authentik (/auth/login?silent=1, see
// src/server/auth.ts). Someone still signed in to authentik comes back signed in; everyone else
// comes back to the same page, signed out, with no error. It only runs for real page loads in a
// browser (Sec-Fetch headers), never for new visitors, AI agents, prefetches, uptime checks or
// crawlers, and pauses after each check (SSO_CHECKED_COOKIE).
export function proxy(request: NextRequest) {
  return withFrameRules(request, singleSignOn(request) ?? NextResponse.next());
}

/** No framing, except by the CMS's Live Preview while this browser is in draft mode. */
function withFrameRules(request: NextRequest, response: NextResponse) {
  const previewing = request.cookies.has(DRAFT_COOKIE);
  response.headers.set(
    "Content-Security-Policy",
    securityPolicy({ previewing, cmsUrl: process.env.CMS_PUBLIC_URL || process.env.CMS_URL }),
  );
  if (!previewing) response.headers.set("X-Frame-Options", "DENY");
  return response;
}

/** Paths the sign-on check skips: sign-in and preview routes, files, the CV and robots/sitemap. */
const NOT_PAGES = /^\/(auth\/|preview\/?|cv\/|icon\.svg|favicon\.ico|robots\.txt|sitemap\.xml)/;

function singleSignOn(request: NextRequest): NextResponse | null {
  const { cookies, headers, method, nextUrl } = request;
  const pageLoad =
    !NOT_PAGES.test(nextUrl.pathname) &&
    method === "GET" &&
    headers.get("sec-fetch-mode") === "navigate" &&
    headers.get("sec-fetch-dest") === "document" &&
    !headers.has("next-router-prefetch") &&
    !headers.has("rsc") &&
    // Search engines and link previews must get the page itself, not a hop to authentik (whose
    // robots.txt disallows everything, so the page would never be indexed).
    !userAgent(request).isBot;
  if (
    !pageLoad ||
    !process.env.OIDC_ISSUER_URL ||
    !cookies.has(RETURNING_COOKIE) ||
    cookies.has(SESSION_COOKIE) ||
    cookies.has(SSO_CHECKED_COOKIE)
  ) {
    return null;
  }

  // From SITE_URL: behind the proxy, the request's own URL can be the container's (and http).
  const login = new URL("/auth/login", process.env.SITE_URL || nextUrl);
  login.searchParams.set("silent", "1");
  login.searchParams.set("returnTo", nextUrl.pathname + nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  // Everything but Next's built files and the front-channel logout page (framed by authentik,
  // with its own rules).
  matcher: ["/((?!_next/static|_next/image|auth/frontchannel-logout).*)"],
};
