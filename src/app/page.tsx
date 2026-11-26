import type { Metadata } from "next";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { COLOURS_COOKIE, readColours } from "@thebensage-dev/ui";
import HomeHero from "@/components/HomeHero";
import JsonLd from "@/components/JsonLd";
import PlatformTeaser from "@/components/PlatformTeaser";
import ProjectsSection from "@/components/ProjectsSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SkillsTeaser from "@/components/SkillsTeaser";
import ThemeSection from "@/components/ThemeSection";
import { projectUrl, projects, site, siteUrl } from "@/content/site";
import { pageMetadata } from "@/lib/pageMetadata";
import { requestAccessUrl } from "@/server/auth";
import { headerProps, signInHref } from "@/server/headerProps";

export const metadata: Metadata = pageMetadata({ path: "/" });

export default async function Home() {
  // Render per request, so project URLs come from the runtime env, not the build.
  await connection();
  // Signed in through authentik (often already, from another app: see src/proxy.ts). Members
  // (portfolio-members) may use the colour palette.
  const header = await headerProps("/");
  const colours = readColours((await cookies()).get(COLOURS_COOKIE)?.value);
  const storybook = projects.find((project) => project.url.env === "STORYBOOK_URL");
  // Tells search engines the site name to show in results (schema.org WebSite).
  const url = siteUrl();

  return (
    <>
      {url && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            url: url + "/",
            description: site.headline,
          }}
        />
      )}
      <SiteHeader {...header} />

      <main id="top" className="flex-1">
        <HomeHero />
        <ProjectsSection />
        <SkillsTeaser />
        <PlatformTeaser />
        <ThemeSection
          theme={header.theme}
          colours={colours}
          cookieDomain={header.cookieDomain}
          componentsUrl={storybook ? projectUrl(storybook) : site.githubUrl}
          access={{
            member: header.user?.member ?? false,
            signedIn: header.user !== null,
            signInHref: header.signInHref ? signInHref("/#theme") : undefined,
            requestAccessUrl: requestAccessUrl() ?? undefined,
          }}
        />
      </main>

      <SiteFooter />
    </>
  );
}
