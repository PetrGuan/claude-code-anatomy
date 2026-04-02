// Null = transparent pixel
type Sprite = (string | null)[][];

const _ = null; // shorthand for transparent

// Player: Message courier character (blue coat, white envelope)
export const playerSprite: Sprite = [
  [_,_,_,"#ffd5b0","#ffd5b0",_,_,_],
  [_,_,"#ffd5b0","#ffd5b0","#ffd5b0","#ffd5b0",_,_],
  [_,_,"#222","#ffd5b0","#ffd5b0","#222",_,_],
  [_,_,"#ffd5b0","#ffd5b0","#ffd5b0","#ffd5b0",_,_],
  [_,_,_,"#6c63ff","#6c63ff",_,_,_],
  [_,"#6c63ff","#6c63ff","#fff","#fff","#6c63ff","#6c63ff",_],
  [_,"#6c63ff","#6c63ff","#6c63ff","#6c63ff","#6c63ff","#6c63ff",_],
  [_,_,"#6c63ff","#6c63ff","#6c63ff","#6c63ff",_,_],
  [_,_,_,"#6c63ff","#6c63ff",_,_,_],
  [_,_,"#4a4","#4a4",_,"#4a4","#4a4",_],
  [_,_,"#4a4","#4a4",_,"#4a4","#4a4",_],
];

// PromptInput NPC: clipboard character (green, with notepad)
export const promptInputSprite: Sprite = [
  [_,_,_,"#a0d0a0","#a0d0a0",_,_,_],
  [_,_,"#a0d0a0","#a0d0a0","#a0d0a0","#a0d0a0",_,_],
  [_,_,"#222","#a0d0a0","#a0d0a0","#222",_,_],
  [_,_,"#a0d0a0","#d08080","#a0d0a0","#a0d0a0",_,_],
  [_,_,_,"#10b981","#10b981",_,_,_],
  [_,"#10b981","#10b981","#fff","#fff","#10b981","#10b981",_],
  [_,"#10b981","#fff","#888","#888","#fff","#10b981",_],
  [_,_,"#10b981","#fff","#fff","#10b981",_,_],
  [_,_,_,"#10b981","#10b981",_,_,_],
  [_,_,"#654","#654",_,"#654","#654",_],
  [_,_,"#654","#654",_,"#654","#654",_],
];

// Claude API NPC: cloud character (cyan/white, floating)
export const claudeApiSprite: Sprite = [
  [_,_,"#fff","#fff","#fff","#fff",_,_],
  [_,"#fff","#e0f0ff","#e0f0ff","#e0f0ff","#e0f0ff","#fff",_],
  ["#fff","#e0f0ff","#22d3ee","#e0f0ff","#e0f0ff","#22d3ee","#e0f0ff","#fff"],
  ["#fff","#e0f0ff","#e0f0ff","#e0f0ff","#e0f0ff","#e0f0ff","#e0f0ff","#fff"],
  ["#fff","#e0f0ff","#e0f0ff","#e0f0ff","#e0f0ff","#e0f0ff","#e0f0ff","#fff"],
  [_,"#fff","#e0f0ff","#22d3ee","#22d3ee","#e0f0ff","#fff",_],
  [_,_,"#fff","#fff","#fff","#fff",_,_],
  [_,_,_,"#22d3ee",_,_,_,_],
  [_,_,"#22d3ee","#22d3ee","#22d3ee",_,_,_],
  [_,_,_,_,_,"#22d3ee",_,_],
  [_,_,_,_,"#22d3ee","#22d3ee","#22d3ee",_],
];

// ToolMaster NPC: wrench character (orange, with tool belt)
export const toolMasterSprite: Sprite = [
  [_,_,"#f59e0b","#f59e0b","#f59e0b","#f59e0b",_,_],
  [_,_,_,"#ffd5b0","#ffd5b0",_,_,_],
  [_,_,"#ffd5b0","#ffd5b0","#ffd5b0","#ffd5b0",_,_],
  [_,_,"#222","#ffd5b0","#ffd5b0","#222",_,_],
  [_,_,"#ffd5b0","#ffd5b0","#ffd5b0","#ffd5b0",_,_],
  [_,"#f59e0b","#f59e0b","#f59e0b","#f59e0b","#f59e0b","#f59e0b",_],
  ["#888","#f59e0b","#f59e0b","#f59e0b","#f59e0b","#f59e0b","#f59e0b","#888"],
  [_,_,"#f59e0b","#f59e0b","#f59e0b","#f59e0b",_,_],
  [_,_,_,"#654","#654",_,_,_],
  [_,_,"#654","#654",_,"#654","#654",_],
  [_,_,"#654","#654",_,"#654","#654",_],
];

