# Claude Code Anatomy - Design Spec

## 1. Project Overview

**Project Name**: `claude-code-anatomy`

**Purpose**: An interactive, visual website that provides an in-depth analysis of Anthropic's Claude Code CLI source code (~1,900 files, 512K+ lines of TypeScript). Designed to be accessible to both technical professionals and non-technical audiences through a layered approach.

**Tech Stack**: Astro + React Islands + Tailwind CSS + D3.js + Framer Motion + Shiki

**Deployment**: Static site on GitHub Pages

---

## 2. Content Architecture

### Page Structure

```
/                          - Homepage (narrative animation + architecture map)
/overview                  - Global architecture overview (scale, tech stack, module relationships)
/query-pipeline            - Query pipeline (complete journey from user input to AI response)
/tool-system               - Tool system (45+ tools: registration, scheduling, execution)
/permission-security       - Permission & security (three-layer defense design)
/terminal-ui               - Terminal UI rendering (advanced)
/plugin-skill              - Plugin & skill system (advanced)
/message-compaction        - Message compaction strategies (advanced)
/agent-system              - Agent system (advanced)
/ide-bridge                - IDE bridge (optional)
/mcp-integration           - MCP integration (optional)
```

### Content Priority

- **Core** (must-have): Overview, Query Pipeline, Tool System, Permission & Security
- **Advanced** (important): Terminal UI, Plugin/Skill, Message Compaction, Agent System
- **Optional** (nice-to-have): IDE Bridge, MCP Integration

### Unified Deep Page Structure

Each deep-dive page follows a consistent structure:

1. **Hero** - One sentence + one key number (e.g., "45 tools, 3 execution modes")
2. **Plain Language Explanation** - Analogy-based explanation for non-technical readers (~100 words)
3. **Architecture Overview** - Interactive flow/architecture diagram showing core design
4. **Deep Dive Analysis** - Code-level walkthrough, key design decisions, highlighted code snippets
5. **Design Highlights** - Noteworthy engineering practices worth learning
6. **Sidebar Navigation** - In-page table of contents for quick jumping

---

## 3. Homepage Design

### Zone 1 - Hero + Data Overview

- Title: "Anatomy of Claude Code" (解剖 Claude Code)
- Subtitle: Brief project description
- Animated key numbers: `1,902 files` / `512K lines of code` / `45+ tools` / `6 core systems`
- Dark background with subtle code-style particle effect (lightweight)

### Zone 2 - "Journey of a Conversation" (Scroll Narrative)

Scroll-triggered step-by-step animation telling a concrete scenario:

> "When you type 'help me fix this bug', what does Claude Code do behind the scenes?"

Steps (~5-6):
1. User input -> PromptInput component captures it
2. Permission system evaluates: is this operation safe?
3. System prompt construction: assembling context
4. API call: streaming to Claude
5. Tool invocation: Claude decides to read files, execute commands
6. Result return: streaming render to terminal

Each step:
- SVG + Framer Motion animation (no heavy 3D)
- "Learn more ->" link to the corresponding deep page

### Zone 3 - Interactive Architecture Map

- Global module topology graph, nodes = subsystems, edges = data flow/dependencies
- Hover: module summary + key numbers tooltip
- Click: navigate to deep page
- Modules grouped by layer:
  - Core layer (Query Pipeline, Tools, Permissions)
  - UI layer (Components, Ink, Hooks)
  - Extension layer (Plugins, Skills, MCP)
  - Integration layer (IDE Bridge, Remote)
- Color coding: core / advanced / optional modules

---

## 4. Interactive Visualization Components

### Lightweight (every page)

| Component | Description | Tech |
|-----------|-------------|------|
| `StatCard` | Animated number cards (e.g., "184 files, 50K lines") | React + Framer Motion |
| `CodeBlock` | Syntax-highlighted code with line highlights and annotations | Shiki |
| `LayerToggle` | "Plain / Technical" toggle to switch content depth | React |

### Medium (core pages)

