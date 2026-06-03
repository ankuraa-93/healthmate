'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mic, Camera } from 'lucide-react';

interface GuestWelcomeProps {
  open: boolean;
  onClose: () => void;
}

// Short, one-time bottom sheet shown when a visitor enters as a guest. Its job
// isn't to apologise for the demo data (that's self-evident) — it's to point
// them at the voice + photo logging that the dashboard alone doesn't reveal.
export default function GuestWelcome({ open, onClose }: GuestWelcomeProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-bg-primary rounded-t-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 px-6 pb-7"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="pt-2.5 pb-1">
              <div className="w-9 h-1 bg-bg-tertiary rounded-full mx-auto" />
            </div>

            <div className="text-center pt-4">
              <span className="text-4xl" role="img" aria-label="waving hand">👋</span>
              <h2 className="text-xl font-semibold mt-3">Hi there!</h2>
              <div className="text-text-secondary text-[15px] leading-relaxed mt-2 space-y-3">
                <p>
                  To experience the magic, tap{' '}
                  <span className="inline-flex items-center justify-center w-[18px] h-[18px] bg-accent rounded-full text-white align-middle mx-0.5 shadow-[0_1px_3px_rgba(52,199,89,0.4)]">
                    <Plus size={12} strokeWidth={3} />
                  </span>{' '}
                  icon &amp; log a meal using{' '}
                  <span className="inline-flex items-center gap-1 align-middle whitespace-nowrap">
                    <Mic size={14} className="text-text-tertiary" />voice
                  </span>{' '}
                  or{' '}
                  <span className="inline-flex items-center gap-1 align-middle whitespace-nowrap">
                    <Camera size={14} className="text-text-tertiary" />image
                  </span>!
                </p>
                <p>
                  Also, all data is dummy, so feel free to play around!
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              className="w-full bg-accent text-white border-none rounded-xl py-3.5 text-base font-medium cursor-pointer mt-6"
              whileTap={{ scale: 0.97 }}
            >
              Got it
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
