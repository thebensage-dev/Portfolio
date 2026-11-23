import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <span aria-hidden className="brand-rule" />
      <p className="eyebrow tone-secondary">404</p>
      <h1 className="text-3xl font-bold tracking-tight">This page doesn&apos;t exist</h1>
      <Link href="/" className="btn btn-primary">
        Back home
      </Link>
    </main>
  );
}
