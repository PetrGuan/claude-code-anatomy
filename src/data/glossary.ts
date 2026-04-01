import type { Locale } from "../i18n/locales";

export interface GlossaryTerm {
  term: string;
  termCn: string;
  definition: string;
  definitionCn: string;
  relatedPage?: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Async Generator",
    termCn: "异步生成器",
    definition: "A function that can yield multiple values over time asynchronously. In Claude Code, async generators power all streaming data flows — from API responses to tool execution results. They enable real-time UI updates and natural backpressure.",
    definitionCn: "一种可以随时间异步产出多个值的函数。在 Claude Code 中，异步生成器驱动所有流式数据流 — 从 API 响应到工具执行结果。它们实现了实时 UI 更新和自然的背压控制。",
    relatedPage: "/query-pipeline",
  },
  {
    term: "AST (Abstract Syntax Tree)",
    termCn: "AST（抽象语法树）",
    definition: "A tree representation of source code structure. Claude Code uses tree-sitter to parse shell commands into ASTs for security analysis — detecting dangerous patterns like command injection or path traversal.",
    definitionCn: "源代码结构的树形表示。Claude Code 使用 tree-sitter 将 Shell 命令解析为 AST 进行安全分析 — 检测命令注入或路径穿越等危险模式。",
    relatedPage: "/permission-security",
  },
  {
    term: "Context Window",
    termCn: "上下文窗口",
    definition: "The maximum amount of text an AI model can process in a single request. When conversations exceed this limit, Claude Code uses compaction strategies to summarize older messages while preserving important context.",
    definitionCn: "AI 模型在单次请求中能处理的最大文本量。当对话超过此限制时，Claude Code 使用压缩策略来总结较旧的消息，同时保留重要上下文。",
    relatedPage: "/message-compaction",
  },
  {
    term: "Ink",
    termCn: "Ink",
    definition: "A React renderer for the terminal. Instead of rendering to HTML DOM (like web React), Ink renders React components as terminal text with colors, layouts, and interactive elements using ANSI escape codes.",
    definitionCn: "终端的 React 渲染器。与渲染到 HTML DOM 的 Web React 不同，Ink 将 React 组件渲染为带有颜色、布局和交互元素的终端文本，使用 ANSI 转义码。",
    relatedPage: "/terminal-ui",
  },
  {
    term: "MCP (Model Context Protocol)",
    termCn: "MCP（模型上下文协议）",
    definition: "A standard protocol for connecting AI models to external tools and data sources. Like USB-C for AI — any MCP-compatible server can expose tools, resources, and prompts that Claude can discover and use automatically.",
    definitionCn: "一种将 AI 模型连接到外部工具和数据源的标准协议。就像 AI 的 USB-C — 任何兼容 MCP 的服务器都可以暴露工具、资源和提示，Claude 可以自动发现和使用。",
    relatedPage: "/mcp-integration",
  },
  {
    term: "Reconciler",
    termCn: "协调器",
    definition: "The part of React that figures out what changed and updates the output. The browser uses react-dom; Claude Code uses a custom Ink reconciler that maps React operations to terminal output instead of DOM nodes.",
    definitionCn: "React 中负责计算变化并更新输出的部分。浏览器使用 react-dom；Claude Code 使用自定义 Ink 协调器，将 React 操作映射到终端输出而非 DOM 节点。",
    relatedPage: "/terminal-ui",
  },
  {
    term: "Tool Orchestration",
    termCn: "工具调度",
    definition: "The system that manages how Claude's tool calls are executed. Read-only tools (Glob, Grep, Read) run in parallel for speed; write tools (Edit, Write, Bash) run serially to prevent race conditions.",
    definitionCn: "管理 Claude 工具调用执行方式的系统。只读工具（Glob、Grep、Read）并行运行以提高速度；写工具（Edit、Write、Bash）串行运行以防止竞态条件。",
    relatedPage: "/tool-system",
  },
  {
    term: "Yoga",
    termCn: "Yoga",
    definition: "Facebook's cross-platform Flexbox layout engine. In Claude Code, Yoga computes the exact pixel positions of terminal UI elements — enabling proper flex, padding, margin, and absolute positioning in a text-based environment.",
    definitionCn: "Facebook 的跨平台 Flexbox 布局引擎。在 Claude Code 中，Yoga 计算终端 UI 元素的精确像素位置 — 在文本环境中实现正确的 flex、padding、margin 和绝对定位。",
    relatedPage: "/terminal-ui",
  },
  {
    term: "Zod",
    termCn: "Zod",
    definition: "A TypeScript-first runtime type validation library. Claude Code uses Zod schemas to validate tool inputs — every tool defines its expected parameters as a Zod schema, which is automatically converted to JSON Schema for the API.",
    definitionCn: "TypeScript 优先的运行时类型验证库。Claude Code 使用 Zod 模式验证工具输入 — 每个工具将其预期参数定义为 Zod 模式，自动转换为 JSON Schema 供 API 使用。",
    relatedPage: "/tool-system",
  },
  {
    term: "WebSocket",
    termCn: "WebSocket",
    definition: "A persistent, bidirectional communication protocol. Claude Code's IDE bridge uses WebSocket to maintain a real-time connection between the CLI process and VS Code, enabling instant sync of messages, permissions, and file changes.",
    definitionCn: "一种持久的双向通信协议。Claude Code 的 IDE 桥接使用 WebSocket 维持 CLI 进程和 VS Code 之间的实时连接，实现消息、权限和文件更改的即时同步。",
    relatedPage: "/ide-bridge",
  },
  {
    term: "Feature Flag",
    termCn: "特性开关",
    definition: "A mechanism to enable or disable features without deploying new code. Claude Code uses feature('FLAG_NAME') to gate features by user type, environment, or percentage. Disabled code is eliminated by the bundler.",
    definitionCn: "一种无需部署新代码即可启用或禁用功能的机制。Claude Code 使用 feature('FLAG_NAME') 按用户类型、环境或百分比控制功能。禁用的代码会被打包器消除。",
    relatedPage: "/overview",
  },
  {
    term: "Sub-agent",
    termCn: "子 Agent",
    definition: "An independent Claude instance spawned by the main agent to handle a specific subtask. Each sub-agent has its own conversation context, tools, and can run in the foreground (blocking) or background (async notification).",
    definitionCn: "主 Agent 派生的独立 Claude 实例，处理特定子任务。每个子 Agent 有自己的对话上下文、工具，可以在前台运行（阻塞）或后台运行（异步通知）。",
    relatedPage: "/agent-system",
  },
];

export function termName(term: GlossaryTerm, locale: Locale): string {
  return locale === "zh" ? term.termCn : term.term;
}

export function termDefinition(term: GlossaryTerm, locale: Locale): string {
  return locale === "zh" ? term.definitionCn : term.definition;
}
