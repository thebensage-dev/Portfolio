import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { toneAt, toneClass } from "@thebensage-dev/ui";
import type { PlatformPage } from "@/content/platform";

/** Links to the platform pages, as cards: the whole card is the link. */
export default function DeepDiveCards({
  pages,
  className,
}: {
  pages: PlatformPage[];
  className?: string;
}) {
  return (
    <ul
      className={clsx(
        "grid gap-5 sm:grid-cols-2",
        pages.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4",
        className,
      )}
    >
      {pages.map(({ path, navLabel, description, icon: Icon }, i) => (
        <li key={path} className="flex">
          <Link
            href={path}
            className={clsx(
              "card tone-card project-card group flex w-full flex-col gap-3 p-6",
              toneClass(toneAt(i)),
            )}
          >
            <span className="icon-tile">
              <Icon aria-hidden />
            </span>
            <span className="font-semibold tracking-tight">{navLabel}</span>
            <span className="text-sm leading-relaxed text-foreground-muted">{description}</span>
            <span className="mt-auto flex items-center gap-1 pt-1 text-sm font-semibold text-primary-ink">
              Read more
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
