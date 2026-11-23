// The privacy notice and terms, linked from the footer of every site (and from the guest sign-up
// form in authentik). Keep them true to what is actually deployed: update them, and `updated`,
// whenever a site starts collecting something new or a new service handles visitor data.

import { site } from "@/content/site";

/** A paragraph, or a bulleted list. `**bold**` at the start of a bullet is rendered bold,
 *  `[text](https://…)` becomes a link and backticks mark a cookie or code name. */
export type LegalBlock = string | string[];
/** `id` makes the section linkable, e.g. /privacy#cookies. */
export type LegalSection = { heading: string; id?: string; body: LegalBlock[] };
export type LegalDoc = {
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const UPDATED = "23 November 2026";

export const privacy: LegalDoc = {
  title: "Privacy notice",
  description: `How ${site.name}'s sites collect and use personal data, and your rights.`,
  updated: UPDATED,
  intro: `This notice applies to all sites operated by ${site.name}: this site, the User Directory, TheBensage API, the component library (Storybook), the sign-in service and the monitoring dashboards. They are a personal portfolio operated by an individual in the UK, who is the controller of the personal data described below. Contact: ${site.email}.`,
  sections: [
    {
      heading: "Data collected",
      body: [
        [
          "**Server logs:** IP address, browser details, the page requested and the time. Kept for 14 days to keep the sites secure and running (legitimate interests).",
          "**Monitoring:** uptime, response times and server load. Kept for 30 days. Contains no personal data.",
          "**Accounts:** if you request access or accept an invite, the sign-in service (authentik) stores your name, email address, username, the reason given for your request, your password (as a secure hash), any passkey or two-factor method, and a log of sign-ins with IP address and browser, kept for up to 12 months. This is necessary to provide the access you requested. Your email address is used only to confirm and decide on your request. Accounts are deleted when a request is refused, when access ends, or on request.",
          "**User Directory and TheBensage API:** anything you enter. It is a demo: enter fictitious details only. Entries may be edited, removed or reset at any time. Each change is recorded with its time and the name of the signed-in account that made it.",
          "**Email:** your address and message, kept only as long as needed to respond.",
        ],
        "Personal data is not sold, used for marketing or used for automated decision-making.",
      ],
    },
    {
      heading: "Cookies",
      id: "cookies",
      body: [
        "The sites use only cookies that are strictly necessary or that store a setting you chose. No analytics, advertising or third-party tracking cookies are used, so no consent is required.",
        [
          "**Sign-in:** session cookies set by the User Directory (`ud_session`, `ud_login`, and `ud_sso_checked`, which remembers for a few minutes that you aren't signed in), this site (`pf_session`, `pf_login` and `pf_sso_checked`, the same jobs for the main site's sign-in), the sign-in service and the monitoring dashboards while you are signed in.",
          "**Preferences:** your light or dark theme (`theme`), the three brand colours you picked on the main site (`colours`, one value such as `teal.sky.mint`) and the User Directory's card or table view (`view`), kept for one year. The theme and colours are shared between the main site and its subdomains (the User Directory and the component library), so your choice applies on each site.",
          "**Cookie notice:** records that you dismissed the cookie notice (`cookie-notice`), kept for one year.",
        ],
        "You can delete or block cookies in your browser settings. Blocking sign-in cookies prevents signing in.",
      ],
    },
    {
      heading: "Service providers",
      body: [
        [
          "**IONOS:** hosts the server.",
          "**Cloudflare:** provides DNS for the domain.",
          "**Google (Gmail):** stores email correspondence.",
        ],
        "Where a provider processes data outside the UK, the transfer is protected by safeguards recognised under UK data protection law.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You have the right to access, correct or delete your personal data, to restrict or object to its processing, and to receive it in a portable format. To exercise these rights, email the address above. Requests are answered within one month.",
        "You may also [lodge a complaint with the Information Commissioner's Office](https://ico.org.uk/make-a-complaint/).",
      ],
    },
    {
      heading: "Changes",
      body: ["This notice may be updated. The date at the top shows the latest version."],
    },
  ],
};

export const terms: LegalDoc = {
  title: "Terms of use",
  description: `Terms for using ${site.name}'s sites.`,
  updated: UPDATED,
  intro: `These terms apply to all sites operated by ${site.name}. By using the sites you accept these terms. If you do not accept them, do not use the sites.`,
  sections: [
    {
      heading: "Service",
      body: [
        "The sites are a personal portfolio and demonstrations, provided free of charge and as is. No guarantee is given that they are accurate, complete or available. They may be changed, reset or withdrawn at any time, and demo data may be deleted without notice.",
      ],
    },
    {
      heading: "Accounts and acceptable use",
      body: [
        [
          "Accounts, access requests and invite links are personal and may be approved, refused or revoked at any time. Keep your credentials confidential.",
          "Enter fictitious details only. Do not add another person's personal data without their consent.",
          "Do not submit content that is unlawful, offensive or misleading, or that you do not have the right to share.",
          "Do not attempt to gain unauthorised access, bypass sign-in, overload or scrape the sites.",
        ],
        "Content or accounts that breach these terms may be removed without notice.",
      ],
    },
    {
      heading: "Liability",
      body: [
        "To the extent permitted by law, no liability is accepted for any loss or damage arising from use of the sites or reliance on their content. Nothing in these terms limits liability that cannot be limited by law, including for death or personal injury caused by negligence, or for fraud.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        `Site content is © ${site.name}. Source code published on GitHub is licensed under the terms in its repository. Third-party names and logos belong to their owners.`,
      ],
    },
    {
      heading: "Governing law",
      body: [
        `These terms are governed by the law of Scotland, and the Scottish courts have jurisdiction. If you live elsewhere in the UK, you keep the protection of your local law and may bring proceedings in your local courts. Questions: ${site.email}.`,
      ],
    },
  ],
};
