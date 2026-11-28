import { afterEach, describe, expect, it, vi } from "vitest";
import { envUrl, siteUrl } from "@/lib/env";

afterEach(() => vi.unstubAllEnvs());

describe("public URLs from the environment", () => {
  it("trims the site's trailing slash and is unset without it", () => {
    vi.stubEnv("SITE_URL", "https://example.com/");
    expect(siteUrl()).toBe("https://example.com");
    vi.stubEnv("SITE_URL", "");
    expect(siteUrl()).toBeUndefined();
  });

  it("reads the CMS's public address, else its own", () => {
    vi.stubEnv("CMS_PUBLIC_URL", "");
    vi.stubEnv("CMS_URL", "https://cms.example.com");
    expect(envUrl("CMS_PUBLIC_URL")).toBe("https://cms.example.com");
    vi.stubEnv("CMS_PUBLIC_URL", "http://cms.localhost:8080");
    expect(envUrl("CMS_PUBLIC_URL")).toBe("http://cms.localhost:8080");
  });

  it("reads any other address by its variable's name", () => {
    vi.stubEnv("API_URL", "https://api.example.com");
    expect(envUrl("API_URL")).toBe("https://api.example.com");
    vi.stubEnv("API_URL", "");
    expect(envUrl("API_URL")).toBeUndefined();
  });
});
