import { useState, useEffect, useCallback, useRef } from "react";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";
import PixelSprite from "./PixelSprite";
import { playerSprite, npcSprites, objectSprites } from "./sprites";

// Types
interface Position { x: number; y: number; }

const TILE = 40;
const ROOM_W = 12;
const ROOM_H = 8;

// --- Wall helpers ---
function makeWalls(exits: { right?: boolean; left?: boolean; rightGateRows?: number[] }) {
  const walls: Position[] = [];
  // top & bottom
  for (let x = 0; x < ROOM_W; x++) { walls.push({ x, y: 0 }); walls.push({ x, y: ROOM_H - 1 }); }
  // left
  for (let y = 0; y < ROOM_H; y++) {
    if (exits.left && (y === 3 || y === 4)) continue;
    walls.push({ x: 0, y });
  }
  // right
  for (let y = 0; y < ROOM_H; y++) {
    if (exits.right && (y === 3 || y === 4)) continue;
    if (exits.rightGateRows && exits.rightGateRows.includes(y)) continue;
    walls.push({ x: ROOM_W - 1, y });
  }
  return walls;
}

// Room metadata (colors, names, walls)
const roomMeta = [
  { id: "entrance", name: "Input Hall", nameCn: "输入大厅", color: "#6c63ff", walls: makeWalls({ right: true }) },
  { id: "api", name: "API Cloud", nameCn: "API 云端", color: "#22d3ee", walls: makeWalls({ left: true, right: true }) },
  { id: "tools", name: "Tool Workshop", nameCn: "工具工坊", color: "#10b981", walls: makeWalls({ left: true, right: true }) },
  { id: "security", name: "Security Checkpoint", nameCn: "安全关卡", color: "#f59e0b", walls: makeWalls({ left: true, rightGateRows: [1, 2, 3, 4, 5, 6] }) },
];

// Room 1 collectible items
const collectibles = [
  { id: "prompt", emoji: "🖥️", label: "User Prompt", labelCn: "用户提示", pos: { x: 3, y: 2 } },
  { id: "rules", emoji: "📁", label: "CLAUDE.md", labelCn: "CLAUDE.md", pos: { x: 7, y: 5 } },
  { id: "memory", emoji: "🧠", label: "Memory", labelCn: "记忆", pos: { x: 2, y: 5 } },
];

// Room 3 tools
interface ToolDef { name: string; type: "read" | "write"; pos: Position; }
const initialTools: ToolDef[] = [
  { name: "Read", type: "read", pos: { x: 2, y: 2 } },
  { name: "Glob", type: "read", pos: { x: 4, y: 3 } },
  { name: "Grep", type: "read", pos: { x: 3, y: 4 } },
  { name: "Edit", type: "write", pos: { x: 7, y: 2 } },
  { name: "Write", type: "write", pos: { x: 9, y: 3 } },
  { name: "Bash", type: "write", pos: { x: 8, y: 4 } },
];
const toolEmoji: Record<string, string> = { Read: "📖", Glob: "📂", Grep: "🔍", Edit: "✏️", Write: "📝", Bash: "💻" };

// Room 4 commands
const securityCommands = [
  { cmd: "git status", answer: "allow" as const },
  { cmd: "rm -rf /", answer: "deny" as const },
  { cmd: "npm install", answer: "ask" as const },
];

interface Props { locale?: Locale; }