// SecurityGuard NPC: shield character (amber, armored)
export const securityGuardSprite: Sprite = [
  [_,_,"#f59e0b","#f59e0b","#f59e0b","#f59e0b",_,_],
  [_,"#f59e0b","#f59e0b","#f59e0b","#f59e0b","#f59e0b","#f59e0b",_],
  [_,_,"#222","#ffd5b0","#ffd5b0","#222",_,_],
  [_,_,"#ffd5b0","#ffd5b0","#ffd5b0","#ffd5b0",_,_],
  [_,_,_,"#d97706","#d97706",_,_,_],
  [_,"#d97706","#d97706","#f59e0b","#f59e0b","#d97706","#d97706",_],
  ["#d97706","#d97706","#f59e0b","#fff","#fff","#f59e0b","#d97706","#d97706"],
  [_,"#d97706","#d97706","#f59e0b","#f59e0b","#d97706","#d97706",_],
  [_,_,_,"#d97706","#d97706",_,_,_],
  [_,_,"#654","#654",_,"#654","#654",_],
  [_,_,"#654","#654",_,"#654","#654",_],
];

// Object sprites (smaller, 6x6)
export const terminalSprite: Sprite = [
  ["#444","#444","#444","#444","#444","#444"],
  ["#444","#222","#222","#222","#222","#444"],
  ["#444","#222","#4f4","#4f4","#222","#444"],
  ["#444","#222","#4f4","#222","#222","#444"],
  ["#444","#222","#222","#222","#222","#444"],
  ["#444","#444","#444","#444","#444","#444"],
];

export const folderSprite: Sprite = [
  ["#f59e0b","#f59e0b","#f59e0b",_,_,_],
  ["#f59e0b","#f59e0b","#f59e0b","#f59e0b","#f59e0b","#f59e0b"],
  ["#d97706","#d97706","#d97706","#d97706","#d97706","#d97706"],
  ["#d97706","#d97706","#d97706","#d97706","#d97706","#d97706"],
  ["#d97706","#d97706","#d97706","#d97706","#d97706","#d97706"],
  ["#b45309","#b45309","#b45309","#b45309","#b45309","#b45309"],
];

export const brainSprite: Sprite = [
  [_,"#f472b6","#f472b6","#f472b6","#f472b6",_],
  ["#f472b6","#fda4c8","#f472b6","#fda4c8","#f472b6","#f472b6"],
  ["#f472b6","#f472b6","#fda4c8","#f472b6","#fda4c8","#f472b6"],
  ["#f472b6","#fda4c8","#f472b6","#fda4c8","#f472b6","#f472b6"],
  [_,"#f472b6","#f472b6","#f472b6","#f472b6",_],
  [_,_,"#f472b6","#f472b6",_,_],
];

export const shieldSprite: Sprite = [
  [_,"#f59e0b","#f59e0b","#f59e0b","#f59e0b",_],
  ["#f59e0b","#f59e0b","#fff","#fff","#f59e0b","#f59e0b"],
  ["#f59e0b","#fff","#f59e0b","#f59e0b","#fff","#f59e0b"],
  ["#f59e0b","#f59e0b","#fff","#fff","#f59e0b","#f59e0b"],
  [_,"#f59e0b","#f59e0b","#f59e0b","#f59e0b",_],
  [_,_,"#d97706","#d97706",_,_],
];

// Map NPC id to sprite
export const npcSprites: Record<string, Sprite> = {
  "prompt-input": promptInputSprite,
  "claude-api": claudeApiSprite,
  "tool-master": toolMasterSprite,
  "security-guard": securityGuardSprite,
};

// Map object emoji to sprite (for objects that have pixel versions)
export const objectSprites: Record<string, Sprite> = {
  "\u{1F5A5}\uFE0F": terminalSprite,
  "\u{1F4C1}": folderSprite,
  "\u{1F9E0}": brainSprite,
  "\u{1F6E1}\uFE0F": shieldSprite,
};
