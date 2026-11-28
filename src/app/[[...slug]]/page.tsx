import clsx from "clsx";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { COLOURS_COOKIE, JsonLd, readColours } from "@thebensage-dev/ui";
import type { LayoutBlock, Page } from "@thebensage-dev/cms-client";
import PageShell from "@/components/PageShell";
import { FULL_WIDTH } from "@/blocks/registry";
import type { BlockContext } from "@/blocks/types";
import RenderBlocks from "@/components/RenderBlocks";
import { fetchApiSpec } from "@/lib/apiSpec";
import { findPage, getContent, projectById, type Content } from "@/lib/cms";
import { siteUrl } from "@/lib/env";
import { pageMetadata } from "@/lib/pageMetadata";
import { headerProps } from "@/server/headerProps";

// Every page comes from the CMS: its path picks the page, its layout lists the blocks (a page
// header or legal header block usually first), and its width lays out the column. A page added
// in the CMS appears here (and in the sitemap) with no code change.

type Props = { params: Promise<{ slug?: string[] }> };

const pathOf = async ({ params }: Props) => "/" + ((await params).slug ?? []).join("/");

/** The centred column of a wide or narrow page. */
const COLUMN: Record<Exclude<Page["width"], "full">, string> = {
  wide: "max-w-5xl",
  narrow: "max-w-3xl",
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  await connection(); // The content and SITE_URL are read per request.
  const path = await pathOf(props);
  const content = await getContent();
  const page = findPage(content, path);
  // No page: the page itself calls notFound(), which renders the 404 on the server. (Thrown here,
  // in the streamed metadata, it would only be shown by the browser.)
  if (!page) return {};
  return pageMetadata(content.settings, {
    title: path === "/" ? undefined : page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    path,
  });
}

/** The OpenAPI document, for a page with an API reference block. */
async function apiSpecFor(content: Content, page: Page) {
  const block = page.layout?.find((item) => item.blockType === "apiReference");
  const project = block && projectById(content, block.project);
  return project ? fetchApiSpec(project, block.specPath) : null;
}

/** Splits the blocks into runs: ordinary blocks share the centred column, full-width ones don't. */
function runs(blocks: LayoutBlock[]) {
  const out: { full: boolean; blocks: LayoutBlock[] }[] = [];
  for (const block of blocks) {
    const full = FULL_WIDTH.has(block.blockType);
    const last = out.at(-1);
    if (last && !last.full && !full) last.blocks.push(block);
    else out.push({ full, blocks: [block] });
  }
  return out;
}

/** Tells search engines the site name to show in results (schema.org WebSite), on the homepage. */
function WebSiteData({ content }: { content: Content }) {
  const url = siteUrl();
  if (!url) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: content.settings.name,
        url: url + "/",
        description: content.settings.headline,
      }}
    />
  );
}

export default async function CmsPage(props: Props) {
  // Render per request, so project URLs and sign-in come from the runtime env.
  await connection();
  const path = await pathOf(props);
  const content = await getContent();
  const page = findPage(content, path);
  if (!page) notFound();
  // Signed in through authentik (often already, from another app: see src/proxy.ts).
  const header = await headerProps(path);
  const apiSpec = await apiSpecFor(content, page);
  const ctx: BlockContext = {
    content,
    page,
    header,
    path,
    title: page.title,
    colours: readColours((await cookies()).get(COLOURS_COOKIE)?.value),
    apiSpec,
    links: { apiSpecUrl: apiSpec?.url },
  };
  const blocks = page.layout ?? [];
  const dotGrid = page.backdrop === "dotGrid" && (
    <div aria-hidden className="dot-grid absolute inset-x-0 top-0 h-[36rem]" />
  );
  const home = path === "/" && <WebSiteData content={content} />;

  // Full width: the blocks lay themselves out (the homepage).
  if (page.width === "full") {
    return (
      <>
        {home}
        <PageShell header={header} className={clsx("flex-1", dotGrid && "relative")} id="top">
          {dotGrid}
          <RenderBlocks blocks={blocks} ctx={ctx} />
        </PageShell>
      </>
    );
  }

  const column = `mx-auto w-full ${COLUMN[page.width]} px-4 pt-8 pb-section sm:px-6`;
  const parts = runs(blocks);

  // Only centred blocks: one column.
  if (!parts.some((part) => part.full)) {
    return (
      <>
        {home}
        <PageShell header={header} className={clsx(column, "flex-1", dotGrid && "relative")}>
          {dotGrid}
          <RenderBlocks blocks={blocks} ctx={ctx} />
        </PageShell>
      </>
    );
  }

  // With a full-width block (the platform page's stack): the column stops around it.
  return (
    <>
      {home}
      <PageShell header={header} className={clsx("flex-1", dotGrid && "relative")}>
        {dotGrid}
        {parts.map((part, i) =>
          part.full ? (
            <RenderBlocks key={i} blocks={part.blocks} ctx={ctx} />
          ) : (
            <div key={i} className={column}>
              <RenderBlocks blocks={part.blocks} ctx={ctx} />
            </div>
          ),
        )}
      </PageShell>
    </>
  );
}
