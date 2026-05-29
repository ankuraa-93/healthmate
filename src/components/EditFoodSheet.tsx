'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drumstick, Wheat, Droplet, Leaf, Trash2 } from 'lucide-react';
import { FoodLogEntry, FoodLibraryItem } from '@/lib/types';
import { calculateNutrition, scaleNutritionFromEntry } from '@/lib/nutrition';
import { fetchFoodLibraryItem } from '@/lib/supabase-data';

interface EditFoodSheetProps {
  entry: FoodLogEntry | null;
  onClose: () => void;
  onSave: (result: {
    id: string;
    quantity_g: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fibre: number;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }) => void;
  onDelete: (entryId: string) => void;
}

const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
const adjustments = [-50, -10, +10, +50];

export default function EditFoodSheet({ entry, onClose, onSave, onDelete }: EditFoodSheetProps) {
  const [quantity, setQuantity] = useState(0);
  const [mealType, setMealType] = useState<typeof mealTypes[number]>('snack');
  const [lastEntryId, setLastEntryId] = useState<string | null>(null);
  const [libraryItem, setLibraryItem] = useState<FoodLibraryItem | null>(null);

  if (entry && entry.id !== lastEntryId) {
    setQuantity(entry.quantity_g);
    setMealType(entry.meal_type);
    setLastEntryId(entry.id);
  }

  const [lastLibraryId, setLastLibraryId] = useState<string | null>(null);
  const currentLibraryId = entry?.food_library_id ?? null;

  if (currentLibraryId !== lastLibraryId) {
    setLastLibraryId(currentLibraryId);
    if (!currentLibraryId) {
      setLibraryItem(null);
    }
  }

  useEffect(() => {
    if (currentLibraryId) {
      fetchFoodLibraryItem(currentLibraryId).then(setLibraryItem);
    }
  }, [currentLibraryId]);

  const unitLabel = entry?.unit === 'ml' ? 'ml' : 'g';

  const nutrition = useMemo(() => {
    if (!entry) return { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 };
    if (libraryItem) return calculateNutrition(quantity, libraryItem);
    return scaleNutritionFromEntry(quantity, entry);
  }, [quantity, entry, libraryItem]);

  const hasChanges = entry ? (quantity !== entry.quantity_g || mealType !== entry.meal_type) : false;

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    setQuantity(Math.min(Math.max(num, 1), 9999));
  };

  const handleAdjust = (delta: number) => {
    setQuantity((prev) => Math.min(Math.max(prev + delta, 1), 9999));
  };

  const handleSave = () => {
    if (!entry || !hasChanges) return;
    onSave({
      id: entry.id,
      quantity_g: quantity,
      ...nutrition,
      meal_type: mealType,
    });
  };

  return (
    <AnimatePresence>
      {entry && (
        <>
          <motion.div
            className="absolute inset-0 bg-black/30 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-bg-primary rounded-t-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col max-h-[88vh] z-30"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="w-9 h-1 bg-bg-tertiary rounded-full mx-auto mt-2.5 flex-shrink-0" />

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 pt-4 pb-2 scrollbar-none">
              {/* Header: initial + name */}
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-11 h-11 rounded-[10px] flex-shrink-0 bg-bg-tertiary flex items-center justify-center text-lg">
                  {entry.food_name.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-[22px] font-medium flex-1">{entry.food_name}</span>
              </motion.div>

              {/* Quantity */}
              <motion.div
                className="mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wide mb-2">
                  Quantity
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 flex items-center bg-bg-secondary rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-accent/25 transition-shadow">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="flex-1 bg-transparent border-none text-[17px] font-medium text-right outline-none w-full"
                    />
                    <span className="text-[15px] text-text-secondary ml-1.5">{unitLabel}</span>
                  </div>
                  <motion.button
                    onClick={() => onDelete(entry.id)}
                    className="w-11 h-11 rounded-xl bg-bg-secondary border-none flex items-center justify-center text-text-tertiary cursor-pointer hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
                <div className="flex gap-2">
                  {adjustments.map((delta) => (
                    <motion.button
                      key={delta}
                      onClick={() => handleAdjust(delta)}
                      className="flex-1 bg-bg-secondary rounded-full py-1.5 text-[13px] font-medium text-text-secondary border-none cursor-pointer hover:bg-bg-tertiary transition-colors"
                      whileTap={{ scale: 0.93 }}
                    >
                      {delta > 0 ? `+${delta}${unitLabel}` : `${delta}${unitLabel}`}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Meal type */}
              <motion.div
                className="mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wide mb-2">
                  Meal
                </div>
                <div className="flex gap-2">
                  {mealTypes.map((type) => (
                    <motion.button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`flex-1 rounded-full py-2 text-[13px] font-medium border-none cursor-pointer capitalize transition-colors ${
                        mealType === type
                          ? 'bg-accent text-white'
                          : 'bg-bg-secondary text-text-secondary'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {type}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Nutrition preview */}
              <motion.div
                className="bg-bg-secondary rounded-xl p-4 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-[28px] font-semibold">{nutrition.calories}</span>
                  <span className="text-[15px] text-text-secondary">cal</span>
                </div>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-8">
                  {[
                    { label: 'Protein', value: nutrition.protein, icon: Drumstick },
                    { label: 'Carbs', value: nutrition.carbs, icon: Wheat },
                    { label: 'Fat', value: nutrition.fat, icon: Droplet },
                    { label: 'Fibre', value: nutrition.fibre, icon: Leaf },
                  ].map((macro) => (
                    <div key={macro.label} className="flex items-center gap-2">
                      <macro.icon size={14} className="text-text-secondary flex-shrink-0" />
                      <span className="text-[13px] text-text-secondary">{macro.label}</span>
                      <span className="text-[13px] font-medium ml-auto">{macro.value}g</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom: Save */}
            <div className="flex-shrink-0 px-6 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] border-t border-bg-tertiary/50 bg-bg-primary">
              <motion.button
                onClick={handleSave}
                disabled={!hasChanges}
                className="w-full bg-accent text-white rounded-xl h-[50px] text-[17px] font-medium border-none cursor-pointer disabled:opacity-40 disabled:cursor-default"
                whileTap={hasChanges ? { scale: 0.97 } : undefined}
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
