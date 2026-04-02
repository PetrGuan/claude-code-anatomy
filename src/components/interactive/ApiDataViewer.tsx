import { useState, useEffect, useRef } from "react";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";

interface Props {
  locale?: Locale;
}

const apiRequest = `// POST https://api.anthropic.com/v1/messages (stream: true)
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 16384,
  "stream": true,
  "system": [
    {
      "type": "text",
      "text": "You are Claude Code, Anthropic's official CLI..."
      // ~5KB of system prompt
    },
    {
      "type": "text",
      "text": "# Environment\\nPlatform: darwin\\nShell: zsh\\nCwd: /Users/dev/myproject\\n..."
    }
  ],
  "messages": [
    {
      "role": "user",
      "content": "Help me fix the failing test in src/utils.ts"
    }
  ],
  "tools": [
    {
      "name": "Bash",
      "description": "Execute shell commands...",
      "input_schema": {
        "type": "object",
        "properties": {
          "command": { "type": "string" },
          "timeout": { "type": "number" }
        },
        "required": ["command"]
      }
    }
    // ... 44 more tool definitions
  ],
  "metadata": {
    "user_id": "user_abc123"
  }
}`;

const streamResponse = `// Server-Sent Events stream

event: message_start
data: {"type":"message_start","message":{"id":"msg_01X...","model":"claude-sonnet-4-20250514","usage":{"input_tokens":12847}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Let me"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" look at"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the failing test."}}

// Claude decides to use a tool:
event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_01A...","name":"Read","input":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\\"file_"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"path\\": \\"/Users/dev/myproject/src/utils.ts\\"}"}}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"tool_use"},"usage":{"output_tokens":89}}

event: message_stop
data: {"type":"message_stop"}`;

const toolCall = `// Assembled from streaming content_block events:
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Let me look at the failing test."
    },
    {
      "type": "tool_use",
      "id": "toolu_01ABC123",
      "name": "Read",
      "input": {
        "file_path": "/Users/dev/myproject/src/utils.ts"
      }
    }
  ],
  "stop_reason": "tool_use"
}

// Claude Code then:
// 1. Checks permission: canUseTool("Read", {file_path: "..."})
// 2. Executes: FileReadTool.call({file_path: "..."})
// 3. Gets result: "export function add(a, b) { return a + b; }\\n..."`;

const toolResult = `// Sent back to API as the next user message:
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01ABC123",
      "content": "1\\texport function add(a: number, b: number): number {\\n2\\t  return a + b;\\n3\\t}\\n4\\t\\n5\\texport function multiply(a: number, b: number): number {\\n6\\t  return a + b; // BUG: should be a * b\\n7\\t}\\n"
    }
  ]
}

// The API is called again with the full conversation:
// [user prompt] -> [assistant + tool_use] -> [tool_result] -> ???
// Claude sees the file content and continues working...`;

const tabs = [
  { id: "request", key: "apiData.tabRequest", code: apiRequest, descKey: "apiData.requestDesc" },
  { id: "response", key: "apiData.tabResponse", code: streamResponse, descKey: "apiData.responseDesc" },
  { id: "toolcall", key: "apiData.tabToolCall", code: toolCall, descKey: "apiData.toolCallDesc" },
  { id: "toolresult", key: "apiData.tabToolResult", code: toolResult, descKey: "apiData.toolResultDesc" },
];

export default function ApiDataViewer({ locale = "en" as Locale }: Props) {
  const [activeTab, setActiveTab] = useState("request");
  const [highlightedTabs, setHighlightedTabs] = useState<Map<string, string>>(new Map());
  const [currentTheme, setCurrentTheme] = useState("dark");
  const lastTheme = useRef("");

  // Track theme
  useEffect(() => {
    const getTheme = () => document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    setCurrentTheme(getTheme());
    const observer = new MutationObserver(() => setCurrentTheme(getTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Highlight with Shiki
  useEffect(() => {
    if (lastTheme.current === currentTheme) return;
    let cancelled = false;
    const shikiTheme = currentTheme === "light" ? "github-light-default" : "github-dark-default";
    async function highlight() {
      try {
        const { createHighlighter } = await import("shiki");
        const highlighter = await createHighlighter({ themes: [shikiTheme], langs: ["jsonc"] });
        if (cancelled) { highlighter.dispose(); return; }
        const result = new Map<string, string>();
        for (const tab of tabs) {
          result.set(tab.id, highlighter.codeToHtml(tab.code, { lang: "jsonc", theme: shikiTheme }));
        }
        highlighter.dispose();
        if (!cancelled) { lastTheme.current = currentTheme; setHighlightedTabs(result); }
      } catch (e) { console.warn("Shiki failed", e); }
    }
    highlight();
    return () => { cancelled = true; };
  }, [currentTheme]);

  const active = tabs.find(tab => tab.id === activeTab)!;

  return (
    <div className="rounded-xl border border-bg-border overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-bg-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-accent-purple border-b-2 border-accent-purple bg-bg-card"
                : "text-text-secondary hover:text-text"
            }`}
          >
            {t(locale, tab.key)}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="px-4 py-3 bg-bg-card border-b border-bg-border">
        <p className="text-sm text-text-secondary">{t(locale, active.descKey)}</p>
      </div>

      {/* Code */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        {highlightedTabs.has(active.id) ? (
          <div
            className="p-4 text-xs sm:text-sm [&_pre]:!bg-transparent [&_pre]:!m-0 [&_code]:!text-xs sm:[&_code]:!text-sm [&_code]:!leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightedTabs.get(active.id)! }}
          />
        ) : (
          <pre className="p-4 text-xs sm:text-sm font-mono leading-relaxed text-text">
            <code>{active.code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
