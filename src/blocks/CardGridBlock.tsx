import { FeatureGrid } from "@thebensage-dev/ui";
import PageSection from "@/components/PageSection";
import { opt, type BlockProps } from "@/blocks/types";
import { features } from "@/lib/blockData";

export default function CardGridBlock({ block }: BlockProps<"cardGrid">) {
  return (
    <PageSection id={block.anchor} title={block.title} intro={opt(block.intro)}>
      <FeatureGrid
        features={features(block.items)}
        columns={block.columns === "2" ? 2 : 3}
        tagsLabel={opt(block.tagsLabel)}
      />
    </PageSection>
  );
}
