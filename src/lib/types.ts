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
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_carbs_goal: number;
  daily_fat_goal: number;
  daily_fibre_goal: number;
  created_at: string;
  updated_at: string;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
}
