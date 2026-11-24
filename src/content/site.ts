// Everything you'd want to reword on the site lives here.

import {
  Activity,
  Blocks,
  Braces,
  Container,
  Eye,
  Gauge,
  GitBranch,
  Globe,
  KeyRound,
  Laptop,
  Mail,
  Palette,
  Rocket,
  ScrollText,
  Server,
  ShieldCheck,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  type SimpleIcon,
  siCaddy,
  siClaude,
  siCloudflare,
  siCoolify,
  siDependabot,
  siDocker,
  siDotnet,
  siGithub,
  siGithubactions,
  siGrafana,
  siIonos,
  siLetsencrypt,
  siAuthentik,
  siPostgresql,
  siNextdotjs,
  siNodedotjs,
  siPrometheus,
  siReact,
  siStorybook,
  siTailwindcss,
  siTraefikproxy,
  siTypescript,
  siVitest,
} from "simple-icons";

/** Where the source code lives. Each linked repo must be public, or the link is a 404. */
const GITHUB_ORG = "https://github.com/thebensage-dev";

export const site = {
  name: "TheBensage",
  role: "Full-stack developer · Next.js · .NET",
  headline: "Web applications, from database to deployment.",
  /** The part of the headline drawn in the brand gradient. */
  headlineHighlight: "from database to deployment",
  intro:
    "I build full-stack applications: Next.js, React and TypeScript on the front end, .NET APIs on PostgreSQL behind them, and the infrastructure they run on, which I manage myself. Each project below is live.",
  footerTagline:
    "Full-stack web development with Next.js, React, TypeScript and .NET, self-hosted on a VPS I manage.",
  /** The GitHub organization that holds every repo; its page lists the public ones. */
  githubUrl: GITHUB_ORG,
  /** Public contact address (mailto links, privacy notice and terms). */
  email: "hello@thebensage.com",
};

/** This site's public URL (SITE_URL, no trailing slash), read at request time. Used for link
 *  previews, robots.txt and the sitemap; they fall back to relative URLs when it's unset. */
export function siteUrl(): string | undefined {
  return process.env.SITE_URL?.replace(/\/$/, "") || undefined;
}

/** Public status page (a read-only Grafana dashboard), read at request time. Hidden when unset. */
export function statusUrl(): string | undefined {
  return process.env.STATUS_URL || undefined;
}

export type Tool = { name: string; url: string } & (
  { logo: SimpleIcon; icon?: never } | { icon: LucideIcon; logo?: never }
);
export type ToolGroup = { group: string; items: Tool[] };

export type Project = {
  title: string;
  description: string;
  tags: string[];
  /** Name of the env var that holds the project's public URL, and its local-dev fallback. */
  url: { env: string; fallback: string };
  /** Link text on the card; "Open the app" if not set. */
  cta?: string;
  /** The project's GitHub repo (public). */
  source: string;
  /** A page on this site that the card and footer open instead of the live app. */
  page?: string;
};

export const projects: Project[] = [
  {
    title: "User Directory",
    description:
      "Search, filter and manage a directory of people. Server Components read from TheBensage API, Server Actions send each edit with your sign-in token, and a card or table view remembers your choice.",
    tags: ["Next.js 16", "React 19", "Server Actions", "Tailwind v4"],
    url: { env: "USER_DIRECTORY_URL", fallback: "http://localhost:3000" },
    source: `${GITHUB_ORG}/UserDirectory`,
  },
  {
    title: "TheBensage API",
    description:
      "A general-use REST API that the User Directory runs on. Its first feature is a people directory with accent-insensitive search, filters and paging in PostgreSQL, OpenAPI with interactive docs, and writes signed in through authentik and logged per change.",
    tags: [".NET", "Entity Framework Core", "PostgreSQL", "OpenAPI"],
    url: { env: "API_URL", fallback: "http://localhost:3002" },
    cta: "Browse the API",
    source: `${GITHUB_ORG}/Api`,
    page: "/api-reference",
  },
  {
    title: "Shared UI",
    description:
      "The design system behind these sites: React components, hooks and one role-based colour palette that also brands the sign-in pages and emails, published as an npm package on GitHub Packages and documented in Storybook.",
    tags: ["React 19", "Storybook 10", "Tailwind v4", "Vitest"],
    url: { env: "STORYBOOK_URL", fallback: "http://localhost:6006" },
    cta: "Browse the components",
    source: `${GITHUB_ORG}/SharedUI`,
  },
];

