import { useState, useEffect, useCallback, useRef } from "react";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";

// ─── Constants ───────────────────────────────────────────
const COLS = 10;
const ROWS = 20;
const CELL = 28;

type ToolType = "read" | "write" | "danger" | "star";
const READ_TOOLS = ["Read", "Glob", "Grep"];
const WRITE_TOOLS = ["Edit", "Write", "Bash"];

interface CellData {
  type: ToolType;
  toolName: string;
}

interface Piece {
  shape: number[][];
  x: number;
  y: number;
  type: ToolType;
  toolName: string;
}

type GameState = "tutorial" | "start" | "playing" | "paused" | "over";

// Standard Tetris shapes (each rotation is a 2D array)
const SHAPES: number[][][] = [
  // I
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  // O
  [[1,1],[1,1]],
  // T
  [[0,1,0],[1,1,1],[0,0,0]],
  // S
  [[0,1,1],[1,1,0],[0,0,0]],
  // Z
  [[1,1,0],[0,1,1],[0,0,0]],
  // L
  [[0,0,1],[1,1,1],[0,0,0]],
  // J
  [[1,0,0],[1,1,1],[0,0,0]],
];

function rotateMatrix(m: number[][]): number[][] {
  const n = m.length;
  const r: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) r[x][n - 1 - y] = m[y][x];
  return r;
}

