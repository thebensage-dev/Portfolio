import "server-only";
import { draftMode } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { cache } from "react";
import {
  createCmsClient,
  findPage,
  pageById,
  projectById,
  resolveLink as resolveCmsLink,
  type CmsLink,
  type Project,
  type ResolvedLink,
  type SiteContent,
} from "@thebensage-dev/cms-client";
import snapshot from "@/content/cms-snapshot.json";
import { envUrl, statusUrl } from "@/lib/env";
import { requestAccessUrl } from "@/server/auth";

// Every word on the site comes from the CMS (Payload, the Cms repo): pages and their blocks, the
// projects and the site's settings (header, footer, contact details). The client keeps the site's
// content in memory for a minute, serves the last good copy while the CMS is down, and falls back
// on src/content/cms-snapshot.json (`npm run content:snapshot`) when it has never reached the CMS.
// In draft mode (the CMS's Preview button, src/app/preview/route.ts) it reads the drafts instead.

export type Content = SiteContent<"portfolio">;
export type Settings = Content["settings"];
export type { CmsLink, ResolvedLink };

const client = createCmsClient({
  // Where this server reaches the CMS (inside Docker: http://cms:3000).
  baseUrl: process.env.CMS_URL || "http://localhost:3003",
  site: "portfolio",
  snapshot: snapshot as unknown as Content,
  previewSecret: process.env.PREVIEW_SECRET || undefined,
  // Next's own signals (such as "render this per request") aren't the CMS being down.
  rethrow: unstable_rethrow,
});

/** The site's content, read once per request: the drafts while previewing, else published. */
/** Where the browser reaches the CMS: images load from there, and its Live Preview frames this
 *  site. CMS_PUBLIC_URL when the server's own address (CMS_URL) isn't public, as in Docker. */
export const cmsPublicUrl = () =>
  process.env.CMS_PUBLIC_URL || process.env.CMS_URL || "http://localhost:3003";

export const getContent = cache(async (): Promise<Content> => {
  const draft = (await draftMode()).isEnabled && Boolean(process.env.PREVIEW_SECRET);
  return client.content({ draft });
});

export { findPage, pageById, projectById };

/** A project's public URL: its env var at request time, or its local-dev fallback. */
export function projectUrl(project: Project): string {
  return envUrl(project.address) ?? project.fallbackUrl;
}

/** Where a project's links on this site go: its page here if it has one, else the live app. */
export function projectHref(content: Content, project: Project): string {
  return pageById(content, project.page)?.path ?? projectUrl(project);
}

/** What a link needs from the page around it: the OpenAPI document's URL, when it loaded. */
export type LinkContext = { apiSpecUrl?: string };

/**
 * A CMS link's address on this site, or null when it can't go anywhere right now (sign-in or the
 * status page not set up, the API down, a deleted page), and the button or link is left out.
 */
export function resolveLink(
  content: Content,
  link: CmsLink | null | undefined,
  context: LinkContext = {},
): ResolvedLink | null {
  return resolveCmsLink(content, link, {
    projectUrl,
    requestAccess: requestAccessUrl,
    apiSpec: () => context.apiSpecUrl,
    status: statusUrl,
  });
}
