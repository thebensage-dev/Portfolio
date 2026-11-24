import type { Metadata } from "next";
import { cookies } from "next/headers";
import clsx from "clsx";
import {
  colourAttrs,
  COLOURS_COOKIE,
  CookieNotice,
  readColours,
  readTheme,
  THEME_COOKIE,
  themeClass,
} from "@thebensage-dev/ui";
import { fontVariables } from "@/app/fonts";
import { site, siteUrl } from "@/content/site";
import { sharedOpenGraph, titleTemplate } from "@/lib/pageMetadata";
import "./globals.css";

// A function rather than a constant, so SITE_URL is read at runtime and one image works anywhere.
export function generateMetadata(): Metadata {
  const url = siteUrl();
  return {
    metadataBase: url ? new URL(url) : undefined,
    title: { default: site.name, template: titleTemplate },
    description: site.headline,
    icons: { icon: { url: "/icon.svg", type: "image/svg+xml" } },
    // Defaults only: each page sets its own preview title, description and og:url through
    // pageMetadata(). The preview image comes from opengraph-image.tsx / twitter-image.tsx.
    openGraph: { ...sharedOpenGraph, title: site.name, description: site.headline },
    twitter: { card: "summary_large_image", title: site.name, description: site.headline },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read on the server, so the first paint already has the right theme and colours.
  const cookieStore = await cookies();
  const theme = readTheme(cookieStore.get(THEME_COOKIE)?.value);
  const colours = readColours(cookieStore.get(COLOURS_COOKIE)?.value);

  return (
    <html lang="en" className={clsx(fontVariables, themeClass(theme))} {...colourAttrs(colours)}>
      <body className="flex min-h-screen flex-col">
        {children}
        <CookieNotice policyHref="/privacy#cookies" />
      </body>
    </html>
  );
}
