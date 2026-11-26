import { Code, UserPlus } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import AccessTable from "@/components/AccessTable";
import { FeatureGrid } from "@thebensage-dev/ui";
import PageIntro from "@/components/PageIntro";
import PageSection from "@/components/PageSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StepsSection from "@/components/StepsSection";
import TryAccessCard from "@/components/TryAccessCard";
import { platformPages, signInPage } from "@/content/platform";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/pageMetadata";
import { requestAccessUrl } from "@/server/auth";
import { headerProps } from "@/server/headerProps";

const page = platformPages.signIn;

export const metadata: Metadata = pageMetadata({
  title: page.navLabel,
  description: page.description,
  path: page.path,
});

const BLUEPRINT_URL = `${site.githubUrl}/Infrastructure/blob/main/identity/authentik/blueprints/platform.yaml`;

export default async function SignInPage() {
  await connection(); // The sign-in links come from the runtime env.
  const header = await headerProps(page.path);
  const requestAccess = requestAccessUrl() ?? undefined;
  const { sso, flow, access, details, tryIt } = signInPage;

  return (
    <>
      <SiteHeader {...header} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-8 pb-section sm:px-6">
        <PageIntro
          crumbs={[
            { label: platformPages.overview.navLabel, path: platformPages.overview.path },
            { label: page.navLabel, path: page.path },
          ]}
          eyebrow={page.eyebrow}
          title={page.title}
          intro={signInPage.intro}
        >
          {requestAccess && (
            <a href={requestAccess} className="btn btn-primary">
              <UserPlus className="size-4" aria-hidden />
              {tryIt.requestAccess}
            </a>
          )}
          <a
            href={BLUEPRINT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <Code className="size-4" aria-hidden />
            {signInPage.links.source}
          </a>
        </PageIntro>

        <PageSection id="sso" title={sso.title}>
          <FeatureGrid features={sso.points} />
        </PageSection>

        <StepsSection id="flow" title={flow.title} intro={flow.intro} steps={flow.steps}>
          <TryAccessCard
            signedIn={header.user !== null}
            requestAccessHref={requestAccess}
            signInHref={header.signInHref}
          />
        </StepsSection>

        <PageSection id="access" title={access.title} intro={access.intro}>
          <AccessTable />
        </PageSection>

        <PageSection id="details" title={details.title}>
          <FeatureGrid features={details.points} columns={2} />
        </PageSection>
      </main>

      <SiteFooter />
    </>
  );
}
