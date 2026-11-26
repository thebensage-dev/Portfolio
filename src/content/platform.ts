// Wording for the platform pages (/platform, /platform/sign-in, /platform/email,
// /platform/how-i-work). Keep it true to
// what is deployed: the sign-in details come from Infrastructure's authentik blueprint
// (identity/authentik/blueprints/platform.yaml), the email details from its README and the
// Grafana alert rules (monitoring/grafana/provisioning/alerting/rules.yaml).

import {
  Activity,
  BellRing,
  GitPullRequest,
  ScrollText,
  Split,
  UserRoundCheck,
  Wrench,
  Eye,
  BookOpen,
  Code,
  FileCode,
  FingerprintPattern,
  Forward,
  Globe,
  Inbox,
  KeyRound,
  ListChecks,
  Laptop,
  LockKeyhole,
  LogOut,
  Mail,
  MailCheck,
  Send,
  Server,
  ShieldCheck,
  Ticket,
  UserCheck,
  UserPlus,
  Users,
  type LucideIcon,
  Workflow,
} from "lucide-react";

export type PlatformPage = {
  /** The route, also the canonical URL. */
  path: string;
  /** Link text in the header, footer and breadcrumbs. */
  navLabel: string;
  eyebrow: string;
  title: string;
  /** Meta description and the card text on the other pages. */
  description: string;
  icon: LucideIcon;
};

export const platformPages = {
  overview: {
    path: "/platform",
    navLabel: "Platform",
    eyebrow: "The platform",
    title: "How the platform works",
    description:
      "The self-hosted platform behind every project: one VPS, Coolify, approval-gated CI/CD, single sign-on, monitoring, logs and email, all set up as code.",
    icon: Server,
  },
  signIn: {
    path: "/platform/sign-in",
    navLabel: "Sign-in and access",
    eyebrow: "Single sign-on",
    title: "One account for every app",
    description:
      "How sign-in works across the sites: single sign-on and single sign-out through my own authentik, a request-access page approved app by app, and an email at every step.",
    icon: KeyRound,
  },
  email: {
    path: "/platform/email",
    navLabel: "Email",
    eyebrow: "Email delivery",
    title: "Email that actually arrives",
    description:
      "How the platform sends and receives email: SMTP2GO on a verified domain for access requests, approvals and alerts, and Cloudflare forwarding for the public addresses.",
    icon: Mail,
  },
  agentic: {
    path: "/platform/how-i-work",
    navLabel: "How I work",
    eyebrow: "Engineering workflow",
    title: "From idea to production",
    description:
      "How I take a change from idea to production: clear outcomes, written house rules in every repo, real verification before anything ships, and every review, commit and deploy approved by me.",
    icon: Workflow,
  },
} satisfies Record<string, PlatformPage>;

/** The API reference (/api-reference) as a card next to the deep dives on /platform. */
export const apiReferenceCard: PlatformPage = {
  path: "/api-reference",
  navLabel: "API",
  eyebrow: "API",
  title: "API reference",
  description:
    "Every endpoint of the API, generated from the OpenAPI document the live API serves.",
  icon: BookOpen,
};

/** The deep-dive pages, in the order the overview and the homepage list them. */
export const deepDives: PlatformPage[] = [
  platformPages.signIn,
  platformPages.email,
  platformPages.agentic,
];

/** Shown on the homepage, under the projects. */
export const platformTeaser = {
  eyebrow: "Behind the scenes",
  title: "The platform under the projects",
  intro:
    "I run everything myself, from the server to the sign-in to the email, and each piece is set up as code in a public repo. Pick a part to see how it works.",
  overviewLabel: "See the whole platform",
  highlights: [
    { value: "6", label: "apps live on one VPS" },
    { value: "1", label: "account for every app" },
    { value: "0", label: "settings typed into the server" },
  ],
};

/** /platform: what runs where. `env` names the env var holding the public URL (as in `projects`);
 *  `page` links to a page on this site instead; entries with neither are shown without a link. */
