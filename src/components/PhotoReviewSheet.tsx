'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ProcessedImage } from '@/lib/image-utils';

export interface ReviewPhoto {
  processedImage: ProcessedImage;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  rotation: number;
}

interface PhotoReviewSheetProps {
  photos: ReviewPhoto[];
  onChange: (photos: ReviewPhoto[]) => void;
  onSubmit: (photos: ReviewPhoto[]) => void;
  onClose: () => void;
  onAddMore: () => void;
}

const MEAL_OPTIONS = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
};

export default function PhotoReviewSheet({ photos, onChange, onSubmit, onClose, onAddMore }: PhotoReviewSheetProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleRotate = () => {
    const updated = photos.map((p, i) =>
      i === activeIndex ? { ...p, rotation: (p.rotation + 90) % 360 } : p
    );
    onChange(updated);
  };

  const handleMealChange = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const updated = photos.map((p, i) =>
      i === activeIndex ? { ...p, mealType: meal } : p
    );
    onChange(updated);
  };

  const handleRemove = useCallback(() => {
    URL.revokeObjectURL(photos[activeIndex].processedImage.thumbnailUrl);
    const updated = photos.filter((_, i) => i !== activeIndex);
    if (updated.length === 0) {
      onClose();
      return;
    }
    onChange(updated);
    setActiveIndex(prev => Math.min(prev, updated.length - 1));
  }, [photos, activeIndex, onChange, onClose]);

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < photos.length) setActiveIndex(idx);
  };

  const current = photos[activeIndex];
  if (!current) return null;

  return (
    <motion.div
      className="absolute inset-0 bg-black z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3">
        <motion.button
          className="w-9 h-9 rounded-full bg-white/15 border-none flex items-center justify-center cursor-pointer"
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
        >
          <X size={18} className="text-white" />
        </motion.button>
        <span className="text-white/70 text-[14px] font-medium">
          {activeIndex + 1} of {photos.length}
        </span>
        <motion.button
          className="w-9 h-9 rounded-full bg-white/15 border-none flex items-center justify-center cursor-pointer"
          onClick={handleRotate}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCw size={18} className="text-white" />
        </motion.button>
      </div>

      {/* Photo area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden px-4">
        {/* Nav arrows for multi-photo */}
        {photos.length > 1 && activeIndex > 0 && (
          <motion.button
            className="absolute left-2 z-10 w-10 h-10 rounded-full bg-white/15 border-none flex items-center justify-center cursor-pointer"
            onClick={() => goTo(activeIndex - 1)}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={22} className="text-white" />
          </motion.button>
        )}
        {photos.length > 1 && activeIndex < photos.length - 1 && (
          <motion.button
            className="absolute right-2 z-10 w-10 h-10 rounded-full bg-white/15 border-none flex items-center justify-center cursor-pointer"
            onClick={() => goTo(activeIndex + 1)}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={22} className="text-white" />
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          <motion.img
            key={`${activeIndex}-${current.rotation}`}
            src={current.processedImage.thumbnailUrl}
            alt={`Food photo ${activeIndex + 1}`}
            className="max-w-full max-h-full rounded-xl object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: current.rotation }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnail strip (multi-photo) */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-2 py-3 px-4">
          {photos.map((photo, idx) => (
            <motion.button
              key={idx}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 p-0 cursor-pointer flex-shrink-0 ${
                idx === activeIndex ? 'border-white' : 'border-transparent opacity-50'
              }`}
              onClick={() => setActiveIndex(idx)}
              whileTap={{ scale: 0.9 }}
            >
              <img
                src={photo.processedImage.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
                style={{ transform: `rotate(${photo.rotation}deg)` }}
              />
            </motion.button>
          ))}
          <motion.button
            className="w-12 h-12 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center cursor-pointer bg-transparent flex-shrink-0"
            onClick={onAddMore}
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={18} className="text-white/50" />
          </motion.button>
        </div>
      )}

      {/* Bottom controls */}
      <div className="px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-3">
        {/* Meal type selector */}
        <div className="flex gap-2 mb-4">
          {MEAL_OPTIONS.map(meal => (
            <motion.button
              key={meal}
              className={`flex-1 py-2 rounded-xl border-none text-[13px] font-medium cursor-pointer transition-colors ${
                current.mealType === meal
                  ? 'bg-white text-black'
                  : 'bg-white/15 text-white/70'
              }`}
              onClick={() => handleMealChange(meal)}
              whileTap={{ scale: 0.95 }}
            >
              {MEAL_LABELS[meal]}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-3">
          <motion.button
            className="flex-1 py-3 bg-white/15 text-white border-none rounded-xl text-[15px] font-medium cursor-pointer"
            onClick={handleRemove}
            whileTap={{ scale: 0.97 }}
          >
            Remove
          </motion.button>
          <motion.button
            className="flex-[2] py-3 bg-accent text-white border-none rounded-xl text-[15px] font-medium cursor-pointer"
            onClick={() => onSubmit(photos)}
            whileTap={{ scale: 0.97 }}
          >
            Submit {photos.length} photo{photos.length > 1 ? 's' : ''}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
