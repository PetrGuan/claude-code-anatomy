import type { Locale } from "../i18n/locales";

export interface GraphNode {
  id: string;
  label: string;
  labelCn: string;
  layer: "core" | "ui" | "extension" | "integration";
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
  labelCn?: string;
}

export const nodes: GraphNode[] = [
  { id: "repl", label: "REPL (UI)", labelCn: "REPL (界面)", layer: "ui" },
  { id: "query", label: "Query Pipeline", labelCn: "查询管线", layer: "core" },
  { id: "api", label: "Claude API", labelCn: "Claude API", layer: "core" },
  { id: "tools", label: "Tool System", labelCn: "工具系统", layer: "core" },
  { id: "permissions", label: "Permissions", labelCn: "权限系统", layer: "core" },
  { id: "state", label: "App State", labelCn: "应用状态", layer: "core" },
  { id: "compaction", label: "Compaction", labelCn: "消息压缩", layer: "core" },
  { id: "components", label: "Components", labelCn: "UI 组件", layer: "ui" },
  { id: "ink", label: "Ink Renderer", labelCn: "Ink 渲染", layer: "ui" },
  { id: "hooks", label: "Hooks", labelCn: "Hooks", layer: "ui" },
  { id: "commands", label: "Commands", labelCn: "斜杠命令", layer: "extension" },
  { id: "plugins", label: "Plugins", labelCn: "插件系统", layer: "extension" },
  { id: "agents", label: "Agents", labelCn: "Agent 系统", layer: "extension" },
  { id: "bridge", label: "IDE Bridge", labelCn: "IDE 桥接", layer: "integration" },
  { id: "mcp", label: "MCP", labelCn: "MCP 协议", layer: "integration" },
];

export const edges: GraphEdge[] = [
  { source: "repl", target: "query", label: "submit prompt", labelCn: "提交提示" },
  { source: "query", target: "api", label: "stream request", labelCn: "流式请求" },
  { source: "api", target: "query", label: "stream response", labelCn: "流式响应" },
  { source: "query", target: "tools", label: "execute tools", labelCn: "执行工具" },
  { source: "tools", target: "permissions", label: "check permission", labelCn: "检查权限" },
  { source: "query", target: "compaction", label: "compact if needed", labelCn: "按需压缩" },
  { source: "repl", target: "components", label: "render UI", labelCn: "渲染界面" },
  { source: "components", target: "ink", label: "terminal output", labelCn: "终端输出" },
  { source: "repl", target: "hooks", label: "state & logic", labelCn: "状态与逻辑" },
  { source: "hooks", target: "state", label: "read/write", labelCn: "读/写" },
  { source: "repl", target: "commands", label: "slash commands", labelCn: "斜杠命令" },
  { source: "tools", target: "agents", label: "spawn agents", labelCn: "派生 Agent" },
  { source: "tools", target: "mcp", label: "MCP tools", labelCn: "MCP 工具" },
  { source: "bridge", target: "repl", label: "WebSocket sync", labelCn: "WebSocket 同步" },
  { source: "plugins", target: "tools", label: "register tools", labelCn: "注册工具" },
  { source: "plugins", target: "commands", label: "register commands", labelCn: "注册命令" },
];

export const layerColors: Record<string, string> = {
  core: "#22d3ee",
  ui: "#a78bfa",
  extension: "#f472b6",
  integration: "#fb923c",
};

export const layerLabels: Record<string, { en: string; cn: string }> = {
  core: { en: "Core Layer", cn: "核心层" },
  ui: { en: "UI Layer", cn: "UI 层" },
  extension: { en: "Extension Layer", cn: "扩展层" },
  integration: { en: "Integration Layer", cn: "集成层" },
};

export function nodeLabel(node: GraphNode, locale: Locale): string {
  return locale === "zh" ? node.labelCn : node.label;
}
export function layerLabel(layer: string, locale: Locale): string {
  return locale === "zh" ? layerLabels[layer].cn : layerLabels[layer].en;
}