function createEmptyBoard(): (CellData | null)[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

// Color helpers
function cellColor(type: ToolType): string {
  switch (type) {
    case "read": return "rgba(34,211,238,0.6)";
    case "write": return "rgba(245,158,11,0.6)";
    case "danger": return "rgba(239,68,68,0.7)";
    case "star": return "rgba(168,85,247,0.7)";
  }
}
function cellBorder(type: ToolType): string {
  switch (type) {
    case "read": return "rgba(34,211,238,0.9)";
    case "write": return "rgba(245,158,11,0.9)";
    case "danger": return "rgba(239,68,68,1)";
    case "star": return "rgba(168,85,247,1)";
  }
}

interface Props { locale?: Locale; }

export default function ToolTetris({ locale = "en" as Locale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<(CellData | null)[][]>(createEmptyBoard());
  const pieceRef = useRef<Piece | null>(null);
  const nextPieceRef = useRef<Piece | null>(null);

  // Display state
  const [, forceRender] = useState(0);
  const render = useCallback(() => forceRender(c => c + 1), []);

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameState, setGameState] = useState<GameState>("tutorial");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [agentCharges, setAgentCharges] = useState(0);
  const [scale, setScale] = useState(1);

  // Refs for mutable game state
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const linesRef = useRef(0);
  const comboRef = useRef(0);
  const gameStateRef = useRef<GameState>("tutorial");
  const animFrameRef = useRef(0);
  const lastDropRef = useRef(0);
  const gameStartRef = useRef(0);
  const lastDangerRef = useRef(0);
  const lastStarRef = useRef(0);
  const agentChargesRef = useRef(0);
  const agentScoreThreshRef = useRef(200);
  const effectsRef = useRef<Map<string, number>>(new Map());
  const serialClearingRef = useRef(false);
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMsg = useCallback((msg: string, dur = 1500) => {
    setMessage(msg);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = setTimeout(() => setMessage(null), dur);
  }, []);

  const getDropSpeed = useCallback(() => {
    let speed = Math.max(100, 800 - (levelRef.current - 1) * 70);
    if (effectsRef.current.has("SLOW_MODE")) speed *= 2;
    return speed;
  }, []);

  // ─── Piece creation ────────────────────────────────────
  const createPiece = useCallback((forceType?: ToolType): Piece => {
    const now = Date.now();
    const elapsed = (now - gameStartRef.current) / 1000;
    let type: ToolType = "read";

    if (forceType) {
      type = forceType;
    } else {
      const r = Math.random();
      const dangerOk = elapsed > 30 && (now - lastDangerRef.current) > 30000;
      const starOk = elapsed > 45 && (now - lastStarRef.current) > 45000;
      if (dangerOk && r < 0.12) {
        type = "danger";
        lastDangerRef.current = now;
      } else if (starOk && r < 0.20) {
        type = "star";
        lastStarRef.current = now;
      } else {
        type = Math.random() < 0.5 ? "read" : "write";
      }
    }

    let toolName = "";
    switch (type) {
      case "read": toolName = READ_TOOLS[Math.floor(Math.random() * READ_TOOLS.length)]; break;
      case "write": toolName = WRITE_TOOLS[Math.floor(Math.random() * WRITE_TOOLS.length)]; break;
      case "danger": toolName = "rm -rf"; break;
      case "star": toolName = "Feature Flag"; break;
    }

    const shapeIdx = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[shapeIdx].map(r => [...r]);
    const w = shape[0].length;

    return { shape, x: Math.floor((COLS - w) / 2), y: 0, type, toolName };
  }, []);

  // ─── Collision detection ───────────────────────────────
  const collides = useCallback((shape: number[][], px: number, py: number): boolean => {
    const board = boardRef.current;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const nx = px + c;
        const ny = py + r;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
    }
    return false;
  }, []);

  // ─── Lock piece & check rows ───────────────────────────
  const lockAndCheck = useCallback(() => {
    const piece = pieceRef.current;
    if (!piece) return;
    const board = boardRef.current;

    // Write piece to board
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue;
        const ny = piece.y + r;
        const nx = piece.x + c;
        if (ny < 0) {
          // Game over
          gameStateRef.current = "over";
          setGameState("over");
          cancelAnimationFrame(animFrameRef.current);
          return;
        }
        board[ny][nx] = { type: piece.type, toolName: piece.toolName };
      }
    }

    // Danger explosion
    if (piece.type === "danger") {
      showMsg(t(locale, "games.ts.dangerLanded"));
      const cx = piece.x + Math.floor(piece.shape[0].length / 2);
      const cy = piece.y + Math.floor(piece.shape.length / 2);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ey = cy + dy;
          const ex = cx + dx;
          if (ey >= 0 && ey < ROWS && ex >= 0 && ex < COLS) {
            board[ey][ex] = null;
          }
        }
      }
      spawnNext();
      render();
      return;
    }

    // Find complete rows
    const fullRows: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      if (board[r].every(c => c !== null)) fullRows.push(r);
    }

    if (fullRows.length > 0) {
      // Classify rows
      const blueRows = fullRows.filter(r => board[r].every(c => c!.type === "read"));
      const orangeRows = fullRows.filter(r => !board[r].every(c => c!.type === "read"));

      // Check for star power-ups in any cleared row
      let hasStar = false;
      for (const r of fullRows) {
        if (board[r].some(c => c!.type === "star")) hasStar = true;
      }

      // Blue rows clear instantly
      if (blueRows.length > 0) {
        const newCombo = comboRef.current + 1;
        comboRef.current = newCombo;
        setCombo(newCombo);
        const multiplier = Math.pow(2, Math.min(newCombo - 1, 3));
        const pts = blueRows.length * 100 * levelRef.current * multiplier;
        scoreRef.current += pts;
        setScore(scoreRef.current);
        showMsg(t(locale, "games.ts.parallelClear") + ` +${pts}`);

        // Sort descending to avoid index corruption during splice
        for (const r of [...blueRows].sort((a, b) => b - a)) {
          board.splice(r, 1);
          board.unshift(Array(COLS).fill(null));
        }
      }

      // Orange rows clear with delay
      if (orangeRows.length > 0) {
        comboRef.current = 0;
        setCombo(0);
        serialClearingRef.current = true;
        showMsg(t(locale, "games.ts.serialClear"), 1000);

        // Capture the actual row contents to match later (indices may shift)
        const orangeRowContents = orangeRows.map(r => board[r]);
        setTimeout(() => {
          const pts = orangeRows.length * 50 * levelRef.current;
          scoreRef.current += pts;
          setScore(scoreRef.current);
          // Find the original orange rows by content reference (not index, since blue rows may have shifted things)
          const currentBoard = boardRef.current;
          const toRemove: number[] = [];
          for (let r = 0; r < ROWS; r++) {
            if (orangeRowContents.includes(currentBoard[r])) toRemove.push(r);
          }
          for (const r of toRemove.sort((a, b) => b - a)) {
            currentBoard.splice(r, 1);
            currentBoard.unshift(Array(COLS).fill(null));
          }
          serialClearingRef.current = false;
          render();
        }, 1000);
      }

      // Update lines and level
      const newLines = linesRef.current + fullRows.length;
      linesRef.current = newLines;
      setLines(newLines);
      const newLevel = Math.floor(newLines / 10) + 1;
      if (newLevel !== levelRef.current) {
        levelRef.current = newLevel;
        setLevel(newLevel);
      }

      // Agent charges
      if (scoreRef.current >= agentScoreThreshRef.current) {
        agentChargesRef.current += 1;
        agentScoreThreshRef.current += 200;
        setAgentCharges(agentChargesRef.current);
      }

      // Star power-up
      if (hasStar) activatePowerUp();
    }

    // Check compression
    checkCompression();

    spawnNext();
    render();
  }, [locale, render, showMsg]);

  // ─── Spawn next piece ──────────────────────────────────
  const spawnNext = useCallback(() => {
    const next = nextPieceRef.current || createPiece();
    pieceRef.current = next;
    nextPieceRef.current = createPiece();
    // Check if spawn position is blocked
    if (collides(next.shape, next.x, next.y)) {
      gameStateRef.current = "over";
      setGameState("over");
      cancelAnimationFrame(animFrameRef.current);
    }
  }, [createPiece, collides]);

  // ─── Power-ups ─────────────────────────────────────────
  const activatePowerUp = useCallback(() => {
    const effects = ["SLOW_MODE", "CLEAR_COLUMN", "READ_ONLY"];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    const board = boardRef.current;

    switch (effect) {
      case "SLOW_MODE":
        effectsRef.current.set("SLOW_MODE", Date.now() + 10000);
        setActiveEffects(prev => [...prev.filter(e => e !== "SLOW_MODE"), "SLOW_MODE"]);
        showMsg(t(locale, "games.ts.slowMode"));
        setTimeout(() => {
          effectsRef.current.delete("SLOW_MODE");
          setActiveEffects(prev => prev.filter(e => e !== "SLOW_MODE"));
        }, 10000);
        break;

      case "CLEAR_COLUMN": {
        const col = Math.floor(Math.random() * COLS);
        for (let r = 0; r < ROWS; r++) board[r][col] = null;
        // Gravity: shift down
        for (let c = 0; c < COLS; c++) {
          let writePos = ROWS - 1;
          for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][c]) {
              if (r !== writePos) {
                board[writePos][c] = board[r][c];
                board[r][c] = null;
              }
              writePos--;
            }
          }
        }
        showMsg(t(locale, "games.ts.clearColumn"));
        break;
      }

      case "READ_ONLY":
        effectsRef.current.set("READ_ONLY", Date.now() + 10000);
        setActiveEffects(prev => [...prev.filter(e => e !== "READ_ONLY"), "READ_ONLY"]);
        // Convert all orange blocks to blue
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const cell = board[r][c];
            if (cell && cell.type === "write") {
              board[r][c] = { type: "read", toolName: cell.toolName };
            }
          }
        }
        showMsg(t(locale, "games.ts.readOnly"));
        setTimeout(() => {
          effectsRef.current.delete("READ_ONLY");
          setActiveEffects(prev => prev.filter(e => e !== "READ_ONLY"));
        }, 10000);
        break;
    }
    render();
  }, [locale, render, showMsg]);

  // ─── Compression ───────────────────────────────────────
  const checkCompression = useCallback(() => {
    const board = boardRef.current;
    let filledRows = 0;
    for (let r = 0; r < ROWS; r++) {
      if (board[r].some(c => c !== null)) filledRows++;
    }
    if (filledRows >= 16) {
      showMsg(t(locale, "games.ts.compacting"));
      // Merge bottom 3 rows into 1
      const merged: (CellData | null)[] = Array(COLS).fill(null);
      for (let c = 0; c < COLS; c++) {
        for (let r = ROWS - 3; r < ROWS; r++) {
          if (board[r][c]) { merged[c] = board[r][c]; break; }
        }
      }
      board.splice(ROWS - 3, 3, merged);
      board.unshift(Array(COLS).fill(null), Array(COLS).fill(null));
    }
  }, [locale, showMsg]);

  // ─── Agent helper ──────────────────────────────────────
  const useAgent = useCallback(() => {
    if (agentChargesRef.current <= 0) {
      showMsg(t(locale, "games.ts.noAgent"));
      return;
    }
    const current = pieceRef.current;
    if (!current) return;

    agentChargesRef.current -= 1;
    setAgentCharges(agentChargesRef.current);
    showMsg(t(locale, "games.ts.agentDeployed"));

    // Simple AI: try each position and rotation for the CURRENT piece
    const board = boardRef.current;
    let bestX = current.x;
    let bestRot = current.shape;
    let bestScore = Infinity;

    let shape = current.shape;
    for (let rot = 0; rot < 4; rot++) {
      for (let x = -1; x < COLS; x++) {
        let y = 0;
        while (!collides(shape, x, y + 1)) y++;
        if (collides(shape, x, y)) continue;

        const testBoard = board.map(r => [...r]);
        for (let r = 0; r < shape.length; r++) {
          for (let c = 0; c < shape[r].length; c++) {
            if (!shape[r][c]) continue;
            const ny = y + r;
            const nx = x + c;
            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
              testBoard[ny][nx] = { type: current.type, toolName: current.toolName };
            }
          }
        }

        let holes = 0;
        for (let c = 0; c < COLS; c++) {
          let foundBlock = false;
          for (let r = 0; r < ROWS; r++) {
            if (testBoard[r][c]) foundBlock = true;
            else if (foundBlock) holes++;
          }
        }
        let maxH = 0;
        for (let c = 0; c < COLS; c++) {
          for (let r = 0; r < ROWS; r++) {
            if (testBoard[r][c]) { maxH = Math.max(maxH, ROWS - r); break; }
          }
        }
        const evalScore = holes * 3 + maxH;
        if (evalScore < bestScore) {
          bestScore = evalScore;
          bestX = x;
          bestRot = shape.map(r => [...r]);
        }
      }
      shape = rotateMatrix(shape);
    }

    // Auto-place the current piece at the best position
    pieceRef.current = { ...current, shape: bestRot, x: bestX, y: 0 };
    let dropY = 0;
    while (!collides(bestRot, bestX, dropY + 1)) dropY++;
    pieceRef.current.y = dropY;
    lockAndCheck();
  }, [locale, collides, lockAndCheck, showMsg]);

  // ─── Movement ──────────────────────────────────────────
  const move = useCallback((dx: number, dy: number): boolean => {
    const piece = pieceRef.current;
    if (!piece) return false;
    if (!collides(piece.shape, piece.x + dx, piece.y + dy)) {
      piece.x += dx;
      piece.y += dy;
      render();
      return true;
    }
    return false;
  }, [collides, render]);

  const rotate = useCallback(() => {
    const piece = pieceRef.current;
    if (!piece) return;
    const rotated = rotateMatrix(piece.shape);
    // Try normal, then wall kicks
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      if (!collides(rotated, piece.x + kick, piece.y)) {
        piece.shape = rotated;
        piece.x += kick;
        render();
        return;
      }
    }
  }, [collides, render]);

  const hardDrop = useCallback(() => {
    const piece = pieceRef.current;
    if (!piece) return;
    let dropped = 0;
    while (!collides(piece.shape, piece.x, piece.y + 1)) {
      piece.y++;
      dropped++;
    }
    scoreRef.current += dropped * 2;
    setScore(scoreRef.current);
    lockAndCheck();
  }, [collides, lockAndCheck]);

  // ─── Deny danger ───────────────────────────────────────
  const denyDanger = useCallback(() => {
    const piece = pieceRef.current;
    if (!piece || piece.type !== "danger") return;
    scoreRef.current += 50;
    setScore(scoreRef.current);
    showMsg(t(locale, "games.ts.denied"));
    spawnNext();
    render();
  }, [locale, render, showMsg, spawnNext]);

  // ─── Keyboard ──────────────────────────────────────────
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (gameStateRef.current !== "playing") return;
    if (serialClearingRef.current) return;

    switch (e.key) {
      case "ArrowLeft": e.preventDefault(); move(-1, 0); break;
      case "ArrowRight": e.preventDefault(); move(1, 0); break;
      case "ArrowDown":
        e.preventDefault();
        if (move(0, 1)) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
        }
        break;
      case "ArrowUp": e.preventDefault(); rotate(); break;
      case " ":
        e.preventDefault();
        hardDrop();
        break;
      case "x": case "X": denyDanger(); break;
      case "a": case "A": useAgent(); break;
      case "p": case "P":
        gameStateRef.current = "paused";
        setGameState("paused");
        break;
    }
  }, [move, rotate, hardDrop, denyDanger, useAgent]);

  // ─── Game loop ─────────────────────────────────────────
  const gameLoop = useCallback((timestamp: number) => {
    if (gameStateRef.current !== "playing") return;

    if (timestamp - lastDropRef.current >= getDropSpeed()) {
      lastDropRef.current = timestamp;
      const piece = pieceRef.current;
      if (piece && !serialClearingRef.current) {
        if (!collides(piece.shape, piece.x, piece.y + 1)) {
          piece.y++;
          render();
        } else {
          lockAndCheck();
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [collides, getDropSpeed, lockAndCheck, render]);

  // ─── Start game ────────────────────────────────────────
  const startGame = useCallback(() => {
    boardRef.current = createEmptyBoard();
    scoreRef.current = 0;
    levelRef.current = 1;
    linesRef.current = 0;
    comboRef.current = 0;
    agentChargesRef.current = 0;
    agentScoreThreshRef.current = 200;
    effectsRef.current.clear();
    serialClearingRef.current = false;
    gameStartRef.current = Date.now();
    lastDangerRef.current = Date.now();
    lastStarRef.current = Date.now();

    setScore(0);
    setLevel(1);
    setLines(0);
    setCombo(0);
    setAgentCharges(0);
    setActiveEffects([]);
    setMessage(null);

    pieceRef.current = createPiece();
    nextPieceRef.current = createPiece();
    gameStateRef.current = "playing";
    setGameState("playing");
    lastDropRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(gameLoop);
    render();
  }, [createPiece, gameLoop, render]);

  const resumeGame = useCallback(() => {
    gameStateRef.current = "playing";
    setGameState("playing");
    lastDropRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  // Keyboard listener
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Responsive scaling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const containerWidth = el.clientWidth;
      const gameWidth = COLS * CELL + 200; // board + sidebar
      setScale(Math.min(1, containerWidth / gameWidth));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  // ─── Render helpers ────────────────────────────────────
  const board = boardRef.current;
  const piece = pieceRef.current;
  const nextPiece = nextPieceRef.current;

  // Build ghost piece (hard drop preview)
  let ghostY = piece ? piece.y : 0;
  if (piece) {
    while (!collides(piece.shape, piece.x, ghostY + 1)) ghostY++;
  }

  // Build flat cell array for the board
  const cells: (CellData | null)[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      cells.push(board[r][c]);
    }
  }

  // Overlay current piece + ghost onto cell rendering
  const pieceOverlay = new Map<string, { type: ToolType; ghost?: boolean }>();
  if (piece) {
    // Ghost
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue;
        const gy = ghostY + r;
        const gx = piece.x + c;
        if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
          pieceOverlay.set(`${gy},${gx}`, { type: piece.type, ghost: true });
        }
      }
    }
    // Actual piece (overwrites ghost if overlapping)
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue;
        const py = piece.y + r;
        const px = piece.x + c;
        if (py >= 0 && py < ROWS && px >= 0 && px < COLS) {
          pieceOverlay.set(`${py},${px}`, { type: piece.type });
        }
      }
    }
  }

  // Render next piece preview
  const renderPreview = () => {
    if (!nextPiece) return null;
    const s = nextPiece.shape;
    const previewSize = 4;
    const previewCells: JSX.Element[] = [];
    for (let r = 0; r < previewSize; r++) {
      for (let c = 0; c < previewSize; c++) {
        const filled = r < s.length && c < s[0].length && s[r][c];
        previewCells.push(
          <div
            key={`p${r}${c}`}
            style={{
              width: 18,
              height: 18,
              backgroundColor: filled ? cellColor(nextPiece.type) : "transparent",
              border: filled ? `1px solid ${cellBorder(nextPiece.type)}` : "1px solid transparent",
              borderRadius: 2,
            }}
          />
        );
      }
    }
    return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${previewSize}, 18px)`, gap: 1 }}>
        {previewCells}
      </div>
    );
  };

  const typeEmoji = (type: ToolType) => {
    switch (type) {
      case "read": return "\uD83D\uDD35";
      case "write": return "\uD83D\uDFE0";
      case "danger": return "\uD83D\uDD34";
      case "star": return "\u2B50";
    }
  };

  const isZh = locale === "zh";

  const tutorialSteps = useMemo(() => [
    {
      title: isZh ? "基础操作" : "Basic Controls",
      desc: isZh ? "← → 移动方块\n↑ 旋转\n↓ 加速下落\n空格 直接落底\n\n填满一行即可消除！" : "← → Move piece\n↑ Rotate\n↓ Soft drop\nSpace Hard drop\n\nComplete a row to clear it!",
      visual: "controls",
    },
    {
      title: isZh ? "🔵 蓝色 = 只读工具" : "🔵 Blue = Read-Only Tools",
      desc: isZh ? "蓝色方块代表只读工具（Read、Glob、Grep）。\n\n整行全是蓝色？\n→ 瞬间并行消除！⚡" : "Blue blocks are read-only tools (Read, Glob, Grep).\n\nA row that's ALL blue?\n→ Instant parallel clear! ⚡",
      visual: "blue",
    },
    {
      title: isZh ? "🟠 橙色 = 写工具" : "🟠 Orange = Write Tools",
      desc: isZh ? "橙色方块代表写工具（Edit、Write、Bash）。\n\n行中有橙色？\n→ 串行消除（1秒延迟）🐌\n→ 打断连击 combo" : "Orange blocks are write tools (Edit, Write, Bash).\n\nRow contains orange?\n→ Serial clear (1s delay) 🐌\n→ Breaks combo streak",
      visual: "orange",
    },
    {
      title: isZh ? "🔴 危险块 — 按 X 拒绝！" : "🔴 Danger Block — Press X!",
      desc: isZh ? "红色的 \"rm -rf\" 块偶尔出现。\n\n在它落地前按 X 键拒绝 → +50 分 ✅\n没拒绝？它会爆炸💥 炸掉周围 3×3 格！" : "Red \"rm -rf\" blocks appear occasionally.\n\nPress X before it lands → +50 pts ✅\nMissed? It explodes 💥 destroying a 3×3 area!",
      visual: "danger",
    },
    {
      title: isZh ? "⭐ 道具 & 🗜️ 压缩" : "⭐ Power-ups & 🗜️ Compression",
      desc: isZh ? "⭐ 消除含星星的行 → 随机特效\n  · 减速 10 秒\n  · 清除一整列\n  · 所有橙色变蓝色\n\n🗜️ 棋盘满到 80% → 自动压缩底部行" : "⭐ Clear a row with a star → random effect\n  · Slow mode 10s\n  · Clear entire column\n  · All orange → blue\n\n🗜️ Board 80% full → auto-compress bottom rows",
      visual: "star",
    },
    {
      title: isZh ? "🤖 Agent 助手" : "🤖 Agent Helper",
      desc: isZh ? "每得 200 分获得 1 次 Agent 充能。\n按 A 键 → AI 自动最优放置当前方块！\n\n准备好了吗？" : "Earn 1 Agent charge every 200 points.\nPress A → AI auto-places current piece!\n\nReady to play?",
      visual: "agent",
    },
  ], [isZh]);

  return (
    <div ref={containerRef} tabIndex={0} className="outline-none" style={{ cursor: "default" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", height: `${(ROWS * CELL + 80) * scale}px` }}>
        {/* Title */}
        <h1 className="text-2xl font-bold mb-4" style={{ color: "rgb(var(--color-accent-purple))" }}>
          {t(locale, "games.ts.title")}
        </h1>

        {/* Tutorial */}
        {gameState === "tutorial" && (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: `${ROWS * CELL}px` }}>
            <div className="max-w-sm w-full">
              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 mb-6">
                {tutorialSteps.map((_, i) => (
                  <span key={i} className={`w-2 h-2 rounded-full ${i === tutorialStep ? "bg-accent-purple" : i < tutorialStep ? "bg-accent-emerald" : "bg-bg-border"}`} />
                ))}
              </div>

              {/* Card */}
              <div className="rounded-xl border border-bg-border bg-bg-card p-6">
                <h3 className="text-lg font-bold text-text mb-4">
                  {tutorialSteps[tutorialStep].title}
                </h3>

                {/* Mini visual for each step */}
                <div className="mb-4 rounded-lg bg-bg border border-bg-border p-3 flex justify-center">
                  {tutorialSteps[tutorialStep].visual === "controls" && (
                    <div className="grid grid-cols-3 gap-1 text-center text-xs font-mono">
                      <div /><div className="px-2 py-1 bg-bg-card border border-bg-border rounded">↑</div><div />
                      <div className="px-2 py-1 bg-bg-card border border-bg-border rounded">←</div>
                      <div className="px-2 py-1 bg-bg-card border border-bg-border rounded">↓</div>
                      <div className="px-2 py-1 bg-bg-card border border-bg-border rounded">→</div>
                      <div className="col-span-3 mt-1 px-2 py-1 bg-bg-card border border-bg-border rounded">SPACE</div>
                    </div>
                  )}
                  {tutorialSteps[tutorialStep].visual === "blue" && (
                    <div className="flex gap-1">
                      {Array(10).fill(null).map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-sm" style={{ backgroundColor: "rgb(var(--color-accent-cyan) / 0.6)" }} />
                      ))}
                    </div>
                  )}
                  {tutorialSteps[tutorialStep].visual === "orange" && (
                    <div className="flex gap-1">
                      {Array(10).fill(null).map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-sm" style={{ backgroundColor: i === 4 || i === 7 ? "rgb(var(--color-accent-amber) / 0.6)" : "rgb(var(--color-accent-cyan) / 0.6)" }} />
                      ))}
                    </div>
                  )}
                  {tutorialSteps[tutorialStep].visual === "danger" && (
                    <div className="text-4xl animate-pulse">💥</div>
                  )}
                  {tutorialSteps[tutorialStep].visual === "star" && (
                    <div className="flex items-center gap-3 text-2xl">
                      <span>⭐</span><span className="text-sm text-text-secondary">→</span><span>🎲</span>
                    </div>
                  )}
                  {tutorialSteps[tutorialStep].visual === "agent" && (
                    <div className="text-4xl">🤖</div>
                  )}
                </div>

                <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                  {tutorialSteps[tutorialStep].desc}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setTutorialStep(s => Math.max(0, s - 1))}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${tutorialStep > 0 ? "text-text-secondary hover:text-text" : "opacity-0 pointer-events-none"}`}
                >
                  ← {isZh ? "上一步" : "Back"}
                </button>
                {tutorialStep < tutorialSteps.length - 1 ? (
                  <button
                    onClick={() => setTutorialStep(s => s + 1)}
                    className="px-4 py-2 rounded-lg text-sm bg-accent-purple text-white hover:bg-accent-purple/80 transition-colors"
                  >
                    {isZh ? "下一步" : "Next"} →
                  </button>
                ) : (
                  <button
                    onClick={() => setGameState("start")}
                    className="px-6 py-2 rounded-lg text-sm bg-accent-emerald text-white font-bold hover:bg-accent-emerald/80 transition-colors"
                  >
                    🎮 {isZh ? "开始游戏！" : "Start Game!"}
                  </button>
                )}
              </div>

              {/* Skip link */}
              <button
                onClick={() => setGameState("start")}
                className="block mx-auto mt-4 text-xs text-text-secondary/50 hover:text-text-secondary transition-colors"
              >
                {isZh ? "跳过引导" : "Skip tutorial"}
              </button>
            </div>
          </div>
        )}

        {/* Start / Game Over overlay */}
        {gameState === "start" && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-6xl mb-6">{"\uD83E\uDDE9"}</p>
            <p className="text-text-secondary mb-6 text-sm max-w-md text-center">
              {t(locale, "games.ts.desc")}
            </p>
            <button
              onClick={() => { containerRef.current?.focus(); startGame(); }}
              className="px-6 py-3 rounded-lg font-bold text-white text-sm"
              style={{ backgroundColor: "rgb(var(--color-accent-purple))" }}
            >
              {t(locale, "games.ts.start")}
            </button>
            <p className="text-xs text-text-secondary mt-4">{t(locale, "games.ts.controls")}</p>
          </div>
        )}

        {gameState === "over" && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-4xl font-bold mb-4 text-red-400">{t(locale, "games.ts.gameOver")}</p>
            <p className="text-2xl font-bold mb-6">{t(locale, "games.ts.score")}: {score}</p>
            <button
              onClick={() => { containerRef.current?.focus(); startGame(); }}
              className="px-6 py-3 rounded-lg font-bold text-white text-sm"
              style={{ backgroundColor: "rgb(var(--color-accent-purple))" }}
            >
              {t(locale, "games.ts.playAgain")}
            </button>
          </div>
        )}

        {gameState === "paused" && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-2xl font-bold mb-6">{locale === "zh" ? "\u2016 \u6682\u505C" : "\u2016 Paused"}</p>
            <button
              onClick={() => { containerRef.current?.focus(); resumeGame(); }}
              className="px-6 py-3 rounded-lg font-bold text-white text-sm"
              style={{ backgroundColor: "rgb(var(--color-accent-purple))" }}
            >
              {locale === "zh" ? "\u7EE7\u7EED" : "Resume"}
            </button>
          </div>
        )}

        {/* Game area */}
        {gameState === "playing" && (
          <div className="flex gap-6">
            {/* Board */}
            <div className="relative" style={{ width: COLS * CELL, height: ROWS * CELL }}>
              {/* Background grid */}
              <div
                className="absolute inset-0 rounded-lg border-2"
                style={{
                  borderColor: "rgb(var(--color-bg-border))",
                  backgroundColor: "rgb(var(--color-bg))",
                  backgroundImage: `
                    linear-gradient(to right, rgb(var(--color-bg-border) / 0.2) 1px, transparent 1px),
                    linear-gradient(to bottom, rgb(var(--color-bg-border) / 0.2) 1px, transparent 1px)
                  `,
                  backgroundSize: `${CELL}px ${CELL}px`,
                }}
              />

              {/* Cells */}
              <div
                className="absolute inset-0"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
                  gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
                }}
              >
                {Array.from({ length: ROWS * COLS }, (_, i) => {
                  const r = Math.floor(i / COLS);
                  const c = i % COLS;
                  const cell = board[r][c];
                  const overlay = pieceOverlay.get(`${r},${c}`);

                  let bg = "transparent";
                  let border = "transparent";
                  let opacity = 1;
                  let animation = "";

                  if (cell) {
                    bg = cellColor(cell.type);
                    border = cellBorder(cell.type);
                    if (cell.type === "danger") animation = "pulse 1s infinite";
                    if (cell.type === "star") animation = "pulse 2s infinite";
                  }
                  if (overlay) {
                    if (overlay.ghost) {
                      bg = cellColor(overlay.type);
                      border = cellBorder(overlay.type);
                      opacity = 0.25;
                    } else {
                      bg = cellColor(overlay.type);
                      border = cellBorder(overlay.type);
                      opacity = 1;
                      if (overlay.type === "danger") animation = "pulse 0.5s infinite";
                    }
                  }

                  return (
                    <div
                      key={i}
                      style={{
                        backgroundColor: bg,
                        borderColor: border,
                        borderWidth: (cell || (overlay && !overlay.ghost)) ? 1 : 0,
                        borderStyle: "solid",
                        borderRadius: 3,
                        opacity,
                        animation,
                        margin: 1,
                      }}
                    />
                  );
                })}
              </div>

              {/* Flash message */}
              {message && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <span className="text-sm font-bold px-4 py-2 rounded-lg text-white" style={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    textShadow: "0 0 10px rgba(168,85,247,0.8)",
                  }}>
                    {message}
                  </span>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-3" style={{ minWidth: 150 }}>
              {/* Next piece */}
              <div className="rounded-lg border p-3" style={{ borderColor: "rgb(var(--color-bg-border))", backgroundColor: "rgb(var(--color-bg-card))" }}>
                <p className="text-xs font-bold mb-2 text-text-secondary">{t(locale, "games.ts.next")}</p>
                {renderPreview()}
                {nextPiece && (
                  <p className="text-xs mt-2" style={{ color: cellBorder(nextPiece.type) }}>
                    {typeEmoji(nextPiece.type)} {nextPiece.toolName}
                  </p>
                )}
              </div>

              {/* Score */}
              <div className="rounded-lg border p-3" style={{ borderColor: "rgb(var(--color-bg-border))", backgroundColor: "rgb(var(--color-bg-card))" }}>
                <div className="text-xs text-text-secondary">{t(locale, "games.ts.score")}</div>
                <div className="text-xl font-bold" style={{ color: "rgb(var(--color-accent-purple))" }}>{score}</div>
              </div>

              <div className="rounded-lg border p-3 grid grid-cols-2 gap-2" style={{ borderColor: "rgb(var(--color-bg-border))", backgroundColor: "rgb(var(--color-bg-card))" }}>
                <div>
                  <div className="text-xs text-text-secondary">{t(locale, "games.ts.level")}</div>
                  <div className="text-sm font-bold">{level}</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">{t(locale, "games.ts.linesCleared")}</div>
                  <div className="text-sm font-bold">{lines}</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">{t(locale, "games.ts.combo")}</div>
                  <div className="text-sm font-bold" style={{ color: combo > 0 ? "rgb(var(--color-accent-cyan))" : undefined }}>
                    {combo > 0 ? `x${Math.pow(2, Math.min(combo - 1, 3))}` : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">Agent</div>
                  <div className="text-sm font-bold" style={{ color: agentCharges > 0 ? "rgb(var(--color-accent-emerald))" : undefined }}>
                    {agentCharges > 0 ? `${agentCharges}x` : "-"}
                  </div>
                </div>
              </div>

              {/* Active effects */}
              {activeEffects.length > 0 && (
                <div className="rounded-lg border p-3" style={{ borderColor: "rgb(var(--color-accent-purple))", backgroundColor: "rgb(var(--color-bg-card))" }}>
                  <p className="text-xs font-bold mb-1" style={{ color: "rgb(var(--color-accent-purple))" }}>Effects</p>
                  {activeEffects.map(e => (
                    <p key={e} className="text-xs text-text-secondary">{e === "SLOW_MODE" ? "\u{1F422} Slow" : e === "READ_ONLY" ? "\uD83D\uDD35 Read-Only" : e}</p>
                  ))}
                </div>
              )}

              {/* Current piece info */}
              {piece && (
                <div className="rounded-lg border p-3" style={{ borderColor: cellBorder(piece.type), backgroundColor: "rgb(var(--color-bg-card))" }}>
                  <p className="text-xs" style={{ color: cellBorder(piece.type) }}>
                    {typeEmoji(piece.type)} {piece.toolName}
                  </p>
                  {piece.type === "danger" && (
                    <p className="text-xs text-red-400 font-bold mt-1">Press X to DENY!</p>
                  )}
                </div>
              )}

              {/* Controls */}
              <p className="text-xs text-text-secondary leading-relaxed mt-2">
                {t(locale, "games.ts.controls")}
              </p>
              <p className="text-xs text-text-secondary">P {locale === "zh" ? "\u6682\u505C" : "Pause"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
