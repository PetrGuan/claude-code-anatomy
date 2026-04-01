# Claude Code Anatomy - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive visualization website that analyzes Claude Code's source architecture, accessible to both technical and non-technical audiences.

**Architecture:** Astro static site with React island components for interactivity. Content pages in `.astro` (zero JS), interactive visualizations in `.tsx` hydrated on viewport entry. Data pre-extracted from claude-code source into JSON files. D3.js for graph visualizations, Framer Motion for animations.

**Tech Stack:** Astro 5, React 19, TypeScript, Tailwind CSS v4, D3.js v7, Framer Motion v11, Shiki (syntax highlighting)

---

## File Structure

```
claude-code-anatomy/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── src/
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── overview.astro
│   │   ├── query-pipeline.astro
│   │   ├── tool-system.astro
│   │   └── permission-security.astro
│   ├── components/
│   │   ├── layout/Navbar.astro
│   │   ├── layout/Sidebar.tsx
│   │   ├── layout/Footer.astro
│   │   ├── common/StatCard.tsx
│   │   ├── common/CodeBlock.tsx
│   │   ├── common/LayerToggle.tsx
│   │   ├── common/SectionHeading.astro
│   │   ├── viz/ArchitectureMap.tsx
│   │   ├── viz/FlowDiagram.tsx
│   │   ├── viz/BubbleChart.tsx
│   │   ├── viz/TreeExplorer.tsx
│   │   ├── viz/TimelineScroll.tsx
│   │   ├── interactive/PermissionSimulator.tsx
│   │   └── interactive/ToolOrchestrationDemo.tsx
│   ├── data/
│   │   ├── modules.ts
│   │   ├── tools.ts
│   │   ├── architecture.ts
│   │   └── codeSnippets.ts
│   └── styles/global.css
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`

- [ ] **Step 1: Initialize Astro project**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
npm install @astrojs/react @astrojs/tailwind react react-dom d3 framer-motion shiki
npm install -D @types/react @types/react-dom @types/d3 tailwindcss
```

- [ ] **Step 3: Configure Astro**

Write `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  site: 'https://petr.github.io',
  base: '/claude-code-anatomy',
});
```

- [ ] **Step 4: Configure Tailwind with design tokens**

Write `tailwind.config.mjs`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0f',
          card: '#14141f',
          border: '#1e1e2e',
        },
        text: {
          DEFAULT: '#e0e0e8',
          secondary: '#8888a0',
        },
        accent: {
          purple: '#6c63ff',
          cyan: '#22d3ee',
          amber: '#f59e0b',
          emerald: '#10b981',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Write global CSS**

Write `src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply bg-bg text-text;
    scroll-behavior: smooth;
  }

  body {
    @apply font-sans antialiased;
  }

  ::selection {
    @apply bg-accent-purple/30;
  }

  ::-webkit-scrollbar {
    @apply w-2;
  }

  ::-webkit-scrollbar-track {
    @apply bg-bg;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-bg-border rounded-full;
  }
}
```

- [ ] **Step 6: Verify build**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
npx astro build
```

Expected: Build completes with no errors.

- [ ] **Step 7: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add package.json package-lock.json astro.config.mjs tailwind.config.mjs tsconfig.json src/styles/global.css src/env.d.ts
git commit -m "feat: scaffold Astro project with React, Tailwind, and design tokens"
```

---

### Task 2: Data Files

**Files:**
- Create: `src/data/modules.ts`
- Create: `src/data/tools.ts`
- Create: `src/data/architecture.ts`
- Create: `src/data/codeSnippets.ts`

- [ ] **Step 1: Create modules data**

Write `src/data/modules.ts`:

```ts
export interface Module {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  descriptionCn: string;
  path: string;
  files: number;
  lines: number;
  category: "core" | "ui" | "extension" | "integration";
  color: string;
  page?: string;
}

export const modules: Module[] = [
  {
    id: "query-pipeline",
    name: "Query Pipeline",
    nameCn: "查询管线",
    description: "The brain of Claude Code. Manages the conversation loop: user input → system prompt → API call → tool execution → response.",
    descriptionCn: "Claude Code 的大脑。管理对话循环：用户输入 → 系统提示 → API 调用 → 工具执行 → 响应。",
    path: "src/query.ts + src/QueryEngine.ts + src/query/",
    files: 12,
    lines: 3000,
    category: "core",
    color: "#22d3ee",
    page: "/query-pipeline",
  },
  {
    id: "tool-system",
    name: "Tool System",
    nameCn: "工具系统",
    description: "45+ pluggable tools (Bash, file ops, web search, agents) with concurrent read / serial write orchestration.",
    descriptionCn: "45+ 个可插拔工具（Bash、文件操作、网络搜索、Agent），支持读操作并行、写操作串行的调度。",
    path: "src/tools/ + src/Tool.ts + src/tools.ts",
    files: 184,
    lines: 50828,
    category: "core",
    color: "#10b981",
    page: "/tool-system",
  },
  {
    id: "permissions",
    name: "Permission & Security",
    nameCn: "权限与安全",
    description: "Three-layer defense: ML classifier → rule engine → user confirmation. Includes Bash AST security analysis.",
    descriptionCn: "三层防线：ML 分类器 → 规则引擎 → 用户确认。包含 Bash AST 安全分析。",
    path: "src/utils/permissions/",
    files: 23,
    lines: 5000,
    category: "core",
    color: "#f59e0b",
    page: "/permission-security",
  },
  {
    id: "components",
    name: "UI Components",
    nameCn: "UI 组件",
    description: "346 React (TSX) components for terminal rendering, from dialogs to data visualization.",
    descriptionCn: "346 个 React (TSX) 组件用于终端渲染，涵盖对话框到数据可视化。",
    path: "src/components/",
    files: 389,
    lines: 81546,
    category: "ui",
    color: "#a78bfa",
    page: "/terminal-ui",
  },
  {
    id: "ink",
    name: "Ink Renderer",
    nameCn: "Ink 渲染引擎",
    description: "Custom React reconciler for terminal output. Yoga layout, ANSI rendering, keyboard/mouse events.",
    descriptionCn: "终端输出的自定义 React 协调器。Yoga 布局、ANSI 渲染、键盘/鼠标事件。",
    path: "src/ink/",
    files: 96,
    lines: 19842,
    category: "ui",
    color: "#a78bfa",
    page: "/terminal-ui",
  },
  {
    id: "hooks",
    name: "React Hooks",
    nameCn: "React Hooks",
    description: "104 custom hooks for state management, input handling, permissions, suggestions, and more.",
    descriptionCn: "104 个自定义 hooks，用于状态管理、输入处理、权限检查、建议等。",
    path: "src/hooks/",
    files: 104,
    lines: 19204,
    category: "ui",
    color: "#a78bfa",
  },
  {
    id: "services",
    name: "Services",
    nameCn: "服务层",
    description: "API integration, MCP protocol, message compaction, analytics, and token management.",
    descriptionCn: "API 集成、MCP 协议、消息压缩、分析和 token 管理。",
    path: "src/services/",
    files: 130,
    lines: 53680,
    category: "core",
    color: "#22d3ee",
  },
  {
    id: "commands",
    name: "Slash Commands",
    nameCn: "斜杠命令",
    description: "~50 slash commands (/help, /clear, /compact, etc.) for direct user interaction.",
    descriptionCn: "约 50 个斜杠命令（/help, /clear, /compact 等）用于直接用户交互。",
    path: "src/commands/",
    files: 189,
    lines: 26428,
    category: "extension",
    color: "#f472b6",
  },
  {
    id: "plugins",
    name: "Plugins & Skills",
    nameCn: "插件与技能",
    description: "Extensible plugin marketplace, custom skills, hooks, and agent definitions.",
    descriptionCn: "可扩展的插件市场，自定义技能、钩子和 Agent 定义。",
    path: "src/skills/ + src/plugins/",
    files: 23,
    lines: 5000,
    category: "extension",
    color: "#f472b6",
    page: "/plugin-skill",
  },
  {
    id: "bridge",
    name: "IDE Bridge",
    nameCn: "IDE 桥接",
    description: "Real-time bidirectional communication with VS Code via WebSocket.",
    descriptionCn: "通过 WebSocket 与 VS Code 的实时双向通信。",
    path: "src/bridge/",
    files: 31,
    lines: 12613,
    category: "integration",
    color: "#fb923c",
    page: "/ide-bridge",
  },
  {
    id: "mcp",
    name: "MCP Integration",
    nameCn: "MCP 集成",
    description: "Model Context Protocol client: tool discovery, resource access, OAuth, multiple transports.",
    descriptionCn: "模型上下文协议客户端：工具发现、资源访问、OAuth、多种传输方式。",
    path: "src/services/mcp/",
    files: 25,
    lines: 10000,
    category: "integration",
    color: "#fb923c",
    page: "/mcp-integration",
  },
  {
    id: "compaction",
    name: "Message Compaction",
    nameCn: "消息压缩",
    description: "4 strategies (auto, reactive, snip, micro) to manage context window limits transparently.",
    descriptionCn: "4 种策略（自动、响应式、剪切、微压缩）透明管理上下文窗口限制。",
    path: "src/services/compact/",
    files: 8,
    lines: 4000,
    category: "core",
    color: "#22d3ee",
    page: "/message-compaction",
  },
  {
    id: "agents",
    name: "Agent System",
    nameCn: "Agent 系统",
    description: "Sub-agent spawning, team coordination, background execution, and inter-agent messaging.",
    descriptionCn: "子 Agent 派生、团队协调、后台执行和 Agent 间消息传递。",
    path: "src/tools/AgentTool/ + src/coordinator/",
    files: 20,
    lines: 5000,
    category: "extension",
    color: "#f472b6",
    page: "/agent-system",
  },
  {
    id: "state",
    name: "State Management",
    nameCn: "状态管理",
    description: "Central app state store with reactive updates powering UI and permission context.",
    descriptionCn: "中央应用状态存储，响应式更新驱动 UI 和权限上下文。",
    path: "src/state/",
    files: 8,
    lines: 3000,
    category: "core",
    color: "#22d3ee",
  },
  {
    id: "utils",
    name: "Utilities",
    nameCn: "工具函数",
    description: "564 utility files: permissions, bash parsing, plugin loading, settings, model selection, and more.",
    descriptionCn: "564 个工具文件：权限、Bash 解析、插件加载、设置、模型选择等。",
    path: "src/utils/",
    files: 564,
    lines: 180472,
    category: "core",
    color: "#22d3ee",
  },
];
```

- [ ] **Step 2: Create tools data**

Write `src/data/tools.ts`:

```ts
export interface Tool {
  name: string;
  description: string;
  descriptionCn: string;
  category: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  nameCn: string;
  color: string;
  tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: "shell",
    name: "Shell Execution",
    nameCn: "Shell 执行",
    color: "#ef4444",
    tools: [
      { name: "Bash", description: "Execute shell commands and scripts", descriptionCn: "执行 Shell 命令和脚本" },
      { name: "PowerShell", description: "Execute PowerShell commands on Windows", descriptionCn: "在 Windows 上执行 PowerShell 命令" },
    ],
  },
  {
    id: "file-ops",
    name: "File Operations",
    nameCn: "文件操作",
    color: "#10b981",
    tools: [
      { name: "Read", description: "Read files: text, code, PDFs, images, notebooks", descriptionCn: "读取文件：文本、代码、PDF、图片、Notebook" },
      { name: "Write", description: "Create or overwrite files", descriptionCn: "创建或覆盖文件" },
      { name: "Edit", description: "Find-and-replace text sections in files", descriptionCn: "查找并替换文件中的文本段" },
      { name: "NotebookEdit", description: "Edit Jupyter notebook cells", descriptionCn: "编辑 Jupyter Notebook 单元格" },
      { name: "EnterWorktree", description: "Create isolated git worktree", descriptionCn: "创建隔离的 git worktree" },
      { name: "ExitWorktree", description: "Exit a worktree session", descriptionCn: "退出 worktree 会话" },
    ],
  },
  {
    id: "search",
    name: "Search & Discovery",
    nameCn: "搜索与发现",
    color: "#6c63ff",
    tools: [
      { name: "Glob", description: "Find files by name pattern matching", descriptionCn: "按文件名模式匹配查找文件" },
      { name: "Grep", description: "Search file contents with regex", descriptionCn: "用正则表达式搜索文件内容" },
      { name: "ToolSearch", description: "Search available tools by keyword", descriptionCn: "按关键词搜索可用工具" },
    ],
  },
  {
    id: "web",
    name: "Web Access",
    nameCn: "网络访问",
    color: "#22d3ee",
    tools: [
      { name: "WebFetch", description: "Fetch and extract content from URLs", descriptionCn: "获取并提取 URL 内容" },
      { name: "WebSearch", description: "Search the web and return ranked results", descriptionCn: "搜索网络并返回排序结果" },
    ],
  },
  {
    id: "agent",
    name: "Agent & Coordination",
    nameCn: "Agent 与协调",
    color: "#f59e0b",
    tools: [
      { name: "Agent", description: "Spawn autonomous sub-agents for tasks", descriptionCn: "派生自主子 Agent 执行任务" },
      { name: "SendMessage", description: "Send messages between agents in teams", descriptionCn: "在团队中的 Agent 之间发送消息" },
      { name: "TeamCreate", description: "Create a multi-agent swarm team", descriptionCn: "创建多 Agent 蜂群团队" },
      { name: "TeamDelete", description: "Disband a swarm team", descriptionCn: "解散蜂群团队" },
      { name: "Skill", description: "Execute custom skills and slash commands", descriptionCn: "执行自定义技能和斜杠命令" },
    ],
  },
  {
    id: "task",
    name: "Task Management",
    nameCn: "任务管理",
    color: "#a78bfa",
    tools: [
      { name: "TaskCreate", description: "Create a new task", descriptionCn: "创建新任务" },
      { name: "TaskUpdate", description: "Update task status and properties", descriptionCn: "更新任务状态和属性" },
      { name: "TaskList", description: "List all tasks", descriptionCn: "列出所有任务" },
      { name: "TaskGet", description: "Get a specific task by ID", descriptionCn: "按 ID 获取特定任务" },
      { name: "TaskOutput", description: "Get output from background tasks", descriptionCn: "获取后台任务的输出" },
      { name: "TaskStop", description: "Kill a running background task", descriptionCn: "终止运行中的后台任务" },
    ],
  },
  {
    id: "mcp",
    name: "MCP Protocol",
    nameCn: "MCP 协议",
    color: "#fb923c",
    tools: [
      { name: "MCPTool", description: "Execute tools from MCP servers", descriptionCn: "执行 MCP 服务器的工具" },
      { name: "ListMcpResources", description: "List MCP server resources", descriptionCn: "列出 MCP 服务器资源" },
      { name: "ReadMcpResource", description: "Read content from MCP resources", descriptionCn: "读取 MCP 资源内容" },
      { name: "McpAuth", description: "OAuth authentication for MCP servers", descriptionCn: "MCP 服务器的 OAuth 认证" },
    ],
  },
  {
    id: "config",
    name: "Configuration & IDE",
    nameCn: "配置与 IDE",
    color: "#8888a0",
    tools: [
      { name: "Config", description: "Read and modify settings", descriptionCn: "读取和修改设置" },
      { name: "AskUserQuestion", description: "Prompt the user with questions", descriptionCn: "向用户提出问题" },
      { name: "CronCreate", description: "Schedule recurring prompts", descriptionCn: "安排定期提示" },
      { name: "LSP", description: "Language Server Protocol for code analysis", descriptionCn: "语言服务器协议用于代码分析" },
      { name: "EnterPlanMode", description: "Enter plan mode for complex tasks", descriptionCn: "进入计划模式处理复杂任务" },
      { name: "ExitPlanMode", description: "Complete plan mode", descriptionCn: "完成计划模式" },
    ],
  },
];
```

- [ ] **Step 3: Create architecture graph data**

Write `src/data/architecture.ts`:

```ts
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
```

- [ ] **Step 4: Create code snippets data**

Write `src/data/codeSnippets.ts`:

```ts
export interface CodeSnippet {
  id: string;
  title: string;
  titleCn: string;
  language: string;
  code: string;
  highlights?: number[];
  annotations?: Record<number, string>;
}

