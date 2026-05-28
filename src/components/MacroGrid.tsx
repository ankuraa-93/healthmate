'use client';

import { motion } from 'framer-motion';
import { Drumstick, Wheat, Droplet, Leaf } from 'lucide-react';

interface MacroProps {
  calorieRatio: number;
}

const macros = [
  { key: 'protein', label: 'Protein', icon: Drumstick, color: 'var(--color-protein)', value: 45, target: 120 },
  { key: 'carbs', label: 'Carbs', icon: Wheat, color: 'var(--color-carbs)', value: 82, target: 250 },
  { key: 'fat', label: 'Fat', icon: Droplet, color: 'var(--color-fat)', value: 18, target: 65 },
  { key: 'fibre', label: 'Fibre', icon: Leaf, color: 'var(--color-fibre)', value: 8, target: 30 },
];

function getBarColor(value: number, target: number, colorsActive: boolean): string {
  if (!colorsActive) return 'var(--color-light-blue)';
  const ratio = value / target;
  if (ratio < 0.8 || ratio > 1.1) return 'var(--color-destructive)';
  if (ratio < 0.9) return 'var(--color-warning)';
  return 'var(--color-accent)';
}

export default function MacroGrid({ calorieRatio }: MacroProps) {
  const colorsActive = calorieRatio >= 0.8;

  return (
    <div className="grid grid-cols-2 gap-3 gap-x-4 flex-1">
      {macros.map((macro, i) => {
        const pct = Math.min((macro.value / macro.target) * 100, 100);
        const barColor = getBarColor(macro.value, macro.target, colorsActive);
        return (
          <div key={macro.key} className="flex flex-col gap-1">
            <span className="text-[13px] font-bold text-text-primary flex items-center gap-1">
              {macro.label}
              <macro.icon size={14} className="text-text-secondary" />
            </span>
            <div className="w-[80%] h-[5px] bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: barColor }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
            <span className="text-xs text-text-tertiary">{macro.value}g / {macro.target}g</span>
          </div>
        );
      })}
    </div>
  );
}
