'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import CalorieRing from '@/components/CalorieRing';
import MacroGrid from '@/components/MacroGrid';
import FoodCard from '@/components/FoodCard';
import FAB from '@/components/FAB';
import AddFoodSheet from '@/components/AddFoodSheet';
import EditFoodSheet from '@/components/EditFoodSheet';
import Toast from '@/components/Toast';
import { useAuth } from '@/components/AuthProvider';
import { fetchFoodLogs, fetchProfile, updateFoodLog, deleteFoodLog, fetchFrequentFoods } from '@/lib/supabase-data';
import { FoodLogEntry, Profile } from '@/lib/types';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
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
  const [frequentFoods, setFrequentFoods] = useState<{ food_name: string; quantity_g: number; calories: number; protein: number; carbs: number; fat: number; fibre: number; unit: string; food_library_id: string | null; count: number }[]>([]);
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

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then(p => { if (p) setProfile(p); });
    fetchFrequentFoods(user.id, 9).then(setFrequentFoods);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchFoodLogs(user.id, formatDate(selectedDate)).then(setLogs);
  }, [user, selectedDate]);

  const refreshLogs = useCallback(() => {
    if (!user) return;
    fetchFoodLogs(user.id, formatDate(selectedDate)).then(setLogs);
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
    if (user) fetchFrequentFoods(user.id, 9).then(setFrequentFoods);
  }, [refreshLogs, user]);

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = selectedDate.toDateString() === today.toDateString();
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
      <div className="flex-1 overflow-y-auto scrollbar-none">
      <div className="px-4 pb-6">
        {/* Header — centered date pill */}
        <motion.div
          className="flex justify-center items-center pt-14 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            className="relative inline-flex items-center gap-1.5 bg-bg-secondary rounded-full px-3.5 py-2 cursor-pointer border-none"
            onClick={() => datePickerRef.current?.showPicker()}
          >
            <Calendar size={16} className="text-text-secondary" />
            <span className="text-[17px] font-semibold text-text-primary">{dateStr}</span>
            <input
              ref={datePickerRef}
              type="date"
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              onChange={handleDatePick}
            />
          </button>
        </motion.div>

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
          <span className="text-xl font-semibold">Meals</span>
        </motion.div>

        {(() => {
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
              entries: logs.filter(l => l.meal_type === type),
            }))
            .filter(g => g.entries.length > 0);

          if (grouped.length === 0) {
            return (
              <motion.div
                className="text-center py-12 text-text-tertiary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-[15px]">No meals logged yet</p>
                <p className="text-[13px] mt-1">Tap + to add your first meal</p>
              </motion.div>
            );
          }

          let cardIndex = 0;
          return grouped.map((group) => (
            <div key={group.type} className="mb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[12px] font-medium text-text-tertiary uppercase tracking-wide">{group.label}</span>
                <div className="flex-1 h-px bg-bg-tertiary" />
              </div>
              {group.entries.map((entry) => {
                const idx = cardIndex++;
                return (
                  <FoodCard
                    key={entry.id}
                    entry={entry}
                    index={idx}
                    onClick={entry.status === 'confirmed' ? () => setEditingEntry(entry) : undefined}
                  />
                );
              })}
            </div>
          ));
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
        frequentFoods={frequentFoods}
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
