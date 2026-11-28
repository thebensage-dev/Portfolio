import { ImageResponse } from "next/og";
import { LOGO, palette } from "@thebensage-dev/ui";
import { getContent } from "@/lib/cms";

// The link preview image (og:image, and twitter:image via twitter-image.tsx) in the palette's dark
// colours, with the name, role and headline from the CMS. Drawn per request (the CMS client keeps
// the content for a minute), so an edit shows up without a rebuild. Next fills in the absolute URL
// from metadataBase; each page names the alt text (pageMetadata).
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const { Neutrals, Brand } = palette;

export default async function OpengraphImage() {
  const { tile, lines, lineHeight } = LOGO;
  const { settings: site } = await getContent();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: Neutrals.background.dark,
        color: Neutrals.foreground.dark,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width={112} height={112} viewBox={LOGO.viewBox}>
          <rect width={tile.width} height={tile.height} rx={tile.rx} fill={tile.fill} />
          {lines.map((l) => (
            <rect
              key={l.y}
              x={l.x}
              y={l.y}
              width={l.width}
              height={lineHeight}
              rx={lineHeight / 2}
              fill={l.fill}
            />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 700 }}>{site.name}</div>
          <div style={{ fontSize: 34, color: Neutrals["foreground-muted"].dark }}>{site.role}</div>
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 60, fontWeight: 700, lineHeight: 1.15 }}>
        {site.headline}
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {[Brand.secondary.light, Brand.accent.light, Brand.primary.light].map((colour) => (
          <div
            key={colour}
            style={{ width: 120, height: 14, borderRadius: 7, background: colour }}
          />
        ))}
      </div>
    </div>,
    size,
  );
}
