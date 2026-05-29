'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  visible: boolean;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export default function Toast({ message, visible, action }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-10 left-1/2 bg-text-primary text-white px-5 py-3 rounded-lg text-[15px] font-medium whitespace-nowrap z-50 flex items-center gap-3"
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: 0.2 }}
        >
          {message}
          {action && (
            <button
              onClick={action.onPress}
              className="text-accent font-medium bg-transparent border-none cursor-pointer text-[15px]"
            >
              {action.label}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