export const snippets: Record<string, CodeSnippet> = {
  queryLoop: {
    id: "queryLoop",
    title: "The Core Query Loop",
    titleCn: "核心查询循环",
    language: "typescript",
    code: `// Simplified from src/query.ts
async function* submitMessage(
  prompt: string,
  deps: QueryDeps
): AsyncGenerator<MessageUpdate> {
  // 1. Build system prompt with context
  const systemPrompt = buildSystemPrompt(deps);

  // 2. Normalize and append user message
  const messages = normalizeMessages(deps.messages, prompt);

  // 3. Stream response from Claude API
  const stream = queryModelWithStreaming({
    model: deps.model,
    system: systemPrompt,
    messages,
    tools: deps.tools,
  });

  // 4. Process streamed response
  for await (const event of stream) {
    yield processStreamEvent(event);
  }

  // 5. Execute any tool calls
  if (hasToolUse(response)) {
    yield* runTools(response.toolUses, deps);
    // 6. Loop back for next turn
    yield* submitMessage("", deps);
  }
}`,
    highlights: [7, 10, 14, 21, 25],
    annotations: {
      7: "Assemble full context: git info, file state, tool definitions",
      14: "Streaming via Anthropic API — responses arrive token by token",
      25: "Recursive: after tool execution, loop back for Claude's next response",
    },
  },
  toolOrchestration: {
    id: "toolOrchestration",
    title: "Tool Orchestration: Concurrent Read, Serial Write",
    titleCn: "工具调度：读并行，写串行",
    language: "typescript",
    code: `// Simplified from src/services/tools/toolOrchestration.ts
async function* runTools(
  toolUses: ToolUseBlock[],
  context: ToolUseContext
): AsyncGenerator<ToolResult> {
  // Partition into read-only and write batches
  const batches = partitionToolCalls(toolUses);

  for (const batch of batches) {
    if (batch.type === "read-only") {
      // Run all read-only tools in parallel
      const results = await Promise.all(
        batch.tools.map(tool => executeTool(tool, context))
      );
      for (const result of results) yield result;
    } else {
      // Run write tools one at a time
      for (const tool of batch.tools) {
        yield await executeTool(tool, context);
      }
    }
  }
}`,
    highlights: [7, 12, 18],
    annotations: {
      7: "Split tool calls: Glob+Grep+Read run together, Write+Edit run one by one",
      12: "Safe to parallelize — read ops don't conflict with each other",
      18: "Serial execution prevents race conditions on file writes",
    },
  },
  permissionCheck: {
    id: "permissionCheck",
    title: "Three-Layer Permission Check",
    titleCn: "三层权限检查",
    language: "typescript",
    code: `// Simplified from src/hooks/useCanUseTool.ts
async function canUseTool(
  tool: Tool,
  input: ToolInput
): Promise<PermissionResult> {
  // Layer 1: ML Classifier — fast probabilistic check
  const prediction = await classifyWithML(tool, input);
  if (prediction.confidence > 0.95) {
    return prediction.decision; // High confidence → skip rules
  }

  // Layer 2: Rule Engine — pattern matching
  const ruleResult = matchRules(tool, input, userRules);
  if (ruleResult !== "no-match") {
    return ruleResult; // "allow" or "deny"
  }

  // Layer 3: User Confirmation — ask the human
  return await showPermissionDialog(tool, input);
}`,
    highlights: [7, 13, 18],
    annotations: {
      7: "ML model predicts if this action is safe — handles ~80% of cases instantly",
      13: "User-defined rules: 'always allow git commands', 'deny rm -rf', etc.",
      18: "Last resort: show the user what's about to happen and let them decide",
    },
  },
  asyncGenerator: {
    id: "asyncGenerator",
    title: "Async Generators for Streaming",
    titleCn: "异步生成器实现流式处理",
    language: "typescript",
    code: `// The pattern used everywhere in Claude Code
async function* processStream(): AsyncGenerator<Update> {
  // Yield updates as they arrive — don't buffer
  for await (const chunk of apiStream) {
    yield { type: "token", text: chunk.text };
  }

  // Caller consumes with for-await-of
  // UI updates incrementally, memory stays flat
}

// Usage in REPL:
for await (const update of submitMessage(prompt)) {
  renderToTerminal(update); // Each token appears immediately
}`,
    highlights: [3, 4, 13],
    annotations: {
      3: "Async generators are the backbone of Claude Code's streaming architecture",
      13: "for-await-of: the consumer pulls updates one at a time, naturally backpressure-aware",
    },
  },
};
```

- [ ] **Step 5: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/data/
git commit -m "feat: add data files for modules, tools, architecture graph, and code snippets"
```

---

### Task 3: Layout Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/layout/Navbar.astro`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Footer.astro`

- [ ] **Step 1: Create Navbar**

Write `src/components/layout/Navbar.astro`:

