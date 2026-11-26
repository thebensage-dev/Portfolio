import { ArrowDown, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { BrandBlobs } from "@thebensage-dev/ui";
import { platformPages } from "@/content/platform";
import { site } from "@/content/site";

/** The homepage's opening: role, headline (part of it in the brand gradient), intro and the three
 *  calls to action. */
export default function HomeHero() {
  const [headlineStart, headlineEnd] = site.headline.split(site.headlineHighlight);
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="dot-grid absolute inset-0 -z-10" />
      <BrandBlobs />
      <div className="mx-auto max-w-3xl px-4 pt-20 pb-24 text-center sm:px-6 sm:pt-28 sm:pb-32">
        <span aria-hidden className="brand-rule reveal mx-auto" />
        <p className="eyebrow reveal mt-5">{site.role}</p>
        <h1 className="title-display reveal mt-5" style={{ animationDelay: "80ms" }}>
          {headlineEnd === undefined ? (
            site.headline
          ) : (
            <>
              {headlineStart}
              <span className="gradient-text">{site.headlineHighlight}</span>
              {headlineEnd}
            </>
          )}
        </h1>
        <p
          className="reveal mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-foreground-muted"
          style={{ animationDelay: "160ms" }}
        >
          {site.intro}
        </p>
        <div
          className="reveal mt-10 flex flex-wrap justify-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <a href="#projects" className="btn btn-primary">
            View projects
            <ArrowDown className="size-4" aria-hidden />
          </a>
          <a href={`mailto:${site.email}`} className="btn btn-accent">
            Get in touch
            <Mail className="size-4" aria-hidden />
          </a>
          <Link href={platformPages.overview.path} className="btn btn-secondary">
            How it&apos;s built
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
