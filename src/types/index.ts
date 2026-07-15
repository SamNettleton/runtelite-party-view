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

/**
 * Represents the last NPC (or player) that a party member attacked,
 * sourced from the `PredictedHitPartyMessage` sent by the XP Drops plugin.
 */
export interface LastAttackedTarget {
  /** NPC ID being attacked (-1 if the target is a player). */
  npcId: number;
  /** Whether the target is another player rather than an NPC. */
  isPlayer: boolean;
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
  /** The last NPC or player this party member attacked (from PredictedHitPartyMessage). */
  lastAttackedTarget?: LastAttackedTarget;
}

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'reconnecting';
