/**
 * Single source of truth for all content pages.
 * Used by: Navbar, PageNav, RelatedPages.
 */

export interface PageDef {
  path: string;
  navKey: string;
  descKey: string;
  color: string;
  group: "core" | "advanced" | "optional" | "reference";
  related?: string[];  // paths of related pages
}

export const contentPages: PageDef[] = [
  // Core
  { path: "/overview", navKey: "nav.overview", descKey: "overview.subtitle", color: "#6c63ff", group: "core", related: ["/query-pipeline", "/tool-system", "/permission-security"] },
  { path: "/query-pipeline", navKey: "nav.queryPipeline", descKey: "queryPipeline.subtitle", color: "#22d3ee", group: "core", related: ["/tool-system", "/permission-security", "/message-compaction"] },
  { path: "/tool-system", navKey: "nav.toolSystem", descKey: "toolSystem.subtitle", color: "#10b981", group: "core", related: ["/query-pipeline", "/permission-security", "/agent-system"] },
  { path: "/permission-security", navKey: "nav.permissionSecurity", descKey: "permissionSecurity.subtitle", color: "#f59e0b", group: "core", related: ["/query-pipeline", "/tool-system"] },
  // Advanced
  { path: "/terminal-ui", navKey: "nav.terminalUI", descKey: "terminalUI.subtitle", color: "#a78bfa", group: "advanced", related: ["/overview", "/plugin-skill"] },
  { path: "/plugin-skill", navKey: "nav.pluginSkill", descKey: "pluginSkill.subtitle", color: "#f472b6", group: "advanced", related: ["/tool-system", "/agent-system"] },
  { path: "/message-compaction", navKey: "nav.messageCompaction", descKey: "messageCompaction.subtitle", color: "#22d3ee", group: "advanced", related: ["/query-pipeline", "/overview"] },
  { path: "/agent-system", navKey: "nav.agentSystem", descKey: "agentSystem.subtitle", color: "#f472b6", group: "advanced", related: ["/tool-system", "/plugin-skill"] },
  // Optional
  { path: "/ide-bridge", navKey: "nav.ideBridge", descKey: "ideBridge.subtitle", color: "#fb923c", group: "optional", related: ["/overview", "/mcp-integration"] },
  { path: "/mcp-integration", navKey: "nav.mcpIntegration", descKey: "mcpIntegration.subtitle", color: "#fb923c", group: "optional", related: ["/tool-system", "/ide-bridge"] },
  // Reference
  { path: "/glossary", navKey: "nav.glossary", descKey: "glossary.subtitle", color: "#8888a0", group: "reference" },
  { path: "/easter-eggs", navKey: "nav.easterEggs", descKey: "easterEggs.subtitle", color: "#f59e0b", group: "reference" },
];

export const pageGroups = ["core", "advanced", "optional", "reference"] as const;

/** Look up a page by path */
export function getPage(path: string): PageDef | undefined {
  return contentPages.find(p => p.path === path);
}

/** Reading order (excludes glossary) */
export const readingOrder = contentPages.filter(p => p.group !== "reference");
