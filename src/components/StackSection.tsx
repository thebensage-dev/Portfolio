import { FeatureGrid, FlowSteps, SectionHeading } from "@thebensage-dev/ui";
import ToolList from "@/components/ToolList";
import { stack } from "@/content/site";

/** The pipeline, every piece of the platform and the tools behind it (on /platform). */
export default function StackSection() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="scroll-mt-8 border-y border-border bg-surface-muted/40"
    >
      <div className="mx-auto max-w-5xl px-4 py-section sm:px-6">
        <SectionHeading
          id="stack-title"
          eyebrow="Behind the scenes"
          eyebrowTone="tone-accent"
          title={stack.title}
          intro={stack.intro}
        />

        <FlowSteps
          steps={stack.pipeline}
          label="From a push to your browser"
          className="mt-stack"
        />

        <FeatureGrid features={stack.pieces} className="mt-stack" />

        <ToolList />
      </div>
    </section>
  );
}
