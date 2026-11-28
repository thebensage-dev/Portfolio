import type { ComponentType } from "react";
import type { LayoutBlock } from "@thebensage-dev/cms-client";
import AccessTableBlock from "@/blocks/AccessTableBlock";
import AddressCardsBlock from "@/blocks/AddressCardsBlock";
import ApiReferenceBlock from "@/blocks/ApiReferenceBlock";
import CallToActionBlock from "@/blocks/CallToActionBlock";
import CardGridBlock from "@/blocks/CardGridBlock";
import EmailSendersBlock from "@/blocks/EmailSendersBlock";
import FlowsBlock from "@/blocks/FlowsBlock";
import HomeHeroBlock from "@/blocks/HomeHeroBlock";
import LegalHeaderBlock from "@/blocks/LegalHeaderBlock";
import LinkCardsBlock from "@/blocks/LinkCardsBlock";
import PageCardsBlock from "@/blocks/PageCardsBlock";
import PageHeaderBlock from "@/blocks/PageHeaderBlock";
import PageTeaserBlock from "@/blocks/PageTeaserBlock";
import PlatformMapBlock from "@/blocks/PlatformMapBlock";
import PlatformTeaserBlock from "@/blocks/PlatformTeaserBlock";
import ProjectsGridBlock from "@/blocks/ProjectsGridBlock";
import StackBlock from "@/blocks/StackBlock";
import TextSectionBlock from "@/blocks/TextSectionBlock";
import ThemeDemoBlock from "@/blocks/ThemeDemoBlock";
import TimelineBlock from "@/blocks/TimelineBlock";
import ButtonsBlock from "@/blocks/ButtonsBlock";
import ColumnsBlock from "@/blocks/ColumnsBlock";
import ContentBlock from "@/blocks/ContentBlock";
import ImageBlock from "@/blocks/ImageBlock";
import ImageTextBlock from "@/blocks/ImageTextBlock";
import type { BlockProps } from "@/blocks/types";

type BlockType = LayoutBlock["blockType"];

/**
 * The component that draws each block type this site renders (the CMS's BLOCKS_BY_SITE for
 * "portfolio"). A new block: add it in the Cms repo, bump the client, then add its file here.
 * The other site's block types are left out and render nothing.
 */
export const BLOCKS: { [T in BlockType]?: ComponentType<BlockProps<T>> } = {
  pageHeader: PageHeaderBlock,
  content: ContentBlock,
  image: ImageBlock,
  imageText: ImageTextBlock,
  columns: ColumnsBlock,
  buttons: ButtonsBlock,
  legalHeader: LegalHeaderBlock,
  homeHero: HomeHeroBlock,
  projectsGrid: ProjectsGridBlock,
  pageTeaser: PageTeaserBlock,
  platformTeaser: PlatformTeaserBlock,
  themeDemo: ThemeDemoBlock,
  cardGrid: CardGridBlock,
  timeline: TimelineBlock,
  pageCards: PageCardsBlock,
  platformMap: PlatformMapBlock,
  stack: StackBlock,
  flows: FlowsBlock,
  accessTable: AccessTableBlock,
  addressCards: AddressCardsBlock,
  emailSenders: EmailSendersBlock,
  linkCards: LinkCardsBlock,
  apiReference: ApiReferenceBlock,
  callToAction: CallToActionBlock,
  textSection: TextSectionBlock,
};

/** Blocks that span the whole width, outside the page's centred column. */
export const FULL_WIDTH = new Set<BlockType>(["stack"]);
