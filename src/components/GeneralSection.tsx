import clsx from "clsx";
import type { Page } from "@thebensage-dev/cms-client";

/**
 * A section's own layout classes on a full-width page (`full`, its centred band), or the gap
 * that separates it inside a wide or narrow page's column, so any section block fits any page.
 */
export const sectionClass = (page: Page, full: string) =>
  page.width === "full" ? full : "mt-subsection";

/**
 * Lays out a general block (text, image, columns…): in the page's column on a wide or narrow
 * page, in a centred column of its own on a full-width page (whose blocks lay themselves out).
 */
export default function GeneralSection({
  page,
  id,
  className,
  children,
}: {
  page: Page;
  id?: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id || undefined}
      className={clsx(
        "scroll-mt-8",
        sectionClass(page, "mx-auto w-full max-w-5xl px-4 py-section sm:px-6"),
        className,
      )}
    >
      {children}
    </section>
  );
}
