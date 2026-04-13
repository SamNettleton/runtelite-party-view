import React from 'react';
import { PlayerStats } from '@/types';

export const SkillsGrid: React.FC<{ stats?: PlayerStats; combatLevel?: number }> = ({
  stats,
  combatLevel,
}) => (
  <div style={{ marginTop: '1rem' }}>
    <h4 style={styles.title}>Skills (Lvl {combatLevel || 3})</h4>
    <div style={styles.grid}>
      {Object.entries(stats || {})
        .filter(([key, val]) => typeof val === 'object' && !['hitpoints', 'prayer'].includes(key))
        .map(([skill, data]: [string, any]) => (
          <div key={skill} style={styles.item}>
            <span style={styles.name}>{skill.substring(0, 3)}:</span>
            <div style={styles.values}>
              <span style={{ color: '#ffff66', fontWeight: 'bold' }}>{data.current}</span>
              <span style={styles.base}>/{data.base}</span>
            </div>
          </div>
        ))}
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '4px',
    padding: '8px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '4px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    background: 'rgba(255,255,255,0.03)',
    padding: '2px 4px',
    borderRadius: '2px',
  },
  name: { color: 'var(--text-muted)', textTransform: 'capitalize' },
  values: { marginLeft: 'auto', display: 'flex', gap: '2px', alignItems: 'baseline' },
  base: { color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' },
};
