'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { FoodLogEntry } from '@/lib/types';

interface FoodCardHorizontalProps {
  entry: FoodLogEntry;
  index: number;
  onClick?: () => void;
}

export default function FoodCardHorizontal({ entry, index, onClick }: FoodCardHorizontalProps) {
  const unitLabel = entry.unit === 'ml' ? 'ml' : 'g';
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = entry.image_url && !imgFailed;

  return (
    <motion.div
      className={`min-w-0 ${onClick ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.96 } : undefined}
    >
      {/* Image */}
      <div className="relative mb-1.5">
        {showImage ? (
          <img
            src={entry.image_url!}
            alt={entry.food_name}
            className="w-full aspect-square rounded-xl object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full aspect-square rounded-xl bg-bg-tertiary flex items-center justify-center text-2xl text-text-tertiary">
            {entry.food_name.slice(0, 1).toUpperCase()}
          </div>
        )}
        {entry.input_source === 'image' && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/40 flex items-center justify-center">
            <Camera size={10} className="text-white" />
          </div>
        )}
      </div>

      {/* Text */}
      <div>
        <div className="text-[11px] font-medium leading-tight line-clamp-2">
          {entry.food_name}
        </div>
        {entry.status === 'confirmed' ? (
          <>
            <div className="text-[11px] text-text-secondary mt-0.5">
              {entry.quantity_g}{unitLabel} · {entry.calories} cal
            </div>
            <div className="text-[11px] text-text-secondary mt-px">
              P:{entry.protein} C:{entry.carbs} F:{entry.fat} Fi:{entry.fibre}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
            <span className="text-[11px] font-medium text-warning">Processing</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
