import AddressCards from "@/components/AddressCards";
import PageSection from "@/components/PageSection";
import type { BlockProps } from "@/blocks/types";

export default function AddressCardsBlock({ block }: BlockProps<"addressCards">) {
  return (
    <PageSection id={block.anchor} title={block.title}>
      <AddressCards items={block.items} />
    </PageSection>
  );
}
