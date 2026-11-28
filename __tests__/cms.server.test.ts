import { afterEach, describe, expect, it, vi } from "vitest";
import snapshot from "@/content/cms-snapshot.json";
import { findPage, projectHref, resolveLink, type Content } from "@/server/cms";

const content = snapshot as unknown as Content;

afterEach(() => vi.unstubAllEnvs());

describe("links from the CMS", () => {
  it("resolves pages by id, with their anchor", () => {
    const skills = findPage(content, "/skills")!;
    expect(resolveLink(content, { type: "page", page: skills.id, anchor: "tools" })).toMatchObject({
      href: "/skills#tools",
      internal: true,
      external: false,
    });
    expect(resolveLink(content, { type: "page", page: 99999 })).toBeNull();
  });

  it("keeps addresses as given and opens other sites in a new tab when asked", () => {
    expect(resolveLink(content, { type: "url", url: "/projects" })?.internal).toBe(true);
    const out = resolveLink(content, { type: "url", url: "https://github.com/x", newTab: true });
    expect(out).toMatchObject({ href: "https://github.com/x", external: true, internal: false });
  });

  it("leaves out request access while sign-in isn't set up", () => {
    expect(resolveLink(content, { type: "requestAccess" })).toBeNull();
  });

  it("links the OpenAPI document only when the page loaded it", () => {
    expect(resolveLink(content, { type: "apiSpec" })).toBeNull();
    expect(
      resolveLink(content, { type: "apiSpec" }, { apiSpecUrl: "https://api.test/openapi.json" })
        ?.href,
    ).toBe("https://api.test/openapi.json");
  });

  it("sends a project to its page here, else to its app", () => {
    for (const project of content.projects) {
      const href = projectHref(content, project);
      expect(href.startsWith("/") || href.startsWith("http")).toBe(true);
    }
  });
});
