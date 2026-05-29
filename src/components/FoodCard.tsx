'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { FoodLogEntry } from '@/lib/types';

interface FoodCardProps {
  entry: FoodLogEntry;
  index: number;
  onClick?: () => void;
  onDelete?: (entryId: string) => void;
}

const REVEAL_THRESHOLD = -80;
const DELETE_THRESHOLD = -180;

export default function FoodCard({ entry, index, onClick, onDelete }: FoodCardProps) {
  const unitLabel = entry.unit === 'ml' ? 'ml' : 'g';
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-100, -60, 0], [1, 0.8, 0]);
  const [swiped, setSwiped] = useState(false);
  const didDrag = useRef(false);
  const directionLocked = useRef<'x' | 'y' | null>(null);

  const handleDragStart = () => {
    didDrag.current = false;
    directionLocked.current = null;
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    if (!directionLocked.current) {
      const absX = Math.abs(info.offset.x);
      const absY = Math.abs(info.offset.y);
      if (absX > 12 || absY > 12) {
        directionLocked.current = absX > absY * 1.5 ? 'x' : 'y';
      }
    }

    if (directionLocked.current === 'y') {
      x.set(0);
    }

    if (Math.abs(info.offset.x) > 5) {
      didDrag.current = true;
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (directionLocked.current === 'y') {
      setSwiped(s => s);
      return;
    }
    if (swiped && (info.offset.x < REVEAL_THRESHOLD || info.velocity.x < -300)) {
      if (onDelete) onDelete(entry.id);
    } else if (info.offset.x < REVEAL_THRESHOLD) {
      setSwiped(true);
    } else {
      setSwiped(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) onDelete(entry.id);
  };

  return (
    <motion.div
      className="relative mb-2 overflow-hidden rounded-xl"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -200, transition: { duration: 0.25 } }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Delete button behind */}
      <motion.div
        className="absolute inset-0 right-0 flex items-center justify-end pr-6 bg-destructive rounded-xl cursor-pointer"
        style={{ opacity: deleteOpacity }}
        onClick={handleDelete}
      >
        <Trash2 size={20} className="text-white" />
      </motion.div>

      {/* Card */}
      <motion.div
        className={`bg-bg-secondary rounded-xl p-3 px-3.5 relative ${onClick ? 'cursor-pointer' : ''}`}
        drag={onDelete ? 'x' : false}
        dragConstraints={{ left: swiped ? -300 : -100, right: 0 }}
        dragElastic={0.05}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ x: swiped ? -80 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{ x }}
        onClick={() => {
          if (didDrag.current) return;
          if (swiped) {
            setSwiped(false);
          } else {
            onClick?.();
          }
        }}
        whileTap={!swiped && onClick ? { scale: 0.98 } : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[10px] flex-shrink-0 bg-bg-tertiary flex items-center justify-center text-lg">
            {entry.food_name.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-medium leading-snug">{entry.food_name}</div>
            {entry.status === 'confirmed' ? (
              <div className="text-[13px] text-text-secondary mt-px">
                <span>{entry.quantity_g}{unitLabel}</span>
                <span className="ml-1">&middot;</span>
                <span className="ml-1">P:{entry.protein}</span>
                <span className="ml-1">C:{entry.carbs}</span>
                <span className="ml-1">F:{entry.fat}</span>
                <span className="ml-1">Fi:{entry.fibre}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                <span className="text-xs font-medium text-warning">Processing</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            {entry.status === 'confirmed' ? (
              <>
                <div className="text-[14px] font-medium">{entry.calories}</div>
                <div className="text-xs text-text-secondary">cal</div>
              </>
            ) : (
              <div className="text-[14px] font-medium text-text-tertiary">&mdash;</div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
