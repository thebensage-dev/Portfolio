import { Footer, type FooterLink, iconByName } from "@thebensage-dev/ui";
import { getContent, resolveLink, type CmsLink, type Content } from "@/lib/cms";

type LinkRow = { label: string; icon?: string | null; link: CmsLink };

/** The CMS's footer links; one that can't go anywhere right now (Live status unset) is left out. */
function footerLinks(content: Content, rows: LinkRow[] | null | undefined): FooterLink[] {
  return (rows ?? []).flatMap((row) => {
    const link = resolveLink(content, row.link);
    if (!link) return [];
    const Icon = iconByName(row.icon);
    return [
      {
        label: row.label,
        href: link.href,
        ...(Icon && { icon: Icon }),
        ...(link.external && { external: true }),
      },
    ];
  });
}

/** Footer for every page (the CMS's Portfolio settings, Footer tab). The page must render per
 *  request, so env URLs are read at runtime. */
export default async function SiteFooter() {
  const content = await getContent();
  const { settings } = content;
  return (
    <Footer
      brand={{ name: settings.name, href: "/" }}
      tagline={settings.footer.tagline}
      {...(settings.footer.owner && { owner: settings.footer.owner })}
      groups={(settings.footer.groups ?? []).map((group) => ({
        title: group.title,
        links: footerLinks(content, group.links),
      }))}
      legal={footerLinks(content, settings.footer.legal)}
      labels={settings.interface.footer}
    />
  );
}
