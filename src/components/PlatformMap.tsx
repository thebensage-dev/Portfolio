import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { toneAt, toneClass } from "@thebensage-dev/ui";
import type { Block } from "@thebensage-dev/cms-client";
import { pageById, type Content } from "@/lib/cms";
import { envUrl } from "@/lib/env";

/** Each subdomain and what runs there; the public ones link to the live app, or to their page
 *  here. Render per request. */
export default function PlatformMap({
  apps,
  content,
}: {
  apps: Block<"platformMap">["apps"];
  content: Content;
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {apps.map(({ id, host, name, detail, address, page }, i) => {
        const url =
          address === "page"
            ? pageById(content, page)?.path
            : address && address !== "none"
              ? envUrl(address)
              : undefined;
        const body = (
          <>
            <span className="tone-dot mt-1.5 shrink-0" aria-hidden />
            <span className="min-w-0">
              <span className="block font-mono text-sm break-all text-foreground">{host}</span>
              <span className="mt-0.5 block text-sm font-semibold">{name}</span>
              <span className="block text-xs text-foreground-muted">{detail}</span>
            </span>
            {url && (
              <ArrowUpRight
                className="ml-auto size-4 shrink-0 text-foreground-muted group-hover:text-foreground"
                aria-hidden
              />
            )}
          </>
        );
        const className = clsx("card flex h-full items-start gap-3 p-4", toneClass(toneAt(i)));
        return (
          <li key={id ?? host}>
            {url ? (
              <a href={url} className={clsx(className, "group tone-card")}>
                {body}
              </a>
            ) : (
              <div className={className}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
