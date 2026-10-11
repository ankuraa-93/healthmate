'use client';

import { motion } from 'framer-motion';

interface HomeHeaderProps {
  selectedDate: Date;
  avatarUrl: string | null;
  displayName: string | null;
  email: string | null;
  /** Opens Account — the header is the only entry point to it. */
  onProfilePress: () => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function initial(name: string | null, email: string | null): string {
  return (name?.trim() || email || '?')[0].toUpperCase();
}

// Both ends line up with WeekStrip's outer columns. The day row is
// `absolute inset-0 px-2` (so only 8px of padding) with justify-around over
// seven 36px cells, putting Monday's centre at 26px + (appWidth − 268px) / 14
// from the left, and Sunday's mirrored from the right (rings are 36px wide).
export default function HomeHeader({ selectedDate, avatarUrl, displayName, email, onProfilePress }: HomeHeaderProps) {
  const monthYear = `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  return (
    <div className="flex items-center justify-between px-4 mt-1 h-10">
      {/* Left: month + year, left edge flush with Monday's ring */}
      <span className="ml-[calc((min(100vw,428px)_-_380px)_/_14)] text-[19px] font-medium text-text-secondary leading-none">
        {monthYear}
      </span>

      {/* Right: profile → Account, 32px DP centred over Sunday */}
      <motion.button
        aria-label="Account"
        className="mr-[calc((min(100vw,428px)_-_352px)_/_14)] flex bg-transparent border-none p-0 cursor-pointer rounded-full"
        onClick={onProfilePress}
        whileTap={{ scale: 0.96 }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        ) : (
          <span className="w-8 h-8 rounded-full bg-accent/15 text-accent text-[13px] font-semibold flex items-center justify-center flex-shrink-0">
            {initial(displayName, email)}
          </span>
        )}
      </motion.button>
    </div>
  );
}