/** Shown after the projects as "Coming next": what I'm adding to the platform. */
export const comingNext = {
  title: "Coming next",
  items: [
    { name: "RabbitMQ", detail: "Messaging between the API and the apps" },
    { name: "Stripe", detail: "Payments" },
  ],
};

/** Reads a project's URL from the environment at request time. */
export function projectUrl(project: Project): string {
  return process.env[project.url.env] || project.url.fallback;
}

/** Where a project's links on this site go: its page here if it has one, else the live app. */
export function projectHref(project: Project): string {
  return project.page ?? projectUrl(project);
}

export const stack = {
  title: "Every piece, and the tools behind it",
  intro:
    "Every project runs on infrastructure I set up and maintain: the server, the deployment pipeline, sign-in, monitoring, logging, email and security.",
  /** The path a change takes from my editor to your browser. */
  pipeline: [
    { icon: GitBranch, title: "Pull request", detail: "One open-source repo per project" },
    { icon: Workflow, title: "GitHub Actions", detail: "Checks, tests, Docker image, approval" },
    { icon: Container, title: "Coolify", detail: "Pulls the approved image and deploys" },
    { icon: Globe, title: "Cloudflare", detail: "DNS for the domain and subdomains" },
  ],
  pieces: [
    {
      icon: Server,
      title: "Self-hosted VPS",
      description:
        "One IONOS VPS runs everything. Coolify manages each project as its own app, with HTTPS certificates handled by its proxy.",
      tags: ["IONOS", "Coolify"],
    },
    {
      icon: Container,
      title: "Docker builds",
      description:
        "Every app ships as a lean multi-stage Docker image, built once in CI, so the image I approve is exactly the one that goes live.",
      tags: ["Docker", "Node 26"],
    },
    {
      icon: Rocket,
      title: "CI/CD",
      description:
        "GitHub Actions checks every pull request and push, and builds the Docker image. A green build on main deploys only after a reviewer approves it, and the pipeline sends every setting to the server, so nothing is configured by hand.",
      tags: ["GitHub Actions", "Dependabot"],
    },
    {
      icon: Blocks,
      title: "One design system",
      description:
        "One npm package gives every site the same components, motion and brand, documented in Storybook on its own subdomain. Every colour is defined once, by role (surface, primary, danger…), in a single file: the sites, Storybook, the sign-in pages and the emails are all generated from it, so changing the palette there changes it everywhere.",
      tags: ["@thebensage-dev/ui", "Storybook", "Design tokens"],
    },
    {
      icon: KeyRound,
      title: "Single sign-on",
      description:
        "My own authentik instance signs you in to every site over OpenID Connect: sign in once for all of them, sign out once from all of them. Passkeys and two-factor, group-based access, one “Request access” page that I approve app by app (with emails at each step) and single-use invite links for guests, all set up from a versioned blueprint.",
      tags: ["authentik", "OIDC"],
    },
    {
      icon: Activity,
      title: "Monitoring and alerts",
      description:
        "Prometheus collects metrics from the server, each container and HTTPS checks on every site. Grafana charts them and emails me when a site goes down, slows down or a certificate is about to expire.",
      tags: ["Prometheus", "Grafana", "Blackbox exporter", "cAdvisor"],
    },
    {
      icon: ScrollText,
      title: "Centralised logs",
      description:
        "Alloy gathers the output of every container and stores it in Loki, so errors from any app can be searched in the same Grafana, next to the metrics.",
      tags: ["Loki", "Alloy", "Grafana"],
    },
    {
      icon: Mail,
      title: "Email",
      description:
        "Access requests, approvals and alerts go out through SMTP2GO from noreply@, on a verified domain with its DNS records in Cloudflare. The public addresses are forwarded by Cloudflare Email Routing, and every setting comes from the pipeline.",
      tags: ["SMTP2GO", "Cloudflare Email Routing"],
    },
    {
      icon: Gauge,
      title: "Public status page",
      description:
        "A read-only Grafana dashboard anyone can open shows each site's status, uptime and response time, and the server's CPU, memory and disk, from the same checks that send the alerts. It's linked in the footer as Live status.",
      tags: ["Grafana", "Blackbox exporter"],
    },
    {
      icon: Users,
      title: "Ready for a team",
      description:
        "Every project lives in one GitHub organization, in the open. Main is protected by a ruleset (pull requests must pass CI, no force pushes), and production secrets sit behind an approval-gated environment, so only a reviewed deploy can read them. Shared settings are set once for the whole organization, and each repo derives the rest, so a new teammate or a new project needs no secrets copied around.",
      tags: ["GitHub organization", "Protected branches", "Environments"],
    },
    {
      icon: ShieldCheck,
      title: "Security by default",
      description:
        "HTTPS everywhere with HSTS and security headers, sign-in through authentik with passkeys, two-factor and group-based roles for the admin tools and for editing, and no public ports for internal services. Secrets stay out of git and out of Docker images, and image versions are pinned and updated through reviewed Dependabot PRs.",
      tags: ["HSTS", "CSP", "Passkeys", "Dependabot"],
    },
    {
      icon: Laptop,
      title: "The whole platform, locally",
      description:
        "One Docker Compose command runs every site, sign-in, monitoring and logs on my laptop, built the same way as production, so changes are checked end to end before they ship.",
      tags: ["Docker Compose", "Caddy"],
    },
  ],
  /** Logos and links for the tools above. Logos come from simple-icons; tools it doesn't have
   *  use a Lucide icon instead. */
  tools: [
    {
      group: "Apps",
      items: [
        { name: "Next.js", url: "https://nextjs.org", logo: siNextdotjs },
        { name: "React", url: "https://react.dev", logo: siReact },
        { name: "TypeScript", url: "https://www.typescriptlang.org", logo: siTypescript },
        { name: "Tailwind CSS", url: "https://tailwindcss.com", logo: siTailwindcss },
        { name: "Node.js", url: "https://nodejs.org", logo: siNodedotjs },
        { name: ".NET", url: "https://dotnet.microsoft.com", logo: siDotnet },
        { name: "PostgreSQL", url: "https://www.postgresql.org", logo: siPostgresql },
        { name: "Storybook", url: "https://storybook.js.org", logo: siStorybook },
        { name: "Vitest", url: "https://vitest.dev", logo: siVitest },
      ],
    },
    {
      group: "Hosting and delivery",
      items: [
        { name: "IONOS", url: "https://www.ionos.com", logo: siIonos },
        { name: "Coolify", url: "https://coolify.io", logo: siCoolify },
        { name: "Docker", url: "https://www.docker.com", logo: siDocker },
        { name: "Traefik", url: "https://traefik.io", logo: siTraefikproxy },
        { name: "Cloudflare", url: "https://www.cloudflare.com", logo: siCloudflare },
        { name: "Let's Encrypt", url: "https://letsencrypt.org", logo: siLetsencrypt },
        { name: "GitHub", url: "https://github.com", logo: siGithub },
        {
          name: "GitHub Actions",
          url: "https://github.com/features/actions",
          logo: siGithubactions,
        },
        { name: "Dependabot", url: "https://github.com/dependabot", logo: siDependabot },
        { name: "Caddy", url: "https://caddyserver.com", logo: siCaddy },
      ],
    },
    {
      group: "Sign-in, monitoring and email",
      items: [
        { name: "authentik", url: "https://goauthentik.io", logo: siAuthentik },
        { name: "Prometheus", url: "https://prometheus.io", logo: siPrometheus },
        { name: "Grafana", url: "https://grafana.com", logo: siGrafana },
        { name: "Loki", url: "https://grafana.com/oss/loki/", icon: ScrollText },
        { name: "Alloy", url: "https://grafana.com/oss/alloy/", icon: Workflow },
        { name: "SMTP2GO", url: "https://www.smtp2go.com", icon: Mail },
      ],
    },
    {
      group: "Built with",
      items: [
        { name: "Claude Code", url: "https://claude.com/claude-code", logo: siClaude },
        { name: "GitHub Desktop", url: "https://desktop.github.com", logo: siGithub },
      ],
    },
  ] satisfies ToolGroup[],
};

