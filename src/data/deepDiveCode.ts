export const deepDiveSnippets = {
  toolInterface: `// src/Tool.ts — Lines 362-405
export type Tool<
  Input extends AnyObject = AnyObject,
  Output = unknown,
  P extends ToolProgressData = ToolProgressData,
> = {
  aliases?: string[]
  searchHint?: string
  call(
    args: z.infer<Input>,
    context: ToolUseContext,
    canUseTool: CanUseToolFn,
    parentMessage: AssistantMessage,
    onProgress?: ToolCallProgress<P>,
  ): Promise<ToolResult<Output>>
  readonly inputSchema: Input
  readonly inputJSONSchema?: ToolInputJSONSchema
  isConcurrencySafe(input: z.infer<Input>): boolean
  isEnabled(): boolean
  isReadOnly(input: z.infer<Input>): boolean
  isDestructive?(input: z.infer<Input>): boolean
}`,

  submitMessage: `// src/QueryEngine.ts — Lines 209-236
async *submitMessage(
  prompt: string | ContentBlockParam[],
  options?: { uuid?: string; isMeta?: boolean },
): AsyncGenerator<SDKMessage, void, unknown> {
  const {
    cwd, commands, tools, mcpClients,
    verbose = false, thinkingConfig,
    maxTurns, maxBudgetUsd, taskBudget,
    canUseTool, customSystemPrompt,
    appendSystemPrompt, userSpecifiedModel,
    fallbackModel, jsonSchema,
    getAppState, setAppState,
    replayUserMessages = false,
    includePartialMessages = false,
    agents = [], setSDKStatus,
    orphanedPermission,
  } = this.config
  // All 25+ config options shown above
}`,

  systemPrompt: `// src/utils/systemPrompt.ts — Lines 41-75
export function buildEffectiveSystemPrompt({
  mainThreadAgentDefinition,
  toolUseContext,
  customSystemPrompt,
  defaultSystemPrompt,
  appendSystemPrompt,
  overrideSystemPrompt,
}: { /* typed params */ }): SystemPrompt {
  // Priority hierarchy:
  if (overrideSystemPrompt) {
    return asSystemPrompt([overrideSystemPrompt])
  }
  if (feature('COORDINATOR_MODE') && isCoordinator) {
    return asSystemPrompt([getCoordinatorSystemPrompt()])
  }
  if (mainThreadAgentDefinition?.systemPrompt) {
    return asSystemPrompt([agentPrompt, ...append])
  }
  // Default: combine all layers
  return asSystemPrompt([
    ...defaultSystemPrompt,
    ...(customSystemPrompt ? [customSystemPrompt] : []),
    ...(appendSystemPrompt ? [appendSystemPrompt] : []),
  ])
}`,

  toolRegistry: `// src/tools.ts — Lines 193-240
export function getAllBaseTools(): Tools {
  return [
    AgentTool, TaskOutputTool, BashTool,
    ...(hasEmbeddedSearchTools() ? [] : [GlobTool, GrepTool]),
    FileReadTool, FileEditTool, FileWriteTool,
    NotebookEditTool, WebFetchTool, WebSearchTool,
    SkillTool, AskUserQuestionTool,
    // Feature-gated tools:
    ...(process.env.USER_TYPE === 'ant'
      ? [ConfigTool, TungstenTool] : []),
    ...(isTodoV2Enabled()
      ? [TaskCreateTool, TaskGetTool, TaskUpdateTool]
      : []),
    ...(feature('AGENT_TRIGGERS')
      ? [CronCreateTool, CronDeleteTool, CronListTool]
      : []),
    // MCP tools always included:
    ListMcpResourcesTool, ReadMcpResourceTool,
  ]
}`,

  partitioning: `// src/services/tools/toolOrchestration.ts — Lines 84-116
function partitionToolCalls(
  toolUseMessages: ToolUseBlock[],
  toolUseContext: ToolUseContext,
): Batch[] {
  return toolUseMessages.reduce((acc: Batch[], toolUse) => {
    const tool = findToolByName(
      toolUseContext.options.tools, toolUse.name
    )
    const parsedInput = tool?.inputSchema.safeParse(toolUse.input)
    const isConcurrencySafe = parsedInput?.success
      ? (() => {
          try {
            return Boolean(tool?.isConcurrencySafe(parsedInput.data))
          } catch {
            return false  // defensive: treat errors as non-safe
          }
        })()
      : false
    // Accumulate consecutive safe calls into one batch
    if (isConcurrencySafe && acc[acc.length - 1]?.isConcurrencySafe) {
      acc[acc.length - 1]!.blocks.push(toolUse)
    } else {
      acc.push({ isConcurrencySafe, blocks: [toolUse] })
    }
    return acc
  }, [])
}`,

  permissionMode: `// src/types/permissions.ts — Lines 14-38
export const EXTERNAL_PERMISSION_MODES = [
  'acceptEdits',     // Auto-allow edits, ask for shell
  'bypassPermissions', // Allow everything (dangerous!)
  'default',         // Show confirmation dialogs
  'dontAsk',         // Silently deny prompts
  'plan',            // Read-only mode
] as const

export type ExternalPermissionMode =
  (typeof EXTERNAL_PERMISSION_MODES)[number]

// Internal-only modes (not exposed to users)
export type InternalPermissionMode =
  | ExternalPermissionMode
  | 'auto'    // ML classifier decides (ant-only)
  | 'bubble'  // Delegate to parent agent`,

  ruleMatching: `// src/utils/permissions/shellRuleMatching.ts — Lines 90-140
export function matchWildcardPattern(
  pattern: string,
  command: string,
  caseInsensitive = false,
): boolean {
  const trimmedPattern = pattern.trim()
  let processed = ''
  let i = 0
  while (i < trimmedPattern.length) {
    if (trimmedPattern[i] === '\\\\' && trimmedPattern[i+1] === '*') {
      processed += ESCAPED_STAR_PLACEHOLDER  // \\* → literal *
      i += 2; continue
    }
    processed += trimmedPattern[i]; i++
  }
  // Convert * → .* for wildcard, escape regex specials
  const escaped = processed.replace(/[.+?^${}()|[\\]\\\\'"]/g, '\\\\$&')
  let regexPattern = escaped.replace(/\\*/g, '.*')
  // "git *" matches both "git" and "git commit"
  const singleWildcard = (processed.match(/\\*/g) || []).length === 1
  if (regexPattern.endsWith(' .*') && singleWildcard) {
    regexPattern = regexPattern.slice(0, -3) + '( .*)?'
  }
  return new RegExp(\`^\${regexPattern}$\`, flags).test(command)
}`,
};
