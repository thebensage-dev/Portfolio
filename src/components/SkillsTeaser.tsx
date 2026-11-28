import clsx from "clsx";
import { SectionHeading, toneAt, toneClass, iconOrDot } from "@thebensage-dev/ui";
import type { Block, Page } from "@thebensage-dev/cms-client";
import { sectionClass } from "@thebensage-dev/cms-client/react";
import ArrowLink from "@/components/ArrowLink";
import { pageById, type Content } from "@/server/cms";

/** A short list of another page's cards (its first card grid), linking to it: on the homepage,
 *  the skills around the code. */
export default function SkillsTeaser({
  block,
  content,
  page,
}: {
  block: Block<"pageTeaser">;
  content: Content;
  /** The page it's on: its width decides the section's layout. */
  page: Page;
}) {
  const target = pageById(content, block.page);
  const grid = target?.layout?.find((item) => item.blockType === "cardGrid");
  const { anchor } = block;
  return (
    <section
      id={anchor}
      aria-labelledby={`${anchor}-title`}
      className={clsx(
        "scroll-mt-8",
        sectionClass(page, "mx-auto max-w-5xl px-4 pb-section sm:px-6"),
      )}
    >
      <SectionHeading
        id={`${anchor}-title`}
        eyebrow={block.eyebrow ?? undefined}
        eyebrowTone="tone-primary"
        title={block.title}
        intro={block.intro ?? undefined}
      />
      {grid && (
        <ul className="mt-content grid grid-cols-2 gap-4 sm:grid-cols-3">
          {(grid.items ?? []).map((item, i) => {
            const Icon = iconOrDot(item.icon);
            return (
              <li
                key={item.id ?? item.title}
                className={clsx("card flex items-center gap-3 p-4", toneClass(toneAt(i)))}
              >
                <span className="icon-tile">
                  <Icon aria-hidden />
                </span>
                <span className="title-card">{item.title}</span>
              </li>
            );
          })}
        </ul>
      )}
      {target && (
        <ArrowLink href={target.path} className="mt-content">
          {block.linkLabel}
        </ArrowLink>
      )}
    </section>
  );
}
