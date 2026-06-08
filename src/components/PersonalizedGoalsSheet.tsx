'use client';

import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drumstick, Wheat, Droplet, Leaf, X, ChevronDown, Loader2, Zap } from 'lucide-react';
import { macrosForCalories, KCAL_PER_KG_BODYWEIGHT, CALORIE_GOAL_FLOOR, type Estimate } from '@/lib/goals';

interface Props {
  estimate: Estimate;
  weightKg: number;
  calorieGoal: number | '';
  setCalorieGoal: Dispatch<SetStateAction<number | ''>>;
  saving: boolean;
  saveLabel: string;
  onClose: () => void;
  onEditDetails: () => void;
  onSave: () => void;
}

// TDEE component breakdown:
// Resting (BMR) — organ function at complete rest
// Non-exercise (TEF + NEAT) — food digestion + daily movement (sedentary baseline above BMR)
// Exercise (EAT) — deliberate workout activity (everything above sedentary factor 1.2)
const SEDENTARY_FACTOR = 1.2;

function tdeeBreakdown(bmr: number, activityFactor: number) {
  const round50 = (n: number) => Math.round(n / 50) * 50;
  const resting = round50(bmr);
  const nonExercise = round50(bmr * (SEDENTARY_FACTOR - 1));
  const exercise = round50(bmr * Math.max(0, activityFactor - SEDENTARY_FACTOR));
  const total = resting + nonExercise + exercise;
  return { resting, nonExercise, exercise, total };
}

