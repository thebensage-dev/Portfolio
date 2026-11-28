import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/** A small text link with a trailing arrow, to a page here or (in a new tab) another site. */
export default function ArrowLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      className={clsx("link inline-flex items-center gap-1 text-sm", className)}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
      <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}
