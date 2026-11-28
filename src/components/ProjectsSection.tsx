import clsx from "clsx";
import { toneAt, SectionHeading } from "@thebensage-dev/ui";
import type { Block, Page } from "@thebensage-dev/cms-client";
import { sectionClass } from "@/components/GeneralSection";
import ProjectCard from "@/components/ProjectCard";
import { projectHref, type Content } from "@/lib/cms";

/** Every live project (the CMS's Projects, in their order), then what's coming next. Render per
 *  request (project URLs come from env). */
export default function ProjectsSection({
  block,
  content,
  page,
}: {
  block: Block<"projectsGrid">;
  content: Content;
  /** The page it's on: its width decides the section's layout. */
  page: Page;
}) {
  const { anchor, eyebrow, title, labels, comingNext } = block;
  return (
    <section
      id={anchor}
      aria-labelledby={`${anchor}-title`}
      className={clsx(
        "scroll-mt-8",
        sectionClass(page, "mx-auto max-w-5xl px-4 py-section sm:px-6"),
      )}
    >
      <SectionHeading
        id={`${anchor}-title`}
        eyebrow={eyebrow ?? undefined}
        eyebrowTone="tone-secondary"
        title={title}
      />
      <div className="mt-content grid gap-5 md:grid-cols-2">
        {content.projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            href={projectHref(content, project)}
            labels={labels}
            tone={toneAt(i)}
          />
        ))}
        <div
          className={clsx(
            "flex flex-col justify-center gap-3 rounded-2xl border border-dashed border-border-strong p-6 text-sm text-foreground-muted",
            content.projects.length % 2 === 0 && "md:col-span-2",
          )}
        >
          <p className="eyebrow tone-accent">{comingNext.title}</p>
          <ul className="grid gap-2">
            {(comingNext.items ?? []).map((item) => (
              <li key={item.id ?? item.name} className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-semibold text-foreground">{item.name}</span>
                {item.detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
