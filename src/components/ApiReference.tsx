"use client";

import dynamic from "next/dynamic";
import { createContext, useContext } from "react";
import "@scalar/api-reference-react/style.css";
import "@/styles/api-reference.css";

// The loading text comes from the CMS; the placeholder reads it from here.
const LoadingText = createContext("");

function Loading() {
  return (
    <p className="px-6 py-16 text-center text-sm text-foreground-muted">
      {useContext(LoadingText)}
    </p>
  );
}

// Scalar renders in the browser only; its bundle loads after the rest of the page.
const ApiReferenceReact = dynamic(
  () => import("@scalar/api-reference-react").then((mod) => mod.ApiReferenceReact),
  {
    ssr: false,
    loading: Loading,
  },
);

/** Scalar's API reference, browse-only: no request sending, no auth, no external calls. */
export default function ApiReference({ content, loading }: { content: string; loading: string }) {
  return (
    <LoadingText value={loading}>
      <div className="api-reference">
        <ApiReferenceReact
          configuration={{
            content,
            theme: "none",
            layout: "modern",
            withDefaultFonts: false,
            hideDarkModeToggle: true,
            hideTestRequestButton: true,
            hideClientButton: true,
            showDeveloperTools: "never",
            documentDownloadType: "json",
            persistAuth: false,
            persistSelectedClient: false,
            telemetry: false,
            agent: { disabled: true },
            mcp: { disabled: true },
            defaultOpenFirstTag: true,
            orderRequiredPropertiesFirst: true,
          }}
        />
      </div>
    </LoadingText>
  );
}
