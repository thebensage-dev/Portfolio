import PageSection from "@/components/PageSection";
import PlatformMap from "@/components/PlatformMap";
import { opt, type BlockProps } from "@/blocks/types";

export default function PlatformMapBlock({ block, ctx }: BlockProps<"platformMap">) {
  return (
    <PageSection id={block.anchor} title={block.title} intro={opt(block.intro)}>
      <PlatformMap apps={block.apps} content={ctx.content} />
    </PageSection>
  );
}