export default function PixelRPG({ locale = "en" as Locale }: Props) {
  const isZh = locale === "zh";
  const containerRef = useRef<HTMLDivElement>(null);

  // Shared state
  const [roomIndex, setRoomIndex] = useState(0);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 3 });
  const [gameComplete, setGameComplete] = useState(false);
  const [scale, setScale] = useState(1);
  const [flash, setFlash] = useState<"green" | "red" | null>(null);
  const [flashText, setFlashText] = useState<string | null>(null);

  // Room 1: collect items
  const [inventory, setInventory] = useState<string[]>([]);

  // Room 2: catch tokens
  const [tokens, setTokens] = useState<{ x: number; y: number; id: number; born: number }[]>([]);
  const [tokensCaught, setTokensCaught] = useState(0);
  const tokenIdRef = useRef(0);

  // Room 3: sort tools
  const [carrying, setCarrying] = useState<string | null>(null);
  const [sortedTools, setSortedTools] = useState<string[]>([]);
  const [toolPositions, setToolPositions] = useState<Map<string, Position>>(
    () => new Map(initialTools.map(t => [t.name, { ...t.pos }]))
  );

  // Room 4: gate judgment
  const [currentCommand, setCurrentCommand] = useState(0);

  // Narrative message (shown below the game viewport)
  const [narrative, setNarrative] = useState<string>("");

  const room = roomMeta[roomIndex];

  // Room completion checks
  const isRoomComplete = useCallback((ri: number) => {
    switch (ri) {
      case 0: return inventory.length >= 3;
      case 1: return tokensCaught >= 8;
      case 2: return sortedTools.length >= 6;
      case 3: return currentCommand >= 3;
      default: return false;
    }
  }, [inventory.length, tokensCaught, sortedTools.length, currentCommand]);

  // Trigger flash effect
  const doFlash = useCallback((color: "green" | "red", text?: string) => {
    setFlash(color);
    if (text) setFlashText(text);
    setTimeout(() => { setFlash(null); setFlashText(null); }, 600);
  }, []);

  // Wall check
  const isWall = useCallback((x: number, y: number) => {
    return room.walls.some(w => w.x === x && w.y === y);
  }, [room.walls]);

  // Reset room-specific state when entering a new room
  const introKeys = ["games.pg.room1Intro", "games.pg.room2Intro", "games.pg.room3Intro", "games.pg.room4Intro"];
  const enterRoom = useCallback((ri: number, fromLeft: boolean) => {
    setRoomIndex(ri);
    setPlayerPos({ x: fromLeft ? 1 : ROOM_W - 2, y: 3 });
    setFlash(null);
    setFlashText(null);

    if (ri === 1) {
      setTokens([]);
      setTokensCaught(0);
      tokenIdRef.current = 0;
    }
    if (ri === 2) {
      setCarrying(null);
      setSortedTools([]);
      setToolPositions(new Map(initialTools.map(t => [t.name, { ...t.pos }])));
    }
    if (ri === 3) {
      setCurrentCommand(0);
    }
    setNarrative(t(locale, introKeys[ri]));
  }, [locale]);

  // Set initial narrative
  useEffect(() => { setNarrative(t(locale, "games.pg.room1Intro")); }, [locale]);

  // Handle movement
  const handleMove = useCallback((dx: number, dy: number) => {
    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;
    const ri = roomIndex;

    // --- Room transitions ---
    // Right exit (rooms 0-2)
    if (ri < 3 && nx === ROOM_W && (ny === 3 || ny === 4)) {
      if (!isRoomComplete(ri)) return; // locked
      enterRoom(ri + 1, true);
      return;
    }
    // Left exit (rooms 1-3)
    if (ri > 0 && nx === -1 && (ny === 3 || ny === 4)) {
      enterRoom(ri - 1, false);
      return;
    }

    // Bounds
    if (nx < 0 || ny < 0 || nx >= ROOM_W || ny >= ROOM_H) return;

    // --- Room 4: gate check (walking into x=11) ---
    if (ri === 3 && nx === ROOM_W - 1 && ny >= 1 && ny <= 6 && currentCommand < 3) {
      let gate: "allow" | "deny" | "ask";
      if (ny <= 2) gate = "allow";
      else if (ny <= 4) gate = "deny";
      else gate = "ask";

      const correct = securityCommands[currentCommand].answer === gate;
      if (correct) {
        doFlash("green", t(locale, "games.pg.correctGate"));
        setCurrentCommand(c => c + 1);
        if (currentCommand + 1 >= 3) {
          setTimeout(() => setNarrative(t(locale, "games.pg.gateComplete")), 500);
          // game complete after short delay
          setTimeout(() => setGameComplete(true), 800);
        }
      } else {
        doFlash("red", t(locale, "games.pg.wrongGate"));
      }
      return; // don't move into the wall
    }

    if (isWall(nx, ny)) return;

    // --- Room 1: pick up collectibles ---
    if (ri === 0) {
      const item = collectibles.find(c => c.pos.x === nx && c.pos.y === ny && !inventory.includes(c.id));
      if (item) {
        const newInventory = [...inventory, item.id];
        setInventory(newInventory);
        doFlash("green");
        // Narrative feedback
        const pickupKeys: Record<string, string> = {
          prompt: "games.pg.gotPrompt",
          rules: "games.pg.gotRules",
          memory: "games.pg.gotMemory",
        };
        setNarrative(t(locale, pickupKeys[item.id]));
        if (newInventory.length >= 3) {
          setTimeout(() => setNarrative(t(locale, "games.pg.allCollected")), 1500);
        }
      }
    }

    // --- Room 2: catch tokens ---
    if (ri === 1) {
      const caught = tokens.find(tk => tk.x === nx && tk.y === ny);
      if (caught) {
        setTokens(prev => prev.filter(tk => tk.id !== caught.id));
        const newCount = tokensCaught + 1;
        setTokensCaught(newCount);
        doFlash("green");
        setNarrative(t(locale, "games.pg.tokenProgress"));
        if (newCount >= 8) {
          setTimeout(() => setNarrative(t(locale, "games.pg.tokensComplete")), 500);
        }
      }
    }

    // --- Room 3: pick up / place tools ---
    if (ri === 2) {
      if (!carrying) {
        // Try to pick up a tool at this position
        for (const [name, pos] of toolPositions.entries()) {
          if (pos.x === nx && pos.y === ny && !sortedTools.includes(name)) {
            setCarrying(name);
            doFlash("green");
            break;
          }
        }
      } else {
        // Check if stepping into a zone
        const inParallel = nx >= 1 && nx <= 4 && ny >= 5 && ny <= 6;
        const inSerial = nx >= 7 && nx <= 10 && ny >= 5 && ny <= 6;
        if (inParallel || inSerial) {
          const toolDef = initialTools.find(t => t.name === carrying);
          const zone = inParallel ? "parallel" : "serial";
          const correct = (toolDef!.type === "read" && zone === "parallel") ||
                          (toolDef!.type === "write" && zone === "serial");
          if (correct) {
            const newSorted = [...sortedTools, carrying!];
            setSortedTools(newSorted);
            setToolPositions(prev => {
              const next = new Map(prev);
              next.set(carrying!, { x: nx, y: ny });
              return next;
            });
            doFlash("green", t(locale, "games.pg.correctSort"));
            if (newSorted.length >= 6) {
              setTimeout(() => setNarrative(t(locale, "games.pg.sortComplete")), 500);
            }
          } else {
            // Return tool to original position
            const orig = initialTools.find(t => t.name === carrying)!;
            setToolPositions(prev => {
              const next = new Map(prev);
              next.set(carrying!, { ...orig.pos });
              return next;
            });
            doFlash("red", t(locale, "games.pg.wrongSort"));
          }
          setCarrying(null);
        }
      }
    }

    setPlayerPos({ x: nx, y: ny });
  }, [playerPos, roomIndex, isWall, isRoomComplete, enterRoom, inventory, tokens, carrying, toolPositions, sortedTools, currentCommand, doFlash, isZh, locale]);

  // Room 2: token spawning
  useEffect(() => {
    if (roomIndex !== 1) return;
    if (tokensCaught >= 8) return;
    const interval = setInterval(() => {
      // Spawn a token at a random walkable position
      const wallSet = new Set(roomMeta[1].walls.map(w => `${w.x},${w.y}`));
      let x: number, y: number;
      let attempts = 0;
      do {
        x = 1 + Math.floor(Math.random() * (ROOM_W - 2));
        y = 1 + Math.floor(Math.random() * (ROOM_H - 2));
        attempts++;
      } while (wallSet.has(`${x},${y}`) && attempts < 50);

      const id = ++tokenIdRef.current;
      setTokens(prev => {
        // Max 5 tokens on screen
        if (prev.length >= 5) return prev;
        return [...prev, { x, y, id, born: Date.now() }];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [roomIndex, tokensCaught]);

  // Room 2: token expiry (3 seconds)
  useEffect(() => {
    if (roomIndex !== 1) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setTokens(prev => prev.filter(tk => now - tk.born < 3000));
    }, 500);
    return () => clearInterval(interval);
  }, [roomIndex]);

  // Keyboard handler
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case "ArrowUp": case "w": case "W": e.preventDefault(); handleMove(0, -1); break;
        case "ArrowDown": case "s": case "S": e.preventDefault(); handleMove(0, 1); break;
        case "ArrowLeft": case "a": case "A": e.preventDefault(); handleMove(-1, 0); break;
        case "ArrowRight": case "d": case "D": e.preventDefault(); handleMove(1, 0); break;
      }
    }
    const el = containerRef.current;
    if (el) el.addEventListener("keydown", onKey);
    return () => { if (el) el.removeEventListener("keydown", onKey); };
  }, [handleMove]);

  // Focus management
  const refocusGame = useCallback(() => {
    requestAnimationFrame(() => containerRef.current?.focus());
  }, []);
  useEffect(() => { containerRef.current?.focus(); }, []);
  useEffect(() => { refocusGame(); }, [roomIndex, refocusGame]);

  // Responsive scaling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const containerWidth = el.clientWidth;
      const gameWidth = ROOM_W * TILE;
      setScale(Math.min(1, containerWidth / gameWidth));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // --- GAME COMPLETE SCREEN ---
  if (gameComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <p className="text-6xl">🎉</p>
        <h2 className="text-3xl font-bold text-accent-purple">
          {isZh ? "任务完成！" : "Quest Complete!"}
        </h2>
        <p className="text-text-secondary">
          {isZh
            ? "你成功地将一条用户消息送过了 Claude Code 的整个管线：收集上下文 → 接住 Token → 分拣工具 → 安全审判。"
            : "You guided a message through Claude Code's entire pipeline: Collect Context → Catch Tokens → Sort Tools → Security Judgment."
          }
        </p>
        <button
          onClick={() => {
            setRoomIndex(0); setPlayerPos({ x: 1, y: 3 }); setGameComplete(false);
            setInventory([]); setTokensCaught(0); setTokens([]);
            setCarrying(null); setSortedTools([]);
            setToolPositions(new Map(initialTools.map(t => [t.name, { ...t.pos }])));
            setCurrentCommand(0);
          }}
          className="px-6 py-3 rounded-lg bg-accent-purple text-white font-bold hover:bg-accent-purple/80 transition-colors"
        >
          {isZh ? "再玩一次" : "Play Again"}
        </button>
      </div>
    );
  }

  // --- HUD for each room ---
  const renderHUD = () => {
    switch (roomIndex) {
      case 0:
        return (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-text-secondary">{t(locale, "games.pg.inventory")}:</span>
            {collectibles.map(c => (
              <span key={c.id} className={`text-base ${inventory.includes(c.id) ? "" : "opacity-20"}`}>
                {c.emoji}
              </span>
            ))}
            {inventory.length >= 3 && <span className="text-accent-emerald ml-1">✓</span>}
          </div>
        );
      case 1:
        return (
          <div className="text-xs font-bold text-text-secondary">
            {t(locale, "games.pg.tokens")}: {tokensCaught}/8
            {tokensCaught >= 8 && <span className="text-accent-emerald ml-1">✓</span>}
          </div>
        );
      case 2:
        return (
          <div className="text-xs font-bold text-text-secondary">
            {carrying && (
              <span className="mr-3 text-accent-purple">
                {t(locale, "games.pg.carrying")}: {toolEmoji[carrying]} {carrying}
              </span>
            )}
            {t(locale, "games.pg.sorted")}: {sortedTools.length}/6
            {sortedTools.length >= 6 && <span className="text-accent-emerald ml-1">✓</span>}
          </div>
        );
      case 3:
        return (
          <div className="text-xs font-bold text-text-secondary">
            {t(locale, "games.pg.commands")}: {Math.min(currentCommand, 3)}/3
            {currentCommand >= 3 && <span className="text-accent-emerald ml-1">✓</span>}
          </div>
        );
    }
  };

  // Is the exit on the right unlocked?
  const exitUnlocked = isRoomComplete(roomIndex);

  return (
    <div ref={containerRef} tabIndex={0} className="outline-none max-w-2xl mx-auto">
      {/* Room header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: room.color }} />
          <span className="text-sm font-bold" style={{ color: room.color }}>
            {isZh ? room.nameCn : room.name}
          </span>
        </div>
        <div className="flex gap-1">
          {roomMeta.map((r, i) => (
            <span
              key={r.id}
              className={`w-6 h-2 rounded-full ${
                isRoomComplete(i) && i < roomIndex ? "bg-accent-emerald" :
                i === roomIndex ? "bg-accent-purple" : "bg-bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* HUD */}
      <div className="flex items-center justify-end mb-2 px-1">
        {renderHUD()}
      </div>

      {/* Game viewport */}
      <div style={{ height: `${ROOM_H * TILE * scale}px`, overflow: "hidden" }}>
      <div
        className="relative rounded-xl border-2 overflow-hidden bg-bg"
        style={{
          borderColor: room.color,
          width: `${ROOM_W * TILE}px`,
          height: `${ROOM_H * TILE}px`,
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

        {/* Flash overlay */}
        {flash && (
          <div className="absolute inset-0 pointer-events-none z-30 transition-opacity" style={{
            backgroundColor: flash === "green" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
          }} />
        )}

        {/* Flash text */}
        {flashText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <span className={`text-lg font-bold px-3 py-1 rounded ${flash === "green" ? "text-accent-emerald bg-bg/80" : "text-red-400 bg-bg/80"}`}>
              {flashText}
            </span>
          </div>
        )}

        {/* Walls */}
        {room.walls.map((w, i) => (
          <div
            key={`w${i}`}
            className="absolute bg-bg-card border border-bg-border"
            style={{ left: w.x * TILE, top: w.y * TILE, width: TILE, height: TILE }}
          />
        ))}

        {/* --- Room-specific rendering --- */}

        {/* Room 1: Collectible items */}
        {roomIndex === 0 && collectibles.map(c => (
          !inventory.includes(c.id) && (
            <div key={c.id} className="absolute flex items-center justify-center animate-pulse"
              style={{ left: c.pos.x * TILE, top: c.pos.y * TILE, width: TILE, height: TILE }}>
              {objectSprites[c.emoji] ? (
                <PixelSprite sprite={objectSprites[c.emoji]} size={4} />
              ) : (
                <span className="text-lg">{c.emoji}</span>
              )}
            </div>
          )
        ))}

        {/* Room 2: Tokens */}
        {roomIndex === 1 && tokens.map(tk => {
          const age = (Date.now() - tk.born) / 3000; // 0 to 1
          return (
            <div key={tk.id} className="absolute flex items-center justify-center"
              style={{
                left: tk.x * TILE + TILE / 4,
                top: tk.y * TILE + TILE / 4,
                width: TILE / 2,
                height: TILE / 2,
                opacity: Math.max(0.2, 1 - age),
                transition: "opacity 0.3s",
              }}>
              <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: ["#6c63ff", "#22d3ee", "#10b981", "#f59e0b", "#ec4899"][tk.id % 5],
              }} />
            </div>
          );
        })}

        {/* Room 3: Zone highlights */}
        {roomIndex === 2 && (
          <>
            {/* Parallel zone */}
            <div className="absolute border-2 border-cyan-400/40 rounded"
              style={{
                left: 1 * TILE, top: 5 * TILE,
                width: 4 * TILE, height: 2 * TILE,
                backgroundColor: "rgba(34,211,238,0.08)",
              }}>
              <span className="absolute top-0 left-1 text-[10px] font-bold text-cyan-400">
                {t(locale, "games.pg.parallel")}
              </span>
            </div>
            {/* Serial zone */}
            <div className="absolute border-2 border-amber-400/40 rounded"
              style={{
                left: 7 * TILE, top: 5 * TILE,
                width: 4 * TILE, height: 2 * TILE,
                backgroundColor: "rgba(245,158,11,0.08)",
              }}>
              <span className="absolute top-0 left-1 text-[10px] font-bold text-amber-400">
                {t(locale, "games.pg.serial")}
              </span>
            </div>
          </>
        )}

        {/* Room 3: Tool items */}
        {roomIndex === 2 && initialTools.map(td => {
          const pos = toolPositions.get(td.name);
          if (!pos) return null;
          const isSorted = sortedTools.includes(td.name);
          const isCarried = carrying === td.name;
          if (isCarried) return null; // don't render if being carried
          return (
            <div key={td.name} className={`absolute flex flex-col items-center justify-center ${isSorted ? "opacity-60" : ""}`}
              style={{ left: pos.x * TILE, top: pos.y * TILE, width: TILE, height: TILE }}>
              <span className="text-sm">{toolEmoji[td.name]}</span>
              <span className="text-[8px] font-mono text-text-secondary">{td.name}</span>
            </div>
          );
        })}

        {/* Room 4: Gates */}
        {roomIndex === 3 && (
          <>
            {/* Allow gate */}
            <div className="absolute flex items-center justify-center"
              style={{ left: (ROOM_W - 1) * TILE, top: 1 * TILE, width: TILE, height: 2 * TILE, backgroundColor: "rgba(34,197,94,0.2)", borderLeft: "3px solid #22c55e" }}>
              <span className="text-[10px] font-bold text-green-400">{t(locale, "games.pg.allowGate")}</span>
            </div>
            {/* Deny gate */}
            <div className="absolute flex items-center justify-center"
              style={{ left: (ROOM_W - 1) * TILE, top: 3 * TILE, width: TILE, height: 2 * TILE, backgroundColor: "rgba(239,68,68,0.2)", borderLeft: "3px solid #ef4444" }}>
              <span className="text-[10px] font-bold text-red-400">{t(locale, "games.pg.denyGate")}</span>
            </div>
            {/* Ask gate */}
            <div className="absolute flex items-center justify-center"
              style={{ left: (ROOM_W - 1) * TILE, top: 5 * TILE, width: TILE, height: 2 * TILE, backgroundColor: "rgba(168,85,247,0.2)", borderLeft: "3px solid #a855f7" }}>
              <span className="text-[10px] font-bold text-purple-400">{t(locale, "games.pg.askGate")}</span>
            </div>
            {/* Command display */}
            {currentCommand < 3 && (
              <div className="absolute flex items-center justify-center z-20"
                style={{ left: 2 * TILE, top: 3 * TILE, width: 7 * TILE, height: 2 * TILE }}>
                <div className="bg-bg/90 border border-bg-border rounded-lg px-4 py-2 text-center">
                  <span className="text-[10px] text-text-secondary block mb-1">
                    {isZh ? "判断这条命令：" : "Judge this command:"}
                  </span>
                  <code className="text-sm font-mono font-bold text-accent-purple">
                    {securityCommands[currentCommand].cmd}
                  </code>
                </div>
              </div>
            )}
          </>
        )}

        {/* Right exit indicator */}
        {roomIndex < 3 && (
          <div
            className={`absolute flex items-center justify-center text-sm ${exitUnlocked ? "animate-pulse" : ""}`}
            style={{
              left: (ROOM_W - 1) * TILE, top: 3 * TILE,
              width: TILE, height: TILE * 2,
              color: exitUnlocked ? room.color : "#ef4444",
            }}
          >
            {exitUnlocked ? "→" : "🔒"}
          </div>
        )}

        {/* Left exit indicator */}
        {roomIndex > 0 && (
          <div
            className="absolute flex items-center justify-center text-xs animate-pulse"
            style={{ left: 0, top: 3 * TILE, width: TILE, height: TILE * 2, color: room.color }}
          >
            ←
          </div>
        )}

        {/* Player */}
        <div
          className="absolute transition-all duration-100 flex items-center justify-center z-10"
          style={{
            left: playerPos.x * TILE,
            top: playerPos.y * TILE,
            width: TILE,
            height: TILE,
          }}
        >
          <PixelSprite sprite={playerSprite} size={3} />
        </div>
      </div>
      </div>

      {/* Narrative text */}
      {narrative && (
        <div className="mt-3 rounded-lg border border-bg-border bg-bg-card px-4 py-3">
          <p className="text-sm text-text-secondary leading-relaxed">{narrative}</p>
        </div>
      )}

      {/* Controls hint */}
      <p className="mt-3 text-center text-xs text-text-secondary/50 hidden lg:block">
        {isZh ? "方向键/WASD 移动" : "Arrow keys / WASD to move"}
      </p>

      {/* Touch D-pad for mobile */}
      <div className="mt-3 flex justify-center lg:hidden">
        <div className="grid grid-cols-3 gap-1 w-32">
          <div />
          <button onMouseDown={e => e.preventDefault()} onClick={() => { handleMove(0, -1); refocusGame(); }} className="p-3 rounded bg-bg-card border border-bg-border text-center text-sm">↑</button>
          <div />
          <button onMouseDown={e => e.preventDefault()} onClick={() => { handleMove(-1, 0); refocusGame(); }} className="p-3 rounded bg-bg-card border border-bg-border text-center text-sm">←</button>
          <div />
          <button onMouseDown={e => e.preventDefault()} onClick={() => { handleMove(1, 0); refocusGame(); }} className="p-3 rounded bg-bg-card border border-bg-border text-center text-sm">→</button>
          <div />
          <button onMouseDown={e => e.preventDefault()} onClick={() => { handleMove(0, 1); refocusGame(); }} className="p-3 rounded bg-bg-card border border-bg-border text-center text-sm">↓</button>
          <div />
        </div>
      </div>
    </div>
  );
}
