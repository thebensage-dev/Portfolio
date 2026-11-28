import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { HeaderProps } from "@/server/headerProps";

/** The header, the page's main content and the footer. The default width suits an inner page; the page passes its own. */
export default function PageShell({
  header,
  id,
  className = "mx-auto w-full max-w-5xl flex-1 px-4 pt-8 pb-section sm:px-6",
  children,
}: {
  header: HeaderProps;
  /** The main element id (the homepage is #top). */
  id?: string;
  /** Classes for `<main>`. */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader {...header} />
      <main id={id} className={className}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
