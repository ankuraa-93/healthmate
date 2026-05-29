'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import FoodCard from '@/components/FoodCard';
import FAB from '@/components/FAB';
import AddFoodSheet from '@/components/AddFoodSheet';
import Toast from '@/components/Toast';
import { useAuth } from '@/components/AuthProvider';
import { mockTodayLogs } from '@/lib/mock-data';

const daysWithLogs = [3, 7, 8, 12, 14, 15, 19, 21, 22, 25, 26];

export default function HistoryPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const logsForDay = selectedDay && daysWithLogs.includes(selectedDay) ? mockTodayLogs : [];

  return (
    <div className="absolute inset-0 overflow-y-auto scrollbar-none">
      <div className="px-4 pb-[120px]">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center pt-14 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-[22px] font-semibold">History</span>
        </motion.div>

        {/* Calendar */}
        <motion.div
          className="bg-bg-secondary rounded-2xl p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Month nav */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="bg-transparent border-none cursor-pointer text-text-secondary p-1">
              <ChevronLeft size={20} />
            </button>
            <span className="text-base font-semibold">{monthName}</span>
            <button onClick={nextMonth} className="bg-transparent border-none cursor-pointer text-text-secondary p-1">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center text-xs font-medium text-text-tertiary py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasLog = daysWithLogs.includes(day);
              const isSelected = day === selectedDay;
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              return (
                <motion.button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex flex-col items-center justify-center py-2 rounded-xl border-none cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-accent text-white'
                      : isToday
                        ? 'bg-accent/10 text-text-primary'
                        : 'bg-transparent text-text-primary'
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-sm font-medium">{day}</span>
                  {hasLog && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Entries for selected day */}
        {selectedDay && (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {logsForDay.length > 0 ? (
              <>
                <div className="text-sm font-medium text-text-secondary mb-3">
                  {currentDate.toLocaleDateString('en-US', { month: 'long' })} {selectedDay}
                </div>
                {logsForDay.map((entry, i) => (
                  <FoodCard key={entry.id} entry={entry} index={i} />
                ))}
              </>
            ) : (
              <div className="text-center text-text-tertiary py-8 text-sm">
                No entries for this day
              </div>
            )}
          </motion.div>
        )}
      </div>

      <FAB onClick={() => setSheetOpen(true)} />
      <BottomNav />

      <AddFoodSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setToast({ visible: true, message: 'Food logged ✓' });
          setTimeout(() => setToast({ visible: false, message: '' }), 2000);
        }}
        userId={user?.id ?? ''}
        logDate={selectedDay ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : new Date().toISOString().split('T')[0]}
      />
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
