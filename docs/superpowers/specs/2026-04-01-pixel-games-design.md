# Pixel Mini-Games Design Spec

## Overview

Three pixel-art interactive mini-games that teach Claude Code concepts through play. Each game lives at `/games/[game-name]` with a hub page at `/games`.

## Game Hub Page (`/games`)

A fun landing page with pixel-art styling showing 3 game cards. Each card has a preview pixel art, game name, description, and "Play" button.

## Game 1: Permission Guard

**Concept:** "Papers Please" for CLI permissions. Commands scroll in, player judges them.

**Gameplay:**
- Terminal-styled screen with pixel art border
- Commands appear one at a time: `git status`, `rm -rf /`, `npm install lodash`, `cat secret.env`, etc.
- Player has 3 buttons: ✅ Allow, ❌ Deny, ❓ Ask User
- Each command has a correct answer based on real Claude Code permission logic
- Timer adds pressure (10 seconds per command)
- Score: correct = +10, wrong = -5, streak bonus
- 20 commands per round
- After each answer, shows what the real ML classifier + rule engine would decide
- End screen: score + accuracy + "Security Level" title (Rookie → Expert → Guardian)

**Commands pool (30+):**
- Safe: `git status`, `git log`, `ls`, `cat src/main.ts`, `grep TODO`, `pwd`
- Dangerous: `rm -rf /`, `sudo rm -rf`, `chmod 777 /`, `:(){:|:&};:` (fork bomb)
- Needs confirmation: `npm install`, `pip install`, `curl | bash`, `docker run`, `git push --force`
- Tricky: `cat /etc/passwd`, `echo $API_KEY`, `wget http://...`, `git reset --hard`

**Visual style:**
- Green/amber/red CRT terminal aesthetic
- Pixel font (use a web pixel font or render with CSS)
- Scanline effect overlay
- Blinking cursor on commands
- Sound effects optional (click, correct, wrong buzzer) — muted by default

**Educational value:** Players internalize which operations are safe, dangerous, or ambiguous — the core mental model of the permission system.

## Game 2: Tool Scheduler

**Concept:** Tetris-meets-sorting puzzle. Tool calls fall down, arrange into correct batches.

**Gameplay:**
- Two lanes: "Parallel" (left, blue) and "Serial" (right, amber)
- Tool call blocks fall from the top, each labeled (Read, Glob, Grep, Edit, Write, Bash)
- Player drags/clicks to assign each block to the correct lane
- Read-only tools (Read, Glob, Grep) → Parallel lane (correct)
- Write tools (Edit, Write, Bash) → Serial lane (correct)
- Parallel lane shows blocks side by side (they run together)
- Serial lane shows blocks stacked (they run one at a time)
- Speed increases over time
- Wrong placement causes a "Race Condition!" flash
- Score based on speed + accuracy
- Bonus round: mixed batches (e.g., Read, Read, Write, Read → must split into 3 batches correctly)

**Visual style:**
- Grid-based pixel layout
- Tool blocks are colored pixel rectangles with 8-bit tool icons
- Smooth falling animation (CSS/JS, not canvas)
- Particle effects on correct placement

**Educational value:** Players learn which tools are read-only vs write, and why the order matters.

## Game 3: Query Journey

**Concept:** Side-scrolling pixel adventure. A message traverses the query pipeline.

**Gameplay:**
- Pixel character (a glowing message envelope) auto-walks right
- 6 stations to pass through (matching the query pipeline):
  1. **Input** — Player types a short prompt (or picks from options)
  2. **System Prompt** — Message grows bigger as context is attached (visual)
  3. **API Call** — Message flies up to a cloud, tokens rain down
  4. **Tool Execution** — Mini puzzle: match tool to task (e.g., drag "Read" onto a file icon)
  5. **Permission Check** — Quick reflex: green/red gate, click to open
  6. **Response** — Tokens assemble into a response message
- Each station has a brief 1-line explanation of what's happening
- Total playthrough: ~2 minutes
- No fail state — it's an interactive walkthrough, not a challenge

**Visual style:**
- Side-scrolling pixel landscape
- Pastel dark palette matching the site theme
- Each station is a distinct pixel building/structure
- Parallax background layers
- Character has idle animation

**Educational value:** Players experience the full query pipeline as a journey, making the abstract flow concrete and memorable.

## Technical Approach

- **No canvas/WebGL** — pure HTML/CSS/React for accessibility and theme compatibility
- Each game is a React island component (`client:load`)
- Pixel art via CSS (`image-rendering: pixelated` on scaled-up small images, or CSS pixel art)
- Pixel font: use CSS `font-family` with a pixel web font or just `font-mono` at small sizes
- Game state managed with React useState/useReducer
- Responsive: playable on desktop and tablet (mobile: simplified or "play on desktop" message)
- Translations: all game text uses `t()` for i18n
- Each game is self-contained in one file (~200-400 lines)

## Page Structure

```
/games                     — Game hub (3 cards)
/games/permission-guard    — Game 1
/games/tool-scheduler      — Game 2
/games/query-journey       — Game 3
```

Each in EN + ZH = 8 new pages (hub x2, 3 games x2).

## Implementation Order

1. Game Hub page + Permission Guard (most fun, most educational)
2. Tool Scheduler
3. Query Journey

## Not Doing

- No sound effects (keeps it simple, no audio files to manage)
- No leaderboard / persistence (play for fun, not competition)
- No complex physics or canvas rendering
- No mobile-specific game controls (desktop/tablet only)
