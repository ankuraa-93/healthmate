'use client';

import { useState, useCallback, useRef, useEffect, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, RefreshCw } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import CalorieRing from '@/components/CalorieRing';
import MacroGrid from '@/components/MacroGrid';
import FoodCard from '@/components/FoodCard';
import FAB from '@/components/FAB';
import AddFoodSheet from '@/components/AddFoodSheet';
import EditFoodSheet from '@/components/EditFoodSheet';
import Toast from '@/components/Toast';
import { useAuth } from '@/components/AuthProvider';
import { fetchFoodLogs, fetchProfile, updateFoodLog, deleteFoodLog, insertFoodLog, fetchSuggestions, SuggestedFood } from '@/lib/supabase-data';
import SuggestedFoods from '@/components/SuggestedFoods';
import { FoodLogEntry, Profile } from '@/lib/types';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const defaultProfile: Profile = {
  id: '',
  display_name: null,
  daily_calorie_goal: 2000,
  daily_protein_goal: 120,
  daily_carbs_goal: 250,
  daily_fat_goal: 65,
  daily_fibre_goal: 30,
  created_at: '',
  updated_at: '',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<FoodLogEntry[]>([]);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [suggestions, setSuggestions] = useState<SuggestedFood[]>([]);
  const [dismissedMeals, setDismissedMeals] = useState<Set<string>>(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FoodLogEntry | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    action?: { label: string; onPress: () => void };
  }>({ visible: false, message: '' });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const datePickerRef = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!scrollRef.current || scrollRef.current.scrollTop > 0) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.4, 80));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 50 && !refreshing) {
      setRefreshing(true);
      setPullDistance(50);
      if (user) {
        await Promise.all([
          fetchFoodLogs(user.id, formatDate(selectedDate)).then(setLogs),
          fetchProfile(user.id).then(p => { if (p) setProfile(p); }),
          fetchSuggestions(user.id, selectedDate).then(setSuggestions),
        ]);
      }
      setRefreshing(false);
    }
    setPullDistance(0);
  };

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then(p => { if (p) setProfile(p); });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchFoodLogs(user.id, formatDate(selectedDate)).then(setLogs);
    fetchSuggestions(user.id, selectedDate).then(setSuggestions);
  }, [user, selectedDate]);

  const refreshLogs = useCallback(() => {
    if (!user) return;
    fetchFoodLogs(user.id, formatDate(selectedDate)).then(setLogs);
    fetchSuggestions(user.id, selectedDate).then(setSuggestions);
  }, [user, selectedDate]);

  const totals = logs.reduce(
    (acc, log) => {
      if (log.status === 'confirmed') {
        acc.calories += log.calories ?? 0;
        acc.protein += log.protein ?? 0;
        acc.carbs += log.carbs ?? 0;
        acc.fat += log.fat ?? 0;
        acc.fibre += log.fibre ?? 0;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 }
  );

  const showToast = useCallback((message: string, duration = 2000, action?: { label: string; onPress: () => void }) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message, action });
    toastTimer.current = setTimeout(() => setToast({ visible: false, message: '' }), duration);
  }, []);

  const handleSheetClose = useCallback(() => {
    setSheetOpen(false);
    refreshLogs();
  }, [refreshLogs]);

  const handleEditSave = useCallback(async (result: {
    id: string;
    quantity_g: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fibre: number;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }) => {
    const updated = await updateFoodLog(result.id, {
      quantity_g: result.quantity_g,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      fibre: result.fibre,
      meal_type: result.meal_type,
    });

    if (updated) {
      setLogs(prev => prev.map(log => log.id === result.id ? updated : log));
      showToast('Entry updated ✓');
    } else {
      showToast('Failed to update');
    }
    setEditingEntry(null);
  }, [showToast]);

  const handleEditDelete = useCallback(async (entryId: string) => {
    const deletedEntry = logs.find(log => log.id === entryId);
    if (!deletedEntry) return;

    setEditingEntry(null);

    const success = await deleteFoodLog(entryId);
    if (success) {
      setLogs(prev => prev.filter(log => log.id !== entryId));
      showToast(`${deletedEntry.food_name} deleted`, 3000);
    } else {
      showToast('Failed to delete');
    }
  }, [logs, showToast]);

  const handleSwipeDelete = useCallback(async (entryId: string) => {
    const deletedEntry = logs.find(log => log.id === entryId);
    if (!deletedEntry) return;

    const success = await deleteFoodLog(entryId);
    if (success) {
      setLogs(prev => prev.filter(log => log.id !== entryId));
      showToast(`${deletedEntry.food_name} deleted`, 3000);
    } else {
      showToast('Failed to delete');
    }
  }, [logs, showToast]);

  const handleSuggestionAdd = useCallback(async (item: SuggestedFood) => {
    if (!user) return;
    const entry = await insertFoodLog({
      user_id: user.id,
      food_library_id: item.food_library_id,
      food_name: item.food_name,
      quantity_g: item.quantity_g,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fibre: item.fibre,
      meal_type: item.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      logged_date: formatDate(selectedDate),
      status: 'confirmed',
      unit: item.unit as 'g' | 'ml',
    });
    if (entry) {
      setLogs(prev => [...prev, entry]);
      setSuggestions(prev => prev.filter(s => !(s.food_name === item.food_name && s.meal_type === item.meal_type)));
      showToast(`${item.food_name} logged ✓`);
    }
  }, [user, selectedDate, showToast]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = selectedDate.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const showSuggestions = isToday || selectedDate.toDateString() === yesterday.toDateString();
  const dateStr = isToday
    ? `Today, ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
    : selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });

  const handleDatePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const d = new Date(e.target.value + 'T12:00:00');
    setSelectedDate(d);
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Fixed date header */}
      <div className="flex-shrink-0 pt-[max(env(safe-area-inset-top),12px)] pb-2 bg-bg-primary z-10">
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            className="relative inline-flex items-center gap-1.5 bg-bg-secondary rounded-full px-3.5 py-2 cursor-pointer border-none"
            onClick={() => datePickerRef.current?.showPicker()}
          >
            <Calendar size={16} className="text-text-secondary" />
            <span className="text-[17px] font-medium text-text-primary">{dateStr}</span>
            <input
              ref={datePickerRef}
              type="date"
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              onChange={handleDatePick}
            />
          </button>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
      {/* Pull-to-refresh indicator */}
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

        {/* Summary: ring + macros */}
        <motion.div
          className="flex items-center gap-5 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CalorieRing consumed={totals.calories} target={profile.daily_calorie_goal} />
          <MacroGrid
            protein={totals.protein}
            proteinTarget={profile.daily_protein_goal}
            carbs={totals.carbs}
            carbsTarget={profile.daily_carbs_goal}
            fat={totals.fat}
            fatTarget={profile.daily_fat_goal}
            fibre={totals.fibre}
            fibreTarget={profile.daily_fibre_goal}
            calorieRatio={totals.calories / profile.daily_calorie_goal}
          />
        </motion.div>

        {/* Meals */}
        <motion.div
          className="flex justify-between items-center mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-xl font-medium">Meals</span>
        </motion.div>

        {(() => {
          const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
          const mealLabels: Record<string, string> = {
            breakfast: 'Breakfast',
            lunch: 'Lunch',
            snack: 'Snack',
            dinner: 'Dinner',
          };

          const dummySuggestions: SuggestedFood[] = [
            { food_name: 'Omelette', quantity_g: 120, calories: 220, protein: 16, carbs: 2, fat: 17, fibre: 0, unit: 'g', food_library_id: null, meal_type: 'breakfast', pattern: 'daily' },
            { food_name: 'Toast (White Bread)', quantity_g: 60, calories: 156, protein: 5, carbs: 29, fat: 2, fibre: 1, unit: 'g', food_library_id: null, meal_type: 'breakfast', pattern: 'daily' },
            { food_name: 'Black Coffee', quantity_g: 200, calories: 4, protein: 0, carbs: 1, fat: 0, fibre: 0, unit: 'ml', food_library_id: null, meal_type: 'breakfast', pattern: 'weekly' },
            { food_name: 'Dal Tadka', quantity_g: 200, calories: 170, protein: 9, carbs: 22, fat: 5, fibre: 4, unit: 'g', food_library_id: null, meal_type: 'lunch', pattern: 'daily' },
            { food_name: 'Jeera Rice', quantity_g: 180, calories: 234, protein: 4, carbs: 46, fat: 4, fibre: 1, unit: 'g', food_library_id: null, meal_type: 'lunch', pattern: 'weekly' },
            { food_name: 'Paneer Butter Masala', quantity_g: 200, calories: 330, protein: 14, carbs: 12, fat: 26, fibre: 2, unit: 'g', food_library_id: null, meal_type: 'lunch', pattern: 'daily' },
            { food_name: 'Roti', quantity_g: 40, calories: 104, protein: 3, carbs: 18, fat: 3, fibre: 2, unit: 'g', food_library_id: null, meal_type: 'lunch', pattern: 'biweekly' },
            { food_name: 'Raita', quantity_g: 100, calories: 60, protein: 3, carbs: 5, fat: 3, fibre: 0, unit: 'g', food_library_id: null, meal_type: 'lunch', pattern: 'biweekly' },
          ];
          const allSuggestions = [...suggestions, ...dummySuggestions];

          let cardIndex = 0;
          return mealOrder.map((type) => {
            const entries = logs.filter(l => l.meal_type === type);
            const loggedNames = new Set(entries.map(e => e.food_name));
            const mealSuggestions = showSuggestions && !dismissedMeals.has(type)
              ? allSuggestions.filter(s => s.meal_type === type && !loggedNames.has(s.food_name))
              : [];
            const hasContent = entries.length > 0 || mealSuggestions.length > 0;

            if (!hasContent) return null;

            return (
              <div key={type} className="mb-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] font-medium text-text-tertiary uppercase tracking-wide">{mealLabels[type]}</span>
                  <div className="flex-1 h-px bg-bg-tertiary" />
                </div>
                <AnimatePresence>
                {entries.map((entry) => {
                  const idx = cardIndex++;
                  return (
                    <FoodCard
                      key={entry.id}
                      entry={entry}
                      index={idx}
                      onClick={entry.status === 'confirmed' ? () => setEditingEntry(entry) : undefined}
                      onDelete={entry.status === 'confirmed' ? handleSwipeDelete : undefined}
                    />
                  );
                })}
                </AnimatePresence>
                <AnimatePresence>
                {mealSuggestions.length > 0 && (
                  <SuggestedFoods
                    key={`suggest-${type}`}
                    items={mealSuggestions}
                    onAdd={handleSuggestionAdd}
                    onDismiss={() => setDismissedMeals(prev => new Set(prev).add(type))}
                  />
                )}
                </AnimatePresence>
              </div>
            );
          });
        })()}
      </div>
      </div>

      <BottomNav />

      <FAB onClick={() => !editingEntry && setSheetOpen(true)} />

      <AddFoodSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        userId={user?.id ?? ''}
        logDate={formatDate(selectedDate)}
        onToast={showToast}
      />

      <EditFoodSheet
        entry={editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={handleEditSave}
        onDelete={handleEditDelete}
      />

      <Toast message={toast.message} visible={toast.visible} action={toast.action} />
    </div>
  );
}
