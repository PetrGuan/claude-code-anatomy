import { useState, useEffect, useCallback, useRef } from "react";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";
import PixelSprite from "./PixelSprite";
import { playerSprite, npcSprites, objectSprites } from "./sprites";

// Types
interface Position { x: number; y: number; }
interface NPC {
  id: string;
  pos: Position;
  emoji: string;
  name: string;
  nameCn: string;
  dialogue: DialogueLine[];
}
interface DialogueLine {
  text: string;
  textCn: string;
  choices?: { label: string; labelCn: string; correct?: boolean; next?: number }[];
}
interface Room {
  id: string;
  name: string;
  nameCn: string;
  color: string;
  width: number;
  height: number;
  walls: Position[];
  npcs: NPC[];
  exitRight?: Position;
  exitLeft?: Position;
  objects: { pos: Position; emoji: string; tooltip: string; tooltipCn: string }[];
}

// Room definitions
const TILE = 40;
const rooms: Room[] = [
  {
    id: "entrance",
    name: "Input Hall",
    nameCn: "输入大厅",
    color: "#6c63ff",
    width: 12,
    height: 8,
    walls: [
      ...Array.from({length: 12}, (_, x) => ({x, y: 0})),
      ...Array.from({length: 12}, (_, x) => ({x, y: 7})),
      ...Array.from({length: 8}, (_, y) => ({x: 0, y})),
      ...Array.from({length: 8}, (_, y) => ({x: 11, y})).filter(p => p.y !== 3 && p.y !== 4),
    ],
    npcs: [
      {
        id: "prompt-input",
        pos: { x: 5, y: 3 },
        emoji: "📋",
        name: "PromptInput",
        nameCn: "输入处理器",
        dialogue: [
          { text: "Welcome, little message! I'm PromptInput. I capture everything the user types and attach context to it.", textCn: "欢迎，小消息！我是输入处理器。我捕获用户输入的所有内容并附加上下文。" },
          { text: "Before you travel to Claude, I need to pack your bag. What context should I attach?", textCn: "在你前往 Claude 之前，我需要给你打包。应该附加什么上下文？",
            choices: [
              { label: "Current directory + git status + tool definitions", labelCn: "当前目录 + git 状态 + 工具定义", correct: true, next: 2 },
              { label: "Just the user's text, nothing else", labelCn: "只有用户文本，没有其他", correct: false, next: 3 },
            ]
          },
          { text: "Correct! I attach the working directory, git status, all 45+ tool definitions, project rules from CLAUDE.md, and memory from previous conversations. You're now a fully-packed message!", textCn: "正确！我附加工作目录、git 状态、所有 45+ 工具定义、CLAUDE.md 的项目规则以及之前对话的记忆。你现在是一条完整的消息了！" },
          { text: "Not quite! Without context, Claude wouldn't know where you are, what tools are available, or what rules to follow. Let me pack everything: directory, git status, tools, rules, and memory.", textCn: "不太对！没有上下文，Claude 不知道你在哪里、有什么工具可用、该遵循什么规则。让我打包所有东西：目录、git 状态、工具、规则和记忆。" },
        ],
      },
    ],
    exitRight: { x: 11, y: 3 },
    objects: [
      { pos: { x: 3, y: 2 }, emoji: "🖥️", tooltip: "Terminal: where the user types", tooltipCn: "终端：用户输入的地方" },
      { pos: { x: 7, y: 5 }, emoji: "📁", tooltip: "CLAUDE.md: project rules", tooltipCn: "CLAUDE.md：项目规则" },
      { pos: { x: 2, y: 5 }, emoji: "🧠", tooltip: "Memory: past conversation context", tooltipCn: "记忆：过去的对话上下文" },
    ],
  },
  {
    id: "api",
    name: "API Cloud",
    nameCn: "API 云端",
    color: "#22d3ee",
    width: 12,
    height: 8,
    walls: [
      ...Array.from({length: 12}, (_, x) => ({x, y: 0})),
      ...Array.from({length: 12}, (_, x) => ({x, y: 7})),
      ...Array.from({length: 8}, (_, y) => ({x: 0, y})).filter(p => p.y !== 3 && p.y !== 4),
      ...Array.from({length: 8}, (_, y) => ({x: 11, y})).filter(p => p.y !== 3 && p.y !== 4),
    ],
    npcs: [
      {
        id: "claude-api",
        pos: { x: 6, y: 3 },
        emoji: "☁️",
        name: "Claude API",
        nameCn: "Claude API",
        dialogue: [
          { text: "I'm the Claude API! I receive your packed message and stream back a response token by token. No waiting for the full reply!", textCn: "我是 Claude API！我接收你打包好的消息，并逐 token 流式返回响应。不用等待完整回复！" },
          { text: "How does streaming work? It uses a special pattern called...", textCn: "流式传输如何工作？它使用一种叫做...的特殊模式",
            choices: [
              { label: "Async Generators (yield tokens one by one)", labelCn: "异步生成器（逐个 yield token）", correct: true, next: 2 },
              { label: "Callbacks (fire and forget)", labelCn: "回调函数（即发即忘）", correct: false, next: 3 },
            ]
          },
          { text: "Yes! Async generators yield each token as it arrives. The UI updates in real-time. Memory stays flat. You can cancel anytime. It's the backbone of Claude Code!", textCn: "对！异步生成器在每个 token 到达时 yield。UI 实时更新。内存保持平稳。随时可以取消。这是 Claude Code 的骨架！" },
          { text: "Callbacks could work but they don't compose well. Async generators let tool results flow naturally with yield* — no manual message forwarding needed.", textCn: "回调可以工作，但组合性不好。异步生成器通过 yield* 让工具结果自然流动 — 不需要手动消息转发。" },
        ],
      },
    ],
    exitLeft: { x: 0, y: 3 },
    exitRight: { x: 11, y: 3 },
    objects: [
      { pos: { x: 3, y: 2 }, emoji: "⚡", tooltip: "Streaming: tokens arrive one by one", tooltipCn: "流式传输：token 逐个到达" },
      { pos: { x: 9, y: 2 }, emoji: "🌊", tooltip: "AsyncGenerator: the streaming pattern", tooltipCn: "AsyncGenerator：流式模式" },
      { pos: { x: 4, y: 5 }, emoji: "📊", tooltip: "Token budget: tracks context window usage", tooltipCn: "Token 预算：跟踪上下文窗口使用" },
      { pos: { x: 8, y: 5 }, emoji: "🗜️", tooltip: "Compaction: summarizes when context is full", tooltipCn: "压缩：上下文满时进行摘要" },
    ],
  },
  {
    id: "tools",
    name: "Tool Workshop",
    nameCn: "工具工坊",
    color: "#10b981",
    width: 12,
    height: 8,
    walls: [
      ...Array.from({length: 12}, (_, x) => ({x, y: 0})),
      ...Array.from({length: 12}, (_, x) => ({x, y: 7})),
      ...Array.from({length: 8}, (_, y) => ({x: 0, y})).filter(p => p.y !== 3 && p.y !== 4),
      ...Array.from({length: 8}, (_, y) => ({x: 11, y})).filter(p => p.y !== 3 && p.y !== 4),
    ],
    npcs: [
      {
        id: "tool-master",
        pos: { x: 6, y: 3 },
        emoji: "🔧",
        name: "ToolMaster",
        nameCn: "工具大师",
        dialogue: [
          { text: "Welcome to the Tool Workshop! I manage 45+ tools. Claude picks which ones to use. Read, Write, Edit, Bash, Grep, Glob — each one does something specific.", textCn: "欢迎来到工具工坊！我管理 45+ 工具。Claude 选择使用哪些。Read、Write、Edit、Bash、Grep、Glob — 每个做特定的事。" },
          { text: "Claude wants to read a file AND search for a pattern. How should I schedule these?", textCn: "Claude 想读取文件并搜索模式。我应该如何调度？",
            choices: [
              { label: "Run both in parallel — they're both read-only!", labelCn: "并行运行 — 它们都是只读的！", correct: true, next: 2 },
              { label: "Run them one at a time to be safe", labelCn: "一次运行一个以确保安全", correct: false, next: 3 },
            ]
          },
          { text: "Exactly! Read-only tools (Read, Grep, Glob) run in parallel via Promise.all. Write tools (Edit, Write, Bash) must run serially to prevent race conditions. Smart scheduling!", textCn: "完全正确！只读工具（Read、Grep、Glob）通过 Promise.all 并行运行。写工具（Edit、Write、Bash）必须串行运行以防止竞态条件。智能调度！" },
          { text: "Playing it safe is understandable, but unnecessary for read-only tools! They can't conflict. Running Read and Grep in parallel saves time with zero risk.", textCn: "谨慎是可以理解的，但对只读工具不必要！它们不会冲突。并行运行 Read 和 Grep 在零风险下节省时间。" },
        ],
      },
    ],
    exitLeft: { x: 0, y: 3 },
    exitRight: { x: 11, y: 3 },
    objects: [
      { pos: { x: 2, y: 2 }, emoji: "📖", tooltip: "Read: reads files", tooltipCn: "Read：读取文件" },
      { pos: { x: 4, y: 2 }, emoji: "✏️", tooltip: "Edit: modifies files", tooltipCn: "Edit：修改文件" },
      { pos: { x: 6, y: 5 }, emoji: "🔍", tooltip: "Grep: searches file contents", tooltipCn: "Grep：搜索文件内容" },
      { pos: { x: 8, y: 2 }, emoji: "💻", tooltip: "Bash: runs shell commands", tooltipCn: "Bash：运行 Shell 命令" },
      { pos: { x: 9, y: 5 }, emoji: "🌐", tooltip: "WebSearch: searches the web", tooltipCn: "WebSearch：搜索网络" },
      { pos: { x: 3, y: 5 }, emoji: "📂", tooltip: "Glob: finds files by pattern", tooltipCn: "Glob：按模式查找文件" },
    ],
  },
  {
    id: "security",
    name: "Security Checkpoint",
    nameCn: "安全关卡",
    color: "#f59e0b",
    width: 12,
    height: 8,
    walls: [
      ...Array.from({length: 12}, (_, x) => ({x, y: 0})),
      ...Array.from({length: 12}, (_, x) => ({x, y: 7})),
      ...Array.from({length: 8}, (_, y) => ({x: 0, y})).filter(p => p.y !== 3 && p.y !== 4),
      ...Array.from({length: 8}, (_, y) => ({x: 11, y})),
    ],
    npcs: [
      {
        id: "security-guard",
        pos: { x: 6, y: 3 },
        emoji: "🛡️",
        name: "SecurityGuard",
        nameCn: "安全守卫",
        dialogue: [
          { text: "Halt! I'm the SecurityGuard. Before any tool executes, I check if it's safe. I have THREE layers of defense!", textCn: "站住！我是安全守卫。在任何工具执行之前，我检查它是否安全。我有三层防线！" },
          { text: "A command comes in: 'rm -rf /'. What should I do?", textCn: "一条命令进来了：'rm -rf /'。我该怎么做？",
            choices: [
              { label: "DENY — this deletes everything!", labelCn: "拒绝 — 这会删除所有东西！", correct: true, next: 2 },
              { label: "ASK the user first", labelCn: "先问用户", correct: false, next: 3 },
            ]
          },
          { text: "Right! My ML classifier catches this instantly with 99.9% confidence. No need to bother the user. Layer 1 (ML) handles ~80% of cases. Layer 2 (Rules) catches custom policies. Layer 3 (User Dialog) is the last resort.", textCn: "对！我的 ML 分类器以 99.9% 的置信度立即捕获。不需要打扰用户。第一层（ML）处理约 80% 的情况。第二层（规则）捕获自定义策略。第三层（用户对话框）是最后手段。" },
          { text: "Asking is safer, but too slow for obvious threats! My ML classifier denies 'rm -rf /' instantly. I only ask the user for genuinely ambiguous commands like 'npm install'.", textCn: "询问更安全，但对明显威胁太慢！我的 ML 分类器立即拒绝 'rm -rf /'。我只对真正模糊的命令（如 'npm install'）询问用户。" },
        ],
      },
    ],
    exitLeft: { x: 0, y: 3 },
    objects: [
      { pos: { x: 3, y: 2 }, emoji: "🤖", tooltip: "Layer 1: ML Classifier (~80% of decisions)", tooltipCn: "第一层：ML 分类器（约 80% 的决策）" },
      { pos: { x: 6, y: 5 }, emoji: "📜", tooltip: "Layer 2: Rule Engine (user-defined)", tooltipCn: "第二层：规则引擎（用户定义）" },
      { pos: { x: 9, y: 2 }, emoji: "👤", tooltip: "Layer 3: User Confirmation (last resort)", tooltipCn: "第三层：用户确认（最后手段）" },
      { pos: { x: 9, y: 5 }, emoji: "🏁", tooltip: "Exit: response delivered!", tooltipCn: "出口：响应已送达！" },
    ],
  },
];

