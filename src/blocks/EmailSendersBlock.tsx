import { SectionHeading, toneAt, iconOrDot } from "@thebensage-dev/ui";
import EmailPreview from "@/components/EmailPreview";
import SenderCard from "@/components/SenderCard";
import type { BlockProps } from "@/blocks/types";

/** What sends email, beside a picture of one of the emails. */
export default function EmailSendersBlock({ block, ctx }: BlockProps<"emailSenders">) {
  return (
    <section
      aria-labelledby={`${block.anchor}-title`}
      className="mt-subsection grid items-start gap-stack lg:grid-cols-2"
    >
      <div>
        <SectionHeading id={`${block.anchor}-title`} title={block.title} />
        <div className="mt-content grid gap-5">
          {block.senders.map((sender, i) => (
            <SenderCard
              key={sender.id ?? sender.title}
              icon={iconOrDot(sender.icon)}
              title={sender.title}
              description={sender.description}
              items={sender.items ?? []}
              tone={toneAt(i)}
            />
          ))}
        </div>
      </div>
      <EmailPreview preview={block.preview} siteName={ctx.content.settings.name} />
    </section>
  );
}
