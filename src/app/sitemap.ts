import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getContent } from "@/server/cms";
import { siteUrl } from "@/lib/env";

// Every published page in the CMS that is marked "List in the sitemap".
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection(); // SITE_URL and the content are read at runtime, not baked in at build time.
  const url = siteUrl();
  if (!url) return [];
  const { pages } = await getContent();
  return pages
    .filter((page) => page.inSitemap !== false)
    .map((page) => ({ url: url + (page.path === "/" ? "" : page.path) }));
}
