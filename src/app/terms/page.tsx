import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { terms } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = pageMetadata({
  title: terms.title,
  description: terms.description,
  path: "/terms",
});

export default function TermsPage() {
  return <LegalPage doc={terms} path="/terms" />;
}
