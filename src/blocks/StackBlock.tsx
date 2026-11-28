import StackSection from "@/components/StackSection";
import type { BlockProps } from "@/blocks/types";

/** Full width (see FULL_WIDTH in the registry). */
export default function StackBlock({ block }: BlockProps<"stack">) {
  return <StackSection block={block} />;
}
