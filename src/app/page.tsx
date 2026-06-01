'use client';

import { useState, useCallback, useRef, useEffect, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, Trash2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import CalorieRing from '@/components/CalorieRing';
import MacroGrid from '@/components/MacroGrid';
import FoodCard from '@/components/FoodCard';
import FAB from '@/components/FAB';
import AddFoodSheet from '@/components/AddFoodSheet';
import { ReviewPhoto } from '@/components/PhotoReviewSheet';
import EditFoodSheet from '@/components/EditFoodSheet';
import Toast from '@/components/Toast';
import WeekStrip from '@/components/WeekStrip';
import { useAuth } from '@/components/AuthProvider';
import { fetchFoodLogs, fetchProfile, updateFoodLog, deleteFoodLog, insertFoodLog, fetchSuggestions, fetchWeeklyCalories, getOrCreateShareLink, SuggestedFood, insertProcessingJob, deleteProcessingJob, fetchProcessingJobs, uploadFoodPhoto, fetchSourceImages, SourceImage } from '@/lib/supabase-data';
import SuggestedFoods from '@/components/SuggestedFoods';
import { FoodLogEntry, Profile, ProcessingJob } from '@/lib/types';
import { applyRotation } from '@/lib/image-utils';

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
      const stored = localStorage.getItem('hm-dismissed-suggestions');
      if (stored) return new Set<string>(JSON.parse(stored));
    } catch {}
    return new Set<string>();
  });
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([]);
  const [sourceImages, setSourceImages] = useState<SourceImage[]>([]);
  const [expandedPhoto, setExpandedPhoto] = useState<SourceImage | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FoodLogEntry | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    action?: { label: string; onPress: () => void };
  }>({ visible: false, message: '' });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);
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
          const date = formatDate(selectedDate);
          await Promise.all([
            fetchFoodLogs(user.id, date).then(setLogs),
            fetchProfile(user.id).then(p => { if (p) setProfile(p); }),
            fetchSuggestions(user.id, selectedDate).then(setSuggestions),
            fetchWeeklyCalories(user.id, getWeekDates(selectedDate)).then(setWeeklyCalories),
            fetchProcessingJobs(user.id, date).then(setProcessingJobs),
            fetchSourceImages(user.id, date).then(setSourceImages),
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
      try { localStorage.setItem('hm-dismissed-suggestions', JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then(p => { if (p) setProfile(p); });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const date = formatDate(selectedDate);
    fetchFoodLogs(user.id, date).then(setLogs);
    fetchSuggestions(user.id, selectedDate).then(setSuggestions);
    fetchWeeklyCalories(user.id, getWeekDates(selectedDate)).then(setWeeklyCalories);
    fetchProcessingJobs(user.id, date).then(setProcessingJobs);
    fetchSourceImages(user.id, date).then(setSourceImages);
  }, [user, selectedDate]);

  const refreshLogs = useCallback(() => {
    if (!user) return;
    const date = formatDate(selectedDate);
    fetchFoodLogs(user.id, date).then(setLogs);
    fetchSuggestions(user.id, selectedDate).then(setSuggestions);
    fetchWeeklyCalories(user.id, getWeekDates(selectedDate)).then(setWeeklyCalories);
    fetchProcessingJobs(user.id, date).then(setProcessingJobs);
    fetchSourceImages(user.id, date).then(setSourceImages);
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

    setLogs(prev => prev.filter(log => log.id !== entryId));

    deleteFoodLog(entryId).then(success => {
      if (!success) {
        setLogs(prev => [...prev, deletedEntry]);
        showToast('Failed to delete');
      }
    });

    showToast(`${deletedEntry.food_name} deleted`, 5000, {
      label: 'Undo',
      onPress: () => {
        const { id, created_at, updated_at, image_url, ...rest } = deletedEntry;
        insertFoodLog({ ...rest, input_source: rest.input_source || 'text', source_image_url: rest.source_image_url || null }).then(restored => {
          if (restored) {
            setLogs(prev => [...prev, { ...restored, image_url: deletedEntry.image_url }].sort((a, b) =>
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            ));
          } else {
            showToast('Failed to undo');
          }
        });
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
      input_source: 'text',
      source_image_url: null,
    });
    if (entry) {
      setLogs(prev => [...prev, { ...entry, image_url: null }]);
      setSuggestions(prev => prev.filter(s => !(s.food_name === item.food_name && s.meal_type === item.meal_type)));
      showToast(`${item.food_name} logged ✓`);
    }
  }, [user, selectedDate, showToast]);

  const handlePhotosSubmitted = useCallback(async (photos: ReviewPhoto[]) => {
    if (!user) return;
    const date = formatDate(selectedDate);

    for (const photo of photos) {
      const rotated = await applyRotation(photo.processedImage, photo.rotation);
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const thumbnailUrl = await uploadFoodPhoto(user.id, rotated.thumbnailBlob, fileName);
      if (!thumbnailUrl) {
        showToast('Failed to upload photo');
        continue;
      }

      const job = await insertProcessingJob({
        user_id: user.id,
        meal_type: photo.mealType,
        logged_date: date,
        image_url: thumbnailUrl,
      });
      if (!job) {
        showToast('Failed to create processing job');
        continue;
      }

      setProcessingJobs(prev => [...prev, job]);

      (async () => {
        try {
          const parseRes = await fetch('/api/parse-food-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: rotated.originalBase64,
              mimeType: rotated.mimeType,
              mealType: photo.mealType,
              currentHour: new Date().getHours(),
            }),
          });
          if (!parseRes.ok) throw new Error((await parseRes.json().catch(() => ({}))).error || 'Image parse failed');
          const parsed = await parseRes.json();

          if (!parsed.items || parsed.items.length === 0) {
            showToast('No food found in photo');
            await deleteProcessingJob(job.id);
            setProcessingJobs(prev => prev.filter(j => j.id !== job.id));
            return;
          }

          const matchRes = await fetch('/api/match-food', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: parsed.items }),
          });
          if (!matchRes.ok) throw new Error((await matchRes.json().catch(() => ({}))).error || 'Match failed');
          const matched = await matchRes.json();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const insertPromises = matched.items.map(async (item: any) => {
            const ratio = item.quantity_g / 100;
            return insertFoodLog({
              user_id: user.id,
              food_library_id: item.matched_library_id || null,
              food_name: item.matched_library_name || item.name,
              quantity_g: item.quantity_g,
              calories: Math.round(item.calories_per_100g * ratio),
              protein: Math.round(item.protein_per_100g * ratio),
              carbs: Math.round(item.carbs_per_100g * ratio),
              fat: Math.round(item.fat_per_100g * ratio),
              fibre: Math.round(item.fibre_per_100g * ratio),
              meal_type: photo.mealType,
              logged_date: date,
              status: 'confirmed',
              unit: item.unit || 'g',
              input_source: 'image',
              source_image_url: thumbnailUrl,
            });
          });

          const results = await Promise.all(insertPromises);
          const inserted = results.filter(Boolean) as FoodLogEntry[];

          await deleteProcessingJob(job.id);
          setProcessingJobs(prev => prev.filter(j => j.id !== job.id));
          setLogs(prev => [...prev, ...inserted.map(e => ({ ...e, image_url: null }))]);
          setSourceImages(prev => {
            const exists = prev.find(s => s.url === thumbnailUrl);
            if (exists) return prev;
            return [...prev, { url: thumbnailUrl, mealType: photo.mealType, foodIds: inserted.map(e => e.id) }];
          });
          showToast(`${inserted.length} food${inserted.length > 1 ? 's' : ''} logged from photo ✓`);
        } catch (err) {
          console.error('Photo processing error:', err);
          await deleteProcessingJob(job.id);
          setProcessingJobs(prev => prev.filter(j => j.id !== job.id));
          showToast('Failed to analyze photo — try again');
        }

        URL.revokeObjectURL(photo.processedImage.thumbnailUrl);
      })();
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

        {/* Photo tray */}
        {(sourceImages.length > 0 || processingJobs.length > 0) && (
          <div className="mb-3">
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
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
                  <div className="w-14 h-14 rounded-xl overflow-hidden">
                    <img src={img.url} alt="Food photo" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-medium text-text-tertiary capitalize">{img.mealType}</span>
                </motion.button>
              ))}
              {processingJobs.map(job => (
                <div key={job.id} className="flex-shrink-0 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-14 h-14 rounded-xl overflow-hidden relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img src={job.image_url} alt="Processing" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <RefreshCw size={16} className="text-white" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-medium text-text-tertiary capitalize">{job.meal_type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
            const mealJobs = processingJobs.filter(j => j.meal_type === type);
            const mealCalories = entries.reduce((sum, e) => sum + (e.status === 'confirmed' ? (e.calories ?? 0) : 0), 0);
            const loggedNames = new Set(entries.map(e => e.food_name));
            const mealSuggestions = showSuggestions && !dismissedMeals.has(`${formatDate(selectedDate)}:${type}`)
              ? allSuggestions.filter(s => s.meal_type === type && !loggedNames.has(s.food_name))
              : [];
            const hasContent = entries.length > 0 || mealSuggestions.length > 0 || mealJobs.length > 0;

            if (!hasContent) return null;

            return (
              <div key={type} className="mb-3">
                {/* Grouped meal card */}
                {(entries.length > 0 || mealJobs.length > 0) && (
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
                    {/* Processing job cards */}
                    {mealJobs.map(job => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {(entries.length > 0) && <div className="h-px bg-bg-tertiary mx-3.5" />}
                        <div className="p-3 px-3.5 flex items-center gap-3">
                          <div className="w-11 h-11 rounded-[10px] overflow-hidden flex-shrink-0 relative">
                            <img src={job.image_url} alt="Analyzing" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              >
                                <RefreshCw size={12} className="text-white" />
                              </motion.div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <span className="text-[14px] font-medium text-text-secondary">Identifying foods...</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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

                {/* Suggestions-only card when no logged entries and no processing jobs */}
                {entries.length === 0 && mealJobs.length === 0 && mealSuggestions.length > 0 && (
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
        onPhotosSubmitted={handlePhotosSubmitted}
      />

      {/* Photo detail view */}
      <AnimatePresence>
        {expandedPhoto && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex flex-col"
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
              <motion.button
                className="text-[14px] font-medium text-red-400 bg-transparent border-none cursor-pointer px-2 py-1"
                onClick={async () => {
                  const photo = expandedPhoto;
                  setExpandedPhoto(null);
                  for (const id of photo.foodIds) {
                    await deleteFoodLog(id);
                  }
                  setLogs(prev => prev.filter(l => !photo.foodIds.includes(l.id)));
                  setSourceImages(prev => prev.filter(s => s.url !== photo.url));
                  showToast(`Photo and ${photo.foodIds.length} food${photo.foodIds.length > 1 ? 's' : ''} deleted`);
                }}
                whileTap={{ scale: 0.95 }}
              >
                Delete All
              </motion.button>
            </div>

            {/* Photo */}
            <div className="px-4 pb-3">
              <motion.img
                src={expandedPhoto.url}
                alt="Food photo"
                className="w-full rounded-xl object-contain max-h-[40vh]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              />
            </div>

            {/* Food list */}
            <div className="flex-1 overflow-y-auto px-4 pb-[max(env(safe-area-inset-bottom),16px)]">
              <div className="text-white/50 text-[12px] font-medium uppercase tracking-wide mb-2">
                Identified foods ({expandedPhoto.foodIds.length})
              </div>
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                {expandedPhoto.foodIds.map((foodId, idx) => {
                  const entry = logs.find(l => l.id === foodId);
                  if (!entry) return null;
                  const unitLabel = entry.unit === 'ml' ? 'ml' : 'g';
                  return (
                    <div key={foodId}>
                      {idx > 0 && <div className="h-px bg-white/10 mx-3.5" />}
                      <div className="p-3 px-3.5 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-medium text-white leading-snug">{entry.food_name}</div>
                          <div className="flex items-baseline justify-between gap-2 mt-px text-[13px] text-white/50">
                            <span>{entry.quantity_g}{unitLabel} &middot; {entry.calories} cal</span>
                            <span>P:{entry.protein} C:{entry.carbs} F:{entry.fat} Fi:{entry.fibre}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <motion.button
                            className="w-8 h-8 rounded-lg bg-white/10 border-none flex items-center justify-center cursor-pointer"
                            onClick={() => { setExpandedPhoto(null); setEditingEntry(entry); }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                            </svg>
                          </motion.button>
                          <motion.button
                            className="w-8 h-8 rounded-lg bg-white/10 border-none flex items-center justify-center cursor-pointer"
                            onClick={async () => {
                              await deleteFoodLog(foodId);
                              setLogs(prev => prev.filter(l => l.id !== foodId));
                              setExpandedPhoto(prev => {
                                if (!prev) return null;
                                const newIds = prev.foodIds.filter(id => id !== foodId);
                                if (newIds.length === 0) return null;
                                return { ...prev, foodIds: newIds };
                              });
                              setSourceImages(prev => prev.map(s =>
                                s.url === expandedPhoto.url ? { ...s, foodIds: s.foodIds.filter(id => id !== foodId) } : s
                              ).filter(s => s.foodIds.length > 0));
                              showToast(`${entry.food_name} deleted`);
                            }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </motion.button>
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