export const platformMap = {
  title: "What runs where",
  intro:
    "Every app has its own subdomain and its own Coolify app on the same VPS. Cloudflare answers DNS, and Coolify's proxy routes each name to its container with an HTTPS certificate.",
  apps: [
    { host: "thebensage.com", name: "Portfolio", detail: "This site", env: "SITE_URL" },
    { host: "users.", name: "User Directory", detail: "Next.js app", env: "USER_DIRECTORY_URL" },
    {
      host: "api.",
      name: "API",
      detail: ".NET and PostgreSQL",
      env: "API_URL",
      page: "/api-reference",
    },
    { host: "ui.", name: "Storybook", detail: "The shared components", env: "STORYBOOK_URL" },
    { host: "id.", name: "authentik", detail: "Sign-in for every app" },
    { host: "grafana.", name: "Grafana", detail: "Metrics, logs and alerts" },
  ],
  deepDivesTitle: "Take a closer look",
};

/** /platform/sign-in */
export const signInPage = {
  intro:
    "Every site here signs in through my own authentik instance over OpenID Connect. Sign in once and you're signed in everywhere; sign out once and you're signed out everywhere. Getting access is one page, and I approve it app by app.",
  sso: {
    title: "Sign in once, use every app",
    points: [
      {
        icon: KeyRound,
        title: "Single sign-on",
        description:
          "When you open a site signed out, it quietly asks authentik whether you're already signed in (prompt=none). If you are, you're in without seeing a form; if not, you stay on the page as a visitor, with no error. Crawlers and uptime checks skip the check.",
      },
      {
        icon: LogOut,
        title: "Single sign-out",
        description:
          "Sign out anywhere and authentik ends its session, then loads each app's front-channel logout page in a hidden frame, so every site drops its own session too.",
      },
      {
        icon: FingerprintPattern,
        title: "Passkeys and two-factor",
        description:
          "Sign in with a password or a passkey offered straight away by the browser, and add an authenticator app for two-factor. The sign-in pages carry the same brand as the sites.",
      },
    ],
  },
  flow: {
    title: "How getting access works",
    intro:
      "One request-access page serves every app. Each app links to it with its own box already ticked, and the account works straight away, but it unlocks nothing until I approve an app.",
    /** `actor` is who does the step: shown as a label on it. */
    steps: [
      {
        icon: UserPlus,
        actor: "You",
        title: "Create an account",
        description:
          "Name, email, username and password. A second account with the same email or username is refused on the form. Already signed in? This step is skipped.",
      },
      {
        icon: ListChecks,
        actor: "You",
        title: "Pick the apps",
        description:
          "Tick what you'd like, with an optional reason. authentik keeps the picks on your account and sends you back to the app you came from, signed in.",
      },
      {
        icon: Send,
        actor: "authentik",
        title: "Emails go out",
        description:
          "You get a “We've got your request” email, and I get a “New access request” email at admin@ with your picks, your reason and a button to review it in authentik.",
      },
      {
        icon: UserCheck,
        actor: "Me",
        title: "Approve, app by app",
        description:
          "Approving is adding you to that app's group. No form to fill in and nothing to remember: the group is the permission.",
      },
      {
        icon: MailCheck,
        actor: "authentik",
        title: "“You're in”",
        description:
          "A rule watches group changes and emails you once per approved app, with a button to open it. The access applies at your next sign-in to that app.",
      },
    ],
  },
  access: {
    title: "Who can do what",
    intro:
      "Anyone with an account can sign in to every public app. What you can do there comes from the groups in your sign-in token, which each app checks itself.",
    columns: { app: "App", group: "Group", unlocks: "Unlocks" },
    rows: [
      { app: "Portfolio", group: "portfolio-members", unlocks: "The colour palette on this site" },
      {
        app: "User Directory",
        group: "user-directory-editors",
        unlocks: "Adding, editing and deleting people",
      },
      { app: "API", group: "api-editors", unlocks: "Sending real requests from the API docs" },
      {
        app: "Grafana",
        group: "grafana-viewers, grafana-admins",
        unlocks: "Dashboards and logs (I add these by hand; they can't be requested)",
      },
    ],
  },
  details: {
    title: "The details that matter",
    points: [
      {
        icon: FileCode,
        title: "Everything as code",
        description:
          "Groups, apps, sign-in pages, emails and the approval rule live in one versioned blueprint that authentik re-applies on start and hourly, so a change in the UI can't drift.",
      },
      {
        icon: LockKeyhole,
        title: "Least privilege",
        description:
          "People who sign up are external users: they reach the apps they're allowed into and never authentik's own admin pages. Writes to the API need an editor group, checked by the API itself.",
      },
      {
        icon: Ticket,
        title: "Guest invites",
        description:
          "For a short-term guest I create a single-use invite link with an expiry. They pick their own password, can edit the User Directory and nothing else, and I deactivate them afterwards.",
      },
      {
        icon: ShieldCheck,
        title: "Privacy built in",
        description:
          "The sign-up form says what's stored and links the privacy notice. Accounts are deleted when a request is refused or access ends.",
      },
    ],
  },
  tryIt: {
    title: "Try it",
    body: "Request access and you'll get the real emails. I approve requests by hand, so it may take a little while.",
    requestAccess: "Request access",
    signIn: "Sign in",
    signedIn: "You're signed in, so you've already used single sign-on.",
  },
  links: { source: "The blueprint on GitHub" },
};

