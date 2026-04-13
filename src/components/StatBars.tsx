import React from 'react';
import { PlayerStats } from '@/types';

export const StatBars: React.FC<{ stats?: PlayerStats }> = ({ stats }) => {
  if (!stats) return null;
  return (
    <div style={styles.container}>
      {stats.hitpoints && (
        <div style={{ ...styles.pill, color: '#ff4d4d' }}>
          <img
            src="https://oldschool.runescape.wiki/images/Hitpoints_icon.png"
            style={styles.icon}
            alt="HP"
          />
          {stats.hitpoints.current}/{stats.hitpoints.base}
        </div>
      )}
      {stats.prayer && (
        <div style={{ ...styles.pill, color: '#33ccff' }}>
          <img
            src="https://oldschool.runescape.wiki/images/Prayer_icon.png"
            style={styles.icon}
            alt="Pray"
          />
          {stats.prayer.current}/{stats.prayer.base}
        </div>
      )}
      {stats.runEnergy !== undefined && (
        <div style={{ ...styles.pill, color: '#ffff66' }}>
          <img
            src="https://oldschool.runescape.wiki/images/Leather_boots_detail.png"
            style={styles.icon}
            alt="Run"
          />
          {stats.runEnergy}%
        </div>
      )}
      {stats.spec !== undefined && (
        <div style={{ ...styles.pill, color: '#009d8e' }}>
          <img
            src="https://oldschool.runescape.wiki/images/Multicombat.png"
            style={styles.icon}
            alt="Spec"
          />
          {stats.spec}%
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' },
  pill: {
    fontSize: '0.8rem',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  icon: { width: '16px', height: '16px' },
};
