import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteUrl } from "@/content/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection(); // SITE_URL is read at runtime, not baked in at build time.
  const url = siteUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(url && { sitemap: `${url}/sitemap.xml` }),
  };
}
