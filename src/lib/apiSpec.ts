import { cache } from "react";
import type { Project } from "@thebensage-dev/cms-client";
import { projectUrl } from "@/lib/cms";
import { trimSlash } from "@/lib/env";

export type ApiSpec = {
  /** The OpenAPI document exactly as served (JSON or YAML), handed to Scalar unchanged. */
  content: string;
  /** Where visitors can open the raw document. */
  url: string;
  title?: string;
  version?: string;
  operations?: number;
  groups?: string[];
  /** The kinds of authentication it declares, named by the CMS's API reference block. */
  auth?: AuthScheme[];
};

/** One kind of authentication from the document's security schemes. */
export type AuthScheme =
  | { kind: "bearer" | "oauth2" | "openIdConnect" | "apiKey" | "mutualTLS" }
  | { kind: "http"; scheme: string };

const METHODS = ["get", "put", "post", "delete", "patch", "head", "options", "trace"];

type OpenApiDocument = {
  info?: { title?: unknown; version?: unknown };
  paths?: Record<string, Record<string, unknown> | undefined>;
  tags?: { name?: unknown }[];
  components?: { securitySchemes?: Record<string, { type?: unknown; scheme?: unknown }> };
};

function text(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

function authScheme(scheme: { type?: unknown; scheme?: unknown }): AuthScheme | undefined {
  if (scheme.type === "http" && typeof scheme.scheme === "string") {
    return scheme.scheme.toLowerCase() === "bearer"
      ? { kind: "bearer" }
      : { kind: "http", scheme: scheme.scheme };
  }
  const kinds = ["oauth2", "openIdConnect", "apiKey", "mutualTLS"] as const;
  const kind = kinds.find((candidate) => candidate === scheme.type);
  return kind && { kind };
}

/** Facts for the page's summary. Only a JSON document is summarised; YAML still renders. */
function summarise(content: string): Omit<ApiSpec, "content" | "url"> {
  let doc: OpenApiDocument;
  try {
    doc = JSON.parse(content) as OpenApiDocument;
  } catch {
    return {};
  }
  const pathItems = Object.values(doc.paths ?? {});
  const operations = pathItems.reduce(
    (count, item) => count + METHODS.filter((method) => item?.[method]).length,
    0,
  );
  const groups = (doc.tags ?? []).map((tag) => text(tag.name)).filter((name) => name !== undefined);
  const auth = Object.values(doc.components?.securitySchemes ?? {})
    .map(authScheme)
    .filter((scheme) => scheme !== undefined);
  // One of each (two bearer schemes read as one).
  const unique = [...new Map(auth.map((scheme) => [JSON.stringify(scheme), scheme])).values()];
  return {
    title: text(doc.info?.title),
    version: text(doc.info?.version),
    operations: doc.paths ? operations : undefined,
    groups,
    auth: unique,
  };
}

/** A project's OpenAPI document (the API's, at `specPath`), fetched on the server so the
 *  browser needs no CORS. Returns null while the API isn't reachable, and the page explains that
 *  instead. Once per request: the page's buttons and its reference block both ask. */
export const fetchApiSpec = cache(async function fetchApiSpec(
  project: Project,
  specPath: string,
): Promise<ApiSpec | null> {
  const publicBase = trimSlash(projectUrl(project));
  // Inside Docker the public hostname may point at this container, so allow an internal address.
  const serverBase = trimSlash(process.env.API_INTERNAL_URL || publicBase);

  try {
    const res = await fetch(serverBase + specPath, {
      headers: { accept: "application/json, application/yaml;q=0.9, */*;q=0.5" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const content = await res.text();
    if (!/openapi|swagger/i.test(content.slice(0, 2000))) return null;
    return { content, url: publicBase + specPath, ...summarise(content) };
  } catch {
    return null;
  }
});
