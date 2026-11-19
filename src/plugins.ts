import calendarUrl from "./assets/plugins/calendar.svg";
import cloudflareUrl from "./assets/plugins/cloudflare.svg";
import driveUrl from "./assets/plugins/drive.svg";
import dropboxUrl from "./assets/plugins/dropbox.svg";
import githubUrl from "./assets/plugins/github.svg";
import gmailUrl from "./assets/plugins/gmail.svg";
import hubspotUrl from "./assets/plugins/hubspot.svg";
import intercomUrl from "./assets/plugins/intercom.svg";
import linearUrl from "./assets/plugins/linear.svg";
import n8nUrl from "./assets/plugins/n8n.svg";
import neonUrl from "./assets/plugins/neon.svg";
import notionUrl from "./assets/plugins/notion.svg";
import outlookUrl from "./assets/plugins/outlook.svg";
import slackUrl from "./assets/plugins/slack.svg";
import stripeUrl from "./assets/plugins/stripe.svg";
import supabaseUrl from "./assets/plugins/supabase.svg";
import vercelUrl from "./assets/plugins/vercel.svg";
import zoomUrl from "./assets/plugins/zoom.svg";

export type PluginListing = {
  name: string;
  description: string;
  summary: string;
  logo: string;
  popular: boolean;
  platforms: readonly string[];
  score: number;
  overview: readonly string[];
  readTools: readonly string[];
  writeTools: readonly string[];
  categories: readonly string[];
  website: string;
  docs: string;
  support: string;
};

