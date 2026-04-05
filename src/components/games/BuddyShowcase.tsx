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

const PERSONALITIES: Record<string, { name: string; personality: string; personalityCn: string }> = {
  duck: { name: "Quaxley", personality: "An endlessly enthusiastic duck who gets unreasonably excited about clean code and will honk approvingly at every well-named variable.", personalityCn: "一只对整洁代码无比热情的鸭子，会对每个命名良好的变量发出赞许的嘎嘎声。" },
  goose: { name: "Honksworth", personality: "A dignified goose with strong opinions about code architecture who occasionally steals your cursor when you're not looking.", personalityCn: "一只对代码架构有强烈看法的高贵鹅，偶尔会在你不注意时偷走你的光标。" },
  blob: { name: "Wafflob", personality: "A gelatinous mass of pure patience that will spend six hours helping you trace a single variable, then suddenly quiver with inexplicable joy when you find the bug.", personalityCn: "一团纯粹耐心的果冻体，会花六小时帮你追踪一个变量，然后在你找到 bug 时突然莫名其妙地欢快抖动。" },
  cat: { name: "Debugpaws", personality: "A perpetually unimpressed cat who judges your code silently, then knocks your carefully stacked abstractions off the table.", personalityCn: "一只永远不屑的猫，默默审判你的代码，然后把你精心堆叠的抽象层从桌上推下去。" },
  dragon: { name: "Flamescale", personality: "A tiny dragon who breathes fire at runtime errors and hoards well-documented functions like treasure.", personalityCn: "一条对运行时错误喷火的小龙，像收藏宝藏一样囤积文档完善的函数。" },
  octopus: { name: "Tentacode", personality: "An eight-armed multitasker who reviews eight files simultaneously and somehow still finds the one typo you missed.", personalityCn: "一只八臂同时审查八个文件的多任务章鱼，不知怎的总能找到你遗漏的那个拼写错误。" },
  owl: { name: "Professor Hoot", personality: "A wise owl who stays up all night with you during deployments and quotes obscure RFCs at inappropriate moments.", personalityCn: "一只陪你通宵部署的智慧猫头鹰，在不恰当的时候引用晦涩的 RFC。" },
  penguin: { name: "Tuxworth", personality: "A dapper penguin who insists on formal code reviews and waddles away dramatically when you skip tests.", personalityCn: "一只坚持正式代码审查的优雅企鹅，在你跳过测试时戏剧性地扭头离开。" },
  turtle: { name: "Shelldon", personality: "A methodical turtle who writes the most thorough test suites but takes three days to review a one-line PR.", personalityCn: "一只编写最全面测试套件的严谨乌龟，但审查一行 PR 要花三天。" },
  snail: { name: "Slugsworth", personality: "The slowest code reviewer alive, but leaves a beautiful trail of insightful comments wherever it goes.", personalityCn: "世上最慢的代码审查员，但走过的地方都留下了美丽的深刻评论。" },
  ghost: { name: "Spectre", personality: "A ghostly companion who phases through your code looking for phantom bugs and whispers cryptic hints about race conditions.", personalityCn: "一个穿越你代码寻找幽灵 bug 的鬼魂伙伴，低语着关于竞态条件的神秘提示。" },
  axolotl: { name: "Regenix", personality: "An adorable axolotl that regenerates deleted code from memory and smiles serenely through every merge conflict.", personalityCn: "一只从记忆中再生已删除代码的可爱美西螈，在每次合并冲突中都保持宁静的微笑。" },
  capybara: { name: "Chillbara", personality: "The most relaxed companion possible. Nothing phases it — not even a production outage at 3am. Just vibes.", personalityCn: "最放松的伙伴。没有什么能影响它 — 即使是凌晨 3 点的生产故障。只管氛围。" },
  cactus: { name: "Prickle", personality: "A spiky cactus that thrives in harsh environments and points out exactly where your code hurts — with love.", personalityCn: "一株在恶劣环境中茁壮成长的仙人掌，用爱精确指出你代码的痛点。" },
  robot: { name: "Unit-404", personality: "A robot companion obsessed with optimization who occasionally tries to refactor your lunch break.", personalityCn: "一个痴迷于优化的机器人伙伴，偶尔试图重构你的午休时间。" },
  rabbit: { name: "Hopscript", personality: "An energetic rabbit that bounces between files at lightning speed and leaves TODO comments in places you forgot existed.", personalityCn: "一只以闪电般速度在文件间跳跃的兔子，在你忘记存在的地方留下 TODO 注释。" },
  mushroom: { name: "Sporelet", personality: "A mystical mushroom that grows in the darkest corners of your codebase and occasionally reveals hidden dependencies.", personalityCn: "一朵在代码库最黑暗角落生长的神秘蘑菇，偶尔揭示隐藏的依赖关系。" },
  chonk: { name: "Megabyte", personality: "An absolute unit of a companion. Takes up half your terminal but provides twice the moral support.", personalityCn: "一个绝对的大块头伙伴。占据你一半终端，但提供双倍的精神支持。" },
};