```astro
---
const navItems = [
  { href: "/", label: "首页", labelEn: "Home" },
  { href: "/overview", label: "架构概览", labelEn: "Overview" },
  { href: "/query-pipeline", label: "查询管线", labelEn: "Query Pipeline" },
  { href: "/tool-system", label: "工具系统", labelEn: "Tool System" },
  { href: "/permission-security", label: "权限安全", labelEn: "Permissions" },
];

const currentPath = Astro.url.pathname;
---

<nav class="fixed top-0 left-0 right-0 z-50 border-b border-bg-border bg-bg/80 backdrop-blur-xl">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <a href="/" class="flex items-center gap-2 font-mono text-sm font-bold text-accent-purple">
        <span class="text-lg">&#x2227;</span>
        Claude Code Anatomy
      </a>
      <div class="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <a
            href={item.href}
            class:list={[
              "px-3 py-2 rounded-lg text-sm transition-colors",
              currentPath === item.href
                ? "bg-accent-purple/10 text-accent-purple"
                : "text-text-secondary hover:text-text hover:bg-bg-card",
            ]}
          >
            {item.label}
          </a>
        ))}
      </div>
      <button id="mobile-menu-btn" class="md:hidden p-2 text-text-secondary hover:text-text">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>
  <div id="mobile-menu" class="hidden md:hidden border-t border-bg-border bg-bg px-4 pb-4">
    {navItems.map((item) => (
      <a
        href={item.href}
        class:list={[
          "block px-3 py-2 rounded-lg text-sm transition-colors",
          currentPath === item.href
            ? "bg-accent-purple/10 text-accent-purple"
            : "text-text-secondary hover:text-text",
        ]}
      >
        {item.label}
      </a>
    ))}
  </div>
</nav>

<script>
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  btn?.addEventListener("click", () => menu?.classList.toggle("hidden"));
</script>
```

- [ ] **Step 2: Create Sidebar**

Write `src/components/layout/Sidebar.tsx`:

```tsx
import { useState, useEffect } from "react";

interface SidebarItem {
  id: string;
  label: string;
  level: number;
}

interface Props {
  items: SidebarItem[];
}

export default function Sidebar({ items }: Props) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden xl:block fixed right-8 top-24 w-56">
      <nav className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
          目录
        </p>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block py-1 text-sm transition-colors border-l-2 ${
              item.level === 1 ? "pl-3" : "pl-6"
            } ${
              activeId === item.id
                ? "border-accent-purple text-accent-purple"
                : "border-transparent text-text-secondary hover:text-text hover:border-bg-border"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 3: Create Footer**

Write `src/components/layout/Footer.astro`:

```astro
<footer class="border-t border-bg-border mt-32 py-12">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
      <p>
        Claude Code Anatomy — 深入浅出分析 Claude Code 源码架构
      </p>
      <div class="flex items-center gap-4">
        <span>基于 2026-03-31 泄露的源码</span>
        <span>·</span>
        <span>1,902 files · 512K+ LOC</span>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Create BaseLayout**

Write `src/layouts/BaseLayout.astro`:

```astro
---
import Navbar from "../components/layout/Navbar.astro";
import Footer from "../components/layout/Footer.astro";
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
}

const { title, description = "深入浅出分析 Claude Code 源码架构" } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <title>{title} | Claude Code Anatomy</title>
  </head>
  <body class="min-h-screen">
    <Navbar />
    <main class="pt-16">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 5: Verify build**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
npx astro build
```

Expected: Build completes with no errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/layouts/ src/components/layout/
git commit -m "feat: add base layout with navbar, sidebar, and footer"
```

---

### Task 4: Common Components (StatCard, LayerToggle, SectionHeading)

**Files:**
- Create: `src/components/common/StatCard.tsx`
- Create: `src/components/common/LayerToggle.tsx`
- Create: `src/components/common/SectionHeading.astro`

- [ ] **Step 1: Create StatCard**

Write `src/components/common/StatCard.tsx`:

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  value: number;
  suffix?: string;
  label: string;
  color?: string;
}

export default function StatCard({ value, suffix = "", label, color = "#6c63ff" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-bg-border bg-bg-card p-6"
    >
      <p className="font-mono text-3xl font-bold" style={{ color }}>
        {display.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-text-secondary">{label}</p>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create LayerToggle**

Write `src/components/common/LayerToggle.tsx`:

```tsx
import { useState } from "react";

interface Props {
  plain: React.ReactNode;
  technical: React.ReactNode;
  plainLabel?: string;
  technicalLabel?: string;
}

export default function LayerToggle({
  plain,
  technical,
  plainLabel = "通俗版",
  technicalLabel = "技术版",
}: Props) {
  const [isTechnical, setIsTechnical] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center gap-1 rounded-lg bg-bg-card p-1 w-fit border border-bg-border">
        <button
          onClick={() => setIsTechnical(false)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            !isTechnical
              ? "bg-accent-purple text-white"
              : "text-text-secondary hover:text-text"
          }`}
        >
          {plainLabel}
        </button>
        <button
          onClick={() => setIsTechnical(true)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isTechnical
              ? "bg-accent-purple text-white"
              : "text-text-secondary hover:text-text"
          }`}
        >
          {technicalLabel}
        </button>
      </div>
      <div className="prose prose-invert max-w-none">
        {isTechnical ? technical : plain}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create SectionHeading**

Write `src/components/common/SectionHeading.astro`:

```astro
---
interface Props {
  id: string;
  title: string;
  subtitle?: string;
}

const { id, title, subtitle } = Astro.props;
---

<div id={id} class="scroll-mt-24 mb-8">
  <h2 class="text-2xl font-bold text-text">{title}</h2>
  {subtitle && <p class="mt-2 text-text-secondary">{subtitle}</p>}
</div>
```

- [ ] **Step 4: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/components/common/
git commit -m "feat: add common components — StatCard, LayerToggle, SectionHeading"
```

---

### Task 5: ArchitectureMap Visualization Component

**Files:**
- Create: `src/components/viz/ArchitectureMap.tsx`

- [ ] **Step 1: Create ArchitectureMap**

Write `src/components/viz/ArchitectureMap.tsx`:

```tsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { nodes, edges, layerColors, layerLabels, type GraphNode, type GraphEdge } from "../../data/architecture";

