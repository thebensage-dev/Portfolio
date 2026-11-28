import clsx from "clsx";
import { ArrowUpRight, Code } from "lucide-react";
import { toneClass, type Tone } from "@thebensage-dev/ui";
import { fill, type Block, type Project } from "@thebensage-dev/cms-client";
import ExternalLink from "@/components/ExternalLink";

/** One project: the whole card opens the live app, and a separate link opens its source code. */
export default function ProjectCard({
  project,
  href,
  labels,
  tone,
}: {
  project: Project;
  href: string;
  labels: Block<"projectsGrid">["labels"];
  /** Colours the card's top edge and hover border. */
  tone: Tone;
}) {
  return (
    <article
      className={clsx("card tone-card project-card group flex flex-col gap-4 p-6", toneClass(tone))}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight">
          {/* Stretched over the card, so a click anywhere opens the app. */}
          <a href={href} className="after:absolute after:inset-0 after:content-['']">
            {project.title}
          </a>
        </h3>
        <span className="flex items-center gap-1.5 text-xs font-medium text-primary-ink">
          <span className="size-2 rounded-full bg-success" aria-hidden />
          {labels.live}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground-muted">{project.description}</p>
      <ul className="flex flex-wrap gap-2" aria-label={labels.builtWith}>
        {(project.tags ?? []).map((tag) => (
          <li key={tag} className="tag tag-tone">
            {tag}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-4 text-sm font-semibold">
        <span className="flex items-center gap-1 text-primary-ink" aria-hidden>
          {project.cta || labels.open}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        <ExternalLink
          href={project.source}
          className="relative z-10 flex items-center gap-1 text-foreground-muted hover:text-foreground"
        >
          <Code className="size-4" aria-hidden />
          {labels.source}
          <span className="sr-only"> {fill(labels.sourceOn, { project: project.title })}</span>
        </ExternalLink>
      </div>
    </article>
  );
}
