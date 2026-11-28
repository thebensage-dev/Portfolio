import { NoteCard } from "@thebensage-dev/ui";
import StepsSection from "@/components/StepsSection";
import TryAccessCard from "@/components/TryAccessCard";
import { opt, type BlockContext, type BlockProps } from "@/blocks/types";
import { timelineSteps } from "@/lib/blockData";
import { requestAccessUrl } from "@/server/auth";

/** What sits under the heading: a note, or the "Try it" sign-in card. */
function Aside({ block, ctx }: BlockProps<"timeline">) {
  if (block.aside === "note" && block.note?.title) {
    return <NoteCard title={block.note.title} body={block.note.body ?? ""} />;
  }
  if (block.aside === "tryAccess" && block.tryAccess) {
    return <TryAccess block={block} ctx={ctx} />;
  }
  return null;
}

function TryAccess({ block, ctx }: { block: BlockProps<"timeline">["block"]; ctx: BlockContext }) {
  return (
    <TryAccessCard
      text={block.tryAccess!}
      signedIn={ctx.header.user !== null}
      requestAccessHref={requestAccessUrl() ?? undefined}
      signInHref={ctx.header.signInHref}
    />
  );
}

export default function TimelineBlock({ block, ctx }: BlockProps<"timeline">) {
  return (
    <StepsSection
      id={block.anchor}
      title={block.title}
      intro={opt(block.intro)}
      steps={timelineSteps(block.steps)}
    >
      {block.aside && block.aside !== "none" ? <Aside block={block} ctx={ctx} /> : null}
    </StepsSection>
  );
}