export default function ArchitectureMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 500;
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Layout: group nodes by layer in rows
    const layerOrder = ["core", "ui", "extension", "integration"];
    const layerY: Record<string, number> = { core: 120, ui: 240, extension: 340, integration: 440 };

    const positionedNodes = nodes.map((node, i) => {
      const layerNodes = nodes.filter((n) => n.layer === node.layer);
      const idx = layerNodes.indexOf(node);
      const spacing = width / (layerNodes.length + 1);
      return { ...node, x: spacing * (idx + 1), y: layerY[node.layer] };
    });

    const nodeMap = new Map(positionedNodes.map((n) => [n.id, n]));

    // Draw layer backgrounds
    for (const layer of layerOrder) {
      const layerNodes = positionedNodes.filter((n) => n.layer === layer);
      if (layerNodes.length === 0) continue;

      const minX = Math.min(...layerNodes.map((n) => n.x!)) - 60;
      const maxX = Math.max(...layerNodes.map((n) => n.x!)) + 60;
      const y = layerY[layer];

      g.append("rect")
        .attr("x", minX)
        .attr("y", y - 30)
        .attr("width", maxX - minX)
        .attr("height", 60)
        .attr("rx", 12)
        .attr("fill", layerColors[layer])
        .attr("opacity", 0.05);

      g.append("text")
        .attr("x", minX + 8)
        .attr("y", y - 16)
        .attr("fill", layerColors[layer])
        .attr("font-size", 10)
        .attr("opacity", 0.6)
        .text(layerLabels[layer].cn);
    }

    // Draw edges
    g.selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("x1", (d) => nodeMap.get(d.source)?.x ?? 0)
      .attr("y1", (d) => nodeMap.get(d.source)?.y ?? 0)
      .attr("x2", (d) => nodeMap.get(d.target)?.x ?? 0)
      .attr("y2", (d) => nodeMap.get(d.target)?.y ?? 0)
      .attr("stroke", "#1e1e2e")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.6);

    // Draw nodes
    const nodeGroups = g.selectAll("g.node")
      .data(positionedNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    nodeGroups
      .append("circle")
      .attr("r", 20)
      .attr("fill", (d) => layerColors[d.layer])
      .attr("opacity", 0.15)
      .attr("stroke", (d) => layerColors[d.layer])
      .attr("stroke-width", 1.5);

    nodeGroups
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => layerColors[d.layer]);

    nodeGroups
      .append("text")
      .attr("y", 34)
      .attr("text-anchor", "middle")
      .attr("fill", "#e0e0e8")
      .attr("font-size", 11)
      .text((d) => d.labelCn);

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom);

    // Hover tooltip
    nodeGroups
      .on("mouseenter", function (event, d) {
        const rect = containerRef.current!.getBoundingClientRect();
        setTooltip({ x: event.clientX - rect.left, y: event.clientY - rect.top - 10, node: d });
        d3.select(this).select("circle").transition().duration(200).attr("r", 24);
      })
      .on("mouseleave", function () {
        setTooltip(null);
        d3.select(this).select("circle").transition().duration(200).attr("r", 20);
      });
  }, []);

  return (
    <div ref={containerRef} className="relative rounded-xl border border-bg-border bg-bg-card p-4 overflow-hidden">
      <svg ref={svgRef} className="w-full" />
      {tooltip && (
        <div
          className="absolute z-10 rounded-lg border border-bg-border bg-bg p-3 text-sm shadow-xl pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          <p className="font-medium text-text">{tooltip.node.labelCn}</p>
          <p className="text-text-secondary text-xs">{tooltip.node.label}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/components/viz/ArchitectureMap.tsx
git commit -m "feat: add interactive architecture map with D3 force layout"
```

---

### Task 6: TimelineScroll Component (Homepage Narrative)

**Files:**
- Create: `src/components/viz/TimelineScroll.tsx`

- [ ] **Step 1: Create TimelineScroll**

Write `src/components/viz/TimelineScroll.tsx`:

```tsx
import { motion } from "framer-motion";

interface TimelineStep {
  icon: string;
  title: string;
  description: string;
  color: string;
  link?: string;
}

const steps: TimelineStep[] = [
  {
    icon: "⌨️",
    title: "用户输入",
    description: "你在终端输入 '帮我修复这个 bug'。PromptInput 组件捕获输入，附加上下文（当前目录、git 状态、打开的文件）。",
    color: "#e0e0e8",
  },
  {
    icon: "🛡️",
    title: "权限检查",
    description: "三层防线启动：ML 分类器快速判断安全性 → 规则引擎匹配用户自定义策略 → 必要时弹出确认对话框。",
    color: "#f59e0b",
    link: "/permission-security",
  },
  {
    icon: "📋",
    title: "系统提示构建",
    description: "拼装完整上下文：默认系统提示 + 用户环境信息 + 45 个工具定义 + 记忆附件 + 项目规则。像服务员把你的简单点单翻译成厨房能懂的完整订单。",
    color: "#22d3ee",
    link: "/query-pipeline",
  },
  {
    icon: "🌊",
    title: "流式 API 调用",
    description: "通过 Anthropic API 发送请求。响应以流式返回 — 每个 token 到达时立即渲染到终端，不用等完整回复。async generator 是这一切的骨架。",
    color: "#6c63ff",
    link: "/query-pipeline",
  },
  {
    icon: "🔧",
    title: "工具调用",
    description: "Claude 决定需要读文件、搜索代码、执行命令。工具调度器启动：读操作并行执行（快），写操作串行执行（安全）。",
    color: "#10b981",
    link: "/tool-system",
  },
  {
    icon: "🔄",
    title: "循环与返回",
    description: "工具执行结果返回给 Claude，它分析结果后可能再次调用工具。这个循环持续到任务完成，最终将结果流式渲染到你的终端。",
    color: "#a78bfa",
  },
];

export default function TimelineScroll() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-bg-border" />

      <div className="space-y-16">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative pl-16"
          >
            {/* Node on timeline */}
            <div
              className="absolute left-4 top-1 w-5 h-5 rounded-full border-2 bg-bg"
              style={{ borderColor: step.color }}
            >
              <div
                className="absolute inset-1 rounded-full"
                style={{ backgroundColor: step.color }}
              />
            </div>

            {/* Step number */}
            <span className="text-xs font-mono text-text-secondary">
              Step {i + 1}
            </span>

            {/* Content */}
            <h3 className="text-lg font-semibold mt-1" style={{ color: step.color }}>
              <span className="mr-2">{step.icon}</span>
              {step.title}
            </h3>
            <p className="mt-2 text-text-secondary leading-relaxed max-w-xl">
              {step.description}
            </p>
            {step.link && (
              <a
                href={step.link}
                className="inline-block mt-3 text-sm text-accent-purple hover:underline"
              >
                深入了解 →
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/components/viz/TimelineScroll.tsx
git commit -m "feat: add scroll-triggered timeline narrative for homepage"
```

---

### Task 7: BubbleChart and TreeExplorer Components

**Files:**
- Create: `src/components/viz/BubbleChart.tsx`
- Create: `src/components/viz/TreeExplorer.tsx`

- [ ] **Step 1: Create BubbleChart**

Write `src/components/viz/BubbleChart.tsx`:

```tsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { modules, type Module } from "../../data/modules";

export default function BubbleChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Module | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 420;
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    const pack = d3.pack<Module>()
      .size([width - 40, height - 40])
      .padding(6);

    const root = d3.hierarchy({ children: modules } as any)
      .sum((d: any) => d.lines || 0);

    const packed = pack(root as any);

    const g = svg.append("g").attr("transform", "translate(20,20)");

    const nodes = g.selectAll("g")
      .data(packed.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    nodes.append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d: any) => d.data.color)
      .attr("opacity", 0.2)
      .attr("stroke", (d: any) => d.data.color)
      .attr("stroke-width", 1.5);

    nodes.filter((d) => d.r > 25)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("fill", "#e0e0e8")
      .attr("font-size", (d) => Math.min(d.r / 3, 13))
      .text((d: any) => d.data.nameCn);

    nodes.filter((d) => d.r > 25)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("fill", "#8888a0")
      .attr("font-size", (d) => Math.min(d.r / 4, 10))
      .text((d: any) => `${(d.data.lines / 1000).toFixed(0)}K 行`);

    nodes
      .on("mouseenter", function (_, d: any) {
        setActive(d.data);
        d3.select(this).select("circle").transition().duration(200).attr("opacity", 0.4);
      })
      .on("mouseleave", function () {
        setActive(null);
        d3.select(this).select("circle").transition().duration(200).attr("opacity", 0.2);
      });
  }, []);

  return (
    <div ref={containerRef} className="relative rounded-xl border border-bg-border bg-bg-card p-4">
      <svg ref={svgRef} className="w-full" />
      {active && (
        <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-bg/90 border border-bg-border p-4 backdrop-blur">
          <p className="font-semibold" style={{ color: active.color }}>
            {active.nameCn} ({active.name})
          </p>
          <p className="text-sm text-text-secondary mt-1">{active.descriptionCn}</p>
          <p className="text-xs text-text-secondary mt-2 font-mono">
            {active.files} 文件 · {active.lines.toLocaleString()} 行代码 · {active.path}
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create TreeExplorer**

Write `src/components/viz/TreeExplorer.tsx`:

```tsx
import { useState } from "react";

interface TreeNode {
  name: string;
  description?: string;
  children?: TreeNode[];
}

interface Props {
  data: TreeNode;
  defaultExpanded?: number;
}

function TreeItem({ node, depth, defaultExpanded }: { node: TreeNode; depth: number; defaultExpanded: number }) {
  const [isOpen, setIsOpen] = useState(depth < defaultExpanded);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-bg-card transition-colors ${
          hasChildren ? "cursor-pointer" : ""
        }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          <span className={`text-text-secondary text-xs transition-transform ${isOpen ? "rotate-90" : ""}`}>
            ▶
          </span>
        ) : (
          <span className="text-text-secondary text-xs">·</span>
        )}
        <span className={`font-mono text-sm ${hasChildren ? "text-accent-purple" : "text-text"}`}>
          {node.name}
        </span>
        {node.description && (
          <span className="text-xs text-text-secondary ml-2 hidden sm:inline">
            {node.description}
          </span>
        )}
      </div>
      {isOpen && hasChildren && (
        <div>
          {node.children!.map((child, i) => (
            <TreeItem key={i} node={child} depth={depth + 1} defaultExpanded={defaultExpanded} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeExplorer({ data, defaultExpanded = 1 }: Props) {
  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-4 font-mono text-sm overflow-auto max-h-96">
      <TreeItem node={data} depth={0} defaultExpanded={defaultExpanded} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/components/viz/BubbleChart.tsx src/components/viz/TreeExplorer.tsx
git commit -m "feat: add BubbleChart and TreeExplorer visualization components"
```

---

### Task 8: FlowDiagram Component

**Files:**
- Create: `src/components/viz/FlowDiagram.tsx`

- [ ] **Step 1: Create FlowDiagram**

Write `src/components/viz/FlowDiagram.tsx`:

```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FlowNode {
  id: string;
  label: string;
  description?: string;
  color: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
  direction?: "horizontal" | "vertical";
}

export default function FlowDiagram({ nodes, edges, direction = "horizontal" }: Props) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const isHorizontal = direction === "horizontal";

  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-6 overflow-x-auto">
      <div className={`flex ${isHorizontal ? "flex-row" : "flex-col"} items-center gap-2 min-w-fit`}>
        {nodes.map((node, i) => {
          const edge = i < edges.length ? edges[i] : null;
          return (
            <div key={node.id} className={`flex ${isHorizontal ? "flex-row" : "flex-col"} items-center gap-2`}>
              {/* Node */}
              <motion.div
                className="relative cursor-pointer rounded-lg border-2 px-4 py-3 text-center min-w-[120px]"
                style={{
                  borderColor: activeNode === node.id ? node.color : "#1e1e2e",
                  backgroundColor: activeNode === node.id ? `${node.color}15` : "transparent",
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              >
                <p className="text-sm font-medium" style={{ color: node.color }}>
                  {node.label}
                </p>
              </motion.div>

              {/* Arrow */}
              {edge && (
                <div className={`flex ${isHorizontal ? "flex-col" : "flex-row"} items-center gap-1`}>
                  <span className="text-text-secondary text-xs">
                    {isHorizontal ? "→" : "↓"}
                  </span>
                  {edge.label && (
                    <span className="text-[10px] text-text-secondary whitespace-nowrap">
                      {edge.label}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="rounded-lg bg-bg border border-bg-border p-4">
              <p className="text-sm text-text-secondary">
                {nodes.find((n) => n.id === activeNode)?.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/components/viz/FlowDiagram.tsx
git commit -m "feat: add interactive FlowDiagram component"
```

---

### Task 9: Homepage

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create homepage**

Write `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import StatCard from "../components/common/StatCard.tsx";
import TimelineScroll from "../components/viz/TimelineScroll.tsx";
import ArchitectureMap from "../components/viz/ArchitectureMap.tsx";
---

<BaseLayout title="首页">
  {/* Zone 1: Hero */}
  <section class="relative overflow-hidden">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
      <div class="text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          <span class="text-accent-purple">解剖</span> Claude Code
        </h1>
        <p class="mt-6 text-lg text-text-secondary max-w-2xl mx-auto">
          深入浅出分析 Anthropic 的 AI 编程助手。1,902 个源文件，512,000 行代码，
          一个交互式可视化带你理解它的全部设计。
        </p>
        <p class="mt-3 text-sm text-text-secondary/60">
          基于 2026-03-31 从 npm source map 泄露的 TypeScript 源码
        </p>
      </div>

      {/* Key stats */}
      <div class="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard client:visible value={1902} label="源文件" color="#6c63ff" />
        <StatCard client:visible value={512} suffix="K+" label="代码行数" color="#22d3ee" />
        <StatCard client:visible value={45} suffix="+" label="内置工具" color="#10b981" />
        <StatCard client:visible value={6} label="核心系统" color="#f59e0b" />
      </div>
    </div>
  </section>

  {/* Zone 2: Journey */}
  <section class="py-24 border-t border-bg-border">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold">一次对话的旅程</h2>
        <p class="mt-4 text-text-secondary max-w-xl mx-auto">
          当你输入 "帮我修复这个 bug"，Claude Code 在幕后做了什么？
        </p>
      </div>
      <div class="max-w-2xl mx-auto">
        <TimelineScroll client:visible />
      </div>
    </div>
  </section>

  {/* Zone 3: Architecture Map */}
  <section class="py-24 border-t border-bg-border">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold">系统架构全景</h2>
        <p class="mt-4 text-text-secondary max-w-xl mx-auto">
          15 个子系统，4 个架构层级。悬停查看简介，缩放探索细节。
        </p>
      </div>
      <ArchitectureMap client:visible />
      <div class="mt-6 flex flex-wrap justify-center gap-6 text-sm">
        <span class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[#22d3ee]"></span>
          核心层
        </span>
        <span class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[#a78bfa]"></span>
          UI 层
        </span>
        <span class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[#f472b6]"></span>
          扩展层
        </span>
        <span class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[#fb923c]"></span>
          集成层
        </span>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Verify dev server renders correctly**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
npx astro dev --port 4321 &
sleep 3 && curl -s http://localhost:4321/ | head -50
kill %1
```

Expected: HTML output containing "解剖 Claude Code" and component wrappers.

- [ ] **Step 3: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/pages/index.astro
git commit -m "feat: build homepage with hero stats, timeline narrative, and architecture map"
```

---

### Task 10: Overview Page

**Files:**
- Create: `src/pages/overview.astro`

- [ ] **Step 1: Create overview page**

Write `src/pages/overview.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Sidebar from "../components/layout/Sidebar.tsx";
import StatCard from "../components/common/StatCard.tsx";
import SectionHeading from "../components/common/SectionHeading.astro";
import LayerToggle from "../components/common/LayerToggle.tsx";
import BubbleChart from "../components/viz/BubbleChart.tsx";
import TreeExplorer from "../components/viz/TreeExplorer.tsx";

const sidebarItems = [
  { id: "scale", label: "项目规模", level: 1 },
  { id: "modules", label: "模块全景", level: 1 },
  { id: "tech-stack", label: "技术栈", level: 1 },
  { id: "directory", label: "目录结构", level: 1 },
  { id: "highlights", label: "设计亮点", level: 1 },
];

const directoryTree = {
  name: "src/",
  children: [
    { name: "main.tsx", description: "入口文件（Commander.js CLI 解析）" },
    { name: "QueryEngine.ts", description: "核心会话状态机" },
    { name: "query.ts", description: "主查询提交函数" },
    { name: "Tool.ts", description: "工具类型定义" },
    { name: "tools.ts", description: "工具注册表" },
    { name: "commands.ts", description: "命令注册表" },
    {
      name: "tools/",
      description: "45+ 工具实现",
      children: [
        { name: "BashTool/", description: "Shell 命令执行" },
        { name: "FileReadTool/", description: "文件读取" },
        { name: "FileEditTool/", description: "文件编辑" },
        { name: "AgentTool/", description: "子 Agent 派生" },
        { name: "MCPTool/", description: "MCP 工具调用" },
        { name: "... 39 more", description: "" },
      ],
    },
    {
      name: "services/",
      description: "外部服务集成",
      children: [
        { name: "api/", description: "Claude API 调用" },
        { name: "mcp/", description: "MCP 协议客户端" },
        { name: "compact/", description: "消息压缩策略" },
        { name: "analytics/", description: "遥测与特性门控" },
        { name: "tools/", description: "工具调度与执行" },
      ],
    },
    {
      name: "components/",
      description: "346 个 React UI 组件",
      children: [
        { name: "App.tsx", description: "根组件" },
        { name: "REPL.tsx", description: "主循环界面（5K 行）" },
        { name: "PromptInput/", description: "用户输入组件" },
        { name: "design-system/", description: "统一组件库" },
      ],
    },
    { name: "hooks/", description: "104 个自定义 React hooks" },
    { name: "ink/", description: "终端渲染引擎（96 文件）" },
    { name: "bridge/", description: "IDE 双向通信（WebSocket）" },
    { name: "utils/", description: "564 个工具函数" },
    { name: "state/", description: "中央状态管理" },
    { name: "commands/", description: "~50 个斜杠命令" },
    { name: "skills/", description: "技能系统" },
    { name: "plugins/", description: "插件系统" },
  ],
};
---

<BaseLayout title="架构概览">
  <Sidebar client:load items={sidebarItems} />

  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
    {/* Hero */}
    <div class="mb-16">
      <h1 class="text-4xl font-bold">架构概览</h1>
      <p class="mt-4 text-xl text-text-secondary">
        1,902 个文件，512K 行 TypeScript，一个 AI 编程助手的完整解剖
      </p>
    </div>

    {/* Scale */}
    <SectionHeading id="scale" title="项目规模" subtitle="Claude Code 有多大？" />

    <LayerToggle client:visible
      plain={
        <p>
          想象一本 1,000 页的技术书，每页 500 行代码 — 这就是 Claude Code 的体量。
          它用 TypeScript 编写，运行在 Bun 上（比 Node.js 更快的 JavaScript 运行时），
          用 React 画界面 — 不过不是画在浏览器里，而是画在你的终端里。
        </p>
      }
      technical={
        <div>
          <p>
            512,664 行 TypeScript/TSX 代码，分布在 1,902 个文件中。
            运行时为 Bun，终端 UI 基于 React + Ink（React 的终端渲染器），
            使用 Yoga 进行 Flexbox 布局计算。
          </p>
          <ul class="mt-2 text-sm space-y-1">
            <li>· 1,332 个 .ts 文件（逻辑、类型、工具）</li>
            <li>· 552 个 .tsx 文件（React 组件）</li>
            <li>· 18 个 .js 文件（配置、兼容层）</li>
          </ul>
        </div>
      }
    />

    <div class="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard client:visible value={1902} label="源文件" color="#6c63ff" />
      <StatCard client:visible value={512664} label="代码行数" color="#22d3ee" />
      <StatCard client:visible value={1332} label=".ts 文件" color="#10b981" />
      <StatCard client:visible value={552} label=".tsx 文件" color="#f59e0b" />
    </div>

    {/* Module overview */}
    <div class="mt-24">
      <SectionHeading id="modules" title="模块全景" subtitle="每个气泡的面积代表代码量，颜色代表所属层级" />
      <BubbleChart client:visible />
    </div>

    {/* Tech stack */}
    <div class="mt-24">
      <SectionHeading id="tech-stack" title="技术栈" subtitle="Claude Code 用了什么技术？" />

      <div class="grid sm:grid-cols-2 gap-4">
        {[
          { name: "Bun", desc: "JavaScript/TypeScript 运行时，比 Node.js 快 3-5x", color: "#f5f5f5" },
          { name: "TypeScript", desc: "类型安全的 JavaScript，所有代码都有严格类型", color: "#3178c6" },
          { name: "React + Ink", desc: "React 渲染到终端而非浏览器，组件化 TUI", color: "#61dafb" },
          { name: "Yoga", desc: "Facebook 的 Flexbox 布局引擎，用于终端布局", color: "#a78bfa" },
          { name: "Zod", desc: "运行时类型验证，用于工具输入和配置校验", color: "#3068b7" },
          { name: "D3 / tree-sitter", desc: "Bash 命令的 AST 解析，用于安全分析", color: "#f59e0b" },
        ].map((tech) => (
          <div class="rounded-lg border border-bg-border bg-bg-card p-4">
            <p class="font-semibold" style={`color: ${tech.color}`}>{tech.name}</p>
            <p class="text-sm text-text-secondary mt-1">{tech.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Directory structure */}
    <div class="mt-24">
      <SectionHeading id="directory" title="目录结构" subtitle="点击文件夹展开查看" />
      <TreeExplorer client:visible data={directoryTree} defaultExpanded={1} />
    </div>

    {/* Design highlights */}
    <div class="mt-24">
      <SectionHeading id="highlights" title="设计亮点" subtitle="Claude Code 最值得学习的工程实践" />

      <div class="space-y-6">
        {[
          {
            title: "Async Generator 驱动一切",
            desc: "从 API 流式响应到工具执行，所有数据流都用 async generator 实现。内存占用平稳，UI 实时更新，取消操作天然支持。",
          },
          {
            title: "读并行、写串行的工具调度",
            desc: "读操作（Glob、Grep、Read）可以安全并行，写操作（Edit、Write、Bash）必须串行。这个简单的分区策略大幅提升了速度，同时避免竞态条件。",
          },
          {
            title: "三层纵深防御的权限系统",
            desc: "ML 分类器处理 80% 的常见情况，规则引擎覆盖用户自定义策略，最后才弹出确认对话框。速度和安全的完美平衡。",
          },
          {
            title: "特性门控的渐进发布",
            desc: "通过 feature('FLAG_NAME') 函数控制功能开关，支持按用户类型、环境、百分比灰度发布。Bun 打包时未使用的代码会被消除。",
          },
        ].map((item) => (
          <div class="rounded-lg border border-bg-border bg-bg-card p-6">
            <h3 class="font-semibold text-accent-purple">{item.title}</h3>
            <p class="text-sm text-text-secondary mt-2 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
npx astro build
```

Expected: Build completes with no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/pages/overview.astro
git commit -m "feat: add overview page with bubble chart, tech stack, and directory explorer"
```

---

### Task 11: Query Pipeline Page

**Files:**
- Create: `src/pages/query-pipeline.astro`

- [ ] **Step 1: Create query pipeline page**

Write `src/pages/query-pipeline.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Sidebar from "../components/layout/Sidebar.tsx";
import SectionHeading from "../components/common/SectionHeading.astro";
import LayerToggle from "../components/common/LayerToggle.tsx";
import StatCard from "../components/common/StatCard.tsx";
import FlowDiagram from "../components/viz/FlowDiagram.tsx";
import { snippets } from "../data/codeSnippets";

const sidebarItems = [
  { id: "what", label: "这是什么", level: 1 },
  { id: "flow", label: "消息流水线", level: 1 },
  { id: "system-prompt", label: "系统提示构建", level: 1 },
  { id: "streaming", label: "流式处理", level: 1 },
  { id: "tool-loop", label: "工具调用循环", level: 1 },
  { id: "compaction", label: "上下文压缩", level: 1 },
  { id: "code", label: "核心代码", level: 1 },
];

const pipelineNodes = [
  { id: "input", label: "用户输入", description: "PromptInput 组件捕获用户输入，附加当前目录、git 状态等上下文信息。变量替换和 Shell 命令预处理在此完成。", color: "#e0e0e8" },
  { id: "normalize", label: "消息标准化", description: "创建标准化的 user message，注入记忆附件（Memory），过滤权限受限内容，去重附件。", color: "#8888a0" },
  { id: "system", label: "系统提示拼装", description: "组装完整的系统提示：默认提示 + 用户环境 + 工具定义 + 项目规则 + 附加上下文。这是 Claude 收到的完整指令。", color: "#22d3ee" },
  { id: "api", label: "API 流式调用", description: "通过 Anthropic API 发送请求，配置模型、token 预算、thinking 模式。响应以 async generator 流式返回。", color: "#6c63ff" },
  { id: "tools", label: "工具执行", description: "解析 Claude 返回的 tool_use 块，通过权限检查后调度执行。读操作并行，写操作串行。", color: "#10b981" },
  { id: "loop", label: "循环/返回", description: "工具结果作为新消息送回 Claude。如果 Claude 需要更多操作，循环继续。直到 stop_reason 为 end_turn 时结束。", color: "#a78bfa" },
];

const pipelineEdges = [
  { from: "input", to: "normalize", label: "预处理" },
  { from: "normalize", to: "system", label: "注入上下文" },
  { from: "system", to: "api", label: "发送请求" },
  { from: "api", to: "tools", label: "tool_use" },
  { from: "tools", to: "loop", label: "执行结果" },
];
---

<BaseLayout title="查询管线">
  <Sidebar client:load items={sidebarItems} />

  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
    {/* Hero */}
    <div class="mb-16">
      <p class="text-sm font-mono text-accent-cyan">核心系统</p>
      <h1 class="text-4xl font-bold mt-2">查询管线</h1>
      <p class="mt-4 text-xl text-text-secondary">
        从你敲下回车到 Claude 回复的完整旅程
      </p>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-16">
      <StatCard client:visible value={3000} label="核心代码行数" color="#22d3ee" />
      <StatCard client:visible value={12} label="管线文件" color="#6c63ff" />
      <StatCard client:visible value={6} label="处理阶段" color="#10b981" />
    </div>

    {/* What is it */}
    <SectionHeading id="what" title="这是什么？" />

    <LayerToggle client:visible
      plain={
        <div>
          <p>
            查询管线就像一个<strong>餐厅的完整点餐流程</strong>。
          </p>
          <p class="mt-2">
            你（顾客）对服务员说了一句话 → 服务员把它翻译成厨房能懂的完整订单（加上你的过敏信息、座位号等）→
            厨房做菜（Claude 思考回答）→ 如果需要食材，派人去仓库取（调用工具）→
            取回食材后继续做菜 → 最终端上来（回复你）。
          </p>
          <p class="mt-2">
            整个过程是<strong>流式</strong>的 — 就像日料的 omakase，一道道上，不是一次端上所有菜。
          </p>
        </div>
      }
      technical={
        <div>
          <p>
            查询管线是 Claude Code 的核心循环，由 <code>query.ts</code> 中的 <code>submitMessage()</code>
            async generator 驱动。它管理完整的消息生命周期：输入标准化 → 系统提示构建 → API 流式请求 →
            工具调度执行 → 递归循环。
          </p>
          <p class="mt-2">
            关键文件：<code>QueryEngine.ts</code>（会话状态机，1,295 行）管理可变会话状态；
            <code>query.ts</code>（1,729 行）实现核心逻辑；<code>query/</code> 子目录包含配置、
            依赖注入、token 预算、停止钩子等模块。
          </p>
        </div>
      }
    />

    {/* Flow diagram */}
    <div class="mt-24">
      <SectionHeading id="flow" title="消息流水线" subtitle="点击每个节点查看详细说明" />
      <FlowDiagram client:visible nodes={pipelineNodes} edges={pipelineEdges} />
    </div>

    {/* System prompt */}
    <div class="mt-24">
      <SectionHeading id="system-prompt" title="系统提示构建" subtitle="Claude 实际收到的完整指令" />
      <div class="space-y-4">
        {[
          { label: "默认系统提示", desc: "定义 Claude Code 的身份、能力、行为规范", size: "~5KB" },
          { label: "用户环境信息", desc: "操作系统、Shell、工作目录、git 状态、当前日期", size: "~1KB" },
          { label: "工具定义", desc: "45+ 工具的名称、描述、输入 JSON Schema", size: "~20KB" },
          { label: "项目规则", desc: "CLAUDE.md / .claude/config.json 中的用户自定义规则", size: "可变" },
          { label: "记忆附件", desc: "之前对话中保存的记忆、文件引用", size: "可变" },
        ].map((item) => (
          <div class="flex items-start gap-4 rounded-lg border border-bg-border bg-bg-card p-4">
            <span class="text-xs font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded">{item.size}</span>
            <div>
              <p class="font-medium text-text">{item.label}</p>
              <p class="text-sm text-text-secondary">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Streaming */}
    <div class="mt-24">
      <SectionHeading id="streaming" title="流式处理" subtitle="为什么回复是一个字一个字蹦出来的？" />
      <LayerToggle client:visible
        plain={
          <p>
            想象水龙头和水桶的区别。传统方式是等水桶装满了再端过来（等完整回复），
            Claude Code 用的是水龙头模式 — 水一出来就流到你杯子里。技术上这叫 "async generator"，
            一种让数据像水流一样一点点传输的编程技巧。好处：响应快、内存小、随时可以关掉水龙头（取消操作）。
          </p>
        }
        technical={
          <p>
            所有数据流通过 <code>AsyncGenerator&lt;MessageUpdate&gt;</code> 传输。
            <code>submitMessage()</code> 是一个 async generator，每收到一个 API stream event 就 yield 一个 update。
            消费方用 <code>for await...of</code> 逐条处理，天然支持背压（backpressure）。
            取消通过 <code>AbortController</code> 实现。这个模式贯穿整个代码库 — 工具执行、钩子处理、消息压缩都使用它。
          </p>
        }
      />
    </div>

    {/* Tool loop */}
    <div class="mt-24">
      <SectionHeading id="tool-loop" title="工具调用循环" subtitle="Claude 是如何不断调用工具直到完成任务的？" />
      <div class="rounded-lg border border-bg-border bg-bg-card p-6">
        <ol class="space-y-4 text-sm">
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple text-xs flex items-center justify-center font-mono">1</span>
            <span>Claude 的响应中包含 <code class="text-accent-purple">tool_use</code> 块（"我想读取 src/main.tsx"）</span>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-accent-amber/20 text-accent-amber text-xs flex items-center justify-center font-mono">2</span>
            <span>权限系统评估：这个操作安全吗？→ 通过后执行工具</span>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-accent-emerald/20 text-accent-emerald text-xs flex items-center justify-center font-mono">3</span>
            <span>工具执行结果作为 <code class="text-accent-emerald">tool_result</code> 消息追加到对话历史</span>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan text-xs flex items-center justify-center font-mono">4</span>
            <span>带着新的对话历史再次调用 API — Claude 看到工具结果后决定下一步</span>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple text-xs flex items-center justify-center font-mono">5</span>
            <span>重复直到 Claude 返回 <code class="text-accent-purple">stop_reason: "end_turn"</code>（任务完成）</span>
          </li>
        </ol>
      </div>
    </div>

    {/* Core code */}
    <div class="mt-24">
      <SectionHeading id="code" title="核心代码" subtitle="简化后的查询循环实现" />

      <div class="rounded-lg border border-bg-border bg-bg-card p-6 overflow-x-auto">
        <p class="text-xs text-text-secondary mb-4 font-mono">{snippets.queryLoop.titleCn}</p>
        <pre class="text-sm font-mono leading-relaxed"><code class="text-text">{snippets.queryLoop.code}</code></pre>
      </div>

      <div class="mt-4 space-y-2">
        {Object.entries(snippets.queryLoop.annotations!).map(([line, note]) => (
          <div class="flex items-start gap-3 text-sm">
            <span class="flex-shrink-0 text-xs font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded">
              L{line}
            </span>
            <span class="text-text-secondary">{note}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/pages/query-pipeline.astro
git commit -m "feat: add query pipeline deep-dive page with flow diagram and code walkthrough"
```

---

### Task 12: Tool System Page

**Files:**
- Create: `src/pages/tool-system.astro`
- Create: `src/components/interactive/ToolOrchestrationDemo.tsx`

- [ ] **Step 1: Create ToolOrchestrationDemo**

Write `src/components/interactive/ToolOrchestrationDemo.tsx`:

```tsx
import { useState } from "react";
import { motion } from "framer-motion";

interface ToolCall {
  name: string;
  type: "read" | "write";
  duration: number;
  color: string;
}

const scenario: ToolCall[] = [
  { name: "Glob('*.ts')", type: "read", duration: 0.3, color: "#6c63ff" },
  { name: "Grep('TODO')", type: "read", duration: 0.4, color: "#6c63ff" },
  { name: "Read('main.tsx')", type: "read", duration: 0.2, color: "#6c63ff" },
  { name: "Edit('main.tsx')", type: "write", duration: 0.5, color: "#f59e0b" },
  { name: "Write('test.ts')", type: "write", duration: 0.4, color: "#f59e0b" },
  { name: "Bash('npm test')", type: "write", duration: 1.0, color: "#ef4444" },
];

export default function ToolOrchestrationDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(-1);

  const readOps = scenario.filter((t) => t.type === "read");
  const writeOps = scenario.filter((t) => t.type === "write");

  function play() {
    setIsPlaying(true);
    setStep(0);
    // Step 0: parallel reads (1s), then sequential writes
    setTimeout(() => setStep(1), 1000); // reads done
    setTimeout(() => setStep(2), 1800); // write 1 done
    setTimeout(() => setStep(3), 2400); // write 2 done
    setTimeout(() => setStep(4), 3600); // write 3 done
    setTimeout(() => { setStep(5); setIsPlaying(false); }, 4000);
  }

  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-text">工具调度模拟器</p>
        <button
          onClick={play}
          disabled={isPlaying}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-accent-purple text-white disabled:opacity-50 hover:bg-accent-purple/80 transition-colors"
        >
          {isPlaying ? "执行中..." : "▶ 运行"}
        </button>
      </div>

      {/* Parallel reads */}
      <div className="mb-6">
        <p className="text-xs font-mono text-text-secondary mb-2">阶段 1 — 读操作（并行）</p>
        <div className="space-y-2">
          {readOps.map((op, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-mono w-32 text-text-secondary">{op.name}</span>
              <div className="flex-1 h-6 bg-bg rounded relative overflow-hidden">
                <motion.div
                  className="h-full rounded"
                  style={{ backgroundColor: op.color }}
                  initial={{ width: 0, opacity: 0.6 }}
                  animate={step >= 0 ? { width: `${op.duration * 200}%`, opacity: 0.6 } : {}}
                  transition={{ duration: op.duration, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-mono w-8 text-text-secondary">
                {step >= 1 ? "✓" : step >= 0 ? "..." : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sequential writes */}
      <div>
        <p className="text-xs font-mono text-text-secondary mb-2">阶段 2 — 写操作（串行）</p>
        <div className="space-y-2">
          {writeOps.map((op, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-mono w-32 text-text-secondary">{op.name}</span>
              <div className="flex-1 h-6 bg-bg rounded relative overflow-hidden">
                <motion.div
                  className="h-full rounded"
                  style={{ backgroundColor: op.color }}
                  initial={{ width: 0, opacity: 0.6 }}
                  animate={step >= i + 2 ? { width: `${op.duration * 150}%`, opacity: 0.6 } : {}}
                  transition={{ duration: op.duration, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-mono w-8 text-text-secondary">
                {step >= i + 2 ? "✓" : step >= i + 1 && i === 0 ? "..." : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {step >= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-accent-emerald text-center"
        >
          读操作同时完成（0.4s），写操作依次执行（1.9s）— 总计 2.3s 而非串行的 2.8s
        </motion.div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create tool system page**

Write `src/pages/tool-system.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Sidebar from "../components/layout/Sidebar.tsx";
import SectionHeading from "../components/common/SectionHeading.astro";
import LayerToggle from "../components/common/LayerToggle.tsx";
import StatCard from "../components/common/StatCard.tsx";
import FlowDiagram from "../components/viz/FlowDiagram.tsx";
import ToolOrchestrationDemo from "../components/interactive/ToolOrchestrationDemo.tsx";
import { toolCategories } from "../data/tools";
import { snippets } from "../data/codeSnippets";

const sidebarItems = [
  { id: "what", label: "这是什么", level: 1 },
  { id: "catalog", label: "工具目录", level: 1 },
  { id: "execution", label: "执行流程", level: 1 },
  { id: "orchestration", label: "调度策略", level: 1 },
  { id: "code", label: "核心代码", level: 1 },
];

const executionNodes = [
  { id: "parse", label: "解析 tool_use", description: "从 Claude 的响应中提取 tool_use 块：工具名称、输入参数", color: "#e0e0e8" },
  { id: "validate", label: "输入校验", description: "用 Zod schema 校验工具输入，拒绝格式错误的调用", color: "#8888a0" },
  { id: "permission", label: "权限检查", description: "canUseTool() 三层评估：ML 分类器 → 规则引擎 → 用户确认", color: "#f59e0b" },
  { id: "execute", label: "执行工具", description: "调用工具的 call() 方法，传入 ToolUseContext（应用状态、文件历史等）", color: "#10b981" },
  { id: "hook", label: "PostToolUse Hook", description: "执行用户定义的 PostToolUse 钩子：可修改输出、发送通知、记录日志", color: "#a78bfa" },
  { id: "result", label: "返回结果", description: "将 tool_result 消息添加到对话历史，供 Claude 在下一轮使用", color: "#22d3ee" },
];

const executionEdges = [
  { from: "parse", to: "validate" },
  { from: "validate", to: "permission" },
  { from: "permission", to: "execute", label: "允许" },
  { from: "execute", to: "hook" },
  { from: "hook", to: "result" },
];
---

<BaseLayout title="工具系统">
  <Sidebar client:load items={sidebarItems} />

  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
    {/* Hero */}
    <div class="mb-16">
      <p class="text-sm font-mono text-accent-emerald">核心系统</p>
      <h1 class="text-4xl font-bold mt-2">工具系统</h1>
      <p class="mt-4 text-xl text-text-secondary">
        45 个工具，3 种执行模式，AI 的瑞士军刀
      </p>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-16">
      <StatCard client:visible value={45} suffix="+" label="内置工具" color="#10b981" />
      <StatCard client:visible value={9} label="工具类别" color="#6c63ff" />
      <StatCard client:visible value={50828} label="实现代码行数" color="#f59e0b" />
    </div>

    {/* What */}
    <SectionHeading id="what" title="这是什么？" />

    <LayerToggle client:visible
      plain={
        <div>
          <p>
            想象 Claude 是一个<strong>装修工人</strong>，工具系统就是它的<strong>工具箱</strong>。
          </p>
          <p class="mt-2">
            当你说"帮我修复这个 bug"，Claude 不是凭空回答，而是打开工具箱：
            用搜索工具找到相关代码，用文件读取工具查看内容，用编辑工具修改代码，
            用 Bash 工具运行测试。它自己选择用哪个工具，用什么顺序。
          </p>
          <p class="mt-2">
            更聪明的是：同时可以搜索多个文件（并行），但修改文件必须一个一个来（串行），
            避免把事情搞乱。
          </p>
        </div>
      }
      technical={
        <p>
          工具系统由 <code>Tool.ts</code> 定义工具接口，<code>tools.ts</code> 注册所有工具，
          <code>services/tools/toolOrchestration.ts</code> 负责调度执行。
          每个工具定义 <code>inputSchema</code>（Zod）、<code>isReadOnly()</code>、
          <code>call()</code> 方法。工具调度器根据 <code>isReadOnly()</code> 将调用分为并行批次和串行批次。
          Feature flag 控制条件加载（如 PowerShellTool 仅 Windows，REPLTool 仅 ant 用户）。
        </p>
      }
    />

    {/* Tool catalog */}
    <div class="mt-24">
      <SectionHeading id="catalog" title="工具目录" subtitle="悬停查看每个工具的功能" />

      <div class="grid sm:grid-cols-2 gap-4">
        {toolCategories.map((category) => (
          <div class="rounded-lg border border-bg-border bg-bg-card p-5">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-3 h-3 rounded-full" style={`background-color: ${category.color}`}></span>
              <h3 class="font-semibold text-sm">{category.nameCn}</h3>
              <span class="text-xs text-text-secondary ml-auto">{category.tools.length} 个</span>
            </div>
            <div class="space-y-1.5">
              {category.tools.map((tool) => (
                <div class="group flex items-start gap-2">
                  <span class="font-mono text-xs text-accent-purple">{tool.name}</span>
                  <span class="text-xs text-text-secondary hidden group-hover:inline">
                    — {tool.descriptionCn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Execution flow */}
    <div class="mt-24">
      <SectionHeading id="execution" title="执行流程" subtitle="一个工具调用从解析到返回的完整过程" />
      <FlowDiagram client:visible nodes={executionNodes} edges={executionEdges} direction="vertical" />
    </div>

    {/* Orchestration demo */}
    <div class="mt-24">
      <SectionHeading id="orchestration" title="调度策略" subtitle="读并行，写串行 — 点击运行查看效果" />
      <ToolOrchestrationDemo client:visible />
    </div>

    {/* Code */}
    <div class="mt-24">
      <SectionHeading id="code" title="核心代码" subtitle="工具调度的简化实现" />

      <div class="rounded-lg border border-bg-border bg-bg-card p-6 overflow-x-auto">
        <p class="text-xs text-text-secondary mb-4 font-mono">{snippets.toolOrchestration.titleCn}</p>
        <pre class="text-sm font-mono leading-relaxed"><code class="text-text">{snippets.toolOrchestration.code}</code></pre>
      </div>

      <div class="mt-4 space-y-2">
        {Object.entries(snippets.toolOrchestration.annotations!).map(([line, note]) => (
          <div class="flex items-start gap-3 text-sm">
            <span class="flex-shrink-0 text-xs font-mono text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded">
              L{line}
            </span>
            <span class="text-text-secondary">{note}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/components/interactive/ToolOrchestrationDemo.tsx src/pages/tool-system.astro
git commit -m "feat: add tool system page with catalog, execution flow, and orchestration demo"
```

---

### Task 13: Permission & Security Page

**Files:**
- Create: `src/pages/permission-security.astro`
- Create: `src/components/interactive/PermissionSimulator.tsx`

- [ ] **Step 1: Create PermissionSimulator**

Write `src/components/interactive/PermissionSimulator.tsx`:

```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LayerResult {
  layer: string;
  layerCn: string;
  decision: "allow" | "deny" | "pass" | "ask";
  reason: string;
  color: string;
  duration: number;
}

interface Scenario {
  command: string;
  description: string;
  layers: LayerResult[];
  finalDecision: "allow" | "deny" | "ask";
}

const scenarios: Scenario[] = [
  {
    command: "git status",
    description: "查看 git 状态（只读操作）",
    layers: [
      { layer: "ML Classifier", layerCn: "ML 分类器", decision: "allow", reason: "只读 git 命令，置信度 99%", color: "#10b981", duration: 100 },
      { layer: "Rule Engine", layerCn: "规则引擎", decision: "pass", reason: "已被 ML 放行，跳过", color: "#8888a0", duration: 0 },
      { layer: "User Dialog", layerCn: "用户确认", decision: "pass", reason: "已被 ML 放行，跳过", color: "#8888a0", duration: 0 },
    ],
    finalDecision: "allow",
  },
  {
    command: "rm -rf /",
    description: "删除根目录（极度危险）",
    layers: [
      { layer: "ML Classifier", layerCn: "ML 分类器", decision: "deny", reason: "检测到破坏性命令，置信度 99.9%", color: "#ef4444", duration: 50 },
      { layer: "Rule Engine", layerCn: "规则引擎", decision: "pass", reason: "已被 ML 拦截，跳过", color: "#8888a0", duration: 0 },
      { layer: "User Dialog", layerCn: "用户确认", decision: "pass", reason: "已被 ML 拦截，跳过", color: "#8888a0", duration: 0 },
    ],
    finalDecision: "deny",
  },
  {
    command: "npm install lodash",
    description: "安装 npm 包（中等风险）",
    layers: [
      { layer: "ML Classifier", layerCn: "ML 分类器", decision: "pass", reason: "置信度 72%，不够确定，交给规则引擎", color: "#f59e0b", duration: 150 },
      { layer: "Rule Engine", layerCn: "规则引擎", decision: "pass", reason: "无匹配规则", color: "#f59e0b", duration: 80 },
      { layer: "User Dialog", layerCn: "用户确认", decision: "ask", reason: "需要用户确认是否允许安装包", color: "#6c63ff", duration: 0 },
    ],
    finalDecision: "ask",
  },
  {
    command: "cat src/main.tsx",
    description: "读取源文件（安全操作）",
    layers: [
      { layer: "ML Classifier", layerCn: "ML 分类器", decision: "allow", reason: "只读文件操作，置信度 98%", color: "#10b981", duration: 80 },
      { layer: "Rule Engine", layerCn: "规则引擎", decision: "pass", reason: "已被 ML 放行", color: "#8888a0", duration: 0 },
      { layer: "User Dialog", layerCn: "用户确认", decision: "pass", reason: "已被 ML 放行", color: "#8888a0", duration: 0 },
    ],
    finalDecision: "allow",
  },
];

const decisionLabels: Record<string, { text: string; color: string }> = {
  allow: { text: "✓ 允许", color: "#10b981" },
  deny: { text: "✗ 拒绝", color: "#ef4444" },
  ask: { text: "? 需确认", color: "#6c63ff" },
};

export default function PermissionSimulator() {
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState(-1);

  function runScenario(idx: number) {
    setSelected(idx);
    setStep(0);
    setTimeout(() => setStep(1), 600);
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 1400);
  }

  const scenario = selected !== null ? scenarios[selected] : null;

  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-6">
      <p className="text-sm font-medium text-text mb-4">权限模拟器 — 选择一个命令，查看三层防线的判断过程</p>

      {/* Command buttons */}
      <div className="grid sm:grid-cols-2 gap-2 mb-6">
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => runScenario(i)}
            className={`text-left p-3 rounded-lg border text-sm transition-colors ${
              selected === i
                ? "border-accent-purple bg-accent-purple/10"
                : "border-bg-border hover:border-bg-border/80 hover:bg-bg"
            }`}
          >
            <code className="text-accent-purple font-mono text-xs">{s.command}</code>
            <p className="text-text-secondary text-xs mt-1">{s.description}</p>
          </button>
        ))}
      </div>

      {/* Evaluation process */}
      <AnimatePresence mode="wait">
        {scenario && (
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {scenario.layers.map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={step >= i + 1 ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4 rounded-lg bg-bg p-3 border border-bg-border"
              >
                <div className="flex-shrink-0 w-24">
                  <p className="text-xs font-medium" style={{ color: layer.color }}>
                    {layer.layerCn}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-secondary">{layer.reason}</p>
                </div>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{
                    color: layer.color,
                    backgroundColor: `${layer.color}15`,
                  }}
                >
                  {layer.decision === "allow" ? "放行" :
                   layer.decision === "deny" ? "拦截" :
                   layer.decision === "ask" ? "转人工" : "跳过"}
                </span>
              </motion.div>
            ))}

            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-4 border-t border-bg-border"
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: decisionLabels[scenario.finalDecision].color }}
                >
                  {decisionLabels[scenario.finalDecision].text}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Create permission page**

Write `src/pages/permission-security.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Sidebar from "../components/layout/Sidebar.tsx";
import SectionHeading from "../components/common/SectionHeading.astro";
import LayerToggle from "../components/common/LayerToggle.tsx";
import StatCard from "../components/common/StatCard.tsx";
import FlowDiagram from "../components/viz/FlowDiagram.tsx";
import PermissionSimulator from "../components/interactive/PermissionSimulator.tsx";
import { snippets } from "../data/codeSnippets";

const sidebarItems = [
  { id: "what", label: "这是什么", level: 1 },
  { id: "three-layers", label: "三层防线", level: 1 },
  { id: "simulator", label: "权限模拟器", level: 1 },
  { id: "bash-security", label: "Bash 安全分析", level: 1 },
  { id: "rules", label: "规则系统", level: 1 },
  { id: "code", label: "核心代码", level: 1 },
];

const defenseNodes = [
  { id: "input", label: "工具调用请求", description: "Claude 想执行一个操作（如运行 Shell 命令、修改文件）", color: "#e0e0e8" },
  { id: "ml", label: "ML 分类器", description: "机器学习模型快速判断：这个操作安全吗？高置信度时直接决策。处理约 80% 的常见情况。", color: "#22d3ee" },
  { id: "rules", label: "规则引擎", description: "匹配用户定义的规则：'总是允许 git 命令'、'禁止 rm -rf' 等。支持通配符和正则。", color: "#f59e0b" },
  { id: "dialog", label: "用户确认", description: "在终端中弹出确认对话框，展示即将执行的操作，让用户做最终决定。", color: "#6c63ff" },
  { id: "result", label: "执行/拒绝", description: "通过全部检查后执行操作，任一层拒绝则终止。决策记录到 AppState 供分析。", color: "#10b981" },
];

const defenseEdges = [
  { from: "input", to: "ml", label: "评估" },
  { from: "ml", to: "rules", label: "不确定" },
  { from: "rules", to: "dialog", label: "无匹配" },
  { from: "dialog", to: "result", label: "决定" },
];
---

<BaseLayout title="权限与安全">
  <Sidebar client:load items={sidebarItems} />

  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
    {/* Hero */}
    <div class="mb-16">
      <p class="text-sm font-mono text-accent-amber">核心系统</p>
      <h1 class="text-4xl font-bold mt-2">权限与安全</h1>
      <p class="mt-4 text-xl text-text-secondary">
        三层纵深防御，让 AI 既强大又安全
      </p>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-16">
      <StatCard client:visible value={3} label="防御层级" color="#f59e0b" />
      <StatCard client:visible value={23} label="权限模块文件" color="#6c63ff" />
      <StatCard client:visible value={5000} suffix="+" label="安全代码行数" color="#ef4444" />
    </div>

    {/* What */}
    <SectionHeading id="what" title="这是什么？" />

    <LayerToggle client:visible
      plain={
        <div>
          <p>
            Claude Code 能执行命令、修改文件、访问网络。这很强大，但也意味着它可能做出危险操作。
            权限系统就是它的<strong>安全锁</strong> — 确保每一个操作都经过审核。
          </p>
          <p class="mt-2">
            就像<strong>机场安检的三道关卡</strong>：
          </p>
          <ul class="mt-2 space-y-1">
            <li>🔬 <strong>X 光机（ML 分类器）</strong> — 自动扫描，快速放行安全物品，拦截明显危险品</li>
            <li>👮 <strong>安检员（规则引擎）</strong> — 按规章制度（你的自定义规则）逐条检查</li>
            <li>✋ <strong>旅客确认（用户对话框）</strong> — 不确定的情况下让你自己决定</li>
          </ul>
        </div>
      }
      technical={
        <p>
          权限系统分三层：(1) ML 分类器（<code>bashClassifier.ts</code> / <code>yoloClassifier.ts</code>）
          使用训练好的模型判断操作安全性，高置信度时直接决策；(2) 规则引擎（<code>shellRuleMatching.ts</code>）
          匹配用户在 <code>~/.claude/config.json</code>、项目 <code>claude.json</code>、
          CLI flags 中定义的 allow/deny 规则；(3) REPL 中的用户确认对话框。
          <code>utils/permissions/</code> 包含 23 个文件处理权限逻辑，
          <code>utils/bash/</code> 用 tree-sitter 做 Shell 命令 AST 解析。
        </p>
      }
    />

    {/* Three layers */}
    <div class="mt-24">
      <SectionHeading id="three-layers" title="三层防线" subtitle="点击节点查看每层的工作方式" />
      <FlowDiagram client:visible nodes={defenseNodes} edges={defenseEdges} direction="vertical" />
    </div>

    {/* Simulator */}
    <div class="mt-24">
      <SectionHeading id="simulator" title="权限模拟器" subtitle="选一个命令，看三层防线如何判断" />
      <PermissionSimulator client:visible />
    </div>

    {/* Bash security */}
    <div class="mt-24">
      <SectionHeading id="bash-security" title="Bash 安全分析" subtitle="Shell 命令如何被拆解和分析" />

      <LayerToggle client:visible
        plain={
          <div>
            <p>
              当 Claude 想运行一个 Shell 命令时，系统不只是看命令的文字 — 它会像编译器一样<strong>把命令拆解成语法树（AST）</strong>。
            </p>
            <p class="mt-2">
              比如 <code>cat file.txt | grep secret > output.txt</code>，系统会识别出：
              这是一个管道命令，读了一个文件，过滤内容，然后写入另一个文件。
              它会分析每个子命令的风险等级，检测是否有命令注入、路径穿越等安全隐患。
            </p>
          </div>
        }
        technical={
          <div>
            <p>
              <code>utils/bash/bashSecurity.ts</code> 使用 tree-sitter 将 Shell 命令解析为 AST。
              分析器识别：命令链（<code>&&</code>, <code>||</code>, <code>;</code>）、
              管道（<code>|</code>）、重定向（<code>></code>, <code>>></code>）、
              子 Shell（<code>$()</code>）、变量展开（<code>$VAR</code>）等结构。
            </p>
            <p class="mt-2">
              每个子命令都被评估：是否为只读操作（<code>cat</code>, <code>ls</code>）、
              是否修改文件系统（<code>rm</code>, <code>mv</code>）、
              是否有网络访问（<code>curl</code>, <code>wget</code>）。
              路径验证器还会检查文件路径是否在允许的目录范围内。
            </p>
          </div>
        }
      />
    </div>

    {/* Rules */}
    <div class="mt-24">
      <SectionHeading id="rules" title="规则系统" subtitle="用户如何自定义安全策略" />

      <div class="space-y-3">
        {[
          { rule: '"allow": ["git *", "npm test"]', desc: "总是允许 git 和 npm test 命令" },
          { rule: '"deny": ["rm -rf *", "sudo *"]', desc: "禁止删除和 sudo 命令" },
          { rule: 'CLI: --always-allow-bash', desc: "命令行参数：允许所有 Bash 命令（危险！）" },
          { rule: '"permissionMode": "auto"', desc: "自动模式：ML 分类器做所有决策" },
        ].map((item) => (
          <div class="rounded-lg border border-bg-border bg-bg-card p-4 flex items-start gap-4">
            <code class="text-xs font-mono text-accent-amber bg-accent-amber/10 px-2 py-1 rounded flex-shrink-0">
              {item.rule}
            </code>
            <span class="text-sm text-text-secondary">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Code */}
    <div class="mt-24">
      <SectionHeading id="code" title="核心代码" subtitle="三层权限检查的简化实现" />

      <div class="rounded-lg border border-bg-border bg-bg-card p-6 overflow-x-auto">
        <p class="text-xs text-text-secondary mb-4 font-mono">{snippets.permissionCheck.titleCn}</p>
        <pre class="text-sm font-mono leading-relaxed"><code class="text-text">{snippets.permissionCheck.code}</code></pre>
      </div>

      <div class="mt-4 space-y-2">
        {Object.entries(snippets.permissionCheck.annotations!).map(([line, note]) => (
          <div class="flex items-start gap-3 text-sm">
            <span class="flex-shrink-0 text-xs font-mono text-accent-amber bg-accent-amber/10 px-2 py-0.5 rounded">
              L{line}
            </span>
            <span class="text-text-secondary">{note}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add src/components/interactive/PermissionSimulator.tsx src/pages/permission-security.astro
git commit -m "feat: add permission & security page with interactive simulator"
```

---

### Task 14: Build Verification and Final Polish

**Files:**
- Modify: various files as needed for build fixes

- [ ] **Step 1: Full build test**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
npx astro build 2>&1
```

Expected: Build completes with no errors. Fix any issues found.

- [ ] **Step 2: Dev server smoke test**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
npx astro dev --port 4321 &
sleep 3
# Test all pages return 200
for page in "" "overview" "query-pipeline" "tool-system" "permission-security"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4321/${page}")
  echo "${page:-index}: $status"
done
kill %1
```

Expected: All pages return 200.

- [ ] **Step 3: Add .gitignore**

Write `.gitignore`:

```
node_modules/
dist/
.astro/
.DS_Store
```

- [ ] **Step 4: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add .gitignore
git commit -m "chore: add .gitignore"
```

---

### Task 15: GitHub Pages Deployment Setup

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create GitHub Actions workflow**

Write `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx astro build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deployment workflow"
```

- [ ] **Step 3: Create GitHub repo and push**

```bash
cd /Users/petr/Documents/GitHub/claude-code-anatomy
gh repo create claude-code-anatomy --public --source=. --push
```

Expected: Repo created and code pushed. GitHub Actions starts building.
