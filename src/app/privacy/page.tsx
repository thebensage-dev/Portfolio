import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { privacy } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = pageMetadata({
  title: privacy.title,
  description: privacy.description,
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalPage doc={privacy} path="/privacy" />;
}
