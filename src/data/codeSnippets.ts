import type { Locale } from "../i18n/locales";

export interface CodeSnippet {
  id: string;
  title: string;
  titleCn: string;
  language: string;
  code: string;
  highlights?: number[];
  annotations?: Record<number, string>;
  annotationsCn?: Record<number, string>;
}

export const snippets: Record<string, CodeSnippet> = {
  queryLoop: {
    id: "queryLoop",
    title: "The Core Query Loop",
    titleCn: "核心查询循环",
    language: "typescript",
    code: `// Simplified from src/query.ts
async function* submitMessage(
  prompt: string,
  deps: QueryDeps
): AsyncGenerator<MessageUpdate> {
  // 1. Build system prompt with context
  const systemPrompt = buildSystemPrompt(deps);

  // 2. Normalize and append user message
  const messages = normalizeMessages(deps.messages, prompt);

  // 3. Stream response from Claude API
  const stream = queryModelWithStreaming({
    model: deps.model,
    system: systemPrompt,
    messages,
    tools: deps.tools,
  });

  // 4. Process streamed response
  for await (const event of stream) {
    yield processStreamEvent(event);
  }

  // 5. Execute any tool calls
  if (hasToolUse(response)) {
    yield* runTools(response.toolUses, deps);
    // 6. Loop back for next turn
    yield* submitMessage("", deps);
  }
}`,
    highlights: [7, 10, 14, 21, 25],
    annotations: {
      7: "Assemble full context: git info, file state, tool definitions",
      14: "Streaming via Anthropic API — responses arrive token by token",
      25: "Recursive: after tool execution, loop back for Claude's next response",
    },
    annotationsCn: {
      7: "组装完整上下文：git 信息、文件状态、工具定义",
      14: "通过 Anthropic API 流式传输 — 响应逐 token 到达",
      25: "递归：工具执行后，循环回来获取 Claude 的下一个响应",
    },
  },
  toolOrchestration: {
    id: "toolOrchestration",
    title: "Tool Orchestration: Concurrent Read, Serial Write",
    titleCn: "工具调度：读并行，写串行",
    language: "typescript",
    code: `// Simplified from src/services/tools/toolOrchestration.ts
async function* runTools(
  toolUses: ToolUseBlock[],
  context: ToolUseContext
): AsyncGenerator<ToolResult> {
  // Partition into read-only and write batches
  const batches = partitionToolCalls(toolUses);

  for (const batch of batches) {
    if (batch.type === "read-only") {
      // Run all read-only tools in parallel
      const results = await Promise.all(
        batch.tools.map(tool => executeTool(tool, context))
      );
      for (const result of results) yield result;
    } else {
      // Run write tools one at a time
      for (const tool of batch.tools) {
        yield await executeTool(tool, context);
      }
    }
  }
}`,
    highlights: [7, 12, 18],
    annotations: {
      7: "Split tool calls: Glob+Grep+Read run together, Write+Edit run one by one",
      12: "Safe to parallelize — read ops don't conflict with each other",
      18: "Serial execution prevents race conditions on file writes",
    },
    annotationsCn: {
      7: "分割工具调用：Glob+Grep+Read 一起运行，Write+Edit 逐个运行",
      12: "可以安全并行 — 读操作之间不会冲突",
      18: "串行执行防止文件写入的竞态条件",
    },
  },
  permissionCheck: {
    id: "permissionCheck",
    title: "Three-Layer Permission Check",
    titleCn: "三层权限检查",
    language: "typescript",
    code: `// Simplified from src/hooks/useCanUseTool.ts
async function canUseTool(
  tool: Tool,
  input: ToolInput
): Promise<PermissionResult> {
  // Layer 1: ML Classifier — fast probabilistic check
  const prediction = await classifyWithML(tool, input);
  if (prediction.confidence > 0.95) {
    return prediction.decision; // High confidence → skip rules
  }

  // Layer 2: Rule Engine — pattern matching
  const ruleResult = matchRules(tool, input, userRules);
  if (ruleResult !== "no-match") {
    return ruleResult; // "allow" or "deny"
  }

  // Layer 3: User Confirmation — ask the human
  return await showPermissionDialog(tool, input);
}`,
    highlights: [7, 13, 18],
    annotations: {
      7: "ML model predicts if this action is safe — handles ~80% of cases instantly",
      13: "User-defined rules: 'always allow git commands', 'deny rm -rf', etc.",
      18: "Last resort: show the user what's about to happen and let them decide",
    },
    annotationsCn: {
      7: "ML 模型预测此操作是否安全 — 处理约 80% 的情况",
      13: "用户定义规则：'总是允许 git 命令'、'禁止 rm -rf' 等",
      18: "最后手段：向用户展示即将执行的操作，让用户决定",
    },
  },
  asyncGenerator: {
    id: "asyncGenerator",
    title: "Async Generators for Streaming",
    titleCn: "异步生成器实现流式处理",
    language: "typescript",
    code: `// The pattern used everywhere in Claude Code
async function* processStream(): AsyncGenerator<Update> {
  // Yield updates as they arrive — don't buffer
  for await (const chunk of apiStream) {
    yield { type: "token", text: chunk.text };
  }

  // Caller consumes with for-await-of
  // UI updates incrementally, memory stays flat
}

// Usage in REPL:
for await (const update of submitMessage(prompt)) {
  renderToTerminal(update); // Each token appears immediately
}`,
    highlights: [3, 4, 13],
    annotations: {
      3: "Async generators are the backbone of Claude Code's streaming architecture",
      13: "for-await-of: the consumer pulls updates one at a time, naturally backpressure-aware",
    },
  },
};

export function snippetTitle(snippet: CodeSnippet, locale: Locale): string {
  return locale === "zh" ? snippet.titleCn : snippet.title;
}

export function snippetAnnotations(snippet: CodeSnippet, locale: Locale): Record<number, string> | undefined {
  if (!snippet.annotations) return undefined;
  return locale === "zh" ? (snippet.annotationsCn ?? snippet.annotations) : snippet.annotations;
}
