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
  const escaped = processed.replace(/[.+?^$\\{\\}()|[\\]'"]/g, '\\\\$&')
  let regexPattern = escaped.replace(/\\*/g, '.*')
  // "git *" matches both "git" and "git commit"
  const singleWildcard = (processed.match(/\\*/g) || []).length === 1
  if (regexPattern.endsWith(' .*') && singleWildcard) {
    regexPattern = regexPattern.slice(0, -3) + '( .*)?'
  }
  const regex = new RegExp('^' + regexPattern + '$', flags)
  return regex.test(command)
}`,

  inkReconciler: `// src/ink/reconciler.ts — Lines 331-400
createInstance(
  originalType: ElementNames,
  newProps: Props,
  _root: DOMElement,
  hostContext: HostContext,
): DOMElement {
  if (hostContext.isInsideText && originalType === 'ink-box') {
    throw new Error("<Box> can't be nested inside <Text>")
  }
  const type = originalType === 'ink-text' && hostContext.isInsideText
    ? 'ink-virtual-text' : originalType
  const node = createNode(type)
  for (const [key, value] of Object.entries(newProps)) {
    applyProp(node, key, value)
  }
  return node
},

commitUpdate(node, _type, oldProps, newProps): void {
  const props = diff(oldProps, newProps)
  const style = diff(oldProps['style'], newProps['style'])
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key === 'style') { setStyle(node, value); continue }
      if (EVENT_HANDLER_PROPS.has(key)) { setEventHandler(node, key, value); continue }
      setAttribute(node, key, value)
    }
  }
  if (style && node.yogaNode) {
    applyStyles(node.yogaNode, style, newProps['style'])
  }
}`,

  yogaLayout: `// src/ink/layout/yoga.ts — Lines 54-96
export class YogaLayoutNode implements LayoutNode {
  readonly yoga: YogaNode

  constructor(yoga: YogaNode) {
    this.yoga = yoga
  }

  setFlexDirection(dir: LayoutFlexDirection): void {
    const map = {
      row: FlexDirection.Row,
      'row-reverse': FlexDirection.RowReverse,
      column: FlexDirection.Column,
      'column-reverse': FlexDirection.ColumnReverse,
    }
    this.yoga.setFlexDirection(map[dir]!)
  }

  setJustifyContent(justify: LayoutJustify): void {
    const map = {
      'flex-start': Justify.FlexStart,
      center: Justify.Center,
      'flex-end': Justify.FlexEnd,
      'space-between': Justify.SpaceBetween,
      'space-around': Justify.SpaceAround,
    }
    this.yoga.setJustifyContent(map[justify]!)
  }

  calculateLayout(width?: number): void {
    this.yoga.calculateLayout(width, undefined, Direction.LTR)
  }
}`,

  ansiRender: `// src/ink/render-node-to-output.ts — Lines 387-440
function renderNodeToOutput(
  node: DOMElement,
  output: Output,
  { offsetX = 0, offsetY = 0, prevScreen, skipSelfBlit = false }
): void {
  const { yogaNode } = node
  if (!yogaNode) return
  if (yogaNode.getDisplay() === LayoutDisplay.None) return

  // Positions are relative to parent — accumulate offsets
  const x = offsetX + yogaNode.getComputedLeft()
  const y = offsetY + yogaNode.getComputedTop()
  const width = yogaNode.getComputedWidth()
  const height = yogaNode.getComputedHeight()

  // Cache check: skip unchanged subtrees (blit from prev screen)
  const cached = nodeCache.get(node)
  if (!node.dirty && cached
    && cached.x === x && cached.y === y
    && cached.width === width && cached.height === height
    && prevScreen) {
    output.blit(prevScreen, Math.floor(x), Math.floor(y),
      Math.floor(width), Math.floor(height))
    return
  }

  // Render this node's content at computed position
  renderContent(node, output, x, y, width, height)

  // Recurse into children
  for (const child of node.childNodes) {
    renderNodeToOutput(child, output, { offsetX: x, offsetY: y, prevScreen })
  }
}`,

  eventDispatcher: `// src/ink/events/dispatcher.ts — Lines 46-114