| Component | Description | Tech |
|-----------|-------------|------|
| `FlowDiagram` | Interactive flow chart, clickable nodes expand details | D3.js |
| `ArchitectureMap` | Module topology with zoom/pan | D3.js |
| `TreeExplorer` | Expandable/collapsible tree for directory structures | React |
| `BubbleChart` | Module size comparison (area = lines of code) | D3.js |
| `TimelineScroll` | Homepage scroll-triggered narrative animation | Framer Motion + Intersection Observer |

### Heavy (explore mode)

| Component | Description | Tech |
|-----------|-------------|------|
| `CodeTracer` | Call chain tracer: click function name to follow execution | React + Shiki |
| `PermissionSimulator` | Input a command, watch three-layer defense evaluate it live | React + Framer Motion |
| `ToolOrchestrationDemo` | Visualize concurrent/serial tool scheduling with animation | React + D3.js |

---

## 5. Page-Specific Visualizations

### Core Pages

**Overview `/overview`**
- Module size bubble chart (area = LOC, color = category)
- File type distribution pie chart (.ts / .tsx / .js)
- Tech stack relationship diagram (Bun -> TypeScript -> React -> Ink -> Terminal)
- LayerToggle: "What is it like?" vs "What exactly is it?"

**Query Pipeline `/query-pipeline`**
- Core: Left-to-right message pipeline animation, message transforms at each stage
- CodeTracer: `query.ts` -> `QueryEngine.submitMessage()` -> API call -> tool execution
- Analogy: "Like ordering at a restaurant - you say something, the waiter (system prompt) translates it into a complete order the kitchen understands"

**Tool System `/tool-system`**
- Tool catalog card wall: 45+ tools by category, hover for summary
- ToolOrchestrationDemo: "3 read ops parallel -> 1 write op serial" scheduling animation
- Tool execution flow: input validation -> permission check -> execution -> hook trigger -> result
- Analogy: "Like a toolbox full of specialized tools, the AI picks which wrench to use"

**Permission & Security `/permission-security`**
- PermissionSimulator: User types a command, walks through three-layer judgment live
- Three-layer defense waterfall: ML classifier -> rule engine -> user confirmation
- Bash security AST visualization: show how a command is parsed and dangerous ops identified
- Analogy: "Like airport security - X-ray (AI judgment) -> security officer (rule matching) -> passenger confirmation (you)"

### Advanced Pages

**Terminal UI `/terminal-ui`**
- React-to-terminal rendering pipeline diagram
- Yoga layout illustration
- Ink reconciler vs DOM reconciler comparison

**Plugin System `/plugin-skill`**
- Plugin directory structure TreeExplorer
- Plugin loading flow diagram
- Lifecycle hook sequence diagram

**Message Compaction `/message-compaction`**
- 4-strategy comparison table + animated demos
- Context window "water level" visualization

**Agent System `/agent-system`**
- Main agent spawning sub-agents tree animation
- Task decomposition Gantt-chart-style visualization

---

## 6. Project File Structure

```
claude-code-anatomy/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
│
├── public/
│   └── fonts/
│
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro        # Global layout: navbar + sidebar + footer
│   │
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── overview.astro
│   │   ├── query-pipeline.astro
│   │   ├── tool-system.astro
│   │   ├── permission-security.astro
│   │   ├── terminal-ui.astro
│   │   ├── plugin-skill.astro
│   │   ├── message-compaction.astro
│   │   ├── agent-system.astro
│   │   ├── ide-bridge.astro
│   │   └── mcp-integration.astro
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.astro
│   │   │   ├── Sidebar.astro
│   │   │   └── Footer.astro
│   │   │
│   │   ├── common/
│   │   │   ├── StatCard.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── LayerToggle.tsx
│   │   │   └── SectionHeading.astro
│   │   │
│   │   ├── viz/
│   │   │   ├── FlowDiagram.tsx
│   │   │   ├── ArchitectureMap.tsx
│   │   │   ├── TreeExplorer.tsx
│   │   │   ├── BubbleChart.tsx
│   │   │   └── TimelineScroll.tsx
│   │   │
│   │   └── interactive/
│   │       ├── CodeTracer.tsx
│   │       ├── PermissionSimulator.tsx
│   │       └── ToolOrchestrationDemo.tsx
│   │
│   ├── data/
│   │   ├── modules.json            # Module info, scale, descriptions
│   │   ├── tools.json              # 45+ tool list and categories
│   │   ├── architecture.json       # Module dependency graph data
│   │   └── codeSnippets/           # Annotated key code snippets
│   │
│   └── styles/
│       └── global.css
```

