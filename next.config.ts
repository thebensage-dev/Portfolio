import type { NextConfig } from "next";

const securityHeaders = [
  // Content-Security-Policy and X-Frame-Options (no framing, except by the CMS while previewing)
  // are set per request in src/proxy.ts.
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    // Every page except the front-channel logout route, which authentik loads in a frame
    // (it sets its own frame-ancestors).
    return [{ source: "/((?!auth/frontchannel-logout).*)", headers: securityHeaders }];
  },
};

export default nextConfig;