export const themeDemo = {
  eyebrow: "Try the design system",
  title: "Make the brand your own",
  intro:
    "The brand has three colours, each with a job. Every component asks for a role, not a value, so changing a role here recolours everything that uses it, on this page and in the User Directory.",
  note: "Your choice is saved in a preference cookie and carries over to the User Directory. The logo keeps its own colours.",
  presetsLabel: "Presets",
  themeLabel: "Theme",
  /** Shown instead of the colour picker to anyone who isn't a member (authentik's portfolio-members). */
  locked: {
    title: "Sign in to try the colour palette",
    body: "Picking the brand colours is for members: one account signs you in here, in the User Directory and in the API docs. Light and dark below are open to everyone.",
    signIn: "Sign in",
    memberTitle: "Ask for the colour palette",
    memberBody:
      "You're signed in, but the palette isn't switched on for your account yet. Ask for it and I'll approve it; you'll get an email.",
    requestAccess: "Request access",
    refresh: "Already approved? Refresh your sign-in",
  },
  /** The header's sign-in link and sign-out button. */
  signIn: "Sign in",
  signOut: "Sign out (of every app)",
  account: "Your account: name, email and password",
  roles: {
    primary: { label: "Primary", hint: "Buttons, links, focus rings and selected items" },
    secondary: { label: "Secondary", hint: "Decoration: icon tiles, tags, card edges" },
    accent: { label: "Accent", hint: "Warm calls to action and search highlights" },
  },
  preview: {
    title: "Preview",
    heading: "One palette, three roles",
    primary: {
      button: "Save changes",
      link: "View details",
      progress: "Upload",
    },
    secondary: {
      tile: "Projects",
      tag: "Design",
      body: "Tiles, tags and the top edge of cards.",
    },
    accent: {
      button: "Get started",
      text: "Search matches are",
      match: "highlighted",
    },
    all: "All three together: the rule and the heading above",
    link: "Browse the components",
  },
};

