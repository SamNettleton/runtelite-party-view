import React from 'react';
import { PlayerState } from '@/types';
import { InventoryGrid } from './InventoryGrid';
import { EquipmentGrid } from './EquipmentGrid';
import { StatBars } from './StatBars';
import { SkillsGrid } from './SkillsGrid';

interface PlayerCardProps {
  memberId: string;
  player: PlayerState;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ memberId, player }) => {
  const nameColor = player.member.color ? player.member.color.substring(0, 7) : '#fff';

  return (
    <div className="player-card">
      <div className="card-header">
        <h3 style={{ color: nameColor }}>{player.member.name || 'Unknown Player'}</h3>
        <span className="member-id">ID: {memberId}</span>
      </div>

      <StatBars stats={player.stats} />

      <div className="section">
        <h4 className="section-title">Inventory</h4>
        <InventoryGrid items={player.inventory} />
      </div>

      <div className="section">
        <h4 className="section-title">Equipment</h4>
        <EquipmentGrid items={player.equipment} />
      </div>

      <SkillsGrid stats={player.stats} combatLevel={player.combatLevel} />
    </div>
  );
};
