import { LogoMark } from "@thebensage-dev/ui";
import type { Block } from "@thebensage-dev/cms-client";

/** A picture of the real "You're in" email (Infrastructure's access_request_approved.html), drawn
 *  with this site's styles. */
export default function EmailPreview({
  preview,
  siteName,
}: {
  preview: Block<"emailSenders">["preview"];
  siteName: string;
}) {
  return (
    <figure>
      <p className="eyebrow">{preview.title}</p>
      <div className="card mt-3 overflow-hidden">
        <div className="grid gap-1 border-b border-border bg-surface-muted/60 px-5 py-4 text-xs">
          <p className="truncate">
            <span className="text-foreground-muted">{preview.fromLabel} </span>
            {preview.from}
          </p>
          <p className="font-semibold">{preview.subject}</p>
        </div>
        <div className="px-5 py-6 sm:px-8">
          <div className="flex items-center gap-2">
            <LogoMark className="size-7" />
            <span className="font-semibold">{siteName}</span>
          </div>
          <span className="brand-rule mt-5" />
          <p className="mt-4 text-xl font-bold tracking-tight">{preview.heading}</p>
          <p className="mt-4 text-sm">{preview.greeting}</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{preview.body}</p>
          <span className="btn btn-primary mt-6">{preview.button}</span>
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-foreground-muted">
        {preview.caption}
      </figcaption>
    </figure>
  );
}
