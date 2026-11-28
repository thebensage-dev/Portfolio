import { FolderKanban } from "lucide-react";
import { Highlight, type ColourRole } from "@thebensage-dev/ui";
import type { Block } from "@thebensage-dev/cms-client";
import ExternalLink from "@/components/ExternalLink";

function RoleLabel({ role, label }: { role: ColourRole; label: string }) {
  return (
    <p className={`tone-${role} flex items-center gap-2 font-mono text-xs text-foreground-muted`}>
      <span aria-hidden className="tone-dot" />
      {label}
    </p>
  );
}

/** A sample of each colour role in use, recoloured live by the picker beside it. */
export default function PalettePreview({
  preview,
  roles,
  anchor,
  componentsUrl,
}: {
  preview: Block<"themeDemo">["preview"];
  roles: Record<ColourRole, string>;
  /** The section's id, for the sample link. */
  anchor: string;
  componentsUrl: string;
}) {
  return (
    <figure className="card reveal-on-scroll p-6 md:sticky md:top-8" aria-label={preview.title}>
      <span aria-hidden className="brand-rule" />
      <p className="eyebrow mt-4">{preview.title}</p>
      <p className="gradient-text mt-1 text-xl font-bold tracking-tight">{preview.heading}</p>

      <div className="mt-6 grid gap-5 divide-y divide-border">
        <div className="grid gap-3 pb-5">
          <RoleLabel role="primary" label={roles.primary} />
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-primary">
              {preview.primary.button}
            </button>
            <a href={`#${anchor}`} className="link text-sm">
              {preview.primary.link}
            </a>
          </div>
          <div>
            <div className="flex justify-between text-xs text-foreground-muted">
              <span>{preview.primary.progress}</span>
              <span>72%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div className="h-full w-[72%] rounded-full bg-primary" />
            </div>
          </div>
        </div>

        <div className="tone-secondary grid gap-3 pb-5">
          <RoleLabel role="secondary" label={roles.secondary} />
          <div className="flex items-center gap-3">
            <span className="icon-tile">
              <FolderKanban aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-semibold">
                {preview.secondary.tile}
                <span className="tag tag-tone">{preview.secondary.tag}</span>
              </p>
              <p className="text-sm text-foreground-muted">{preview.secondary.body}</p>
            </div>
          </div>
        </div>

        <div className="tone-accent grid gap-3 pb-5">
          <RoleLabel role="accent" label={roles.accent} />
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-accent">
              {preview.accent.button}
            </button>
            <p className="text-sm">
              <Highlight
                text={`${preview.accent.text} ${preview.accent.match}`}
                terms={[preview.accent.match]}
              />
            </p>
          </div>
        </div>
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-3 text-xs text-foreground-muted">
        {preview.all}
        <ExternalLink href={componentsUrl} className="link text-sm">
          {preview.link}
        </ExternalLink>
      </figcaption>
    </figure>
  );
}
