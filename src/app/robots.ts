import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteUrl } from "@/lib/env";

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection(); // SITE_URL is read at runtime, not baked in at build time.
  const url = siteUrl();
  return {
    // The sign-in routes only redirect to authentik; nothing there to index.
    rules: { userAgent: "*", allow: "/", disallow: "/auth/" },
    ...(url && { sitemap: `${url}/sitemap.xml` }),
  };
}
