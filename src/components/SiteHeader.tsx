import { BookOpen, FolderGit2, FolderKanban, Mail, Palette, Server } from "lucide-react";
import Link from "next/link";
import { SiteHeader as SharedSiteHeader, type SiteNavItem, type Theme } from "@thebensage-dev/ui";
import { platformPages } from "@/content/platform";
import { apiReference, site, themeDemo } from "@/content/site";
import type { SiteUser } from "@/server/auth";

/**
 * The top bar on every page: SharedUI's `SiteHeader` with this site's links from content. `current`
 * (the page's path) marks its link with aria-current; the platform link stays marked on its
 * sub-pages.
 */
export default function SiteHeader({
  theme,
  cookieDomain,
  user,
  accountHref,
  signInHref,
  current,
}: {
  theme: Theme;
  cookieDomain?: string;
  user: SiteUser | null;
  /** authentik's "Your account" page; missing when sign-in isn't configured. */
  accountHref: string | null;
  /** Missing when sign-in isn't configured. */
  signInHref?: string;
  current?: string;
}) {
  const isCurrent = (href: string) =>
    current !== undefined && href.startsWith("/") && !href.includes("#")
      ? current === href || current.startsWith(href + "/")
      : false;

  const nav: SiteNavItem[] = [
    { label: "Projects", href: "/#projects", icon: FolderKanban },
    { label: platformPages.overview.navLabel, href: platformPages.overview.path, icon: Server },
    { label: apiReference.navLabel, href: "/api-reference", icon: BookOpen },
    { label: "GitHub", href: site.githubUrl, icon: FolderGit2, external: true },
    { label: "Contact", href: `mailto:${site.email}`, icon: Mail, external: true },
    { label: "Colours", href: "/#theme", icon: Palette, wideOnly: true },
  ].map((item) => ({ ...item, current: isCurrent(item.href) }));

  return (
    <SharedSiteHeader
      brand={{ name: site.name, href: "/" }}
      nav={nav}
      theme={theme}
      cookieDomain={cookieDomain}
      user={user}
      accountHref={accountHref}
      signInHref={signInHref}
      labels={{
        signIn: themeDemo.signIn,
        signOut: themeDemo.signOut,
        account: themeDemo.account,
        theme: themeDemo.themeLabel,
      }}
      linkComponent={Link}
    />
  );
}
