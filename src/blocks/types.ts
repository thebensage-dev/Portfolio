import type { Colours } from "@thebensage-dev/ui";
import type { Block, LayoutBlock, Page } from "@thebensage-dev/cms-client";
import type { ApiSpec } from "@/lib/apiSpec";
import type { Content, LinkContext } from "@/lib/cms";
import type { HeaderProps } from "@/server/headerProps";

/** What a block may need besides its own fields: the site's content and the request. */
export type BlockContext = {
  content: Content;
  /** The page being drawn. */
  page: Page;
  header: HeaderProps;
  /** The page's own path, for sign-in links back to a section. */
  path: string;
  /** The page's title (names the API reference for screen readers). */
  title: string;
  colours: Colours;
  /** The OpenAPI document, on a page with an API reference block (null while the API is down). */
  apiSpec: ApiSpec | null;
  links: LinkContext;
};

/** The props of the component that draws one block type. */
export type BlockProps<T extends LayoutBlock["blockType"]> = { block: Block<T>; ctx: BlockContext };

/** Empty CMS text as "not set". */
export const opt = (value: string | null | undefined) => value || undefined;
