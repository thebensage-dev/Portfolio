import { createAuth, inGroup } from "@thebensage-dev/auth";

// Sign-in through authentik (@thebensage-dev/auth, from the Infrastructure repo). The site is
// public; signing in unlocks the colour palette for members. Any authentik account can sign in
// (single sign-on across the apps); portfolio-members (or authentik Admins) are members. Someone
// signed in without it gets a link to authentik's shared "Request access" page.

export const auth = createAuth({
  app: "portfolio",
  cookiePrefix: "pf",
  name: "the site",
  appUrlEnv: "SITE_URL",
});

/** The groups that unlock the members' extras. Approving a request adds people to the first. */
const MEMBER_GROUPS = ["portfolio-members", "authentik Admins"];

export type SiteUser = { sub: string; name: string; email: string; member: boolean };

/** The signed-in person, or null. */
export async function currentUser(): Promise<SiteUser | null> {
  const session = await auth.currentSession();
  return (
    session && {
      sub: session.sub,
      name: session.name,
      email: session.email,
      member: inGroup(session.groups, MEMBER_GROUPS),
    }
  );
}

export const { accountUrl, requestAccessUrl, configured: authConfigured } = auth;
