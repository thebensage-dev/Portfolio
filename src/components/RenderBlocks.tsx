import type { ComponentType } from "react";
import type { LayoutBlock } from "@thebensage-dev/cms-client";
import { BLOCKS } from "@/blocks/registry";
import type { BlockContext } from "@/blocks/types";

/** A page's blocks in order, each drawn by its component (src/blocks/registry.ts). The page lays
 *  out the column around them (see FULL_WIDTH). */
export default function RenderBlocks({
  blocks,
  ctx,
}: {
  blocks: LayoutBlock[] | null | undefined;
  ctx: BlockContext;
}) {
  return (blocks ?? []).map((block, i) => {
    const Component = BLOCKS[block.blockType] as
      ComponentType<{ block: LayoutBlock; ctx: BlockContext }> | undefined;
    return Component ? <Component key={block.id ?? i} block={block} ctx={ctx} /> : null;
  });
}
