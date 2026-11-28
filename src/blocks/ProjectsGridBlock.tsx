import ProjectsSection from "@/components/ProjectsSection";
import type { BlockProps } from "@/blocks/types";

export default function ProjectsGridBlock({ block, ctx }: BlockProps<"projectsGrid">) {
  return <ProjectsSection block={block} content={ctx.content} page={ctx.page} />;
}
