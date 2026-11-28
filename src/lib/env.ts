// Public URLs from the environment, read at request time so one image works on any domain.

export const trimSlash = (url: string) => url.replace(/\/$/, "");

/** This site's public URL (SITE_URL, no trailing slash). Used for link previews, robots.txt and
 *  the sitemap; they fall back to relative URLs when it's unset. */
export function siteUrl(): string | undefined {
  return process.env.SITE_URL ? trimSlash(process.env.SITE_URL) || undefined : undefined;
}

/** Public status page (a read-only Grafana dashboard). Hidden when unset. */
export function statusUrl(): string | undefined {
  return process.env.STATUS_URL || undefined;
}

/** The public URL held in the env var `name` (`SITE_URL` for this site), if it's set. */
export function envUrl(name: string): string | undefined {
  if (name === "SITE_URL") return siteUrl();
  // The CMS's public address: CMS_URL in production, CMS_PUBLIC_URL where that's internal.
  if (name === "CMS_PUBLIC_URL")
    return process.env.CMS_PUBLIC_URL || process.env.CMS_URL || undefined;
  return process.env[name] || undefined;
}
