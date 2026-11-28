import { RichText } from "@thebensage-dev/ui";
import { opt, type BlockProps } from "@/blocks/types";

/** A heading and its rich text: the privacy notice's and terms' sections. */
export default function TextSectionBlock({ block }: BlockProps<"textSection">) {
  return (
    <section id={opt(block.anchor)} className="mt-10 scroll-mt-8">
      <h2 className="text-xl font-semibold tracking-tight">{block.heading}</h2>
      <RichText
        data={block.body}
        className="mt-3 space-y-4 leading-relaxed text-foreground-muted"
      />
    </section>
  );
}