const SAMPLE_STATS: Record<string, Record<string, number>> = {
  duck: { DEBUGGING: 35, PATIENCE: 42, CHAOS: 68, WISDOM: 28, SNARK: 45 },
  goose: { DEBUGGING: 22, PATIENCE: 15, CHAOS: 88, WISDOM: 45, SNARK: 72 },
  blob: { DEBUGGING: 22, PATIENCE: 77, CHAOS: 7, WISDOM: 35, SNARK: 19 },
  cat: { DEBUGGING: 55, PATIENCE: 12, CHAOS: 65, WISDOM: 48, SNARK: 90 },
  dragon: { DEBUGGING: 70, PATIENCE: 30, CHAOS: 55, WISDOM: 62, SNARK: 40 },
  octopus: { DEBUGGING: 85, PATIENCE: 60, CHAOS: 35, WISDOM: 72, SNARK: 28 },
  owl: { DEBUGGING: 45, PATIENCE: 55, CHAOS: 20, WISDOM: 92, SNARK: 38 },
  penguin: { DEBUGGING: 50, PATIENCE: 70, CHAOS: 15, WISDOM: 65, SNARK: 55 },
  turtle: { DEBUGGING: 40, PATIENCE: 95, CHAOS: 5, WISDOM: 75, SNARK: 10 },
  snail: { DEBUGGING: 30, PATIENCE: 99, CHAOS: 3, WISDOM: 60, SNARK: 15 },
  ghost: { DEBUGGING: 75, PATIENCE: 40, CHAOS: 70, WISDOM: 55, SNARK: 65 },
  axolotl: { DEBUGGING: 60, PATIENCE: 80, CHAOS: 25, WISDOM: 50, SNARK: 20 },
  capybara: { DEBUGGING: 35, PATIENCE: 98, CHAOS: 2, WISDOM: 40, SNARK: 5 },
  cactus: { DEBUGGING: 65, PATIENCE: 45, CHAOS: 30, WISDOM: 55, SNARK: 85 },
  robot: { DEBUGGING: 95, PATIENCE: 50, CHAOS: 10, WISDOM: 80, SNARK: 60 },
  rabbit: { DEBUGGING: 40, PATIENCE: 20, CHAOS: 80, WISDOM: 35, SNARK: 50 },
  mushroom: { DEBUGGING: 70, PATIENCE: 65, CHAOS: 50, WISDOM: 90, SNARK: 45 },
  chonk: { DEBUGGING: 30, PATIENCE: 85, CHAOS: 40, WISDOM: 25, SNARK: 75 },
};

// All 18 species with their 3 frames of ASCII art (copied from sprites.ts)
const SPECIES_CN: Record<string, string> = {
  duck: "鸭子", goose: "鹅", blob: "果冻", cat: "猫", dragon: "龙",
  octopus: "章鱼", owl: "猫头鹰", penguin: "企鹅", turtle: "乌龟", snail: "蜗牛",
  ghost: "幽灵", axolotl: "美西螈", capybara: "水豚", cactus: "仙人掌",
  robot: "机器人", rabbit: "兔子", mushroom: "蘑菇", chonk: "胖墩",
};

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
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

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
            <div
              key={name}
              className={`rounded-xl border bg-bg-card p-4 cursor-pointer transition-colors ${
                selectedSpecies === name ? 'border-accent-purple' : 'border-bg-border hover:border-accent-purple/50'
              }`}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedSpecies(selectedSpecies === name ? null : name)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedSpecies(selectedSpecies === name ? null : name); } }}
            >
              {/* Sprite */}
              <pre
                className="font-mono text-xs leading-tight text-accent-cyan text-center mb-3 select-none"
                style={{ minHeight: '5.5em' }}
              >
                {sprite}
              </pre>

              {/* Name + rarity */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold capitalize">{isZh ? SPECIES_CN[name] || name : name}</span>
                <span className="text-xs font-mono" style={{ color: RARITY_COLORS[rarity] }}>
                  {RARITY_STARS[rarity]} {rarity}
                </span>
              </div>
              <p className="text-[10px] text-accent-purple mb-2">{isZh ? "▶ 点击查看详情" : "▶ Click for details"}</p>

              {/* Eye selector */}
              <div className="flex items-center gap-1 mb-1" onClick={e => e.stopPropagation()}>
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
              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
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

      {selectedSpecies && (() => {
        const name = selectedSpecies;
        const data = SPECIES_DATA[name];
        const p = PERSONALITIES[name];
        const stats = SAMPLE_STATS[name];
        if (!data || !p || !stats) return null;
        const eye = selectedEyes[name] || '·';
        const hat = selectedHats[name] || 'none';
        const rarity = data.rarity;
        const fi = frameIndex === -1 ? 0 : frameIndex;
        const sprite = renderSprite(data.frames, fi, frameIndex === -1 ? '-' : eye, hat);

        return (
          <div className="mt-6 rounded-xl border-2 border-accent-purple/30 bg-bg-card p-6 font-mono text-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: RARITY_COLORS[rarity] }}>
                {RARITY_STARS[rarity]} {rarity.toUpperCase()}
              </span>
              <span className="text-text-secondary uppercase">{isZh ? SPECIES_CN[name] || name : name}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Sprite */}
              <div className="flex-shrink-0">
                <pre className="text-accent-cyan leading-tight select-none text-base">
                  {sprite}
                </pre>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text mb-2">{p.name}</h3>
                <p className="text-text-secondary text-xs leading-relaxed mb-4 italic">
                  "{isZh ? p.personalityCn : p.personality}"
                </p>

                {/* Stats */}
                <div className="space-y-1.5">
                  {Object.entries(stats).map(([stat, value]) => (
                    <div key={stat} className="flex items-center gap-2 text-xs">
                      <span className="w-20 text-text-secondary">{stat}</span>
                      <div className="flex-1 h-3 bg-bg rounded overflow-hidden">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${value}%`,
                            backgroundColor: value >= 80 ? '#10b981' : value >= 50 ? '#22d3ee' : value >= 30 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-text-secondary">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedSpecies(null); }}
              className="mt-4 text-xs text-text-secondary hover:text-accent-purple transition-colors"
            >
              {isZh ? "← 返回图鉴" : "← Back to showcase"}
            </button>
          </div>
        );
      })()}
    </div>
  );
}
