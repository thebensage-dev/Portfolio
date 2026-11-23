# Portfolio

The landing page for my projects: a one-page Next.js 16 site (React 19, Tailwind v4) that introduces me and links to each live project. The shared look (colour palette, buttons, cards, motion, logo) comes from **`@thebensage-dev/ui`**; colours are defined only in SharedUI's `brand/palette.json`.

## How it fits with the other repos

| Repo                 | Role                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Portfolio** (this) | Landing site at `<domain>`.                                                                                                                                                                 |
| UserDirectory        | The User Directory app at `users.<domain>`. This site links to it through `USER_DIRECTORY_URL`.                                                                                             |
| Api                  | TheBensage API at `api.<domain>` (.NET, PostgreSQL); its people endpoints run the User Directory. Linked through `API_URL`, and `/api-reference` renders its OpenAPI document.              |
| SharedUI             | `@thebensage-dev/ui`, installed from GitHub Packages: styles, logo, footer, cookie notice, theme toggle and colour picker. Its Storybook (`ui.<domain>`) is linked through `STORYBOOK_URL`. |
| Infrastructure       | authentik (`id.<domain>`) and Prometheus/Grafana on the VPS, plus `local/compose.yaml`, which runs every site together locally.                                                             |

All five are sibling folders under `Documents\GitHub`; Infrastructure's local compose file relies on that layout.

## Prerequisites

- **Node 26** (`.nvmrc`, so `nvm use 26`).
- **`NODE_AUTH_TOKEN`**: `@thebensage-dev/ui` is on GitHub Packages, which needs a token to install even a public package. Create a classic personal access token with only the `read:packages` scope, copy `.npmrc.example` to `.npmrc` and replace the placeholder with it. `.npmrc` is gitignored, and npm reads it itself, so plain `npm install` and `npm ci` just work.
- Docker Desktop, for the local stack.

## Editing the content

