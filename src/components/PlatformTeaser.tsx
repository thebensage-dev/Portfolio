import { ArrowRight } from "lucide-react";
import Link from "next/link";
import DeepDiveCards from "@/components/DeepDiveCards";
import { SectionHeading } from "@thebensage-dev/ui";
import { deepDives, platformPages, platformTeaser } from "@/content/platform";

/** The homepage's short look at the platform, linking to its pages. */
export default function PlatformTeaser() {
  const { overview } = platformPages;
  return (
    <section
      id="platform"
      aria-labelledby="platform-title"
      className="scroll-mt-8 border-y border-border bg-surface-muted/40"
    >
      <div className="mx-auto max-w-5xl px-4 py-section sm:px-6">
        <SectionHeading
          id="platform-title"
          eyebrow={platformTeaser.eyebrow}
          eyebrowTone="tone-accent"
          title={platformTeaser.title}
          intro={platformTeaser.intro}
        />

        <ul className="mt-stack grid grid-cols-3 gap-4 border-y border-border py-6">
          {platformTeaser.highlights.map(({ value, label }) => (
            <li key={label} className="text-center sm:text-left">
              <span className="gradient-text block text-3xl font-bold tracking-tight sm:text-4xl">
                {value}
              </span>
              <span className="mt-1 block text-xs text-foreground-muted sm:text-sm">{label}</span>
            </li>
          ))}
        </ul>

        <DeepDiveCards pages={[overview, ...deepDives]} className="mt-stack" />

        <Link
          href={overview.path}
          className="link mt-content inline-flex items-center gap-1 text-sm"
        >
          {platformTeaser.overviewLabel}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
