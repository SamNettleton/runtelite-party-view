import { describe, it, expect } from 'vitest';
import { updatePlayerFromData } from './partyReducer';
import type { PlayerState } from '@/types';

function emptyPlayer(id = '1'): PlayerState {
  return {
    member: { memberId: id, name: 'Test' },
    stats: {},
    inventory: [],
    equipment: [],
    combatLevel: 3,
    world: 0,
  };
}

describe('updatePlayerFromData – StatusUpdate', () => {
  it('sets the player name', () => {
    const result = updatePlayerFromData(emptyPlayer(), 'StatusUpdate', { n: 'Farmer Carb' });
    expect(result.member.name).toBe('Farmer Carb');
  });

  it('sets the player color', () => {
    const result = updatePlayerFromData(emptyPlayer(), 'StatusUpdate', { c: '#ff0000' });
    expect(result.member.color).toBe('#ff0000');
  });

  it('sets current hitpoints', () => {
    const result = updatePlayerFromData(emptyPlayer(), 'StatusUpdate', { hc: 50 });
    expect(result.stats?.hitpoints?.current).toBe(50);
    expect(result.stats?.hitpoints?.base).toBe(99); // default
  });

  it('sets max hitpoints', () => {
    const result = updatePlayerFromData(emptyPlayer(), 'StatusUpdate', { hm: 80 });
    expect(result.stats?.hitpoints?.base).toBe(80);
  });

  it('sets current prayer', () => {
    const result = updatePlayerFromData(emptyPlayer(), 'StatusUpdate', { pc: 30 });
    expect(result.stats?.prayer?.current).toBe(30);
  });

  it('sets max prayer', () => {
    const result = updatePlayerFromData(emptyPlayer(), 'StatusUpdate', { pm: 77 });
    expect(result.stats?.prayer?.base).toBe(77);
  });

  it('sets run energy', () => {
    const result = updatePlayerFromData(emptyPlayer(), 'StatusUpdate', { r: 75 });
    expect(result.stats?.runEnergy).toBe(75);
  });

  it('sets spec energy', () => {
    const result = updatePlayerFromData(emptyPlayer(), 'StatusUpdate', { s: 50 });
    expect(result.stats?.spec).toBe(50);
  });

  it('preserves existing stats when updating partially', () => {
    const withHp = updatePlayerFromData(emptyPlayer(), 'StatusUpdate', { hc: 90, hm: 99 });
    const result = updatePlayerFromData(withHp, 'StatusUpdate', { pc: 43 });
    expect(result.stats?.hitpoints?.current).toBe(90);
    expect(result.stats?.prayer?.current).toBe(43);
  });
});

