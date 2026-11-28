// The same preview image for X/Twitter cards (twitter:image).
export { contentType, default, size } from "./opengraph-image";

// Drawn per request, like the og:image (Next reads this here, not through a re-export).
export const dynamic = "force-dynamic";
