import React, { useEffect, useRef, useState } from 'react';
import { PlayerState } from '@/types';
import { InventoryGrid } from '@/components/player/InventoryGrid';
import { EquipmentGrid } from '@/components/player/EquipmentGrid';
import { StatBars } from '@/components/player/StatBars';
import { SkillsGrid } from '@/components/player/SkillsGrid';

import wornEquipmentIcon from '@/assets/Worn_Equipment.png';
import { PrayerGrid } from '@/components/player/PrayerGrid';

interface PlayerCardProps {
  memberId: string;
  player: PlayerState;
  multiTabMode: boolean;
  timerFormat: 'ticks' | 'mss';
  onHide: () => void;
  dndRef?: (element: HTMLElement | null) => void;
  dndStyle?: React.CSSProperties;
  dragHandleProps?: any;
}

type GridView = 'inventory' | 'equipment' | 'skills' | 'prayer';

export const PlayerCard: React.FC<PlayerCardProps> = ({
  memberId,
  player,
  multiTabMode,
  timerFormat,
  onHide,
  dndRef,
  dndStyle,
  dragHandleProps,
}) => {
  if (!player) return null;

  const [activeViews, setActiveViews] = useState<GridView[]>(['inventory']);

  const multiTabRef = useRef(multiTabMode);

  useEffect(() => {
    multiTabRef.current = multiTabMode;
  }, [multiTabMode]);

  const nameColor = player.member.color ? player.member.color.substring(0, 7) : '#fff';

  const toggleView = (view: GridView) => {
    setActiveViews((prev) => {
      if (multiTabMode) {
        if (prev.includes(view)) {
          if (prev.length === 1) return prev;
          return prev.filter((v) => v !== view);
        }
        return [...prev, view];
      }

      if (prev.length === 1 && prev[0] === view) return prev;

      return [view];
    });
  };

  const tabs = [
    { id: 'inventory', icon: 'https://oldschool.runescape.wiki/images/Inventory.png', alt: 'Inv' },
    { id: 'equipment', icon: wornEquipmentIcon, alt: 'Equip' },
    {
      id: 'prayer',
      icon: 'https://oldschool.runescape.wiki/images/Prayer_icon_%28detail%29.png',
      alt: 'Pray',
    },
    { id: 'skills', icon: 'https://oldschool.runescape.wiki/images/Stats_icon.png', alt: 'Stats' },
  ];

  return (
    <div
      ref={dndRef}
      style={{
        ...styles.playerCard,
        ...dndStyle,
        width: `${activeViews.length * 225 + 20}px`,
      }}
      data-member-id={memberId}
    >
      <div style={styles.cardHeader}>
        <div style={styles.headerFlex}>
          <div style={styles.dragHandleArea} {...dragHandleProps}>
            <div style={styles.dragIcon}>⠿</div>

            <div style={styles.nameContainer}>
              <h3 style={{ ...styles.nameText, color: nameColor }}>
                {player.member.name || 'Unknown Player'}
              </h3>
              <span style={styles.levelText}>Level {player.combatLevel}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onHide();
            }}
            style={styles.hideButton}
            title="Hide Player"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D1D1D1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      </div>

      <div style={styles.statsWrapper}>
        <StatBars stats={player.stats} timerFormat={timerFormat} />
      </div>

      <div style={styles.buttonGroup}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => toggleView(tab.id as GridView)}
            style={{
              ...styles.button,
              ...(activeViews.includes(tab.id as GridView) ? styles.activeButton : {}),
            }}
          >
            <img src={tab.icon} alt={tab.alt} style={styles.tabIcon} />
          </button>
        ))}
      </div>

      <div style={styles.gridContainer}>
        {activeViews.includes('inventory') && <InventoryGrid items={player.inventory} />}
        {activeViews.includes('equipment') && <EquipmentGrid items={player.equipment} />}
        {activeViews.includes('prayer') && <PrayerGrid ep={player.prayerMask} />}
        {activeViews.includes('skills') && <SkillsGrid stats={player.stats} />}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  playerCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 10px',
    backgroundColor: '#1e1e1e',
    border: '1px solid #4a4a4a',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    transition: 'width 0.3s ease, transform 0.1s ease',
    flex: '0 0 auto',
    margin: '0 auto',
  },
  cardHeader: {
    marginBottom: '12px',
    width: '100%',
  },
  headerFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0 8px',
    boxSizing: 'border-box',
    gap: '8px',
  },
  dragHandleArea: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'grab',
    flex: 1,
    minWidth: 0,
    gap: '10px',
  },
  dragIcon: {
    color: '#666',
    fontSize: '1.2rem',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: 0,
    flex: 1,
  },
  nameText: {
    margin: 0,
    fontSize: '0.85rem',
    lineHeight: '1.2',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    fontWeight: 'bold',
  },
  levelText: {
    fontSize: '0.65rem',
    color: '#aaa',
    lineHeight: '1.2',
    letterSpacing: '0.02rem',
  },
  hideButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '4px',
    opacity: 0.6,
    flexShrink: 0,
    transition: 'opacity 0.2s',
  },
  memberId: {
    fontSize: '0.75rem',
    color: '#aaa',
  },
  statsWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: '2px',
    marginBottom: '8px',
    justifyContent: 'center',
    backgroundColor: '#2a241c',
    padding: '2px',
    borderRadius: '4px',
    width: 'fit-content',
  },
  button: {
    width: '40px',
    height: '32px',
    backgroundColor: '#3e3529',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#2a241c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
  },
  activeButton: {
    backgroundColor: '#6b5a44',
    borderColor: '#9d8b70',
  },
  tabIcon: {
    width: '24px',
    height: '24px',
    objectFit: 'contain',
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '344px',
    width: '100%',
  },
  placeholder: {
    width: '215px',
    height: '344px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a4a4a',
    color: '#aaa',
    borderRadius: '4px',
    border: '2px solid #3a3a3a',
    fontSize: '0.8rem',
  },
};
