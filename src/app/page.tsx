import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import {
  BrandBlobs,
  COLOURS_COOKIE,
  preferenceCookieDomain,
  readColours,
  readTheme,
  toneAt,
  THEME_COOKIE,
} from "@thebensage-dev/ui";
import ProjectCard from "@/components/ProjectCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StackSection from "@/components/StackSection";
import ThemeSection from "@/components/ThemeSection";
import { projectHref, projectUrl, projects, site, siteUrl } from "@/content/site";
import { accountUrl, authConfigured, currentUser, requestAccessUrl } from "@/server/auth";

const signInHref = (returnTo: string) => `/auth/login?returnTo=${encodeURIComponent(returnTo)}`;

export default async function Home() {
  // Render per request, so project URLs come from the runtime env, not the build.
  await connection();
  const cookieStore = await cookies();
  const theme = readTheme(cookieStore.get(THEME_COOKIE)?.value);
  const colours = readColours(cookieStore.get(COLOURS_COOKIE)?.value);
  const cookieDomain = preferenceCookieDomain(siteUrl());
  const storybook = projects.find((project) => project.url.env === "STORYBOOK_URL");
  const mailto = `mailto:${site.email}`;
  const [headlineStart, headlineEnd] = site.headline.split(site.headlineHighlight);
  // Signed in through authentik (often already, from another app: see src/proxy.ts). Members
  // (portfolio-members) may use the colour palette.
  const user = await currentUser();
  const canSignIn = authConfigured();
  const account = accountUrl();

  return (
    <>
      <SiteHeader
        theme={theme}
        cookieDomain={cookieDomain}
        user={user}
        accountHref={account}
        signInHref={canSignIn ? signInHref("/") : undefined}
      />

      <main id="top" className="flex-1">
        <section className="relative isolate overflow-hidden">
          <div aria-hidden className="dot-grid absolute inset-0 -z-10" />
          <BrandBlobs />
          <div className="mx-auto max-w-3xl px-4 pt-20 pb-24 text-center sm:px-6 sm:pt-28 sm:pb-32">
            <span aria-hidden className="brand-rule reveal mx-auto" />
            <p className="eyebrow reveal mt-5">{site.role}</p>
            <h1
              className="reveal mt-5 text-4xl font-bold tracking-tight text-balance sm:text-6xl"
              style={{ animationDelay: "80ms" }}
            >
              {headlineEnd === undefined ? (
                site.headline
              ) : (
                <>
                  {headlineStart}
                  <span className="gradient-text">{site.headlineHighlight}</span>
                  {headlineEnd}
                </>
              )}
            </h1>
            <p
              className="reveal mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-foreground-muted"
              style={{ animationDelay: "160ms" }}
            >
              {site.intro}
            </p>
            <div
              className="reveal mt-10 flex flex-wrap justify-center gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <a href="#projects" className="btn btn-primary">
                View projects
                <ArrowDown className="size-4" aria-hidden />
              </a>
              <a href={mailto} className="btn btn-accent">
                Get in touch
                <Mail className="size-4" aria-hidden />
              </a>
              <a
                href={site.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                GitHub
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-5xl scroll-mt-8 px-4 pb-24 sm:px-6">
          <p className="eyebrow tone-secondary">Projects</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Selected work</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                href={projectHref(project)}
                tone={toneAt(i)}
              />
            ))}
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-strong p-6 text-center text-sm text-foreground-muted">
              <span className="font-semibold text-foreground">More in progress</span>
              New projects are added here when they go live.
            </div>
          </div>
        </section>

        <StackSection />

        <ThemeSection
          theme={theme}
          colours={colours}
          cookieDomain={cookieDomain}
          componentsUrl={storybook ? projectUrl(storybook) : site.githubUrl}
          access={{
            member: user?.member ?? false,
            signedIn: user !== null,
            signInHref: canSignIn ? signInHref("/#theme") : undefined,
            requestAccessUrl: requestAccessUrl() ?? undefined,
          }}
        />
      </main>

      <SiteFooter />
    </>
  );
}
