import { useState, useEffect } from "react";
import type { Locale } from "../../i18n/locales";

const EYES = ['·', '✦', '×', '◉', '@', '°'] as const;
const HATS = ['none', 'crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck'] as const;
const HAT_DISPLAY: Record<string, string> = { none: '—', crown: '👑', tophat: '🎩', propeller: '🧢', halo: '😇', wizard: '🧙', beanie: '🧶', tinyduck: '🦆' };
const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
const RARITY_STARS: Record<string, string> = { common: '★', uncommon: '★★', rare: '★★★', epic: '★★★★', legendary: '★★★★★' };
const RARITY_COLORS: Record<string, string> = { common: '#8888a0', uncommon: '#10b981', rare: '#6c63ff', epic: '#a78bfa', legendary: '#f59e0b' };

// Idle sequence: mostly frame 0, occasional fidget. -1 = blink (show frame 0 with '-' eyes)
const IDLE_SEQUENCE = [0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 2, 0, 0, 0];

// All 18 species with their 3 frames of ASCII art (copied from sprites.ts)
const SPECIES_DATA: Record<string, { frames: string[][]; rarity: string }> = {
  duck: {
    frames: [
      ['            ', '    __      ', '  <({E} )___  ', '   (  ._>   ', '    `--´    '],
      ['            ', '    __      ', '  <({E} )___  ', '   (  ._>   ', '    `--´~   '],
      ['            ', '    __      ', '  <({E} )___  ', '   (  .__>  ', '    `--´    '],
    ],
    rarity: 'common',
  },
  goose: {
    frames: [
      ['            ', '     ({E}>    ', '     ||     ', '   _(__)_   ', '    ^^^^    '],
      ['            ', '    ({E}>     ', '     ||     ', '   _(__)_   ', '    ^^^^    '],
      ['            ', '     ({E}>>   ', '     ||     ', '   _(__)_   ', '    ^^^^    '],
    ],
    rarity: 'common',
  },
  blob: {
    frames: [
      ['            ', '   .----.   ', '  ( {E}  {E} )  ', '  (      )  ', '   `----´   '],
      ['            ', '  .------.  ', ' (  {E}  {E}  ) ', ' (        ) ', '  `------´  '],
      ['            ', '    .--.    ', '   ({E}  {E})   ', '   (    )   ', '    `--´    '],
    ],
    rarity: 'common',
  },
  cat: {
    frames: [
      ['            ', '   /\\_/\\    ', '  ( {E}   {E})  ', '  (  ω  )   ', '  (")_(")   '],
      ['            ', '   /\\_/\\    ', '  ( {E}   {E})  ', '  (  ω  )   ', '  (")_(")~  '],
      ['            ', '   /\\-/\\    ', '  ( {E}   {E})  ', '  (  ω  )   ', '  (")_(")   '],
    ],
    rarity: 'common',
  },
  dragon: {
    frames: [
      ['            ', '  /^\\  /^\\  ', ' <  {E}  {E}  > ', ' (   ~~   ) ', '  `-vvvv-´  '],
      ['            ', '  /^\\  /^\\  ', ' <  {E}  {E}  > ', ' (        ) ', '  `-vvvv-´  '],
      ['   ~    ~   ', '  /^\\  /^\\  ', ' <  {E}  {E}  > ', ' (   ~~   ) ', '  `-vvvv-´  '],
    ],
    rarity: 'uncommon',
  },
  octopus: {
    frames: [
      ['            ', '   .----.   ', '  ( {E}  {E} )  ', '  (______)  ', '  /\\/\\/\\/\\  '],
      ['            ', '   .----.   ', '  ( {E}  {E} )  ', '  (______)  ', '  \\/\\/\\/\\/  '],
      ['     o      ', '   .----.   ', '  ( {E}  {E} )  ', '  (______)  ', '  /\\/\\/\\/\\  '],
    ],
    rarity: 'uncommon',
  },
  owl: {
    frames: [
      ['            ', '   /\\  /\\   ', '  (({E})({E}))  ', '  (  ><  )  ', '   `----´   '],
      ['            ', '   /\\  /\\   ', '  (({E})({E}))  ', '  (  ><  )  ', '   .----.   '],
      ['            ', '   /\\  /\\   ', '  (({E})(-))  ', '  (  ><  )  ', '   `----´   '],
    ],
    rarity: 'uncommon',
  },
  penguin: {
    frames: [
      ['            ', '  .---.     ', '  ({E}>{E})     ', ' /(   )\\    ', '  `---´     '],
      ['            ', '  .---.     ', '  ({E}>{E})     ', ' |(   )|    ', '  `---´     '],
      ['  .---.     ', '  ({E}>{E})     ', ' /(   )\\    ', '  `---´     ', '   ~ ~      '],
    ],
    rarity: 'uncommon',
  },
  turtle: {
    frames: [
      ['            ', '   _,--._   ', '  ( {E}  {E} )  ', ' /[______]\\ ', '  ``    ``  '],
      ['            ', '   _,--._   ', '  ( {E}  {E} )  ', ' /[______]\\ ', '   ``  ``   '],
      ['            ', '   _,--._   ', '  ( {E}  {E} )  ', ' /[======]\\ ', '  ``    ``  '],
    ],
    rarity: 'rare',
  },
  snail: {
    frames: [
      ['            ', ' {E}    .--.  ', '  \\  ( @ )  ', '   \\_`--´   ', '  ~~~~~~~   '],
      ['            ', '  {E}   .--.  ', '  |  ( @ )  ', '   \\_`--´   ', '  ~~~~~~~   '],
      ['            ', ' {E}    .--.  ', '  \\  ( @  ) ', '   \\_`--´   ', '   ~~~~~~   '],
    ],
    rarity: 'rare',
  },
  ghost: {
    frames: [
      ['            ', '   .----.   ', '  / {E}  {E} \\  ', '  |      |  ', '  ~`~``~`~  '],
      ['            ', '   .----.   ', '  / {E}  {E} \\  ', '  |      |  ', '  `~`~~`~`  '],
      ['    ~  ~    ', '   .----.   ', '  / {E}  {E} \\  ', '  |      |  ', '  ~~`~~`~~  '],
    ],
    rarity: 'rare',
  },
  axolotl: {
    frames: [
      ['            ', '}~(______)~{', '}~({E} .. {E})~{', '  ( .--. )  ', '  (_/  \\_)  '],
      ['            ', '~}(______){~', '~}({E} .. {E}){~', '  ( .--. )  ', '  (_/  \\_)  '],
      ['            ', '}~(______)~{', '}~({E} .. {E})~{', '  (  --  )  ', '  ~_/  \\_~  '],
    ],
    rarity: 'rare',
  },
  capybara: {
    frames: [
      ['            ', '  n______n  ', ' ( {E}    {E} ) ', ' (   oo   ) ', '  `------´  '],
      ['            ', '  n______n  ', ' ( {E}    {E} ) ', ' (   Oo   ) ', '  `------´  '],
      ['    ~  ~    ', '  u______n  ', ' ( {E}    {E} ) ', ' (   oo   ) ', '  `------´  '],
    ],
    rarity: 'epic',
  },
  cactus: {
    frames: [
      ['            ', ' n  ____  n ', ' | |{E}  {E}| | ', ' |_|    |_| ', '   |    |   '],
      ['            ', '    ____    ', ' n |{E}  {E}| n ', ' |_|    |_| ', '   |    |   '],
      [' n        n ', ' |  ____  | ', ' | |{E}  {E}| | ', ' |_|    |_| ', '   |    |   '],
    ],
    rarity: 'epic',
  },
  robot: {
    frames: [
      ['            ', '   .[||].   ', '  [ {E}  {E} ]  ', '  [ ==== ]  ', '  `------´  '],
      ['            ', '   .[||].   ', '  [ {E}  {E} ]  ', '  [ -==- ]  ', '  `------´  '],
      ['     *      ', '   .[||].   ', '  [ {E}  {E} ]  ', '  [ ==== ]  ', '  `------´  '],
    ],
    rarity: 'epic',
  },
  rabbit: {
    frames: [
      ['            ', '   (\\__/)   ', '  ( {E}  {E} )  ', ' =(  ..  )= ', '  (")__(")  '],
      ['            ', '   (|__/)   ', '  ( {E}  {E} )  ', ' =(  ..  )= ', '  (")__(")  '],
      ['            ', '   (\\__/)   ', '  ( {E}  {E} )  ', ' =( .  . )= ', '  (")__(")  '],
    ],
    rarity: 'epic',
  },
  mushroom: {
    frames: [
      ['            ', ' .-o-OO-o-. ', '(__________)', '   |{E}  {E}|   ', '   |____|   '],
      ['            ', ' .-O-oo-O-. ', '(__________)', '   |{E}  {E}|   ', '   |____|   '],
      ['   . o  .   ', ' .-o-OO-o-. ', '(__________)', '   |{E}  {E}|   ', '   |____|   '],
    ],
    rarity: 'legendary',
  },
  chonk: {
    frames: [
      ['            ', '  /\\    /\\  ', ' ( {E}    {E} ) ', ' (   ..   ) ', '  `------´  '],
      ['            ', '  /\\    /|  ', ' ( {E}    {E} ) ', ' (   ..   ) ', '  `------´  '],
      ['            ', '  /\\    /\\  ', ' ( {E}    {E} ) ', ' (   ..   ) ', '  `------´~ '],
    ],
    rarity: 'legendary',
  },
};

