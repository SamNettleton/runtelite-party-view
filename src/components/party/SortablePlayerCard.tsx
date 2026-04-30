import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlayerCard } from '@/components/player/PlayerCard';
import { PlayerState } from '@/types';

interface SortablePlayerCardProps {
  memberId: string;
  player: PlayerState;
  multiTabMode: boolean;
  timerFormat: 'ticks' | 'mss';
  onHide: (id: string) => void;
}

export const SortablePlayerCard: React.FC<SortablePlayerCardProps> = ({
  memberId,
  player,
  multiTabMode,
  timerFormat,
  onHide,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: memberId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.4 : 1,
    flex: '0 0 auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <PlayerCard
        memberId={memberId}
        player={player}
        multiTabMode={multiTabMode}
        timerFormat={timerFormat}
        onHide={() => onHide(memberId)}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};
