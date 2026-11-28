import Link from "next/link";
import { ActionLinks, iconByName } from "@thebensage-dev/ui";
import { resolveLink, type CmsLink, type Content, type LinkContext } from "@/lib/cms";

export type CmsButton = {
  id?: string | null;
  label: string;
  style?: "primary" | "secondary" | "accent" | "ghost" | null;
  size?: "default" | "sm" | "lg" | null;
  icon?: string | null;
  iconPosition?: "start" | "end" | null;
  link: CmsLink;
};

/** Buttons from the CMS, in order, drawn by SharedUI's ActionLinks. A button whose link can't go
 *  anywhere here right now (see `resolveLink`) is left out. */
export default function CmsButtons({
  buttons,
  content,
  context,
}: {
  buttons: CmsButton[] | null | undefined;
  content: Content;
  context?: LinkContext;
}) {
  const actions = (buttons ?? []).flatMap((button, i) => {
    const link = resolveLink(content, button.link, context);
    if (!link) return [];
    return [
      {
        key: button.id ?? i,
        label: button.label,
        href: link.href,
        style: button.style,
        size: button.size,
        icon: iconByName(button.icon),
        iconPosition: button.iconPosition,
        internal: link.internal,
        external: link.external,
        download: link.download,
      },
    ];
  });
  return <ActionLinks actions={actions} linkComponent={Link} />;
}
