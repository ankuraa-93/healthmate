'use client';

import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Drumstick, Wheat, Droplet, Leaf, X, ChevronLeft, Loader2 } from 'lucide-react';
import { macrosForCalories, KCAL_PER_KG_BODYWEIGHT, CALORIE_GOAL_FLOOR, type Estimate } from '@/lib/goals';

const HEADING = 'text-xs font-medium text-text-secondary uppercase tracking-wide mb-2 block';

interface Props {
  estimate: Estimate;
  weightKg: number;
  calorieGoal: number | '';
  setCalorieGoal: Dispatch<SetStateAction<number | ''>>;
  saving: boolean;
  saveLabel: string;
  onClose: () => void;       // dismiss the sheet (X / backdrop / drag-down)
  onEditDetails: () => void; // reveal the input form to change inputs
  onSave: () => void;
}

// "Your personalized goals" as a bottom sheet (shares EditFoodSheet's shell).
// The editable calorie target lives in the parent so its save can read it.
export default function PersonalizedGoalsSheet({
  estimate, weightKg, calorieGoal, setCalorieGoal, saving, saveLabel, onClose, onEditDetails, onSave,
}: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  // Only drag-dismiss when the scrollable body is at the top.
  const [canDrag, setCanDrag] = useState(true);

  const recommended = estimate.goals.calories;
  const calNum = calorieGoal === '' ? recommended : calorieGoal;
  const m = macrosForCalories({ calories: calNum, weight_kg: weightKg, does_resistance_training: estimate.does_resistance_training });
  const macros = [
    { label: 'Protein', value: m.protein, Icon: Drumstick },
    { label: 'Carbs', value: m.carbs, Icon: Wheat },
    { label: 'Fat', value: m.fat, Icon: Droplet },
    { label: 'Fibre', value: m.fibre, Icon: Leaf },
  ];

  const adjustCalories = (delta: number) =>
    setCalorieGoal((prev) => Math.min(9999, Math.max(CALORIE_GOAL_FLOOR, (prev === '' ? recommended : prev) + delta)));
  const onCalInput = (value: string) => {
    if (value === '') { setCalorieGoal(''); return; }
    const n = parseInt(value, 10);
    if (!isNaN(n)) setCalorieGoal(Math.min(9999, Math.max(0, n)));
  };

  const maintenance = Math.round(estimate.tdee);
  const resting = Math.round(estimate.bmr);
  const activityCals = Math.max(0, maintenance - resting);
  const scaleMax = Math.max(maintenance, calNum) || 1;
  const diff = maintenance - calNum; // > 0 deficit (loss), < 0 surplus (gain)
  const kgPerMonth = (Math.abs(diff) * 30) / KCAL_PER_KG_BODYWEIGHT;
  const pct = (v: number) => `${(v / scaleMax) * 100}%`;

  return (
    <>
      <motion.div
        className="absolute inset-0 bg-black/30 z-20"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-bg-primary rounded-t-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col max-h-[88dvh] z-30"
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
          className="flex-1 overflow-y-auto px-6 pt-2 pb-3 scrollbar-none"
        >
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-[20px] font-semibold">Your personalized goals</h2>
            <motion.button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-bg-secondary border-none flex items-center justify-center text-text-secondary cursor-pointer flex-shrink-0 -mr-1"
              whileTap={{ scale: 0.9 }}
              aria-label="Close"
            >
              <X size={18} />
            </motion.button>
          </div>
          {estimate.rationale && (
            <p className="text-[13px] text-text-secondary flex items-start gap-1.5 mb-4">
              <Sparkles size={14} className="text-accent mt-0.5 flex-shrink-0" />
              {estimate.rationale}
            </p>
          )}

          {/* Your daily goal — editable bar + adjust pills */}
          <div className="mb-5">
            <div className={`${HEADING} flex items-center justify-between`}>
              <span>Your daily goal</span>
              {calNum !== recommended && (
                <span className="text-text-tertiary normal-case tracking-normal">Recommended {recommended}</span>
              )}
            </div>
            <div className="flex items-center bg-bg-secondary rounded-xl px-4 py-3 mb-3 focus-within:ring-2 focus-within:ring-accent/25 transition-shadow">
              <input
                type="text" inputMode="numeric" pattern="[0-9]*"
                value={calorieGoal}
                onChange={(e) => onCalInput(e.target.value)}
                className="flex-1 bg-transparent border-none text-[17px] font-medium text-right outline-none w-full"
              />
              <span className="text-[15px] text-text-secondary ml-1.5">cal</span>
            </div>
            <div className="flex gap-2">
              {[-200, -100, 100, 200].map((delta) => (
                <button
                  key={delta}
                  onClick={() => adjustCalories(delta)}
                  className="flex-1 bg-bg-secondary rounded-full py-1.5 text-[13px] font-medium text-text-secondary border-none cursor-pointer hover:bg-bg-tertiary transition-colors"
                >
                  {delta > 0 ? `+${delta}` : `${delta}`}
                </button>
              ))}
            </div>
          </div>

          {/* Macros */}
          <div className="bg-bg-secondary rounded-xl px-4 pb-4 mb-5">
            <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-2.5">Macros</div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-8">
              {macros.map((macro) => (
                <div key={macro.label} className="flex items-center gap-2">
                  <macro.Icon size={14} className="text-text-secondary flex-shrink-0" />
                  <span className="text-[13px] text-text-secondary">{macro.label}</span>
                  <span className="text-[14px] font-medium ml-auto tabular-nums">{macro.value}g</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily breakdown */}
          <div className="bg-bg-secondary rounded-xl px-4 pb-4 mb-4">
            <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-2.5">Daily breakdown</div>

            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] text-text-secondary">Maintenance calories</span>
              <span className="text-[13px] font-medium tabular-nums">{maintenance} cal</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex bg-bg-tertiary mb-1.5">
              <div style={{ width: pct(resting), backgroundColor: 'var(--color-accent-secondary)' }} />
              <div style={{ width: pct(activityCals), backgroundColor: 'var(--color-warning)' }} />
            </div>
            <div className="flex items-center gap-3 mb-4 text-[11px] text-text-tertiary">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--color-accent-secondary)' }} />
                Resting {resting}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--color-warning)' }} />
                Activity {activityCals}
              </span>
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] text-text-secondary">Target calories</span>
              <span className="text-[13px] font-medium tabular-nums">{calNum} cal</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex bg-bg-tertiary mb-3">
              <div style={{ width: pct(Math.min(calNum, maintenance)), backgroundColor: 'var(--color-accent)' }} />
              {diff < 0
                ? <div style={{ width: pct(-diff), backgroundColor: 'var(--color-accent)', opacity: 0.4 }} />
                : diff > 0
                  ? <div style={{ width: pct(diff), backgroundColor: 'var(--color-warning)', opacity: 0.3 }} />
                  : null}
            </div>

            <div className="flex items-center justify-between border-t border-bg-tertiary/60 pt-3">
              <span className="text-[13px] text-text-secondary">
                {diff > 0 ? `${diff} cal/day deficit` : diff < 0 ? `${-diff} cal/day surplus` : 'At maintenance'}
              </span>
              <span className={`text-[14px] font-semibold ${diff === 0 ? 'text-text-secondary' : 'text-accent'}`}>
                {diff === 0 ? '—' : `${kgPerMonth.toFixed(1)} kg/mo ${diff > 0 ? 'lost' : 'gained'}`}
              </span>
            </div>
          </div>

          <button
            onClick={onEditDetails}
            className="flex items-center gap-1 text-[13px] text-text-secondary bg-transparent border-none cursor-pointer p-0 underline decoration-dashed decoration-text-tertiary underline-offset-[3px]"
          >
            <ChevronLeft size={14} /> Edit details
          </button>
        </div>

        {/* Save (pinned) */}
        <div className="flex-shrink-0 px-6 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] border-t border-bg-tertiary/50 bg-bg-primary">
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
