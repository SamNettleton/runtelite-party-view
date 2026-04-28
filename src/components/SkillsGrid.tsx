import React from 'react';
import { PlayerStats } from '@/types';

export const SkillsGrid: React.FC<{ stats?: PlayerStats }> = ({ stats }) => {
  const skillLayout = [
    'attack',
    'hitpoints',
    'mining',
    'strength',
    'agility',
    'smithing',
    'defence',
    'herblore',
    'fishing',
    'ranged',
    'thieving',
    'cooking',
    'prayer',
    'crafting',
    'firemaking',
    'magic',
    'fletching',
    'woodcutting',
    'runecraft',
    'slayer',
    'farming',
    'construction',
    'hunter',
    'sailing',
  ];

  const getIconUrl = (skill: string) => {
    const name = skill.charAt(0).toUpperCase() + skill.slice(1);
    return `https://oldschool.runescape.wiki/images/${name}_icon.png`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {skillLayout.map((skill) => {
          const data = stats?.[skill];
          const current = typeof data === 'object' ? data.current : data || 1;
          const base = typeof data === 'object' ? data.base : data || 1;

          return (
            <div key={skill} style={styles.item}>
              <img
                src={getIconUrl(skill)}
                alt={skill}
                style={styles.skillIcon}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div style={styles.statBox}>
                <span style={styles.currentText}>{current}</span>
                <span style={styles.baseText}>{base}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#3e3529',
    borderRadius: '4px',
    border: '2px solid #2a241c',
    boxSizing: 'border-box',
    width: '215px',
    height: '344px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '18px',
    paddingBottom: '18px',
    paddingLeft: '8.5px',
    paddingRight: '8.5px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 62px)',
    gridTemplateRows: 'repeat(8, 35px)',
    gap: '4px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 4px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '2px',
    gap: '6px',
    height: '35px',
  },
  skillIcon: {
    width: '18px',
    height: '18px',
    objectFit: 'contain',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  currentText: {
    color: '#ffff66',
    fontWeight: 'normal',
    fontSize: '11px',
    alignSelf: 'flex-start',
    lineHeight: '1',
    textShadow: '1px 1px 0 #000',
    marginTop: '2px',
  },
  baseText: {
    color: '#ffff66',
    fontWeight: 'normal',
    fontSize: '11px',
    alignSelf: 'flex-end',
    lineHeight: '1',
    textShadow: '1px 1px 0 #000',
    marginBottom: '2px',
    marginRight: '2px',
  },
};
