import HomeHero from "@/components/HomeHero";
import type { BlockProps } from "@/blocks/types";

export default function HomeHeroBlock({ block, ctx }: BlockProps<"homeHero">) {
  return <HomeHero block={block} ctx={ctx} />;
}
