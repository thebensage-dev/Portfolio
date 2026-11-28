import { BrandBlobs } from "@thebensage-dev/ui";
import type { Block } from "@thebensage-dev/cms-client";
import CmsButtons from "@/components/CmsButtons";
import type { Content } from "@/lib/cms";

/** The homepage's opening: role, headline (part of it in the brand gradient), intro and the calls
 *  to action. */
export default function HomeHero({
  block,
  content,
}: {
  block: Block<"homeHero">;
  content: Content;
}) {
  const { role, headline, highlight, intro, actions } = block;
  const [headlineStart, headlineEnd] = highlight ? headline.split(highlight) : [headline];
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="dot-grid absolute inset-0 -z-10" />
      <BrandBlobs />
      <div className="mx-auto max-w-3xl px-4 pt-20 pb-24 text-center sm:px-6 sm:pt-28 sm:pb-32">
        <span aria-hidden className="brand-rule reveal mx-auto" />
        <p className="eyebrow reveal mt-5">{role}</p>
        <h1 className="title-display reveal mt-5" style={{ animationDelay: "80ms" }}>
          {headlineEnd === undefined ? (
            headline
          ) : (
            <>
              {headlineStart}
              <span className="gradient-text">{highlight}</span>
              {headlineEnd}
            </>
          )}
        </h1>
        <p
          className="reveal mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-foreground-muted"
          style={{ animationDelay: "160ms" }}
        >
          {intro}
        </p>
        <div
          className="reveal mt-10 flex flex-wrap justify-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <CmsButtons buttons={actions} content={content} />
        </div>
      </div>
    </section>
  );
}
