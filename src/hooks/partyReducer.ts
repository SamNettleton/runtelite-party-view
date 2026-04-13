import { PlayerState, PlayerStats, InventoryItem } from '@/types';

const SKILL_NAMES = [
  'attack',
  'defence',
  'strength',
  'hitpoints',
  'ranged',
  'prayer',
  'magic',
  'cooking',
  'woodcutting',
  'fletching',
  'fishing',
  'firemaking',
  'crafting',
  'smithing',
  'mining',
  'herblore',
  'agility',
  'thieving',
  'slayer',
  'farming',
  'runecraft',
  'hunter',
  'construction',
];

export function updatePlayerFromData(existing: PlayerState, type: string, data: any): PlayerState {
  const next = { ...existing };
  const stats: PlayerStats = { ...existing.stats };

  if (type === 'StatusUpdate') {
    if (data.n) next.member.name = data.n;
    if (data.c) next.member.color = data.c;

    // Support both SkillValue objects and legacy flat numbers
    if (data.hc !== undefined)
      stats.hitpoints = { current: data.hc, base: stats.hitpoints?.base ?? 99 };
    if (data.hm !== undefined)
      stats.hitpoints = { current: stats.hitpoints?.current ?? 0, base: data.hm };
    if (data.pc !== undefined) stats.prayer = { current: data.pc, base: stats.prayer?.base ?? 99 };
    if (data.pm !== undefined)
      stats.prayer = { current: stats.prayer?.current ?? 0, base: data.pm };

    stats.runEnergy = data.r ?? stats.runEnergy;
    stats.spec = data.s ?? stats.spec;
  }

  if (type === 'PartyBatchedChange') {
    // Stats/Misc
    if (Array.isArray(data.m)) {
      data.m.forEach((u: any) => {
        switch (u.t) {
          case 'R':
            stats.runEnergy = u.v;
            break;
          case 'S':
            stats.spec = u.v;
            break;
          case 'C':
            next.combatLevel = u.v;
            break;
          case 'W':
            next.world = u.v;
            break;
          case 'H':
            stats.hitpoints = { current: u.v, base: stats.hitpoints?.base ?? 99 };
            break;
          case 'P':
            stats.prayer = { current: u.v, base: stats.prayer?.base ?? 99 };
            break;
        }
      });
    }

    // Inventory & Equipment (serialized as [id, qty, id, qty...])
    const parseItems = (arr: number[]): InventoryItem[] => {
      const items: InventoryItem[] = [];
      for (let i = 0; i < arr.length; i += 2) {
        items.push({ id: arr[i], qty: arr[i + 1] });
      }
      return items;
    };

    if (Array.isArray(data.i)) next.inventory = parseItems(data.i);
    if (Array.isArray(data.e)) next.equipment = parseItems(data.e);

    // Skills
    if (Array.isArray(data.s)) {
      data.s.forEach((sData: { s: number; l: number; b: number }) => {
        const name = SKILL_NAMES[sData.s];
        if (name) stats[name] = { current: sData.l, base: sData.b };
      });
    }
  }

  return { ...next, stats };
}
