import SkillsTeaser from "@/components/SkillsTeaser";
import type { BlockProps } from "@/blocks/types";

export default function PageTeaserBlock({ block, ctx }: BlockProps<"pageTeaser">) {
  return <SkillsTeaser block={block} content={ctx.content} page={ctx.page} />;
}
