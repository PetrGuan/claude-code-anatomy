import { useState, useEffect, useCallback, useRef } from "react";
import { t } from "../../i18n/translations";
import type { Locale } from "../../i18n/locales";
import PixelSprite from "./PixelSprite";

// ─── Constants ───────────────────────────────────────────
const GAME_W = 600;
const GAME_H = 200;
const GROUND_Y = 160;
const PLAYER_W = 24;
const PLAYER_H = 32;
const GRAVITY = 0.6;
const JUMP_VEL = -11;
const BASE_SPEED = 3;
const ZONE_LENGTH = 2000;
const TOTAL_LENGTH = ZONE_LENGTH * 5;
const HIT_INVINCIBLE_MS = 1500;

// ─── Sprite ──────────────────────────────────────────────
const P = "#6c63ff";
const C = "#22d3ee";
const W = "#ffffff";
const N = null;

const MESSAGE_SPRITE: (string | null)[][] = [
  [N, N, P, P, P, P, N, N],
  [N, P, C, C, C, C, P, N],
  [P, C, W, W, W, W, C, P],
  [P, C, W, C, C, W, C, P],
  [P, C, W, W, W, W, C, P],
  [P, C, C, C, C, C, C, P],
  [N, P, C, C, C, C, P, N],
  [N, N, P, P, P, P, N, N],
];

const MESSAGE_SPRITE_JUMP: (string | null)[][] = [
  [N, P, P, P, P, P, P, N],
  [P, C, W, W, W, W, C, P],
  [P, C, W, C, C, W, C, P],
  [P, C, W, W, W, W, C, P],
  [P, C, C, C, C, C, C, P],
  [N, P, P, P, P, P, P, N],
  [N, N, N, P, P, N, N, N],
  [N, N, P, N, N, P, N, N],
];

// ─── Types ───────────────────────────────────────────────
interface GameObject {
  x: number;
  y: number;
  w: number;
  h: number;
  type: "collectible" | "obstacle";
  subtype: string;
  label: string;
  color: string;
  collected?: boolean;
  hit?: boolean;
  zoneIndex: number;
}

type GameState = "start" | "playing" | "over" | "victory";

interface Zone {
  name: string;
  nameCn: string;
  color: string;
  hint: string;
  hintCn: string;
}

const zones: Zone[] = [
  { name: "Input", nameCn: "输入", color: "#6c63ff", hint: "Collect context for your prompt!", hintCn: "收集上下文！" },
  { name: "API", nameCn: "API", color: "#22d3ee", hint: "Dodge rate limits, catch tokens!", hintCn: "躲避限流，接住 token！" },
  { name: "Tools", nameCn: "工具", color: "#10b981", hint: "Collect read tools, avoid write tools!", hintCn: "收集只读工具，避开写工具！" },
  { name: "Security", nameCn: "安全", color: "#f59e0b", hint: "Dodge the danger blocks!", hintCn: "躲开危险方块！" },
  { name: "Response", nameCn: "响应", color: "#a78bfa", hint: "Final sprint! Catch everything!", hintCn: "最后冲刺！全部接住！" },
];

