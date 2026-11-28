import clsx from "clsx";
import {
  ColourPicker,
  SectionHeading,
  ThemeToggle,
  type ColourRole,
  type Colours,
  type Theme,
} from "@thebensage-dev/ui";
import type { Block, Page } from "@thebensage-dev/cms-client";
import { sectionClass } from "@/components/GeneralSection";
import PaletteLocked, { type PaletteAccess } from "@/components/PaletteLocked";
import PalettePreview from "@/components/PalettePreview";

const ROLES: ColourRole[] = ["primary", "secondary", "accent"];

/** The homepage's colour palette (members only) and light/dark theme, beside a live preview. */
export default function ThemeSection({
  block,
  theme,
  colours,
  cookieDomain,
  componentsUrl,
  access,
  page,
}: {
  block: Block<"themeDemo">;
  /** The page it's on: its width decides the section's layout. */
  page: Page;
  theme: Theme;
  colours: Colours;
  cookieDomain?: string;
  componentsUrl: string;
  access: PaletteAccess;
}) {
  const roleText = (key: "label" | "hint") =>
    Object.fromEntries(ROLES.map((role) => [role, block.roles[role][key]])) as Record<
      ColourRole,
      string
    >;
  const { anchor } = block;

  return (
    <section id={anchor} aria-labelledby={`${anchor}-title`} className="scroll-mt-8">
      <div
        className={clsx(
          "grid items-start gap-stack md:grid-cols-2",
          sectionClass(page, "mx-auto max-w-5xl px-4 py-section sm:px-6"),
        )}
      >
        <div>
          <SectionHeading
            id={`${anchor}-title`}
            eyebrow={block.eyebrow ?? undefined}
            eyebrowTone="tone-primary"
            title={block.title}
            intro={block.intro ?? undefined}
          />

          <div className="mt-content grid gap-6">
            {access.member ? (
              <ColourPicker
                initialColours={colours}
                presetsLabel={block.presetsLabel}
                roleLabels={roleText("label")}
                hints={roleText("hint")}
                cookieDomain={cookieDomain}
              />
            ) : (
              <PaletteLocked locked={block.locked} access={access} />
            )}
            <div>
              <p className="label">{block.themeLabel}</p>
              <ThemeToggle initialTheme={theme} cookieDomain={cookieDomain} />
            </div>
          </div>

          <p className="mt-content text-sm text-foreground-muted">{block.note}</p>
        </div>

        <PalettePreview
          preview={block.preview}
          roles={roleText("label")}
          anchor={anchor}
          componentsUrl={componentsUrl}
        />
      </div>
    </section>
  );
}
