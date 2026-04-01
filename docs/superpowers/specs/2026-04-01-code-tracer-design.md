# CodeTracer Component Design Spec

## Overview

An interactive code step-through component that visualizes execution flow through Claude Code's query pipeline. Users click through a predefined call chain, seeing highlighted code at each step with annotations — like a visual debugger.

## Interaction Design

- **Left panel:** Code snippet with Shiki syntax highlighting, current execution line highlighted
- **Right panel:** Annotation explaining what the current step does
- **Clickable function names:** Purple underlined function references that jump to that function's step in the chain
- **Breadcrumb nav:** Shows the call stack (`query.ts` → `QueryEngine.ts` → `claude.ts` → ...), click to jump back
- **Step controls:** Previous / Next buttons at the bottom
- **Locale-aware:** All annotations and UI labels translated via `t()`

## Data Structure

```ts
interface TraceStep {
  id: string;
  file: string;           // e.g., "query.ts"
  title: string;          // Step title (translated)
  code: string;           // Code snippet for this step
  highlightLines: number[]; // Lines to highlight as "current execution"
  annotation: string;     // Right panel explanation (translated)
  clickableRefs: {        // Functions that can be clicked
    text: string;         // The function name in the code
    targetStep: string;   // ID of the step to jump to
  }[];
}
```

## Call Chain (6 steps)

1. **query.ts — submitMessage():** Entry point. Shows the async generator signature and the top-level flow
2. **query.ts — Context assembly:** buildSystemPrompt + normalizeMessages. Shows how context is gathered
3. **services/api/claude.ts — queryModelWithStreaming:** The API call. Shows streaming request setup
4. **services/tools/toolOrchestration.ts — runTools:** Tool scheduling. Shows the read-parallel/write-serial logic
5. **hooks/useCanUseTool.ts — canUseTool:** Permission check. Shows the three-layer evaluation
6. **query.ts — Recursive loop:** Back to submitMessage. Shows how the loop closes

## Placement

Replaces the static CodeBlock in the Query Pipeline page (`/query-pipeline`). The existing CodeBlock + annotations section becomes a CodeTracer component. On pages without CodeTracer, CodeBlock remains unchanged.

## Component

React island (`client:visible`). Single file `src/components/interactive/CodeTracer.tsx`. Accepts `locale` prop and a `steps` array. The steps data is defined in a new data file `src/data/traceSteps.ts`.

## What We Don't Do

- No dynamic code analysis — call chain is predefined
- No multiple call chains — only query pipeline
- No code search or arbitrary navigation
- No syntax-level parsing of clickable refs — we match by string position