export default function PersonalizedGoalsSheet({
  estimate, weightKg, calorieGoal, setCalorieGoal, saving, saveLabel, onClose, onEditDetails, onSave,
}: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [canDrag, setCanDrag] = useState(true);
  const [calExpanded, setCalExpanded] = useState(false);

  const recommended = estimate.goals.calories;
  const calNum = calorieGoal === '' ? recommended : calorieGoal;
  const m = macrosForCalories({ calories: calNum, weight_kg: weightKg, does_resistance_training: estimate.does_resistance_training });
  const macros = [
    { label: 'Protein', value: m.protein, unit: 'g', Icon: Drumstick },
    { label: 'Carbs', value: m.carbs, unit: 'g', Icon: Wheat },
    { label: 'Fat', value: m.fat, unit: 'g', Icon: Droplet },
    { label: 'Fibre', value: m.fibre, unit: 'g', Icon: Leaf },
  ];

  const adjustCalories = (delta: number) =>
    setCalorieGoal((prev) => Math.min(9999, Math.max(CALORIE_GOAL_FLOOR, (prev === '' ? recommended : prev) + delta)));

  const maintenance = Math.round(estimate.tdee / 50) * 50;
  const breakdown = tdeeBreakdown(estimate.bmr, estimate.activity_factor);
  const diff = maintenance - calNum;
  const kgPerMonth = (Math.abs(diff) * 30) / KCAL_PER_KG_BODYWEIGHT;

  return (
    <>
      <motion.div
        className="absolute inset-0 bg-black/30 z-20"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-bg-primary rounded-t-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col max-h-[92dvh] z-30"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        drag="y"
        dragListener={canDrag}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => { if (info.offset.y > 120 || info.velocity.y > 600) onClose(); }}
      >
        <div className="pt-2.5 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing" onPointerDown={() => setCanDrag(true)}>
          <div className="w-9 h-1 bg-bg-tertiary rounded-full mx-auto" />
        </div>

        <div
          ref={bodyRef}
          onPointerDown={() => setCanDrag((bodyRef.current?.scrollTop ?? 0) <= 0)}
          className="flex-1 overflow-y-auto px-5 pt-1 pb-3 scrollbar-none"
        >
          {/* Close */}
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

          {/* Hero */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-3">
              <Zap size={28} className="text-accent" />
            </div>
            <h2 className="text-[22px] font-semibold mb-1">Your daily target</h2>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-[40px] font-bold tabular-nums leading-none text-accent">{calNum}</span>
              <span className="text-[16px] text-text-secondary font-medium">cal</span>
            </div>
            {diff !== 0 && (
              <p className="text-[13px] text-text-secondary mt-2">
                {diff > 0
                  ? `${diff} cal deficit · ${kgPerMonth.toFixed(1)} kg/mo loss`
                  : `${-diff} cal surplus · ${kgPerMonth.toFixed(1)} kg/mo gain`}
              </p>
            )}
          </div>

          {/* Maintenance breakdown */}
          <div className="bg-bg-secondary rounded-2xl px-4 pb-0 mb-3 overflow-hidden">
            <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-2">
              Maintenance · {maintenance} cal
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex bg-bg-tertiary mb-2">
              <div
                className="rounded-l-full"
                style={{ width: `${(breakdown.resting / breakdown.total) * 100}%`, backgroundColor: 'var(--color-accent)' }}
              />
              <div
                style={{ width: `${(breakdown.nonExercise / breakdown.total) * 100}%`, backgroundColor: 'var(--color-warning)' }}
              />
              <div
                className="rounded-r-full"
                style={{ width: `${(breakdown.exercise / breakdown.total) * 100}%`, backgroundColor: '#8B5CF6' }}
              />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-text-tertiary pb-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--color-accent)' }} />
                Resting {breakdown.resting}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--color-warning)' }} />
                Non-exercise {breakdown.nonExercise}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#8B5CF6' }} />
                Exercise {breakdown.exercise}
              </span>
            </div>
            <div className="flex items-center justify-between -mx-4 px-4 py-2.5 bg-[#FFF4E6] rounded-b-2xl border-t border-bg-tertiary">
              <span className="text-[13px] text-text-secondary">Based on your latest inputs</span>
              <button
                onClick={onEditDetails}
                className="text-[13px] font-medium text-accent underline decoration-dashed decoration-accent/40 underline-offset-[3px] bg-transparent border-none cursor-pointer flex-shrink-0"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Daily Goals — single card, 5 rows */}
          <div className="bg-bg-secondary rounded-2xl px-4 mb-4">
            <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-1">Daily goals</div>

            {/* Calories row — expandable */}
            <div>
              <button
                onClick={() => setCalExpanded(!calExpanded)}
                className="w-full flex items-center justify-between py-2.5 border-b border-bg-tertiary/60 bg-transparent border-x-0 border-t-0 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-text-secondary" />
                  <span className="text-[14px] text-text-primary">Calories</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-medium tabular-nums">{calNum} cal</span>
                  <motion.div animate={{ rotate: calExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-text-tertiary" />
                  </motion.div>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {calExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2 py-2.5 border-b border-bg-tertiary/60">
                      {[-100, -50, 50, 100].map((delta) => (
                        <button
                          key={delta}
                          onClick={() => adjustCalories(delta)}
                          className="flex-1 bg-bg-primary rounded-full py-1.5 text-[13px] font-medium text-text-secondary border-none cursor-pointer hover:bg-bg-tertiary transition-colors"
                        >
                          {delta > 0 ? `+${delta}` : `${delta}`}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Macro rows */}
            {macros.map((macro, i) => (
              <div
                key={macro.label}
                className={`flex items-center justify-between py-2.5 ${i < macros.length - 1 ? 'border-b border-bg-tertiary/60' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <macro.Icon size={14} className="text-text-secondary" />
                  <span className="text-[14px]">{macro.label}</span>
                </div>
                <span className="text-[14px] font-medium tabular-nums">{macro.value}{macro.unit}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Save (pinned) */}
        <div className="flex-shrink-0 px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] border-t border-bg-tertiary/50 bg-bg-primary">
          <button
            onClick={onSave}
            disabled={saving}
            className="w-full bg-accent text-white rounded-xl h-[50px] text-[17px] font-medium border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : saveLabel}
          </button>
        </div>
      </motion.div>
    </>
  );
}
