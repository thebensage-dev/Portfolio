import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading, toneAt, toneClass } from "@thebensage-dev/ui";
import { skillsPage } from "@/content/site";

/** The homepage's short list of the skills around the code, linking to /skills. */
export default function SkillsTeaser() {
  const { teaser, skills } = skillsPage;
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="mx-auto max-w-5xl scroll-mt-8 px-4 pb-section sm:px-6"
    >
      <SectionHeading
        id="skills-title"
        eyebrow={skillsPage.eyebrow}
        eyebrowTone="tone-primary"
        title={teaser.title}
        intro={teaser.intro}
      />
      <ul className="mt-content grid grid-cols-2 gap-4 sm:grid-cols-3">
        {skills.points.map(({ icon: Icon, title }, i) => (
          <li
            key={title}
            className={clsx("card flex items-center gap-3 p-4", toneClass(toneAt(i)))}
          >
            <span className="icon-tile">
              <Icon aria-hidden />
            </span>
            <span className="title-card">{title}</span>
          </li>
        ))}
      </ul>
      <Link
        href={skillsPage.path}
        className="link mt-content inline-flex items-center gap-1 text-sm"
      >
        {teaser.more}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  );
}
