import { mediaImage } from "@thebensage-dev/cms-client";
import { Figure } from "@thebensage-dev/ui";
import GeneralSection from "@/components/GeneralSection";
import type { BlockProps } from "@/blocks/types";
import { cmsPublicUrl } from "@/lib/cms";

/** One uploaded image with its caption. Nothing while the image is missing. */
export default function ImageBlock({ block, ctx }: BlockProps<"image">) {
  const image = mediaImage(ctx.content, block.image, cmsPublicUrl());
  if (!image) return null;
  return (
    <GeneralSection page={ctx.page}>
      <Figure {...image} caption={block.caption} small={block.size === "small"} />
    </GeneralSection>
  );
}
