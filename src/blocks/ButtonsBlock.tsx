import clsx from "clsx";
import CmsButtons from "@/components/CmsButtons";
import GeneralSection from "@/components/GeneralSection";
import type { BlockProps } from "@/blocks/types";

/** A row of buttons on their own. */
export default function ButtonsBlock({ block, ctx }: BlockProps<"buttons">) {
  return (
    <GeneralSection page={ctx.page}>
      <div className={clsx("flex flex-wrap gap-3", block.align === "center" && "justify-center")}>
        <CmsButtons buttons={block.actions} content={ctx.content} context={ctx.links} />
      </div>
    </GeneralSection>
  );
}
