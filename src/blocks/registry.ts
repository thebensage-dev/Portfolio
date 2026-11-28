import type { LayoutBlock } from "@thebensage-dev/cms-client";
import { GENERAL_BLOCKS, type BlockRegistry } from "@thebensage-dev/cms-client/react";
import AccessTableBlock from "@/blocks/AccessTableBlock";
import AddressCardsBlock from "@/blocks/AddressCardsBlock";
import ApiReferenceBlock from "@/blocks/ApiReferenceBlock";
import EmailSendersBlock from "@/blocks/EmailSendersBlock";
import FlowsBlock from "@/blocks/FlowsBlock";
import HomeHeroBlock from "@/blocks/HomeHeroBlock";
import LinkCardsBlock from "@/blocks/LinkCardsBlock";
import PageCardsBlock from "@/blocks/PageCardsBlock";
import PageTeaserBlock from "@/blocks/PageTeaserBlock";
import PlatformMapBlock from "@/blocks/PlatformMapBlock";
import PlatformTeaserBlock from "@/blocks/PlatformTeaserBlock";
import ProjectsGridBlock from "@/blocks/ProjectsGridBlock";
import StackBlock from "@/blocks/StackBlock";
import ThemeDemoBlock from "@/blocks/ThemeDemoBlock";
import type { BlockContext } from "@/blocks/types";

type BlockType = LayoutBlock["blockType"];

/**
 * The component that draws each block type this site renders (the CMS's BLOCKS_BY_SITE for
 * "portfolio"): the general blocks from the client package, then this site's own. A new block of
 * its own: add it in the Cms repo, bump the client, then add its file here.
 */
export const BLOCKS: BlockRegistry<BlockContext> = {
  ...GENERAL_BLOCKS,
  homeHero: HomeHeroBlock,
  projectsGrid: ProjectsGridBlock,
  pageTeaser: PageTeaserBlock,
  platformTeaser: PlatformTeaserBlock,
  themeDemo: ThemeDemoBlock,
  pageCards: PageCardsBlock,
  platformMap: PlatformMapBlock,
  stack: StackBlock,
  flows: FlowsBlock,
  accessTable: AccessTableBlock,
  addressCards: AddressCardsBlock,
  emailSenders: EmailSendersBlock,
  linkCards: LinkCardsBlock,
  apiReference: ApiReferenceBlock,
};

/** Blocks that span the whole width, outside the page's centred column. */
export const FULL_WIDTH = new Set<BlockType>(["stack"]);
