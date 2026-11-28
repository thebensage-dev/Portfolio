import ThemeSection from "@/components/ThemeSection";
import type { BlockProps } from "@/blocks/types";
import { resolveLink } from "@/server/cms";
import { requestAccessUrl } from "@/server/auth";
import { signInHref } from "@/server/headerProps";

/** The colour demo: members get the picker; sign-in links come back to this section. */
export default function ThemeDemoBlock({ block, ctx }: BlockProps<"themeDemo">) {
  const { header, content } = ctx;
  const components = resolveLink(content, block.preview.componentsLink);
  return (
    <ThemeSection
      block={block}
      page={ctx.page}
      theme={header.theme}
      colours={ctx.colours}
      cookieDomain={header.cookieDomain}
      componentsUrl={components?.href ?? content.settings.githubUrl}
      access={{
        member: header.user?.member ?? false,
        signedIn: header.user !== null,
        signInHref: header.signInHref ? signInHref(`${ctx.path}#${block.anchor}`) : undefined,
        requestAccessUrl: requestAccessUrl() ?? undefined,
      }}
    />
  );
}
