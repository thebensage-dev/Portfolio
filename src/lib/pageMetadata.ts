import type { Metadata } from "next";
import { alt, contentType, size } from "@/app/opengraph-image";
import { site } from "@/content/site";

/** Page titles read "<page> · TheBensage"; the homepage is just the site name. */
export const titleTemplate = `%s · ${site.name}`;

/** The link-preview fields every page shares (the root layout's defaults use them too). */
export const sharedOpenGraph = { type: "website", siteName: site.name, locale: "en_GB" } as const;

/**
 * A page's metadata: its title, description and canonical, repeated as its own link preview
 * (og:title, og:description, og:url and the Twitter card), so a shared inner page doesn't show
 * the homepage's. Paths are relative; the layout's metadataBase (SITE_URL) makes them absolute.
 * A page's own openGraph/twitter replaces the layout's, file-based preview image included, so the
 * image (app/opengraph-image.tsx and app/twitter-image.tsx) is named here again.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Omit on the homepage, which uses the site name. */
  title?: string;
  /** Omit to keep the site's headline. */
  description?: string;
  path: string;
}): Metadata {
  const fullTitle = title ? titleTemplate.replace("%s", title) : site.name;
  const previewDescription = description ?? site.headline;
  const image = (url: string) => ({ url, alt, type: contentType, ...size });
  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: { canonical: path },
    openGraph: {
      ...sharedOpenGraph,
      title: fullTitle,
      description: previewDescription,
      url: path,
      images: [image("/opengraph-image")],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: previewDescription,
      images: [image("/twitter-image")],
    },
  };
}