// ─── Object Generation ──────────────────────────────────
function generateObjects(): GameObject[] {
  const objects: GameObject[] = [];

  // Zone 1: Input — context collectibles + ground obstacles
  for (let i = 0; i < 8; i++) {
    const x = ZONE_LENGTH * 0 + 300 + i * 200;
    if (i % 2 === 0) {
      objects.push({ x, y: GROUND_Y - 60 - Math.random() * 40, w: 24, h: 24, type: "collectible", subtype: "context", label: ["📋", "📁", "🧠"][i % 3], color: "#6c63ff", zoneIndex: 0 });
    } else {
      objects.push({ x, y: GROUND_Y - 20, w: 30, h: 20, type: "obstacle", subtype: "missing_context", label: "❌", color: "#ef4444", zoneIndex: 0 });
    }
  }

  // Zone 2: API — tokens + rate limit walls
  for (let i = 0; i < 12; i++) {
    const x = ZONE_LENGTH * 1 + 200 + i * 150;
    if (i % 3 === 2) {
      objects.push({ x, y: GROUND_Y - 50, w: 20, h: 50, type: "obstacle", subtype: "rate_limit", label: "🚫", color: "#ef4444", zoneIndex: 1 });
    } else {
      const height = 40 + Math.random() * 60;
      objects.push({ x, y: GROUND_Y - height, w: 16, h: 16, type: "collectible", subtype: "token", label: "⚡", color: "#22d3ee", zoneIndex: 1 });
    }
  }

  // Zone 3: Tools — blue collectibles + orange obstacles
  for (let i = 0; i < 10; i++) {
    const x = ZONE_LENGTH * 2 + 200 + i * 180;
    if (i % 2 === 0) {
      objects.push({ x, y: GROUND_Y - 50 - Math.random() * 30, w: 24, h: 24, type: "collectible", subtype: "blue_tool", label: ["📖", "📂", "🔍"][i % 3], color: "#22d3ee", zoneIndex: 2 });
    } else {
      objects.push({ x, y: GROUND_Y - 24, w: 28, h: 24, type: "obstacle", subtype: "orange_tool", label: ["✏️", "📝", "💻"][i % 3], color: "#f59e0b", zoneIndex: 2 });
    }
  }

  // Zone 4: Security — danger blocks + safe collectibles
  for (let i = 0; i < 8; i++) {
    const x = ZONE_LENGTH * 3 + 300 + i * 200;
    if (i % 3 === 1) {
      objects.push({ x, y: GROUND_Y - 50, w: 24, h: 24, type: "collectible", subtype: "safe_cmd", label: "✅", color: "#10b981", zoneIndex: 3 });
    } else {
      objects.push({ x, y: GROUND_Y - 30, w: 32, h: 30, type: "obstacle", subtype: "danger_cmd", label: "🔴", color: "#ef4444", zoneIndex: 3 });
    }
  }

  // Zone 5: Response — lots of token collectibles, few obstacles
  for (let i = 0; i < 15; i++) {
    const x = ZONE_LENGTH * 4 + 100 + i * 120;
    const height = 30 + Math.random() * 80;
    objects.push({ x, y: GROUND_Y - height, w: 16, h: 16, type: "collectible", subtype: "response_token", label: "⚡", color: "#a78bfa", zoneIndex: 4 });
  }
  for (let i = 0; i < 3; i++) {
    const x = ZONE_LENGTH * 4 + 500 + i * 500;
    objects.push({ x, y: GROUND_Y - 20, w: 24, h: 20, type: "obstacle", subtype: "final_obstacle", label: "❌", color: "#ef4444", zoneIndex: 4 });
  }

  return objects;
}

// ─── Score values ────────────────────────────────────────
function getCollectiblePoints(subtype: string): number {
  switch (subtype) {
    case "context": return 10;
    case "token": return 5;
    case "blue_tool": return 15;
    case "safe_cmd": return 10;
    case "response_token": return 3;
    default: return 5;
  }
}

// ─── Component ───────────────────────────────────────────
interface Props { locale?: Locale; }

