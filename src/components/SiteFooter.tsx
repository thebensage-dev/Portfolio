import { Activity, Mail } from "lucide-react";
import { Footer, type FooterLink } from "@thebensage-dev/ui";
import { deepDives, platformPages } from "@/content/platform";
import { navLabels, projectHref, projects, site, skillsPage, statusUrl } from "@/content/site";

/** Footer for every page, in the header's order and with its labels. The page must render per
 *  request, so env URLs are read at runtime. */
export default function SiteFooter() {
  const status = statusUrl();
  const contact: FooterLink[] = [
    { label: site.email, href: `mailto:${site.email}`, icon: Mail },
    { label: navLabels.github, href: site.githubUrl, external: true },
  ];
  if (status) contact.push({ label: "Live status", href: status, icon: Activity });

  return (
    <Footer
      brand={{ name: site.name, href: "/" }}
      tagline={site.footerTagline}
      groups={[
        {
          title: navLabels.projects,
          links: [
            ...projects.map((project) => ({ label: project.title, href: projectHref(project) })),
            { label: navLabels.colours, href: "/#theme" },
          ],
        },
        {
          title: "About",
          links: [
            { label: skillsPage.navLabel, href: skillsPage.path },
            { label: platformPages.agentic.navLabel, href: platformPages.agentic.path },
          ],
        },
        {
          title: platformPages.overview.navLabel,
          links: [
            { label: navLabels.overview, href: platformPages.overview.path },
            ...deepDives
              .filter((page) => page !== platformPages.agentic)
              .map((page) => ({ label: page.navLabel, href: page.path })),
          ],
        },
        { title: navLabels.contact, links: contact },
      ]}
      legal={[
        { label: "Privacy", href: "/privacy" },
        { label: "Cookies", href: "/privacy#cookies" },
        { label: "Terms", href: "/terms" },
      ]}
    />
  );
}
