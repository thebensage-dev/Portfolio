import clsx from "clsx";
import { Check, type LucideIcon } from "lucide-react";
import { toneClass, type Tone } from "@thebensage-dev/ui";

/** One part of the platform that sends email, and the emails it sends. */
export default function SenderCard({
  icon: Icon,
  title,
  description,
  items,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  tone: Tone;
}) {
  return (
    <div className={clsx("card p-6", toneClass(tone))}>
      <div className="flex items-center gap-3">
        <span className="icon-tile">
          <Icon aria-hidden />
        </span>
        <div>
          <h3 className="title-card">{title}</h3>
          <p className="text-sm text-foreground-muted">{description}</p>
        </div>
      </div>
      <ul className="mt-4 grid gap-2 text-sm">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-primary-ink" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
