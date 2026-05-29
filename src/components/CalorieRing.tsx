'use client';

import { motion } from 'framer-motion';

interface CalorieRingProps {
  consumed: number;
  target: number;
}

function getColor(ratio: number, colorsActive: boolean): string {
  if (!colorsActive) return 'var(--color-light-blue)';
  if (ratio < 0.8 || ratio > 1.1) return 'var(--color-destructive)';
  if (ratio < 0.9) return 'var(--color-warning)';
  return 'var(--color-accent)';
}

export default function CalorieRing({ consumed, target }: CalorieRingProps) {
  const ratio = consumed / target;
  const circumference = 2 * Math.PI * 65;
  const offset = circumference * (1 - Math.min(ratio, 1));
  const colorsActive = ratio >= 0.8;
  const color = getColor(ratio, colorsActive);

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="relative w-[150px] h-[150px]">
        <svg className="w-[150px] h-[150px] -rotate-90" viewBox="0 0 150 150">
          <circle
            cx="75" cy="75" r="65"
            fill="none" stroke="var(--color-bg-tertiary)" strokeWidth="12"
          />
          <motion.circle
            cx="75" cy="75" r="65"
            fill="none" strokeWidth="12" strokeLinecap="round"
            stroke={color}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[30px] font-semibold tracking-tight flex items-center gap-1">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {consumed}
            </motion.span>
            <svg width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </span>
          <span className="text-[13px] text-text-secondary mt-0.5">
            of {target} cal
          </span>
        </div>
      </div>
    </div>
  );
}
