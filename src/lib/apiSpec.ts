import { apiReference, projectUrl, projects } from "@/content/site";

export type ApiSpec = {
  /** The OpenAPI document exactly as served (JSON or YAML), handed to Scalar unchanged. */
  content: string;
  /** Where visitors can open the raw document. */
  url: string;
  title?: string;
  version?: string;
  operations?: number;
  groups?: string[];
  auth?: string[];
};

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

function describeAuth(scheme: { type?: unknown; scheme?: unknown }): string | undefined {
  if (scheme.type === "http" && typeof scheme.scheme === "string") {
    return scheme.scheme.toLowerCase() === "bearer" ? "Bearer token" : `HTTP ${scheme.scheme}`;
  }
  if (scheme.type === "oauth2") return "OAuth 2.0";
  if (scheme.type === "openIdConnect") return "OpenID Connect";
  if (scheme.type === "apiKey") return "API key";
  if (scheme.type === "mutualTLS") return "Mutual TLS";
  return undefined;
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
    .map(describeAuth)
    .filter((name) => name !== undefined);
  return {
    title: text(doc.info?.title),
    version: text(doc.info?.version),
    operations: doc.paths ? operations : undefined,
    groups,
    auth: [...new Set(auth)],
  };
}

/** TheBensage API's OpenAPI document, fetched on the server so the browser needs no CORS.
 *  Returns null while the API isn't reachable, and the page explains that instead. */
export async function fetchApiSpec(): Promise<ApiSpec | null> {
  const project = projects.find((p) => p.url.env === apiReference.project);
  if (!project) return null;
  const publicBase = projectUrl(project).replace(/\/$/, "");
  // Inside Docker the public hostname may point at this container, so allow an internal address.
  const serverBase = (process.env.API_INTERNAL_URL || publicBase).replace(/\/$/, "");

  try {
    const res = await fetch(serverBase + apiReference.specPath, {
      headers: { accept: "application/json, application/yaml;q=0.9, */*;q=0.5" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const content = await res.text();
    if (!/openapi|swagger/i.test(content.slice(0, 2000))) return null;
    return { content, url: publicBase + apiReference.specPath, ...summarise(content) };
  } catch {
    return null;
  }
}
