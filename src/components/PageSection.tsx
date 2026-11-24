import { SectionHeading } from "@thebensage-dev/ui";

/** A titled section of an inner page: the heading (see SectionHeading), then its content. */
export default function PageSection({
  id,
  title,
  intro,
  className = "mt-16",
  children,
}: {
  /** Prefix for the heading's id (`<id>-title`). */
  id: string;
  title: string;
  intro?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className={className}>
      <SectionHeading id={`${id}-title`} title={title} intro={intro} />
      <div className="mt-8">{children}</div>
    </section>
  );
}