export const PLUGIN_SECTIONS: readonly {
  title: string;
  lede: string;
  plugins: readonly PluginListing[];
}[] = [
  {
    title: "Recommended for you",
    lede: "",
    plugins: [
      {
        name: "GitHub",
        description: "Search and manage repositories.",
        summary: "Search repositories, read code, and open pull requests from an agent.",
        logo: githubUrl,
        popular: true,
        platforms: ["Claude", "ChatGPT", "Cursor", "Grok", "Gemini", "Devin"],
        score: 85,
        overview: [
          "Search repositories, code, and pull requests",
          "Read files, commits, and check runs",
          "Open, review, and merge pull requests",
          "Create issues and reply on threads",
          "List branches and compare refs",
        ],
        readTools: ["List repositories", "Get file contents", "List pull requests", "Get commit", "List issues", "Read check runs", "List branches"],
        writeTools: ["Create pull request", "Comment on issue", "Merge pull request", "Create branch"],
        categories: ["Developer Tools", "Source Control"],
        website: "https://github.com",
        docs: "https://docs.github.com",
        support: "https://support.github.com",
      },
      {
        name: "Gmail",
        description: "Search, create, and manage your emails and calendar events.",
        summary: "Search, create, and manage your emails and calendar events.",
        logo: gmailUrl,
        popular: true,
        platforms: ["Claude", "ChatGPT", "Gemini", "Perplexity"],
        score: 75,
        overview: [
          "Search threads and read messages",
          "Draft and send email",
          "Apply labels and archive threads",
          "Read calendar events tied to a mailbox",
        ],
        readTools: ["List threads", "Get message", "List labels", "Search mail"],
        writeTools: ["Send message", "Create draft", "Modify labels"],
        categories: ["Communication", "Productivity"],
        website: "https://mail.google.com",
        docs: "https://developers.google.com/gmail",
        support: "https://support.google.com/mail",
      },
      {
        name: "Slack",
        description: "Post messages and read channels.",
        summary: "Post messages, read channels, and look up people in a workspace.",
        logo: slackUrl,
        popular: false,
        platforms: ["Claude", "ChatGPT", "Cursor", "Grok", "Muse"],
        score: 65,
        overview: [
          "Read channel history and threads",
          "Post messages and replies",
          "Look up users and channels",
          "React to messages",
        ],
        readTools: ["List channels", "Read history", "Get user", "List members"],
        writeTools: ["Post message", "Reply in thread", "Add reaction"],
        categories: ["Communication", "Teamwork"],
        website: "https://slack.com",
        docs: "https://api.slack.com",
        support: "https://slack.com/help",
      },
      {
        name: "Notion",
        description: "Read and update pages, databases, and tasks.",
        summary: "Read and update pages, databases, and tasks.",
        logo: notionUrl,
        popular: true,
        platforms: ["Claude", "ChatGPT", "Cursor", "Gemini", "Muse"],
        score: 85,
        overview: [
          "Search pages and databases",
          "Read and update page content",
          "Query and edit database rows",
          "Create tasks from an agent",
        ],
        readTools: ["Search", "Get page", "Query database", "List users"],
        writeTools: ["Create page", "Update block", "Add database row"],
        categories: ["Productivity", "Knowledge"],
        website: "https://www.notion.so",
        docs: "https://developers.notion.com",
        support: "https://www.notion.so/help",
      },
      {
        name: "Calendar",
        description: "Create and manage events.",
        summary: "Create, update, and read events on a connected calendar.",
        logo: calendarUrl,
        popular: false,
        platforms: ["Claude", "ChatGPT", "Gemini", "Microsoft"],
        score: 50,
        overview: [
          "List upcoming events",
          "Create and update events",
          "Check free time",
          "Invite people to a meeting",
        ],
        readTools: ["List events", "Get event", "Free/busy"],
        writeTools: ["Create event", "Update event", "Delete event"],
        categories: ["Productivity", "Scheduling"],
        website: "https://calendar.google.com",
        docs: "https://developers.google.com/calendar",
        support: "https://support.google.com/calendar",
      },
      {
        name: "Linear",
        description: "Track issues and projects.",
        summary: "Track issues, projects, and status updates.",
        logo: linearUrl,
        popular: true,
        platforms: ["Claude", "Cursor", "Grok", "Devin"],
        score: 65,
        overview: [
          "Search issues and projects",
          "Create and update issues",
          "Move work between states",
          "Read comments and project briefs",
        ],
        readTools: ["List issues", "Get issue", "List projects", "List teams"],
        writeTools: ["Create issue", "Update issue", "Add comment"],
        categories: ["Developer Tools", "Project Tracking"],
        website: "https://linear.app",
        docs: "https://developers.linear.app",
        support: "https://linear.app/contact",
      },
    ],
  },
  {
    title: "Productivity & Collaboration",
    lede: "",
    plugins: [
      {
        name: "Google Drive",
        description: "Read and write files in connected Drive accounts.",
        summary: "Read and write files in connected Drive accounts.",
        logo: driveUrl,
        popular: true,
        platforms: ["Claude", "ChatGPT", "Gemini", "Cursor"],
        score: 75,
        overview: [
          "Search files and folders",
          "Read document contents",
          "Create and update files",
          "Share files with people",
        ],
        readTools: ["List files", "Get file", "Export document"],
        writeTools: ["Create file", "Update file", "Share file"],
        categories: ["Productivity", "Files"],
        website: "https://drive.google.com",
        docs: "https://developers.google.com/drive",
        support: "https://support.google.com/drive",
      },
      {
        name: "Outlook",
        description: "Search your emails and calendar events.",
        summary: "Search your emails and calendar events.",
        logo: outlookUrl,
        popular: true,
        platforms: ["Claude", "ChatGPT", "Microsoft", "Gemini"],
        score: 40,
        overview: [
          "Search mail and calendar",
          "Read messages and events",
          "Draft and send mail",
          "Schedule meetings",
        ],
        readTools: ["List messages", "Get message", "List events"],
        writeTools: ["Send mail", "Create event", "Reply"],
        categories: ["Communication", "Productivity"],
        website: "https://outlook.live.com",
        docs: "https://learn.microsoft.com/graph/outlook-calendar-concept-overview",
        support: "https://support.microsoft.com/outlook",
      },
      {
        name: "Intercom",
        description: "Search conversations and contacts, and retrieve customer data.",
        summary: "Search conversations and contacts, retrieve customer data, and access support tickets and user profiles.",
        logo: intercomUrl,
        popular: false,
        platforms: ["Claude", "ChatGPT", "Cursor", "Grok"],
        score: 50,
        overview: [
          "Send messages to contacts and manage conversations",
          "Read and write capabilities for customer messaging automation",
          "Reply to and retrieve conversation details",
          "Upsert contacts and add tags for segmentation",
          "Create notes on contacts for internal documentation",
          "Send incoming messages and manage conversation states",
        ],
        readTools: [
          "List conversations",
          "Get conversation",
          "List contacts",
          "Get contact",
          "Search contacts",
          "List tags",
          "Get company",
          "List companies",
          "List notes",
          "Get admin",
          "List admins",
          "List segments",
          "Get ticket",
          "List articles",
        ],
        writeTools: [
          "Reply to conversation",
          "Create conversation",
          "Update contact",
          "Tag contact",
          "Create note",
          "Close conversation",
          "Send message",
        ],
        categories: ["Growing Businesses", "Customer Support & Success"],
        website: "https://www.intercom.com",
        docs: "https://developers.intercom.com",
        support: "https://developers.intercom.com",
      },
      {
        name: "HubSpot",
        description: "Retrieve, create, and update CRM objects.",
        summary: "Retrieve, create, and update CRM objects.",
        logo: hubspotUrl,
        popular: true,
        platforms: ["Claude", "ChatGPT", "Microsoft"],
        score: 40,
        overview: [
          "Search contacts, companies, and deals",
          "Create and update CRM records",
          "Read activity on a record",
          "Log notes from an agent",
        ],
        readTools: ["Search contacts", "Get company", "List deals", "Get owner"],
        writeTools: ["Create contact", "Update deal", "Create note"],
        categories: ["Growing Businesses", "CRM"],
        website: "https://www.hubspot.com",
        docs: "https://developers.hubspot.com",
        support: "https://help.hubspot.com",
      },
      {
        name: "Dropbox",
        description: "Browse, share, and fetch files.",
        summary: "Browse, share, and fetch files.",
        logo: dropboxUrl,
        popular: false,
        platforms: ["Claude", "ChatGPT", "Microsoft"],
        score: 25,
        overview: [
          "Browse folders and files",
          "Download file contents",
          "Create shared links",
          "Upload and move files",
        ],
        readTools: ["List folder", "Get metadata", "Download file"],
        writeTools: ["Upload file", "Create shared link", "Move file"],
        categories: ["Files", "Productivity"],
        website: "https://www.dropbox.com",
        docs: "https://www.dropbox.com/developers",
        support: "https://help.dropbox.com",
      },
      {
        name: "Zoom",
        description: "Schedule meetings and read transcripts.",
        summary: "Schedule meetings and read transcripts.",
        logo: zoomUrl,
        popular: false,
        platforms: ["Claude", "ChatGPT", "Gemini", "Microsoft"],
        score: 40,
        overview: [
          "List upcoming meetings",
          "Schedule a meeting",
          "Read cloud recordings and transcripts",
          "Look up meeting participants",
        ],
        readTools: ["List meetings", "Get meeting", "Get transcript"],
        writeTools: ["Create meeting", "Update meeting", "Delete meeting"],
        categories: ["Meetings", "Teamwork"],
        website: "https://zoom.us",
        docs: "https://developers.zoom.us",
        support: "https://support.zoom.com",
      },
    ],
  },
  {
    title: "Builders",
    lede: "",
    plugins: [
      {
        name: "Neon",
        description: "Connect a database and run queries.",
        summary: "Connect a database and run queries.",
        logo: neonUrl,
        popular: true,
        platforms: ["Claude", "Cursor", "Devin"],
        score: 65,
        overview: [
          "List projects and branches",
          "Run read queries",
          "Create branches for an agent",
          "Read connection details",
        ],
        readTools: ["List projects", "List branches", "Run query"],
        writeTools: ["Create branch", "Delete branch"],
        categories: ["Developer Tools", "Databases"],
        website: "https://neon.tech",
        docs: "https://neon.tech/docs",
        support: "https://neon.tech/docs/introduction/support",
      },
      {
        name: "Supabase",
        description: "Build and manage your app’s data.",
        summary: "Build and manage your app’s data.",
        logo: supabaseUrl,
        popular: true,
        platforms: ["Claude", "ChatGPT", "Cursor", "Devin"],
        score: 85,
        overview: [
          "List projects and tables",
          "Read and write rows",
          "Run SQL",
          "Inspect auth users",
        ],
        readTools: ["List projects", "List tables", "Select rows"],
        writeTools: ["Insert row", "Update row", "Run SQL"],
        categories: ["Developer Tools", "Databases"],
        website: "https://supabase.com",
        docs: "https://supabase.com/docs",
        support: "https://supabase.com/support",
      },
      {
        name: "Stripe",
        description: "Look up customers, invoices, and payments.",
        summary: "Look up customers, invoices, and payments.",
        logo: stripeUrl,
        popular: false,
        platforms: ["Claude", "ChatGPT", "Cursor"],
        score: 50,
        overview: [
          "Search customers and payments",
          "Read invoices and subscriptions",
          "Create customers and invoice items",
          "Issue refunds",
        ],
        readTools: ["List customers", "Get invoice", "List payments", "Get subscription"],
        writeTools: ["Create customer", "Create invoice", "Refund payment"],
        categories: ["Payments", "Finance"],
        website: "https://stripe.com",
        docs: "https://docs.stripe.com",
        support: "https://support.stripe.com",
      },
      {
        name: "n8n",
        description: "Run workflows from an agent.",
        summary: "Run workflows from an agent.",
        logo: n8nUrl,
        popular: true,
        platforms: ["Claude", "ChatGPT", "Cursor", "Grok"],
        score: 40,
        overview: [
          "List workflows",
          "Run a workflow with input",
          "Read the latest execution",
          "Turn a workflow on or off",
        ],
        readTools: ["List workflows", "Get execution"],
        writeTools: ["Run workflow", "Activate workflow"],
        categories: ["Automation", "Developer Tools"],
        website: "https://n8n.io",
        docs: "https://docs.n8n.io",
        support: "https://community.n8n.io",
      },
      {
        name: "Cloudflare",
        description: "Manage DNS, workers, and routes.",
        summary: "Manage DNS, workers, and routes.",
        logo: cloudflareUrl,
        popular: false,
        platforms: ["Claude", "Cursor", "Devin"],
        score: 12,
        overview: [
          "List zones and DNS records",
          "Read worker routes",
          "Create and update DNS records",
          "Purge cached URLs",
        ],
        readTools: ["List zones", "List DNS records", "List routes"],
        writeTools: ["Create DNS record", "Update route", "Purge cache"],
        categories: ["Developer Tools", "Infrastructure"],
        website: "https://www.cloudflare.com",
        docs: "https://developers.cloudflare.com",
        support: "https://support.cloudflare.com",
      },
      {
        name: "Vercel",
        description: "List projects and deployments.",
        summary: "List projects and deployments.",
        logo: vercelUrl,
        popular: false,
        platforms: ["Claude", "ChatGPT", "Cursor", "Grok", "Devin"],
        score: 75,
        overview: [
          "List projects and deployments",
          "Read build logs",
          "Promote a deployment",
          "Read environment names",
        ],
        readTools: ["List projects", "List deployments", "Get deployment"],
        writeTools: ["Promote deployment", "Redeploy"],
        categories: ["Developer Tools", "Hosting"],
        website: "https://vercel.com",
        docs: "https://vercel.com/docs",
        support: "https://vercel.com/help",
      },
    ],
  },
];

export function findPlugin(name: string) {
  for (const section of PLUGIN_SECTIONS) {
    const plugin = section.plugins.find((item) => item.name === name);
    if (plugin) {
      return plugin;
    }
  }
  return undefined;
}

export function hostLabel(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
