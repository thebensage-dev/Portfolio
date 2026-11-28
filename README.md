# Portfolio

The main site at `<domain>`: who I am, the live projects, and how the platform behind them works. Next.js 16 (React 19, Tailwind v4), with every page built from blocks in the [CMS](https://github.com/thebensage-dev/Cms) and every component and colour from [`@thebensage-dev/ui`](https://github.com/thebensage-dev/SharedUI).

How the repos fit together, and the local stack that runs them all, are in [Infrastructure's README](https://github.com/thebensage-dev/Infrastructure).

## Content

Nothing on the site is written here: pages, projects, header, footer and every label are edited in the CMS (`cms.<domain>`, locally `cms.localhost:8080`).

- `src/app/[[...slug]]/page.tsx` finds the CMS page for the address and lays it out by its width; each block is drawn by its component in `src/blocks/` (listed in `src/blocks/registry.ts`). A page added in the CMS is live here, and in the sitemap, with no code change.
- A new kind of block is added in the Cms repo first, then gets a component here.
- `src/lib/cms.ts` reads the CMS through `@thebensage-dev/cms-client`: cached for a minute, the last good copy while the CMS is down, and [`src/content/cms-snapshot.json`](src/content/cms-snapshot.json) if it has never reached it (`npm run content:snapshot` refreshes it).
- Drafts: the CMS's Live Preview and Preview button show unpublished pages here through draft mode (`/preview`, needs `PREVIEW_SECRET`).

The privacy notice and terms are CMS pages that describe what's actually deployed; update them, and their date, when that changes.

## Running it

Needs Node 26 (`.nvmrc`) and a `.npmrc` with a GitHub token that has `read:packages` (copy `.npmrc.example`), since the `@thebensage-dev` packages are on GitHub Packages.

```bash
npm ci
npm run dev      # http://localhost:3001
npm run check    # format check, lint, typecheck
npm run build
```

Settings are optional locally (copy `.env.example` to `.env.local`), and all are read per request, so one image works on any domain:

| Env var                 | What it's for                                                                           | When unset              |
| ----------------------- | --------------------------------------------------------------------------------------- | ----------------------- |
| `SITE_URL`              | This site's address: link previews, `robots.txt`, the sitemap.                          | Relative URLs           |
| `CMS_URL`               | Where the server reads the CMS.                                                         | `http://localhost:3003` |
| `CMS_PUBLIC_URL`        | The CMS's address in the browser, when `CMS_URL` is internal (Docker): images, preview. | `CMS_URL`               |
| `PREVIEW_SECRET`        | Shared with the CMS: shows drafts while previewing.                                     | No preview              |
| `USER_DIRECTORY_URL`    | The User Directory project's link.                                                      | `http://localhost:3000` |
| `API_URL`               | The API project's link, and where `/api-reference` reads the OpenAPI document.          | `http://localhost:3002` |
| `API_INTERNAL_URL`      | The server's address for that document, when `API_URL` isn't reachable (Docker).        | `API_URL`               |
| `STORYBOOK_URL`         | The Shared UI project's link.                                                           | `http://localhost:6006` |
| `STATUS_URL`            | The footer's Live status link (Grafana's public dashboard).                             | No link                 |
| `OIDC_*`, `AUTH_SECRET` | Sign-in through authentik (see `.env.example`); without them the site is signed out.    | Signed out              |

The whole platform, this site included, runs from `../Infrastructure/local/compose.yaml` (this site at http://localhost:8080).

## Deploying

The same pipeline as every repo (Infrastructure's README, "Deploying"): checks, an image on `ghcr.io/thebensage-dev/portfolio`, then an approved deploy that writes the settings into Coolify. Every setting is derived from the `DOMAIN` variable and `PLATFORM_SECRET`.

Coolify app: **Docker Image** named `portfolio`, image `ghcr.io/thebensage-dev/portfolio`, port `3000`, domains `https://<domain>,https://www.<domain>`, no storage, auto deploy off.

## Licence

MIT, see [`LICENSE`](LICENSE). Copyright (c) 2026 TheBensage.
