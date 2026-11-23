import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { toneAt, toneClass } from "@thebensage-dev/ui";
import ToolList from "@/components/ToolList";
import { stack } from "@/content/site";

export default function StackSection() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="scroll-mt-8 border-y border-border bg-surface-muted/40"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
        <p className="eyebrow tone-accent">Behind the scenes</p>
        <h2 id="stack-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {stack.title}
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-pretty text-foreground-muted">
          {stack.intro}
        </p>

        <ol aria-label="From a push to your browser" className="mt-10 grid gap-3 md:grid-cols-4">
          {stack.pipeline.map(({ icon: Icon, title, detail }, i) => (
            <li
              key={title}
              className={clsx(
                "reveal-on-scroll flex flex-col items-center gap-3 md:flex-row",
                toneClass(toneAt(i)),
              )}
            >
              <div className="card flex w-full flex-1 items-center gap-3 p-4">
                <span className="icon-tile">
                  <Icon aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="block text-xs text-foreground-muted">{detail}</span>
                </span>
              </div>
              {/* The last step keeps an invisible arrow so all four cards are the same width. */}
              <ArrowRight
                className={clsx(
                  "size-4 shrink-0 rotate-90 text-foreground-muted md:rotate-0",
                  i === stack.pipeline.length - 1 && "max-md:hidden md:invisible",
                )}
                aria-hidden
              />
            </li>
          ))}
        </ol>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stack.pieces.map(({ icon: Icon, title, description, tags }, i) => (
            <li
              key={title}
              className={clsx(
                "card reveal-on-scroll flex flex-col gap-3 p-6",
                toneClass(toneAt(i)),
              )}
            >
              <span className="icon-tile">
                <Icon aria-hidden />
              </span>
              <h3 className="font-semibold tracking-tight">{title}</h3>
              <p className="text-sm leading-relaxed text-foreground-muted">{description}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-1" aria-label="Tools">
                {tags.map((tag) => (
                  <li key={tag} className="tag text-foreground-muted">
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <ToolList />

        <p className="mt-8 text-sm text-foreground-muted">{stack.note}</p>
      </div>
    </section>
  );
}
