import { toneAt, toneClass } from "@thebensage-dev/ui";
import { stack, type Tool } from "@/content/site";

function ToolLogo({ tool }: { tool: Tool }) {
  if (tool.logo) {
    return (
      <svg viewBox="0 0 24 24" className="size-4 shrink-0 fill-current" aria-hidden>
        <path d={tool.logo.path} />
      </svg>
    );
  }
  const Icon = tool.icon;
  return <Icon className="size-4 shrink-0" aria-hidden />;
}

export default function ToolList() {
  return (
    <div className="mt-14">
      <h3 className="font-semibold tracking-tight">The tools behind it</h3>
      <div className="mt-5 grid gap-6 md:grid-cols-3">
        {stack.tools.map(({ group, items }, i) => (
          <div key={group} className={toneClass(toneAt(i))}>
            <p className="eyebrow flex items-center gap-2">
              <span className="tone-dot" aria-hidden />
              {group}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {items.map((tool) => (
                <li key={tool.name}>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tag inline-flex items-center gap-1.5 text-foreground-muted hover:text-foreground"
                  >
                    <ToolLogo tool={tool} />
                    {tool.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
