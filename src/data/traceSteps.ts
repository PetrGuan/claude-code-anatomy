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

export type ChainId = "query-pipeline" | "tool-system" | "permission-security";

export function getTraceSteps(locale: Locale, chain: ChainId = "query-pipeline"): TraceStep[] {
  switch (chain) {
    case "query-pipeline": return getQueryPipelineSteps(locale);
    case "tool-system": return getToolSystemSteps(locale);
    case "permission-security": return getPermissionSecuritySteps(locale);
  }
}

function getQueryPipelineSteps(locale: Locale): TraceStep[] {
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

function getToolSystemSteps(locale: Locale): TraceStep[] {
  return [
    {
      id: "ts-registration",
      file: "src/tools.ts",
      title: t(locale, "codeTracer.tsStep1Title"),
      code: `// src/tools.ts — Tool registration with feature gates
export function getAllBaseTools(): Tool[] {
  return [
    // File system tools (always enabled)
    new ReadTool(),
    new WriteTool(),
    new EditTool(),
    new GlobTool(),
    new GrepTool(),

    // Bash execution
    new BashTool(),

    // Feature-gated tools
    ...(feature("notebooks") ? [new NotebookEditTool()] : []),
    ...(feature("mcp")       ? [new McpTool()]          : []),

    // Internal-only tools (runtime check)
    ...(process.env.USER_TYPE === "internal"
      ? [new DebugTool(), new ProfileTool()]
      : []),
  ];
}`,
      highlightLines: [2, 3],
      annotation: t(locale, "codeTracer.tsStep1Annotation"),
      clickableRefs: [],
    },
    {
      id: "ts-partition",
      file: "src/services/tools/toolOrchestration.ts",
      title: t(locale, "codeTracer.tsStep2Title"),
      code: `// src/services/tools/toolOrchestration.ts — Batch partitioning
function partitionToolCalls(
  toolUses: ToolUseBlock[]
): ToolBatch[] {
  return toolUses.reduce<ToolBatch[]>((batches, toolUse) => {
    const safe = isConcurrencySafe(toolUse);
    const last = batches[batches.length - 1];

    if (last && last.concurrent && safe) {
      // Extend current concurrent batch
      last.tools.push(toolUse);
    } else {
      // Start a new batch
      batches.push({
        concurrent: safe,
        tools: [toolUse],
      });
    }
    return batches;
  }, []);
}`,
      highlightLines: [5, 6],
      annotation: t(locale, "codeTracer.tsStep2Annotation"),
      clickableRefs: [
        { text: "isConcurrencySafe", targetStep: "ts-safety" },
      ],
    },
    {
      id: "ts-safety",
      file: "src/Tool.ts",
      title: t(locale, "codeTracer.tsStep3Title"),
      code: `// src/Tool.ts — Key methods on the Tool interface
export interface Tool {
  name: string;
  description: string;
  inputSchema: ZodSchema;

  // Scheduling hints
  isReadOnly(): boolean;
  isConcurrencySafe(): boolean {
    try {
      return this.isReadOnly();
    } catch {
      return false; // defensive: treat errors as unsafe
    }
  }

  // Execution
  call(input: ToolInput, context: ToolUseContext): Promise<ToolResult>;

  // Validation
  validateInput(input: unknown): ToolInput;
}`,
      highlightLines: [8, 9],
      annotation: t(locale, "codeTracer.tsStep3Annotation"),
      clickableRefs: [
        { text: "call", targetStep: "ts-execution" },
      ],
    },
    {
      id: "ts-execution",
      file: "src/services/tools/toolOrchestration.ts",
      title: t(locale, "codeTracer.tsStep4Title"),
      code: `// src/services/tools/toolOrchestration.ts — Execution loop
async function* runTools(
  toolUses: ToolUseBlock[],
  context: ToolUseContext
): AsyncGenerator<ToolResult> {
  const batches = partitionToolCalls(toolUses);

  for (const batch of batches) {
    if (batch.concurrent) {
      // Safe batch: run all in parallel
      const results = await Promise.all(
        batch.tools.map(t => executeSingleTool(t, context))
      );
      for (const result of results) yield result;
    } else {
      // Unsafe batch: run one at a time
      for (const tool of batch.tools) {
        // canUseTool → permission chain
        const ok = await canUseTool(tool, context);
        if (ok) yield await executeSingleTool(tool, context);
        else   yield denied(tool);
      }
    }
  }
}`,
      highlightLines: [9, 10, 11, 17, 18],
      annotation: t(locale, "codeTracer.tsStep4Annotation"),
      clickableRefs: [],
    },
    {
      id: "ts-result",
      file: "src/services/tools/toolOrchestration.ts",
      title: t(locale, "codeTracer.tsStep5Title"),
      code: `// src/services/tools/toolOrchestration.ts — Result shape
interface ToolResult {
  type: "tool_result";
  tool_use_id: string;
  content: string | ContentBlock[];
  is_error?: boolean;
}

async function executeSingleTool(
  toolUse: ToolUseBlock,
  context: ToolUseContext
): Promise<ToolResult> {
  const tool = context.tools.find(t => t.name === toolUse.name);
  const input = tool.validateInput(toolUse.input);

  const result = await tool.call(input, context);

  // Result flows back to the query loop as a
  // tool_result message for Claude's next turn
  return {
    type: "tool_result",
    tool_use_id: toolUse.id,
    content: result.content,
    is_error: result.isError,
  };
}`,
      highlightLines: [16, 17, 18],
      annotation: t(locale, "codeTracer.tsStep5Annotation"),
      clickableRefs: [],
    },
  ];
}

function getPermissionSecuritySteps(locale: Locale): TraceStep[] {
  return [
    {
      id: "ps-entry",
      file: "src/permissions.ts",
      title: t(locale, "codeTracer.psStep1Title"),
      code: `// src/permissions.ts — Permission entry point
export async function hasPermissionsToUseTool(
  tool: Tool,
  input: ToolInput,
  context: PermissionContext
): Promise<PermissionDecision> {
  const decision = await hasPermissionsToUseToolInner(
    tool, input, context
  );

  // Track consecutive denials for safety monitoring
  if (decision.allowed) {
    consecutiveDenials = 0;
  } else {
    consecutiveDenials++;
  }

  // In 'dontAsk' mode, convert 'ask' to 'deny'
  if (context.permissionMode === "dontAsk"
      && decision.behavior === "ask") {
    return { allowed: false, reason: "dontAsk" };
  }

  return decision;
}`,
      highlightLines: [2, 3, 4, 5, 6],
      annotation: t(locale, "codeTracer.psStep1Annotation"),
      clickableRefs: [
        { text: "hasPermissionsToUseToolInner", targetStep: "ps-routing" },
      ],
    },
    {
      id: "ps-routing",
      file: "src/permissions.ts",
      title: t(locale, "codeTracer.psStep2Title"),
      code: `// src/permissions.ts — Mode-based routing
async function hasPermissionsToUseToolInner(
  tool: Tool,
  input: ToolInput,
  context: PermissionContext
): Promise<PermissionDecision> {
  switch (context.permissionMode) {
    case "bypassPermissions":
      return { allowed: true };       // allow everything

    case "plan":
      if (!tool.isReadOnly()) return deny("plan mode");
      return { allowed: true };       // read-only in plan

    case "auto":
      return classifyBashCommand(tool, input);

    case "default":
    case "acceptEdits": {
      const rule = matchRules(tool, input, context.rules);
      if (rule) return rule;          // explicit allow/deny
      return { behavior: "ask" };     // fall through to dialog
    }

    case "dontAsk":
      return deny("dontAsk");
  }
}`,
      highlightLines: [7, 8],
      annotation: t(locale, "codeTracer.psStep2Annotation"),
      clickableRefs: [
        { text: "classifyBashCommand", targetStep: "ps-classifier" },
        { text: "matchRules", targetStep: "ps-rules" },
      ],
    },
    {
      id: "ps-classifier",
      file: "src/utils/permissions/bashClassifier.ts",
      title: t(locale, "codeTracer.psStep3Title"),
      code: `// src/utils/permissions/bashClassifier.ts — ML classifier
interface ClassifierResult {
  decision: "allow" | "deny" | "ask";
  confidence: "high" | "medium" | "low";
  reason?: string;
}

export async function classifyBashCommand(
  tool: Tool,
  input: ToolInput
): Promise<ClassifierResult> {
  // In the open-source build, this is a stub:
  // the ML model is internal to Anthropic.
  if (!classifierAvailable()) {
    return { decision: "ask", confidence: "low" };
  }

  const prediction = await mlClassifier.predict(
    tool.name,
    input.command ?? ""
  );

  return {
    decision: prediction.label,
    confidence: prediction.confidence,
  };
}`,
      highlightLines: [8, 9, 10, 11],
      annotation: t(locale, "codeTracer.psStep3Annotation"),
      clickableRefs: [],
    },
    {
      id: "ps-rules",
      file: "src/utils/permissions/shellRuleMatching.ts",
      title: t(locale, "codeTracer.psStep4Title"),
      code: "// src/utils/permissions/shellRuleMatching.ts\n" +
"export function matchWildcardPattern(\n" +
"  pattern: string,\n" +
"  command: string\n" +
"): boolean {\n" +
"  // Convert wildcard pattern to regex\n" +
'  // "git *"  \u2192 /^git .*$/\n' +
'  // "npm\\\\*" \u2192 /^npm\\*$/  (escaped literal)\n' +
"  const escaped = pattern\n" +
'    .replace(/([.+^${}()|[\\\\]\\\\\\\\])/g, "\\\\\\\\$1")\n' +
'    .replace(/(?<!\\\\\\\\)\\\\*/g, ".*");\n' +
"\n" +
'  // Trailing " *" becomes optional \u2014 "git *" matches "git"\n' +
"  const regex = toRegex(escaped);\n" +
"  return regex.test(command);\n" +
"}\n" +
"\n" +
"export function matchRules(\n" +
"  tool: Tool,\n" +
"  input: ToolInput,\n" +
"  rules: PermissionRule[]\n" +
"): PermissionDecision | null {\n" +
"  for (const rule of rules) {\n" +
"    if (matchWildcardPattern(rule.pattern, input.command)) {\n" +
'      return { allowed: rule.type === "allow" };\n' +
"    }\n" +
"  }\n" +
"  return null; // no rule matched\n" +
"}",
      highlightLines: [2, 3, 4, 5],
      annotation: t(locale, "codeTracer.psStep4Annotation"),
      clickableRefs: [],
    },
    {
      id: "ps-dialog",
      file: "src/permissions.ts",
      title: t(locale, "codeTracer.psStep5Title"),
      code: `// src/permissions.ts — User dialog fallback
async function showPermissionDialog(
  tool: Tool,
  input: ToolInput,
  context: PermissionContext
): Promise<PermissionDecision> {
  // Display the exact command to the user
  const userChoice = await context.showConfirmation({
    tool: tool.name,
    command: input.command,
    options: [
      "allow_once",        // allow this specific invocation
      "always_allow",      // save pattern as a rule
      "deny",              // block this invocation
    ],
  });

  // If user chose "always_allow", persist as a new rule
  if (userChoice === "always_allow") {
    await saveRule({
      type: "allow",
      pattern: inferPattern(tool, input),
    });
  }

  return {
    allowed: userChoice !== "deny",
    persisted: userChoice === "always_allow",
  };
}`,
      highlightLines: [8, 9, 10],
      annotation: t(locale, "codeTracer.psStep5Annotation"),
      clickableRefs: [],
    },
  ];
}
