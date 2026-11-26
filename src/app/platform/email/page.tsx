import { Code } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { toneAt, FeatureGrid, FlowSteps, SectionHeading } from "@thebensage-dev/ui";
import AddressCards from "@/components/AddressCards";
import EmailPreview from "@/components/EmailPreview";
import PageIntro from "@/components/PageIntro";
import PageSection from "@/components/PageSection";
import SenderCard from "@/components/SenderCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { emailPage, platformPages } from "@/content/platform";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/pageMetadata";
import { headerProps } from "@/server/headerProps";

const page = platformPages.email;

export const metadata: Metadata = pageMetadata({
  title: page.navLabel,
  description: page.description,
  path: page.path,
});

const TEMPLATES_URL = `${site.githubUrl}/Infrastructure/tree/main/identity/authentik/templates/email`;

export default async function EmailPage() {
  await connection(); // The header reads the sign-in settings from the runtime env.
  const header = await headerProps(page.path);
  const { flow, addresses, senders, practices } = emailPage;

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
          intro={emailPage.intro}
        >
          <a
            href={TEMPLATES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <Code className="size-4" aria-hidden />
            The email templates on GitHub
          </a>
        </PageIntro>

        <PageSection id="flow" title={flow.title}>
          <div className="grid gap-8">
            {[flow.outbound, flow.inbound].map((direction) => (
              <div key={direction.label}>
                <p className="eyebrow">{direction.label}</p>
                <FlowSteps steps={direction.steps} label={direction.label} className="mt-3" />
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection id="addresses" title={addresses.title}>
          <AddressCards />
        </PageSection>

        <section
          aria-labelledby="senders-title"
          className="mt-subsection grid items-start gap-stack lg:grid-cols-2"
        >
          <div>
            <SectionHeading id="senders-title" title={senders.title} />
            <div className="mt-content grid gap-5">
              {[senders.authentik, senders.grafana].map((sender, i) => (
                <SenderCard key={sender.title} {...sender} tone={toneAt(i)} />
              ))}
            </div>
          </div>
          <EmailPreview />
        </section>

        <PageSection id="practices" title={practices.title}>
          <FeatureGrid features={practices.points} columns={2} />
        </PageSection>
      </main>

      <SiteFooter />
    </>
  );
}
