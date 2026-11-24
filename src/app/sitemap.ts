import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteUrl } from "@/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection(); // SITE_URL is read at runtime, not baked in at build time.
  const url = siteUrl();
  if (!url) return [];
  return PAGES.map((path) => ({ url: url + path }));
}

// Every public page. Keep in step with src/app: no sign-in routes, redirects or 404s.
const PAGES = [
  "",
  "/platform",
  "/platform/sign-in",
  "/platform/email",
  "/platform/how-i-work",
  "/api-reference",
  "/privacy",
  "/terms",
];