All the wording, links and the project list live in [`src/content/site.ts`](src/content/site.ts). To add a project, add an entry to `projects` with the name of the env var that will hold its URL, then set that env var where the site runs (and add an `APP_ENV_` line for it in `ci.yml`). The current ones, `USER_DIRECTORY_URL`, `API_URL` and `STORYBOOK_URL`, are listed under [Running it](#running-it).

The "How this site is built" section (`stack` in the same file) sums up the hosting, CI/CD, shared UI, sign-in and monitoring setup.

The privacy notice (`/privacy`) and terms (`/terms`) live in [`src/content/legal.ts`](src/content/legal.ts) and are linked from the footer here, from the User Directory's footer and from authentik's guest sign-up form. They describe what is actually deployed (logs kept 14 days, metrics 30 days, sign-in records up to 12 months, only essential cookies, IONOS for hosting, Cloudflare for DNS and email forwarding, SMTP2GO for sending email and Gmail for correspondence), so update them, and the date, whenever that changes.

> **TODO (after go-live):** write a fuller account of the setup (VPS and Coolify, Cloudflare, the deploy pipeline, authentik, monitoring) and link it from that section. Until then, keep its wording to what is actually set up, and don't quote uptime or performance figures.

## Running it

Settings are optional locally. To change any of them, copy `.env.example` to `.env.local` (gitignored):

| Env var              | What it does                                                                                                                               | When unset              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `SITE_URL`           | This site's public URL, for link previews, `robots.txt` and the sitemap.                                                                   | Relative URLs           |
| `USER_DIRECTORY_URL` | User Directory project link.                                                                                                               | `http://localhost:3000` |
| `API_URL`            | TheBensage API project link, and where `/api-reference` reads its OpenAPI document (`apiReference.specPath` in `site.ts`).                 | `http://localhost:3002` |
| `API_INTERNAL_URL`   | Server-side address for that OpenAPI fetch, for when the public hostname doesn't resolve from inside a container (the local Docker stack). | `API_URL`               |
| `STORYBOOK_URL`      | Shared UI project link.                                                                                                                    | `http://localhost:6006` |
| `STATUS_URL`         | The footer's "Live status" link to Grafana's public dashboard.                                                                             | No link                 |

All of them are read when a page is served, not at build time. In production the pipeline sets them from `DOMAIN` (see [Deploying](#deploying-coolify)).

```bash
npm ci           # token from .npmrc
npm run dev      # http://localhost:3001
npm run check    # format check, lint, typecheck
npm run build    # production build (CI runs it too)
```

The dev server uses port 3001 so it can run next to the User Directory's `npm run dev` on 3000 and Storybook on 6006, which is where the project links point by default.

## Running everything together in Docker

The local all-sites stack lives in **Infrastructure** as `local/compose.yaml`, because it builds every repo, not just this one. It runs this site, the User Directory and Storybook behind a Caddy proxy, plus authentik and Prometheus/Grafana. See Infrastructure's README, "Running all the sites locally". In short, copy `Infrastructure/local/.env.example` to `.env` and fill in `NODE_AUTH_TOKEN` (the same `read:packages` token) and `SERVICE_PASSWORD_AKADMIN` (authentik's admin password), then:

```bash
cd ../Infrastructure/local
docker compose up --build -d
```

This site is then at http://localhost:8080. To build only this image:

```bash
npm run docker:build   # passes the token from .npmrc as a build secret
```

## CI

One workflow, `.github/workflows/ci.yml` ("CI"), with the same shape as the other three repos:

| Job                        | Runs on                    | What it does                                                                                                                                                              |
| -------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Check**                  | every PR and push          | `npm ci` (installs `@thebensage-dev/ui` with the workflow's own `GITHUB_TOKEN`), then formatting, lint, type-check and `npm run build`.                                   |
| **Build image**            | push to `main`, manual run | Builds the Dockerfile and pushes `ghcr.io/thebensage-dev/portfolio:sha-<commit>` (and `:main`), and keeps the 10 newest.                                                  |
| **Check Coolify is ready** | push to `main`, manual run | Runs next to **Build image**, the same in every repo: is `DOMAIN` set and does `https://coolify.<DOMAIN>/api/health` answer? If not, the deploy is skipped with a notice. |
| **Deploy to Coolify**      | after your approval        | Only when Coolify is ready: sends the image tag and the app's settings to Coolify through Infrastructure's shared deploy step, and waits for the result.                  |

Before go-live (no `DOMAIN`, or Coolify not answering) the deploy is skipped with a notice, so runs stay green and never ask for an approval.

One-time GitHub setup: give this repo read access to the package, so `GITHUB_TOKEN` can install it. On GitHub, open thebensage-dev > Packages > ui > Package settings > Manage Actions access, and add this repository with **Read**. Without it, **Check** fails at "Install dependencies" with a 403. `.github/dependabot.yml` opens weekly PRs for npm, the Dockerfile's base image and actions; it needs no secret, because the same grant lets Dependabot read the package.

## Deploying (Coolify)

Deploys go through this repo's pipeline (`.github/workflows/ci.yml`), never through Coolify's own auto-deploy. On every push to `main` (or Actions > CI > **Run workflow**):

1. **check** runs the checks and the build.
2. **image** builds the production image from that commit and pushes it to GitHub's container registry as `ghcr.io/thebensage-dev/portfolio:sha-<commit>` (and `:main`). The build gets `@thebensage-dev/ui` with the job's own `GITHUB_TOKEN`.
3. **deploy** waits for your approval, then Infrastructure's shared deploy action (`thebensage-dev/Infrastructure/.github/actions/coolify-deploy`) writes the app's runtime settings into Coolify from this repo's GitHub secrets and variables, points the app at the new image tag, starts the deployment and waits until Coolify reports it finished.

Coolify only runs images; it builds nothing and holds no tokens of its own. The **image** job keeps the 10 newest images on ghcr.io (about 10 deploys to roll back to) and deletes older ones, and Coolify's own Docker cleanup (Servers > the server > Docker Cleanup) removes images the server no longer uses.

**One-time setup on GitHub:** Settings > Environments > New environment `production`: tick **Required reviewers** and add yourself (later, your team), and under **Deployment branches and tags** allow only `main`. **Secrets** are environment secrets there, so only an approved deploy from `main` can read them; a pull request or another branch never sees them. **Variables** aren't secret and are set once for every repo as organization variables (thebensage-dev > Settings > Secrets and variables > Actions > Variables). The script in Infrastructure's README ("Every value for all four repos at once") sets all of it. Until `DOMAIN` exists, the deploy job is skipped.

| Name            | Kind               | Value                                                                                                                                                                                                                                                                                                          |
| --------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DOMAIN`        | org variable       | `example.com`. The pipeline derives every address from it: `SITE_URL` (`https://example.com`), `USER_DIRECTORY_URL` (`users.`), `API_URL` (`api.`), `STORYBOOK_URL` (`ui.`) and `STATUS_URL`, the Live status link on `grafana.` (its token is a hash of the domain, computed the same way in Infrastructure). |
| `COOLIFY_TOKEN` | environment secret | Coolify API token with **write** and **deploy** (Keys & Tokens > API tokens; enable API Access under Settings > Advanced first)                                                                                                                                                                                |

Optional overrides: `COOLIFY_URL` (variable) if Coolify isn't at `https://coolify.<DOMAIN>`, and `COOLIFY_APP_UUID` (variable) if the Coolify app isn't named `portfolio`.

**One-time setup in Coolify:** New resource > **Docker Image**, named `portfolio`, image `ghcr.io/thebensage-dev/portfolio`, tag `main` (the pipeline sets the exact tag on every deploy). If the image on ghcr.io is private, the server needs a one-time `docker login ghcr.io` (Infrastructure README, "Coolify can pull the app images"). Then:

| Setting                | Value                                         |
| ---------------------- | --------------------------------------------- |
| Port (Ports Exposes)   | `3000`                                        |
| Domains                | `https://example.com,https://www.example.com` |
| Persistent storage     | None. This site writes nothing to disk.       |
| Auto deploy / webhooks | Off. The pipeline deploys.                    |

All the settings are read when a page is served, so one image works on any domain. The image is a multi-stage build on `node:26-alpine` with `output: "standalone"` (about 280 MB, most of it the Node base image). Keep its `node:26-alpine` tag in step with `.nvmrc`.

## Licence

MIT, see [`LICENSE`](LICENSE). Copyright (c) 2026 TheBensage.
