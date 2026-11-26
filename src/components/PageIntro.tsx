import { ChevronRight } from "lucide-react";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { siteUrl } from "@/content/site";

export type Crumb = { label: string; path: string };

/**
 * The top of an inner page: breadcrumbs (also as schema.org BreadcrumbList, for search results),
 * the brand rule, eyebrow, the page's one h1 and its intro. `crumbs` ends with the page itself.
 */
export default function PageIntro({
  crumbs,
  eyebrow,
  title,
  intro,
  children,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  intro: string;
  /** Buttons under the intro. */
  children?: React.ReactNode;
}) {
  const trail = [{ label: "Home", path: "/" }, ...crumbs];
  const url = siteUrl();

  return (
    <div className="max-w-3xl">
      {url && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: trail.map((crumb, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: crumb.label,
              item: url + crumb.path,
            })),
          }}
        />
      )}
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-foreground-muted">
          {trail.map((crumb, i) => (
            <li key={crumb.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
              {i === trail.length - 1 ? (
                <span aria-current="page" className="text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.path} className="hover:text-foreground">
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <span aria-hidden className="brand-rule reveal mt-8" />
      <p className="eyebrow tone-secondary reveal mt-4">{eyebrow}</p>
      <h1 className="title-page reveal mt-eyebrow">{title}</h1>
      <p className="reveal mt-6 text-lg leading-relaxed text-pretty text-foreground-muted">
        {intro}
      </p>
      {children && <div className="reveal mt-content flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}
