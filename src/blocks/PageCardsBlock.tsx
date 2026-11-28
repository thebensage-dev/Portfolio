import DeepDiveCards from "@/components/DeepDiveCards";
import PageSection from "@/components/PageSection";
import { opt, type BlockProps } from "@/blocks/types";

export default function PageCardsBlock({ block, ctx }: BlockProps<"pageCards">) {
  return (
    <PageSection id={block.anchor} title={block.title} intro={opt(block.intro)}>
      <DeepDiveCards pages={block.pages} content={ctx.content} readMore={block.readMore} />
    </PageSection>
  );
}
