import React from 'react';
import { InventoryItem } from '@/types';
import { formatQty, getQtyColor } from '@/utils/itemHelpers';

export const InventoryGrid: React.FC<{ items?: InventoryItem[] }> = ({ items }) => {
  const slots = Array.from({ length: 28 }, (_, i) => items?.[i] || { id: -1, qty: 0 });

  return (
    <div style={styles.inventoryGrid}>
      {slots.map((item, index) => (
        <div key={index} style={styles.slot}>
          {item.id > 0 && (
            <>
              <img
                src={`https://static.runelite.net/cache/item/icon/${item.id}.png`}
                style={styles.itemImg}
                alt=""
                onError={(e) =>
                  (e.currentTarget.src = `https://www.osrsbox.com/osrsbox-db/items-icons/${item.id}.png`)
                }
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
};

const styles: Record<string, React.CSSProperties> = {
  inventoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 45px)',
    gridTemplateRows: 'repeat(7, 42px)',
    gap: '5px',
    backgroundColor: '#3e3529',
    padding: '8px',
    borderRadius: '4px',
    border: '2px solid #2a241c',
    width: 'fit-content',
  },
  slot: {
    width: '45px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: '2px',
  },
  itemImg: {
    maxWidth: '45px',
    maxHeight: '45px',
  },
  qty: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    fontSize: '10px',
    fontWeight: 'bold',
    textShadow: '1px 1px 0 #000',
    zIndex: 1,
    pointerEvents: 'none',
  },
};
