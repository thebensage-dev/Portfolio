import {
  BookOpen,
  FolderKanban,
  FolderGit2,
  Layers,
  LogIn,
  LogOut,
  Mail,
  Palette,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { Logo, MobileMenu, ThemeToggle, type Theme } from "@thebensage-dev/ui";
import { apiReference, site, themeDemo } from "@/content/site";
import type { SiteUser } from "@/server/auth";

/**
 * The top bar. From `md` up: the links, theme toggle and sign-in in a row. On phones: the logo
 * and a menu button (`MobileMenu`) holding the same links and controls, so nothing scrolls
 * sideways.
 */
export default function SiteHeader({
  theme,
  cookieDomain,
  user,
  accountHref,
  signInHref,
}: {
  theme: Theme;
  cookieDomain?: string;
  user: SiteUser | null;
  /** authentik's "Your account" page; missing when sign-in isn't configured. */
  accountHref: string | null;
  /** Missing when sign-in isn't configured. */
  signInHref?: string;
}) {
  const mailto = `mailto:${site.email}`;
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  const signOut = (
    <form action="/auth/logout" method="post">
      <button type="submit" className="mobile-menu-link w-full">
        <LogOut aria-hidden />
        {themeDemo.signOut}
      </button>
    </form>
  );

  return (
    <header className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
      <a href="#top" className="rounded-md">
        <Logo name={site.name} />
      </a>

      {/* Phones */}
      <MobileMenu label="Menu" className="md:hidden">
        <a href="#projects" className="mobile-menu-link">
          <FolderKanban aria-hidden />
          Projects
        </a>
        <a href="#stack" className="mobile-menu-link">
          <Layers aria-hidden />
          How it&apos;s built
        </a>
        <Link href="/api-reference" className="mobile-menu-link">
          <BookOpen aria-hidden />
          {apiReference.navLabel}
        </Link>
        <a href="#theme" className="mobile-menu-link">
          <Palette aria-hidden />
          Colour palette
        </a>
        <a href={site.githubUrl} {...external} className="mobile-menu-link">
          <FolderGit2 aria-hidden />
          GitHub
        </a>
        <a href={mailto} className="mobile-menu-link">
          <Mail aria-hidden />
          Contact
        </a>
        <hr className="mobile-menu-divider" />
        <div className="mobile-menu-row">
          {themeDemo.themeLabel}
          <ThemeToggle initialTheme={theme} cookieDomain={cookieDomain} />
        </div>
        {user ? (
          <>
            {accountHref && (
              <a href={accountHref} className="mobile-menu-link" title={themeDemo.account}>
                <UserCog aria-hidden />
                <span className="truncate">{user.name}</span>
              </a>
            )}
            {signOut}
          </>
        ) : (
          signInHref && (
            <a href={signInHref} className="mobile-menu-link">
              <LogIn aria-hidden />
              {themeDemo.signIn}
            </a>
          )
        )}
      </MobileMenu>

      {/* sm and up */}
      <nav className="hidden items-center gap-5 text-sm font-medium text-foreground-muted md:flex">
        <a href="#projects" className="hover:text-foreground">
          Projects
        </a>
        <a href="#stack" className="hover:text-foreground">
          How it&apos;s built
        </a>
        <Link href="/api-reference" className="hover:text-foreground">
          {apiReference.navLabel}
        </Link>
        <a href={site.githubUrl} {...external} className="hover:text-foreground">
          GitHub
        </a>
        <a href={mailto} className="hover:text-foreground">
          Contact
        </a>
        <a href="#theme" className="hidden hover:text-foreground lg:inline">
          Theme
        </a>
        <ThemeToggle initialTheme={theme} cookieDomain={cookieDomain} />
        {user ? (
          <form action="/auth/logout" method="post" className="flex items-center gap-2">
            {accountHref ? (
              <a
                href={accountHref}
                className="flex items-center gap-1.5 hover:text-foreground"
                title={themeDemo.account}
              >
                <UserCog className="size-4" aria-hidden />
                <span className="hidden max-w-32 truncate lg:inline">{user.name}</span>
                <span className="sr-only lg:hidden">{themeDemo.account}</span>
              </a>
            ) : (
              <span className="hidden max-w-32 truncate lg:inline">{user.name}</span>
            )}
            <button
              type="submit"
              className="icon-btn"
              title={themeDemo.signOut}
              aria-label={themeDemo.signOut}
            >
              <LogOut className="size-4" />
            </button>
          </form>
        ) : (
          signInHref && (
            <a href={signInHref} className="flex items-center gap-1.5 hover:text-foreground">
              <LogIn className="size-4" aria-hidden />
              {themeDemo.signIn}
            </a>
          )
        )}
      </nav>
    </header>
  );
}
