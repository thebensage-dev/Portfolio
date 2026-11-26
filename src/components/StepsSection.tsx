import { SectionHeading, StepTimeline, type TimelineStep } from "@thebensage-dev/ui";

/** A heading (with anything under it, kept in view on wide screens) beside a StepTimeline. */
export default function StepsSection({
  id,
  title,
  intro,
  steps,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  steps: TimelineStep[];
  /** Shown under the heading, e.g. a call to action. */
  children?: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="mt-subsection grid gap-stack lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
    >
      <div className="lg:sticky lg:top-8 lg:self-start">
        <SectionHeading id={`${id}-title`} title={title} intro={intro} />
        {children && <div className="mt-content">{children}</div>}
      </div>
      <StepTimeline steps={steps} label={title} />
    </section>
  );
}