/** The API reference page (/api-reference). The OpenAPI document is fetched from the live app at
 *  request time, so this page always matches what is deployed. */
export const apiReference = {
  /** Env var of the project whose API this is (see `projects`), and where it serves OpenAPI. */
  project: "API_URL",
  specPath: "/openapi/v1.json",
  navLabel: "API",
  eyebrow: "TheBensage API",
  title: "API reference",
  description:
    "Browse TheBensage API, the general-use .NET API the User Directory runs on: every endpoint, parameter, response and schema, generated from the OpenAPI document the live API serves.",
  intro:
    "TheBensage API is a general-use REST API on PostgreSQL. For now it serves one feature, the people directory behind the User Directory, and more will run on it. This reference is generated from the OpenAPI document the running API publishes, so it always describes the version that is live.",
  points: [
    {
      icon: Braces,
      title: "One source of truth",
      description:
        "The OpenAPI document comes straight from the deployed API, not a copy kept in this site. When the API changes, this page changes with it.",
    },
    {
      icon: Eye,
      title: "Browse-only",
      description:
        "Explore endpoints, parameters, responses and schemas, and copy example requests in several languages. Sending requests from this page is turned off.",
    },
    {
      icon: Palette,
      title: "Same design system",
      description:
        "Scalar renders the reference, themed with the shared palette and fonts, so it follows your light or dark choice like the rest of the site.",
    },
  ],
  links: { app: "Open the interactive docs", spec: "OpenAPI document", source: "Source code" },
  unavailable: {
    title: "The reference isn't available right now",
    description: "It appears here automatically as soon as TheBensage API is online.",
  },
};