interface Props { locale?: Locale; }

export default function PixelRPG({ locale = "en" as Locale }: Props) {
  const [roomIndex, setRoomIndex] = useState(0);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 3 });
  const [dialogue, setDialogue] = useState<{ npc: NPC; lineIndex: number } | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [completedRooms, setCompletedRooms] = useState<Set<string>>(new Set());
  const [gameComplete, setGameComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const room = rooms[roomIndex];
  const isZh = locale === "zh";

  const isWall = useCallback((x: number, y: number) => {
    return room.walls.some(w => w.x === x && w.y === y) ||
      room.npcs.some(n => n.pos.x === x && n.pos.y === y) ||
      room.objects.some(o => o.pos.x === x && o.pos.y === y);
  }, [room]);

  const handleMove = useCallback((dx: number, dy: number) => {
    if (dialogue) return;
    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;

    // Check room transitions — must complete current room's NPC dialogue first
    if (room.exitRight && nx === room.exitRight.x + 1 && (ny === room.exitRight.y || ny === room.exitRight.y + 1)) {
      if (!completedRooms.has(room.id)) {
        // Show hint: must talk to NPC first
        setTooltip(isZh ? "⚠️ 先和 NPC 对话完成任务！" : "⚠️ Talk to the NPC first to proceed!");
        return;
      }
      if (roomIndex < rooms.length - 1) {
        setRoomIndex(r => r + 1);
        setPlayerPos({ x: 1, y: 3 });
        setTooltip(null);
        return;
      }
    }
    if (room.exitLeft && nx === room.exitLeft.x - 1 && (ny === room.exitLeft.y || ny === room.exitLeft.y + 1)) {
      if (roomIndex > 0) {
        setRoomIndex(r => r - 1);
        setPlayerPos({ x: rooms[roomIndex - 1].width - 2, y: 3 });
        setTooltip(null);
        return;
      }
    }

    if (nx < 0 || ny < 0 || nx >= room.width || ny >= room.height) return;
    if (isWall(nx, ny)) return;
    setPlayerPos({ x: nx, y: ny });

    // Check proximity to objects for tooltip
    const nearObj = room.objects.find(o =>
      Math.abs(o.pos.x - nx) <= 1 && Math.abs(o.pos.y - ny) <= 1
    );
    setTooltip(nearObj ? (isZh ? nearObj.tooltipCn : nearObj.tooltip) : null);
  }, [dialogue, playerPos, room, roomIndex, isWall, isZh, completedRooms]);

  const handleInteract = useCallback(() => {
    if (dialogue) return;
    // Check if near an NPC
    const npc = room.npcs.find(n =>
      Math.abs(n.pos.x - playerPos.x) <= 1 && Math.abs(n.pos.y - playerPos.y) <= 1
    );
    if (npc) {
      setDialogue({ npc, lineIndex: 0 });
    }
    // Check if at final room exit
    if (room.id === "security" && completedRooms.has("security")) {
      setGameComplete(true);
    }
  }, [dialogue, room, playerPos, completedRooms]);

  const advanceDialogue = useCallback((choiceIndex?: number) => {
    if (!dialogue) return;
    const { npc, lineIndex } = dialogue;
    const line = npc.dialogue[lineIndex];

    if (line?.choices && choiceIndex !== undefined) {
      const choice = line.choices[choiceIndex];
      if (choice.correct) setCorrectAnswers(c => c + 1);
      if (choice.next !== undefined) {
        setDialogue({ npc, lineIndex: choice.next });
        return;
      }
    }

    // Advance to next line or close.
    // When a choice jumps to a feedback line (e.g. next: 2 or next: 3), that
    // feedback line has no choices. So the "no choices" branch below correctly
    // closes the dialogue and marks the room complete after one more click.
    // This is intentional — show feedback, one click to close.
    const nextIndex = lineIndex + 1;
    if (nextIndex < npc.dialogue.length && !npc.dialogue[nextIndex - 1]?.choices) {
      setDialogue({ npc, lineIndex: nextIndex });
    } else {
      setDialogue(null);
      setCompletedRooms(prev => new Set([...prev, room.id]));
    }
  }, [dialogue, room.id]);

  // Keyboard handler — attached to the game container (not window) so it only
  // fires when the game is focused, preventing arrow-key hijacking of page scroll.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (dialogue) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          const line = dialogue.npc.dialogue[dialogue.lineIndex];
          if (!line?.choices) advanceDialogue();
        }
        return;
      }

      switch (e.key) {
        case "ArrowUp": case "w": case "W": e.preventDefault(); handleMove(0, -1); break;
        case "ArrowDown": case "s": case "S": e.preventDefault(); handleMove(0, 1); break;
        case "ArrowLeft": case "a": case "A": e.preventDefault(); handleMove(-1, 0); break;
        case "ArrowRight": case "d": case "D": e.preventDefault(); handleMove(1, 0); break;
        case " ": case "Enter": e.preventDefault(); handleInteract(); break;
      }
    }
    const el = containerRef.current;
    if (el) el.addEventListener("keydown", onKey);
    return () => { if (el) el.removeEventListener("keydown", onKey); };
  }, [dialogue, handleMove, handleInteract, advanceDialogue]);

  // Focus container on mount
  useEffect(() => { containerRef.current?.focus(); }, []);

  // Responsive scaling — shrink the game viewport to fit narrow containers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const containerWidth = el.clientWidth;
      const gameWidth = room.width * TILE;
      setScale(Math.min(1, containerWidth / gameWidth));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [room.width]);

  const currentLine = dialogue ? dialogue.npc.dialogue[dialogue.lineIndex] : null;

  if (gameComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <p className="text-6xl">🎉</p>
        <h2 className="text-3xl font-bold text-accent-purple">
          {isZh ? "任务完成！" : "Quest Complete!"}
        </h2>
        <p className="text-text-secondary">
          {isZh
            ? "你成功地将一条用户消息送过了 Claude Code 的整个管线：输入 → API → 工具 → 安全 → 响应。"
            : "You successfully guided a user message through Claude Code's entire pipeline: Input → API → Tools → Security → Response."
          }
        </p>
        <p className="text-lg font-bold text-accent-emerald">
          {correctAnswers}/4 {isZh ? "个问题回答正确" : "questions answered correctly"}
        </p>
        <button
          onClick={() => { setRoomIndex(0); setPlayerPos({x:1,y:3}); setCompletedRooms(new Set()); setCorrectAnswers(0); setGameComplete(false); }}
          className="px-6 py-3 rounded-lg bg-accent-purple text-white font-bold hover:bg-accent-purple/80 transition-colors"
        >
          {isZh ? "再玩一次" : "Play Again"}
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} tabIndex={0} className="outline-none max-w-2xl mx-auto">
      {/* Room header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: room.color }} />
          <span className="text-sm font-bold" style={{ color: room.color }}>
            {isZh ? room.nameCn : room.name}
          </span>
        </div>
        <div className="flex gap-1">
          {rooms.map((r, i) => (
            <span
              key={r.id}
              className={`w-6 h-2 rounded-full ${
                completedRooms.has(r.id) ? "bg-accent-emerald" :
                i === roomIndex ? "bg-accent-purple" : "bg-bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Game viewport — wrapped to maintain scaled height in document flow */}
      <div style={{ height: `${room.height * TILE * scale}px`, overflow: "hidden" }}>
      <div
        className="relative rounded-xl border-2 overflow-hidden bg-bg"
        style={{
          borderColor: room.color,
          width: `${room.width * TILE}px`,
          height: `${room.height * TILE}px`,
          imageRendering: "pixelated",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Floor grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgb(var(--color-bg-border) / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(var(--color-bg-border) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: `${TILE}px ${TILE}px`,
        }} />

        {/* Walls */}
        {room.walls.map((w, i) => (
          <div
            key={`w${i}`}
            className="absolute bg-bg-card border border-bg-border"
            style={{ left: w.x * TILE, top: w.y * TILE, width: TILE, height: TILE }}
          />
        ))}

        {/* Exit indicators — locked until room completed */}
        {room.exitRight && (
          <div
            className={`absolute flex items-center justify-center text-sm ${completedRooms.has(room.id) ? "animate-pulse" : ""}`}
            style={{ left: room.exitRight.x * TILE, top: room.exitRight.y * TILE, width: TILE, height: TILE * 2, color: completedRooms.has(room.id) ? room.color : "#ef4444" }}
          >
            {completedRooms.has(room.id) ? "→" : "🔒"}
          </div>
        )}
        {room.exitLeft && (
          <div
            className="absolute flex items-center justify-center text-xs animate-pulse"
            style={{ left: room.exitLeft.x * TILE, top: room.exitLeft.y * TILE, width: TILE, height: TILE * 2, color: room.color }}
          >
            ←
          </div>
        )}

        {/* Objects */}
        {room.objects.map((obj, i) => (
          <div
            key={`o${i}`}
            className="absolute flex items-center justify-center"
            style={{ left: obj.pos.x * TILE, top: obj.pos.y * TILE, width: TILE, height: TILE }}
          >
            {objectSprites[obj.emoji] ? (
              <PixelSprite sprite={objectSprites[obj.emoji]} size={4} />
            ) : (
              <span className="text-lg">{obj.emoji}</span>
            )}
          </div>
        ))}

        {/* NPCs */}
        {room.npcs.map(npc => (
          <div key={npc.id} className="absolute flex flex-col items-center" style={{ left: npc.pos.x * TILE, top: npc.pos.y * TILE - 12, width: TILE }}>
            <span className="text-[10px] font-mono text-text-secondary whitespace-nowrap">{isZh ? npc.nameCn : npc.name}</span>
            {npcSprites[npc.id] ? (
              <PixelSprite sprite={npcSprites[npc.id]} size={3} />
            ) : (
              <span className="text-xl">{npc.emoji}</span>
            )}
            {!completedRooms.has(room.id) && (
              <span className="text-yellow-400 text-xs animate-bounce">!</span>
            )}
          </div>
        ))}

        {/* Player */}
        <div
          className="absolute transition-all duration-100 flex items-center justify-center"
          style={{
            left: playerPos.x * TILE,
            top: playerPos.y * TILE,
            width: TILE,
            height: TILE,
          }}
        >
          <PixelSprite sprite={playerSprite} size={3} />
        </div>

        {/* Tooltip */}
        {tooltip && !dialogue && (
          <div className="absolute bottom-2 left-2 right-2 bg-bg/90 border border-bg-border rounded-lg px-3 py-2 text-xs text-text-secondary backdrop-blur">
            {tooltip}
          </div>
        )}

        {/* I8: Mission complete hint — security room has no exit, so prompt player to press Space */}
        {room.id === "security" && completedRooms.has("security") && !dialogue && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-2xl animate-bounce">🏁</span>
          </div>
        )}
      </div>
      </div>

      {/* Dialogue box */}
      {dialogue && currentLine && (
        <div className="mt-3 rounded-xl border border-bg-border bg-bg-card p-4">
          <p className="text-xs font-bold mb-2" style={{ color: room.color }}>
            {dialogue.npc.emoji} {isZh ? dialogue.npc.nameCn : dialogue.npc.name}
          </p>
          <p className="text-sm text-text leading-relaxed">
            {isZh ? currentLine.textCn : currentLine.text}
          </p>
          {currentLine.choices ? (
            <div className="mt-3 space-y-2">
              {currentLine.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => advanceDialogue(i)}
                  className="block w-full text-left px-3 py-2 rounded-lg border border-bg-border text-sm text-text-secondary hover:text-accent-purple hover:border-accent-purple transition-colors"
                >
                  {String.fromCharCode(65 + i)}. {isZh ? choice.labelCn : choice.label}
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={() => advanceDialogue()}
              className="mt-3 text-xs text-text-secondary hover:text-accent-purple transition-colors"
            >
              {isZh ? "[空格键/点击继续]" : "[Space / Click to continue]"}
            </button>
          )}
        </div>
      )}

      {/* Controls hint — keyboard only, hidden on mobile */}
      {!dialogue && (
        <p className="mt-3 text-center text-xs text-text-secondary/50 hidden lg:block">
          {isZh ? "方向键/WASD 移动 · 空格键互动" : "Arrow keys / WASD to move · Space to interact"}
        </p>
      )}

      {/* Touch D-pad for mobile */}
      <div className="mt-3 flex justify-center lg:hidden">
        <div className="grid grid-cols-3 gap-1 w-32">
          <div />
          <button onClick={() => handleMove(0, -1)} className="p-3 rounded bg-bg-card border border-bg-border text-center text-sm">↑</button>
          <div />
          <button onClick={() => handleMove(-1, 0)} className="p-3 rounded bg-bg-card border border-bg-border text-center text-sm">←</button>
          <button onClick={() => handleInteract()} className="p-3 rounded bg-bg-card border border-bg-border text-center text-xs text-accent-purple">ACT</button>
          <button onClick={() => handleMove(1, 0)} className="p-3 rounded bg-bg-card border border-bg-border text-center text-sm">→</button>
          <div />
          <button onClick={() => handleMove(0, 1)} className="p-3 rounded bg-bg-card border border-bg-border text-center text-sm">↓</button>
          <div />
        </div>
      </div>
    </div>
  );
}
