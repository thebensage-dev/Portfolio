import { toneAt, SectionHeading } from "@thebensage-dev/ui";
import ProjectCard from "@/components/ProjectCard";
import { comingNext, projectHref, projects } from "@/content/site";

/** Every live project, then what's coming next. Render per request (project URLs come from env). */
export default function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="mx-auto max-w-5xl scroll-mt-8 px-4 py-section sm:px-6"
    >
      <SectionHeading
        id="projects-title"
        eyebrow="Projects"
        eyebrowTone="tone-secondary"
        title="Selected work"
      />
      <div className="mt-content grid gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            href={projectHref(project)}
            tone={toneAt(i)}
          />
        ))}
        <div className="flex flex-col justify-center gap-3 rounded-2xl border border-dashed border-border-strong p-6 text-sm text-foreground-muted">
          <p className="eyebrow tone-accent">{comingNext.title}</p>
          <ul className="grid gap-2">
            {comingNext.items.map((item) => (
              <li key={item.name} className="flex flex-wrap items-baseline gap-x-2">
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
