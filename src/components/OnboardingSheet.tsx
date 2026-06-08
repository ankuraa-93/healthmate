'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, AlertTriangle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function OnboardingSheet({ onClose }: Props) {
  const [confirmSkip, setConfirmSkip] = useState(false);
  const router = useRouter();

  const handlePersonalise = () => {
    onClose();
    router.push('/onboarding?mode=personalize');
  };

  return (
    <>
      <motion.div
        className="absolute inset-0 bg-black/30 z-20"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => { if (!confirmSkip) onClose(); }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-bg-primary rounded-t-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-30"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="pt-2.5 pb-1">
          <div className="w-9 h-1 bg-bg-tertiary rounded-full mx-auto" />
        </div>

        <div className="px-5 pb-[max(20px,env(safe-area-inset-bottom))]">
          <div className="flex justify-end mb-1">
            <motion.button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-bg-secondary border-none flex items-center justify-center text-text-secondary cursor-pointer"
              whileTap={{ scale: 0.9 }}
              aria-label="Close"
            >
              <X size={18} />
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {!confirmSkip ? (
              <motion.div
                key="pitch"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-3">
                  <Sparkles size={28} className="text-accent" />
                </div>
                <h2 className="text-[20px] font-semibold mb-2">Set your daily goals</h2>
                <p className="text-[14px] text-text-secondary leading-relaxed mb-6 mx-2">
                  Everyone&apos;s calorie and nutrition needs are different. Answer a few quick questions and we&apos;ll calculate goals tailored to your body and activity level.
                </p>

                <button
                  onClick={handlePersonalise}
                  className="w-full bg-accent text-white rounded-xl h-[50px] text-[17px] font-medium border-none cursor-pointer mb-3"
                >
                  Personalise my goals
                </button>
                <button
                  onClick={() => setConfirmSkip(true)}
                  className="w-full text-[14px] text-text-secondary bg-transparent border-none cursor-pointer py-2 mb-1"
                >
                  Skip for now
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <div className="flex items-start gap-3 bg-[#FFF4E6] rounded-xl p-3.5 mb-5">
                  <AlertTriangle size={18} className="text-[#E8890C] flex-shrink-0 mt-0.5" />
                  <p className="text-[13px] text-text-secondary leading-relaxed">
                    Your goals will be set to a generic 2000 cal target that doesn&apos;t account for your body, activity, or weight goals. You can always personalise later from Settings.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-bg-secondary text-text-primary rounded-xl h-[50px] text-[17px] font-medium border-none cursor-pointer mb-3"
                >
                  Use default goals
                </button>
                <button
                  onClick={() => setConfirmSkip(false)}
                  className="w-full text-[14px] text-accent bg-transparent border-none cursor-pointer py-2 mb-1 underline decoration-dashed decoration-accent/40 underline-offset-[3px]"
                >
                  Go back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
