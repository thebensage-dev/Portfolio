import { ArrowRight, Download, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { FeatureGrid, NoteCard, toneAt, toneClass } from "@thebensage-dev/ui";
import PageIntro from "@/components/PageIntro";
import PageSection from "@/components/PageSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StepsSection from "@/components/StepsSection";
import { platformPages } from "@/content/platform";
import { projectUrl, projects, site, skillsPage } from "@/content/site";
import { pageMetadata } from "@/lib/pageMetadata";
import { headerProps } from "@/server/headerProps";

export const metadata: Metadata = pageMetadata({
  title: skillsPage.navLabel,
  description: skillsPage.description,
  path: skillsPage.path,
});

export default async function SkillsPage() {
  await connection(); // The Storybook link and the header come from the runtime env.
  const header = await headerProps(skillsPage.path);
  const { skills, lifecycle, evidence } = skillsPage;
  const storybook = projects.find((project) => project.url.env === "STORYBOOK_URL");
  const evidenceLinks = {
    storybook: storybook ? projectUrl(storybook) : site.githubUrl,
    accessFlow: `${platformPages.signIn.path}#flow-title`,
    howIWork: platformPages.agentic.path,
  };

  return (
    <>
      <SiteHeader {...header} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-8 pb-section sm:px-6">
        <PageIntro
          crumbs={[{ label: skillsPage.navLabel, path: skillsPage.path }]}
          eyebrow={skillsPage.eyebrow}
          title={skillsPage.title}
          intro={skillsPage.intro}
        >
          <a href={`mailto:${site.email}`} className="btn btn-accent btn-sm">
            Get in touch
            <Mail className="size-4" aria-hidden />
          </a>
          <a href={site.cv.path} download={site.cv.fileName} className="btn btn-secondary btn-sm">
            {site.cv.label}
            <Download className="size-4" aria-hidden />
          </a>
        </PageIntro>

        <PageSection id="skills" title={skills.title}>
          <FeatureGrid features={skills.points} tagsLabel="Practices" />
        </PageSection>

        <StepsSection
          id="lifecycle"
          title={lifecycle.title}
          intro={lifecycle.intro}
          steps={lifecycle.steps}
        />

        <PageSection id="evidence" title={evidence.title} intro={evidence.intro}>
          <ul className="grid gap-5 md:grid-cols-3">
            {evidence.items.map((item, i) => {
              const href = evidenceLinks[item.target];
              const external = href.startsWith("http");
              return (
                <li key={item.title} className="flex">
                  <NoteCard
                    title={item.title}
                    body={item.body}
                    tone={toneClass(toneAt(i))}
                    className="w-full"
                  >
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link inline-flex items-center gap-1 text-sm"
                      >
                        {item.link}
                        <ArrowRight className="size-4" aria-hidden />
                      </a>
                    ) : (
                      <Link href={href} className="link inline-flex items-center gap-1 text-sm">
                        {item.link}
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    )}
                  </NoteCard>
                </li>
              );
            })}
          </ul>
        </PageSection>
      </main>

      <SiteFooter />
    </>
  );
}