/** /platform/email */
export const emailPage = {
  intro:
    "Two parts of the platform send email: authentik, for access requests and approvals, and Grafana, for alerts. Both go through SMTP2GO from noreply@thebensage.com, on a domain verified with DNS records, so the messages land in the inbox rather than spam.",
  flow: {
    title: "How a message travels",
    outbound: {
      label: "Sending",
      steps: [
        { icon: Server, title: "authentik or Grafana", detail: "In Docker on the VPS" },
        { icon: LockKeyhole, title: "SMTP over STARTTLS", detail: "Port 587, signed in" },
        { icon: Send, title: "SMTP2GO", detail: "Signs and delivers" },
        { icon: Inbox, title: "Your inbox", detail: "From noreply@" },
      ],
    },
    inbound: {
      label: "Receiving",
      steps: [
        { icon: Mail, title: "hello@ or admin@", detail: "Public addresses" },
        { icon: Globe, title: "Cloudflare", detail: "Email Routing" },
        { icon: Forward, title: "Forwarded", detail: "To my own inbox" },
      ],
    },
  },
  addresses: {
    title: "Three addresses, three jobs",
    items: [
      {
        address: "noreply@thebensage.com",
        job: "The sender of every automatic email. Nobody reads it, so replies aren't invited.",
      },
      {
        address: "hello@thebensage.com",
        job: "The public contact address on every site, the privacy notice and the terms.",
      },
      {
        address: "admin@thebensage.com",
        job: "Where access requests and alerts go, so personal mail stays separate.",
      },
    ],
  },
  senders: {
    title: "What gets sent",
    authentik: {
      icon: Users,
      title: "Sign-in emails",
      description: "Sent by authentik during the request-access flow.",
      items: [
        "“We've got your request”, to you",
        "“New access request”, to admin@",
        "“You're in”, to you, once per approved app",
      ],
    },
    grafana: {
      icon: BellRing,
      title: "Alerts",
      description: "Sent by Grafana when a rule fires, and again when it resolves.",
      items: [
        "Site down",
        "Site slow",
        "TLS certificate expiring",
        "Disk almost full",
        "Memory high",
        "CPU high",
        "Monitoring component down",
      ],
    },
  },
  preview: {
    title: "The “You're in” email",
    caption:
      "Built from an HTML template with inline styles, in the same palette as the sites: the colours and the logo are generated from the design system when authentik's image is built. Next, I'm bringing the template design in-house, so it no longer relies only on authentik's own emails.",
    subject: "You're in: your User Directory access is approved",
    heading: "You're in",
    from: "TheBensage <noreply@thebensage.com>",
    greeting: "Hi Alex,",
    body: "Your access to the User Directory has been approved. Sign in with the username alex and the password you chose when you asked.",
    button: "Open the User Directory",
  },
  practices: {
    title: "Done properly",
    points: [
      {
        icon: ShieldCheck,
        title: "A verified domain",
        description:
          "thebensage.com is a verified sender domain in SMTP2GO, with its DKIM and return-path records in Cloudflare, so receiving servers can check every message really comes from the domain.",
      },
      {
        icon: Activity,
        title: "No click tracking",
        description:
          "Link tracking is switched off, so every button in an email goes straight to the site it names, not through a redirect on someone else's domain.",
      },
      {
        icon: Code,
        title: "Settings, not code",
        description:
          "The SMTP server, port, TLS, login, sender and recipients are seven explicit settings in GitHub, passed in by the deploy pipeline. The password is a secret only an approved deploy can read. A new provider is new values, not a code change.",
      },
      {
        icon: Laptop,
        title: "Tested before it ships",
        description:
          "The local Docker stack sends the same emails through the same provider, so a change to a template or a setting is checked end to end before production.",
      },
    ],
  },
};

