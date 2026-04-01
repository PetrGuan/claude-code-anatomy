# Claude Code Anatomy

[English](./README.md)

一个交互式可视化项目，深入浅出地分析 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Anthropic 的 AI 编程助手。

**[在线查看 →](https://petrguan.github.io/claude-code-anatomy/zh/)**

## 这是什么？

Claude Code 是一个 512K 行 TypeScript 编写的 CLI 工具，让你可以直接在终端中与 Claude 交互。本项目通过交互式可视化，将它的架构拆解分析，让开发者和非技术人员都能看懂。

## 页面

| 页面 | 描述 |
|------|------|
| [架构概览](https://petrguan.github.io/claude-code-anatomy/zh/overview) | 交互式模块气泡图，一览全局架构 |
| [查询管线](https://petrguan.github.io/claude-code-anatomy/zh/query-pipeline) | 用户输入如何经过系统流转并产生响应 |
| [工具系统](https://petrguan.github.io/claude-code-anatomy/zh/tool-system) | 45+ 工具，读并行写串行的智能调度 |
| [权限与安全](https://petrguan.github.io/claude-code-anatomy/zh/permission-security) | 三层纵深防御：ML 分类器 → 规则引擎 → 用户确认 |
| [终端 UI](https://petrguan.github.io/claude-code-anatomy/zh/terminal-ui) | React + Ink 终端渲染管线 |
| [插件与技能系统](https://petrguan.github.io/claude-code-anatomy/zh/plugin-skill) | 可扩展的插件架构和技能市场 |
| [消息压缩](https://petrguan.github.io/claude-code-anatomy/zh/message-compaction) | 4 种策略管理上下文窗口限制 |
| [Agent 系统](https://petrguan.github.io/claude-code-anatomy/zh/agent-system) | 多 Agent 协调与任务分解 |
| [IDE 桥接](https://petrguan.github.io/claude-code-anatomy/zh/ide-bridge) | VS Code ↔ CLI 实时双向通信 |
| [MCP 集成](https://petrguan.github.io/claude-code-anatomy/zh/mcp-integration) | 模型上下文协议，连接外部工具和数据 |

所有页面均提供 [English](https://petrguan.github.io/claude-code-anatomy/) 和中文版本。

## 技术栈

- **[Astro](https://astro.build/)** — 静态站点生成器，页面默认零 JS
- **[React](https://react.dev/)** — 交互岛屿（进入视口时按需加载）
- **[Tailwind CSS](https://tailwindcss.com/)** — 暗色主题 + 自定义设计令牌
- **[D3.js](https://d3js.org/)** — 架构拓扑图和气泡图可视化
- **[Framer Motion](https://www.framer.com/motion/)** — 滚动触发动画
- **[Shiki](https://shiki.style/)** — 代码语法高亮

## 本地开发

```bash
npm install
npm run dev        # 启动开发服务器 localhost:4321
npm run build      # 构建静态站点到 dist/
```

## 许可证

MIT
