import type { Locale } from "../i18n/locales";
import { t } from "../i18n/translations";

export interface ClickableRef {
  text: string;
  targetStep: string;
}

export interface TraceStep {
  id: string;
  file: string;
  title: string;
  code: string;
  highlightLines: number[];
  annotation: string;
  clickableRefs: ClickableRef[];
}

export function getTraceSteps(locale: Locale): TraceStep[] {
  return [
    {
      id: "submit-message",
      file: "src/query.ts",
      title: t(locale, "codeTracer.step1Title"),
      code: `// src/query.ts — The core conversation loop
async function* submitMessage(
  prompt: string,
  deps: QueryDeps
): AsyncGenerator<MessageUpdate> {
  // Assemble full context for Claude
  const systemPrompt = buildSystemPrompt(deps);
  const messages = normalizeMessages(deps.messages, prompt);

  // Stream response from API
  const stream = queryModelWithStreaming({
    model: deps.model,
    system: systemPrompt,
    messages,
    tools: deps.tools,
  });

  for await (const event of stream) {
    yield processStreamEvent(event);
  }

  // If Claude called tools, execute them and loop
  if (hasToolUse(response)) {
    yield* runTools(response.toolUses, deps);
    yield* submitMessage("", deps);  // ← recursive
  }
}`,
      highlightLines: [2, 3, 4, 5],
      annotation: t(locale, "codeTracer.step1Annotation"),
      clickableRefs: [
        { text: "buildSystemPrompt", targetStep: "context-assembly" },
        { text: "normalizeMessages", targetStep: "context-assembly" },
        { text: "queryModelWithStreaming", targetStep: "api-call" },
        { text: "runTools", targetStep: "tool-orchestration" },
      ],
    },
    {
      id: "context-assembly",
      file: "src/query.ts",
      title: t(locale, "codeTracer.step2Title"),
      code: `// src/query.ts — Building the full prompt context
function buildSystemPrompt(deps: QueryDeps): string {
  const parts = [
    getDefaultSystemPrompt(),     // Identity & behavior
    getUserEnvironment(),          // OS, shell, cwd, git
    getToolDefinitions(deps.tools), // 45+ tool schemas
    getProjectRules(),             // CLAUDE.md rules
    getMemoryAttachments(),        // Prior conversation memory
  ];
  return parts.join("\\n\\n");
}

function normalizeMessages(
  history: Message[],
  prompt: string
): NormalizedMessage[] {
  // Create user message, inject memory attachments,
  // filter permission-restricted content, deduplicate
  return [...history, createUserMessage(prompt)]
    .map(injectAttachments)
    .filter(checkPermissions);
}`,
      highlightLines: [2, 3],
      annotation: t(locale, "codeTracer.step2Annotation"),
      clickableRefs: [
        { text: "getToolDefinitions", targetStep: "tool-orchestration" },
      ],
    },
    {
      id: "api-call",
      file: "src/services/api/claude.ts",
      title: t(locale, "codeTracer.step3Title"),
      code: `// src/services/api/claude.ts — Streaming API request
async function* queryModelWithStreaming({
  model, system, messages, tools
}: QueryParams): AsyncGenerator<StreamEvent> {
  const response = await anthropic.messages.create({
    model,
    system,
    messages,
    tools: tools.map(toAPISchema),
    stream: true,              // ← key: streaming mode
    max_tokens: tokenBudget,
  });

  // Yield events as they arrive from the API
  for await (const event of response) {
    if (event.type === "content_block_delta") {
      yield { type: "token", text: event.delta.text };
    }
    if (event.type === "content_block_start"
        && event.content_block.type === "tool_use") {
      yield { type: "tool_call", tool: event.content_block };
    }
  }
}`,
      highlightLines: [5, 6, 7, 8, 9, 10, 11, 12],
      annotation: t(locale, "codeTracer.step3Annotation"),
      clickableRefs: [],
    },
    {
      id: "tool-orchestration",
      file: "src/services/tools/toolOrchestration.ts",
      title: t(locale, "codeTracer.step4Title"),
      code: `// src/services/tools/toolOrchestration.ts
async function* runTools(
  toolUses: ToolUseBlock[],
  context: ToolUseContext
): AsyncGenerator<ToolResult> {
  const batches = partitionToolCalls(toolUses);

  for (const batch of batches) {
    if (batch.type === "read-only") {
      // Safe to parallelize — no conflicts
      const results = await Promise.all(
        batch.tools.map(tool =>
          canUseTool(tool, context).then(ok =>
            ok ? executeTool(tool, context) : denied(tool)
          )
        )
      );
      for (const result of results) yield result;
    } else {
      // Write tools: one at a time
      for (const tool of batch.tools) {
        const ok = await canUseTool(tool, context);
        if (ok) yield await executeTool(tool, context);
      }
    }
  }
}`,
      highlightLines: [6],
      annotation: t(locale, "codeTracer.step4Annotation"),
      clickableRefs: [
        { text: "canUseTool", targetStep: "permission-check" },
      ],
    },
    {
      id: "permission-check",
      file: "src/hooks/useCanUseTool.ts",
      title: t(locale, "codeTracer.step5Title"),
      code: `// src/hooks/useCanUseTool.ts — Three-layer defense
async function canUseTool(
  tool: Tool,
  input: ToolInput
): Promise<PermissionResult> {
  // Layer 1: ML Classifier (fast, ~80% of cases)
  const prediction = await classifyWithML(tool, input);
  if (prediction.confidence > 0.95) {
    return prediction.decision;
  }

  // Layer 2: Rule Engine (user-defined patterns)
  const ruleResult = matchRules(tool, input, userRules);
  if (ruleResult !== "no-match") {
    return ruleResult;
  }

  // Layer 3: User Confirmation (last resort)
  return await showPermissionDialog(tool, input);
}`,
      highlightLines: [7, 8, 9],
      annotation: t(locale, "codeTracer.step5Annotation"),
      clickableRefs: [],
    },
    {
      id: "recursive-loop",
      file: "src/query.ts",
      title: t(locale, "codeTracer.step6Title"),
      code: `// src/query.ts — The loop closes
async function* submitMessage(
  prompt: string,
  deps: QueryDeps
): AsyncGenerator<MessageUpdate> {
  // ... (context assembly, API call, stream processing)

  // After tool execution, results are in the history
  if (hasToolUse(response)) {
    // Execute all requested tools
    yield* runTools(response.toolUses, deps);

    // Loop back: Claude sees tool results, decides next
    yield* submitMessage("", deps);
    //      ↑ recursive call — the cycle continues
    //        until stop_reason === "end_turn"
  }
  // When no more tool calls → conversation turn complete
}`,
      highlightLines: [13, 14, 15, 16],
      annotation: t(locale, "codeTracer.step6Annotation"),
      clickableRefs: [
        { text: "runTools", targetStep: "tool-orchestration" },
        { text: "submitMessage", targetStep: "submit-message" },
      ],
    },
  ];
}
