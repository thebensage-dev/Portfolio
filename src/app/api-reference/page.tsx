import clsx from "clsx";
import { ArrowUpRight, Code, FileBraces } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { toneAt, toneClass } from "@thebensage-dev/ui";
import ApiReference from "@/components/ApiReference";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { fetchApiSpec } from "@/lib/apiSpec";
import { pageMetadata } from "@/lib/pageMetadata";
import { apiReference, projectUrl, projects } from "@/content/site";
import { headerProps } from "@/server/headerProps";

export const metadata: Metadata = pageMetadata({
  title: apiReference.title,
  description: apiReference.description,
  path: "/api-reference",
});

export default async function ApiReferencePage() {
  // Per request, so the project URL and the OpenAPI document come from the runtime env.
  await connection();
  const header = await headerProps("/api-reference");
  const spec = await fetchApiSpec();
  const project = projects.find((p) => p.url.env === apiReference.project);
  const { links } = apiReference;

  const facts = spec
    ? [
        { label: "Version", value: spec.version },
        {
          label: "Endpoints",
          value: spec.operations === undefined ? undefined : String(spec.operations),
        },
        { label: "Groups", value: spec.groups?.length ? spec.groups.join(", ") : undefined },
        { label: "Authentication", value: spec.auth?.length ? spec.auth.join(", ") : undefined },
      ].filter((fact) => fact.value)
    : [];

  return (
    <>
      <SiteHeader {...header} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-20 sm:px-6">
        <div className="max-w-3xl">
          <span aria-hidden className="brand-rule" />
          <p className="eyebrow tone-primary mt-4">{apiReference.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {spec?.title ?? apiReference.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-foreground-muted">
            {apiReference.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {project && (
              <a
                href={`${projectUrl(project).replace(/\/$/, "")}/docs/`}
                className="btn btn-primary"
              >
                {links.app}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            )}
            {spec && (
              <a
                href={spec.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <FileBraces className="size-4" aria-hidden />
                {links.spec}
              </a>
            )}
            {project && (
              <a
                href={project.source}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Code className="size-4" aria-hidden />
                {links.source}
              </a>
            )}
          </div>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {apiReference.points.map(({ icon: Icon, title, description }, i) => (
            <li key={title} className={clsx("card tone-card p-6", toneClass(toneAt(i)))}>
              <Icon className="size-5 text-primary-ink" aria-hidden />
              <h2 className="mt-3 font-semibold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{description}</p>
            </li>
          ))}
        </ul>

        {facts.length > 0 && (
          <dl className="mt-10 grid gap-x-8 gap-y-4 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-1 font-mono text-sm">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <section aria-label={apiReference.title} className="mt-10">
          {spec ? (
            <div className="card overflow-hidden">
              <ApiReference content={spec.content} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-strong p-10 text-center">
              <span className="font-semibold">{apiReference.unavailable.title}</span>
              <p className="max-w-md text-sm text-foreground-muted">
                {apiReference.unavailable.description}
              </p>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
