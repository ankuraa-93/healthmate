// Goal personalization engine — pure, testable functions.
// Computes daily calorie + macro targets from user biometrics, an estimated
// activity factor, and a weight goal. No I/O here; callers persist the result
// into the existing profiles.daily_*_goal columns the dashboard already reads.

// --- Tunable constants (single source of truth) ---
// Protein leans toward minimum requirement rather than the 2g/kg athlete ceiling,
// which over-shoots for the typical (often higher-body-fat) Indian user.
export const PROTEIN_G_PER_KG = { general: 1.0, resistance: 1.5 } as const;
export const FAT_PCT_OF_CALORIES = 0.27; // ~27% of energy from fat
export const FIBRE_G_PER_1000_KCAL = 14; // standard dietary-fibre guideline
export const KCAL_PER_KG_BODYWEIGHT = 7700; // energy in 1 kg of body mass

export type Sex = 'male' | 'female';
export type GoalType = 'lose' | 'maintain' | 'gain';

export interface WorkoutEntry {
  activity: string;
  sessions_per_week: number;
  minutes_per_session: number;
  intensity: 'low' | 'moderate' | 'high';
}

export interface GoalInputs {
  sex: Sex;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_factor: number; // 1.2–1.9, estimated by Gemini from free text
  does_resistance_training: boolean;
  goal_type: GoalType;
  goal_pace_kg_per_month: number; // >= 0; ignored when goal_type === 'maintain'
}

export interface ComputedGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
}


/** Mifflin–St Jeor basal metabolic rate (kcal/day). */
export function mifflinStJeorBMR({ sex, age, height_cm, weight_kg }: {
  sex: Sex; age: number; height_cm: number; weight_kg: number;
}): number {
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

/**
 * Macro split for a given calorie target. Protein is bodyweight-driven (so it
 * holds steady if the user dials calories down); fat is a % of energy; carbs
 * absorb the remainder; fibre scales with intake. Used both by the full
 * pipeline and live on the review screen when the user adjusts calories.
 */
export function macrosForCalories({ calories, weight_kg, does_resistance_training }: {
  calories: number; weight_kg: number; does_resistance_training: boolean;
}): Omit<ComputedGoals, 'calories'> {
  const proteinPerKg = does_resistance_training
    ? PROTEIN_G_PER_KG.resistance
    : PROTEIN_G_PER_KG.general;
  const protein = weight_kg * proteinPerKg;
  const fat = (calories * FAT_PCT_OF_CALORIES) / 9;
  const carbs = Math.max(0, (calories - protein * 4 - fat * 9) / 4);
  const fibre = (calories / 1000) * FIBRE_G_PER_1000_KCAL;
  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    fibre: Math.round(fibre),
  };
}

/** Full pipeline: BMR → TDEE → goal-adjusted calories → macro split. */
export function computeGoals(input: GoalInputs): ComputedGoals {
  const bmr = mifflinStJeorBMR(input);
  const tdee = bmr * input.activity_factor;

  // pace (kg/month) → daily calorie delta. e.g. 2 kg/month ≈ 513 kcal/day.
  const dailyDelta = (input.goal_pace_kg_per_month * KCAL_PER_KG_BODYWEIGHT) / 30;
  let calories = tdee;
  if (input.goal_type === 'lose') calories -= dailyDelta;
  else if (input.goal_type === 'gain') calories += dailyDelta;
  // Round the target to the nearest 100 — easier to remember and a cleaner base
  // for the ±100 adjuster on the review screen.
  const rounded = Math.round(calories / 100) * 100;

  return {
    calories: rounded,
    ...macrosForCalories({
      calories: rounded,
      weight_kg: input.weight_kg,
      does_resistance_training: input.does_resistance_training,
    }),
  };
}
