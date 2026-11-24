import { LogIn, UserPlus } from "lucide-react";
import { NoteCard } from "@thebensage-dev/ui";
import { signInPage } from "@/content/platform";

/** "Try it": request access (and sign in, when signed out) for real. */
export default function TryAccessCard({
  signedIn,
  requestAccessHref,
  signInHref,
}: {
  signedIn: boolean;
  /** authentik's request-access page; missing when sign-in isn't configured. */
  requestAccessHref?: string;
  signInHref?: string;
}) {
  const { tryIt } = signInPage;
  return (
    <NoteCard title={tryIt.title} body={signedIn ? tryIt.signedIn : tryIt.body}>
      {requestAccessHref && (
        <a href={requestAccessHref} className="btn btn-accent">
          <UserPlus className="size-4" aria-hidden />
          {tryIt.requestAccess}
        </a>
      )}
      {!signedIn && signInHref && (
        <a href={signInHref} className="btn btn-secondary">
          <LogIn className="size-4" aria-hidden />
          {tryIt.signIn}
        </a>
      )}
    </NoteCard>
  );
}
