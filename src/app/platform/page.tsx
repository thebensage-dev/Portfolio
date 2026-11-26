import { Code } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import DeepDiveCards from "@/components/DeepDiveCards";
import PageIntro from "@/components/PageIntro";
import PageSection from "@/components/PageSection";
import PlatformMap from "@/components/PlatformMap";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StackSection from "@/components/StackSection";
import { apiReferenceCard, deepDives, platformMap, platformPages } from "@/content/platform";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/pageMetadata";
import { headerProps } from "@/server/headerProps";

const page = platformPages.overview;

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default async function PlatformPage() {
  await connection(); // The app links come from the runtime env.
  const header = await headerProps(page.path);

  return (
    <>
      <SiteHeader {...header} />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 pt-8 pb-section sm:px-6">
          <PageIntro
            crumbs={[{ label: page.navLabel, path: page.path }]}
            eyebrow={page.eyebrow}
            title={page.title}
            intro={page.description}
          >
            <a
              href={`${site.githubUrl}/Infrastructure`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <Code className="size-4" aria-hidden />
              Infrastructure on GitHub
            </a>
          </PageIntro>

          <PageSection id="map" title={platformMap.title} intro={platformMap.intro}>
            <PlatformMap />
          </PageSection>

          <PageSection id="deep-dives" title={platformMap.deepDivesTitle}>
            <DeepDiveCards pages={[...deepDives, apiReferenceCard]} />
          </PageSection>
        </div>

        <StackSection />
      </main>

      <SiteFooter />
    </>
  );
}
