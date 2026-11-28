import type { Colours } from "@thebensage-dev/ui";
import type { LayoutBlock } from "@thebensage-dev/cms-client";
import type {
  BlockContext as SharedContext,
  BlockProps as SharedProps,
} from "@thebensage-dev/cms-client/react";
import type { ApiSpec } from "@/lib/apiSpec";
import type { Content } from "@/server/cms";
import type { HeaderProps } from "@/server/headerProps";

/** What this site's own blocks may need besides the shared context: the request and the page. */
export type BlockContext = SharedContext & {
  content: Content;
  header: HeaderProps;
  /** The page's own path, for sign-in links back to a section. */
  path: string;
  /** The page's title (names the API reference for screen readers). */
  title: string;
  colours: Colours;
  /** The OpenAPI document, on a page with an API reference block (null while the API is down). */
  apiSpec: ApiSpec | null;
};

/** The props of the component that draws one block type. */
export type BlockProps<T extends LayoutBlock["blockType"]> = SharedProps<T, BlockContext>;

export { opt } from "@thebensage-dev/cms-client/react";
