import clsx from "clsx";
import { toneAt, toneClass } from "@thebensage-dev/ui";
import type { Block } from "@thebensage-dev/cms-client";

/** The platform's email addresses and the job of each. */
export default function AddressCards({ items }: { items: Block<"addressCards">["items"] }) {
  return (
    <dl className="grid gap-5 md:grid-cols-3">
      {items.map(({ id, address, job }, i) => (
        <div key={id ?? address} className={clsx("card tone-card p-5", toneClass(toneAt(i)))}>
          <dt className="font-mono text-sm font-semibold break-all">{address}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-foreground-muted">{job}</dd>
        </div>
      ))}
    </dl>
  );
}