// Collect listeners: capture (root→target) then bubble (target→root)
function collectListeners(
  target: EventTarget,
  event: TerminalEvent,
): DispatchListener[] {
  const listeners: DispatchListener[] = []
  let node: EventTarget | undefined = target

  while (node) {
    const isTarget = node === target
    const captureHandler = getHandler(node, event.type, true)
    const bubbleHandler = getHandler(node, event.type, false)

    if (captureHandler) {
      listeners.unshift({  // prepend → root fires first
        node, handler: captureHandler,
        phase: isTarget ? 'at_target' : 'capturing',
      })
    }
    if (bubbleHandler && (event.bubbles || isTarget)) {
      listeners.push({     // append → target fires first
        node, handler: bubbleHandler,
        phase: isTarget ? 'at_target' : 'bubbling',
      })
    }
    node = node.parentNode
  }
  return listeners
}

// stdin → parsed key → KeyboardEvent → dispatch through tree
// dispatcher.dispatchDiscrete(target, new KeyboardEvent(key))`,

  pluginManifest: `// src/utils/plugins/schemas.ts — Lines 274-319, 884-898
const PluginManifestMetadataSchema = lazySchema(() =>
  z.object({
    name: z.string().min(1, 'Plugin name cannot be empty')
      .refine(name => !name.includes(' '), {
        message: 'Use kebab-case (e.g., "my-plugin")',
      }),
    version: z.string().optional(),
    description: z.string().optional(),
    author: PluginAuthorSchema().optional(),
    homepage: z.string().url().optional(),
    repository: z.string().optional(),
    license: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    dependencies: z.array(DependencyRefSchema()).optional(),
  }),
)

// Full manifest composes 11 sub-schemas — all optional except metadata
export const PluginManifestSchema = lazySchema(() =>
  z.object({
    ...PluginManifestMetadataSchema().shape,
    ...PluginManifestHooksSchema().partial().shape,
    ...PluginManifestCommandsSchema().partial().shape,
    ...PluginManifestAgentsSchema().partial().shape,
    ...PluginManifestSkillsSchema().partial().shape,
    ...PluginManifestOutputStylesSchema().partial().shape,
    ...PluginManifestChannelsSchema().partial().shape,
    ...PluginManifestMcpServerSchema().partial().shape,
    ...PluginManifestLspServerSchema().partial().shape,
    ...PluginManifestSettingsSchema().partial().shape,
    ...PluginManifestUserConfigSchema().partial().shape,
  }),
)`,

  skillDiscovery: `// src/skills/loadSkillsDir.ts — Lines 638-700
export const getSkillDirCommands = memoize(
  async (cwd: string): Promise<Command[]> => {
    const userSkillsDir = join(getClaudeConfigHomeDir(), 'skills')
    const managedSkillsDir = join(getManagedFilePath(), '.claude', 'skills')
    const projectSkillsDirs = getProjectDirsUpToHome('skills', cwd)

    // Load from 5 sources in parallel
    const [
      managedSkills,
      userSkills,
      projectSkillsNested,
      additionalSkillsNested,
      legacyCommands,
    ] = await Promise.all([
      loadSkillsFromSkillsDir(managedSkillsDir, 'policySettings'),
      isSettingSourceEnabled('userSettings')
        ? loadSkillsFromSkillsDir(userSkillsDir, 'userSettings')
        : Promise.resolve([]),
      Promise.all(
        projectSkillsDirs.map(dir =>
          loadSkillsFromSkillsDir(dir, 'projectSettings')
        ),
      ),
      Promise.all(
        additionalDirs.map(dir =>
          loadSkillsFromSkillsDir(join(dir, '.claude', 'skills'), 'projectSettings')
        ),
      ),
      loadSkillsFromCommandsDir(cwd),
    ])

    // Flatten, combine, deduplicate by file identity
    const allSkills = [
      ...managedSkills, ...userSkills,
      ...projectSkillsNested.flat(),
      ...additionalSkillsNested.flat(),
      ...legacyCommands,
    ]
    return deduplicateByFileIdentity(allSkills)
  }
)`,

  hookExecution: `// src/utils/hooks.ts — Lines 1952-2020
async function* executeHooks({
  hookInput, toolUseID, matchQuery,
  signal, timeoutMs, toolUseContext,
}): AsyncGenerator<AggregatedHookResult> {
  // Security gate: ALL hooks require workspace trust
  if (shouldDisableAllHooksIncludingManaged()) return
  if (shouldSkipHookDueToTrust()) return

  const hookEvent = hookInput.hook_event_name
  const matchingHooks = await getMatchingHooks(
    appState, sessionId, hookEvent, hookInput
  )
  if (matchingHooks.length === 0) return
  if (signal?.aborted) return

  // Execute matching hooks and yield results progressively
  for (const hook of matchingHooks) {
    const result = await executeHookWithTimeout(hook, hookInput, timeoutMs)
    yield { hook, result }
  }
}

// Public wrapper for PreToolUse lifecycle
export async function* executePreToolHooks(
  toolName: string, toolUseID: string,
  toolInput: unknown, toolUseContext: ToolUseContext,
): AsyncGenerator<AggregatedHookResult> {
  const hookInput: PreToolUseHookInput = {
    hook_event_name: 'PreToolUse',
    tool_name: toolName,
    tool_input: toolInput,
  }
  yield* executeHooks({ hookInput, matchQuery: toolName, ... })
}`,

  pluginLoading: `// src/utils/plugins/pluginLoader.ts — Lines 1888-1960
async function loadPluginsFromMarketplaces({ cacheOnly }) {
  const enabledPlugins = {
    ...getAddDirEnabledPlugins(),
    ...settings.enabledPlugins,
  }

  // Filter to plugin@marketplace format
  const marketplaceEntries = Object.entries(enabledPlugins)
    .filter(([key]) => PluginIdSchema().safeParse(key).success)

  // Pre-load marketplace catalogs once per marketplace
  const uniqueMarketplaces = new Set(
    marketplaceEntries.map(([id]) => parsePluginIdentifier(id).marketplace)
  )
  await Promise.all(
    [...uniqueMarketplaces].map(async (name) => {
      const catalog = await getMarketplaceCacheOnly(name)
      marketplaceCatalogs.set(name, catalog)
    })
  )

  // Fail-closed: enterprise policy blocks unknown marketplaces
  const hasEnterprisePolicy = getStrictKnownMarketplaces() !== null

  // Load all plugins in parallel
  const results = await Promise.allSettled(
    marketplaceEntries.map(async ([pluginId]) => {
      const { marketplace } = parsePluginIdentifier(pluginId)
      // Block unknown marketplaces if enterprise policy active
      if (!marketplaceConfig && hasEnterprisePolicy) {
        throw new PluginError('blocked_marketplace', pluginId)
      }
      return loadPluginFromMarketplace(pluginId, cacheOnly)
    })
  )
}`,

  autoCompactTrigger: `// src/services/compact/autoCompact.ts — Lines 62-65, 160-200
// Buffer constants
const AUTOCOMPACT_BUFFER_TOKENS = 13_000
const WARNING_THRESHOLD_BUFFER_TOKENS = 20_000

export async function shouldAutoCompact(
  messages: Message[],
  model: string,
  querySource?: QuerySource,
  snipTokensFreed = 0,
): Promise<boolean> {
  // Prevent infinite recursion: compact agents don't self-compact
  if (querySource === 'session_memory' || querySource === 'compact') {
    return false
  }

  const tokenCount = tokenCountWithEstimation(messages) - snipTokensFreed
  const effectiveWindow = getEffectiveContextWindowSize(model)
  const threshold = effectiveWindow - AUTOCOMPACT_BUFFER_TOKENS

  logForDebugging(
    'autocompact: tokens=' + tokenCount + ' threshold=' + threshold
  )

  return tokenCount > threshold
}`,

  compactAlgorithm: `// src/services/compact/compact.ts — Lines 387-429, 1136-1170
export async function compactConversation(
  messages: Message[],
  context: ToolUseContext,
  cacheSafeParams: CacheSafeParams,
  isAutoCompact: boolean = false,
): Promise<CompactionResult> {
  const preCompactTokenCount = tokenCountWithEstimation(messages)

  // Execute PreCompact hooks (plugins can inject instructions)
  context.setSDKStatus?.('compacting')
  const hookResult = await executePreCompactHooks({
    trigger: isAutoCompact ? 'auto' : 'manual',
  })

  // Fork a separate Claude agent for summarization
  const summary = await streamCompactSummary({
    messages,
    summaryRequest: buildSummaryPrompt(messages, hookResult),
    context,
    preCompactTokenCount,
    cacheSafeParams,
  })

  // Send keep-alive signals during long summarizations
  const activityInterval = setInterval(() => {
    sendSessionActivitySignal()
    context.setSDKStatus?.('compacting')
  }, 30_000)

  // Replace old messages with compact summary
  return buildCompactResult(summary, preCompactTokenCount)
}`,

  reactiveCompact: `// src/query.ts — Lines 1065-1130 (simplified)
// During streaming, a 413 "prompt too long" error arrives:
const isWithheld413 =
  lastMessage?.type === 'assistant' &&
  lastMessage.isApiErrorMessage &&
  isPromptTooLongMessage(lastMessage)

if (isWithheld413) {
  // Strategy 1: Try context collapse first (free, instant)
  if (contextCollapse) {
    const drained = contextCollapse.recoverFromOverflow(messages)
    if (drained.committed > 0) {
      state = { messages: drained.messages, transition: 'collapse_drain_retry' }
      continue  // retry with collapsed context
    }
  }

  // Strategy 2: Full reactive compact (expensive but precise)
  if (reactiveCompact) {
    // Parse exact token gap from error: "137500 > 135000" → need to free 2500
    const compacted = await reactiveCompact.tryReactiveCompact({
      messages, hasAttempted: false,
    })
    if (compacted) {
      state = { messages: buildPostCompactMessages(compacted), transition: 'reactive_compact_retry' }
      continue  // retry with compacted history
    }
  }

  // No recovery possible — surface the error
  yield lastMessage
  return { reason: 'prompt_too_long' }
}`,

  agentSpawning: `// src/tools/AgentTool/AgentTool.tsx — Lines 688-730
// Register async agent task with independent lifecycle
const agentBackgroundTask = registerAsyncAgent({
  agentId: asyncAgentId,
  description,
  prompt,
  selectedAgent,
  setAppState: rootSetAppState,
  // Background agents survive user ESC — killed explicitly
  toolUseId: toolUseContext.toolUseId
})

// Register name for SendMessage routing
if (name) {
  rootSetAppState(prev => {
    const next = new Map(prev.agentNameRegistry)
    next.set(name, asAgentId(asyncAgentId))
    return { ...prev, agentNameRegistry: next }
  })
}

// Fire and forget — void means no await, decoupled from parent
void runWithAgentContext(asyncAgentContext, () =>
  runAsyncAgentLifecycle({
    taskId: agentBackgroundTask.agentId,
    abortController: agentBackgroundTask.abortController!,
    makeStream: onCacheSafeParams => runAgent({
      ...runAgentParams,
      override: {
        agentId: asAgentId(agentBackgroundTask.agentId),
        abortController: agentBackgroundTask.abortController!
      },
    }),
    metadata, description, toolUseContext,
  })
)`,

  agentIsolation: `// src/utils/forkedAgent.ts — Lines 345-420
export function createSubagentContext(
  parentContext: ToolUseContext,
  overrides?: SubagentContextOverrides,
): ToolUseContext {
  // Independent abort: child doesn't die with parent
  const abortController = overrides?.abortController
    ?? createChildAbortController(parentContext.abortController)

  // Suppress permission prompts for non-interactive agents
  const getAppState = () => {
    const state = parentContext.getAppState()
    return {
      ...state,
      toolPermissionContext: {
        ...state.toolPermissionContext,
        shouldAvoidPermissionPrompts: true,
      },
    }
  }

  return {
    // Cloned: each agent has its own file cache
    readFileState: cloneFileStateCache(parentContext.readFileState),
    contentReplacementState: cloneContentReplacementState(...),
    // Fresh: per-agent tracking
    nestedMemoryAttachmentTriggers: new Set(),
    discoveredSkillNames: new Set(),
    // Isolated: async agents can't modify parent UI
    setAppState: () => {},  // no-op!
    // Exception: task registration must reach root
    setAppStateForTasks: parentContext.setAppState,
    // Independent denial tracking
    localDenialTracking: createDenialTrackingState(),
    abortController,
    getAppState,
  }
}`,

  agentMessaging: `// src/tools/SendMessageTool/SendMessageTool.ts — Lines 149-189, 738-780
async function handleMessage(
  recipientName: string,
  content: string,
  context: ToolUseContext,
): Promise<MessageOutput> {
  const senderName = getAgentName() || TEAM_LEAD_NAME

  // Write to mailbox for swarm coordination
  await writeToMailbox(recipientName, {
    from: senderName,
    text: content,
    timestamp: new Date().toISOString(),
  })

  return { success: true, message: 'Message sent to ' + recipientName }
}

// In-process routing: direct delivery or auto-resume
const registered = appState.agentNameRegistry.get(input.to)
const agentId = registered ?? toAgentId(input.to)
const task = appState.tasks[agentId]

if (task?.status === 'running') {
  // Agent is active — queue message for next tool round
  queuePendingMessage(agentId, input.message, context.setAppStateForTasks)
} else if (task) {
  // Agent stopped — wake it up with the message
  await resumeAgentBackground({
    agentId,
    prompt: input.message,
    toolUseContext: context,
  })
}`,

  agentNotification: `// src/tasks/LocalAgentTask/LocalAgentTask.tsx — Lines 466-515, 197-262
export function registerAsyncAgent({ agentId, description, ... }) {
  const abortController = parentAbortController
    ? createChildAbortController(parentAbortController)
    : createAbortController()

  const taskState: LocalAgentTaskState = {
    type: 'local_agent',
    status: 'running',
    agentId,
    description,
    abortController,
    isBackgrounded: true,
    pendingMessages: [],
  }
  registerTask(taskState, setAppState)
  return taskState
}

// On completion: queue notification for parent
export function enqueueAgentNotification({ taskId, status, ... }) {
  // Atomic flag: prevent duplicate notifications
  let shouldEnqueue = false
  updateTaskState(taskId, setAppState, task => {
    if (task.notified) return task
    shouldEnqueue = true
    return { ...task, notified: true }
  })
  if (!shouldEnqueue) return

  // Abort any active speculation — state changed
  abortSpeculation(setAppState)

  // Queue XML notification for async delivery
  enqueuePendingNotification({
    value: '<task-notification>...' + taskId + status + '</task-notification>',
    mode: 'task-notification'
  })
}`,

  tokenBudget: `// src/query/tokenBudget.ts — Lines 6-93
type BudgetTracker = {
  continuationCount: number
  lastDeltaTokens: number
  lastGlobalTurnTokens: number
  startedAt: number
}

export function checkTokenBudget(
  tracker: BudgetTracker,
  budget: number | null,
  globalTurnTokens: number,
): TokenBudgetDecision {
  if (budget === null || budget <= 0) return { action: 'stop' }

  const pct = Math.round((globalTurnTokens / budget) * 100)
  const delta = globalTurnTokens - tracker.lastGlobalTurnTokens

  // Detect diminishing returns: 3+ turns with tiny progress
  const isDiminishing =
    tracker.continuationCount >= 3 &&
    delta < DIMINISHING_THRESHOLD &&
    tracker.lastDeltaTokens < DIMINISHING_THRESHOLD

  // Continue if under budget and making progress
  if (!isDiminishing && globalTurnTokens < budget * 0.9) {
    tracker.continuationCount++
    tracker.lastDeltaTokens = delta
    return { action: 'continue', pct, nudgeMessage: '...' }
  }

  // Stop: either over budget or diminishing returns
  return { action: 'stop', diminishingReturns: isDiminishing }
}`,
};
