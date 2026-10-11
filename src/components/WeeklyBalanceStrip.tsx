'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface WeeklyBalanceStripProps {
  /** Logged calories per date (YYYY-MM-DD) for the week shown in WeekStrip. */
  weeklyCalories: Record<string, number>;
  /** Maintenance calories (TDEE) per day; null hides the strip. */
  maintenance: number | null;
  /** False when browsing a past week — copy says "that week" instead. */
  isCurrentWeek: boolean;
}

const DEFICIT_THRESHOLD = -1000;
const SURPLUS_THRESHOLD = 0;

const STYLES = {
  deficit: 'bg-[#34C759]/[0.14] text-[#1E7B34]',
  maintenance: 'bg-[#FF9500]/[0.14] text-[#8A4B00]',
  surplus: 'bg-[#FF3B30]/[0.12] text-[#B42318]',
} as const;

function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Extension of WeekStrip: net calories vs maintenance across the completed
// days of the week that have logs. Unlogged days are ignored, and so is today
// (it's only partly logged, which would read as a big deficit every morning).
export default function WeeklyBalanceStrip({ weeklyCalories, maintenance, isCurrentWeek }: WeeklyBalanceStripProps) {
  const todayKey = localDateKey(new Date());
  const loggedDays = Object.entries(weeklyCalories)
    .filter(([date, c]) => date !== todayKey && c > 0)
    .map(([, c]) => c);
  const show = maintenance != null && maintenance > 0 && loggedDays.length > 0;

  const logged = loggedDays.reduce((sum, c) => sum + c, 0);
  const net = show ? Math.round(logged - maintenance * loggedDays.length) : 0;
  const week = isCurrentWeek ? 'this week' : 'that week';

  const kind = net < DEFICIT_THRESHOLD ? 'deficit' : net > SURPLUS_THRESHOLD ? 'surplus' : 'maintenance';
  const emoji = kind === 'deficit' ? '🔥' : kind === 'surplus' ? '😞' : '😶';
  // Thresholds use the exact value; the copy shows it to the nearest 100
  // (min 100, so a small surplus never reads "0 calories surplus").
  const shown = Math.max(100, Math.round(Math.abs(net) / 100) * 100);
  const text =
    kind === 'deficit' ? `${shown} calories deficit ${week}!`
    : kind === 'surplus' ? `${shown} calories surplus ${week}`
    : `No deficit or surplus ${week}`;

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="weekly-balance"
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={`py-2 px-4 text-center text-[12px] font-medium leading-none transition-colors duration-300 ${STYLES[kind]}`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={text}
                className="inline-block"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <span className="mr-1.5">{emoji}</span>{text}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
