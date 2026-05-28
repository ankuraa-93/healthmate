'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trash2, Check, Loader2 } from 'lucide-react';

export interface ConfirmFoodItem {
  name: string;
  matched_library_id: string | null;
  matched_library_name: string | null;
  quantity_g: number;
  unit: 'g' | 'ml';
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fibre_per_100g: number;
}

interface ConfirmFoodSheetProps {
  open: boolean;
  originalQuery: string;
  items: ConfirmFoodItem[];
  loading: boolean;
  onClose: () => void;
  onConfirm: (items: ConfirmFoodItem[]) => void;
}

function scaleNutrition(item: ConfirmFoodItem) {
  const ratio = item.quantity_g / 100;
  return {
    calories: Math.round(item.calories_per_100g * ratio),
    protein: Math.round(item.protein_per_100g * ratio),
    carbs: Math.round(item.carbs_per_100g * ratio),
    fat: Math.round(item.fat_per_100g * ratio),
    fibre: Math.round(item.fibre_per_100g * ratio),
  };
}

function ConfirmFoodSheetInner({ originalQuery, items: initialItems, loading, onClose, onConfirm }: Omit<ConfirmFoodSheetProps, 'open'>) {
  const [items, setItems] = useState<ConfirmFoodItem[]>(initialItems);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);

  const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
  const mealLabels: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    snack: 'Snack',
    dinner: 'Dinner',
  };

  const grouped = mealOrder
    .map(type => ({
      type,
      label: mealLabels[type],
      entries: items
        .map((item, idx) => ({ item, idx }))
        .filter(({ item }) => item.meal_type === type),
    }))
    .filter(g => g.entries.length > 0);

  const totalCalories = items.reduce((sum, item) => sum + scaleNutrition(item).calories, 0);

  const updateQuantity = (index: number, newQty: number) => {
    const qty = Math.max(1, newQty);
    setItems(prev => prev.map((item, i) => i === index ? { ...item, quantity_g: qty } : item));
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    setExpandedIndex(null);
  };

  const handleConfirm = () => {
    if (items.length === 0) return;
    setConfirming(true);
    onConfirm(items);
  };

  const handleToggleExpand = (index: number) => {
    setExpandedIndex(prev => prev === index ? null : index);
  };

  return (
    <>
      <motion.div
        className="absolute inset-0 bg-black/30 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-bg-primary rounded-t-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col max-h-[92vh] z-30"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
            {/* Handle */}
            <div className="w-9 h-1 bg-bg-tertiary rounded-full mx-auto mt-2.5 flex-shrink-0" />

            {/* Header */}
            <div className="flex items-center px-6 pt-4 flex-shrink-0">
              <motion.button
                className="w-8 h-8 rounded-full bg-bg-secondary border-none flex items-center justify-center text-text-primary cursor-pointer flex-shrink-0"
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={18} />
              </motion.button>
              <span className="text-[22px] font-semibold ml-3 flex-1">Confirm Items</span>
            </div>

            {/* Original query */}
            <div className="mx-6 mt-3 text-[14px] text-text-tertiary leading-relaxed">
              {originalQuery}
            </div>

            {/* Loading state */}
            {loading && (
              <motion.div
                className="flex flex-col items-center justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 size={32} className="text-accent animate-spin" />
                <span className="text-[15px] text-text-secondary mt-3.5">Parsing your food...</span>
              </motion.div>
            )}

            {/* Results */}
            {!loading && (
              <>
                <div className="flex-1 overflow-y-auto px-6 pt-5 scrollbar-none">
                  {grouped.map((group) => (
                    <div key={group.type} className="mb-4">
                      <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wide pb-2 mb-2.5 border-b border-bg-tertiary/50">
                        {group.label}
                      </div>
                      <div className="flex flex-col gap-2.5">
                        {group.entries.map(({ item, idx }, cardIndex) => {
                          const nutrition = scaleNutrition(item);
                          const isExpanded = expandedIndex === idx;
                          const unitLabel = item.unit === 'ml' ? 'ml' : 'g';

                          return (
                            <motion.div
                              key={`${item.name}-${idx}`}
                              className="bg-bg-secondary rounded-xl p-3 cursor-pointer"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: 20, scale: 0.95 }}
                              transition={{ delay: cardIndex * 0.08 }}
                              onClick={() => handleToggleExpand(idx)}
                              layout
                            >
                              {/* Top row */}
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-[10px] bg-bg-tertiary flex items-center justify-center text-base font-medium flex-shrink-0">
                                  {item.name.slice(0, 1).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[16px] font-semibold truncate">{item.matched_library_name || item.name}</div>
                                  <div className="text-[13px] text-text-secondary mt-0.5">
                                    {item.quantity_g}{unitLabel} · P:{nutrition.protein} C:{nutrition.carbs} F:{nutrition.fat} Fi:{nutrition.fibre}
                                  </div>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                  <div className="text-[17px] font-bold">{nutrition.calories}</div>
                                  <div className="text-[12px] text-text-secondary">cal</div>
                                </div>
                                <motion.div
                                  className="flex-shrink-0 text-text-tertiary"
                                  animate={{ rotate: isExpanded ? 90 : 0 }}
                                  transition={{ duration: 0.25 }}
                                >
                                  <ChevronRight size={16} />
                                </motion.div>
                              </div>

                              {/* Expandable edit area */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="mt-3 pt-2.5 border-t border-bg-tertiary/50">
                                      <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wide mb-2">
                                        Quantity
                                      </div>
                                      {/* Input + trash */}
                                      <div className="flex items-center gap-2 mb-2.5">
                                        <div className="flex-1 flex items-center bg-bg-primary rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-accent/25 transition-shadow">
                                          <input
                                            type="text"
                                            inputMode="numeric"
                                            className="flex-1 bg-transparent border-none text-[17px] font-semibold text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            value={item.quantity_g}
                                            onChange={(e) => {
                                              const val = parseInt(e.target.value) || 0;
                                              updateQuantity(idx, val);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                          <span className="text-[15px] text-text-secondary ml-1.5">{unitLabel}</span>
                                        </div>
                                        <motion.button
                                          className="w-11 h-11 rounded-xl bg-bg-primary border-none flex items-center justify-center text-text-tertiary cursor-pointer flex-shrink-0 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                          onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Trash2 size={18} />
                                        </motion.button>
                                      </div>
                                      {/* ± pills */}
                                      <div className="flex gap-2">
                                        {[-50, -10, 10, 50].map((delta) => (
                                          <motion.button
                                            key={delta}
                                            className="flex-1 py-1.5 bg-bg-primary border-none rounded-full text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-bg-tertiary transition-colors"
                                            onClick={(e) => { e.stopPropagation(); updateQuantity(idx, item.quantity_g + delta); }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            {delta > 0 ? '+' : '−'}{Math.abs(delta)}{unitLabel}
                                          </motion.button>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Summary */}
                  {items.length > 0 && (
                    <div className="flex justify-between items-center py-3.5 mt-2 border-t border-bg-tertiary/50">
                      <span className="text-[14px] font-medium text-text-secondary">Total</span>
                      <div>
                        <span className="text-[18px] font-bold">{totalCalories}</span>
                        <span className="text-[14px] text-text-secondary ml-1">cal</span>
                      </div>
                    </div>
                  )}
                  <div className="h-4" />
                </div>

                {/* Confirm button */}
                <div className="flex-shrink-0 px-6 py-3 pb-[max(16px,env(safe-area-inset-bottom))] border-t border-bg-tertiary/50 bg-bg-primary">
                  <motion.button
                    className="w-full h-[50px] bg-accent border-none rounded-lg text-[17px] font-semibold text-white cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-default"
                    disabled={items.length === 0 || confirming}
                    onClick={handleConfirm}
                    whileTap={items.length > 0 && !confirming ? { scale: 0.98 } : {}}
                  >
                    {confirming ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Logging...
                      </>
                    ) : (
                      <>
                        <Check size={20} />
                        Log {items.length} Item{items.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </motion.button>
                </div>
              </>
            )}
      </motion.div>
    </>
  );
}

export default function ConfirmFoodSheet({ open, ...props }: ConfirmFoodSheetProps) {
  return (
    <AnimatePresence>
      {open && <ConfirmFoodSheetInner key={`${props.originalQuery}-${props.items.length}`} {...props} />}
    </AnimatePresence>
  );
}
