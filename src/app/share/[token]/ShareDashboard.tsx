'use client';

import { useState, useCallback, useRef, useEffect, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import CalorieRing from '@/components/CalorieRing';
import MacroGrid from '@/components/MacroGrid';
import FoodCard from '@/components/FoodCard';
import WeekStrip from '@/components/WeekStrip';
import { FoodLogEntry } from '@/lib/types';
import { createClient } from '@/lib/supabase';

interface SharedEntry {
  id: string;
  food_name: string;
  quantity_g: number;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fibre: number | null;
  meal_type: string;
  unit: string;
  image_url: string | null;
}

interface SharedData {
  display_name: string | null;
  email: string;
  logged_date: string;
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_carbs_goal: number;
  daily_fat_goal: number;
  daily_fibre_goal: number;
  entries: SharedEntry[];
  weekly_calories: Record<string, number>;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toFoodLogEntry(e: SharedEntry, loggedDate: string): FoodLogEntry {
  return {
    ...e,
    user_id: '',
    food_library_id: null,
    logged_date: loggedDate,
    status: 'confirmed',
    meal_type: e.meal_type as FoodLogEntry['meal_type'],
    unit: e.unit as FoodLogEntry['unit'],
    created_at: '',
    updated_at: '',
  };
}

export default function ShareDashboard({ token }: { token: string }) {
  const [data, setData] = useState<SharedData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swipeDirection = useRef<'x' | 'y' | null>(null);

  const fetchRef = useRef((date: Date) => {
    const supabase = createClient();
    supabase.rpc('get_shared_log', {
      share_token: token,
      target_date: formatDate(date),
    }).then(({ data: result, error }) => {
      if (error || !result) {
        setNotFound(true);
        return;
      }
      setData(result as SharedData);
      setLoading(false);
    });
  });

  useEffect(() => {
    fetchRef.current(selectedDate);
  }, [selectedDate]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    swipeDirection.current = null;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (!swipeDirection.current && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      swipeDirection.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
    }
    if (swipeDirection.current === 'y') {
      if (!scrollRef.current || scrollRef.current.scrollTop > 0) return;
      if (deltaY > 0) setPullDistance(Math.min(deltaY * 0.4, 80));
    }
  };

  const handleTouchEnd = async (e: TouchEvent) => {
    if (swipeDirection.current === 'x') {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) > 60) {
        setSelectedDate(prev => {
          const next = new Date(prev);
          next.setDate(next.getDate() + (deltaX < 0 ? 1 : -1));
          return next;
        });
      }
    } else {
      if (pullDistance > 50 && !refreshing) {
        setRefreshing(true);
        setPullDistance(50);
        fetchRef.current(selectedDate);
        setTimeout(() => setRefreshing(false), 600);
      }
      setPullDistance(0);
    }
  };

  if (notFound) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 bg-bg-primary">
        <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-text-primary mb-1">Link not found</h1>
        <p className="text-sm text-text-secondary text-center">This share link may have expired or doesn&apos;t exist.</p>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-bg-primary">
        <div className="w-8 h-8 border-3 border-bg-tertiary border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  const logs = data.entries.map(e => toFoodLogEntry(e, data.logged_date));

  const totals = logs.reduce(
    (acc, log) => ({
      calories: acc.calories + (log.calories ?? 0),
      protein: acc.protein + (log.protein ?? 0),
      carbs: acc.carbs + (log.carbs ?? 0),
      fat: acc.fat + (log.fat ?? 0),
      fibre: acc.fibre + (log.fibre ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 }
  );

  const mergedWeeklyCalories = { ...data.weekly_calories };
  mergedWeeklyCalories[formatDate(selectedDate)] = totals.calories;

  const ownerLabel = data.display_name || data.email;
  const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
  const mealLabels: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    snack: 'Snack',
    dinner: 'Dinner',
  };

  let cardIndex = 0;

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pt-[max(env(safe-area-inset-top),12px)] pb-1 bg-bg-primary z-10 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <WeekStrip
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          weeklyCalories={mergedWeeklyCalories}
          calorieTarget={data.daily_calorie_goal}
          ownerLabel={ownerLabel}
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-none overscroll-contain"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull-to-refresh */}
        <motion.div
          className="flex justify-center items-center overflow-hidden"
          animate={{ height: pullDistance || refreshing ? Math.max(pullDistance, refreshing ? 50 : 0) : 0 }}
          transition={pullDistance > 0 ? { duration: 0 } : { duration: 0.3 }}
        >
          <motion.div
            animate={refreshing ? { rotate: 360 } : { rotate: pullDistance * 3 }}
            transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
          >
            <RefreshCw size={20} className={pullDistance > 50 || refreshing ? 'text-accent' : 'text-text-tertiary'} />
          </motion.div>
        </motion.div>

        <div className="px-4 pb-4 pt-2">
          {/* Summary */}
          <motion.div
            className="flex items-center gap-5 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CalorieRing consumed={totals.calories} target={data.daily_calorie_goal} />
            <MacroGrid
              protein={totals.protein}
              proteinTarget={data.daily_protein_goal}
              carbs={totals.carbs}
              carbsTarget={data.daily_carbs_goal}
              fat={totals.fat}
              fatTarget={data.daily_fat_goal}
              fibre={totals.fibre}
              fibreTarget={data.daily_fibre_goal}
              calorieRatio={totals.calories / data.daily_calorie_goal}
            />
          </motion.div>

          <div className="h-px bg-bg-tertiary mb-4" />

          {/* Meals */}
          {mealOrder.map((type) => {
            const entries = logs.filter(l => l.meal_type === type);
            if (entries.length === 0) return null;
            const mealCalories = entries.reduce((sum, e) => sum + (e.calories ?? 0), 0);

            return (
              <div key={type} className="mb-3">
                <div
                  className="rounded-xl overflow-hidden mb-2"
                  style={{ backgroundColor: 'var(--color-card-bg)', '--meal-bg': 'var(--color-card-bg)' } as React.CSSProperties}
                >
                  <div className="px-3.5 pt-2.5 pb-1">
                    <span className="text-[12px] font-medium text-text-tertiary uppercase tracking-wide">
                      {mealLabels[type]}
                    </span>
                    {mealCalories > 0 && (
                      <span className="text-[12px] font-medium text-text-tertiary">
                        {' '}&middot; {mealCalories} cal
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {entries.map((entry, i) => {
                      const idx = cardIndex++;
                      return (
                        <FoodCard
                          key={entry.id}
                          entry={entry}
                          index={idx}
                          showSeparator={i > 0}
                        />
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {logs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-text-tertiary">No food logged for this day.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 px-4 text-center">
        <p className="text-[11px] text-text-tertiary">
          Tracked with <span className="font-medium text-accent">Calorrific</span>
        </p>
      </div>
    </div>
  );
}
