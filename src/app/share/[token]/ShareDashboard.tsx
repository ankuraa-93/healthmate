'use client';

import { useState, useCallback, useRef, useEffect, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  input_source: string | null;
  image_url: string | null;
}

interface SharedSourceImage {
  url: string;
  mealType: string;
  foodIds: string[];
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
  source_images: SharedSourceImage[];
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
    input_source: (e.input_source as FoodLogEntry['input_source']) ?? 'text',
    source_image_url: null,
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
  const [expandedPhoto, setExpandedPhoto] = useState<SharedSourceImage | null>(null);
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
  const mealOrderKeys = ['breakfast', 'lunch', 'snack', 'dinner'];
  const sourceImages = [...(data.source_images ?? [])].sort(
    (a, b) => mealOrderKeys.indexOf(a.mealType) - mealOrderKeys.indexOf(b.mealType)
  );

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
        <div className="text-center mt-1 mb-1">
          <span className="text-[13px] font-medium text-text-secondary">{ownerLabel}</span>
        </div>
        <WeekStrip
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          weeklyCalories={mergedWeeklyCalories}
          calorieTarget={data.daily_calorie_goal}
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

        <div className="px-5 pb-4 pt-2">
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

          {/* Photo tray */}
          {sourceImages.length > 0 && (
            <div className="mb-4 -mr-4">
              <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1 pr-4">
                {sourceImages.map((img, idx) => (
                  <motion.button
                    key={img.url}
                    className="flex-shrink-0 border-none p-0 cursor-pointer bg-transparent flex flex-col items-center gap-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setExpandedPhoto(img)}
                  >
                    <div className="w-28 h-28 rounded-xl overflow-hidden">
                      <img src={img.url} alt="Food photo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] font-medium text-text-tertiary capitalize">{img.mealType}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-bg-tertiary mb-4" />

          {/* Meals */}
          {mealOrder.map((type) => {
            const entries = logs.filter(l => l.meal_type === type);
            if (entries.length === 0) return null;
            const mealCalories = entries.reduce((sum, e) => sum + (e.calories ?? 0), 0);

            return (
              <div key={type} className="mb-1">
                <div className="overflow-hidden">
                  <div className="h-px bg-bg-tertiary" />
                  <div className="px-5 pt-2.5 pb-1">
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

      {/* Photo detail view (read-only) */}
      <AnimatePresence>
        {expandedPhoto && (
          <motion.div
            className="absolute inset-0 bg-black z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)] pb-2">
              <motion.button
                className="w-9 h-9 rounded-full bg-white/15 border-none flex items-center justify-center cursor-pointer"
                onClick={() => setExpandedPhoto(null)}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} className="text-white" />
              </motion.button>
              <span className="text-white/70 text-[14px] font-medium capitalize">{expandedPhoto.mealType}</span>
              <span className="w-9" />
            </div>

            {/* Photo */}
            {(() => {
              const idx = sourceImages.findIndex(s => s.url === expandedPhoto.url);
              const hasPrev = idx > 0;
              const hasNext = idx >= 0 && idx < sourceImages.length - 1;
              const go = (delta: number) => {
                const next = sourceImages[idx + delta];
                if (next) setExpandedPhoto(next);
              };
              return (
                <div className="px-4 pb-3">
                  <div className="relative">
                    <motion.img
                      key={expandedPhoto.url}
                      src={expandedPhoto.url}
                      alt="Food photo"
                      className="w-full rounded-xl object-contain max-h-[52vh] select-none"
                      draggable={false}
                      drag={sourceImages.length > 1 ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.15}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -60 && hasNext) go(1);
                        else if (info.offset.x > 60 && hasPrev) go(-1);
                      }}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    />
                    {hasPrev && (
                      <motion.button
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border-none flex items-center justify-center cursor-pointer"
                        onClick={() => go(-1)}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronLeft size={20} className="text-white" />
                      </motion.button>
                    )}
                    {hasNext && (
                      <motion.button
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border-none flex items-center justify-center cursor-pointer"
                        onClick={() => go(1)}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronRight size={20} className="text-white" />
                      </motion.button>
                    )}
                  </div>
                  {sourceImages.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-2.5">
                      {sourceImages.map((s, i) => (
                        <div key={s.url} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/30'}`} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Food list */}
            <div className="flex-1 overflow-y-auto px-4 pb-[max(env(safe-area-inset-bottom),16px)]">
              <div className="text-white/50 text-[12px] font-medium uppercase tracking-wide mb-2">
                Identified foods ({expandedPhoto.foodIds.length})
              </div>
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1c1c1e' }}>
                {expandedPhoto.foodIds.map((foodId, idx) => {
                  const entry = logs.find(l => l.id === foodId);
                  if (!entry) return null;
                  const unitLabel = entry.unit === 'ml' ? 'ml' : 'g';
                  return (
                    <div key={foodId}>
                      {idx > 0 && <div className="h-px bg-white/10 mx-3.5" />}
                      <div className="p-3 px-3.5">
                        <div className="text-[14px] font-medium text-white leading-snug">{entry.food_name}</div>
                        <div className="flex items-baseline justify-between gap-2 mt-px text-[13px] text-white/50">
                          <span>{entry.quantity_g}{unitLabel} &middot; {entry.calories} cal</span>
                          <span>P:{entry.protein} C:{entry.carbs} F:{entry.fat} Fi:{entry.fibre}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="flex-shrink-0 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 px-4 text-center">
        <p className="text-[11px] text-text-tertiary">
          Tracked with <span className="font-medium text-accent">Calorrific</span>
        </p>
      </div>
    </div>
  );
}
