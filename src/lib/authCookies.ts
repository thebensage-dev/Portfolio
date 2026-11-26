// Cookie names shared by the sign-in code (src/server/auth.ts) and the proxy (src/proxy.ts).

/** The encrypted session: name, email and authentik groups. */
export const SESSION_COOKIE = "pf_session";

/**
 * Set while the automatic sign-in check is paused: for a few minutes after a check found no
 * authentik session, so a signed-out visitor isn't sent round on every page.
 */
export const SSO_CHECKED_COOKIE = "pf_sso_checked";

/**
 * Set after a sign-in. The automatic sign-in check only runs in a browser that has it, so new
 * visitors and AI agents get the page itself, never a hop to authentik.
 */
export const RETURNING_COOKIE = "pf_returning";
