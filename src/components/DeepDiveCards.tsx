import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { toneAt, toneClass, iconOrDot } from "@thebensage-dev/ui";
import type { Page } from "@thebensage-dev/cms-client";
import { pageById, type Content } from "@/server/cms";

/** Links to other pages, as cards (each page's card name, summary and icon from the CMS): the
 *  whole card is the link. */
export default function DeepDiveCards({
  pages: refs,
  content,
  readMore,
  className,
}: {
  pages: (number | Page)[];
  content: Content;
  /** The text at the bottom of each card (the block's own, from the CMS). */
  readMore: string;
  className?: string;
}) {
  const pages = refs.map((ref) => pageById(content, ref)).filter((page) => page !== undefined);
  return (
    <ul
      className={clsx(
        "grid gap-5 sm:grid-cols-2",
        pages.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4",
        className,
      )}
    >
      {pages.map((page, i) => {
        const Icon = iconOrDot(page.icon);
        return (
          <li key={page.id} className="flex">
            <Link
              href={page.path}
              className={clsx(
                "card tone-card project-card group flex w-full flex-col gap-3 p-6",
                toneClass(toneAt(i)),
              )}
            >
              <span className="icon-tile">
                <Icon aria-hidden />
              </span>
              <span className="title-card">{page.cardLabel || page.navLabel}</span>
              <span className="text-sm leading-relaxed text-foreground-muted">{page.summary}</span>
              <span className="mt-auto flex items-center gap-1 pt-1 text-sm font-semibold text-primary-ink">
                {readMore}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
