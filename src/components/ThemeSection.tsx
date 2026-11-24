import { FolderKanban, LockKeyhole, LogIn, UserPlus } from "lucide-react";
import {
  ColourPicker,
  Highlight,
  ThemeToggle,
  type ColourRole,
  type Colours,
  type Theme,
  SectionHeading,
} from "@thebensage-dev/ui";
import { themeDemo } from "@/content/site";

const roleLabels = Object.fromEntries(
  Object.entries(themeDemo.roles).map(([role, { label }]) => [role, label]),
) as Record<ColourRole, string>;
const hints = Object.fromEntries(
  Object.entries(themeDemo.roles).map(([role, { hint }]) => [role, hint]),
) as Record<ColourRole, string>;

/** Who may use the colour picker: members of authentik's portfolio-members (or admins). */
export type PaletteAccess = {
  member: boolean;
  signedIn: boolean;
  /** /auth/login back to this section; missing when sign-in isn't configured. */
  signInHref?: string;
  /** authentik's shared "Request access" page with Portfolio ticked. */
  requestAccessUrl?: string;
};

/** In place of the colour picker for visitors and signed-in people who aren't members yet. */
function PaletteLocked({ access }: { access: PaletteAccess }) {
  const { locked } = themeDemo;
  const signedIn = access.signedIn;
  return (
    <div className="card tone-card tone-primary p-5">
      <div className="flex items-start gap-3">
        <span className="icon-tile">
          <LockKeyhole aria-hidden />
        </span>
        <div>
          <p className="font-semibold tracking-tight">
            {signedIn ? locked.memberTitle : locked.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
            {signedIn ? locked.memberBody : locked.body}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!signedIn && access.signInHref && (
          <a href={access.signInHref} className="btn btn-primary">
            <LogIn className="size-4" aria-hidden />
            {locked.signIn}
          </a>
        )}
        {access.requestAccessUrl && (
          <a
            href={access.requestAccessUrl}
            className={signedIn ? "btn btn-primary" : "btn btn-secondary"}
          >
            <UserPlus className="size-4" aria-hidden />
            {locked.requestAccess}
          </a>
        )}
        {signedIn && access.signInHref && (
          <a href={access.signInHref} className="link text-sm">
            {locked.refresh}
          </a>
        )}
      </div>
    </div>
  );
}

function RoleLabel({ role }: { role: ColourRole }) {
  return (
    <p className={`tone-${role} flex items-center gap-2 font-mono text-xs text-foreground-muted`}>
      <span aria-hidden className="tone-dot" />
      {roleLabels[role]}
    </p>
  );
}

export default function ThemeSection({
  theme,
  colours,
  cookieDomain,
  componentsUrl,
  access,
}: {
  theme: Theme;
  colours: Colours;
  cookieDomain?: string;
  componentsUrl: string;
  access: PaletteAccess;
}) {
  const { preview } = themeDemo;

  return (
    <section id="theme" aria-labelledby="theme-title" className="scroll-mt-8">
      <div className="mx-auto grid max-w-5xl items-start gap-10 px-4 py-20 sm:px-6 sm:py-24 md:grid-cols-2">
        <div>
          <SectionHeading
            id="theme-title"
            eyebrow={themeDemo.eyebrow}
            eyebrowTone="tone-primary"
            title={themeDemo.title}
            intro={themeDemo.intro}
          />

          <div className="mt-8 grid gap-6">
            {access.member ? (
              <ColourPicker
                initialColours={colours}
                presetsLabel={themeDemo.presetsLabel}
                roleLabels={roleLabels}
                hints={hints}
                cookieDomain={cookieDomain}
              />
            ) : (
              <PaletteLocked access={access} />
            )}
            <div>
              <p className="label">{themeDemo.themeLabel}</p>
              <ThemeToggle initialTheme={theme} cookieDomain={cookieDomain} />
            </div>
          </div>

          <p className="mt-8 text-sm text-foreground-muted">{themeDemo.note}</p>
        </div>

        <figure className="card reveal-on-scroll p-6 md:sticky md:top-8" aria-label={preview.title}>
          <span aria-hidden className="brand-rule" />
          <p className="eyebrow mt-4">{preview.title}</p>
          <p className="gradient-text mt-1 text-xl font-bold tracking-tight">{preview.heading}</p>

          <div className="mt-6 grid gap-5 divide-y divide-border">
            <div className="grid gap-3 pb-5">
              <RoleLabel role="primary" />
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="btn btn-primary">
                  {preview.primary.button}
                </button>
                <a href="#theme" className="link text-sm">
                  {preview.primary.link}
                </a>
              </div>
              <div>
                <div className="flex justify-between text-xs text-foreground-muted">
                  <span>{preview.primary.progress}</span>
                  <span>72%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full w-[72%] rounded-full bg-primary" />
                </div>
              </div>
            </div>

            <div className="tone-secondary grid gap-3 pb-5">
              <RoleLabel role="secondary" />
              <div className="flex items-center gap-3">
                <span className="icon-tile">
                  <FolderKanban aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold">
                    {preview.secondary.tile}
                    <span className="tag tag-tone">{preview.secondary.tag}</span>
                  </p>
                  <p className="text-sm text-foreground-muted">{preview.secondary.body}</p>
                </div>
              </div>
            </div>

            <div className="tone-accent grid gap-3 pb-5">
              <RoleLabel role="accent" />
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="btn btn-accent">
                  {preview.accent.button}
                </button>
                <p className="text-sm">
                  <Highlight
                    text={`${preview.accent.text} ${preview.accent.match}`}
                    terms={[preview.accent.match]}
                  />
                </p>
              </div>
            </div>
          </div>

          <figcaption className="flex flex-wrap items-center justify-between gap-3 text-xs text-foreground-muted">
            {preview.all}
            <a
              href={componentsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link text-sm"
            >
              {preview.link}
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
