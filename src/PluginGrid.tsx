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

const SECTIONS = [
  {
    title: "Recommended for you",
    lede: "Plugins recommended for you.",
    plugins: [
      { name: "GitHub", description: "Search and manage repositories.", logo: githubUrl, popular: true },
      { name: "Gmail", description: "Search, create, and manage your emails and calendar events.", logo: gmailUrl, popular: true },
      { name: "Slack", description: "Post messages and read channels.", logo: slackUrl, popular: false },
      { name: "Notion", description: "Read and update pages, databases, and tasks.", logo: notionUrl, popular: true },
      { name: "Calendar", description: "Create and manage events.", logo: calendarUrl, popular: false },
      { name: "Linear", description: "Track issues and projects.", logo: linearUrl, popular: true },
    ],
  },
  {
    title: "Productivity & Collaboration",
    lede: "Plugins for communication, documents, meetings, and everyday teamwork.",
    plugins: [
      { name: "Google Drive", description: "Read and write files in connected Drive accounts.", logo: driveUrl, popular: true },
      { name: "Outlook", description: "Search your emails and calendar events.", logo: outlookUrl, popular: true },
      { name: "Intercom", description: "Search conversations and contacts, and retrieve customer data.", logo: intercomUrl, popular: false },
      { name: "HubSpot", description: "Retrieve, create, and update CRM objects.", logo: hubspotUrl, popular: true },
      { name: "Dropbox", description: "Browse, share, and fetch files.", logo: dropboxUrl, popular: false },
      { name: "Zoom", description: "Schedule meetings and read transcripts.", logo: zoomUrl, popular: false },
    ],
  },
  {
    title: "Builders",
    lede: "Plugins for engineers and makers who write code, automate workflows, and ship products.",
    plugins: [
      { name: "Neon", description: "Connect a database and run queries.", logo: neonUrl, popular: true },
      { name: "Supabase", description: "Build and manage your app’s data.", logo: supabaseUrl, popular: true },
      { name: "Stripe", description: "Look up customers, invoices, and payments.", logo: stripeUrl, popular: false },
      { name: "n8n", description: "Run workflows from an agent.", logo: n8nUrl, popular: true },
      { name: "Cloudflare", description: "Manage DNS, workers, and routes.", logo: cloudflareUrl, popular: false },
      { name: "Vercel", description: "List projects and deployments.", logo: vercelUrl, popular: false },
    ],
  },
] as const;

export function PluginGrid({ query }: { query: string }) {
  const needle = query.trim().toLowerCase();
  const sections = SECTIONS.map((section) => ({
    ...section,
    plugins: section.plugins.filter((plugin) => {
      if (!needle) {
        return true;
      }
      return `${plugin.name} ${plugin.description}`.toLowerCase().includes(needle);
    }),
  })).filter((section) => section.plugins.length > 0);

  if (sections.length === 0) {
    return (
      <section className="plugin-board" aria-label="Plugins">
        <p className="plugin-empty">No plugins match “{query.trim()}”.</p>
      </section>
    );
  }

  return (
    <div className="plugin-board">
      {sections.map((section) => (
        <section key={section.title} className="plugin-section" aria-label={section.title}>
          <h2>{section.title}</h2>
          <p>{section.lede}</p>
          <div className="plugin-grid">
            {section.plugins.map((plugin) => (
              <article key={plugin.name} className="plugin-card">
                <button type="button" className="plugin-hit" aria-label={`Add ${plugin.name}`} />
                <div className="plugin-mark">
                  <img src={plugin.logo} alt="" />
                </div>
                <div className="plugin-copy">
                  <h3>{plugin.name}</h3>
                  <p>{plugin.description}</p>
                  {plugin.popular ? <span className="plugin-popular">Popular</span> : null}
                </div>
                <span className="plugin-add" aria-hidden="true">
                  +
                </span>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
