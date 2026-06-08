'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

/**
 * "Personalise" nudge shown while a user is still on the untouched default
 * goals. Renders just the row (message + CTA); the caller supplies container
 * styling via `className` (a standalone pill on the dashboard, an edge-to-edge
 * band joined to the Daily Goals card in Settings).
 */
export default function DefaultGoalsSuggestion({ href, className = '' }: { href: string; className?: string }) {
  const router = useRouter();
  return (
    <motion.div
      className={`flex items-center justify-between gap-3 ${className}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <span className="text-[13px] text-text-secondary">You&apos;re currently on default goals</span>
      <button
        onClick={() => router.push(href)}
        className="text-[13px] font-medium text-accent underline decoration-dashed decoration-accent/40 underline-offset-[3px] bg-transparent border-none cursor-pointer flex-shrink-0 whitespace-nowrap"
      >
        Personalise now
      </button>
    </motion.div>
  );
}