describe('updatePlayerFromData – PartyBatchedChange', () => {
  it('processes misc updates (run energy, spec, combat, world)', () => {
    const data = {
      m: [
        { t: 'R', v: 80 },
        { t: 'S', v: 100 },
        { t: 'C', v: 126 },
        { t: 'W', v: 420 },
      ],
    };
    const result = updatePlayerFromData(emptyPlayer(), 'PartyBatchedChange', data);
    expect(result.stats?.runEnergy).toBe(80);
    expect(result.stats?.spec).toBe(100);
    expect(result.combatLevel).toBe(126);
    expect(result.world).toBe(420);
  });

  it('processes hitpoints and prayer from batch updates', () => {
    const data = {
      m: [
        { t: 'H', v: 55 },
        { t: 'P', v: 30 },
      ],
    };
    const result = updatePlayerFromData(emptyPlayer(), 'PartyBatchedChange', data);
    expect(result.stats?.hitpoints?.current).toBe(55);
    expect(result.stats?.prayer?.current).toBe(30);
  });

  it('parses inventory items from [id, qty, id, qty, ...] format', () => {
    const data = { i: [4151, 1, 385, 20] };
    const result = updatePlayerFromData(emptyPlayer(), 'PartyBatchedChange', data);
    expect(result.inventory).toEqual([
      { id: 4151, qty: 1 },
      { id: 385, qty: 20 },
    ]);
  });

  it('parses equipment items', () => {
    const data = { e: [10828, 1, 6585, 1] };
    const result = updatePlayerFromData(emptyPlayer(), 'PartyBatchedChange', data);
    expect(result.equipment).toEqual([
      { id: 10828, qty: 1 },
      { id: 6585, qty: 1 },
    ]);
  });

  it('parses skill data', () => {
    const data = {
      s: [
        { s: 0, l: 99, b: 118 }, // attack
        { s: 6, l: 99, b: 109 }, // magic
      ],
    };
    const result = updatePlayerFromData(emptyPlayer(), 'PartyBatchedChange', data);
    expect(result.stats?.attack).toEqual({ base: 99, current: 118 });
    expect(result.stats?.magic).toEqual({ base: 99, current: 109 });
  });

  it('clamps skill base levels to 99', () => {
    const data = { s: [{ s: 3, l: 120, b: 120 }] }; // hitpoints with virtual level
    const result = updatePlayerFromData(emptyPlayer(), 'PartyBatchedChange', data);
    expect(result.stats?.hitpoints).toEqual({ base: 99, current: 120 });
  });

  it('sets prayer mask', () => {
    const data = { ep: 16384 };
    const result = updatePlayerFromData(emptyPlayer(), 'PartyBatchedChange', data);
    expect(result.prayerMask).toBe(16384);
  });

  it('does not clobber existing stats on partial update', () => {
    let player = updatePlayerFromData(emptyPlayer(), 'PartyBatchedChange', {
      m: [{ t: 'W', v: 302 }],
    });
    player = updatePlayerFromData(player, 'PartyBatchedChange', {
      m: [{ t: 'R', v: 100 }],
    });
    expect(player.world).toBe(302);
    expect(player.stats?.runEnergy).toBe(100);
  });
});

describe('updatePlayerFromData – unknown type', () => {
  it('returns the player unchanged for an unknown message type', () => {
    const player = emptyPlayer();
    const result = updatePlayerFromData(player, 'UnknownType', { foo: 'bar' });
    expect(result.member).toEqual(player.member);
    expect(result.inventory).toEqual(player.inventory);
  });
});

describe('updatePlayerFromData – PredictedHitPartyMessage', () => {
  it('stores NPC target from predictedHit', () => {
    const data = {
      predictedHit: {
        npcId: 8349,
        opponentIsPlayer: false,
        targetIndex: 7,
        playerCombatLevel: -1,
      },
      color: { r: 255, g: 255, b: 255 },
      world: 302,
    };
    const result = updatePlayerFromData(emptyPlayer(), 'PredictedHitPartyMessage', data);
    expect(result.lastAttackedTarget).toEqual({
      npcId: 8349,
      isPlayer: false,
    });
  });

  it('stores player target', () => {
    const data = {
      predictedHit: {
        npcId: -1,
        opponentIsPlayer: true,
        targetIndex: 3,
      },
      color: { r: 0, g: 0, b: 0 },
      world: 302,
    };
    const result = updatePlayerFromData(emptyPlayer(), 'PredictedHitPartyMessage', data);
    expect(result.lastAttackedTarget).toEqual({
      npcId: -1,
      isPlayer: true,
    });
  });

  it('does not set lastAttackedTarget when predictedHit is absent', () => {
    const result = updatePlayerFromData(emptyPlayer(), 'PredictedHitPartyMessage', { color: {}, world: 302 });
    expect(result.lastAttackedTarget).toBeUndefined();
  });

  it('preserves all other player state when updating lastAttackedTarget', () => {
    let player = updatePlayerFromData(emptyPlayer(), 'PartyBatchedChange', {
      m: [{ t: 'C', v: 126 }],
    });
    player = updatePlayerFromData(player, 'PredictedHitPartyMessage', {
      predictedHit: { npcId: 9999, opponentIsPlayer: false, targetIndex: 0, playerCombatLevel: -1 },
      world: 302,
    });
    expect(player.combatLevel).toBe(126);
    expect(player.lastAttackedTarget?.npcId).toBe(9999);
  });
});