### Key Technical Decisions

- **Astro pages**: Pure content in `.astro`, zero JS shipped
- **React islands**: Interactive components in `.tsx` with `client:visible` directive (hydrate on viewport entry)
- **Data-driven**: Module info, tool lists extracted as JSON, components read and render
- **Tailwind CSS**: Dark theme + unified design tokens
- **Static deployment**: `astro build` outputs pure static files for GitHub Pages

---

## 7. Visual Design System

### Color Palette (Dark Theme)

| Purpose | Value | Notes |
|---------|-------|-------|
| Background | `#0a0a0f` | Deep black, easy on eyes |
| Card/Panel | `#14141f` | Slightly raised, layered |
| Border | `#1e1e2e` | Low contrast divider |
| Body text | `#e0e0e8` | Soft white for extended reading |
| Secondary text | `#8888a0` | Gray-purple |
| Primary accent | `#6c63ff` | Purple, links/buttons/core nodes |
| Accent 1 | `#22d3ee` | Cyan, query pipeline |
| Accent 2 | `#f59e0b` | Amber, permission/security |
| Accent 3 | `#10b981` | Emerald, tool system |
| Danger/Warning | `#ef4444` | Red, permission denied etc. |

Each core module has its own theme color, consistent across architecture maps and pages.

### Typography

- Headings/UI: `Inter`
- Code/Data: `JetBrains Mono`
- Chinese body: System default (`-apple-system` fallback chain)

### Animation Principles

- Enter animation: `fade-up`, 200-300ms, for cards and sections
- Flow animation: `ease-in-out`, 400-600ms between nodes, clear causal rhythm
- Scroll trigger: Intersection Observer, threshold 0.3, each element triggers once only
- No gratuitous hover wobbles, persistent pulses, or decorative animations

### Responsive Breakpoints

- `>=1280px`: Full features, sidebar + main content
- `>=768px`: Sidebar collapses to hamburger menu, visualizations scale down
- `<768px`: Single column, complex interactive components show simplified version or static screenshot

---

## 8. Implementation Approach

### Phase 1 - Foundation
- Project scaffolding (Astro + React + Tailwind)
- Global layout (Navbar, Sidebar, Footer)
- Design system tokens and base styles
- Common components (StatCard, CodeBlock, LayerToggle)

### Phase 2 - Homepage
- Hero section with animated stats
- Scroll narrative "Journey of a Conversation"
- Interactive architecture map

### Phase 3 - Core Pages
- Overview page with bubble chart and tech stack diagram
- Query Pipeline with FlowDiagram and CodeTracer
- Tool System with card wall and orchestration demo
- Permission & Security with simulator

### Phase 4 - Advanced Pages
- Terminal UI
- Plugin & Skill System
- Message Compaction
- Agent System

### Phase 5 - Polish & Deploy
- Responsive optimization
- Performance audit (Lighthouse)
- GitHub Pages deployment
- Optional pages (IDE Bridge, MCP)

---

## 9. Data Extraction Strategy

Source data will be pre-extracted from the claude-code source into JSON files:

- **modules.json**: Each module's name, path, file count, line count, description (CN + EN), category, theme color
- **tools.json**: Each tool's name, category, description, key files, input schema summary
- **architecture.json**: Nodes (modules) and edges (dependencies/data flow) for D3 graph rendering
- **codeSnippets/**: Key annotated code snippets (e.g., QueryEngine.submitMessage, tool orchestration logic, permission evaluation) with inline comments explaining each section
