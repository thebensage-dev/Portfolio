import type { Feature, FlowStep, TimelineStep } from "@thebensage-dev/ui";
import { iconByName, iconOrDot } from "@thebensage-dev/ui";

// Turns CMS block rows into the props of SharedUI's section components (icons by name become
// Lucide components; null becomes undefined).

type FeatureRow = {
  id?: string | null;
  icon?: string | null;
  title: string;
  description: string;
  tags?: string[] | null;
};

export const features = (rows: FeatureRow[] | null | undefined): Feature[] =>
  (rows ?? []).map((row) => ({
    icon: iconOrDot(row.icon),
    title: row.title,
    description: row.description,
    ...(row.tags?.length ? { tags: row.tags } : {}),
  }));

type FlowRow = { icon?: string | null; title: string; detail: string };

export const flowSteps = (rows: FlowRow[] | null | undefined): FlowStep[] =>
  (rows ?? []).map((row) => ({ icon: iconOrDot(row.icon), title: row.title, detail: row.detail }));

type StepRow = { icon?: string | null; actor?: string | null; title: string; description: string };

export const timelineSteps = (rows: StepRow[] | null | undefined): TimelineStep[] =>
  (rows ?? []).map((row) => {
    const Icon = iconByName(row.icon);
    return {
      title: row.title,
      description: row.description,
      ...(Icon ? { icon: Icon } : {}),
      ...(row.actor ? { actor: row.actor } : {}),
    };
  });
