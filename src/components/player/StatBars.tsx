import React from 'react';
import { PlayerStats } from '@/types';
import { useTickTimer } from '@/hooks/useTickTimer';

export const StatBars: React.FC<{ stats?: PlayerStats; timerFormat: 'ticks' | 'mss' }> = ({
  stats,
  timerFormat,
}) => {
  if (!stats) return null;

  // Logic to determine if we are in "tight" mode
  const metrics = [
    stats.hitpoints,
    stats.prayer,
    stats.spec !== undefined,
    stats.runEnergy !== undefined,
    stats.overload !== undefined, // Assuming you add this to your types
  ].filter(Boolean);

  const isTight = metrics.length >= 5;
  const currentOverloadTicks = useTickTimer(stats?.overloadSippedAt);

  const formatTimer = (ticks: number) => {
    if (timerFormat === 'ticks') return ticks;
    const totalSeconds = Math.floor(ticks * 0.6);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      {stats.hitpoints && (
        <div style={{ ...styles.pill, color: '#ff4d4d', ...(isTight && styles.pillTight) }}>
          <img
            src="https://oldschool.runescape.wiki/images/Hitpoints_icon.png"
            style={styles.icon}
            alt="H"
          />
          <span style={{ ...styles.value, ...(isTight && styles.valueTight) }}>
            {stats.hitpoints.current}
          </span>
        </div>
      )}

      {stats.prayer && (
        <div style={{ ...styles.pill, color: '#33ccff', ...(isTight && styles.pillTight) }}>
          <img
            src="https://oldschool.runescape.wiki/images/Prayer_icon.png"
            style={styles.icon}
            alt="P"
          />
          <span style={{ ...styles.value, ...(isTight && styles.valueTight) }}>
            {stats.prayer.current}
          </span>
        </div>
      )}

      {stats.spec !== undefined && (
        <div style={{ ...styles.pill, color: '#01b9a7', ...(isTight && styles.pillTight) }}>
          <img
            src="https://oldschool.runescape.wiki/images/Multicombat.png"
            style={styles.icon}
            alt="S"
          />
          <span style={{ ...styles.value, ...(isTight && styles.valueTight) }}>{stats.spec}</span>
        </div>
      )}

      {stats.runEnergy !== undefined && (
        <div style={{ ...styles.pill, color: '#e8e800', ...(isTight && styles.pillTight) }}>
          <img
            src="https://oldschool.runescape.wiki/images/Leather_boots_detail.png"
            style={styles.icon}
            alt="R"
          />
          <span style={{ ...styles.value, ...(isTight && styles.valueTight) }}>
            {stats.runEnergy}
          </span>
        </div>
      )}

      {currentOverloadTicks > 0 && (
        <div style={{ ...styles.pill, color: '#bb33ff' }}>
          <img
            src="https://raw.githubusercontent.com/runelite/static.runelite.net/gh-pages/cache/item/icon/20996.png"
            style={styles.icon}
            alt="OVL"
          />
          <span style={styles.value}>{formatTimer(currentOverloadTicks)}</span>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: '3px',
    marginBottom: '1rem',
    justifyContent: 'center',
    width: '100%',
    boxSizing: 'border-box',
  },
  pill: {
    flex: '1 1 auto',
    maxWidth: '48px',
    fontSize: '0.8rem',
    padding: '2px 4px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    minWidth: '0',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pillTight: {
    padding: '2px 2px',
    gap: '2px',
  },
  value: {
    fontWeight: 'bold',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  valueTight: {
    fontSize: '0.75rem',
  },
  icon: {
    width: '14px',
    height: '14px',
    flexShrink: 0,
  },
};
