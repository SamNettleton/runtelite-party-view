export interface PartyMember {
  memberId: string;
  name: string;
  color?: string;
}

export interface InventoryItem {
  id: number;
  qty: number;
}

/**
 * Represents an OSRS skill with current (boosted/drained)
 * and base (permanent) levels.
 */
export interface SkillValue {
  current: number;
  base: number;
}

export interface PlayerStats {
  hitpoints?: SkillValue;
  prayer?: SkillValue;
  runEnergy?: number;
  spec?: number;
  overloadSippedAt?: number; // Timestamp of when overload was sipped, if applicable

  [key: string]: SkillValue | number | undefined;
}

export interface PlayerState {
  member: PartyMember;
  inventory?: InventoryItem[];
  equipment?: InventoryItem[];
  stats?: PlayerStats;
  world?: number;
  combatLevel?: number;
  [key: string]: any;
  prayerMask?: number;
}

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'reconnecting';
