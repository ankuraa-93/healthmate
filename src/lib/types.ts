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

export interface ShareConnection {
  id: string;
  owner_id: string | null;
  owner_email: string;
  viewer_id: string | null;
  viewer_email: string;
  type: 'share' | 'request';
  status: 'pending' | 'accepted' | 'declined' | 'revoked';
  created_at: string;
  updated_at: string;
}

export interface ViewableConnection {
  id: string;
  owner_id: string;
  owner_email: string;
  owner_display_name: string | null;
  owner_avatar_url: string | null;
  type: 'share' | 'request';
  accepted_at: string;
}

export interface PendingRequest {
  id: string;
  viewer_id: string;
  viewer_email: string;
  viewer_display_name: string | null;
  viewer_avatar_url: string | null;
  type: 'share' | 'request';
  created_at: string;
}

export interface ManagedConnection {
  id: string;
  owner_id: string | null;
  owner_email: string;
  owner_display_name: string | null;
  owner_avatar_url: string | null;
  viewer_id: string | null;
  viewer_email: string;
  viewer_display_name: string | null;
  viewer_avatar_url: string | null;
  type: 'share' | 'request';
  status: 'pending' | 'accepted';
  created_at: string;
}

export interface SharedLogData {
  display_name: string | null;
  avatar_url: string | null;
  email: string;
  logged_date: string;
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_carbs_goal: number;
  daily_fat_goal: number;
  daily_fibre_goal: number;
  entries: SharedLogEntry[];
  weekly_calories: Record<string, number>;
}

export interface SharedLogEntry {
  id: string;
  food_name: string;
  quantity_g: number;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fibre: number | null;
  meal_type: string;
  unit: string;
  input_source: string | null;
  image_url: string | null;
}
