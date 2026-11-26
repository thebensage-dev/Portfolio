import { connection } from "next/server";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { LegalBlock, LegalDoc } from "@/content/legal";
import { headerProps } from "@/server/headerProps";

/** Turns [text](https://…) into links and `name` into code; everything else stays plain text. */
function renderText(text: string) {
  return text.split(/(\[[^\]]+\]\(https:\/\/[^)]+\)|`[^`]+`)/).map((part, i) => {
    const link = /^\[([^\]]+)\]\((https:\/\/[^)]+)\)$/.exec(part);
    if (link) {
      return (
        <a key={i} href={link[2]} className="link">
          {link[1]}
        </a>
      );
    }
    if (/^`[^`]+`$/.test(part)) {
      return (
        <code key={i} className="code-badge">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/** Renders "**Lead:** rest" with the lead in bold. */
function renderItem(text: string) {
  const match = /^\*\*(.+?)\*\*\s*(.*)$/.exec(text);
  if (!match) return renderText(text);
  return (
    <>
      <strong className="font-semibold text-foreground">{match[1]}</strong> {renderText(match[2])}
    </>
  );
}

function renderBlock(block: LegalBlock, key: number) {
  if (typeof block === "string") return <p key={key}>{renderText(block)}</p>;
  return (
    <ul key={key} className="list-disc space-y-2 pl-5">
      {block.map((item) => (
        <li key={item}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

/** The privacy notice and terms pages share this plain layout. */
export default async function LegalPage({
  doc,
  path,
}: {
  doc: LegalDoc;
  /** The page's own path, for the header's sign-in link back to it. */
  path: string;
}) {
  // Per request, like the home page, so the footer's STATUS_URL comes from the runtime env.
  await connection();
  const header = await headerProps(path);

  return (
    <>
      <SiteHeader {...header} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-8 pb-section sm:px-6">
        <span aria-hidden className="brand-rule" />
        <p className="eyebrow tone-primary mt-4">Last updated {doc.updated}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{doc.title}</h1>
        <p className="mt-6 leading-relaxed text-foreground-muted">{doc.intro}</p>
        {doc.sections.map((section) => (
          <section key={section.heading} id={section.id} className="mt-10 scroll-mt-8">
            <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
            <div className="mt-3 space-y-4 leading-relaxed text-foreground-muted">
              {section.body.map(renderBlock)}
            </div>
          </section>
        ))}
      </main>

      <SiteFooter />
    </>
  );
}
