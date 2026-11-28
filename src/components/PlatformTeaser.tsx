import clsx from "clsx";
import { SectionHeading } from "@thebensage-dev/ui";
import type { Block, Page } from "@thebensage-dev/cms-client";
import { sectionClass } from "@/components/GeneralSection";
import ArrowLink from "@/components/ArrowLink";
import DeepDiveCards from "@/components/DeepDiveCards";
import { pageById, type Content } from "@/lib/cms";

/** The homepage's short look at the platform, linking to its pages. */
export default function PlatformTeaser({
  block,
  content,
  page,
}: {
  block: Block<"platformTeaser">;
  content: Content;
  /** The page it's on: its width decides the section's layout. */
  page: Page;
}) {
  const { anchor } = block;
  const overview = pageById(content, block.linkPage);
  return (
    <section
      id={anchor}
      aria-labelledby={`${anchor}-title`}
      className={clsx(
        "scroll-mt-8",
        sectionClass(page, "border-y border-border bg-surface-muted/40"),
      )}
    >
      <div className={clsx(page.width === "full" && "mx-auto max-w-5xl px-4 py-section sm:px-6")}>
        <SectionHeading
          id={`${anchor}-title`}
          eyebrow={block.eyebrow ?? undefined}
          eyebrowTone="tone-accent"
          title={block.title}
          intro={block.intro ?? undefined}
        />

        {block.highlights?.length ? (
          <ul className="mt-stack grid grid-cols-3 gap-4 border-y border-border py-6">
            {block.highlights.map(({ id, value, label }) => (
              <li key={id ?? label} className="text-center sm:text-left">
                <span className="gradient-text block text-3xl font-bold tracking-tight sm:text-4xl">
                  {value}
                </span>
                <span className="mt-1 block text-xs text-foreground-muted sm:text-sm">{label}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <DeepDiveCards
          pages={block.pages}
          content={content}
          readMore={block.readMore}
          className="mt-stack"
        />

        {overview && (
          <ArrowLink href={overview.path} className="mt-content">
            {block.linkLabel}
          </ArrowLink>
        )}
      </div>
    </section>
  );
}
