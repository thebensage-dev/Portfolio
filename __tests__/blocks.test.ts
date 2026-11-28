import { describe, expect, it } from "vitest";
import snapshot from "@/content/cms-snapshot.json";
import {
  FULL_WIDTH_BLOCKS as FULL_WIDTH,
  GENERAL_BLOCKS as BLOCKS,
} from "@thebensage-dev/cms-client/react";
import type { Content } from "@/server/cms";

// The snapshot is the site's content as the CMS last served it (npm run content:snapshot).
const content = snapshot as unknown as Content;

describe("the block registry", () => {
  it("draws every block the site's pages use", () => {
    for (const page of content.pages) {
      for (const block of page.layout ?? []) {
        expect(BLOCKS[block.blockType], `${page.path}: ${block.blockType}`).toBeDefined();
      }
    }
  });

  it("only lays out blocks it draws outside the column", () => {
    for (const type of FULL_WIDTH) expect(BLOCKS[type]).toBeDefined();
  });

  it("gives every page its own path", () => {
    const paths = content.pages.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
