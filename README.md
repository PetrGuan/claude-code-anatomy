# Claude Code Anatomy

[中文版](./README.zh-CN.md)

An interactive, visual deep-dive into the architecture of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Anthropic's AI coding assistant. Accessible to both developers and non-technical readers.

**[Live Site →](https://petrguan.github.io/claude-code-anatomy/)**

## What is this?

Claude Code is a 512K-line TypeScript CLI that lets you interact with Claude directly from the terminal. This project breaks down its architecture through interactive visualizations, real source code analysis, and design decision essays — making it truly accessible to everyone.

## Features

- **26 pages** across 13 topics, each in English and 中文
- **Dark / Light theme** with full Shiki syntax highlighting adaptation
- **Interactive components**: architecture map, bubble chart, flow diagrams, permission simulator, tool scheduling demo, CodeTracer (3 call chains), API data viewer
- **Deep Dive sections** on every page with real source code and design decision analysis
- **Full-text search** via Pagefind (Cmd+K)
- **Glossary** with 12 key technical terms
- **Page navigation**: previous/next links, related page recommendations, section anchor links
- **Responsive design**: desktop, tablet, mobile
- **Accessibility**: ARIA attributes, keyboard navigation, focus management

## Pages

### Core Analysis

| Page | Description |
|------|-------------|
| [Overview](https://petrguan.github.io/claude-code-anatomy/overview) | Architecture overview with interactive module bubble chart |
| [Query Pipeline](https://petrguan.github.io/claude-code-anatomy/query-pipeline) | User input → API → tools → response, with real API data examples |
| [Tool System](https://petrguan.github.io/claude-code-anatomy/tool-system) | 45+ tools with parallel read / serial write scheduling |
| [Permission & Security](https://petrguan.github.io/claude-code-anatomy/permission-security) | Three-layer defense: ML classifier → rules → user confirmation |

### Advanced Topics

| Page | Description |
|------|-------------|
| [Terminal UI](https://petrguan.github.io/claude-code-anatomy/terminal-ui) | React + Ink rendering pipeline for terminal interfaces |
| [Plugin & Skill System](https://petrguan.github.io/claude-code-anatomy/plugin-skill) | Extensible plugin architecture and skill marketplace |
| [Message Compaction](https://petrguan.github.io/claude-code-anatomy/message-compaction) | 4 strategies for managing context window limits |
| [Agent System](https://petrguan.github.io/claude-code-anatomy/agent-system) | Multi-agent coordination and task decomposition |

### Optional & Reference

| Page | Description |
|------|-------------|
| [IDE Bridge](https://petrguan.github.io/claude-code-anatomy/ide-bridge) | Real-time VS Code ↔ CLI communication |
| [MCP Integration](https://petrguan.github.io/claude-code-anatomy/mcp-integration) | Model Context Protocol for external tool connectivity |
| [Glossary](https://petrguan.github.io/claude-code-anatomy/glossary) | Key technical terms explained |
| [Easter Eggs](https://petrguan.github.io/claude-code-anatomy/easter-eggs) | Fun discoveries hiding in 512K lines of code |

All pages available in English and [中文](https://petrguan.github.io/claude-code-anatomy/zh/).

## Tech Stack

- **[Astro](https://astro.build/)** — Static site generator with zero-JS-by-default pages
- **[React](https://react.dev/)** — Interactive islands (hydrated on viewport entry)
- **[Tailwind CSS](https://tailwindcss.com/)** — Dark/light theme with CSS variables
- **[D3.js](https://d3js.org/)** — Architecture map and bubble chart visualizations
- **[Framer Motion](https://www.framer.com/motion/)** — Scroll-triggered animations
- **[Shiki](https://shiki.style/)** — Syntax highlighting (dark + light themes)
- **[Pagefind](https://pagefind.app/)** — Static full-text search

## Development

```bash
npm install
npm run dev        # Start dev server at localhost:4321
npm run build      # Build static site to dist/ (includes Pagefind indexing)
```

## License

MIT
