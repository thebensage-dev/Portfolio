import type { Metadata } from "next";
import { contentType, size } from "@/app/opengraph-image";
import type { Settings } from "@/server/cms";

/** Page titles read "<page> · <site name>"; the homepage is just the site name. */
export const titleTemplate = (settings: Settings) => `%s · ${settings.name}`;

/** The link-preview fields every page shares (the root layout's defaults use them too). */
export const sharedOpenGraph = (settings: Settings) =>
  ({ type: "website", siteName: settings.name, locale: "en_GB" }) as const;

/** The preview image's alt text. */
export const previewAlt = (settings: Settings) => `${settings.name}: ${settings.headline}`;

/**
 * A page's metadata: its title, description and canonical, repeated as its own link preview
 * (og:title, og:description, og:url and the Twitter card), so a shared inner page doesn't show
 * the homepage's. Paths are relative; the layout's metadataBase (SITE_URL) makes them absolute.
 * A page's own openGraph/twitter replaces the layout's, file-based preview image included, so the
 * image (app/opengraph-image.tsx and app/twitter-image.tsx) is named here again.
 */
export function pageMetadata(
  settings: Settings,
  {
    title,
    description,
    path,
  }: {
    /** Omit on the homepage, which uses the site name. */
    title?: string;
    /** Omit to keep the site's headline. */
    description?: string;
    path: string;
  },
): Metadata {
  const fullTitle = title ? titleTemplate(settings).replace("%s", title) : settings.name;
  const previewDescription = description ?? settings.headline;
  const image = (url: string) => ({ url, alt: previewAlt(settings), type: contentType, ...size });
  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: { canonical: path },
    openGraph: {
      ...sharedOpenGraph(settings),
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