const HAT_LINES: Record<string, string> = {
  none: '',
  crown: '   \\^^^/    ',
  tophat: '   [___]    ',
  propeller: '    -+-     ',
  halo: '   (   )    ',
  wizard: '    /^\\     ',
  beanie: '   (___)    ',
  tinyduck: '    ,>      ',
};

function renderSprite(frames: string[][], frameIndex: number, eye: string, hat: string): string {
  const frame = frames[frameIndex % frames.length];
  if (!frame) return '';
  const lines = frame.map(line => line.replaceAll('{E}', eye));
  // Apply hat if line 0 is blank
  if (hat !== 'none' && lines[0] && !lines[0].trim()) {
    lines[0] = HAT_LINES[hat] || '';
  }
  return lines.join('\n');
}

interface Props { locale?: Locale; }

export default function BuddyShowcase({ locale = "en" }: Props) {
  const [tick, setTick] = useState(0);
  const [selectedEyes, setSelectedEyes] = useState<Record<string, string>>({});
  const [selectedHats, setSelectedHats] = useState<Record<string, string>>({});

  // Animate at 500ms
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 500);
    return () => clearInterval(id);
  }, []);

  const frameIndex = IDLE_SEQUENCE[tick % IDLE_SEQUENCE.length]!;
  const isZh = locale === "zh";

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(SPECIES_DATA).map(([name, data]) => {
          const eye = selectedEyes[name] || '·';
          const hat = selectedHats[name] || 'none';
          const rarity = data.rarity;
          const fi = frameIndex === -1 ? 0 : frameIndex; // -1 = blink, use frame 0
          const displayEye = frameIndex === -1 ? '-' : eye;
          const sprite = renderSprite(data.frames, fi, displayEye, hat);

          return (
            <div key={name} className="rounded-xl border border-bg-border bg-bg-card p-4">
              {/* Sprite */}
              <pre
                className="font-mono text-xs leading-tight text-accent-cyan text-center mb-3 select-none"
                style={{ minHeight: '5.5em' }}
              >
                {sprite}
              </pre>

              {/* Name + rarity */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold capitalize">{name}</span>
                <span className="text-xs font-mono" style={{ color: RARITY_COLORS[rarity] }}>
                  {RARITY_STARS[rarity]} {rarity}
                </span>
              </div>

              {/* Eye selector */}
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs text-text-secondary w-8">{isZh ? "眼" : "Eye"}</span>
                {EYES.map(e => (
                  <button
                    key={e}
                    onClick={() => setSelectedEyes(prev => ({ ...prev, [name]: e }))}
                    className={`w-6 h-6 rounded text-center text-sm hover:bg-bg-border transition-colors ${eye === e ? 'bg-accent-purple/20 text-accent-purple' : 'text-text-secondary'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>

              {/* Hat selector */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-text-secondary w-8">{isZh ? "帽" : "Hat"}</span>
                {HATS.map(h => (
                  <button
                    key={h}
                    onClick={() => setSelectedHats(prev => ({ ...prev, [name]: h }))}
                    className={`w-6 h-6 rounded text-center text-xs hover:bg-bg-border transition-colors ${hat === h ? 'bg-accent-purple/20 text-accent-purple' : 'text-text-secondary'}`}
                    title={h}
                  >
                    {HAT_DISPLAY[h]}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
