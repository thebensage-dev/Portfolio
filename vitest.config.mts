import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      // The real package throws outside React Server Components; tests import server code directly.
      "server-only": path.resolve(import.meta.dirname, "./__tests__/stubs/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.{ts,tsx}"],
    // Our packages import Next by its bare paths (next/headers), which only a bundler resolves.
    server: { deps: { inline: ["@thebensage-dev/auth", "@thebensage-dev/cms-client"] } },
  },
});
