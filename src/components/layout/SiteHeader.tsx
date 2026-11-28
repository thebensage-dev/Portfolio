import Link from "next/link";
import { SiteHeader as SharedSiteHeader, type SiteNavItem, iconOrDot } from "@thebensage-dev/ui";
import { getContent, resolveLink } from "@/server/cms";
import type { HeaderProps } from "@/server/headerProps";

/** True for the current page's link, and for the platform link on its sub-pages. */
function isCurrent(href: string, current: string | undefined): boolean {
  if (current === undefined || !href.startsWith("/") || href.includes("#")) return false;
  return current === href || (href !== "/" && current.startsWith(href + "/"));
}

/**
 * The top bar on every page: SharedUI's `SiteHeader` with this site's links (the CMS's Portfolio
 * settings, Header tab). `current` (the page's path) marks its link with aria-current.
 */
export default async function SiteHeader({
  theme,
  cookieDomain,
  user,
  accountHref,
  signInHref,
  current,
}: HeaderProps) {
  const content = await getContent();
  const { settings } = content;
  const nav: SiteNavItem[] = (settings.header?.nav ?? []).flatMap((item) => {
    const link = resolveLink(content, item.link);
    if (!link) return [];
    return [
      {
        label: item.label,
        href: link.href,
        icon: iconOrDot(item.icon),
        ...(item.wideOnly && { wideOnly: true }),
        ...(link.external && { external: true }),
        current: isCurrent(link.href, current),
      },
    ];
  });
  const labels = settings.header?.labels;

  return (
    <SharedSiteHeader
      brand={{ name: settings.name, href: "/" }}
      nav={nav}
      theme={theme}
      cookieDomain={cookieDomain}
      user={user}
      accountHref={accountHref}
      signInHref={signInHref}
      labels={{
        ...settings.interface.header,
        ...(labels?.signIn && { signIn: labels.signIn }),
        ...(labels?.signOut && { signOut: labels.signOut }),
        ...(labels?.account && { account: labels.account }),
        ...(labels?.theme && { theme: labels.theme }),
      }}
      linkComponent={Link}
    />
  );
}
