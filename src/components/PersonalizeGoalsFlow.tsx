'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Mic, Loader2, TrendingDown, TrendingUp, Minus, Plus } from 'lucide-react';
import { Profile } from '@/lib/types';
import { computeGoals, macrosForCalories, mifflinStJeorBMR, CALORIE_GOAL_FLOOR, ageFromDob, estimateFromProfile, type GoalType, type Sex, type Estimate } from '@/lib/goals';
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

const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;


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

  const resetForm = () => {
    setSex(profile?.sex ?? null);
    const d = profile?.birth_date ? profile.birth_date.split('-') : null;
    setBirthDay(d ? String(Number(d[2])) : '');
    setBirthMonth(d ? String(Number(d[1])) : '');
    setBirthYear(d ? d[0] : '');
    const ii = profile?.height_cm != null ? profile.height_cm / CM_PER_INCH : null;
    setFeet(ii != null ? String(Math.floor(ii / 12)) : '');
    setInches(ii != null ? String(Math.round(ii % 12)) : '');
    setHeightCm(profile?.height_cm != null ? String(Math.round(profile.height_cm)) : '');
    setWeight(profile?.weight_kg != null ? String(profile.weight_kg) : '');
    setGoalType(profile?.goal_type ?? 'maintain');
    setPace(profile?.goal_pace_kg_per_month ?? 2);
    setActivity(profile?.activity_description ?? '');
  };

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
      resetForm();
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

      <h2 className="text-[22px] font-medium mb-5">About you</h2>

      {/* Card 1: Basics */}
      <div className="bg-bg-secondary rounded-2xl px-4 mb-3">
        <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-1">Basics</div>
        {/* Sex */}
        <div className="flex items-center justify-between py-2.5 border-b border-bg-tertiary/60">
          <span className="text-[14px]">Sex</span>
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
          <span className="text-[14px]">Date of birth</span>
          <div className="flex gap-1.5">
            <MiniNum value={birthDay} onChange={setBirthDay} placeholder="DD" w="w-12" />
            <MiniNum value={birthMonth} onChange={setBirthMonth} placeholder="MM" w="w-12" />
            <MiniNum value={birthYear} onChange={setBirthYear} placeholder="YYYY" w="w-16" />
          </div>
        </div>

        {/* Height — unit toggle sits next to the label; inputs on the right */}
        <div className="flex items-center justify-between py-2.5 border-b border-bg-tertiary/60 gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[14px]">Height</span>
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
                <MiniNum value={feet} onChange={setFeet} placeholder="5" unit="ft" w="w-14" />
                <MiniNum value={inches} onChange={setInches} placeholder="7" unit="in" w="w-14" />
              </>
            ) : (
              <MiniNum value={heightCm} onChange={setHeightCm} placeholder="170" unit="cm" w="w-20" />
            )}
          </div>
        </div>

        {/* Weight */}
        <div className="flex items-center justify-between py-2.5">
          <span className="text-[14px]">Weight</span>
          <MiniNum value={weight} onChange={setWeight} placeholder="65" unit="kg" w="w-20" />
        </div>
      </div>

      {/* Weekly activity — standalone between Basics and Goal */}
      <div className="mb-3 mt-1">
        <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pb-1.5 px-1">Weekly activity</div>
        <div className="relative">
          <textarea
            value={voice.recording ? '' : activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder={voice.recording ? 'Listening…' : 'e.g. 4 hours gym weekly, 8000 steps daily'}
            rows={2}
            disabled={voice.recording}
            className="w-full bg-bg-secondary rounded-xl p-3 pb-12 text-base leading-relaxed resize-none border-none outline-none focus:ring-2 focus:ring-accent/25 transition-shadow placeholder:text-text-tertiary"
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
      </div>

      {/* Card 3: Goal */}
      <div className="bg-bg-secondary rounded-2xl px-4 mb-6">
        <div className="text-xs font-medium text-text-secondary uppercase tracking-wide pt-3 pb-1">Goal</div>
        {/* Weight goal */}
        <div className={`flex items-center justify-between gap-2 py-2.5 ${goalType !== 'maintain' ? 'border-b border-bg-tertiary/60' : ''}`}>
          <span className="text-[14px] flex-shrink-0">Weight goal</span>
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
                <span className="text-[14px] flex-shrink-0">Target {goalType === 'lose' ? 'loss' : 'gain'}</span>
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
                    <span className="text-[14px] font-semibold tabular-nums">{pace}</span>
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
              <p className="text-[12px] text-text-tertiary py-2 -mt-0.5">
                {weightN >= 30
                  ? `At this rate, you'll be ${Math.round(goalType === 'lose' ? weightN - pace * 3 : weightN + pace * 3)} kg in 3 months`
                  : `That's ${pace * 3} kg ${goalType === 'lose' ? 'lost' : 'gained'} in 3 months`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleCalculate}
        disabled={!dirty || estimating || voice.recording}
        className="w-full bg-accent text-white rounded-xl h-[50px] text-[17px] font-medium border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-default"
      >
        {estimating ? <><Loader2 size={18} className="animate-spin" /> Calculating…</> : 'Calculate daily goals'}
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
    <div className={`flex items-center justify-center bg-bg-primary rounded-lg h-9 px-2.5 ${w} focus-within:ring-2 focus-within:ring-accent/25 transition-shadow`}>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none text-[14px] font-medium min-w-0 text-center placeholder:text-text-tertiary placeholder:font-normal"
      />
      {unit && <span className="text-[11px] text-text-tertiary ml-0.5 flex-shrink-0">{unit}</span>}
    </div>
  );
}
