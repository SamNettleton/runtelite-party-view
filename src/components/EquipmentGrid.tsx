import React from 'react';
import { InventoryItem } from '@/types';
import { formatQty, getQtyColor } from '@/utils/itemHelpers';

export const EquipmentGrid: React.FC<{ items?: InventoryItem[] }> = ({ items }) => (
  <div style={styles.equipmentGrid}>
    {items?.map((item, index) => (
      <div key={index} style={styles.slot}>
        {item.id > 0 && (
          <>
            <img
              src={`https://static.runelite.net/cache/item/icon/${item.id}.png`}
              style={styles.itemImg}
              alt=""
            />
            {item.qty > 1 && (
              <span style={{ ...styles.qty, color: getQtyColor(item.qty) }}>
                {formatQty(item.qty)}
              </span>
            )}
          </>
        )}
      </div>
    ))}
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  equipmentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 42px)',
    gap: '4px',
    backgroundColor: '#3e3529',
    padding: '6px',
    borderRadius: '4px',
    border: '2px solid #2a241c',
    width: 'fit-content',
  },
  slot: {
    width: '42px',
    height: '36px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  itemImg: {
    maxWidth: '32px',
    maxHeight: '32px',
    filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))',
  },
  qty: {
    position: 'absolute',
    top: '1px',
    left: '1px',
    fontSize: '10px',
    fontWeight: 'bold',
    textShadow: '1px 1px 0 #000',
    zIndex: 1,
  },
};
