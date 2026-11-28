import { FeatureGrid, FlowSteps, SectionHeading } from "@thebensage-dev/ui";
import type { Block } from "@thebensage-dev/cms-client";
import ToolList from "@/components/ToolList";
import { features, flowSteps } from "@thebensage-dev/cms-client/react";

/** The pipeline, every piece of the platform and the tools behind it (full width, on /platform). */
export default function StackSection({ block }: { block: Block<"stack"> }) {
  const { anchor } = block;
  return (
    <section
      id={anchor}
      aria-labelledby={`${anchor}-title`}
      className="scroll-mt-8 border-y border-border bg-surface-muted/40"
    >
      <div className="mx-auto max-w-5xl px-4 py-section sm:px-6">
        <SectionHeading
          id={`${anchor}-title`}
          eyebrow={block.eyebrow ?? undefined}
          eyebrowTone="tone-accent"
          title={block.title}
          intro={block.intro ?? undefined}
        />

        <FlowSteps
          steps={flowSteps(block.pipeline)}
          label={block.pipelineLabel}
          className="mt-stack"
        />

        <FeatureGrid features={features(block.pieces)} className="mt-stack" />

        <ToolList title={block.toolsTitle} groups={block.toolGroups ?? []} />
      </div>
    </section>
  );
}
