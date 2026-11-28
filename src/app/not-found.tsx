import Link from "next/link";
import { getContent } from "@/lib/cms";

export default async function NotFound() {
  const { notFound } = (await getContent()).settings;
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <span aria-hidden className="brand-rule" />
      {notFound.eyebrow && <p className="eyebrow tone-secondary">{notFound.eyebrow}</p>}
      <h1 className="text-3xl font-bold tracking-tight">{notFound.title}</h1>
      {notFound.body && <p className="text-foreground-muted">{notFound.body}</p>}
      <Link href="/" className="btn btn-primary">
        {notFound.back}
      </Link>
    </main>
  );
}
