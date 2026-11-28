import Link from "next/link";
import { PageIntro } from "@thebensage-dev/ui";
import CmsButtons from "@/components/CmsButtons";
import { crumbsFor } from "@thebensage-dev/cms-client";
import { siteUrl } from "@/lib/env";
import type { BlockProps } from "@/blocks/types";

/** The top of an inner page: breadcrumbs (also as structured data), eyebrow, heading, intro and
 *  buttons (the shared PageIntro). */
export default function PageHeaderBlock({ block, ctx }: BlockProps<"pageHeader">) {
  return (
    <PageIntro
      crumbs={block.breadcrumbs ? crumbsFor(ctx.content, ctx.page) : []}
      breadcrumbsLabel={block.breadcrumbsLabel || undefined}
      eyebrow={block.eyebrow}
      title={block.heading || ctx.page.title}
      intro={block.intro}
      siteUrl={siteUrl()}
      linkComponent={Link}
    >
      {block.actions?.length ? (
        <CmsButtons buttons={block.actions} content={ctx.content} context={ctx.links} />
      ) : null}
    </PageIntro>
  );
}