export default function QueryRunner({ locale = "en" as Locale }: Props) {
  const isZh = locale === "zh";
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  // Ref-based game state (perf)
  const playerXRef = useRef(100);
  const playerYRef = useRef(GROUND_Y - PLAYER_H);
  const playerVyRef = useRef(0);
  const onGroundRef = useRef(true);
  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const objectsRef = useRef<GameObject[]>([]);
  const lastHitTimeRef = useRef(0);

  // React state for rendering
  const [gameState, setGameState] = useState<GameState>("start");
  const [, forceRender] = useState(0);
  const [scale, setScale] = useState(1);
  const gameStateRef = useRef<GameState>("start");

  // ─── Responsive scaling ──────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const containerWidth = el.clientWidth;
      setScale(Math.min(1, containerWidth / GAME_W));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ─── Start / Reset ──────────────────────────────────
  const startGame = useCallback(() => {
    playerXRef.current = 100;
    playerYRef.current = GROUND_Y - PLAYER_H;
    playerVyRef.current = 0;
    onGroundRef.current = true;
    livesRef.current = 3;
    scoreRef.current = 0;
    lastHitTimeRef.current = 0;
    objectsRef.current = generateObjects();
    gameStateRef.current = "playing";
    setGameState("playing");
  }, []);

  // ─── Jump ────────────────────────────────────────────
  const jump = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    if (onGroundRef.current) {
      playerVyRef.current = JUMP_VEL;
      onGroundRef.current = false;
    }
  }, []);

  // ─── Input handlers ─────────────────────────────────
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      if (gameStateRef.current === "start" || gameStateRef.current === "over" || gameStateRef.current === "victory") {
        startGame();
      } else {
        jump();
      }
    }
  }, [startGame, jump]);

  const handleTap = useCallback(() => {
    if (gameStateRef.current === "start" || gameStateRef.current === "over" || gameStateRef.current === "victory") {
      startGame();
    } else {
      jump();
    }
  }, [startGame, jump]);

  // ─── Keyboard listener ──────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // ─── Game loop ───────────────────────────────────────
  useEffect(() => {
    let lastTime = 0;

    const loop = (time: number) => {
      animFrameRef.current = requestAnimationFrame(loop);
      if (gameStateRef.current !== "playing") return;
      if (!lastTime) { lastTime = time; return; }

      const dt = Math.min(time - lastTime, 32); // cap at ~30fps worth of dt
      lastTime = time;
      const dtFactor = dt / 16.67; // normalize to 60fps

      // Speed increases with distance
      const progress = playerXRef.current / TOTAL_LENGTH;
      const speed = (BASE_SPEED + progress * 3) * dtFactor;

      // Move player
      playerXRef.current += speed;

      // Gravity
      playerVyRef.current += GRAVITY * dtFactor;
      playerYRef.current += playerVyRef.current * dtFactor;

      // Ground collision
      if (playerYRef.current >= GROUND_Y - PLAYER_H) {
        playerYRef.current = GROUND_Y - PLAYER_H;
        playerVyRef.current = 0;
        onGroundRef.current = true;
      }

      // Distance score
      scoreRef.current += speed * 0.1;

      // Check collisions
      const px = playerXRef.current;
      const py = playerYRef.current;
      const now = performance.now();

      for (const obj of objectsRef.current) {
        if (obj.collected || obj.hit) continue;
        // AABB check
        if (px < obj.x + obj.w && px + PLAYER_W > obj.x &&
            py < obj.y + obj.h && py + PLAYER_H > obj.y) {
          if (obj.type === "collectible") {
            obj.collected = true;
            scoreRef.current += getCollectiblePoints(obj.subtype);
          } else {
            // Obstacle hit
            if (now - lastHitTimeRef.current > HIT_INVINCIBLE_MS) {
              obj.hit = true;
              livesRef.current -= 1;
              lastHitTimeRef.current = now;
              if (livesRef.current <= 0) {
                gameStateRef.current = "over";
                setGameState("over");
              }
            }
          }
        }
      }

      // Victory check
      if (playerXRef.current >= TOTAL_LENGTH) {
        gameStateRef.current = "victory";
        setGameState("victory");
      }

      forceRender(n => n + 1);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // ─── Derived render values ──────────────────────────
  const playerX = playerXRef.current;
  const playerY = playerYRef.current;
  const cameraX = playerX - 80;
  const currentZoneIdx = Math.min(4, Math.floor(playerX / ZONE_LENGTH));
  const currentZone = zones[currentZoneIdx];
  const lives = livesRef.current;
  const score = Math.floor(scoreRef.current);
  const isInvincible = performance.now() - lastHitTimeRef.current < HIT_INVINCIBLE_MS;
  const isJumping = !onGroundRef.current;

  // Zone background color (subtle gradient)
  const zoneBg = currentZone.color + "15"; // 15 = ~8% opacity hex

  // Ground tile pattern
  const groundOffset = -(cameraX % 32);

  // Visible objects (viewport culling)
  const visibleObjects = objectsRef.current.filter(
    obj => !obj.collected && !obj.hit && obj.x + obj.w > cameraX - 50 && obj.x < cameraX + GAME_W + 50
  );

  // Zone intro banner
  const zoneStartX = currentZoneIdx * ZONE_LENGTH;
  const showZoneBanner = playerX >= zoneStartX && playerX < zoneStartX + 400;

  return (
    <div ref={containerRef} tabIndex={0} className="outline-none" style={{ cursor: "default" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", height: `${(GAME_H + 100) * scale}px` }}>
        {/* Title */}
        <h1 className="text-2xl font-bold mb-4" style={{ color: "rgb(var(--color-accent-purple))" }}>
          {t(locale, "games.qj.title")}
        </h1>

        {/* Game area */}
        <div
          style={{
            width: GAME_W,
            height: GAME_H,
            position: "relative",
            overflow: "hidden",
            borderRadius: 12,
            border: `2px solid ${currentZone.color}40`,
            backgroundColor: zoneBg,
            userSelect: "none",
          }}
          onClick={handleTap}
        >
          {/* Scrolling ground tiles */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: GAME_H - GROUND_Y }}>
            {Array.from({ length: Math.ceil(GAME_W / 32) + 1 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: groundOffset + i * 32,
                  bottom: 0,
                  width: 32,
                  height: GAME_H - GROUND_Y,
                  borderRight: "1px solid rgba(128,128,128,0.15)",
                  borderTop: "1px solid rgba(128,128,128,0.25)",
                  backgroundColor: i % 2 === 0 ? "rgba(128,128,128,0.08)" : "rgba(128,128,128,0.04)",
                }}
              />
            ))}
          </div>

          {/* Zone transition lines */}
          {[1, 2, 3, 4].map(z => {
            const lineX = z * ZONE_LENGTH - cameraX;
            if (lineX < -2 || lineX > GAME_W + 2) return null;
            return (
              <div
                key={z}
                style={{
                  position: "absolute",
                  left: lineX,
                  top: 0,
                  width: 2,
                  height: GAME_H,
                  backgroundColor: zones[z]?.color + "40" || "#fff2",
                }}
              />
            );
          })}

          {/* Game objects */}
          {visibleObjects.map((obj, i) => (
            <div
              key={`${obj.subtype}-${obj.x}-${i}`}
              style={{
                position: "absolute",
                left: obj.x - cameraX,
                top: obj.y,
                width: obj.w,
                height: obj.h,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: Math.min(obj.w, obj.h) * 0.8,
                lineHeight: 1,
                borderRadius: obj.type === "collectible" ? "50%" : 4,
                backgroundColor: obj.type === "obstacle" ? obj.color + "30" : "transparent",
                border: obj.type === "obstacle" ? `2px solid ${obj.color}` : "none",
                filter: obj.type === "collectible" ? `drop-shadow(0 0 4px ${obj.color})` : "none",
                animation: obj.type === "collectible" ? "qr-float 1.5s ease-in-out infinite" : "none",
              }}
            >
              {obj.label}
            </div>
          ))}

          {/* Player */}
          <div
            style={{
              position: "absolute",
              left: playerX - cameraX,
              top: playerY,
              opacity: isInvincible ? (Math.floor(performance.now() / 100) % 2 === 0 ? 0.3 : 1) : 1,
              transition: "opacity 0.05s",
            }}
          >
            <PixelSprite sprite={isJumping ? MESSAGE_SPRITE_JUMP : MESSAGE_SPRITE} size={3} />
          </div>

          {/* Zone banner */}
          {gameState === "playing" && showZoneBanner && (
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 0,
                right: 0,
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 16px",
                  borderRadius: 8,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: currentZone.color,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {isZh ? currentZone.nameCn : currentZone.name}
                <span style={{ color: "#ccc", fontWeight: 400, marginLeft: 8, fontSize: 11 }}>
                  {isZh ? currentZone.hintCn : currentZone.hint}
                </span>
              </div>
            </div>
          )}

          {/* HUD */}
          {gameState === "playing" && (
            <div
              style={{
                position: "absolute",
                bottom: GAME_H - GROUND_Y + 4,
                left: 8,
                right: 8,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                pointerEvents: "none",
              }}
            >
              <span>
                {t(locale, "games.qj.lives")}: {"❤️".repeat(lives)}{"🖤".repeat(3 - lives)}
              </span>
              <span>
                {t(locale, "games.qj.zone")} {currentZoneIdx + 1}/5
              </span>
              <span>
                {t(locale, "games.qj.score")}: {score}
              </span>
            </div>
          )}

          {/* Start screen */}
          {gameState === "start" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.75)",
                borderRadius: 12,
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <PixelSprite sprite={MESSAGE_SPRITE} size={4} />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "#6c63ff", marginBottom: 8 }}>
                {t(locale, "games.qj.title")}
              </h2>
              <p style={{ fontSize: 13, color: "#aaa", marginBottom: 16, maxWidth: 400, textAlign: "center", padding: "0 16px" }}>
                {t(locale, "games.qj.desc")}
              </p>
              <p style={{ fontSize: 14, color: "#fff" }}>
                {t(locale, "games.qj.start")}
              </p>
              <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                {t(locale, "games.qj.jumpHint")}
              </p>
            </div>
          )}

          {/* Game Over screen */}
          {gameState === "over" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.8)",
                borderRadius: 12,
              }}
            >
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "#ef4444", marginBottom: 8 }}>
                {t(locale, "games.qj.gameOver")}
              </h2>
              <p style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>
                {t(locale, "games.qj.score")}: {score}
              </p>
              <p style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>
                {t(locale, "games.qj.zone")} {currentZoneIdx + 1}/5
              </p>
              <p style={{ fontSize: 14, color: "#fff" }}>
                {t(locale, "games.qj.playAgain")}
              </p>
            </div>
          )}

          {/* Victory screen */}
          {gameState === "victory" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.8)",
                borderRadius: 12,
              }}
            >
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "#10b981", marginBottom: 8 }}>
                {t(locale, "games.qj.victory")}
              </h2>
              <p style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>
                {t(locale, "games.qj.score")}: {score}
              </p>
              <p style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>
                {isZh ? "你完成了整个查询管线！" : "You completed the query pipeline!"}
              </p>
              <p style={{ fontSize: 14, color: "#fff" }}>
                {t(locale, "games.qj.playAgain")}
              </p>
            </div>
          )}
        </div>

        {/* Controls hint below game */}
        {gameState === "playing" && (
          <p style={{ fontSize: 11, color: "#888", marginTop: 8, textAlign: "center" }}>
            {t(locale, "games.qj.jumpHint")}
          </p>
        )}

        {/* Progress bar */}
        {gameState === "playing" && (
          <div style={{ marginTop: 8, height: 6, borderRadius: 3, backgroundColor: "rgba(128,128,128,0.2)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, (playerX / TOTAL_LENGTH) * 100)}%`,
                borderRadius: 3,
                background: `linear-gradient(90deg, #6c63ff, #22d3ee, #10b981, #f59e0b, #a78bfa)`,
                transition: "width 0.1s",
              }}
            />
            {/* Zone labels on progress bar */}
            <div style={{ position: "relative", top: 2, display: "flex", justifyContent: "space-between", fontSize: 9, color: "#888" }}>
              {zones.map((z, i) => (
                <span key={i} style={{ color: i <= currentZoneIdx ? z.color : "#555", fontWeight: i === currentZoneIdx ? 700 : 400 }}>
                  {isZh ? z.nameCn : z.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Float animation for collectibles */}
      <style>{`
        @keyframes qr-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
