import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { FeatureGrid, NoteCard } from "@thebensage-dev/ui";
import PageIntro from "@/components/PageIntro";
import PageSection from "@/components/PageSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StepsSection from "@/components/StepsSection";
import { agenticPage, platformPages } from "@/content/platform";
import { pageMetadata } from "@/lib/pageMetadata";
import { headerProps } from "@/server/headerProps";

const page = platformPages.agentic;

export const metadata: Metadata = pageMetadata({
  title: page.navLabel,
  description: page.description,
  path: page.path,
});

export default async function HowIWorkPage() {
  await connection(); // The header reads the sign-in settings from the runtime env.
  const header = await headerProps(page.path);
  const { workflow, practices, skill, links } = agenticPage;

  return (
    <>
      <SiteHeader {...header} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-8 pb-20 sm:px-6">
        <PageIntro
          crumbs={[
            { label: platformPages.overview.navLabel, path: platformPages.overview.path },
            { label: page.navLabel, path: page.path },
          ]}
          eyebrow={page.eyebrow}
          title={page.title}
          intro={agenticPage.intro}
        >
          <a
            href={links.claude.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            {links.claude.label}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </PageIntro>

        <StepsSection id="workflow" title={workflow.title} steps={workflow.steps}>
          <NoteCard title={skill.title} body={skill.body} />
        </StepsSection>

        <PageSection id="practices" title={practices.title}>
          <FeatureGrid features={practices.points} />
        </PageSection>
      </main>

      <SiteFooter />
    </>
  );
}
