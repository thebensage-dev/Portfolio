import { LogIn, UserPlus } from "lucide-react";
import { NoteCard } from "@thebensage-dev/ui";
import type { Block } from "@thebensage-dev/cms-client";

/** "Try it": request access (and sign in, when signed out) for real. */
export default function TryAccessCard({
  text,
  signedIn,
  requestAccessHref,
  signInHref,
}: {
  text: NonNullable<Block<"timeline">["tryAccess"]>;
  signedIn: boolean;
  /** authentik's request-access page; missing when sign-in isn't configured. */
  requestAccessHref?: string;
  signInHref?: string;
}) {
  return (
    <NoteCard title={text.title ?? ""} body={(signedIn ? text.signedIn : text.body) ?? ""}>
      {requestAccessHref && (
        <a href={requestAccessHref} className="btn btn-accent">
          <UserPlus className="size-4" aria-hidden />
          {text.requestAccess}
        </a>
      )}
      {!signedIn && signInHref && (
        <a href={signInHref} className="btn btn-secondary">
          <LogIn className="size-4" aria-hidden />
          {text.signIn}
        </a>
      )}
    </NoteCard>
  );
}
