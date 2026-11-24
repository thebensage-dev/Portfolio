import { Activity, Mail } from "lucide-react";
import { Footer, type FooterLink } from "@thebensage-dev/ui";
import { deepDives, platformPages } from "@/content/platform";
import { projectHref, projects, site, statusUrl } from "@/content/site";

/** Footer for every page. The page must render per request, so env URLs are read at runtime. */
export default function SiteFooter() {
  const status = statusUrl();
  const contact: FooterLink[] = [
    { label: "Email", href: `mailto:${site.email}`, icon: Mail },
    { label: "GitHub", href: site.githubUrl, external: true },
  ];
  if (status) contact.push({ label: "Live status", href: status, icon: Activity });

  return (
    <Footer
      brand={{ name: site.name, href: "/" }}
      tagline={site.footerTagline}
      groups={[
        {
          title: "Projects",
          links: projects.map((project) => ({ label: project.title, href: projectHref(project) })),
        },
        {
          title: "Platform",
          links: [
            { label: "How it works", href: platformPages.overview.path },
            ...deepDives.map((page) => ({ label: page.navLabel, href: page.path })),
          ],
        },
        { title: "Contact", links: contact },
      ]}
      legal={[
        { label: "Privacy", href: "/privacy" },
        { label: "Cookies", href: "/privacy#cookies" },
        { label: "Terms", href: "/terms" },
      ]}
    />
  );
}
