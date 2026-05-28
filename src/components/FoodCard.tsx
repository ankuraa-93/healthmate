'use client';

import { motion } from 'framer-motion';
import { FoodLogEntry } from '@/lib/types';

interface FoodCardProps {
  entry: FoodLogEntry;
  index: number;
  onClick?: () => void;
}

export default function FoodCard({ entry, index, onClick }: FoodCardProps) {
  const unitLabel = entry.unit === 'ml' ? 'ml' : 'g';

  return (
    <motion.div
      className={`bg-bg-secondary rounded-xl p-3 px-3.5 mb-2 ${onClick ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-[10px] flex-shrink-0 bg-bg-tertiary flex items-center justify-center text-lg">
          {entry.food_name.slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold truncate">{entry.food_name}</div>
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
              <div className="text-[17px] font-bold">{entry.calories}</div>
              <div className="text-xs text-text-secondary">cal</div>
            </>
          ) : (
            <div className="text-[17px] font-bold text-text-tertiary">&mdash;</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
