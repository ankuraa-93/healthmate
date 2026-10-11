'use client';

import { Share, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionBarProps {
  isToday: boolean;
  onToday: () => void;
  onShare: () => void;
  onAdd: () => void;
}

const GLASS_PILL = 'rounded-full bg-white/60 border border-white/70 backdrop-blur-md backdrop-saturate-[1.8] shadow-[0_8px_24px_rgba(0,0,0,0.10),inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.04)]';

// Floating "liquid glass" bottom bar for Home: "Today" pill bottom-left, action
// pill (Share, Log Food) bottom-right. Absolutely positioned inside the page's
// `absolute inset-0` container so content scrolls underneath — the page must
// leave ~96px bottom padding.
export default function ActionBar({ isToday, onToday, onShare, onAdd }: ActionBarProps) {
  return (
    <div
      className="absolute left-6 right-6 bottom-[max(24px,calc(env(safe-area-inset-bottom)+12px))] z-10 flex items-center justify-between pointer-events-none"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Only shown off-today; pops in/out like a bubble */}
      <AnimatePresence>
        {!isToday && (
          <motion.button
            key="today"
            onClick={onToday}
            className={`pointer-events-auto h-12 px-6 flex items-center justify-center text-[15px] leading-none font-semibold text-text-primary cursor-pointer origin-center ${GLASS_PILL}`}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 520, damping: 16, mass: 0.8 } }}
            exit={{ scale: [1, 1.12, 0.2], opacity: [1, 1, 0], transition: { duration: 0.22, times: [0, 0.35, 1], ease: 'easeIn' } }}
            whileTap={{ scale: 0.92 }}
          >
            Today
          </motion.button>
        )}
      </AnimatePresence>

      <div className={`pointer-events-auto ml-auto flex items-center gap-1 p-1 ${GLASS_PILL}`}>
        <motion.button
          aria-label="Share"
          className="w-14 h-[38px] rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer text-text-primary"
          onClick={onShare}
          whileTap={{ scale: 0.9 }}
        >
          <Share size={20} />
        </motion.button>
        <motion.button
          aria-label="Log food"
          className="w-14 h-[38px] rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer text-accent"
          onClick={onAdd}
          whileTap={{ scale: 0.9 }}
        >
          <Plus size={24} strokeWidth={2.25} />
        </motion.button>
      </div>
    </div>
  );
}