/** /platform/how-i-work */
export const agenticPage = {
  intro:
    "I design, build and run this platform myself. AI-assisted tooling speeds up the routine parts, the way linters and CI do, but the architecture, the decisions, the reviews and every deploy are mine.",
  workflow: {
    title: "How a change gets made",
    steps: [
      {
        icon: ListChecks,
        actor: "Me",
        title: "Define the outcome",
        description:
          "I start from what a change should achieve, like “show the sign-up flow on the portfolio”, and split it into separate pieces of work so unrelated jobs don't tangle.",
      },
      {
        icon: Split,
        actor: "Me",
        title: "Build it",
        description:
          "I write and refine the code to the rules each repo sets out, using AI-assisted tooling for routine work such as boilerplate and first drafts.",
      },
      {
        icon: UserRoundCheck,
        actor: "Me",
        title: "Make the calls",
        description:
          "When a choice changes the result, like the shape of this site, I weigh a short set of options and pick one. Design decisions don't get made by default.",
      },
      {
        icon: ShieldCheck,
        actor: "Checks",
        title: "Prove it works",
        description:
          "Format, lint and type checks, real production builds, workflow linting, screenshots at phone and desktop widths, and the whole platform run locally in Docker. “It parses” doesn't count as done.",
      },
      {
        icon: GitPullRequest,
        actor: "Me",
        title: "Review, commit and approve",
        description:
          "I read every change, commit it myself, and approve each production deploy in GitHub. Nothing ships on its own.",
      },
    ],
  },
  practices: {
    title: "What makes it work",
    points: [
      {
        icon: ScrollText,
        title: "House rules in every repo",
        description:
          "Each repo documents its version pins and why, where content lives, the styling rules, how CI and deploys work, and hard lines such as never printing a token, so every change starts from the same rules.",
      },
      {
        icon: Eye,
        title: "Checked against the source",
        description:
          "Instructions are checked against the current docs at the exact version I run (Coolify's, for example), and files are re-read rather than trusting old notes.",
      },
      {
        icon: LockKeyhole,
        title: "Secrets stay with me",
        description:
          "Tokens and passwords are typed by me into GitHub or a local file that never gets printed. Production secrets sit behind an approval-gated environment, so nothing deploys without me.",
      },
      {
        icon: Wrench,
        title: "Tested where it runs",
        description:
          "The whole platform runs locally in Docker on my laptop, and pages are checked in a real browser at phone and desktop widths before anything goes live.",
      },
      {
        icon: FileCode,
        title: "Guides you can follow",
        description:
          "Anything done by hand, like going live or switching email provider, gets a step-by-step guide: one step at a time, exact values, nothing assumed.",
      },
      {
        icon: Code,
        title: "Decisions written down",
        description:
          "Lasting decisions (the GitHub organisation, the email addresses, the deploy rules) are recorded, so later work picks up from what's already settled.",
      },
    ],
  },
  links: {
    claude: { label: "The AI tooling I use: Claude Code", url: "https://claude.com/claude-code" },
  },
  skill: {
    title: "Why it matters to a team",
    body: "The habits behind this are the ones a team needs: breaking work into clear outcomes, writing down the rules, demanding evidence, and reviewing everything before it ships. They let one developer design, build, secure and run a platform this size, and every line of it is mine to answer for.",
  },
};
