'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Mic, Loader2, TrendingDown, TrendingUp, Minus, Plus } from 'lucide-react';
import { Profile } from '@/lib/types';
import { computeGoals, macrosForCalories, mifflinStJeorBMR, CALORIE_GOAL_FLOOR, type GoalType, type Sex, type Estimate } from '@/lib/goals';
import { updateProfile } from '@/lib/supabase-data';
import { useVoiceInput } from '@/lib/useVoiceInput';
import PersonalizedGoalsSheet from '@/components/PersonalizedGoalsSheet';

interface Props {
  userId: string;
  profile: Profile | null;
  onSaved: (profile: Profile) => void;
  onBack: () => void;
  saveLabel?: string;
  onToast?: (message: string) => void;
  // 'review' jumps straight to the "Your personalized goals" screen, rebuilt
  // from the saved profile (no Gemini call) — used by the Daily Goals edit icon.
  initialView?: 'form' | 'review';
}

const PACE_STEP = 0.5;  // target weight change adjusts in 0.5 kg/month steps
const PACE_MIN = 0.5;
const PACE_MAX = 4;

const HEADING = 'text-xs font-medium text-text-secondary uppercase tracking-wide mb-2 block';

const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;

/** Whole-years age from a day/month/year, or null if the date is invalid. */
function ageFromDob(y: number, m: number, d: number): number | null {
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
  if (y < 1900 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, m - 1, d);
  // reject rollovers like 30 Feb (JS would silently advance the month)
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() < m - 1 || (now.getMonth() === m - 1 && now.getDate() < d)) age--;
  return age;
}

// Rebuild the review-screen estimate from a saved profile (activity factor etc.
// are already stored), so the Daily Goals edit icon can open it without Gemini.
function estimateFromProfile(profile: Profile | null): Estimate | null {
  if (!profile) return null;
  const { sex, birth_date, height_cm, weight_kg, activity_factor, does_resistance_training, goal_type, goal_pace_kg_per_month } = profile;
  if (!sex || !birth_date || height_cm == null || weight_kg == null || activity_factor == null) return null;
  const [y, mo, d] = birth_date.split('-').map(Number);
  const age = ageFromDob(y, mo, d);
  if (age == null) return null;
  const resistance = !!does_resistance_training;
  const goals = computeGoals({
    sex, age, height_cm, weight_kg, activity_factor,
    does_resistance_training: resistance,
    goal_type: goal_type ?? 'maintain',
    goal_pace_kg_per_month: goal_type === 'maintain' ? 0 : (goal_pace_kg_per_month ?? 0),
  });
  const bmr = mifflinStJeorBMR({ sex, age, height_cm, weight_kg });
  return {
    goals,
    rationale: '',
    activity_factor,
    does_resistance_training: resistance,
    workouts: profile.activity_workouts ?? [],
    bmr,
    tdee: bmr * activity_factor,
  };
}

