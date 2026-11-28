import AccessTable from "@/components/AccessTable";
import PageSection from "@/components/PageSection";
import { opt, type BlockProps } from "@/blocks/types";

export default function AccessTableBlock({ block }: BlockProps<"accessTable">) {
  return (
    <PageSection id={block.anchor} title={block.title} intro={opt(block.intro)}>
      <AccessTable columns={block.columns} rows={block.rows} />
    </PageSection>
  );
}
