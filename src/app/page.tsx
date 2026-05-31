'use client';

import { useState, useCallback, useRef, useEffect, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import CalorieRing from '@/components/CalorieRing';
import MacroGrid from '@/components/MacroGrid';
import FoodCard from '@/components/FoodCard';
import FAB from '@/components/FAB';
import AddFoodSheet from '@/components/AddFoodSheet';
import EditFoodSheet from '@/components/EditFoodSheet';
import Toast from '@/components/Toast';
import WeekStrip from '@/components/WeekStrip';
import { useAuth } from '@/components/AuthProvider';
import { fetchFoodLogs, fetchProfile, updateFoodLog, deleteFoodLog, insertFoodLog, fetchSuggestions, fetchWeeklyCalories, getOrCreateShareLink, SuggestedFood } from '@/lib/supabase-data';
import SuggestedFoods from '@/components/SuggestedFoods';
import { FoodLogEntry, Profile } from '@/lib/types';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getWeekDates(date: Date): string[] {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const wd = new Date(monday);
    wd.setDate(monday.getDate() + i);
    return formatDate(wd);
  });
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
  const [dismissedMeals, setDismissedMeals] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set<string>();
    try {
      const stored = sessionStorage.getItem('hm-dismissed-suggestions');
      if (stored) return new Set<string>(JSON.parse(stored));
    } catch {}
    return new Set<string>();
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FoodLogEntry | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    action?: { label: string; onPress: () => void };
  }>({ visible: false, message: '' });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const deleteTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weeklyCalories, setWeeklyCalories] = useState<Record<string, number>>({});
  const [sharing, setSharing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const swipeDirection = useRef<'x' | 'y' | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      if (deltaY > 0) {
        setPullDistance(Math.min(deltaY * 0.4, 80));
      }
    }
  };

  const handleTouchEnd = async (e: TouchEvent) => {
    if (swipeDirection.current === 'x') {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-food-card]')) {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(deltaX) > 60) {
          setSelectedDate(prev => {
            const next = new Date(prev);
            next.setDate(next.getDate() + (deltaX < 0 ? 1 : -1));
            return next;
          });
        }
      }
    } else {
      if (pullDistance > 50 && !refreshing) {
        setRefreshing(true);
        setPullDistance(50);
        if (user) {
          await Promise.all([
            fetchFoodLogs(user.id, formatDate(selectedDate)).then(setLogs),
            fetchProfile(user.id).then(p => { if (p) setProfile(p); }),
            fetchSuggestions(user.id, selectedDate).then(setSuggestions),
            fetchWeeklyCalories(user.id, getWeekDates(selectedDate)).then(setWeeklyCalories),
          ]);
        }
        setRefreshing(false);
      }
      setPullDistance(0);
    }
  };

  const dismissSuggestions = useCallback((key: string) => {
    setDismissedMeals(prev => {
      const next = new Set(prev).add(key);
      try { sessionStorage.setItem('hm-dismissed-suggestions', JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then(p => { if (p) setProfile(p); });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchFoodLogs(user.id, formatDate(selectedDate)).then(setLogs);
    fetchSuggestions(user.id, selectedDate).then(setSuggestions);
    fetchWeeklyCalories(user.id, getWeekDates(selectedDate)).then(setWeeklyCalories);
  }, [user, selectedDate]);

  const refreshLogs = useCallback(() => {
    if (!user) return;
    fetchFoodLogs(user.id, formatDate(selectedDate)).then(setLogs);
    fetchSuggestions(user.id, selectedDate).then(setSuggestions);
    fetchWeeklyCalories(user.id, getWeekDates(selectedDate)).then(setWeeklyCalories);
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

  // Merge live totals for selected day into weekly data
  const mergedWeeklyCalories = { ...weeklyCalories };
  mergedWeeklyCalories[formatDate(selectedDate)] = totals.calories;

  const showToast = useCallback((message: string, duration = 2000, action?: { label: string; onPress: () => void }) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message, action });
    toastTimer.current = setTimeout(() => setToast({ visible: false, message: '' }), duration);
  }, []);

  const handleShare = useCallback(async () => {
    if (!user || sharing) return;
    setSharing(true);
    const token = await getOrCreateShareLink(user.id, formatDate(selectedDate));
    setSharing(false);
    if (!token) {
      showToast('Failed to create share link');
      return;
    }
    const url = `${window.location.origin}/share/${token}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My food log', url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard ✓');
    }
  }, [user, selectedDate, sharing, showToast]);

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

  const handleDeleteWithUndo = useCallback((entryId: string, closeEditSheet?: boolean) => {
    const deletedEntry = logs.find(log => log.id === entryId);
    if (!deletedEntry) return;

    if (closeEditSheet) setEditingEntry(null);

    if (deleteTimer.current) clearTimeout(deleteTimer.current);

    setLogs(prev => prev.filter(log => log.id !== entryId));

    const commitDelete = () => {
      deleteFoodLog(entryId).then(success => {
        if (!success) {
          setLogs(prev => [...prev, deletedEntry]);
          showToast('Failed to delete');
        }
      });
    };

    deleteTimer.current = setTimeout(commitDelete, 5000);

    showToast(`${deletedEntry.food_name} deleted`, 5000, {
      label: 'Undo',
      onPress: () => {
        if (deleteTimer.current) clearTimeout(deleteTimer.current);
        setLogs(prev => [...prev, deletedEntry].sort((a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ));
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToast({ visible: false, message: '' });
      },
    });
  }, [logs, showToast]);

  const handleEditDelete = useCallback((entryId: string) => {
    handleDeleteWithUndo(entryId, true);
  }, [handleDeleteWithUndo]);

  const handleSwipeDelete = useCallback((entryId: string) => {
    handleDeleteWithUndo(entryId);
  }, [handleDeleteWithUndo]);

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

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Weekly strip header */}
      <div className="flex-shrink-0 pt-[max(env(safe-area-inset-top),12px)] pb-1 bg-bg-primary z-10 shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative">
        <WeekStrip
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          weeklyCalories={mergedWeeklyCalories}
          calorieTarget={profile.daily_calorie_goal}
        />
        <motion.button
          className="absolute top-[max(env(safe-area-inset-top),12px)] right-3 w-8 h-8 flex items-center justify-center bg-transparent border-none cursor-pointer text-text-secondary"
          whileTap={{ scale: 0.85 }}
          onClick={handleShare}
          disabled={sharing}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sharing ? 'opacity-40' : ''}>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </motion.button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-none overscroll-contain"
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
          className="flex items-center gap-5 mb-4"
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

        {/* Separator: summary / meals */}
        <div className="h-px bg-bg-tertiary mb-4" />

        {(() => {
          const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
          const mealLabels: Record<string, string> = {
            breakfast: 'Breakfast',
            lunch: 'Lunch',
            snack: 'Snack',
            dinner: 'Dinner',
          };

          const allSuggestions = suggestions;

          let cardIndex = 0;
          return mealOrder.map((type) => {
            const entries = logs.filter(l => l.meal_type === type);
            const mealCalories = entries.reduce((sum, e) => sum + (e.status === 'confirmed' ? (e.calories ?? 0) : 0), 0);
            const loggedNames = new Set(entries.map(e => e.food_name));
            const mealSuggestions = showSuggestions && !dismissedMeals.has(`${formatDate(selectedDate)}:${type}`)
              ? allSuggestions.filter(s => s.meal_type === type && !loggedNames.has(s.food_name))
              : [];
            const hasContent = entries.length > 0 || mealSuggestions.length > 0;

            if (!hasContent) return null;

            return (
              <div key={type} className="mb-3">
                {/* Grouped meal card */}
                {entries.length > 0 && (
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
                            onClick={entry.status === 'confirmed' ? () => setEditingEntry(entry) : undefined}
                            onDelete={entry.status === 'confirmed' ? handleSwipeDelete : undefined}
                          />
                        );
                      })}
                    </AnimatePresence>
                    <AnimatePresence>
                      {mealSuggestions.length > 0 && (
                        <motion.div
                          key={`suggest-${type}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden', transition: { duration: 0.2 } }}
                        >
                          <div className="h-px bg-bg-tertiary" />
                          <SuggestedFoods
                            items={mealSuggestions}
                            onAdd={handleSuggestionAdd}
                            onDismiss={() => dismissSuggestions(`${formatDate(selectedDate)}:${type}`)}
                            embedded
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Suggestions-only card when no logged entries */}
                {entries.length === 0 && mealSuggestions.length > 0 && (
                  <div
                    className="rounded-xl overflow-hidden mb-2"
                    style={{ backgroundColor: 'var(--color-card-bg)' }}
                  >
                    <div className="px-3.5 pt-2.5 pb-1">
                      <span className="text-[12px] font-medium text-text-tertiary uppercase tracking-wide">{mealLabels[type]}</span>
                    </div>
                    <div className="h-px bg-bg-tertiary" />
                    <AnimatePresence>
                      <SuggestedFoods
                        key={`suggest-${type}`}
                        items={mealSuggestions}
                        onAdd={handleSuggestionAdd}
                        onDismiss={() => dismissSuggestions(`${formatDate(selectedDate)}:${type}`)}
                        embedded
                      />
                    </AnimatePresence>
                  </div>
                )}
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
