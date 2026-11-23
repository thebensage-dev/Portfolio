import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteUrl } from "@/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection(); // SITE_URL is read at runtime, not baked in at build time.
  const url = siteUrl();
  if (!url) return [];
  return ["", "/api-reference", "/privacy", "/terms"].map((path) => ({ url: url + path }));
}
