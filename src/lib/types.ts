import type { Sex, GoalType, WorkoutEntry } from './goals';

export interface FoodLibraryItem {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fibre_per_100g: number;
  serving_size_g: number;
  source: 'base' | 'usda_api' | 'llm_estimate' | 'web_search';
  unit: 'g' | 'ml';
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface FoodLogEntry {
  id: string;
  user_id: string;
  food_library_id: string | null;
  food_name: string;
  quantity_g: number;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fibre: number | null;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  logged_date: string;
  status: 'confirmed' | 'processing';
  unit: 'g' | 'ml';
  input_source: 'text' | 'voice' | 'image';
  source_image_url: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProcessingJob {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  logged_date: string;
  image_url: string;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_carbs_goal: number;
  daily_fat_goal: number;
  daily_fibre_goal: number;
  // Goal-personalization inputs. Optional so existing Profile literals (demo,
  // mock, defaults) keep type-checking; real DB rows always include them.
  sex?: Sex | null;
  age?: number | null;
  birth_date?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  activity_description?: string | null;
  activity_factor?: number | null;
  does_resistance_training?: boolean | null;
  activity_workouts?: WorkoutEntry[] | null;
  goal_type?: GoalType | null;
  goal_pace_kg_per_month?: number | null;
  goals_mode?: GoalsMode;
  created_at: string;
  updated_at: string;
}

export type GoalsMode = 'default' | 'personalized' | 'manual';

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
}
