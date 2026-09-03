'use client';

import { useState, useEffect, useRef, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import CalorieRing from '@/components/CalorieRing';
import MacroGrid from '@/components/MacroGrid';
import FoodCard from '@/components/FoodCard';
import WeekStrip from '@/components/WeekStrip';
import { ViewableConnection, SharedLogData, SharedLogEntry, FoodLogEntry } from '@/lib/types';

interface SharedLogSheetProps {
  connection: ViewableConnection | null;
  onClose: () => void;
}

const MEAL_ORDER = ['breakfast', 'lunch', 'snack', 'dinner'];
const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
};

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toFoodLogEntry(e: SharedLogEntry): FoodLogEntry {
  return {
    id: e.id,
    user_id: '',
    food_library_id: null,
    food_name: e.food_name,
    quantity_g: e.quantity_g,
    calories: e.calories,
    protein: e.protein,
    carbs: e.carbs,
    fat: e.fat,
    fibre: e.fibre,
    meal_type: e.meal_type as FoodLogEntry['meal_type'],
    logged_date: '',
    status: 'confirmed',
    unit: (e.unit || 'g') as 'g' | 'ml',
    input_source: (e.input_source || 'text') as 'text' | 'voice' | 'image',
    source_image_url: null,
    image_url: e.image_url,
    created_at: '',
    updated_at: '',
  };
}

function SharedLogContent({ connection, onClose }: { connection: ViewableConnection; onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [data, setData] = useState<SharedLogData | null>(null);
  const [fetchedKey, setFetchedKey] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const ownerName = connection.owner_display_name || connection.owner_email.split('@')[0];
  const currentKey = `${connection.owner_id}:${formatDate(selectedDate)}`;
  const loading = fetchedKey !== currentKey;

  useEffect(() => {
    let cancelled = false;
    const key = `${connection.owner_id}:${formatDate(selectedDate)}`;
    const doFetch = async () => {
      try {
        const res = await fetch(
          `/api/share-connections/log?ownerId=${connection.owner_id}&date=${formatDate(selectedDate)}`,
        );
        if (cancelled) return;
        if (res.ok) {
          setData(await res.json());
        } else {
          setData(null);
        }
      } catch {
        if (!cancelled) setData(null);
      }
      if (!cancelled) setFetchedKey(key);
    };
    doFetch();
    return () => { cancelled = true; };
  }, [connection.owner_id, selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 60) {
      setSelectedDate(prev => {
        const next = new Date(prev);
        next.setDate(next.getDate() + (deltaX < 0 ? 1 : -1));
        return next;
      });
    }
  };

  const entries = data?.entries ?? [];
  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories ?? 0),
      protein: acc.protein + (e.protein ?? 0),
      carbs: acc.carbs + (e.carbs ?? 0),
      fat: acc.fat + (e.fat ?? 0),
      fibre: acc.fibre + (e.fibre ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 },
  );

  const weeklyCalories = data?.weekly_calories ?? {};
  const mergedWeekly = { ...weeklyCalories };
  mergedWeekly[formatDate(selectedDate)] = totals.calories;

  return (
    <motion.div
      className="fixed inset-0 bg-bg-primary z-50 flex justify-center"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
    >
      <div className="w-full max-w-[428px] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pt-[max(env(safe-area-inset-top),12px)] pb-1 bg-bg-primary z-10 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between px-4 mb-1">
          <motion.button
            className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center border-none cursor-pointer"
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={18} className="text-text-secondary" />
          </motion.button>
          <div className="flex items-center gap-2">
            {connection.owner_avatar_url ? (
              <img src={connection.owner_avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-accent text-[11px] font-semibold">
                {(connection.owner_display_name || connection.owner_email)[0].toUpperCase()}
              </div>
            )}
            <span className="text-[15px] font-medium">{ownerName}&apos;s log</span>
          </div>
          <div className="w-8" />
        </div>
        <WeekStrip
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          weeklyCalories={mergedWeekly}
          calorieTarget={data?.daily_calorie_goal ?? 2000}
        />
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {loading && !data ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-bg-tertiary border-t-accent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="px-5 pb-4 pt-3">
            {/* Summary */}
            <motion.div
              className="flex items-center gap-5 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <CalorieRing consumed={totals.calories} target={data?.daily_calorie_goal ?? 2000} />
              <MacroGrid
                protein={totals.protein}
                proteinTarget={data?.daily_protein_goal ?? 120}
                carbs={totals.carbs}
                carbsTarget={data?.daily_carbs_goal ?? 250}
                fat={totals.fat}
                fatTarget={data?.daily_fat_goal ?? 65}
                fibre={totals.fibre}
                fibreTarget={data?.daily_fibre_goal ?? 30}
                calorieRatio={totals.calories / (data?.daily_calorie_goal ?? 2000)}
              />
            </motion.div>

            <div className="h-px bg-bg-tertiary mb-4" />

            {/* Meals */}
            {entries.length === 0 && !loading ? (
              <div className="text-center py-10 text-text-tertiary text-[14px]">
                No food logged on this day
              </div>
            ) : (
              MEAL_ORDER.map(type => {
                const mealEntries = entries.filter(e => e.meal_type === type);
                if (mealEntries.length === 0) return null;
                const mealCalories = mealEntries.reduce((sum, e) => sum + (e.calories ?? 0), 0);

                return (
                  <div key={type} className="mb-1">
                    <div className="overflow-hidden">
                      <div className="h-px bg-bg-tertiary" />
                      <div className="px-5 pt-2.5 pb-1">
                        <span className="text-[12px] font-medium text-text-tertiary uppercase tracking-wide">
                          {MEAL_LABELS[type]}
                        </span>
                        {mealCalories > 0 && (
                          <span className="text-[12px] font-medium text-text-tertiary">
                            {' '}&middot; {mealCalories} cal
                          </span>
                        )}
                      </div>
                      {mealEntries.map((entry, i) => (
                        <FoodCard
                          key={entry.id}
                          entry={toFoodLogEntry(entry)}
                          index={i}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      </div>
    </motion.div>
  );
}

export default function SharedLogSheet({ connection, onClose }: SharedLogSheetProps) {
  return (
    <AnimatePresence>
      {connection && (
        <SharedLogContent key={connection.id} connection={connection} onClose={onClose} />
      )}
    </AnimatePresence>
  );
}
