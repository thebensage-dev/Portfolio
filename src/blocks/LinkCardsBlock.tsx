import { NoteCard, toneAt, toneClass } from "@thebensage-dev/ui";
import ArrowLink from "@/components/ArrowLink";
import PageSection from "@/components/PageSection";
import { opt, type BlockProps } from "@/blocks/types";
import { resolveLink } from "@/lib/cms";

/** Note cards, each with a link (left out when it can't go anywhere). */
export default function LinkCardsBlock({ block, ctx }: BlockProps<"linkCards">) {
  return (
    <PageSection id={block.anchor} title={block.title} intro={opt(block.intro)}>
      <ul className="grid gap-5 md:grid-cols-3">
        {block.items.map((item, i) => {
          const link = resolveLink(ctx.content, item.link, ctx.links);
          return (
            <li key={item.id ?? item.title} className="flex">
              <NoteCard
                title={item.title}
                body={item.body}
                tone={toneClass(toneAt(i))}
                className="w-full"
              >
                {link && <ArrowLink href={link.href}>{item.linkLabel}</ArrowLink>}
              </NoteCard>
            </li>
          );
        })}
      </ul>
    </PageSection>
  );
}
