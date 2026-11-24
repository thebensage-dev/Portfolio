import { cookies } from "next/headers";
import { preferenceCookieDomain, readTheme, THEME_COOKIE } from "@thebensage-dev/ui";
import { siteUrl } from "@/content/site";
import { accountUrl, authConfigured, currentUser } from "@/server/auth";

/** /auth/login, coming back to `returnTo` (a path on this site). */
export const signInHref = (returnTo: string) =>
  `/auth/login?returnTo=${encodeURIComponent(returnTo)}`;

/** What `SiteHeader` needs on any page: the theme, the signed-in user and the sign-in link back to
 *  `returnTo`. Reads cookies, so the page renders per request. */
export async function headerProps(returnTo: string) {
  const theme = readTheme((await cookies()).get(THEME_COOKIE)?.value);
  const user = await currentUser();
  return {
    theme,
    cookieDomain: preferenceCookieDomain(siteUrl()),
    user,
    accountHref: accountUrl(),
    signInHref: authConfigured() ? signInHref(returnTo) : undefined,
    current: returnTo,
  };
}
