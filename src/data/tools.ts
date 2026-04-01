export interface Tool {
  name: string;
  description: string;
  descriptionCn: string;
  category: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  nameCn: string;
  color: string;
  tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: "shell",
    name: "Shell Execution",
    nameCn: "Shell 执行",
    color: "#ef4444",
    tools: [
      { name: "Bash", description: "Execute shell commands and scripts", descriptionCn: "执行 Shell 命令和脚本", category: "shell" },
      { name: "PowerShell", description: "Execute PowerShell commands on Windows", descriptionCn: "在 Windows 上执行 PowerShell 命令", category: "shell" },
      { name: "REPL", description: "Execute code in isolated REPL", descriptionCn: "在隔离的 REPL 环境中执行代码", category: "shell" },
    ],
  },
  {
    id: "file-ops",
    name: "File Operations",
    nameCn: "文件操作",
    color: "#10b981",
    tools: [
      { name: "Read", description: "Read files: text, code, PDFs, images, notebooks", descriptionCn: "读取文件：文本、代码、PDF、图片、Notebook", category: "file-ops" },
      { name: "Write", description: "Create or overwrite files", descriptionCn: "创建或覆盖文件", category: "file-ops" },
      { name: "Edit", description: "Find-and-replace text sections in files", descriptionCn: "查找并替换文件中的文本段", category: "file-ops" },
      { name: "NotebookEdit", description: "Edit Jupyter notebook cells", descriptionCn: "编辑 Jupyter Notebook 单元格", category: "file-ops" },
      { name: "EnterWorktree", description: "Create isolated git worktree", descriptionCn: "创建隔离的 git worktree", category: "file-ops" },
      { name: "ExitWorktree", description: "Exit a worktree session", descriptionCn: "退出 worktree 会话", category: "file-ops" },
    ],
  },
  {
    id: "search",
    name: "Search & Discovery",
    nameCn: "搜索与发现",
    color: "#6c63ff",
    tools: [
      { name: "Glob", description: "Find files by name pattern matching", descriptionCn: "按文件名模式匹配查找文件", category: "search" },
      { name: "Grep", description: "Search file contents with regex", descriptionCn: "用正则表达式搜索文件内容", category: "search" },
      { name: "ToolSearch", description: "Search available tools by keyword", descriptionCn: "按关键词搜索可用工具", category: "search" },
    ],
  },
  {
    id: "web",
    name: "Web Access",
    nameCn: "网络访问",
    color: "#22d3ee",
    tools: [
      { name: "WebFetch", description: "Fetch and extract content from URLs", descriptionCn: "获取并提取 URL 内容", category: "web" },
      { name: "WebSearch", description: "Search the web and return ranked results", descriptionCn: "搜索网络并返回排序结果", category: "web" },
    ],
  },
  {
    id: "agent",
    name: "Agent & Coordination",
    nameCn: "Agent 与协调",
    color: "#f59e0b",
    tools: [
      { name: "Agent", description: "Spawn autonomous sub-agents for tasks", descriptionCn: "派生自主子 Agent 执行任务", category: "agent" },
      { name: "SendMessage", description: "Send messages between agents in teams", descriptionCn: "在团队中的 Agent 之间发送消息", category: "agent" },
      { name: "TeamCreate", description: "Create a multi-agent swarm team", descriptionCn: "创建多 Agent 蜂群团队", category: "agent" },
      { name: "TeamDelete", description: "Disband a swarm team", descriptionCn: "解散蜂群团队", category: "agent" },
      { name: "Skill", description: "Execute custom skills and slash commands", descriptionCn: "执行自定义技能和斜杠命令", category: "agent" },
      { name: "RemoteTrigger", description: "Manage scheduled remote triggers", descriptionCn: "管理定期远程触发器", category: "agent" },
    ],
  },
  {
    id: "task",
    name: "Task Management",
    nameCn: "任务管理",
    color: "#a78bfa",
    tools: [
      { name: "TaskCreate", description: "Create a new task", descriptionCn: "创建新任务", category: "task" },
      { name: "TaskUpdate", description: "Update task status and properties", descriptionCn: "更新任务状态和属性", category: "task" },
      { name: "TaskList", description: "List all tasks", descriptionCn: "列出所有任务", category: "task" },
      { name: "TaskGet", description: "Get a specific task by ID", descriptionCn: "按 ID 获取特定任务", category: "task" },
      { name: "TaskOutput", description: "Get output from background tasks", descriptionCn: "获取后台任务的输出", category: "task" },
      { name: "TaskStop", description: "Kill a running background task", descriptionCn: "终止运行中的后台任务", category: "task" },
      { name: "TodoWrite", description: "Manage session task checklist", descriptionCn: "管理会话任务清单", category: "task" },
    ],
  },
  {
    id: "mcp",
    name: "MCP Protocol",
    nameCn: "MCP 协议",
    color: "#fb923c",
    tools: [
      { name: "MCPTool", description: "Execute tools from MCP servers", descriptionCn: "执行 MCP 服务器的工具", category: "mcp" },
      { name: "ListMcpResources", description: "List MCP server resources", descriptionCn: "列出 MCP 服务器资源", category: "mcp" },
      { name: "ReadMcpResource", description: "Read content from MCP resources", descriptionCn: "读取 MCP 资源内容", category: "mcp" },
      { name: "McpAuth", description: "OAuth authentication for MCP servers", descriptionCn: "MCP 服务器的 OAuth 认证", category: "mcp" },
    ],
  },
  {
    id: "config",
    name: "Configuration & IDE",
    nameCn: "配置与 IDE",
    color: "#8888a0",
    tools: [
      { name: "Config", description: "Read and modify settings", descriptionCn: "读取和修改设置", category: "config" },
      { name: "AskUserQuestion", description: "Prompt the user with questions", descriptionCn: "向用户提出问题", category: "config" },
      { name: "CronCreate", description: "Schedule recurring prompts", descriptionCn: "安排定期提示", category: "config" },
      { name: "LSP", description: "Language Server Protocol for code analysis", descriptionCn: "语言服务器协议用于代码分析", category: "config" },
      { name: "EnterPlanMode", description: "Enter plan mode for complex tasks", descriptionCn: "进入计划模式处理复杂任务", category: "config" },
      { name: "ExitPlanMode", description: "Complete plan mode", descriptionCn: "完成计划模式", category: "config" },
      { name: "CronDelete", description: "Cancel a scheduled cron job", descriptionCn: "取消定期任务", category: "config" },
      { name: "CronList", description: "List active cron jobs", descriptionCn: "列出活跃的定期任务", category: "config" },
      { name: "Sleep", description: "Pause execution for a duration", descriptionCn: "暂停执行指定时间", category: "config" },
      { name: "StructuredOutput", description: "Return structured JSON response", descriptionCn: "返回结构化 JSON 响应", category: "config" },
      { name: "Brief", description: "Send messages with file attachments", descriptionCn: "发送带文件附件的消息", category: "config" },
    ],
  },
];
