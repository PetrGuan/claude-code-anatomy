# Claude Code Anatomy

[English](./README.md)

一个交互式可视化项目，深入浅出地分析 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Anthropic 的 AI 编程助手。面向开发者和非技术人员。

**[在线查看 →](https://petrguan.github.io/claude-code-anatomy/zh/)**

## 这是什么？

Claude Code 是一个 512K 行 TypeScript 编写的 CLI 工具，让你可以直接在终端中与 Claude 交互。本项目通过交互式可视化、真实源码分析和设计决策解析，将它的架构拆解分析，让每个人都能看懂。

## 功能特性

- **26 个页面**，覆盖 13 个主题，每个均提供英文和中文版本
- **暗色/亮色主题**，Shiki 语法高亮自动适配
- **交互组件**：架构图、气泡图、流程图、权限模拟器、工具调度演示、CodeTracer（3 条调用链）、API 数据查看器
- **Deep Dive 深度剖析**：每页都有真实源码和设计决策分析
- **全站搜索**：Pagefind 驱动（Cmd+K）
- **术语表**：12 个关键技术术语解释
- **阅读导航**：上/下一篇、相关页面推荐、Section 锚点链接
- **响应式设计**：桌面、平板、手机全适配
- **无障碍支持**：ARIA 属性、键盘导航、焦点管理

## 页面

### 核心分析

| 页面 | 描述 |
|------|------|
| [架构概览](https://petrguan.github.io/claude-code-anatomy/zh/overview) | 交互式模块气泡图，一览全局架构 |
| [查询管线](https://petrguan.github.io/claude-code-anatomy/zh/query-pipeline) | 用户输入 → API → 工具 → 响应，含真实 API 数据示例 |
| [工具系统](https://petrguan.github.io/claude-code-anatomy/zh/tool-system) | 45+ 工具，读并行写串行的智能调度 |
| [权限与安全](https://petrguan.github.io/claude-code-anatomy/zh/permission-security) | 三层纵深防御：ML 分类器 → 规则引擎 → 用户确认 |

### 进阶主题

| 页面 | 描述 |
|------|------|
| [终端 UI](https://petrguan.github.io/claude-code-anatomy/zh/terminal-ui) | React + Ink 终端渲染管线 |
| [插件与技能系统](https://petrguan.github.io/claude-code-anatomy/zh/plugin-skill) | 可扩展的插件架构和技能市场 |
| [消息压缩](https://petrguan.github.io/claude-code-anatomy/zh/message-compaction) | 4 种策略管理上下文窗口限制 |
| [Agent 系统](https://petrguan.github.io/claude-code-anatomy/zh/agent-system) | 多 Agent 协调与任务分解 |

### 可选与参考

| 页面 | 描述 |
|------|------|
| [IDE 桥接](https://petrguan.github.io/claude-code-anatomy/zh/ide-bridge) | VS Code ↔ CLI 实时双向通信 |
| [MCP 集成](https://petrguan.github.io/claude-code-anatomy/zh/mcp-integration) | 模型上下文协议，连接外部工具和数据 |
| [术语表](https://petrguan.github.io/claude-code-anatomy/zh/glossary) | 关键技术术语解释 |
| [彩蛋](https://petrguan.github.io/claude-code-anatomy/zh/easter-eggs) | 隐藏在 51 万行代码中的有趣发现 |

所有页面均提供 [English](https://petrguan.github.io/claude-code-anatomy/) 和中文版本。

## 技术栈

- **[Astro](https://astro.build/)** — 静态站点生成器，页面默认零 JS
- **[React](https://react.dev/)** — 交互岛屿（进入视口时按需加载）
- **[Tailwind CSS](https://tailwindcss.com/)** — 暗色/亮色主题，CSS 变量驱动
- **[D3.js](https://d3js.org/)** — 架构拓扑图和气泡图可视化
- **[Framer Motion](https://www.framer.com/motion/)** — 滚动触发动画
- **[Shiki](https://shiki.style/)** — 代码语法高亮（暗色 + 亮色主题）
- **[Pagefind](https://pagefind.app/)** — 静态全文搜索

## 本地开发

```bash
npm install
npm run dev        # 启动开发服务器 localhost:4321
npm run build      # 构建静态站点到 dist/（含 Pagefind 索引）
```

## 许可证

MIT
