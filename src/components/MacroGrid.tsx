'use client';

import { motion } from 'framer-motion';
import { Drumstick, Wheat, Droplet, Leaf } from 'lucide-react';

interface MacroProps {
  protein: number;
  proteinTarget: number;
  carbs: number;
  carbsTarget: number;
  fat: number;
  fatTarget: number;
  fibre: number;
  fibreTarget: number;
  calorieRatio: number;
}

function getBarColor(value: number, target: number, colorsActive: boolean): string {
  if (!colorsActive) return 'var(--color-light-blue)';
  const ratio = value / target;
  if (ratio < 0.8 || ratio > 1.1) return 'var(--color-destructive)';
  if (ratio < 0.9) return 'var(--color-warning)';
  return 'var(--color-accent)';
}

export default function MacroGrid({ protein, proteinTarget, carbs, carbsTarget, fat, fatTarget, fibre, fibreTarget, calorieRatio }: MacroProps) {
  const colorsActive = calorieRatio >= 0.8;

  const macros = [
    { key: 'protein', label: 'Protein', icon: Drumstick, value: protein, target: proteinTarget },
    { key: 'carbs', label: 'Carbs', icon: Wheat, value: carbs, target: carbsTarget },
    { key: 'fat', label: 'Fat', icon: Droplet, value: fat, target: fatTarget },
    { key: 'fibre', label: 'Fibre', icon: Leaf, value: fibre, target: fibreTarget },
  ];

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
            <span className="text-xs text-text-tertiary">{Math.round(macro.value)}g / {macro.target}g</span>
          </div>
        );
      })}
    </div>
  );
}
