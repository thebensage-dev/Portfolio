import { createElement } from "react";
import { toneAt, toneClass, iconOrDot } from "@thebensage-dev/ui";
import type { Block } from "@thebensage-dev/cms-client";
import ExternalLink from "@/components/ExternalLink";

type ToolGroup = NonNullable<Block<"stack">["toolGroups"]>[number];
type Tool = NonNullable<ToolGroup["tools"]>[number];

/** A brand logo (its simple-icons path, stored by the CMS), or the Lucide icon picked instead. */
function ToolLogo({ tool }: { tool: Tool }) {
  if (tool.logoPath) {
    return (
      <svg viewBox="0 0 24 24" className="size-4 shrink-0 fill-current" aria-hidden>
        <path d={tool.logoPath} />
      </svg>
    );
  }
  return createElement(iconOrDot(tool.icon), { className: "size-4 shrink-0", "aria-hidden": true });
}

export default function ToolList({ title, groups }: { title: string; groups: ToolGroup[] }) {
  return (
    <div className="mt-subsection">
      <h3 className="title-card">{title}</h3>
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map(({ id, group, tools }, i) => (
          <div key={id ?? group} className={toneClass(toneAt(i))}>
            <p className="eyebrow flex items-center gap-2">
              <span className="tone-dot" aria-hidden />
              {group}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {(tools ?? []).map((tool) => (
                <li key={tool.id ?? tool.name}>
                  <ExternalLink
                    href={tool.url}
                    className="tag inline-flex items-center gap-1.5 text-foreground-muted hover:text-foreground"
                  >
                    <ToolLogo tool={tool} />
                    {tool.name}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
