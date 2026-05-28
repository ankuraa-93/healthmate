'use client';

import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      className="absolute bottom-[100px] right-6 w-14 h-14 bg-accent border-none rounded-full flex items-center justify-center text-white shadow-[0_2px_8px_rgba(52,199,89,0.3)] cursor-pointer z-[9]"
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.4 }}
    >
      <Plus size={24} />
    </motion.button>
  );
}
