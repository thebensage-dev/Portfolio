import type { Metadata } from "next";
import { cookies, draftMode } from "next/headers";
import { connection } from "next/server";
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
import { PreviewBanner } from "@thebensage-dev/ui/next";
import { fontVariables } from "@/app/fonts";
import RefreshOnSave from "@/components/RefreshOnSave";
import { cmsPublicUrl, getContent, resolveLink } from "@/lib/cms";
import { siteUrl } from "@/lib/env";
import { sharedOpenGraph, titleTemplate } from "@/lib/pageMetadata";
import "./globals.css";

// A function rather than a constant, so SITE_URL and the CMS are read at runtime and one image
// works anywhere.
export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const url = siteUrl();
  const { settings } = await getContent();
  const { name, headline } = settings;
  return {
    metadataBase: url ? new URL(url) : undefined,
    title: { default: name, template: titleTemplate(settings) },
    description: headline,
    icons: { icon: { url: "/icon.svg", type: "image/svg+xml" } },
    // Defaults only: each page sets its own preview title, description and og:url through
    // pageMetadata(). The preview image comes from opengraph-image.tsx / twitter-image.tsx.
    openGraph: { ...sharedOpenGraph(settings), title: name, description: headline },
    twitter: { card: "summary_large_image", title: name, description: headline },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read on the server, so the first paint already has the right theme and colours.
  const cookieStore = await cookies();
  const theme = readTheme(cookieStore.get(THEME_COOKIE)?.value);
  const colours = readColours(cookieStore.get(COLOURS_COOKIE)?.value);
  // The cookie notice links the privacy notice's cookies section (the footer's "Cookies" link).
  const content = await getContent();
  const cookiesRow = content.settings.footer.legal?.find((row) => row.link.anchor === "cookies");
  const cookiesHref = resolveLink(content, cookiesRow?.link)?.href;
  const cookieText = content.settings.interface.cookies;
  const previewing = (await draftMode()).isEnabled;
  const cmsUrl = cmsPublicUrl();

  return (
    <html lang="en" className={clsx(fontVariables, themeClass(theme))} {...colourAttrs(colours)}>
      <body className="flex min-h-screen flex-col">
        {previewing && cmsUrl && <RefreshOnSave cmsUrl={cmsUrl} />}
        {previewing && (
          <PreviewBanner
            label={content.settings.preview.label}
            exit={content.settings.preview.exit}
          />
        )}
        {children}
        <CookieNotice
          policyHref={cookiesHref}
          labels={{
            region: cookieText.region,
            title: cookieText.title,
            dismiss: cookieText.dismiss,
            details: cookieText.details,
          }}
        >
          {cookieText.body}
        </CookieNotice>
      </body>
    </html>
  );
}
