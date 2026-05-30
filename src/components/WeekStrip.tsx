'use client';

import { useRef, useState, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WeekStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  weeklyCalories: Record<string, number>;
  calorieTarget: number;
}

function getWeekDays(date: Date): Date[] {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const wd = new Date(monday);
    wd.setDate(monday.getDate() + i);
    return wd;
  });
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const slideVariants = {
  enter: (d: number) => ({ x: `${(d || 1) * 100}%` }),
  center: { x: 0 },
  exit: (d: number) => ({ x: `${(d || 1) * -100}%` }),
};

export default function WeekStrip({ selectedDate, onSelectDate, weeklyCalories, calorieTarget }: WeekStripProps) {
  const days = getWeekDays(selectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const touchStartX = useRef(0);
  const didSwipe = useRef(false);

  const weekKey = formatDateKey(days[0]);
  const [weekState, setWeekState] = useState({ key: weekKey, direction: 0 });

  if (weekState.key !== weekKey) {
    setWeekState({ key: weekKey, direction: weekKey > weekState.key ? 1 : -1 });
  }

  const months = days.map(d => d.toLocaleDateString('en-US', { month: 'short' }));
  const uniqueMonths = [...new Set(months)];
  const year = days[3].getFullYear();
  const monthLabel = uniqueMonths.length > 1
    ? `${uniqueMonths[0]} – ${uniqueMonths[1]} ${year}`
    : `${uniqueMonths[0]} ${year}`;

  const ringSize = 36;
  const r = 14;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * r;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    didSwipe.current = false;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      didSwipe.current = true;
      const next = new Date(selectedDate);
      if (deltaX < 0) {
        next.setDate(next.getDate() + 7);
        setWeekState({ key: formatDateKey(getWeekDays(next)[0]), direction: 1 });
      } else {
        next.setDate(next.getDate() - 7);
        setWeekState({ key: formatDateKey(getWeekDays(next)[0]), direction: -1 });
      }
      onSelectDate(next);
    }
  };

  return (
    <motion.div
      className="pb-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-2">
        <span className="text-[13px] font-medium text-text-secondary">{monthLabel}</span>
      </div>
      <div
        className="relative overflow-hidden px-2"
        style={{ height: 58 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={weekState.direction}>
          <motion.div
            key={weekKey}
            custom={weekState.direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex justify-around items-center px-2"
          >
            {days.map((day, i) => {
              const key = formatDateKey(day);
              const isSelected = day.toDateString() === selectedDate.toDateString();
              const isToday = day.toDateString() === today.toDateString();
              const calories = weeklyCalories[key] ?? 0;
              const ratio = calorieTarget > 0 ? calories / calorieTarget : 0;

              let ringColor = 'var(--color-bg-tertiary)';
              if (calories > 0) {
                if (ratio < 0.75) ringColor = 'var(--color-light-green)';
                else if (ratio < 0.9) ringColor = 'var(--color-warning)';
                else if (ratio <= 1.1) ringColor = 'var(--color-accent)';
                else ringColor = 'var(--color-destructive)';
              }

              const offset = circumference * (1 - Math.min(ratio, 1));

              return (
                <button
                  key={key}
                  className="flex flex-col items-center gap-1 border-none bg-transparent cursor-pointer p-0"
                  onClick={() => {
                    if (!didSwipe.current) onSelectDate(new Date(day));
                  }}
                >
                  <span className={`text-[11px] leading-none font-medium ${isSelected ? 'text-accent' : 'text-text-tertiary'}`}>
                    {DAY_LABELS[i]}
                  </span>
                  <div className="relative" style={{ width: ringSize, height: ringSize }}>
                    {isSelected ? (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-accent flex items-center justify-center"
                        layoutId="weekday-selected"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      >
                        <span className="text-[14px] leading-none font-semibold text-white" style={{ paddingTop: 1 }}>{day.getDate()}</span>
                      </motion.div>
                    ) : (
                      <>
                        <svg width={ringSize} height={ringSize} className="-rotate-90">
                          <circle
                            cx={ringSize / 2} cy={ringSize / 2} r={r}
                            fill="none"
                            stroke="var(--color-bg-tertiary)"
                            strokeWidth={strokeWidth}
                          />
                          {calories > 0 && (
                            <motion.circle
                              cx={ringSize / 2} cy={ringSize / 2} r={r}
                              fill="none"
                              stroke={ringColor}
                              strokeWidth={strokeWidth}
                              strokeLinecap="round"
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset: offset }}
                              transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                            />
                          )}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className={`text-[13px] leading-none ${isToday ? 'font-semibold text-text-primary' : 'font-medium text-text-secondary'}`}
                            style={{ paddingTop: 1 }}
                          >
                            {day.getDate()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