export default function PersonalizeGoalsFlow({ userId, profile, onSaved, onBack, saveLabel = 'Save goals', onToast, initialView = 'form' }: Props) {
  const [sex, setSex] = useState<Sex | null>(profile?.sex ?? null);

  // Date of birth (replaces the age input). Parse stored YYYY-MM-DD without TZ drift.
  const dob = profile?.birth_date ? profile.birth_date.split('-') : null;
  const [birthDay, setBirthDay] = useState(dob ? String(Number(dob[2])) : '');
  const [birthMonth, setBirthMonth] = useState(dob ? String(Number(dob[1])) : '');
  const [birthYear, setBirthYear] = useState(dob ? dob[0] : '');

  // Height — entered in ft+in (default) or cm; stored canonically as cm.
  const initInches = profile?.height_cm != null ? profile.height_cm / CM_PER_INCH : null;
  const [heightUnit, setHeightUnit] = useState<'ft' | 'cm'>('ft');
  const [feet, setFeet] = useState(initInches != null ? String(Math.floor(initInches / 12)) : '');
  const [inches, setInches] = useState(initInches != null ? String(Math.round(initInches % 12)) : '');
  const [heightCm, setHeightCm] = useState(profile?.height_cm != null ? String(Math.round(profile.height_cm)) : '');

  const [weight, setWeight] = useState(profile?.weight_kg != null ? String(profile.weight_kg) : '');
  const [goalType, setGoalType] = useState<GoalType>(profile?.goal_type ?? 'maintain');
  const [pace, setPace] = useState<number>(profile?.goal_pace_kg_per_month ?? 2);
  const [activity, setActivity] = useState(profile?.activity_description ?? '');

  const [estimating, setEstimating] = useState(false);
  const [saving, setSaving] = useState(false);
  // 'review' entry rebuilds the estimate from the saved profile so the screen
  // opens straight on "Your personalized goals" with the saved target.
  const [estimate, setEstimate] = useState<Estimate | null>(
    () => (initialView === 'review' ? estimateFromProfile(profile) : null)
  );
  // Editable daily-calorie goal on the review screen ('' while the field is cleared).
  const [calorieGoal, setCalorieGoal] = useState<number | ''>(
    initialView === 'review' && profile?.daily_calorie_goal != null ? profile.daily_calorie_goal : ''
  );

  const voice = useVoiceInput({
    onTranscript: (t) => setActivity((prev) => (prev.trim() ? `${prev.trim()} ${t}` : t)),
    onError: (m) => onToast?.(m),
  });

  const dobAge = ageFromDob(Number(birthYear), Number(birthMonth), Number(birthDay));
  const heightN = heightUnit === 'cm'
    ? Number(heightCm)
    : Math.round((Number(feet) * CM_PER_FOOT) + (Number(inches) * CM_PER_INCH));
  const weightN = Number(weight);

  const basicsValid =
    !!sex &&
    dobAge != null && dobAge >= 13 && dobAge <= 100 &&
    Number.isFinite(heightN) && heightN >= 100 && heightN <= 250 &&
    Number.isFinite(weightN) && weightN >= 30 && weightN <= 300;

  // Whether anything differs from the prefilled values (compared against the same
  // expressions the useState initializers use, so it's false on first render).
  // Excludes the unit toggle — switching ft↔cm without editing isn't a change.
  const dirty =
    sex !== (profile?.sex ?? null) ||
    birthDay !== (dob ? String(Number(dob[2])) : '') ||
    birthMonth !== (dob ? String(Number(dob[1])) : '') ||
    birthYear !== (dob ? dob[0] : '') ||
    feet !== (initInches != null ? String(Math.floor(initInches / 12)) : '') ||
    inches !== (initInches != null ? String(Math.round(initInches % 12)) : '') ||
    heightCm !== (profile?.height_cm != null ? String(Math.round(profile.height_cm)) : '') ||
    weight !== (profile?.weight_kg != null ? String(profile.weight_kg) : '') ||
    goalType !== (profile?.goal_type ?? 'maintain') ||
    pace !== (profile?.goal_pace_kg_per_month ?? 2) ||
    activity !== (profile?.activity_description ?? '');

  const handleCalculate = async () => {
    if (!basicsValid || !sex || dobAge == null) {
      onToast?.('Please check your details — a valid date of birth (age 13–100), height, and weight (30–300 kg).');
      return;
    }
    setEstimating(true);
    try {
      const res = await fetch('/api/estimate-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: activity.trim() || 'No regular exercise' }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to estimate activity');
      const data = await res.json();

      const goals = computeGoals({
        sex,
        age: dobAge,
        height_cm: heightN,
        weight_kg: weightN,
        activity_factor: data.activity_factor,
        does_resistance_training: data.does_resistance_training,
        goal_type: goalType,
        goal_pace_kg_per_month: goalType === 'maintain' ? 0 : pace,
      });

      const bmr = mifflinStJeorBMR({ sex, age: dobAge, height_cm: heightN, weight_kg: weightN });
      const tdee = bmr * data.activity_factor;

      setCalorieGoal(goals.calories); // fresh estimate → start at the recommendation
      setEstimate({
        goals,
        rationale: data.rationale || '',
        activity_factor: data.activity_factor,
        does_resistance_training: data.does_resistance_training,
        workouts: data.workouts || [],
        bmr,
        tdee,
      });
    } catch (e) {
      onToast?.(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setEstimating(false);
    }
  };

  const handleSave = async () => {
    if (!estimate || !sex || dobAge == null) return;
    setSaving(true);
    const calories = Math.max(CALORIE_GOAL_FLOOR, calorieGoal === '' ? estimate.goals.calories : calorieGoal);
    const macros = macrosForCalories({ calories, weight_kg: weightN, does_resistance_training: estimate.does_resistance_training });
    const birth_date = `${Number(birthYear)}-${String(Number(birthMonth)).padStart(2, '0')}-${String(Number(birthDay)).padStart(2, '0')}`;
    const updated = await updateProfile(userId, {
      sex,
      age: dobAge,
      birth_date,
      height_cm: heightN,
      weight_kg: weightN,
      activity_description: activity.trim(),
      activity_factor: estimate.activity_factor,
      does_resistance_training: estimate.does_resistance_training,
      activity_workouts: estimate.workouts,
      goal_type: goalType,
      goal_pace_kg_per_month: goalType === 'maintain' ? 0 : pace,
      goals_mode: 'personalized',
      daily_calorie_goal: calories,
      daily_protein_goal: macros.protein,
      daily_carbs_goal: macros.carbs,
      daily_fat_goal: macros.fat,
      daily_fibre_goal: macros.fibre,
    });
    setSaving(false);
    if (updated) onSaved(updated);
    else onToast?.('Could not save — please try again');
  };

  // Dismissing the goals sheet: if we opened straight into it (Daily Goals edit),
  // go back to where we came from; otherwise reveal the input form behind it.
  const closeSheet = () => { if (initialView === 'review') onBack(); else setEstimate(null); };

  // --- Form screen + the goals review as a bottom sheet over it ---
  return (
    <>
    <motion.div className="flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={onBack} className="flex items-center gap-1 text-[15px] text-text-secondary bg-transparent border-none cursor-pointer p-0 -mt-9 mb-4">
        <ChevronLeft size={18} /> Back
      </button>

      <h2 className="text-[20px] font-semibold mb-5">Tell us about you</h2>

      {/* Basics + weight goal — one grouped card matching the Settings "Daily Goals" card */}
      <div className="bg-bg-secondary rounded-2xl px-4 mb-6">
        <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-1">Basics</div>
        {/* Sex */}
        <div className="flex items-center justify-between py-2.5 border-b border-bg-tertiary/60">
          <span className="text-[15px]">Sex</span>
          <div className="flex gap-1.5">
            {(['male', 'female'] as Sex[]).map((s) => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={`h-9 px-3.5 rounded-lg text-[14px] font-medium border-none cursor-pointer capitalize transition-colors ${
                  sex === s ? 'bg-accent text-white' : 'bg-bg-primary text-text-secondary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Date of birth */}
        <div className="flex items-center justify-between py-2.5 border-b border-bg-tertiary/60">
          <span className="text-[15px]">Date of birth</span>
          <div className="flex gap-1.5">
            <MiniNum value={birthDay} onChange={setBirthDay} placeholder="DD" w="w-10" />
            <MiniNum value={birthMonth} onChange={setBirthMonth} placeholder="MM" w="w-10" />
            <MiniNum value={birthYear} onChange={setBirthYear} placeholder="YYYY" w="w-14" />
          </div>
        </div>

        {/* Height — unit toggle sits next to the label; inputs on the right */}
        <div className="flex items-center justify-between py-2.5 border-b border-bg-tertiary/60 gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[15px]">Height</span>
            <div className="flex bg-bg-primary rounded-lg p-0.5">
              {(['ft', 'cm'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setHeightUnit(u)}
                  className={`px-2 py-1 rounded-md text-[12px] font-medium border-none cursor-pointer transition-colors ${
                    heightUnit === u ? 'bg-accent text-white' : 'bg-transparent text-text-secondary'
                  }`}
                >
                  {u === 'ft' ? 'ft+in' : 'cm'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {heightUnit === 'ft' ? (
              <>
                <MiniNum value={feet} onChange={setFeet} placeholder="5" unit="ft" w="w-12" />
                <MiniNum value={inches} onChange={setInches} placeholder="7" unit="in" w="w-12" />
              </>
            ) : (
              <MiniNum value={heightCm} onChange={setHeightCm} placeholder="170" unit="cm" w="w-16" />
            )}
          </div>
        </div>

        {/* Weight */}
        <div className="flex items-center justify-between py-2.5 border-b border-bg-tertiary/60">
          <span className="text-[15px]">Weight</span>
          <MiniNum value={weight} onChange={setWeight} placeholder="65" unit="kg" w="w-16" />
        </div>

        {/* Weight goal */}
        <div className={`flex items-center justify-between gap-2 py-2.5 ${goalType !== 'maintain' ? 'border-b border-bg-tertiary/60' : ''}`}>
          <span className="text-[15px] flex-shrink-0">Weight goal</span>
          <div className="flex gap-1">
            {([
              { key: 'lose', label: 'Lose', Icon: TrendingDown },
              { key: 'maintain', label: 'Maintain', Icon: Minus },
              { key: 'gain', label: 'Gain', Icon: TrendingUp },
            ] as { key: GoalType; label: string; Icon: typeof Minus }[]).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setGoalType(key)}
                className={`h-9 px-2 rounded-lg text-[13px] font-medium border-none cursor-pointer flex items-center gap-1 transition-colors ${
                  goalType === key ? 'bg-accent text-white' : 'bg-bg-primary text-text-secondary'
                }`}
              >
                <Icon size={13} className="flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Target weight loss / gain */}
        <AnimatePresence initial={false}>
          {goalType !== 'maintain' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 py-2.5">
                <span className="text-[15px] flex-shrink-0">Target weight {goalType === 'lose' ? 'loss' : 'gain'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPace((p) => Math.max(PACE_MIN, +(p - PACE_STEP).toFixed(1)))}
                    disabled={pace <= PACE_MIN}
                    aria-label="Decrease target"
                    className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center border-none cursor-pointer text-text-primary disabled:opacity-30 disabled:cursor-default"
                  >
                    <Minus size={15} />
                  </button>
                  <div className="h-8 px-3 bg-bg-primary rounded-lg flex items-center">
                    <span className="text-[15px] font-semibold tabular-nums">{pace}</span>
                    <span className="text-[12px] text-text-secondary ml-1">kg/mo</span>
                  </div>
                  <button
                    onClick={() => setPace((p) => Math.min(PACE_MAX, +(p + PACE_STEP).toFixed(1)))}
                    disabled={pace >= PACE_MAX}
                    aria-label="Increase target"
                    className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center border-none cursor-pointer text-text-primary disabled:opacity-30 disabled:cursor-default"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              <p className="text-[12px] text-text-tertiary pb-3 -mt-0.5">
                {weightN >= 30
                  ? `Your weight goal is ${Math.round(goalType === 'lose' ? weightN - pace * 6 : weightN + pace * 6)} kg in 6 months from now`
                  : `That's ${pace * 6} kg ${goalType === 'lose' ? 'lost' : 'gained'} in 6 months from now`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Activity */}
      <label className={HEADING}>Weekly activity</label>
      <div className="relative mb-6">
        <textarea
          value={voice.recording ? '' : activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder={voice.recording ? 'Listening…' : 'Think of a typical week. Example: 4 hours gym weekly, 8000 steps daily'}
          rows={3}
          disabled={voice.recording}
          className="w-full bg-bg-secondary rounded-xl p-3.5 pb-14 text-[15px] resize-none border-none outline-none focus:ring-2 focus:ring-accent/25 transition-shadow placeholder:text-text-tertiary"
        />
        {voice.supported && (
          <button
            onClick={voice.toggle}
            disabled={voice.transcribing}
            className={`absolute bottom-3 left-3 w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors ${
              voice.recording ? 'bg-destructive text-white' : 'bg-bg-tertiary text-text-secondary'
            }`}
            aria-label={voice.recording ? 'Stop recording' : 'Record activity'}
          >
            {voice.transcribing ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />}
          </button>
        )}
      </div>

      <button
        onClick={handleCalculate}
        disabled={!dirty || estimating || voice.recording}
        className="w-full bg-accent text-white rounded-xl h-[50px] text-[17px] font-medium border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-default"
      >
        {estimating ? <><Loader2 size={18} className="animate-spin" /> Calculating…</> : 'Proceed'}
      </button>
    </motion.div>

    <AnimatePresence>
      {estimate && (
        <PersonalizedGoalsSheet
          estimate={estimate}
          weightKg={weightN}
          calorieGoal={calorieGoal}
          setCalorieGoal={setCalorieGoal}
          saving={saving}
          saveLabel={saveLabel}
          onClose={closeSheet}
          onEditDetails={() => setEstimate(null)}
          onSave={handleSave}
        />
      )}
    </AnimatePresence>
    </>
  );
}

// Compact numeric field for the grouped "basics" rows (white pill on the gray card).
function MiniNum({ value, onChange, placeholder, unit, w = 'w-14' }: {
  value: string; onChange: (v: string) => void; placeholder: string; unit?: string; w?: string;
}) {
  return (
    <div className={`flex items-center justify-center bg-bg-primary rounded-lg h-9 px-1.5 ${w} focus-within:ring-2 focus-within:ring-accent/25 transition-shadow`}>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none text-[15px] font-medium min-w-0 text-center placeholder:text-text-tertiary placeholder:font-normal"
      />
      {unit && <span className="text-[11px] text-text-tertiary ml-0.5 flex-shrink-0">{unit}</span>}
    </div>
  );
}
