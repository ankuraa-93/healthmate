'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown } from 'lucide-react';
import { SuggestedFood } from '@/lib/supabase-data';

const MAX_VISIBLE = 3;

interface SuggestedFoodsProps {
  items: SuggestedFood[];
  onAdd: (item: SuggestedFood) => void;
  onDismiss: () => void;
  embedded?: boolean;
}

export default function SuggestedFoods({ items, onAdd, onDismiss, embedded }: SuggestedFoodsProps) {
  const [expanded, setExpanded] = useState(false);
  if (items.length === 0) return null;

  const hasMore = items.length > MAX_VISIBLE;
  const visible = expanded ? items : items.slice(0, MAX_VISIBLE);

  return (
    <motion.div
      className={embedded
        ? "bg-accent/[0.04] p-2.5"
        : "rounded-xl bg-accent/[0.04] border border-accent/10 p-2.5 mb-2"
      }
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0, overflow: 'hidden', transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
      layout
    >
      <div className="flex items-center gap-2 mb-1.5 px-1">
        <span className="text-[11px] font-medium text-accent/70 uppercase tracking-wide">Suggested</span>
        <span className="text-[10px] text-text-tertiary">·</span>
        <motion.button
          className="bg-transparent border-none cursor-pointer text-[11px] text-text-tertiary hover:text-text-secondary transition-colors p-0"
          onClick={onDismiss}
          whileTap={{ scale: 0.95 }}
        >
          Hide
        </motion.button>
      </div>
      <div className="flex flex-col gap-1">
        <AnimatePresence initial={false}>
        {visible.map((item, i) => {
          const unitLabel = item.unit === 'ml' ? 'ml' : 'g';
          return (
            <motion.div
              key={item.food_name}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 cursor-pointer hover:bg-accent/[0.06] active:bg-accent/10 transition-colors"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, delay: i >= MAX_VISIBLE ? (i - MAX_VISIBLE) * 0.03 : 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAdd(item)}
            >
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-medium text-text-primary">{item.food_name}</span>
                <span className="text-[12px] text-text-tertiary ml-1.5">{item.quantity_g}{unitLabel}</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Plus size={13} className="text-accent" />
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>
        {hasMore && !expanded && (
          <motion.button
            className="flex items-center justify-center gap-1 py-1.5 bg-transparent border-none cursor-pointer text-[12px] font-medium text-accent/70 hover:text-accent transition-colors"
            onClick={() => setExpanded(true)}
            whileTap={{ scale: 0.97 }}
          >
            {items.length - MAX_VISIBLE} more
            <ChevronDown size={12} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
