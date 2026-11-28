import PlatformTeaser from "@/components/PlatformTeaser";
import type { BlockProps } from "@/blocks/types";

export default function PlatformTeaserBlock({ block, ctx }: BlockProps<"platformTeaser">) {
  return <PlatformTeaser block={block} content={ctx.content} page={ctx.page} />;
}
