import { LockKeyhole, LogIn, UserPlus } from "lucide-react";
import type { Block } from "@thebensage-dev/cms-client";

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
export default function PaletteLocked({
  locked,
  access,
}: {
  locked: Block<"themeDemo">["locked"];
  access: PaletteAccess;
}) {
  const { signedIn, signInHref, requestAccessUrl } = access;
  return (
    <div className="card tone-card tone-primary p-5">
      <div className="flex items-start gap-3">
        <span className="icon-tile">
          <LockKeyhole aria-hidden />
        </span>
        <div>
          <p className="title-card">{signedIn ? locked.memberTitle : locked.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
            {signedIn ? locked.memberBody : locked.body}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!signedIn && signInHref && (
          <a href={signInHref} className="btn btn-primary">
            <LogIn className="size-4" aria-hidden />
            {locked.signIn}
          </a>
        )}
        {requestAccessUrl && (
          <a href={requestAccessUrl} className={signedIn ? "btn btn-primary" : "btn btn-secondary"}>
            <UserPlus className="size-4" aria-hidden />
            {locked.requestAccess}
          </a>
        )}
        {signedIn && signInHref && (
          <a href={signInHref} className="link text-sm">
            {locked.refresh}
          </a>
        )}
      </div>
    </div>
  );
}
