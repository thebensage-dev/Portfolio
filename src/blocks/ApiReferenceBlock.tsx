import ApiReferenceSection from "@/components/ApiReferenceSection";
import type { BlockProps } from "@/blocks/types";

export default function ApiReferenceBlock({ block, ctx }: BlockProps<"apiReference">) {
  return <ApiReferenceSection block={block} spec={ctx.apiSpec} label={ctx.title} />;
}
