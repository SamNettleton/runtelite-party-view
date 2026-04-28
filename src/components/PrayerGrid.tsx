import React from 'react';

const ALL_PRAYERS = [
  // Row 1
  {
    name: 'Thick Skin',
    bits: [1 << 0],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Thick_Skin.png',
  },
  {
    name: 'Burst of Strength',
    bits: [1 << 1],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Burst_of_Strength.png',
  },
  {
    name: 'Clarity of Thought',
    bits: [1 << 2],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Clarity_of_Thought.png',
  },
  {
    name: 'Sharp Eye',
    bits: [1 << 3],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Sharp_Eye.png',
  },
  {
    name: 'Mystic Will',
    bits: [1 << 4],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Mystic_Will.png',
  },

  // Row 2
  {
    name: 'Rock Skin',
    bits: [1 << 5],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Rock_Skin.png',
  },
  {
    name: 'Superhuman Strength',
    bits: [1 << 6],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Superhuman_Strength.png',
  },
  {
    name: 'Improved Reflexes',
    bits: [1 << 7],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Improved_Reflexes.png',
  },
  {
    name: 'Rapid Restore',
    bits: [1 << 8],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Rapid_Restore.png',
  },
  {
    name: 'Rapid Heal',
    bits: [1 << 9],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Rapid_Heal.png',
  },

  // Row 3
  {
    name: 'Protect Item',
    bits: [1 << 10],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Protect_Item.png',
  },
  {
    name: 'Hawk Eye',
    bits: [1 << 11],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Hawk_Eye.png',
  },
  {
    name: 'Mystic Lore',
    bits: [1 << 12],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Mystic_Lore.png',
  },
  {
    name: 'Steel Skin',
    bits: [1 << 13],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Steel_Skin.png',
  },
  {
    name: 'Ultimate Strength',
    bits: [1 << 14],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Ultimate_Strength.png',
  },

  // Row 4
  {
    name: 'Incredible Reflexes',
    bits: [1 << 15],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Incredible_Reflexes.png',
  },
  {
    name: 'Protect from Magic',
    bits: [1 << 16],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Protect_from_Magic.png',
  },
  {
    name: 'Protect from Missiles',
    bits: [1 << 17],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Protect_from_Missiles.png',
  },
  {
    name: 'Protect from Melee',
    bits: [1 << 18],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Protect_from_Melee.png',
  },
  {
    name: 'Eagle Eye',
    bits: [1 << 19, 1 << 25], // 19 = Eagle Eye, 25 = Deadeye
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Eagle_Eye.png',
  },

  // Row 5
  {
    name: 'Mystic Might',
    bits: [1 << 20, 1 << 26], // 20 = Mystic Might, 26 = Mystic Vigour
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Mystic_Might.png',
  },
  {
    name: 'Retribution',
    bits: [1 << 21],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Retribution.png',
  },
  {
    name: 'Redemption',
    bits: [1 << 22],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Redemption.png',
  },
  {
    name: 'Smite',
    bits: [1 << 23],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Smite.png',
  },
  {
    name: 'Preserve',
    bits: [1 << 28],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Preserve.png',
  },

  // Row 6
  {
    name: 'Chivalry',
    bits: [1 << 24],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Chivalry.png',
  },
  {
    name: 'Piety',
    bits: [1 << 27],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Piety.png',
  },
  {
    name: 'Rigour',
    bits: [1 << 29],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Rigour.png',
  },
  {
    name: 'Augury',
    bits: [1 << 30],
    icon: 'https://oldschool.runescape.wiki/w/Special:FilePath/Augury.png',
  },
];

export const PrayerGrid: React.FC<{ ep?: number }> = ({ ep = 0 }) => {
  return (
    <div style={styles.prayerPanel}>
      <div style={styles.grid}>
        {ALL_PRAYERS.map((prayer) => {
          const isActive = prayer.bits.some((bit) => (ep & bit) !== 0);
          return (
            <div
              key={prayer.name}
              style={{
                ...styles.slot,
                backgroundColor: isActive ? 'rgba(204, 173, 128, 0.8)' : 'transparent',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
              }}
            >
              <img src={prayer.icon} style={styles.icon} alt={prayer.name} title={prayer.name} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  prayerPanel: {
    backgroundColor: '#3e3529',
    borderRadius: '4px',
    border: '2px solid #2a241c',
    boxSizing: 'border-box',
    width: '215px',
    height: '344px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // Vertical Math: (344 - 4 (border) - 248 (grid)) / 2 = 46px
    paddingTop: '46px',
    paddingBottom: '46px',
    // Horizontal Math: (215 - 4 (border) - 206 (grid)) / 2 = 2.5px
    paddingLeft: '2.5px',
    paddingRight: '2.5px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 38px)',
    gridTemplateRows: 'repeat(6, 38px)',
    gap: '4px', // Standardized gap for prayer tabs
    alignItems: 'center',
    justifyContent: 'center',
  },
  slot: {
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px', // OSRS prayer active state is usually a rounded square, not a circle
    position: 'relative',
    transition: 'background-color 0.1s ease',
  },
  icon: {
    width: '34px', // Slightly larger for better readability
    height: '34px',
    imageRendering: 'pixelated',
    objectFit: 'contain',
    display: 'block',
    zIndex: 1,
  },
};
