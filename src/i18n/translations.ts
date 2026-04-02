import type { Locale } from "./locales";

const translations = {
  nav: {
    home: { en: "Home", zh: "首页" },
    overview: { en: "Overview", zh: "架构概览" },
    queryPipeline: { en: "Query Pipeline", zh: "查询管线" },
    toolSystem: { en: "Tool System", zh: "工具系统" },
    permissionSecurity: { en: "Permissions", zh: "权限安全" },
    terminalUI: { en: "Terminal UI", zh: "终端 UI" },
    pluginSkill: { en: "Plugins", zh: "插件系统" },
    messageCompaction: { en: "Compaction", zh: "消息压缩" },
    agentSystem: { en: "Agents", zh: "Agent 系统" },
    ideBridge: { en: "IDE Bridge", zh: "IDE 桥接" },
    mcpIntegration: { en: "MCP", zh: "MCP 集成" },
    glossary: { en: "Glossary", zh: "术语表" },
    easterEggs: { en: "Easter Eggs", zh: "彩蛋" },
  },
  common: {
    plainLabel: { en: "Simple", zh: "通俗版" },
    technicalLabel: { en: "Technical", zh: "技术版" },
    learnMore: { en: "Learn more →", zh: "深入了解 →" },
    toc: { en: "Contents", zh: "目录" },
    sourceFiles: { en: "Source files", zh: "源文件" },
    linesOfCode: { en: "Lines of code", zh: "代码行数" },
    builtInTools: { en: "Built-in tools", zh: "内置工具" },
    coreSystems: { en: "Core systems", zh: "核心系统" },
    items: { en: "items", zh: "个" },
    prevPage: { en: "Previous", zh: "上一篇" },
    nextPage: { en: "Next", zh: "下一篇" },
    relatedPages: { en: "Related Pages", zh: "相关页面" },
  },
  footer: {
    description: {
      en: "Claude Code Anatomy — An in-depth visual analysis of Claude Code's source architecture",
      zh: "Claude Code Anatomy — 深入浅出分析 Claude Code 源码架构",
    },
  },
  home: {
    titleAccent: { en: "Anatomy of", zh: "解剖" },
    title: { en: "Claude Code", zh: "Claude Code" },
    subtitle: {
      en: "A visual, interactive deep-dive into Anthropic's AI coding assistant. 1,902 source files, 512,000 lines of code, one interactive visualization to understand it all.",
      zh: "深入浅出分析 Anthropic 的 AI 编程助手。1,902 个源文件，512,000 行代码，一个交互式可视化带你理解它的全部设计。",
    },
    journeyTitle: { en: "Journey of a Conversation", zh: "一次对话的旅程" },
    journeySubtitle: {
      en: "When you type 'help me fix this bug', what does Claude Code do behind the scenes?",
      zh: '当你输入 "帮我修复这个 bug"，Claude Code 在幕后做了什么？',
    },
    archTitle: { en: "System Architecture", zh: "系统架构全景" },
    archSubtitle: {
      en: "15 subsystems, 4 architecture layers. Hover for details, scroll to zoom.",
      zh: "15 个子系统，4 个架构层级。悬停查看简介，缩放探索细节。",
    },
    legendCore: { en: "Core", zh: "核心层" },
    legendUI: { en: "UI", zh: "UI 层" },
    legendExtension: { en: "Extension", zh: "扩展层" },
    legendIntegration: { en: "Integration", zh: "集成层" },
  },
  timeline: {
    step1Title: { en: "User Input", zh: "用户输入" },
    step1Desc: {
      en: "You type 'help me fix this bug' in the terminal. The PromptInput component captures your input, attaching context like the current directory and git status.",
      zh: "你在终端输入 '帮我修复这个 bug'。PromptInput 组件捕获输入，附加当前目录、git 状态等上下文信息。",
    },
    step2Title: { en: "Permission Check", zh: "权限检查" },
    step2Desc: {
      en: "The three-layer defense activates: ML classifier quickly assesses safety → rule engine matches user-defined policies → confirmation dialog pops up if needed.",
      zh: "三层防线启动：ML 分类器快速判断安全性 → 规则引擎匹配用户自定义策略 → 必要时弹出确认对话框。",
    },
    step3Title: { en: "System Prompt Construction", zh: "系统提示构建" },
    step3Desc: {
      en: "Assembles full context: default system prompt + user environment + 45 tool definitions + memory attachments + project rules. Like a waiter translating your simple order into a complete ticket the kitchen understands.",
      zh: "拼装完整上下文：默认系统提示 + 用户环境信息 + 45 个工具定义 + 记忆附件 + 项目规则。像服务员把你的简单点单翻译成厨房能懂的完整订单。",
    },
    step4Title: { en: "Streaming API Call", zh: "流式 API 调用" },
    step4Desc: {
      en: "Sends the request via the Anthropic API. The response streams back token by token — each one rendered to the terminal immediately. Async generators power it all.",
      zh: "通过 Anthropic API 发送请求。响应以流式返回 — 每个 token 到达时立即渲染到终端，不用等完整回复。async generator 是这一切的骨架。",
    },
    step5Title: { en: "Tool Invocation", zh: "工具调用" },
    step5Desc: {
      en: "Claude decides it needs to read files, search code, or run commands. The tool scheduler kicks in: read ops run in parallel (fast), write ops run serially (safe).",
      zh: "Claude 决定需要读文件、搜索代码、执行命令。工具调度器启动：读操作并行执行（快），写操作串行执行（安全）。",
    },
    step6Title: { en: "Loop & Return", zh: "循环与返回" },
    step6Desc: {
      en: "Tool results go back to Claude, which analyzes them and may call more tools. This loop continues until the task is complete, streaming the final result to your terminal.",
      zh: "工具执行结果返回给 Claude，它分析结果后可能再次调用工具。这个循环持续到任务完成，最终将结果流式渲染到你的终端。",
    },
  },
  overview: {
    title: { en: "Architecture Overview", zh: "架构概览" },
    subtitle: {
      en: "1,902 files, 512K lines of TypeScript — a complete anatomy of an AI coding assistant",
      zh: "1,902 个文件，512K 行 TypeScript，一个 AI 编程助手的完整解剖",
    },
    scaleTitle: { en: "Project Scale", zh: "项目规模" },
    scaleSubtitle: { en: "How big is Claude Code?", zh: "Claude Code 有多大？" },
    scalePlain: {
      en: "Imagine a 1,000-page technical book with 500 lines of code per page — that's the scale of Claude Code. It's written in TypeScript, runs on Bun (a JavaScript runtime faster than Node.js), and uses React to draw its UI — not in a browser, but in your terminal.",
      zh: "想象一本 1,000 页的技术书，每页 500 行代码 — 这就是 Claude Code 的体量。它用 TypeScript 编写，运行在 Bun 上（比 Node.js 更快的 JavaScript 运行时），用 React 画界面 — 不过不是画在浏览器里，而是画在你的终端里。",
    },
    scaleTechnical: {
      en: "512,664 lines of TypeScript/TSX code across 1,902 files. Runtime is Bun. Terminal UI built on React + Ink (React renderer for terminals) with Yoga for Flexbox layout.",
      zh: "512,664 行 TypeScript/TSX 代码，分布在 1,902 个文件中。运行时为 Bun，终端 UI 基于 React + Ink（React 的终端渲染器），使用 Yoga 进行 Flexbox 布局计算。",
    },
    scaleTechDetails: {
      en: "· 1,332 .ts files (logic, types, tools)\n· 552 .tsx files (React components)\n· 18 .js files (config, compat layers)",
      zh: "· 1,332 个 .ts 文件（逻辑、类型、工具）\n· 552 个 .tsx 文件（React 组件）\n· 18 个 .js 文件（配置、兼容层）",
    },
    tsFiles: { en: ".ts files", zh: ".ts 文件" },
    tsxFiles: { en: ".tsx files", zh: ".tsx 文件" },
    modulesTitle: { en: "Module Overview", zh: "模块全景" },
    modulesSubtitle: { en: "Bubble area = lines of code, color = architecture layer", zh: "每个气泡的面积代表代码量，颜色代表所属层级" },
    techStackTitle: { en: "Tech Stack", zh: "技术栈" },
    techStackSubtitle: { en: "What powers Claude Code?", zh: "Claude Code 用了什么技术？" },
    directoryTitle: { en: "Directory Structure", zh: "目录结构" },
    directorySubtitle: { en: "Click folders to expand", zh: "点击文件夹展开查看" },
    highlightsTitle: { en: "Design Highlights", zh: "设计亮点" },
    highlightsSubtitle: { en: "Engineering practices worth learning from Claude Code", zh: "Claude Code 最值得学习的工程实践" },
  },
  techStack: {
    bunDesc: { en: "JavaScript/TypeScript runtime, 3-5x faster than Node.js", zh: "JavaScript/TypeScript 运行时，比 Node.js 快 3-5x" },
    tsDesc: { en: "Type-safe JavaScript with strict typing throughout", zh: "类型安全的 JavaScript，所有代码都有严格类型" },
    reactInkDesc: { en: "React rendering to terminal instead of browser, component-based TUI", zh: "React 渲染到终端而非浏览器，组件化 TUI" },
    yogaDesc: { en: "Facebook's Flexbox layout engine for terminal layout", zh: "Facebook 的 Flexbox 布局引擎，用于终端布局" },
    zodDesc: { en: "Runtime type validation for tool inputs and config", zh: "运行时类型验证，用于工具输入和配置校验" },
    treeSitterDesc: { en: "AST parsing for Bash commands, used for security analysis", zh: "Bash 命令的 AST 解析，用于安全分析" },
  },
  highlights: {
    asyncGenTitle: { en: "Async Generators Power Everything", zh: "Async Generator 驱动一切" },
    asyncGenDesc: { en: "From API streaming to tool execution, all data flows use async generators. Flat memory usage, real-time UI updates, native cancellation support.", zh: "从 API 流式响应到工具执行，所有数据流都用 async generator 实现。内存占用平稳，UI 实时更新，取消操作天然支持。" },
    readWriteTitle: { en: "Read-Parallel, Write-Serial Tool Scheduling", zh: "读并行、写串行的工具调度" },
    readWriteDesc: { en: "Read ops (Glob, Grep, Read) run safely in parallel. Write ops (Edit, Write, Bash) must run serially. This simple partitioning dramatically improves speed while avoiding race conditions.", zh: "读操作（Glob、Grep、Read）可以安全并行，写操作（Edit、Write、Bash）必须串行。这个简单的分区策略大幅提升了速度，同时避免竞态条件。" },
    permissionTitle: { en: "Three-Layer Defense-in-Depth Permissions", zh: "三层纵深防御的权限系统" },
    permissionDesc: { en: "ML classifier handles 80% of common cases, rule engine covers user-defined policies, confirmation dialog is the last resort. A perfect balance of speed and safety.", zh: "ML 分类器处理 80% 的常见情况，规则引擎覆盖用户自定义策略，最后才弹出确认对话框。速度和安全的完美平衡。" },
    featureFlagTitle: { en: "Feature-Gated Progressive Rollout", zh: "特性门控的渐进发布" },
    featureFlagDesc: { en: "Feature flags via feature('FLAG_NAME') control rollout by user type, environment, or percentage. Unused code is eliminated by Bun's bundler.", zh: "通过 feature('FLAG_NAME') 函数控制功能开关，支持按用户类型、环境、百分比灰度发布。Bun 打包时未使用的代码会被消除。" },
  },
  queryPipeline: {
    tag: { en: "Core System", zh: "核心系统" },
    title: { en: "Query Pipeline", zh: "查询管线" },
    subtitle: { en: "The complete journey from pressing Enter to Claude's response", zh: "从你敲下回车到 Claude 回复的完整旅程" },
    coreLines: { en: "Core lines of code", zh: "核心代码行数" },
    pipelineFiles: { en: "Pipeline files", zh: "管线文件" },
    stages: { en: "Processing stages", zh: "处理阶段" },
    whatTitle: { en: "What Is This?", zh: "这是什么？" },
    whatPlain: {
      en: "The query pipeline is like a **complete restaurant ordering process**.\n\nYou (the customer) say something to the waiter → the waiter translates it into a complete order the kitchen understands (adding your allergies, table number, etc.) → the kitchen cooks (Claude thinks) → if ingredients are needed, someone goes to the storeroom (tool calls) → cooking resumes → the dish is served (response).\n\nThe whole process is **streaming** — like omakase, served course by course, not all at once.",
      zh: "查询管线就像一个**餐厅的完整点餐流程**。\n\n你（顾客）对服务员说了一句话 → 服务员把它翻译成厨房能懂的完整订单（加上你的过敏信息、座位号等）→ 厨房做菜（Claude 思考回答）→ 如果需要食材，派人去仓库取（调用工具）→ 取回食材后继续做菜 → 最终端上来（回复你）。\n\n整个过程是**流式**的 — 就像日料的 omakase，一道道上，不是一次端上所有菜。",
    },
    whatTechnical: {
      en: "The query pipeline is Claude Code's core loop, driven by the `submitMessage()` async generator in `query.ts`. It manages the full message lifecycle: input normalization → system prompt construction → streaming API request → tool scheduling → recursive loop.\n\nKey files: `QueryEngine.ts` (session state machine, 1,295 lines) manages mutable session state; `query.ts` (1,729 lines) implements core logic; `query/` subdirectory contains config, dependency injection, token budget, stop hooks.",
      zh: "查询管线是 Claude Code 的核心循环，由 `query.ts` 中的 `submitMessage()` async generator 驱动。它管理完整的消息生命周期：输入标准化 → 系统提示构建 → API 流式请求 → 工具调度执行 → 递归循环。\n\n关键文件：`QueryEngine.ts`（会话状态机，1,295 行）管理可变会话状态；`query.ts`（1,729 行）实现核心逻辑；`query/` 子目录包含配置、依赖注入、token 预算、停止钩子等模块。",
    },
    flowTitle: { en: "Message Pipeline", zh: "消息流水线" },
    flowSubtitle: { en: "Click each node for details", zh: "点击每个节点查看详细说明" },
    systemPromptTitle: { en: "System Prompt Construction", zh: "系统提示构建" },
    systemPromptSubtitle: { en: "The complete instructions Claude actually receives", zh: "Claude 实际收到的完整指令" },
    streamingTitle: { en: "Streaming", zh: "流式处理" },
    streamingSubtitle: { en: "Why does the response appear character by character?", zh: "为什么回复是一个字一个字蹦出来的？" },
    streamingPlain: {
      en: "Imagine the difference between a faucet and a bucket. The traditional approach waits for the bucket to fill up (complete response). Claude Code uses faucet mode — water flows to your glass as soon as it comes out. Technically called an 'async generator', it transmits data bit by bit. Benefits: fast response, low memory, cancel anytime.",
      zh: "想象水龙头和水桶的区别。传统方式是等水桶装满了再端过来（等完整回复），Claude Code 用的是水龙头模式 — 水一出来就流到你杯子里。技术上这叫 \"async generator\"，一种让数据像水流一样一点点传输的编程技巧。好处：响应快、内存小、随时可以关掉水龙头（取消操作）。",
    },
    streamingTechnical: {
      en: "All data flows through `AsyncGenerator<MessageUpdate>`. `submitMessage()` yields an update for each API stream event. Consumers use `for await...of` for natural backpressure. Cancellation via `AbortController`. This pattern is used throughout the entire codebase.",
      zh: "所有数据流通过 `AsyncGenerator<MessageUpdate>` 传输。`submitMessage()` 是一个 async generator，每收到一个 API stream event 就 yield 一个 update。消费方用 `for await...of` 逐条处理，天然支持背压（backpressure）。取消通过 `AbortController` 实现。这个模式贯穿整个代码库。",
    },
    toolLoopTitle: { en: "Tool Call Loop", zh: "工具调用循环" },
    toolLoopSubtitle: { en: "How does Claude keep calling tools until the task is done?", zh: "Claude 是如何不断调用工具直到完成任务的？" },
    codeTitle: { en: "Core Code", zh: "核心代码" },
    codeSubtitle: { en: "Simplified query loop implementation", zh: "简化后的查询循环实现" },
    nodeInput: { en: "User Input", zh: "用户输入" },
    nodeInputDesc: { en: "PromptInput captures user input, attaching current directory, git status, and other context. Variable substitution and shell command preprocessing happen here.", zh: "PromptInput 组件捕获用户输入，附加当前目录、git 状态等上下文信息。变量替换和 Shell 命令预处理在此完成。" },
    nodeNormalize: { en: "Normalize Messages", zh: "消息标准化" },
    nodeNormalizeDesc: { en: "Creates a normalized user message, injects memory attachments, filters permission-restricted content, deduplicates attachments.", zh: "创建标准化的 user message，注入记忆附件（Memory），过滤权限受限内容，去重附件。" },
    nodeSystem: { en: "System Prompt Assembly", zh: "系统提示拼装" },
    nodeSystemDesc: { en: "Assembles the full system prompt: default prompt + user environment + tool definitions + project rules + appended context. This is the complete instruction Claude receives.", zh: "组装完整的系统提示：默认提示 + 用户环境 + 工具定义 + 项目规则 + 附加上下文。这是 Claude 收到的完整指令。" },
    nodeApi: { en: "Streaming API Call", zh: "API 流式调用" },
    nodeApiDesc: { en: "Sends the request via Anthropic API, configuring model, token budget, and thinking mode. Response streams back as an async generator.", zh: "通过 Anthropic API 发送请求，配置模型、token 预算、thinking 模式。响应以 async generator 流式返回。" },
    nodeTools: { en: "Tool Execution", zh: "工具执行" },
    nodeToolsDesc: { en: "Parses tool_use blocks from Claude's response, runs permission checks, then schedules execution. Reads run in parallel, writes run serially.", zh: "解析 Claude 返回的 tool_use 块，通过权限检查后调度执行。读操作并行，写操作串行。" },
    nodeLoop: { en: "Loop / Return", zh: "循环/返回" },
    nodeLoopDesc: { en: "Tool results are sent back to Claude as new messages. If Claude needs more actions, the loop continues until stop_reason is end_turn.", zh: "工具结果作为新消息送回 Claude。如果 Claude 需要更多操作，循环继续。直到 stop_reason 为 end_turn 时结束。" },
    edgePreprocess: { en: "preprocess", zh: "预处理" },
    edgeContext: { en: "inject context", zh: "注入上下文" },
    edgeRequest: { en: "send request", zh: "发送请求" },
    edgeToolUse: { en: "tool_use", zh: "tool_use" },
    edgeResult: { en: "results", zh: "执行结果" },
    sysDefault: { en: "Default system prompt", zh: "默认系统提示" },
    sysDefaultDesc: { en: "Defines Claude Code's identity, capabilities, and behavioral norms", zh: "定义 Claude Code 的身份、能力、行为规范" },
    sysEnv: { en: "User environment", zh: "用户环境信息" },
    sysEnvDesc: { en: "OS, shell, working directory, git status, current date", zh: "操作系统、Shell、工作目录、git 状态、当前日期" },
    sysTools: { en: "Tool definitions", zh: "工具定义" },
    sysToolsDesc: { en: "Names, descriptions, and input JSON Schemas for 45+ tools", zh: "45+ 工具的名称、描述、输入 JSON Schema" },
    sysRules: { en: "Project rules", zh: "项目规则" },
    sysRulesDesc: { en: "User-defined rules from CLAUDE.md / .claude/config.json", zh: "CLAUDE.md / .claude/config.json 中的用户自定义规则" },
    sysMemory: { en: "Memory attachments", zh: "记忆附件" },
    sysMemoryDesc: { en: "Saved memories and file references from prior conversations", zh: "之前对话中保存的记忆、文件引用" },
    toolStep1: { en: "Claude's response contains tool_use blocks (\"I want to read src/main.tsx\")", zh: "Claude 的响应中包含 tool_use 块（\"我想读取 src/main.tsx\"）" },
    toolStep2: { en: "Permission system evaluates: is this operation safe? → execute if passed", zh: "权限系统评估：这个操作安全吗？→ 通过后执行工具" },
    toolStep3: { en: "Tool results appended to conversation history as tool_result messages", zh: "工具执行结果作为 tool_result 消息追加到对话历史" },
    toolStep4: { en: "Call the API again with the updated history — Claude sees the results and decides next step", zh: "带着新的对话历史再次调用 API — Claude 看到工具结果后决定下一步" },
    toolStep5: { en: "Repeat until Claude returns stop_reason: \"end_turn\" (task complete)", zh: "重复直到 Claude 返回 stop_reason: \"end_turn\"（任务完成）" },
  },
  toolSystem: {
    tag: { en: "Core System", zh: "核心系统" },
    title: { en: "Tool System", zh: "工具系统" },
    subtitle: { en: "45 tools, 3 execution modes — AI's Swiss Army knife", zh: "45 个工具，3 种执行模式，AI 的瑞士军刀" },
    toolCount: { en: "Built-in tools", zh: "内置工具" },
    categories: { en: "Categories", zh: "工具类别" },
    implLines: { en: "Implementation LOC", zh: "实现代码行数" },
    whatTitle: { en: "What Is This?", zh: "这是什么？" },
    whatPlain: {
      en: "Imagine Claude is a **handyman** and the tool system is its **toolbox**.\n\nWhen you say 'help me fix this bug', Claude opens the toolbox: uses search tools to find relevant code, file read tools to view content, edit tools to modify code, and Bash to run tests. It picks the right tools in the right order.\n\nEven smarter: it can search multiple files simultaneously (parallel), but must modify files one at a time (serial) to avoid messing things up.",
      zh: "想象 Claude 是一个**装修工人**，工具系统就是它的**工具箱**。\n\n当你说\"帮我修复这个 bug\"，Claude 不是凭空回答，而是打开工具箱：用搜索工具找到相关代码，用文件读取工具查看内容，用编辑工具修改代码，用 Bash 工具运行测试。它自己选择用哪个工具，用什么顺序。\n\n更聪明的是：同时可以搜索多个文件（并行），但修改文件必须一个一个来（串行），避免把事情搞乱。",
    },
    whatTechnical: {
      en: "The tool system is defined by `Tool.ts` (interface), `tools.ts` (registry), and `services/tools/toolOrchestration.ts` (scheduling). Each tool defines `inputSchema` (Zod), `isReadOnly()`, and `call()`. The scheduler partitions calls into parallel (read-only) and serial (write) batches based on `isReadOnly()`.",
      zh: "工具系统由 `Tool.ts` 定义工具接口，`tools.ts` 注册所有工具，`services/tools/toolOrchestration.ts` 负责调度执行。每个工具定义 `inputSchema`（Zod）、`isReadOnly()`、`call()` 方法。工具调度器根据 `isReadOnly()` 将调用分为并行批次和串行批次。",
    },
    catalogTitle: { en: "Tool Catalog", zh: "工具目录" },
    catalogSubtitle: { en: "Hover to see what each tool does", zh: "悬停查看每个工具的功能" },
    executionTitle: { en: "Execution Flow", zh: "执行流程" },
    executionSubtitle: { en: "A tool call's complete journey from parsing to result", zh: "一个工具调用从解析到返回的完整过程" },
    orchestrationTitle: { en: "Scheduling Strategy", zh: "调度策略" },
    orchestrationSubtitle: { en: "Read parallel, write serial — click Run to see it in action", zh: "读并行，写串行 — 点击运行查看效果" },
    codeTitle: { en: "Core Code", zh: "核心代码" },
    codeSubtitle: { en: "Simplified tool scheduling implementation", zh: "工具调度的简化实现" },
    nodeParse: { en: "Parse tool_use", zh: "解析 tool_use" },
    nodeParseDesc: { en: "Extract tool_use blocks from Claude's response: tool name, input parameters", zh: "从 Claude 的响应中提取 tool_use 块：工具名称、输入参数" },
    nodeValidate: { en: "Input Validation", zh: "输入校验" },
    nodeValidateDesc: { en: "Validate tool input with Zod schema, reject malformed calls", zh: "用 Zod schema 校验工具输入，拒绝格式错误的调用" },
    nodePermission: { en: "Permission Check", zh: "权限检查" },
    nodePermissionDesc: { en: "canUseTool() three-layer evaluation: ML classifier → rule engine → user confirmation", zh: "canUseTool() 三层评估：ML 分类器 → 规则引擎 → 用户确认" },
    nodeExecute: { en: "Execute Tool", zh: "执行工具" },
    nodeExecuteDesc: { en: "Call the tool's call() method with ToolUseContext (app state, file history, etc.)", zh: "调用工具的 call() 方法，传入 ToolUseContext（应用状态、文件历史等）" },
    nodeHook: { en: "PostToolUse Hook", zh: "PostToolUse Hook" },
    nodeHookDesc: { en: "Run user-defined PostToolUse hooks: can modify output, send notifications, log events", zh: "执行用户定义的 PostToolUse 钩子：可修改输出、发送通知、记录日志" },
    nodeResult: { en: "Return Result", zh: "返回结果" },
    nodeResultDesc: { en: "Add tool_result message to conversation history for Claude's next turn", zh: "将 tool_result 消息添加到对话历史，供 Claude 在下一轮使用" },
    edgeAllow: { en: "allowed", zh: "允许" },
  },
  permissionSecurity: {
    tag: { en: "Core System", zh: "核心系统" },
    title: { en: "Permission & Security", zh: "权限与安全" },
    subtitle: { en: "Three-layer defense-in-depth — powerful yet safe AI", zh: "三层纵深防御，让 AI 既强大又安全" },
    layers: { en: "Defense layers", zh: "防御层级" },
    moduleFiles: { en: "Permission module files", zh: "权限模块文件" },
    securityLines: { en: "Security LOC", zh: "安全代码行数" },
    whatTitle: { en: "What Is This?", zh: "这是什么？" },
    whatPlain: {
      en: "Claude Code can execute commands, modify files, and access the web. Powerful, but it could perform dangerous operations. The permission system is its **safety lock** — ensuring every action is vetted.\n\nThink of it like **three airport security checkpoints**:\n\n🔬 **X-ray machine (ML classifier)** — auto-scans, quickly passes safe items, blocks obvious threats\n👮 **Security officer (rule engine)** — checks against regulations (your custom rules)\n✋ **Passenger confirmation (user dialog)** — when in doubt, you decide",
      zh: "Claude Code 能执行命令、修改文件、访问网络。这很强大，但也意味着它可能做出危险操作。权限系统就是它的**安全锁** — 确保每一个操作都经过审核。\n\n就像**机场安检的三道关卡**：\n\n🔬 **X 光机（ML 分类器）** — 自动扫描，快速放行安全物品，拦截明显危险品\n👮 **安检员（规则引擎）** — 按规章制度（你的自定义规则）逐条检查\n✋ **旅客确认（用户对话框）** — 不确定的情况下让你自己决定",
    },
    whatTechnical: {
      en: "Three layers: (1) ML classifier (`bashClassifier.ts` / `yoloClassifier.ts`) uses a trained model to assess safety; (2) Rule engine (`shellRuleMatching.ts`) matches user-defined allow/deny rules; (3) User confirmation dialog in the REPL. `utils/permissions/` contains 23 files, `utils/bash/` uses tree-sitter for Shell AST parsing.",
      zh: "权限系统分三层：(1) ML 分类器（`bashClassifier.ts` / `yoloClassifier.ts`）使用训练好的模型判断操作安全性；(2) 规则引擎（`shellRuleMatching.ts`）匹配用户定义的 allow/deny 规则；(3) REPL 中的用户确认对话框。`utils/permissions/` 包含 23 个文件，`utils/bash/` 用 tree-sitter 做 Shell 命令 AST 解析。",
    },
    threeLayersTitle: { en: "Three Layers of Defense", zh: "三层防线" },
    threeLayersSubtitle: { en: "Click a node to see how each layer works", zh: "点击节点查看每层的工作方式" },
    simulatorTitle: { en: "Permission Simulator", zh: "权限模拟器" },
    simulatorSubtitle: { en: "Pick a command, watch the three layers evaluate it", zh: "选一个命令，看三层防线如何判断" },
    bashTitle: { en: "Bash Security Analysis", zh: "Bash 安全分析" },
    bashSubtitle: { en: "How shell commands are parsed and analyzed", zh: "Shell 命令如何被拆解和分析" },
    bashPlain: {
      en: "When Claude wants to run a shell command, the system doesn't just look at the text — it **parses the command into an Abstract Syntax Tree (AST)** like a compiler.\n\nFor example, `cat file.txt | grep secret > output.txt` is identified as: a pipeline that reads a file, filters content, then writes to another file. Each sub-command's risk level is analyzed for command injection and path traversal.",
      zh: "当 Claude 想运行一个 Shell 命令时，系统不只是看命令的文字 — 它会像编译器一样**把命令拆解成语法树（AST）**。\n\n比如 `cat file.txt | grep secret > output.txt`，系统会识别出：这是一个管道命令，读了一个文件，过滤内容，然后写入另一个文件。它会分析每个子命令的风险等级，检测是否有命令注入、路径穿越等安全隐患。",
    },
    bashTechnical: {
      en: "`utils/bash/bashSecurity.ts` uses tree-sitter to parse shell commands into ASTs. Identifies: command chains (`&&`, `||`, `;`), pipes (`|`), redirects (`>`), subshells (`$()`), variable expansion (`$VAR`). Each sub-command is evaluated: read-only? modifies filesystem? network access? Path validator checks file paths are within allowed directories.",
      zh: "`utils/bash/bashSecurity.ts` 使用 tree-sitter 将 Shell 命令解析为 AST。分析器识别：命令链（`&&`, `||`, `;`）、管道（`|`）、重定向（`>`）、子 Shell（`$()`）、变量展开（`$VAR`）等结构。每个子命令都被评估：是否为只读操作、是否修改文件系统、是否有网络访问。路径验证器还会检查文件路径是否在允许的目录范围内。",
    },
    rulesTitle: { en: "Rule System", zh: "规则系统" },
    rulesSubtitle: { en: "How users customize security policies", zh: "用户如何自定义安全策略" },
    codeTitle: { en: "Core Code", zh: "核心代码" },
    codeSubtitle: { en: "Simplified three-layer permission check", zh: "三层权限检查的简化实现" },
    nodeRequest: { en: "Tool Call Request", zh: "工具调用请求" },
    nodeRequestDesc: { en: "Claude wants to perform an action (e.g., run a shell command, modify a file)", zh: "Claude 想执行一个操作（如运行 Shell 命令、修改文件）" },
    nodeML: { en: "ML Classifier", zh: "ML 分类器" },
    nodeMLDesc: { en: "ML model quickly assesses: is this safe? Makes the decision directly when confidence is high. Handles ~80% of cases.", zh: "机器学习模型快速判断：这个操作安全吗？高置信度时直接决策。处理约 80% 的常见情况。" },
    nodeRules: { en: "Rule Engine", zh: "规则引擎" },
    nodeRulesDesc: { en: "Matches user-defined rules: 'always allow git commands', 'deny rm -rf', etc. Supports wildcards and regex.", zh: "匹配用户定义的规则：'总是允许 git 命令'、'禁止 rm -rf' 等。支持通配符和正则。" },
    nodeDialog: { en: "User Confirmation", zh: "用户确认" },
    nodeDialogDesc: { en: "Shows a confirmation dialog in the terminal displaying the pending action, letting the user make the final call.", zh: "在终端中弹出确认对话框，展示即将执行的操作，让用户做最终决定。" },
    nodeDecision: { en: "Execute / Deny", zh: "执行/拒绝" },
    nodeDecisionDesc: { en: "Execute after passing all checks; terminate if any layer denies. Decision recorded to AppState for analytics.", zh: "通过全部检查后执行操作，任一层拒绝则终止。决策记录到 AppState 供分析。" },
    edgeEvaluate: { en: "evaluate", zh: "评估" },
    edgeUncertain: { en: "uncertain", zh: "不确定" },
    edgeNoMatch: { en: "no match", zh: "无匹配" },
    edgeDecide: { en: "decide", zh: "决定" },
    rule1: { en: "Always allow git and npm test commands", zh: "总是允许 git 和 npm test 命令" },
    rule2: { en: "Deny delete and sudo commands", zh: "禁止删除和 sudo 命令" },
    rule3: { en: "CLI flag: allow all Bash commands (dangerous!)", zh: "命令行参数：允许所有 Bash 命令（危险！）" },
    rule4: { en: "Auto mode: ML classifier makes all decisions", zh: "自动模式：ML 分类器做所有决策" },
  },
  permissionSimulator: {
    title: { en: "Permission Simulator — pick a command to see the three-layer evaluation", zh: "权限模拟器 — 选择一个命令，查看三层防线的判断过程" },
    scenario1Desc: { en: "Check git status (read-only)", zh: "查看 git 状态（只读操作）" },
    scenario2Desc: { en: "Delete root directory (extremely dangerous)", zh: "删除根目录（极度危险）" },
    scenario3Desc: { en: "Install npm package (medium risk)", zh: "安装 npm 包（中等风险）" },
    scenario4Desc: { en: "Read a source file (safe)", zh: "读取源文件（安全操作）" },
    mlClassifier: { en: "ML Classifier", zh: "ML 分类器" },
    ruleEngine: { en: "Rule Engine", zh: "规则引擎" },
    userConfirm: { en: "User Confirm", zh: "用户确认" },
    pass: { en: "Skip", zh: "跳过" },
    allow: { en: "Allow", zh: "放行" },
    deny: { en: "Block", zh: "拦截" },
    ask: { en: "Ask User", zh: "转人工" },
    resultAllow: { en: "✓ Allowed", zh: "✓ 允许" },
    resultDeny: { en: "✗ Denied", zh: "✗ 拒绝" },
    resultAsk: { en: "? Needs Confirmation", zh: "? 需确认" },
    s1l1Reason: { en: "Read-only git command, 99% confidence", zh: "只读 git 命令，置信度 99%" },
    s1l2Reason: { en: "Already allowed by ML, skipped", zh: "已被 ML 放行，跳过" },
    s1l3Reason: { en: "Already allowed by ML, skipped", zh: "已被 ML 放行，跳过" },
    s2l1Reason: { en: "Destructive command detected, 99.9% confidence", zh: "检测到破坏性命令，置信度 99.9%" },
    s2l2Reason: { en: "Already blocked by ML, skipped", zh: "已被 ML 拦截，跳过" },
    s2l3Reason: { en: "Already blocked by ML, skipped", zh: "已被 ML 拦截，跳过" },
    s3l1Reason: { en: "72% confidence, not certain enough, passing to rule engine", zh: "置信度 72%，不够确定，交给规则引擎" },
    s3l2Reason: { en: "No matching rule", zh: "无匹配规则" },
    s3l3Reason: { en: "User must confirm whether to allow package installation", zh: "需要用户确认是否允许安装包" },
    s4l1Reason: { en: "Read-only file operation, 98% confidence", zh: "只读文件操作，置信度 98%" },
    s4l2Reason: { en: "Already allowed by ML", zh: "已被 ML 放行" },
    s4l3Reason: { en: "Already allowed by ML", zh: "已被 ML 放行" },
  },
  toolOrchestration: {
    title: { en: "Tool Scheduling Simulator", zh: "工具调度模拟器" },
    running: { en: "Running...", zh: "执行中..." },
    run: { en: "▶ Run", zh: "▶ 运行" },
    phase1: { en: "Phase 1 — Read Operations (Parallel)", zh: "阶段 1 — 读操作（并行）" },
    phase2: { en: "Phase 2 — Write Operations (Serial)", zh: "阶段 2 — 写操作（串行）" },
    result: { en: "Reads completed together (0.4s), writes ran sequentially (1.9s) — total 2.3s instead of 2.8s serial", zh: "读操作同时完成（0.4s），写操作依次执行（1.9s）— 总计 2.3s 而非串行的 2.8s" },
  },
  directoryTree: {
    mainTsx: { en: "Entry point (Commander.js CLI parser)", zh: "入口文件（Commander.js CLI 解析）" },
    queryEngine: { en: "Core session state machine", zh: "核心会话状态机" },
    queryTs: { en: "Main query submission function", zh: "主查询提交函数" },
    toolTs: { en: "Tool type definitions", zh: "工具类型定义" },
    toolsTs: { en: "Tool registry", zh: "工具注册表" },
    commandsTs: { en: "Command registry", zh: "命令注册表" },
    toolsDir: { en: "45+ tool implementations", zh: "45+ 工具实现" },
    bashTool: { en: "Shell command execution", zh: "Shell 命令执行" },
    fileReadTool: { en: "File reading", zh: "文件读取" },
    fileEditTool: { en: "File editing", zh: "文件编辑" },
    agentTool: { en: "Sub-agent spawning", zh: "子 Agent 派生" },
    mcpTool: { en: "MCP tool invocation", zh: "MCP 工具调用" },
    servicesDir: { en: "External service integrations", zh: "外部服务集成" },
    apiDir: { en: "Claude API calls", zh: "Claude API 调用" },
    mcpDir: { en: "MCP protocol client", zh: "MCP 协议客户端" },
    compactDir: { en: "Message compaction strategies", zh: "消息压缩策略" },
    analyticsDir: { en: "Telemetry & feature gating", zh: "遥测与特性门控" },
    toolsServiceDir: { en: "Tool scheduling & execution", zh: "工具调度与执行" },
    componentsDir: { en: "346 React UI components", zh: "346 个 React UI 组件" },
    appTsx: { en: "Root component", zh: "根组件" },
    replTsx: { en: "Main loop UI (5K lines)", zh: "主循环界面（5K 行）" },
    promptInput: { en: "User input component", zh: "用户输入组件" },
    designSystem: { en: "Unified component library", zh: "统一组件库" },
    hooksDir: { en: "104 custom React hooks", zh: "104 个自定义 React hooks" },
    inkDir: { en: "Terminal rendering engine (96 files)", zh: "终端渲染引擎（96 文件）" },
    bridgeDir: { en: "IDE bidirectional communication (WebSocket)", zh: "IDE 双向通信（WebSocket）" },
    utilsDir: { en: "564 utility files", zh: "564 个工具函数" },
    stateDir: { en: "Central state management", zh: "中央状态管理" },
    commandsDir: { en: "~50 slash commands", zh: "~50 个斜杠命令" },
    skillsDir: { en: "Skill system", zh: "技能系统" },
    pluginsDir: { en: "Plugin system", zh: "插件系统" },
  },
  // === Terminal UI page ===
  terminalUI: {
    tag: { en: "Advanced", zh: "进阶" },
    title: { en: "Terminal UI Rendering", zh: "终端 UI 渲染" },
    subtitle: { en: "How React draws interfaces in your terminal, not a browser", zh: "React 如何在终端而非浏览器中绘制界面" },
    components: { en: "React components", zh: "React 组件" },
    inkFiles: { en: "Ink engine files", zh: "Ink 引擎文件" },
    inkLines: { en: "Renderer LOC", zh: "渲染器代码行数" },
    whatTitle: { en: "What Is This?", zh: "这是什么？" },
    whatPlain: {
      en: "You know how websites use React to draw buttons, text, and layouts in a browser? Claude Code does the same thing — but in your terminal. It uses a library called Ink that takes React components and renders them as terminal text with colors, boxes, and interactive elements.\n\nThink of it like this: React is the architect, Ink is the builder, and your terminal is the construction site. The architect draws the same blueprints, but instead of building with HTML and CSS, the builder uses ANSI escape codes (the terminal's 'paint').",
      zh: "你知道网站如何用 React 在浏览器中绘制按钮、文字和布局吗？Claude Code 做的是同样的事情 — 但是在你的终端里。它使用一个叫 Ink 的库，将 React 组件渲染为终端文本，带有颜色、边框和交互元素。\n\n可以这样理解：React 是建筑师，Ink 是施工队，你的终端是工地。建筑师画的是同样的蓝图，但施工队不用 HTML 和 CSS 建造，而是用 ANSI 转义码（终端的'油漆'）。",
    },
    whatTechnical: {
      en: "Claude Code uses React + Ink for terminal rendering. Ink implements a custom React reconciler (`src/ink/reconciler.ts`) that maps React elements to terminal output instead of DOM nodes. Layout is computed via Yoga (Facebook's Flexbox engine). The rendering pipeline: React tree → Ink reconciler → Yoga layout → ANSI string generation → stdout.\n\nKey files: `src/ink/` (96 files, 19K lines) contains the renderer, layout engine, event system, and terminal-specific components. `src/components/` (346 TSX files) contains the actual UI components rendered through this pipeline.",
      zh: "Claude Code 使用 React + Ink 进行终端渲染。Ink 实现了一个自定义 React 协调器（`src/ink/reconciler.ts`），将 React 元素映射到终端输出而非 DOM 节点。布局通过 Yoga（Facebook 的 Flexbox 引擎）计算。渲染管线：React 树 → Ink 协调器 → Yoga 布局 → ANSI 字符串生成 → stdout。\n\n关键文件：`src/ink/`（96 文件，19K 行）包含渲染器、布局引擎、事件系统和终端专用组件。`src/components/`（346 个 TSX 文件）包含通过此管线渲染的实际 UI 组件。",
    },
    pipelineTitle: { en: "Rendering Pipeline", zh: "渲染管线" },
    pipelineSubtitle: { en: "From React components to terminal pixels", zh: "从 React 组件到终端像素" },
    nodeReact: { en: "React Tree", zh: "React 树" },
    nodeReactDesc: { en: "Standard React components written in TSX, using hooks, state, and props — identical to web React development", zh: "标准 React 组件，用 TSX 编写，使用 hooks、state 和 props — 与 Web React 开发完全相同" },
    nodeReconciler: { en: "Ink Reconciler", zh: "Ink 协调器" },
    nodeReconcilerDesc: { en: "Custom React reconciler that translates React operations (create, update, delete) into Ink's internal node tree instead of DOM operations", zh: "自定义 React 协调器，将 React 操作（创建、更新、删除）转换为 Ink 的内部节点树，而非 DOM 操作" },
    nodeYoga: { en: "Yoga Layout", zh: "Yoga 布局" },
    nodeYogaDesc: { en: "Facebook's cross-platform Flexbox engine computes exact positions and sizes for every element, supporting flex, padding, margin, and absolute positioning", zh: "Facebook 的跨平台 Flexbox 引擎计算每个元素的精确位置和尺寸，支持 flex、padding、margin 和绝对定位" },
    nodeAnsi: { en: "ANSI Output", zh: "ANSI 输出" },
    nodeAnsiDesc: { en: "Converts the positioned layout tree into ANSI escape sequences — the terminal's native 'rendering language' for colors, styles, and cursor positioning", zh: "将定位后的布局树转换为 ANSI 转义序列 — 终端原生的颜色、样式和光标定位'渲染语言'" },
    nodeScreen: { en: "Terminal Screen", zh: "终端屏幕" },
    nodeScreenDesc: { en: "Final ANSI string written to stdout, appearing as the formatted, colored UI you see in your terminal", zh: "最终的 ANSI 字符串写入 stdout，呈现为你在终端中看到的格式化彩色界面" },
    comparisonTitle: { en: "Ink vs Browser React", zh: "Ink vs 浏览器 React" },
    comparisonSubtitle: { en: "Same programming model, different output targets", zh: "相同的编程模型，不同的输出目标" },
    highlightsTitle: { en: "Design Highlights", zh: "设计亮点" },
    highlightsSubtitle: { en: "What makes terminal React work", zh: "终端 React 如何运作" },
    highlight1Title: { en: "Full Flexbox in Terminal", zh: "终端中的完整 Flexbox" },
    highlight1Desc: { en: "Yoga provides real CSS Flexbox layout — not approximate text alignment, but proper flex-grow, justify-content, align-items, wrapping, and absolute positioning. Terminal UIs feel like web UIs.", zh: "Yoga 提供真正的 CSS Flexbox 布局 — 不是近似的文本对齐，而是完整的 flex-grow、justify-content、align-items、换行和绝对定位。终端 UI 的感觉就像 Web UI。" },
    highlight2Title: { en: "Keyboard & Mouse Events", zh: "键盘和鼠标事件" },
    highlight2Desc: { en: "Ink's event system captures keyboard shortcuts, mouse clicks (with hit-testing against layout), focus management, and even hyperlink detection. Terminal apps feel interactive, not static.", zh: "Ink 的事件系统捕获键盘快捷键、鼠标点击（对布局进行命中测试）、焦点管理，甚至超链接检测。终端应用感觉是交互式的，而非静态的。" },
    highlight3Title: { en: "Incremental Rendering", zh: "增量渲染" },
    highlight3Desc: { en: "Only changed regions of the terminal are redrawn — React's reconciliation algorithm ensures minimal screen updates, preventing flicker during streaming output.", zh: "只重新绘制终端中变化的区域 — React 的协调算法确保最小化屏幕更新，防止流式输出时的闪烁。" },
  },

  // === Plugin & Skill System page ===
  pluginSkill: {
    tag: { en: "Advanced", zh: "进阶" },
    title: { en: "Plugin & Skill System", zh: "插件与技能系统" },
    subtitle: { en: "How Claude Code becomes infinitely extensible", zh: "Claude Code 如何变得无限可扩展" },
    pluginFiles: { en: "Plugin system files", zh: "插件系统文件" },
    skillFiles: { en: "Skill files", zh: "技能文件" },
    hookTypes: { en: "Lifecycle hook types", zh: "生命周期钩子类型" },
    whatTitle: { en: "What Is This?", zh: "这是什么？" },
    whatPlain: {
      en: "Imagine Claude Code as a smartphone. Out of the box it's useful, but the real power comes from the app store. The plugin system IS that app store — anyone can build extensions that add new commands, tools, skills, and behaviors.\n\nSkills are like 'recipes' that teach Claude how to approach specific tasks (like TDD, code review, or debugging). Plugins are the distribution format — a package that bundles skills, commands, hooks, and configurations together.",
      zh: "想象 Claude Code 是一部智能手机。开箱即用很有用，但真正的力量来自应用商店。插件系统就是那个应用商店 — 任何人都可以构建扩展来添加新命令、工具、技能和行为。\n\n技能就像是'菜谱'，教 Claude 如何处理特定任务（如 TDD、代码审查或调试）。插件是分发格式 — 一个将技能、命令、钩子和配置打包在一起的包。",
    },
    whatTechnical: {
      en: "The plugin system loads extensions from multiple sources: marketplace (git-based versioning), CLI flags (`--plugin-dir`), SDK inline plugins, and bundled built-ins. Each plugin follows a manifest format (`plugin.json`) declaring commands, agents, skills, hooks, MCP servers, and settings schemas.\n\nSkills are Markdown files with frontmatter that define when to activate and what instructions to follow. They're loaded by `src/skills/loadSkillsDir.ts` and matched to user intent via the `SkillTool`.",
      zh: "插件系统从多个来源加载扩展：市场（基于 git 的版本管理）、CLI 参数（`--plugin-dir`）、SDK 内联插件和内置插件。每个插件遵循一个清单格式（`plugin.json`），声明命令、代理、技能、钩子、MCP 服务器和设置模式。\n\n技能是带有 frontmatter 的 Markdown 文件，定义何时激活以及遵循什么指令。它们由 `src/skills/loadSkillsDir.ts` 加载，并通过 `SkillTool` 与用户意图匹配。",
    },
    structureTitle: { en: "Plugin Structure", zh: "插件结构" },
    structureSubtitle: { en: "What's inside a plugin package", zh: "插件包内部结构" },
    loadingTitle: { en: "Loading Pipeline", zh: "加载管线" },
    loadingSubtitle: { en: "How plugins are discovered, validated, and activated", zh: "插件如何被发现、验证和激活" },
    nodeDiscover: { en: "Discovery", zh: "发现" },
    nodeDiscoverDesc: { en: "Scan marketplace, CLI flags, SDK config, and bundled directories for plugins", zh: "扫描市场、CLI 参数、SDK 配置和内置目录以查找插件" },
    nodeValidate: { en: "Validation", zh: "验证" },
    nodeValidateDesc: { en: "Parse plugin.json manifest, verify version compatibility, check policy (allowed/blocked marketplaces)", zh: "解析 plugin.json 清单，验证版本兼容性，检查策略（允许/阻止的市场）" },
    nodeRegister: { en: "Registration", zh: "注册" },
    nodeRegisterDesc: { en: "Register commands, tools, skills, hooks, and MCP servers into the runtime. Merge with built-in definitions", zh: "将命令、工具、技能、钩子和 MCP 服务器注册到运行时。与内置定义合并" },
    nodeActivate: { en: "Activation", zh: "激活" },
    nodeActivateDesc: { en: "Skills matched to user intent via SkillTool. Hooks fire at lifecycle events. Commands available via slash", zh: "通过 SkillTool 将技能与用户意图匹配。钩子在生命周期事件时触发。命令通过斜杠可用" },
    hooksTitle: { en: "Lifecycle Hooks", zh: "生命周期钩子" },
    hooksSubtitle: { en: "Extension points throughout Claude Code's execution", zh: "贯穿 Claude Code 执行的扩展点" },
  },

  // === Message Compaction page ===
  messageCompaction: {
    tag: { en: "Advanced", zh: "进阶" },
    title: { en: "Message Compaction", zh: "消息压缩" },
    subtitle: { en: "4 strategies to keep conversations within context window limits", zh: "4 种策略保持对话在上下文窗口限制内" },
    strategies: { en: "Compaction strategies", zh: "压缩策略" },
    compactFiles: { en: "Compaction files", zh: "压缩模块文件" },
    compactLines: { en: "Implementation LOC", zh: "实现代码行数" },
    whatTitle: { en: "What Is This?", zh: "这是什么？" },
    whatPlain: {
      en: "AI models have a 'memory limit' — they can only process a certain amount of text at once (the context window). As conversations grow with tool calls, file contents, and responses, they can exceed this limit.\n\nMessage compaction is like a smart note-taker sitting in on your conversation. When things get too long, it summarizes older messages while preserving the important context. You never notice it happening, but it's why Claude Code can handle hour-long coding sessions without crashing.",
      zh: "AI 模型有一个'记忆限制' — 它们一次只能处理一定量的文本（上下文窗口）。随着对话中工具调用、文件内容和响应的增长，可能会超过这个限制。\n\n消息压缩就像一个聪明的笔记员坐在你的对话旁。当内容太长时，它会总结较旧的消息，同时保留重要的上下文。你永远不会注意到它在发生，但这就是 Claude Code 能够处理长达数小时的编码会话而不崩溃的原因。",
    },
    whatTechnical: {
      en: "Claude Code implements 4 compaction strategies in `src/services/compact/`: auto-compact (triggered when token budget exceeded), reactive-compact (streaming feedback during generation), snip-compact (history snipping with boundary markers), and micro-compact (inline summaries of tool results). Each operates transparently within the query pipeline.\n\nThe token budget system (`query/tokenBudget.ts`) monitors conversation size and triggers compaction before API calls would fail. Compacted messages retain enough context for Claude to continue working without losing track of the task.",
      zh: "Claude Code 在 `src/services/compact/` 中实现了 4 种压缩策略：自动压缩（当 token 预算超出时触发）、响应式压缩（生成过程中的流式反馈）、剪切压缩（带边界标记的历史剪切）和微压缩（工具结果的内联摘要）。每种策略在查询管线中透明运行。\n\ntoken 预算系统（`query/tokenBudget.ts`）监控对话大小，在 API 调用失败之前触发压缩。压缩后的消息保留足够的上下文，让 Claude 继续工作而不会丢失任务跟踪。",
    },
    strategiesTitle: { en: "4 Compaction Strategies", zh: "4 种压缩策略" },
    strategiesSubtitle: { en: "Different approaches for different situations", zh: "不同情况下的不同策略" },
    autoTitle: { en: "Auto-Compact", zh: "自动压缩" },
    autoDesc: { en: "Triggered when conversation exceeds token budget. Summarizes oldest messages first, preserving recent context. The most common strategy — handles ~90% of cases.", zh: "当对话超过 token 预算时触发。优先总结最旧的消息，保留最近的上下文。最常见的策略 — 处理约 90% 的情况。" },
    reactiveTitle: { en: "Reactive-Compact", zh: "响应式压缩" },
    reactiveDesc: { en: "Monitors token usage during streaming response generation. If the response itself is growing too large, triggers mid-stream compaction to prevent context overflow.", zh: "在流式响应生成过程中监控 token 使用。如果响应本身增长过大，触发流中压缩以防止上下文溢出。" },
    snipTitle: { en: "Snip-Compact", zh: "剪切压缩" },
    snipDesc: { en: "Uses boundary markers in conversation history to identify safe snip points. Removes entire sections (like large file contents) while keeping a summary marker. More surgical than auto-compact.", zh: "在对话历史中使用边界标记来识别安全的剪切点。移除整个段落（如大型文件内容），同时保留摘要标记。比自动压缩更精确。" },
    microTitle: { en: "Micro-Compact", zh: "微压缩" },
    microDesc: { en: "Summarizes individual tool results inline rather than compacting entire message ranges. Useful when a single tool output (like a large file read) dominates the context.", zh: "对单个工具结果进行内联摘要，而非压缩整个消息范围。在单个工具输出（如大型文件读取）占据上下文时特别有用。" },
    waterLevelTitle: { en: "Context Window Management", zh: "上下文窗口管理" },
    waterLevelSubtitle: { en: "How the token budget keeps conversations healthy", zh: "token 预算如何保持对话健康" },
  },

  // === Agent System page ===
  agentSystem: {
    tag: { en: "Advanced", zh: "进阶" },
    title: { en: "Agent System", zh: "Agent 系统" },
    subtitle: { en: "Multi-agent coordination for complex tasks", zh: "复杂任务的多 Agent 协调" },
    agentTools: { en: "Agent-related tools", zh: "Agent 相关工具" },
    agentFiles: { en: "Agent system files", zh: "Agent 系统文件" },
    agentLines: { en: "Implementation LOC", zh: "实现代码行数" },
    whatTitle: { en: "What Is This?", zh: "这是什么？" },
    whatPlain: {
      en: "Sometimes a task is too complex for a single Claude to handle efficiently. The agent system lets Claude spawn 'helper Claudes' — independent sub-agents that work on specific parts of the problem in parallel.\n\nThink of it like a project manager delegating tasks. The main Claude (manager) breaks down the work, sends specific instructions to each sub-agent (team members), and collects their results. Each sub-agent has its own conversation context, tools, and can even spawn further sub-agents.",
      zh: "有时一个任务太复杂，单个 Claude 无法高效处理。Agent 系统让 Claude 可以派生'助手 Claude' — 独立的子 Agent，并行处理问题的特定部分。\n\n可以把它想象成项目经理分派任务。主 Claude（经理）分解工作，向每个子 Agent（团队成员）发送具体指令，并收集它们的结果。每个子 Agent 有自己的对话上下文、工具，甚至可以进一步派生子 Agent。",
    },
    whatTechnical: {
      en: "The agent system is built on `AgentTool` (`src/tools/AgentTool/`, 17 files). Each sub-agent runs as an independent query loop with its own `QueryEngine` instance, message history, and tool set. Communication uses inter-agent messaging via `SendMessageTool`.\n\nTeam coordination is managed by `TeamCreateTool` and `TeamDeleteTool` for swarm-style multi-agent patterns. The coordinator mode (`src/coordinator/`) enables higher-level orchestration with task decomposition. Agents can run in foreground (blocking) or background (async notification on completion).",
      zh: "Agent 系统基于 `AgentTool`（`src/tools/AgentTool/`，17 个文件）构建。每个子 Agent 作为独立的查询循环运行，拥有自己的 `QueryEngine` 实例、消息历史和工具集。通信使用 `SendMessageTool` 进行 Agent 间消息传递。\n\n团队协调由 `TeamCreateTool` 和 `TeamDeleteTool` 管理，支持蜂群式多 Agent 模式。协调器模式（`src/coordinator/`）实现更高层次的编排和任务分解。Agent 可以在前台运行（阻塞）或后台运行（完成时异步通知）。",
    },
    spawningTitle: { en: "Agent Spawning", zh: "Agent 派生" },
    spawningSubtitle: { en: "How sub-agents are created and managed", zh: "子 Agent 如何被创建和管理" },
    nodeMain: { en: "Main Agent", zh: "主 Agent" },
    nodeMainDesc: { en: "The primary Claude instance running your conversation. Decides when a task needs delegation", zh: "运行你对话的主 Claude 实例。决定何时需要委派任务" },
    nodeDecide: { en: "Task Analysis", zh: "任务分析" },
    nodeDecideDesc: { en: "Evaluates whether the task benefits from parallelization or specialized focus. Considers complexity, independence, and context requirements", zh: "评估任务是否可以从并行化或专业聚焦中获益。考虑复杂性、独立性和上下文需求" },
    nodeSpawn: { en: "Spawn Agent", zh: "派生 Agent" },
    nodeSpawnDesc: { en: "Creates a new sub-agent with a specific prompt, selected tools, and model configuration. Can run in foreground or background", zh: "创建一个新的子 Agent，带有特定提示、选定工具和模型配置。可以在前台或后台运行" },
    nodeWork: { en: "Independent Work", zh: "独立工作" },
    nodeWorkDesc: { en: "Sub-agent runs its own query loop: reads files, executes commands, makes edits. Has its own context window and tool permissions", zh: "子 Agent 运行自己的查询循环：读取文件、执行命令、进行编辑。拥有自己的上下文窗口和工具权限" },
    nodeCollect: { en: "Collect Results", zh: "收集结果" },
    nodeCollectDesc: { en: "Main agent receives sub-agent's output. For background agents, notified asynchronously. Results integrated into the main conversation", zh: "主 Agent 接收子 Agent 的输出。后台 Agent 异步通知。结果集成到主对话中" },
    patternsTitle: { en: "Multi-Agent Patterns", zh: "多 Agent 模式" },
    patternsSubtitle: { en: "Different coordination strategies for different tasks", zh: "不同任务的不同协调策略" },
    pattern1Title: { en: "Fan-Out / Fan-In", zh: "扇出/扇入" },
    pattern1Desc: { en: "Main agent spawns N sub-agents for independent subtasks, then collects all results. Perfect for parallel search, multi-file analysis, or running tests across modules.", zh: "主 Agent 为独立子任务派生 N 个子 Agent，然后收集所有结果。适合并行搜索、多文件分析或跨模块运行测试。" },
    pattern2Title: { en: "Pipeline", zh: "管线式" },
    pattern2Desc: { en: "Output of one agent becomes input to the next. Used for multi-stage workflows: research → plan → implement → review.", zh: "一个 Agent 的输出成为下一个的输入。用于多阶段工作流：研究 → 计划 → 实现 → 审查。" },
    pattern3Title: { en: "Swarm Teams", zh: "蜂群团队" },
    pattern3Desc: { en: "TeamCreate builds a persistent group of agents with a lead agent. Members communicate via SendMessage. For ongoing collaborative work.", zh: "TeamCreate 构建一个持久的 Agent 组，有一个领导 Agent。成员通过 SendMessage 通信。适用于持续的协作工作。" },
  },

  // === IDE Bridge page ===
  ideBridge: {
    tag: { en: "Optional", zh: "可选" },
    title: { en: "IDE Bridge", zh: "IDE 桥接" },
    subtitle: { en: "Real-time bidirectional communication between Claude Code and VS Code", zh: "Claude Code 与 VS Code 之间的实时双向通信" },
    bridgeFiles: { en: "Bridge files", zh: "桥接文件" },
    bridgeLines: { en: "Bridge LOC", zh: "桥接代码行数" },
    transports: { en: "Transport types", zh: "传输类型" },
    whatTitle: { en: "What Is This?", zh: "这是什么？" },
    whatPlain: {
      en: "When you use Claude Code inside VS Code (not just the terminal), there's an invisible bridge connecting the two. It's like a walkie-talkie system — VS Code and Claude Code talk to each other in real-time, sharing what you're looking at, what permissions are needed, and what changes are being made.\n\nThis bridge is why Claude Code can show its responses in VS Code's sidebar, request permissions through VS Code's UI, and sync file changes instantly — rather than being a completely separate terminal tool.",
      zh: "当你在 VS Code 中使用 Claude Code（不仅仅是终端），有一个隐形的桥梁连接着两者。就像一个对讲机系统 — VS Code 和 Claude Code 实时对话，分享你正在查看的内容、需要哪些权限以及正在进行哪些更改。\n\n这个桥梁就是为什么 Claude Code 能在 VS Code 的侧边栏中显示响应、通过 VS Code 的 UI 请求权限、并即时同步文件更改 — 而不是一个完全独立的终端工具。",
    },
    whatTechnical: {
      en: "The bridge system (`src/bridge/`, 31 files, 12K lines) implements a WebSocket-based bidirectional communication protocol between the Claude Code CLI process and the VS Code extension. Key components:\n\n`bridgeMain.ts` — Core bridge server managing connection lifecycle\n`replBridge.ts` — REPL-side integration hooking into the query pipeline\n`replBridgeTransport.ts` — WebSocket transport layer with reconnection\n`bridgeApi.ts` — API client for the VS Code extension\n`bridgeMessaging.ts` — Message protocol definitions and serialization",
      zh: "桥接系统（`src/bridge/`，31 个文件，12K 行）实现了 Claude Code CLI 进程和 VS Code 扩展之间基于 WebSocket 的双向通信协议。关键组件：\n\n`bridgeMain.ts` — 核心桥接服务器，管理连接生命周期\n`replBridge.ts` — REPL 端集成，挂钩到查询管线\n`replBridgeTransport.ts` — WebSocket 传输层，带重连\n`bridgeApi.ts` — VS Code 扩展的 API 客户端\n`bridgeMessaging.ts` — 消息协议定义和序列化",
    },
    architectureTitle: { en: "Bridge Architecture", zh: "桥接架构" },
    architectureSubtitle: { en: "How VS Code and Claude Code stay in sync", zh: "VS Code 和 Claude Code 如何保持同步" },
    nodeExtension: { en: "VS Code Extension", zh: "VS Code 扩展" },
    nodeExtensionDesc: { en: "The VS Code side: renders Claude's responses in the sidebar, captures editor context, and provides permission UI", zh: "VS Code 端：在侧边栏渲染 Claude 的响应、捕获编辑器上下文、提供权限 UI" },
    nodeWebSocket: { en: "WebSocket Transport", zh: "WebSocket 传输" },
    nodeWebSocketDesc: { en: "Persistent bidirectional connection with automatic reconnection, message batching, and exponential backoff on failure", zh: "持久的双向连接，带自动重连、消息批处理和指数退避失败恢复" },
    nodeBridge: { en: "Bridge Server", zh: "桥接服务器" },
    nodeBridgeDesc: { en: "Core bridge in the CLI process: manages sessions, routes messages, handles permission callbacks from IDE", zh: "CLI 进程中的核心桥接：管理会话、路由消息、处理来自 IDE 的权限回调" },
    nodeRepl: { en: "REPL / Query Engine", zh: "REPL / 查询引擎" },
    nodeReplDesc: { en: "The conversation engine: receives prompts from bridge, executes tools, streams responses back through the bridge", zh: "对话引擎：从桥接接收提示、执行工具、通过桥接流式返回响应" },
    featuresTitle: { en: "Key Features", zh: "核心功能" },
    featuresSubtitle: { en: "What the bridge enables", zh: "桥接实现了什么" },
    feature1Title: { en: "Session Multiplexing", zh: "会话复用" },
    feature1Desc: { en: "Multiple VS Code windows can share a single Claude Code process. The bridge tracks session lifecycle, routing messages to the correct conversation.", zh: "多个 VS Code 窗口可以共享单个 Claude Code 进程。桥接跟踪会话生命周期，将消息路由到正确的对话。" },
    feature2Title: { en: "Permission Delegation", zh: "权限委托" },
    feature2Desc: { en: "When Claude needs permission to run a command, the bridge forwards the request to VS Code's native dialog — no terminal popup needed.", zh: "当 Claude 需要权限运行命令时，桥接将请求转发到 VS Code 的原生对话框 — 无需终端弹窗。" },
    feature3Title: { en: "Trusted Device Tokens", zh: "可信设备令牌" },
    feature3Desc: { en: "Secure authentication between the CLI and VS Code extension using device tokens, preventing unauthorized processes from connecting.", zh: "CLI 和 VS Code 扩展之间使用设备令牌进行安全认证，防止未授权进程连接。" },
    feature4Title: { en: "Failure Recovery", zh: "故障恢复" },
    feature4Desc: { en: "Exponential backoff reconnection, message queuing during disconnection, and graceful session resumption after network interruptions.", zh: "指数退避重连、断开期间的消息队列、网络中断后的优雅会话恢复。" },
  },

  // === MCP Integration page ===
  mcpIntegration: {
    tag: { en: "Optional", zh: "可选" },
    title: { en: "MCP Integration", zh: "MCP 集成" },
    subtitle: { en: "Model Context Protocol — connecting Claude to external tools and data", zh: "模型上下文协议 — 将 Claude 连接到外部工具和数据" },
    mcpFiles: { en: "MCP client files", zh: "MCP 客户端文件" },
    mcpLines: { en: "MCP LOC", zh: "MCP 代码行数" },
    mcpTransports: { en: "Transport types", zh: "传输类型" },
    whatTitle: { en: "What Is This?", zh: "这是什么？" },
    whatPlain: {
      en: "MCP (Model Context Protocol) is like a universal adapter for AI tools. Just as USB-C lets you connect any device to your computer, MCP lets Claude connect to any external service — databases, APIs, cloud platforms, or custom tools.\n\nInstead of building every integration into Claude Code directly, MCP provides a standard way for external servers to expose tools, data, and prompts. You install an MCP server (like a database connector), and Claude automatically discovers and can use its tools.",
      zh: "MCP（模型上下文协议）就像 AI 工具的万能适配器。就像 USB-C 让你把任何设备连接到电脑一样，MCP 让 Claude 连接到任何外部服务 — 数据库、API、云平台或自定义工具。\n\nMCP 不是把每个集成都直接内置到 Claude Code 中，而是提供了一种标准方式让外部服务器暴露工具、数据和提示。你安装一个 MCP 服务器（比如数据库连接器），Claude 就会自动发现并使用它的工具。",
    },
    whatTechnical: {
      en: "Claude Code implements a full MCP client in `src/services/mcp/` (25 files, ~10K lines). It supports three transport types: stdio (local process), SSE (Server-Sent Events over HTTP), and streamable HTTP. The client handles tool discovery, resource listing, prompt templates, OAuth authentication, and elicitation (async user prompts).\n\nKey files: `client.ts` (3.3K lines) — core MCP client with connection management; `auth.ts` (2.4K lines) — OAuth handling; `types.ts` — MCP type definitions; `channelPermissions.ts` — permission handling for MCP tools.",
      zh: "Claude Code 在 `src/services/mcp/`（25 个文件，约 10K 行）中实现了完整的 MCP 客户端。支持三种传输类型：stdio（本地进程）、SSE（HTTP 上的服务器推送事件）和流式 HTTP。客户端处理工具发现、资源列表、提示模板、OAuth 认证和引出协议（异步用户提示）。\n\n关键文件：`client.ts`（3.3K 行）— 核心 MCP 客户端，连接管理；`auth.ts`（2.4K 行）— OAuth 处理；`types.ts` — MCP 类型定义；`channelPermissions.ts` — MCP 工具的权限处理。",
    },
    architectureTitle: { en: "MCP Architecture", zh: "MCP 架构" },
    architectureSubtitle: { en: "How Claude Code connects to external services", zh: "Claude Code 如何连接外部服务" },
    nodeConfig: { en: "MCP Config", zh: "MCP 配置" },
    nodeConfigDesc: { en: "Server definitions in settings: server name, transport type (stdio/SSE/HTTP), command or URL, environment variables", zh: "设置中的服务器定义：服务器名称、传输类型（stdio/SSE/HTTP）、命令或 URL、环境变量" },
    nodeConnect: { en: "Connection", zh: "连接" },
    nodeConnectDesc: { en: "Establish transport: spawn local process (stdio), connect to HTTP endpoint (SSE), or open streaming HTTP connection", zh: "建立传输：启动本地进程（stdio）、连接 HTTP 端点（SSE）或打开流式 HTTP 连接" },
    nodeDiscover: { en: "Discovery", zh: "发现" },
    nodeDiscoverDesc: { en: "Query server capabilities: list available tools, resources, and prompt templates. Auto-register discovered tools", zh: "查询服务器能力：列出可用工具、资源和提示模板。自动注册发现的工具" },
    nodeInvoke: { en: "Invocation", zh: "调用" },
    nodeInvokeDesc: { en: "Claude calls MCP tools via MCPTool wrapper. Permissions checked like any other tool. Results flow back into conversation", zh: "Claude 通过 MCPTool 包装器调用 MCP 工具。权限检查与其他工具相同。结果流回对话中" },
    transportTitle: { en: "Transport Types", zh: "传输类型" },
    transportSubtitle: { en: "Three ways to connect to MCP servers", zh: "连接 MCP 服务器的三种方式" },
    stdioTitle: { en: "stdio", zh: "stdio" },
    stdioDesc: { en: "Spawns a local process and communicates via stdin/stdout. Best for local tools (file system, database). Zero network overhead.", zh: "启动本地进程并通过 stdin/stdout 通信。最适合本地工具（文件系统、数据库）。零网络开销。" },
    sseTitle: { en: "SSE (Server-Sent Events)", zh: "SSE（服务器推送事件）" },
    sseDesc: { en: "HTTP-based streaming connection. Client sends requests via POST, receives streamed responses via SSE. Good for remote services.", zh: "基于 HTTP 的流式连接。客户端通过 POST 发送请求，通过 SSE 接收流式响应。适合远程服务。" },
    httpTitle: { en: "Streamable HTTP", zh: "流式 HTTP" },
    httpDesc: { en: "Newer protocol using standard HTTP with streaming support. Most flexible transport for cloud-hosted MCP servers.", zh: "使用标准 HTTP 并支持流式传输的新协议。最灵活的传输方式，适合云托管的 MCP 服务器。" },
    toolsTitle: { en: "MCP Tools in Claude Code", zh: "Claude Code 中的 MCP 工具" },
    toolsSubtitle: { en: "How MCP tools are exposed and used", zh: "MCP 工具如何暴露和使用" },
    mcpToolDesc: { en: "Execute tools from connected MCP servers — the primary interface for Claude to call external functionality", zh: "执行连接的 MCP 服务器的工具 — Claude 调用外部功能的主要接口" },
    listResourcesDesc: { en: "Discover what resources (files, data, configs) an MCP server makes available", zh: "发现 MCP 服务器提供的资源（文件、数据、配置）" },
    readResourceDesc: { en: "Read content from a specific MCP resource by URI", zh: "通过 URI 读取特定 MCP 资源的内容" },
    mcpAuthDesc: { en: "Handle OAuth authentication flows for MCP servers that require authorization", zh: "处理需要授权的 MCP 服务器的 OAuth 认证流程" },
    toolsFooter: { en: "These tools are automatically registered when MCP servers connect. Claude uses them like any built-in tool — with the same permission checks and orchestration.", zh: "这些工具在 MCP 服务器连接时自动注册。Claude 像使用任何内置工具一样使用它们 — 具有相同的权限检查和调度机制。" },
  },
  codeTracer: {
    title: { en: "Interactive Code Walkthrough", zh: "交互式代码走读" },
    subtitle: { en: "Click through the query pipeline execution, step by step", zh: "逐步点击查询管线的执行过程" },
    prev: { en: "← Previous", zh: "← 上一步" },
    next: { en: "Next →", zh: "下一步 →" },
    stepOf: { en: "Step {n} of {total}", zh: "第 {n} 步 / 共 {total} 步" },
    clickHint: { en: "Click highlighted function names to follow the call chain", zh: "点击高亮的函数名跟踪调用链" },
    step1Title: { en: "Entry: submitMessage()", zh: "入口：submitMessage()" },
    step1Annotation: {
      en: "Everything starts here. submitMessage() is an async generator that orchestrates the entire conversation turn — from receiving the user's prompt to streaming back Claude's response.",
      zh: "一切从这里开始。submitMessage() 是一个 async generator，编排整个对话轮次 — 从接收用户提示到流式返回 Claude 的响应。"
    },
    step2Title: { en: "Context Assembly", zh: "上下文组装" },
    step2Annotation: {
      en: "Before calling the API, the system assembles a comprehensive context: the default system prompt, user environment info (OS, git status, cwd), all 45+ tool definitions, project rules from CLAUDE.md, and memory attachments from previous conversations.",
      zh: "在调用 API 之前，系统组装完整的上下文：默认系统提示、用户环境信息（操作系统、git 状态、工作目录）、全部 45+ 工具定义、CLAUDE.md 中的项目规则，以及之前对话的记忆附件。"
    },
    step3Title: { en: "API Streaming Call", zh: "API 流式调用" },
    step3Annotation: {
      en: "The assembled context is sent to the Anthropic API via streaming. Responses arrive token by token as an async iterable. Each chunk is yielded immediately — the terminal UI updates in real-time, never buffering the full response.",
      zh: "组装好的上下文通过流式发送到 Anthropic API。响应以 async iterable 的形式逐 token 到达。每个块立即 yield — 终端 UI 实时更新，从不缓冲完整响应。"
    },
    step4Title: { en: "Tool Orchestration", zh: "工具调度" },
    step4Annotation: {
      en: "When Claude's response contains tool_use blocks, the orchestrator partitions them: read-only tools (Glob, Grep, Read) execute in parallel via Promise.all, while write tools (Edit, Write, Bash) execute serially to prevent race conditions.",
      zh: "当 Claude 的响应包含 tool_use 块时，调度器对它们进行分区：只读工具（Glob、Grep、Read）通过 Promise.all 并行执行，写工具（Edit、Write、Bash）串行执行以防止竞态条件。"
    },
    step5Title: { en: "Permission Check", zh: "权限检查" },
    step5Annotation: {
      en: "Before any tool executes, canUseTool() runs the three-layer defense: ML classifier for fast probabilistic assessment (handles ~80% of cases), rule engine for user-defined allow/deny patterns, and finally user confirmation dialog if still uncertain.",
      zh: "在任何工具执行之前，canUseTool() 运行三层防线：ML 分类器进行快速概率评估（处理约 80% 的情况），规则引擎匹配用户定义的允许/拒绝模式，最后如果仍不确定则弹出用户确认对话框。"
    },
    step6Title: { en: "Recursive Loop", zh: "递归循环" },
    step6Annotation: {
      en: "After tool execution, results are appended to the conversation history and submitMessage() calls itself recursively. This loop continues — Claude sees the tool results, may request more tools, until it returns stop_reason: 'end_turn' and the conversation turn is complete.",
      zh: "工具执行后，结果被追加到对话历史中，submitMessage() 递归调用自身。这个循环持续进行 — Claude 看到工具结果，可能请求更多工具，直到返回 stop_reason: 'end_turn'，对话轮次完成。"
    },
    // Tool System chain
    tsStep1Title: { en: "Tool Registration", zh: "工具注册" },
    tsStep1Annotation: { en: "All tools are registered in a single array. Feature flags like feature('X') are evaluated at bundle time — disabled tools are stripped from production. Runtime checks (process.env) gate internal-only tools.", zh: "所有工具在单个数组中注册。feature('X') 等特性开关在打包时求值 — 禁用的工具从生产包中剥离。运行时检查（process.env）控制仅限内部的工具。" },
    tsStep2Title: { en: "Batch Partitioning", zh: "批处理分区" },
    tsStep2Annotation: { en: "Tool calls from a single API response are partitioned into batches. Consecutive concurrency-safe calls are grouped together. A non-safe call starts a new batch. This greedy algorithm maximizes parallelism while preserving order.", zh: "单个 API 响应中的工具调用被分区为批次。连续的并发安全调用被分组在一起。非安全调用开始新批次。这种贪心算法在保持顺序的同时最大化并行性。" },
    tsStep3Title: { en: "Safety Check", zh: "安全检查" },
    tsStep3Annotation: { en: "Each tool declares isConcurrencySafe() and isReadOnly(). Read-only tools like Glob, Grep, Read are concurrency-safe. Write tools like Edit, Write, Bash are not. The check is wrapped in try/catch — if it throws, the tool is treated as unsafe.", zh: "每个工具声明 isConcurrencySafe() 和 isReadOnly()。只读工具如 Glob、Grep、Read 是并发安全的。写工具如 Edit、Write、Bash 不是。检查包装在 try/catch 中 — 如果抛出异常，工具被视为不安全。" },
    tsStep4Title: { en: "Concurrent / Serial Execution", zh: "并发/串行执行" },
    tsStep4Annotation: { en: "Safe batches run via Promise.all — all tools in the batch execute simultaneously. Non-safe batches run in a for loop — one tool at a time, each awaited before the next starts. Results are yielded as an async generator.", zh: "安全批次通过 Promise.all 运行 — 批次中的所有工具同时执行。非安全批次在 for 循环中运行 — 一次一个工具，每个等待完成后才开始下一个。结果作为 async generator yield。" },
    tsStep5Title: { en: "Result Collection", zh: "结果收集" },
    tsStep5Annotation: { en: "Each tool returns a ToolResult which is yielded back to the query pipeline. The result includes the tool output, any error information, and context modifications. The query loop appends these as tool_result messages for Claude's next turn.", zh: "每个工具返回 ToolResult，被 yield 回查询管线。结果包括工具输出、错误信息和上下文修改。查询循环将它们作为 tool_result 消息追加，供 Claude 下一轮使用。" },
    // Permission Security chain
    psStep1Title: { en: "Permission Entry", zh: "权限入口" },
    psStep1Annotation: { en: "Every tool call passes through hasPermissionsToUseTool(). It wraps the inner check with denial tracking — if a tool is allowed, consecutive denial counters reset. If denied in 'dontAsk' mode, 'ask' decisions are converted to 'deny' silently.", zh: "每个工具调用都经过 hasPermissionsToUseTool()。它用拒绝跟踪包装内部检查 — 如果工具被允许，连续拒绝计数器重置。在 'dontAsk' 模式下被拒绝时，'ask' 决策被静默转换为 'deny'。" },
    psStep2Title: { en: "Mode Routing", zh: "模式路由" },
    psStep2Annotation: { en: "The permission mode determines the path: 'bypassPermissions' allows everything immediately. 'plan' restricts to read-only. 'auto' routes to the ML classifier. 'default' checks rules first, then asks the user. Each mode has distinct security guarantees.", zh: "权限模式决定路径：'bypassPermissions' 立即允许一切。'plan' 限制为只读。'auto' 路由到 ML 分类器。'default' 先检查规则，然后询问用户。每种模式有不同的安全保障。" },
    psStep3Title: { en: "ML Classifier", zh: "ML 分类器" },
    psStep3Annotation: { en: "The classifier analyzes commands using trained patterns. It returns a confidence level (high/medium/low) and a decision. High-confidence decisions are acted on immediately. In the open-source build, this is stubbed out — the feature is internal to Anthropic.", zh: "分类器使用训练模式分析命令。返回置信度（高/中/低）和决策。高置信度决策立即执行。在开源构建中，这是一个存根 — 该功能是 Anthropic 内部的。" },
    psStep4Title: { en: "Rule Matching", zh: "规则匹配" },
    psStep4Annotation: { en: "User-defined allow/deny rules are checked using wildcard pattern matching. 'git *' matches 'git', 'git status', 'git commit -m fix'. Escaped wildcards (\\*) match literal asterisks. Rules come from settings, project config, and CLI flags.", zh: "用户定义的允许/拒绝规则通过通配符模式匹配检查。'git *' 匹配 'git'、'git status'、'git commit -m fix'。转义的通配符（\\*）匹配字面星号。规则来自设置、项目配置和 CLI 参数。" },
    psStep5Title: { en: "User Dialog", zh: "用户对话框" },
    psStep5Annotation: { en: "If no rule matches and the classifier is uncertain, the REPL shows a confirmation dialog. The user sees the exact command and can allow once, always allow this pattern, or deny. Their choice can be saved as a new rule for future sessions.", zh: "如果没有规则匹配且分类器不确定，REPL 显示确认对话框。用户看到确切的命令，可以允许一次、总是允许此模式或拒绝。他们的选择可以保存为新规则供未来会话使用。" },
  },
  apiData: {
    title: { en: "What the API Actually Sees", zh: "API 实际看到的数据" },
    subtitle: { en: "Real request and response structures from Claude Code", zh: "Claude Code 的真实请求和响应结构" },
    tabRequest: { en: "API Request", zh: "API 请求" },
    tabResponse: { en: "Stream Response", zh: "流式响应" },
    tabToolCall: { en: "Tool Call", zh: "工具调用" },
    tabToolResult: { en: "Tool Result", zh: "工具结果" },
    requestDesc: {
      en: "This is what Claude Code sends to the Anthropic API. The system prompt, conversation history, and all 45+ tool definitions are packed into a single streaming request.",
      zh: "这是 Claude Code 发送给 Anthropic API 的内容。系统提示、对话历史和所有 45+ 工具定义被打包到一个流式请求中。"
    },
    responseDesc: {
      en: "The response streams back as a series of Server-Sent Events. Each event carries a small piece: a text token, the start of a tool call, or a JSON input fragment.",
      zh: "响应以一系列服务器推送事件流式返回。每个事件携带一小块：一个文本 token、工具调用的开始或 JSON 输入片段。"
    },
    toolCallDesc: {
      en: "When Claude decides to use a tool, it emits a tool_use content block. The tool name and input are streamed incrementally — the input JSON arrives character by character via input_json_delta events.",
      zh: "当 Claude 决定使用工具时，它发出 tool_use 内容块。工具名称和输入增量流式传输 — 输入 JSON 通过 input_json_delta 事件逐字符到达。"
    },
    toolResultDesc: {
      en: "After the tool executes, its result is sent back as a user message with type 'tool_result'. The tool_use_id links it to the original call. Claude sees this result and decides what to do next.",
      zh: "工具执行后，结果作为 user 消息发回，类型为 'tool_result'。tool_use_id 将其与原始调用关联。Claude 看到此结果后决定下一步操作。"
    },
  },
  glossary: {
    title: { en: "Glossary", zh: "术语表" },
    subtitle: { en: "Key technical terms explained for all readers", zh: "为所有读者解释的关键技术术语" },
  },
  deepDive: {
    title: { en: "Deep Dive", zh: "深度剖析" },
    subtitle: { en: "Real source code and design decisions", zh: "真实源码与设计决策" },
    showMore: { en: "Show Deep Dive ▼", zh: "展开深度剖析 ▼" },
    hideMore: { en: "Hide Deep Dive ▲", zh: "收起深度剖析 ▲" },
    realCode: { en: "Real Source Code", zh: "真实源码" },
    typeDefinitions: { en: "Type Definitions", zh: "类型定义" },
    designDecisions: { en: "Design Decisions", zh: "设计决策" },
    // Query Pipeline deep dive
    qpToolInterface: { en: "The Tool Interface (src/Tool.ts)", zh: "Tool 接口定义 (src/Tool.ts)" },
    qpToolInterfaceDesc: {
      en: "Every tool in Claude Code implements this interface. Key methods: `call()` executes the tool, `isReadOnly()` determines scheduling, `isConcurrencySafe()` enables parallel execution, `inputSchema` (Zod) validates inputs at runtime.",
      zh: "Claude Code 中的每个工具都实现此接口。关键方法：`call()` 执行工具，`isReadOnly()` 决定调度方式，`isConcurrencySafe()` 启用并行执行，`inputSchema`（Zod）在运行时验证输入。"
    },
    qpSubmitMessage: { en: "submitMessage() Entry Point (src/QueryEngine.ts)", zh: "submitMessage() 入口 (src/QueryEngine.ts)" },
    qpSubmitMessageDesc: {
      en: "The actual function signature reveals the complexity hidden behind the simple concept: 25+ configuration options, from model selection and token budgets to permission callbacks and agent coordination. This is the nerve center of Claude Code.",
      zh: "实际函数签名揭示了简单概念背后隐藏的复杂性：25+ 个配置选项，从模型选择和 token 预算到权限回调和 Agent 协调。这是 Claude Code 的神经中枢。"
    },
    qpSystemPrompt: { en: "System Prompt Assembly (src/utils/systemPrompt.ts)", zh: "系统提示构建 (src/utils/systemPrompt.ts)" },
    qpSystemPromptDesc: {
      en: "The prompt assembly has a priority hierarchy: override prompt > coordinator mode > agent definition > default + custom + append. This layering enables Claude Code to adapt its behavior for different contexts (IDE, CLI, agent, coordinator) without duplicating prompt logic.",
      zh: "提示构建有优先级层次：覆盖提示 > 协调器模式 > Agent 定义 > 默认 + 自定义 + 追加。这种分层使 Claude Code 能够为不同上下文（IDE、CLI、Agent、协调器）调整行为，而无需重复提示逻辑。"
    },
    qpWhyAsyncGen: { en: "Why Async Generators?", zh: "为什么选择 Async Generator？" },
    qpWhyAsyncGenDesc: {
      en: "Claude Code chose async generators over callbacks, Observables, or event emitters for the streaming pipeline. The key tradeoffs:\n\n• **vs Callbacks**: Generators compose naturally with `yield*` — a tool that calls sub-tools just yields their results. Callbacks require manual propagation.\n• **vs Observables (RxJS)**: Generators are native to JavaScript — no library needed. They also support natural backpressure: the consumer controls the pace by pulling values.\n• **vs Event Emitters**: Generators maintain execution context between yields. The same function can do setup, yield streaming results, then do cleanup — impossible with fire-and-forget events.\n\nThe `yield*` delegation pattern is particularly elegant: `submitMessage()` yields tool results from `runTools()` which yields from individual tool executions, creating a transparent streaming pipeline without manual message forwarding.",
      zh: "Claude Code 在流式管线中选择了 async generator 而非回调、Observable 或事件发射器。关键权衡：\n\n• **对比回调**：Generator 通过 `yield*` 自然组合 — 调用子工具的工具直接 yield 它们的结果。回调需要手动传播。\n• **对比 Observable (RxJS)**：Generator 是 JavaScript 原生特性 — 不需要库。它们还支持自然的背压：消费者通过拉取值来控制节奏。\n• **对比事件发射器**：Generator 在 yield 之间保持执行上下文。同一个函数可以做初始化、yield 流式结果、然后做清理 — 这对于即发即弃的事件来说是不可能的。\n\n`yield*` 委托模式特别优雅：`submitMessage()` 从 `runTools()` yield 工具结果，`runTools()` 又从各个工具执行中 yield，创建了一个透明的流式管线，无需手动消息转发。"
    },
    // Tool System deep dive
    tsRegistration: { en: "Tool Registration (src/tools.ts)", zh: "工具注册 (src/tools.ts)" },
    tsRegistrationDesc: {
      en: "Tools are registered in a single array with feature gates. `feature('X')` checks are evaluated at bundle time — disabled tools are completely removed from the production bundle by Bun's dead-code elimination. `process.env.USER_TYPE` gates are runtime checks for internal-only tools.",
      zh: "工具在单个数组中注册并带有特性开关。`feature('X')` 检查在打包时求值 — 禁用的工具会被 Bun 的死代码消除完全从生产包中移除。`process.env.USER_TYPE` 开关是仅限内部工具的运行时检查。"
    },
    tsPartitioning: { en: "Batch Partitioning (src/services/tools/toolOrchestration.ts)", zh: "批处理分区 (src/services/tools/toolOrchestration.ts)" },
    tsPartitioningDesc: {
      en: "The partitioning algorithm uses a greedy approach: it accumulates consecutive concurrency-safe tool calls into a single batch. When a non-safe call is encountered, it starts a new batch. This means `[Read, Read, Write, Read, Read]` becomes `[[Read, Read], [Write], [Read, Read]]` — 3 batches, 2 concurrent + 1 serial. The `isConcurrencySafe` check is defensive: if it throws, the tool is treated as non-concurrent.",
      zh: "分区算法使用贪心策略：将连续的并发安全工具调用累积到单个批次中。遇到非安全调用时，开始新批次。这意味着 `[Read, Read, Write, Read, Read]` 变成 `[[Read, Read], [Write], [Read, Read]]` — 3 个批次，2 个并发 + 1 个串行。`isConcurrencySafe` 检查是防御性的：如果抛出异常，工具被视为非并发安全。"
    },
    tsWhyNotQueue: { en: "Why Not a Task Queue?", zh: "为什么不用任务队列？" },
    tsWhyNotQueueDesc: {
      en: "Many systems use a centralized task queue (like Bull or a thread pool) for concurrent work. Claude Code instead uses a simpler batch partition model. The reason: tool calls within a single API response are a bounded, small set (typically 1-5). A task queue adds complexity (priorities, retries, dead letters) that isn't needed. The batch model is:\n\n• **Predictable**: execution order matches API response order\n• **Debuggable**: no hidden queue state to inspect\n• **Low overhead**: just `Promise.all` vs. queue management\n\nThe tradeoff is that there's no cross-turn parallelism — each API response's tools must complete before the next turn starts. This is intentional: Claude needs to see ALL tool results before deciding the next action.",
      zh: "许多系统使用集中式任务队列（如 Bull 或线程池）处理并发工作。Claude Code 使用更简单的批分区模型。原因：单个 API 响应中的工具调用是有界的小集合（通常 1-5 个）。任务队列增加了不必要的复杂性（优先级、重试、死信）。批模型的优势：\n\n• **可预测**：执行顺序与 API 响应顺序一致\n• **可调试**：没有隐藏的队列状态需要检查\n• **低开销**：只需 `Promise.all` 对比队列管理\n\n代价是没有跨轮次并行 — 每个 API 响应的工具必须全部完成才能开始下一轮。这是故意的：Claude 需要看到所有工具结果后才能决定下一步操作。"
    },
    // Permission deep dive
    psPermissionMode: { en: "Permission Modes (src/types/permissions.ts)", zh: "权限模式 (src/types/permissions.ts)" },
    psPermissionModeDesc: {
      en: "Five external modes + two internal-only modes. `default` shows confirmation dialogs. `acceptEdits` auto-allows file edits but asks for shell commands. `bypassPermissions` allows everything (dangerous). `plan` restricts to read-only. `dontAsk` silently denies anything that would prompt. `auto` (internal) uses the ML classifier. `bubble` (internal) delegates to parent agent.",
      zh: "五种外部模式 + 两种仅限内部的模式。`default` 显示确认对话框。`acceptEdits` 自动允许文件编辑但询问 Shell 命令。`bypassPermissions` 允许所有操作（危险）。`plan` 限制为只读。`dontAsk` 静默拒绝任何需要提示的操作。`auto`（内部）使用 ML 分类器。`bubble`（内部）委托给父 Agent。"
    },
    psRuleMatching: { en: "Rule Matching Engine (src/utils/permissions/shellRuleMatching.ts)", zh: "规则匹配引擎 (src/utils/permissions/shellRuleMatching.ts)" },
    psRuleMatchingDesc: {
      en: "The rule matcher converts user-defined patterns (like `git *` or `npm test`) into regex. Key features: `*` becomes `.*` for wildcard matching. `\\*` becomes a literal asterisk. Trailing ` *` is made optional — so `git *` matches both `git` and `git commit -m 'fix'`. Case-insensitive matching is supported. This seemingly simple system handles the vast majority of real-world permission rules.",
      zh: "规则匹配器将用户定义的模式（如 `git *` 或 `npm test`）转换为正则表达式。关键特性：`*` 变成 `.*` 用于通配符匹配。`\\*` 变成字面星号。尾部的 ` *` 变为可选 — 所以 `git *` 同时匹配 `git` 和 `git commit -m 'fix'`。支持大小写不敏感匹配。这个看似简单的系统处理了绝大多数真实的权限规则。"
    },
    psWhyThreeLayers: { en: "Why Three Layers, Not One?", zh: "为什么是三层而不是一层？" },
    psWhyThreeLayersDesc: {
      en: "A single permission system would be either too strict (always ask → slow) or too loose (always allow → unsafe). The three-layer design optimizes for the common case:\n\n• **Layer 1 (ML Classifier)**: Handles ~80% of decisions instantly. `git status`? Allow. `rm -rf /`? Deny. No user interaction needed.\n• **Layer 2 (Rules)**: Handles user-specific policies. A data scientist might allow all `python` commands; a DevOps engineer might allow `kubectl` but deny `terraform destroy`.\n• **Layer 3 (User Dialog)**: The safety net for everything else. Only triggered for genuinely ambiguous cases.\n\nThe key insight: each layer reduces the load on the next. Without the classifier, every single tool call would hit the rule engine. Without rules, every non-obvious call would interrupt the user. The three layers together achieve both speed and safety.",
      zh: "单一权限系统要么太严格（总是询问 → 慢）要么太宽松（总是允许 → 不安全）。三层设计优化了常见情况：\n\n• **第一层（ML 分类器）**：即时处理约 80% 的决策。`git status`？允许。`rm -rf /`？拒绝。无需用户交互。\n• **第二层（规则）**：处理用户特定策略。数据科学家可能允许所有 `python` 命令；DevOps 工程师可能允许 `kubectl` 但拒绝 `terraform destroy`。\n• **第三层（用户对话框）**：其他所有情况的安全网。仅在真正模糊的情况下触发。\n\n关键洞察：每一层减少下一层的负载。没有分类器，每个工具调用都会命中规则引擎。没有规则，每个不明显的调用都会打断用户。三层配合实现了速度和安全的双赢。"
    },
    // Terminal UI deep dive
    tuiReconciler: { en: "The Ink Reconciler (src/ink/reconciler.ts)", zh: "Ink 协调器 (src/ink/reconciler.ts)" },
    tuiReconcilerDesc: {
      en: "React's reconciler API has three key callbacks: `createInstance` creates a terminal DOM node from a React element, `appendChild` attaches it to the tree, and `commitUpdate` diffs old/new props and applies only the changes. Props flow directly into Yoga layout nodes — there's no separate layout pass, it happens inline during commit.",
      zh: "React 的协调器 API 有三个关键回调：`createInstance` 从 React 元素创建终端 DOM 节点，`appendChild` 将其附加到树中，`commitUpdate` 对比新旧 props 并只应用变化。Props 直接流入 Yoga 布局节点 — 没有单独的布局阶段，它在提交期间内联发生。"
    },
    tuiYoga: { en: "Yoga Layout Engine (src/ink/layout/yoga.ts)", zh: "Yoga 布局引擎 (src/ink/layout/yoga.ts)" },
    tuiYogaDesc: {
      en: "YogaLayoutNode wraps Facebook's Yoga WASM module. Every CSS Flexbox property (flex-direction, justify-content, align-items, etc.) maps to a Yoga setter. `calculateLayout()` runs the Flexbox solver synchronously — computing exact pixel positions for every element in the terminal grid. LTR direction is hardcoded since terminals don't support RTL.",
      zh: "YogaLayoutNode 包装了 Facebook 的 Yoga WASM 模块。每个 CSS Flexbox 属性（flex-direction、justify-content、align-items 等）映射到一个 Yoga setter。`calculateLayout()` 同步运行 Flexbox 求解器 — 计算终端网格中每个元素的精确像素位置。LTR 方向是硬编码的，因为终端不支持 RTL。"
    },
    tuiRender: { en: "ANSI Rendering (src/ink/render-node-to-output.ts)", zh: "ANSI 渲染 (src/ink/render-node-to-output.ts)" },
    tuiRenderDesc: {
      en: "The renderer walks the layout tree, using Yoga's computed positions (left, top, width, height) accumulated via offsetX/offsetY. Smart caching avoids redrawing unchanged subtrees — if a node isn't dirty and hasn't moved, it blits from the previous screen buffer. This is why streaming output doesn't flicker.",
      zh: "渲染器遍历布局树，使用 Yoga 计算的位置（left、top、width、height）通过 offsetX/offsetY 累积。智能缓存避免重绘未变化的子树 — 如果节点没有变脏且没有移动，就从上一个屏幕缓冲区 blit。这就是流式输出不闪烁的原因。"
    },
    tuiEvents: { en: "Event System (src/ink/events/dispatcher.ts)", zh: "事件系统 (src/ink/events/dispatcher.ts)" },
    tuiEventsDesc: {
      en: "The Dispatcher mirrors DOM event semantics in the terminal: capture phase (root → target), then bubble phase (target → root). `stopPropagation()` and `preventDefault()` work exactly like in browsers. Keyboard events from stdin are parsed into KeyboardEvent objects and dispatched through the tree with React's discrete update priority — ensuring UI updates are synchronous for user-initiated actions.",
      zh: "Dispatcher 在终端中镜像 DOM 事件语义：捕获阶段（根 → 目标），然后冒泡阶段（目标 → 根）。`stopPropagation()` 和 `preventDefault()` 与浏览器中完全相同。来自 stdin 的键盘事件被解析为 KeyboardEvent 对象，并通过树以 React 的离散更新优先级派发 — 确保用户发起的操作的 UI 更新是同步的。"
    },
    tuiWhyInk: { en: "Why Build a Custom Reconciler?", zh: "为什么要构建自定义协调器？" },
    tuiWhyInkDesc: {
      en: "Claude Code could have used a simpler approach: just print text line by line. But a React reconciler gives three critical advantages:\n\n• **Component reuse**: The same React mental model (components, hooks, state) works for terminal UI. Developers don't learn a new framework.\n• **Incremental updates**: React's diffing ensures only changed parts of the screen are redrawn. During streaming output (tokens arriving one at a time), this prevents the entire screen from flickering on every token.\n• **Layout composition**: Yoga's Flexbox means UI elements can be composed declaratively. A status bar + main content + sidebar is just `<Box flexDirection='row'>` — no manual cursor positioning.\n\nThe tradeoff: ~19K lines of rendering infrastructure. But this investment pays off across 346 components that all benefit from the same rendering pipeline.",
      zh: "Claude Code 可以用更简单的方式：逐行打印文本。但 React 协调器提供了三个关键优势：\n\n• **组件复用**：相同的 React 思维模型（组件、hooks、state）适用于终端 UI。开发者不需要学习新框架。\n• **增量更新**：React 的 diff 确保只重绘屏幕变化的部分。在流式输出（token 逐个到达）期间，这防止了每个 token 都导致整个屏幕闪烁。\n• **布局组合**：Yoga 的 Flexbox 意味着 UI 元素可以声明式组合。状态栏 + 主内容 + 侧边栏就是 `<Box flexDirection='row'>` — 无需手动光标定位。\n\n代价：约 19K 行渲染基础设施。但这项投资在 346 个组件中获得回报，它们都受益于同一渲染管线。"
    },
    // Plugin & Skill System deep dive
    psManifest: { en: "Plugin Manifest Schema (src/utils/plugins/schemas.ts)", zh: "插件清单模式 (src/utils/plugins/schemas.ts)" },
    psManifestDesc: {
      en: "Plugin manifests are fully typed via composable Zod schemas. The PluginManifestSchema composes 11 sub-schemas (metadata, hooks, commands, agents, skills, output-styles, channels, MCP/LSP servers, settings, user config) — all optional except name. This gives plugins a well-defined contract while remaining maximally flexible.",
      zh: "插件清单通过可组合的 Zod 模式完全类型化。PluginManifestSchema 组合了 11 个子模式（元数据、钩子、命令、代理、技能、输出样式、通道、MCP/LSP 服务器、设置、用户配置）— 除了 name 其余都是可选的。这给插件提供了明确的契约，同时保持最大的灵活性。"
    },
    psSkillLoading: { en: "Skill Discovery (src/skills/loadSkillsDir.ts)", zh: "技能发现 (src/skills/loadSkillsDir.ts)" },
    psSkillLoadingDesc: {
      en: "Skills load from 5 sources in parallel: managed policy skills, user skills (~/.claude/skills), project skills (.claude/skills up to home), additional --add-dir skills, and legacy /commands/ files. Deduplication uses file identity checks (handling symlinks). The entire function is memoized for performance.",
      zh: "技能从 5 个来源并行加载：管理策略技能、用户技能（~/.claude/skills）、项目技能（.claude/skills 向上到 home）、额外 --add-dir 技能和旧版 /commands/ 文件。去重使用文件身份检查（处理符号链接）。整个函数被 memoize 以提高性能。"
    },
    psHookExec: { en: "Hook Execution Engine (src/utils/hooks.ts)", zh: "钩子执行引擎 (src/utils/hooks.ts)" },
    psHookExecDesc: {
      en: "Hooks execute as async generators yielding results progressively. Every hook execution first checks workspace trust (security gate), then finds matching hooks via pattern matching against the event name. PreToolUse hooks can modify tool input or deny execution entirely. The system supports AbortSignal for cancellation and configurable timeouts.",
      zh: "钩子作为 async generator 执行，逐步 yield 结果。每次钩子执行首先检查工作区信任（安全门控），然后通过事件名称的模式匹配找到匹配的钩子。PreToolUse 钩子可以修改工具输入或完全拒绝执行。系统支持 AbortSignal 取消和可配置的超时。"
    },
    psPluginLoader: { en: "Plugin Loading Pipeline (src/utils/plugins/pluginLoader.ts)", zh: "插件加载管线 (src/utils/plugins/pluginLoader.ts)" },
    psPluginLoaderDesc: {
      en: "Plugin discovery filters by `plugin@marketplace` format, pre-loads marketplace catalogs once for efficiency, and loads all plugins in parallel via `Promise.allSettled()`. Enterprise policy is enforced with fail-closed semantics — if a marketplace can't be verified, the plugin is blocked rather than silently allowed. Auto-detection discovers component directories (commands/, agents/, skills/, output-styles/) via parallel path checks.",
      zh: "插件发现按 `plugin@marketplace` 格式过滤，预加载市场目录一次以提高效率，通过 `Promise.allSettled()` 并行加载所有插件。企业策略采用失败关闭语义 — 如果无法验证市场，插件被阻止而非静默允许。自动检测通过并行路径检查发现组件目录（commands/、agents/、skills/、output-styles/）。"
    },
    psWhyPlugins: { en: "Why This Plugin Architecture?", zh: "为什么选择这种插件架构？" },
    psWhyPluginsDesc: {
      en: "Claude Code's plugin system is unusually comprehensive for a CLI tool. Most CLIs have simple plugin APIs (register a command, done). Claude Code's plugins can modify behavior at 11+ extension points. The key design decisions:\n\n• **Manifest-first**: Every plugin declares its capabilities upfront in plugin.json. The system knows what a plugin provides before loading any code. This enables fast startup (skip unused plugins) and security auditing.\n• **Fail-closed security**: Enterprise admins can whitelist/blacklist marketplaces. Unknown sources are blocked by default — the opposite of npm's 'install anything' model.\n• **Parallel everything**: Skill discovery, plugin loading, and hook matching all use Promise.all/allSettled. With potentially dozens of plugins and hundreds of skills, sequential loading would add seconds to startup.\n• **Hooks as async generators**: Rather than simple callbacks, hooks yield results progressively. This enables streaming feedback during long-running hooks and natural cancellation via AbortSignal.",
      zh: "Claude Code 的插件系统对于 CLI 工具来说异常全面。大多数 CLI 有简单的插件 API（注册一个命令就完了）。Claude Code 的插件可以在 11+ 个扩展点修改行为。关键设计决策：\n\n• **清单优先**：每个插件在 plugin.json 中预先声明其能力。系统在加载任何代码之前就知道插件提供什么。这实现了快速启动（跳过未使用的插件）和安全审计。\n• **失败关闭安全性**：企业管理员可以白名单/黑名单市场。未知来源默认被阻止 — 与 npm 的'安装任何东西'模式相反。\n• **全面并行**：技能发现、插件加载和钩子匹配都使用 Promise.all/allSettled。在可能有数十个插件和数百个技能的情况下，顺序加载会增加数秒的启动时间。\n• **钩子作为 async generator**：不是简单的回调，钩子逐步 yield 结果。这实现了长时间运行的钩子期间的流式反馈和通过 AbortSignal 的自然取消。"
    },
    // Message Compaction deep dive
    mcAutoTrigger: { en: "Auto-Compact Trigger (src/services/compact/autoCompact.ts)", zh: "自动压缩触发 (src/services/compact/autoCompact.ts)" },
    mcAutoTriggerDesc: {
      en: "Compaction triggers when token count exceeds (context window - 13,000 buffer tokens). The buffer ensures there's always room for Claude's response. The check runs before every API call. An env override (`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`) allows testing with lower thresholds. Recursive agents (session_memory, compact) skip the check to prevent infinite loops.",
      zh: "当 token 数超过（上下文窗口 - 13,000 缓冲 token）时触发压缩。缓冲区确保 Claude 的响应始终有空间。检查在每次 API 调用前运行。环境变量覆盖（`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`）允许用更低的阈值测试。递归 Agent（session_memory、compact）跳过检查以防止无限循环。"
    },
    mcAlgorithm: { en: "Compaction Algorithm (src/services/compact/compact.ts)", zh: "压缩算法 (src/services/compact/compact.ts)" },
    mcAlgorithmDesc: {
      en: "Compaction forks a separate Claude agent specifically for summarization. The forked agent receives the conversation history and generates a compressed summary. PreCompact hooks run first (allowing plugins to inject custom instructions). The summary streams back while sending keep-alive signals to prevent WebSocket idle timeouts during long summarizations.",
      zh: "压缩分叉出一个专门用于摘要的独立 Claude Agent。分叉的 Agent 接收对话历史并生成压缩摘要。PreCompact 钩子先运行（允许插件注入自定义指令）。摘要流式返回，同时发送保活信号以防止长时间摘要期间的 WebSocket 空闲超时。"
    },
    mcReactive: { en: "Reactive Compact (src/query.ts)", zh: "响应式压缩 (src/query.ts)" },
    mcReactiveDesc: {
      en: "When the API returns a 413 'prompt too long' error during streaming, the error is withheld (not shown to the user). The system first tries context collapse (cheap: just strip expanded blocks). If that's not enough, it triggers a full reactive compact — summarize and retry. The token gap from the error message tells the system exactly how many tokens to free, enabling precise rather than conservative compaction.",
      zh: "当 API 在流式传输过程中返回 413 '提示过长' 错误时，错误被隐藏（不显示给用户）。系统首先尝试上下文折叠（便宜：只剥离展开的块）。如果不够，触发完整的响应式压缩 — 摘要并重试。错误消息中的 token 差距告诉系统确切需要释放多少 token，实现精确而非保守的压缩。"
    },
    mcTokenBudget: { en: "Token Budget Tracking (src/query/tokenBudget.ts)", zh: "Token 预算跟踪 (src/query/tokenBudget.ts)" },
    mcTokenBudgetDesc: {
      en: "The budget tracker monitors per-turn token usage. If usage is below 90% of budget and each turn is making progress (delta above threshold), the system continues automatically. If three consecutive turns show diminishing returns (tiny deltas), it stops — preventing infinite loops where Claude produces little useful output. This is separate from compaction: budget tracks output efficiency, compaction manages input size.",
      zh: "预算跟踪器监控每轮 token 使用。如果使用量低于预算的 90% 且每轮都在取得进展（增量超过阈值），系统自动继续。如果三轮连续显示收益递减（微小增量），系统停止 — 防止 Claude 产生很少有用输出的无限循环。这与压缩是分开的：预算跟踪输出效率，压缩管理输入大小。"
    },
    // Agent System deep dive
    asSpawning: { en: "Agent Spawning (src/tools/AgentTool/AgentTool.tsx)", zh: "Agent 派生 (src/tools/AgentTool/AgentTool.tsx)" },
    asSpawningDesc: {
      en: "`registerAsyncAgent()` creates task state with an independent AbortController (background agents survive when the user presses ESC). The spawn is decoupled from the parent via `void runWithAgentContext()` — note the `void`, no await. Agent names are registered in `agentNameRegistry` for SendMessage routing.",
      zh: "`registerAsyncAgent()` 创建带有独立 AbortController 的任务状态（后台 Agent 在用户按 ESC 时幸存）。派生通过 `void runWithAgentContext()` 与父级解耦 — 注意 `void`，不等待。Agent 名称注册在 `agentNameRegistry` 中用于 SendMessage 路由。"
    },
    asIsolation: { en: "Agent Isolation (src/utils/forkedAgent.ts)", zh: "Agent 隔离 (src/utils/forkedAgent.ts)" },
    asIsolationDesc: {
      en: "Each sub-agent gets a cloned `readFileState` (file cache), isolated `contentReplacementState`, independent `abortController`, and stubbed `setAppState` (no-op for async agents — they can't modify parent UI state). Only `setAppStateForTasks` reaches the root AppState for bash task cleanup. Permission prompts are suppressed (`shouldAvoidPermissionPrompts: true`).",
      zh: "每个子 Agent 获得克隆的 `readFileState`（文件缓存）、隔离的 `contentReplacementState`、独立的 `abortController` 和存根化的 `setAppState`（异步 Agent 为 no-op — 它们不能修改父 UI 状态）。只有 `setAppStateForTasks` 到达根 AppState 用于 bash 任务清理。权限提示被抑制（`shouldAvoidPermissionPrompts: true`）。"
    },
    asMessaging: { en: "Inter-Agent Messaging (src/tools/SendMessageTool/)", zh: "Agent 间消息传递 (src/tools/SendMessageTool/)" },
    asMessagingDesc: {
      en: "`writeToMailbox()` writes messages to teammate inboxes for swarm coordination. For in-process agents, `agentNameRegistry` enables direct routing — messages are queued if the agent is running, and the agent is auto-resumed via `resumeAgentBackground()` if stopped. This means agents can 'wake up' other agents by sending them messages.",
      zh: "`writeToMailbox()` 将消息写入队友收件箱用于蜂群协调。对于进程内 Agent，`agentNameRegistry` 实现直接路由 — 如果 Agent 正在运行则排队消息，如果已停止则通过 `resumeAgentBackground()` 自动恢复。这意味着 Agent 可以通过发送消息'唤醒'其他 Agent。"
    },
    asNotification: { en: "Async Notifications (src/tasks/LocalAgentTask/)", zh: "异步通知 (src/tasks/LocalAgentTask/)" },
    asNotificationDesc: {
      en: "When a background agent completes, `enqueueAgentNotification()` atomically sets a `notified` flag (preventing duplicates) and queues an XML `<task-notification>` block. The parent receives this as a system message on its next query — no polling needed. The notification includes task status, output file path, usage metrics, and optional worktree info.",
      zh: "当后台 Agent 完成时，`enqueueAgentNotification()` 原子性地设置 `notified` 标志（防止重复）并排队一个 XML `<task-notification>` 块。父级在下一次查询时作为系统消息接收 — 无需轮询。通知包含任务状态、输出文件路径、使用指标和可选的 worktree 信息。"
    },
    asWhyArchitecture: { en: "Why This Agent Architecture?", zh: "为什么选择这种 Agent 架构？" },
    asWhyArchitectureDesc: {
      en: "Most multi-agent systems use a centralized orchestrator that explicitly coordinates all agents. Claude Code takes a decentralized approach where agents are largely independent. The key design decisions:\n\n• **Independent abort controllers**: Background agents survive user ESC. This prevents accidentally killing a 10-minute sub-agent because the user wanted to cancel the main thread's current action. Agents are only killed explicitly via `chat:killAgents`.\n• **Stubbed setAppState**: Async agents can't modify parent UI state. This eliminates a whole class of race conditions — two agents can't simultaneously update the same status indicator. Only task registration (via `setAppStateForTasks`) crosses the boundary.\n• **Mailbox messaging**: Instead of shared memory or direct function calls, agents communicate via mailboxes (`writeToMailbox`). This is slower but safer — messages are queued, ordered, and the receiving agent processes them at its own pace.\n• **Auto-resume**: Stopped agents can be woken up by incoming messages. This enables reactive patterns — an agent can finish its work, stop, and be resumed later when new information arrives.\n\nThe tradeoff: more complex coordination (no shared state means more message passing). But for a system where agents execute untrusted code (bash commands, file edits), isolation is a feature, not a limitation.",
      zh: "大多数多 Agent 系统使用集中式编排器显式协调所有 Agent。Claude Code 采用去中心化方法，Agent 基本上是独立的。关键设计决策：\n\n• **独立的 abort 控制器**：后台 Agent 在用户按 ESC 时幸存。这防止了因为用户想取消主线程的当前操作而意外杀死一个运行 10 分钟的子 Agent。Agent 只能通过 `chat:killAgents` 显式终止。\n• **存根化 setAppState**：异步 Agent 不能修改父 UI 状态。这消除了一整类竞态条件 — 两个 Agent 不能同时更新同一个状态指示器。只有任务注册（通过 `setAppStateForTasks`）跨越边界。\n• **邮箱消息**：Agent 不使用共享内存或直接函数调用，而是通过邮箱（`writeToMailbox`）通信。这更慢但更安全 — 消息排队、有序，接收 Agent 按自己的节奏处理。\n• **自动恢复**：已停止的 Agent 可以被传入消息唤醒。这实现了响应式模式 — Agent 可以完成工作、停止，然后在新信息到达时恢复。\n\n代价：更复杂的协调（没有共享状态意味着更多消息传递）。但对于一个 Agent 执行不可信代码（bash 命令、文件编辑）的系统来说，隔离是特性而非限制。"
    },
    // IDE Bridge deep dive
    ibConnection: { en: "WebSocket Connection (src/cli/transports/WebSocketTransport.ts)", zh: "WebSocket 连接 (src/cli/transports/WebSocketTransport.ts)" },
    ibConnectionDesc: {
      en: "The bridge establishes either a Bun-native or Node.js WebSocket with `X-Last-Request-Id` headers for message replay on reconnect. On open, it starts periodic ping intervals (dead connection detection) and keep-alive frames (proxy idle-timeout reset). The transport supports both v1 (WebSocket) and v2 (SSE) protocols.",
      zh: "桥接建立 Bun 原生或 Node.js WebSocket，带 `X-Last-Request-Id` 头用于重连时的消息重放。连接打开后，启动定期 ping 间隔（死连接检测）和保活帧（代理空闲超时重置）。传输支持 v1（WebSocket）和 v2（SSE）两种协议。"
    },
    ibSessions: { en: "Session Management (src/bridge/bridgeMain.ts)", zh: "会话管理 (src/bridge/bridgeMain.ts)" },
    ibSessionsDesc: {
      en: "The bridge maintains parallel Maps indexed by sessionId: active session handles, work IDs (for heartbeats), ingress tokens (JWT auth), compatibility IDs, timers, and worktree paths. A capacity-wake signal coordinates shutdown of completed sessions with immediate acceptance of new work. Each session spawns a child CLI process with isolated environment variables.",
      zh: "桥接维护按 sessionId 索引的并行 Map：活跃会话句柄、工作 ID（用于心跳）、入口令牌（JWT 认证）、兼容性 ID、定时器和 worktree 路径。容量唤醒信号协调已完成会话的关闭与立即接受新工作。每个会话派生一个具有隔离环境变量的子 CLI 进程。"
    },
    ibPermission: { en: "Permission Delegation (src/bridge/sessionRunner.ts)", zh: "权限委托 (src/bridge/sessionRunner.ts)" },
    ibPermissionDesc: {
      en: "The child CLI emits `control_request` messages (NDJSON) with `can_use_tool` subtype when it needs permission. The bridge captures these from stdout, parses the tool name and input, and forwards to VS Code via POST `/v1/sessions/{id}/events`. The response flows back as a `control_response` event. This is why permission dialogs appear in VS Code's UI instead of the terminal.",
      zh: "子 CLI 在需要权限时发出 `control_request` 消息（NDJSON），带有 `can_use_tool` 子类型。桥接从 stdout 捕获这些消息，解析工具名称和输入，并通过 POST `/v1/sessions/{id}/events` 转发到 VS Code。响应作为 `control_response` 事件流回。这就是为什么权限对话框出现在 VS Code 的 UI 中而非终端。"
    },
    ibWhyBridge: { en: "Why a Bridge Instead of Direct Integration?", zh: "为什么用桥接而非直接集成？" },
    ibWhyBridgeDesc: {
      en: "Claude Code could have been built directly into the VS Code extension (like GitHub Copilot). Instead, it runs as a separate CLI process connected via a bridge. The reasons:\n\n• **Independence**: The CLI works standalone in any terminal. The bridge is optional — you don't need VS Code to use Claude Code.\n• **Process isolation**: The CLI runs untrusted code (bash commands, file edits). If it crashes or hangs, VS Code is unaffected. A direct integration would risk taking down the entire editor.\n• **Multiple frontends**: The same CLI can connect to VS Code, JetBrains, or any IDE that implements the bridge protocol. No code duplication.\n• **Version independence**: The CLI and VS Code extension can update independently. A breaking change in the CLI doesn't require a simultaneous extension update.\n\nThe tradeoff: higher latency (WebSocket round-trip for every permission check) and more complex architecture (session management, reconnection, token management). But for a tool that executes shell commands and modifies files, process isolation is worth the complexity.",
      zh: "Claude Code 可以直接内置到 VS Code 扩展中（像 GitHub Copilot 那样）。相反，它作为独立的 CLI 进程运行，通过桥接连接。原因：\n\n• **独立性**：CLI 可以在任何终端中独立工作。桥接是可选的 — 你不需要 VS Code 就能使用 Claude Code。\n• **进程隔离**：CLI 运行不可信代码（bash 命令、文件编辑）。如果崩溃或挂起，VS Code 不受影响。直接集成会有拖垮整个编辑器的风险。\n• **多前端**：同一个 CLI 可以连接 VS Code、JetBrains 或任何实现桥接协议的 IDE。无需代码重复。\n• **版本独立**：CLI 和 VS Code 扩展可以独立更新。CLI 中的破坏性变更不需要同时更新扩展。\n\n代价：更高的延迟（每次权限检查需要 WebSocket 往返）和更复杂的架构（会话管理、重连、令牌管理）。但对于一个执行 Shell 命令和修改文件的工具来说，进程隔离值得这些复杂性。"
    },
    // MCP Integration deep dive
    mcpConnection: { en: "MCP Client Connection (src/services/mcp/client.ts)", zh: "MCP 客户端连接 (src/services/mcp/client.ts)" },
    mcpConnectionDesc: {
      en: "`connectToServer()` is memoized — each server connects once. It creates the appropriate transport: `SSEClientTransport` for remote HTTP servers (with OAuth auth provider), `StdioClientTransport` for local processes (spawned via command), or `StreamableHTTPClientTransport` for the newer streaming protocol. Session ingress tokens are checked first for bridge-mode routing.",
      zh: "`connectToServer()` 被 memoize — 每个服务器只连接一次。它创建适当的传输：`SSEClientTransport` 用于远程 HTTP 服务器（带 OAuth 认证提供者），`StdioClientTransport` 用于本地进程（通过命令启动），或 `StreamableHTTPClientTransport` 用于较新的流式协议。首先检查会话入口令牌以进行桥接模式路由。"
    },
    mcpDiscovery: { en: "Tool Discovery (src/services/mcp/client.ts)", zh: "工具发现 (src/services/mcp/client.ts)" },
    mcpDiscoveryDesc: {
      en: "`fetchToolsForClient()` issues a `tools/list` RPC to the connected MCP server. The response is sanitized (Unicode normalization), optionally prefixed with `mcp__serverName__` for namespacing, and converted to Claude Code's internal `Tool` format. The function uses LRU memoization — tool lists are cached but can be refreshed when the server signals capability changes.",
      zh: "`fetchToolsForClient()` 向连接的 MCP 服务器发出 `tools/list` RPC。响应被清理（Unicode 规范化），可选地加上 `mcp__serverName__` 前缀用于命名空间，并转换为 Claude Code 的内部 `Tool` 格式。函数使用 LRU memoize — 工具列表被缓存但可以在服务器发出能力变更信号时刷新。"
    },
    mcpExecution: { en: "Tool Execution (src/services/mcp/client.ts)", zh: "工具执行 (src/services/mcp/client.ts)" },
    mcpExecutionDesc: {
      en: "MCP tool execution has three layers: the `MCPTool.call()` wrapper emits progress events and handles session retries; `callMCPToolWithUrlElicitationRetry` handles OAuth re-auth for 401s; the inner `callMCPTool()` issues the actual `tools/call` RPC with a `Promise.race` timeout guard (SDK timeout can fail on broken SSE streams). Progress logging fires every 30s for long-running tools.",
      zh: "MCP 工具执行有三层：`MCPTool.call()` 包装器发出进度事件并处理会话重试；`callMCPToolWithUrlElicitationRetry` 处理 401 的 OAuth 重新认证；内层 `callMCPTool()` 发出实际的 `tools/call` RPC，带有 `Promise.race` 超时守卫（SDK 超时在 SSE 流断裂时可能失败）。长时间运行的工具每 30 秒触发进度日志。"
    },
    mcpWhyProtocol: { en: "Why MCP Instead of Custom Integrations?", zh: "为什么用 MCP 而非自定义集成？" },
    mcpWhyProtocolDesc: {
      en: "Claude Code could have built custom integrations for each external service (database connectors, cloud APIs, etc.). MCP provides a standard protocol instead. The key advantages:\n\n• **Ecosystem leverage**: Anyone can build an MCP server. Claude Code doesn't need to ship integrations for every service — the community builds them. One protocol, infinite tools.\n• **Transport flexibility**: The same protocol works over stdio (local, zero latency), SSE (remote, firewall-friendly), or streaming HTTP (cloud-native). A database connector runs locally via stdio; a SaaS API uses SSE.\n• **Standard auth**: OAuth is built into the protocol. Every MCP server that needs auth uses the same flow — no custom auth implementation per service.\n• **Capability negotiation**: Servers declare what they support (tools, resources, prompts) via capabilities. Claude Code only requests what's available, gracefully degrading when features are absent.\n\nThe tradeoff: MCP adds a serialization layer (JSON-RPC over transport) compared to direct function calls. For local tools this adds ~1ms overhead — negligible. For remote tools, network latency dominates anyway.",
      zh: "Claude Code 可以为每个外部服务（数据库连接器、云 API 等）构建自定义集成。MCP 提供了一个标准协议。关键优势：\n\n• **生态杠杆**：任何人都可以构建 MCP 服务器。Claude Code 不需要为每个服务发布集成 — 社区来构建。一个协议，无限工具。\n• **传输灵活性**：相同的协议适用于 stdio（本地，零延迟）、SSE（远程，防火墙友好）或流式 HTTP（云原生）。数据库连接器通过 stdio 本地运行；SaaS API 使用 SSE。\n• **标准认证**：OAuth 内置于协议中。每个需要认证的 MCP 服务器使用相同的流程 — 无需为每个服务自定义认证实现。\n• **能力协商**：服务器通过能力声明它们支持什么（工具、资源、提示）。Claude Code 只请求可用的功能，在功能缺失时优雅降级。\n\n代价：MCP 增加了一个序列化层（传输上的 JSON-RPC），相比直接函数调用。对于本地工具，这增加约 1ms 开销 — 可忽略。对于远程工具，网络延迟本来就是主导因素。"
    },
    // Architecture Overview deep dive
    ovStartup: { en: "Parallel Startup (src/main.tsx)", zh: "并行启动 (src/main.tsx)" },
    ovStartupDesc: {
      en: "Before loading heavy modules (~135ms of imports), the entry point fires three parallel async operations: MDM settings read (plutil/reg query), macOS keychain prefetch (OAuth + API key), and profiling checkpoint. This shaves ~65ms off every cold start. The pattern: start I/O before imports, await results after.",
      zh: "在加载重量级模块（约 135ms 的 import）之前，入口点触发三个并行异步操作：MDM 设置读取（plutil/reg query）、macOS 钥匙串预取（OAuth + API key）和性能分析检查点。这从每次冷启动中节省约 65ms。模式：在 import 之前启动 I/O，在之后等待结果。"
    },
    ovStore: { en: "AppState Store (src/state/store.ts)", zh: "AppState 存储 (src/state/store.ts)" },
    ovStoreDesc: {
      en: "The entire app state lives in a single store — a minimal pub-sub pattern with no middleware (no Redux, no Zustand). `setState` uses referential equality (`Object.is`) to skip no-op updates. React components subscribe via `useSyncExternalStore`. The AppState shape has 50+ fields covering settings, MCP connections, permissions, tasks, notifications, and UI state.",
      zh: "整个应用状态存在于单个存储中 — 一个没有中间件的最小发布-订阅模式（没有 Redux，没有 Zustand）。`setState` 使用引用相等性（`Object.is`）跳过无操作更新。React 组件通过 `useSyncExternalStore` 订阅。AppState 形状有 50+ 个字段，覆盖设置、MCP 连接、权限、任务、通知和 UI 状态。"
    },
    ovFeatureFlags: { en: "Build-Time Feature Flags (bun:bundle)", zh: "构建时特性开关 (bun:bundle)" },
    ovFeatureFlagsDesc: {
      en: "`feature('X')` from `bun:bundle` is a build-time constant, not a runtime check. When a flag is false, the entire code branch is eliminated from the bundle by dead-code elimination. This powers multi-variant builds: the public npm package has COORDINATOR_MODE=false (removing the coordinator module entirely), while internal builds enable it. Found flags include: VOICE_MODE, KAIROS, COORDINATOR_MODE, TRANSCRIPT_CLASSIFIER, DIRECT_CONNECT, WEB_BROWSER_TOOL.",
      zh: "`feature('X')` 来自 `bun:bundle`，是构建时常量而非运行时检查。当标志为 false 时，整个代码分支被死代码消除从包中移除。这支持多变体构建：公共 npm 包的 COORDINATOR_MODE=false（完全移除协调器模块），而内部构建启用它。发现的标志包括：VOICE_MODE、KAIROS、COORDINATOR_MODE、TRANSCRIPT_CLASSIFIER、DIRECT_CONNECT、WEB_BROWSER_TOOL。"
    },
    ovErrors: { en: "Error Classification (src/utils/errors.ts)", zh: "错误分类 (src/utils/errors.ts)" },
    ovErrorsDesc: {
      en: "Errors are classified into domain-specific types: `AbortError` (user cancellation), `ShellError` (bash failure with stdout/stderr/exit code), `ConfigParseError` (invalid settings), and `TelemetrySafeError` (separates user-facing messages from PII-scrubbed analytics). The `isAbortError()` utility handles three different abort error sources (custom, SDK, native). API errors are converted to user messages rather than thrown — the conversation continues even after errors.",
      zh: "错误被分类为领域特定类型：`AbortError`（用户取消）、`ShellError`（bash 失败，带 stdout/stderr/退出码）、`ConfigParseError`（无效设置）和 `TelemetrySafeError`（分离面向用户的消息和去 PII 的分析数据）。`isAbortError()` 工具处理三种不同的中止错误来源（自定义、SDK、原生）。API 错误被转换为用户消息而非抛出 — 对话在错误后继续。"
    },
    ovWhyArchitecture: { en: "Why This Architecture?", zh: "为什么选择这种架构？" },
    ovWhyArchitectureDesc: {
      en: "Claude Code's architecture makes several opinionated choices that differ from typical web applications:\n\n• **No framework for state**: No Redux, MobX, or Zustand. A 30-line pub-sub store handles all state. Why? Terminal UIs have simpler state flows than web apps — most state changes are linear (user types → API calls → tools execute → results render). Complex state libraries add overhead without proportional benefit.\n• **Build-time over runtime config**: Feature flags are resolved at bundle time, not runtime. This means the npm package doesn't contain internal-only code at all — not behind a flag, not in a dead branch, completely absent. This is both a security and bundle-size win.\n• **Errors as messages, not exceptions**: When the API returns an error, it becomes a message in the conversation rather than an unhandled exception. This keeps the conversation going — Claude can see the error and adapt. A thrown exception would crash the turn.\n• **Parallel by default**: Startup prefetches I/O in parallel. Tool execution runs reads in parallel. Plugin/skill discovery loads in parallel. MCP servers connect in parallel. The pattern is consistent: identify independent operations, run them concurrently, merge results.\n• **Deep dependency spine**: The top 5 most-imported modules (ink, Tool, commands, bootstrap/state, messages) form a clear spine. Everything else branches off with shallow depth. This prevents the circular dependency tangles that plague large TypeScript codebases.",
      zh: "Claude Code 的架构做出了几个与典型 Web 应用不同的固执选择：\n\n• **状态无框架**：没有 Redux、MobX 或 Zustand。一个 30 行的发布-订阅存储处理所有状态。为什么？终端 UI 的状态流比 Web 应用简单 — 大多数状态变化是线性的（用户输入 → API 调用 → 工具执行 → 结果渲染）。复杂的状态库增加了开销而没有相应的收益。\n• **构建时而非运行时配置**：特性开关在打包时解析，而非运行时。这意味着 npm 包根本不包含仅限内部的代码 — 不是在标志后面，不是在死分支中，而是完全不存在。这既是安全性也是包大小的胜利。\n• **错误作为消息而非异常**：当 API 返回错误时，它变成对话中的消息而非未处理的异常。这保持对话继续 — Claude 可以看到错误并适应。抛出异常会导致当前轮次崩溃。\n• **默认并行**：启动时并行预取 I/O。工具执行并行运行读操作。插件/技能发现并行加载。MCP 服务器并行连接。模式一致：识别独立操作，并发运行，合并结果。\n• **深度依赖脊柱**：最多导入的 5 个模块（ink、Tool、commands、bootstrap/state、messages）形成清晰的脊柱。其他一切以浅深度分支。这防止了困扰大型 TypeScript 代码库的循环依赖纠缠。"
    },
    mcWhyFourStrategies: { en: "Why Four Strategies Instead of One?", zh: "为什么是四种策略而不是一种？" },
    mcWhyFourStrategiesDesc: {
      en: "A single compaction strategy would either be too aggressive (losing important context) or too conservative (running out of space). The four strategies form a defense-in-depth:\n\n• **Auto-compact** (proactive): Runs before problems occur. Summarizes the oldest messages first, preserving recent context. Handles ~90% of cases — most conversations never hit a 413 error.\n• **Reactive compact** (recovery): Catches the remaining ~10% — conversations that grow too fast between auto-compact checks. Parses the exact token overage from the 413 error for precise trimming.\n• **Context collapse** (cheap): Before doing a full summarization, tries simply collapsing expanded content blocks. Zero API cost, instant.\n• **Micro-compact** (targeted): Summarizes individual oversized tool results inline rather than compacting the entire history. A single `cat large_file.ts` shouldn't force a full conversation summary.\n\nThe key insight: each strategy has different cost/precision tradeoffs. Collapse is free but coarse. Auto-compact is a full API call but planned. Reactive is expensive but precise. Micro is targeted but local. Together they handle every scenario efficiently.",
      zh: "单一压缩策略要么太激进（丢失重要上下文）要么太保守（空间不足）。四种策略形成纵深防御：\n\n• **自动压缩**（主动）：在问题发生前运行。优先总结最旧的消息，保留最近的上下文。处理约 90% 的情况 — 大多数对话从不会遇到 413 错误。\n• **响应式压缩**（恢复）：捕获剩余约 10% — 在自动压缩检查之间增长过快的对话。从 413 错误中解析确切的 token 超额以进行精确修剪。\n• **上下文折叠**（廉价）：在进行完整摘要之前，尝试简单地折叠展开的内容块。零 API 成本，即时完成。\n• **微压缩**（定向）：对单个超大工具结果进行内联摘要，而不是压缩整个历史。一次 `cat large_file.ts` 不应该强制进行完整的对话摘要。\n\n关键洞察：每种策略有不同的成本/精度权衡。折叠是免费但粗糙的。自动压缩是完整的 API 调用但有计划的。响应式是昂贵但精确的。微压缩是定向但局部的。它们一起高效处理每种场景。"
    },
  },
  easterEggs: {
    title: { en: "Easter Eggs & Curiosities", zh: "彩蛋与趣闻" },
    subtitle: { en: "The weird, wonderful, and unexpected things hiding in 512K lines of code", zh: "隐藏在 51 万行代码中的奇妙、有趣和意想不到的东西" },
    buddyTitle: { en: "Your Personal Companion Sprite", zh: "你的专属伙伴精灵" },
    buddyDesc: {
      en: "Claude Code generates a unique companion sprite for every user based on their user ID. There are **18 species** (Duck, Goose, Blob, Cat, Dragon, Octopus, Owl, Penguin, Turtle, Snail, Ghost, Axolotl, Capybara, Cactus, Robot, Rabbit, Mushroom, Chonk), **6 eye styles**, **8 hat types**, **5 stats** (DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK), and **5 rarity tiers** from common (60%) to legendary (1%). Each sprite has 3 animation frames for idle fidgeting. The PRNG comment reads: \"Mulberry32 — tiny seeded PRNG, good enough for picking ducks.\"",
      zh: "Claude Code 根据用户 ID 为每个用户生成独特的伙伴精灵。有 **18 个物种**（鸭子、鹅、Blob、猫、龙、章鱼、猫头鹰、企鹅、乌龟、蜗牛、幽灵、美西螈、水豚、仙人掌、机器人、兔子、蘑菇、胖墩），**6 种眼睛样式**，**8 种帽子**，**5 项属性**（调试、耐心、混乱、智慧、毒舌），以及从普通（60%）到传奇（1%）的 **5 个稀有度**。每个精灵有 3 帧闲置动画。随机数生成器的注释写道：\"Mulberry32 — 微型种子 PRNG，用来挑鸭子够用了。\""
    },
    vimTitle: { en: "Full Vim Mode in a CLI", zh: "CLI 中的完整 Vim 模式" },
    vimDesc: {
      en: "Yes, really. Claude Code implements a complete vim emulation with INSERT/NORMAL modes, hjkl motions, word motions (wb e), line positions (0^$), find (fFtT), text objects (inner/around word, quotes, parens), delete/change/yank operators, dot-repeat, register system, and a max command count of 10,000. All in a tool that talks to an AI.",
      zh: "是的，真的。Claude Code 实现了完整的 vim 仿真：INSERT/NORMAL 模式、hjkl 移动、单词移动（wb e）、行位置（0^$）、查找（fFtT）、文本对象（内部/周围 word、引号、括号）、delete/change/yank 操作符、点重复、寄存器系统，最大命令计数 10,000。这一切都在一个与 AI 对话的工具中。"
    },
    voiceTitle: { en: "Voice Input via Spacebar", zh: "按空格键语音输入" },
    voiceDesc: {
      en: "Hold spacebar, speak, release. Claude Code connects to Anthropic's private `voice_stream` WebSocket endpoint for real-time speech-to-text. It records 16kHz mono audio, streams it for transcription, and types the result into your prompt. Requires a Claude.ai subscription and a microphone. Has a kill-switch codename: `tengu_amber_quartz_disabled`.",
      zh: "按住空格键，说话，松开。Claude Code 连接到 Anthropic 的私有 `voice_stream` WebSocket 端点进行实时语音转文字。录制 16kHz 单声道音频，流式传输进行转录，将结果输入到你的提示中。需要 Claude.ai 订阅和麦克风。有一个代号为 `tengu_amber_quartz_disabled` 的终止开关。"
    },
    namesTitle: { en: "The Longest Class Name Award", zh: "最长类名奖" },
    namesDesc: {
      en: "Winner: `TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS` (58 characters). This isn't a joke — the ridiculous name is a deliberate code review checkpoint. Every developer who types this name is forced to verify they're not leaking sensitive data. The companion type `AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS` is even longer at 60 characters.",
      zh: "获奖者：`TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS`（58 个字符）。这不是玩笑 — 这个荒谬的名字是故意的代码审查检查点。每个输入这个名字的开发者都被迫验证自己没有泄露敏感数据。配套类型 `AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS` 更长，有 60 个字符。"
    },
    codenamesTitle: { en: "87 Internal Codenames", zh: "87 个内部代号" },
    codenamesDesc: {
      en: "The codebase has 87 unique feature flags, most with cryptic codenames: KAIROS (assistant mode with 9+ variants including channels, push, dream, brief), CHICAGO_MCP (MCP server selection), COORDINATOR_MODE (multi-agent), VOICE_MODE, ULTRAPLAN, ULTRATHINK, TORCH, LODESTONE, and more. The `feature()` function from `bun:bundle` eliminates all disabled codepaths at build time — the public npm package contains none of these.",
      zh: "代码库有 87 个唯一特性开关，大多数有神秘代号：KAIROS（助手模式，有 9+ 变体包括频道、推送、梦境、简报）、CHICAGO_MCP（MCP 服务器选择）、COORDINATOR_MODE（多 Agent）、VOICE_MODE、ULTRAPLAN、ULTRATHINK、TORCH、LODESTONE 等。`bun:bundle` 的 `feature()` 函数在构建时消除所有禁用的代码路径 — 公共 npm 包不包含任何这些。"
    },
    undercoverTitle: { en: "Undercover Mode", zh: "卧底模式" },
    undercoverDesc: {
      en: "When Anthropic employees use Claude Code on public/open-source repos, \"undercover mode\" auto-activates. It strips all Co-Authored-By attribution, prevents mentioning internal project names, and adds safety instructions to avoid leaking model codenames. Force it with `CLAUDE_CODE_UNDERCOVER=1`. The entire feature is dead-code-eliminated from public builds.",
      zh: "当 Anthropic 员工在公共/开源仓库上使用 Claude Code 时，\"卧底模式\"自动激活。它删除所有 Co-Authored-By 署名，防止提及内部项目名称，并添加安全指令以避免泄露模型代号。可以用 `CLAUDE_CODE_UNDERCOVER=1` 强制开启。整个功能在公共构建中被死代码消除。"
    },
    costTitle: { en: "It Tracks Every Penny", zh: "它追踪每一分钱" },
    costDesc: {
      en: "The cost tracker (`src/cost-tracker.ts`, 323 lines) records input tokens, output tokens, cache reads, cache writes, web search requests, API duration, lines of code added/removed — all persisted to disk per session. Costs are calculated to 4 decimal places (or 2 for amounts over $0.50). It even tracks FPS metrics for the terminal UI.",
      zh: "成本追踪器（`src/cost-tracker.ts`，323 行）记录输入 token、输出 token、缓存读取、缓存写入、网络搜索请求、API 时长、添加/删除的代码行数 — 全部按会话持久化到磁盘。成本精确计算到小数点后 4 位（超过 $0.50 时精确到 2 位）。它甚至追踪终端 UI 的 FPS 指标。"
    },
    extremeTitle: { en: "Extreme Files", zh: "极端文件" },
    extremeDesc: {
      en: "Longest file: `src/cli/print.ts` at **5,594 lines** (208KB) — the streaming output renderer. Runner-up: `src/screens/REPL.tsx` at **5,005 lines** — the main conversation loop UI. Third: `src/utils/messages.ts` at **5,512 lines** — message creation and manipulation. The deepest directory path spans 100+ characters. There are 346 React components rendering in a terminal.",
      zh: "最长文件：`src/cli/print.ts` 有 **5,594 行**（208KB）— 流式输出渲染器。亚军：`src/screens/REPL.tsx` 有 **5,005 行** — 主对话循环 UI。第三：`src/utils/messages.ts` 有 **5,512 行** — 消息创建和操作。最深的目录路径超过 100 个字符。有 346 个 React 组件在终端中渲染。"
    },
    encodingTitle: { en: "The Species Name Puzzle", zh: "物种名称之谜" },
    encodingDesc: {
      en: "In the buddy system, species names are encoded using `String.fromCharCode()` instead of plain strings. Why? One species name collides with an internal model codename that's checked by `excluded-strings.txt` in the build pipeline. The check greps build output, so runtime-constructing the name keeps the literal out of the bundle. The salt for companion generation is literally `'friend-2026-401'` — dated April 1st, 2026.",
      zh: "在伙伴系统中，物种名称使用 `String.fromCharCode()` 编码而非普通字符串。为什么？一个物种名称与内部模型代号冲突，该代号被构建管线中的 `excluded-strings.txt` 检查。检查会 grep 构建输出，所以运行时构造名称可以避免字面值出现在包中。伙伴生成的盐值字面意思是 `'friend-2026-401'` — 日期是 2026 年 4 月 1 日。"
    },
  },
} as const;

type TranslationValue = { en: string; zh: string };

export function t(locale: Locale, path: string): string {
  const keys = path.split(".");
  let current: any = translations;
  for (const key of keys) {
    current = current?.[key];
    if (!current) return path;
  }
  return (current as TranslationValue)[locale] ?? path;
}

export default translations;
