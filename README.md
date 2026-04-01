# Claude Code Anatomy

[中文版](./README.zh-CN.md)

An interactive, visual deep-dive into the architecture of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Anthropic's AI coding assistant.

**[Live Site →](https://petrguan.github.io/claude-code-anatomy/)**

## What is this?

Claude Code is a 512K-line TypeScript CLI that lets you interact with Claude directly from the terminal. This project provides an interactive visualization that breaks down its architecture, making it accessible to both developers and non-technical readers.

## Pages

| Page | Description |
|------|-------------|
| [Overview](https://petrguan.github.io/claude-code-anatomy/overview) | Architecture overview with interactive module bubble chart |
| [Query Pipeline](https://petrguan.github.io/claude-code-anatomy/query-pipeline) | How user input flows through the system to produce a response |
| [Tool System](https://petrguan.github.io/claude-code-anatomy/tool-system) | 45+ tools with parallel read / serial write scheduling |
| [Permission & Security](https://petrguan.github.io/claude-code-anatomy/permission-security) | Three-layer defense: ML classifier → rules → user confirmation |
| [Terminal UI](https://petrguan.github.io/claude-code-anatomy/terminal-ui) | React + Ink rendering pipeline for terminal interfaces |
| [Plugin & Skill System](https://petrguan.github.io/claude-code-anatomy/plugin-skill) | Extensible plugin architecture and skill marketplace |
| [Message Compaction](https://petrguan.github.io/claude-code-anatomy/message-compaction) | 4 strategies for managing context window limits |
| [Agent System](https://petrguan.github.io/claude-code-anatomy/agent-system) | Multi-agent coordination and task decomposition |
| [IDE Bridge](https://petrguan.github.io/claude-code-anatomy/ide-bridge) | Real-time VS Code ↔ CLI communication |
| [MCP Integration](https://petrguan.github.io/claude-code-anatomy/mcp-integration) | Model Context Protocol for external tool connectivity |

All pages available in English and [中文](https://petrguan.github.io/claude-code-anatomy/zh/).

## Tech Stack

- **[Astro](https://astro.build/)** — Static site generator with zero-JS-by-default pages
- **[React](https://react.dev/)** — Interactive islands (hydrated on viewport entry)
- **[Tailwind CSS](https://tailwindcss.com/)** — Dark theme with custom design tokens
- **[D3.js](https://d3js.org/)** — Architecture map and bubble chart visualizations
- **[Framer Motion](https://www.framer.com/motion/)** — Scroll-triggered animations
- **[Shiki](https://shiki.style/)** — Syntax highlighting for code snippets

## Development

```bash
npm install
npm run dev        # Start dev server at localhost:4321
npm run build      # Build static site to dist/
```

## License

MIT
