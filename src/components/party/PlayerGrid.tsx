import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortablePlayerCard } from './SortablePlayerCard'; // Import our new component
import { PlayerState } from '@/types';

interface PlayerGridProps {
  players: Record<string, PlayerState>;
  hiddenIds: Set<string>;
  multiTabMode: boolean;
  timerFormat: 'ticks' | 'mss';
  onHidePlayer: (id: string) => void;
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({
  players,
  hiddenIds,
  multiTabMode,
  timerFormat,
  onHidePlayer,
}) => {
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);

  useEffect(() => {
    const currentIds = Object.keys(players).filter((id) => {
      const p = players[id];
      const isObserver =
        p.member.name?.toLowerCase().includes('observer') || p.member.name === 'Loading...';
      return !isObserver && !hiddenIds.has(id);
    });

    setPlayerOrder((prev) => {
      const stillPresent = prev.filter((id) => currentIds.includes(id));
      const newIds = currentIds.filter((id) => !prev.includes(id));
      return [...stillPresent, ...newIds];
    });
  }, [players, hiddenIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPlayerOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={styles.playersFlex}>
        <SortableContext items={playerOrder} strategy={rectSortingStrategy}>
          {playerOrder.map((memberId) => (
            <SortablePlayerCard
              key={memberId}
              memberId={memberId}
              player={players[memberId]}
              multiTabMode={multiTabMode}
              timerFormat={timerFormat}
              onHide={() => onHidePlayer(memberId)}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

const styles = {
  playersFlex: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: '1.5rem',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    marginTop: '1.5rem',
  },
};
