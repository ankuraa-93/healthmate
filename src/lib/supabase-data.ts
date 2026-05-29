import { createClient } from './supabase';
import { FoodLogEntry, Profile, FoodLibraryItem } from './types';

const supabase = createClient();

// --- Profiles ---

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('fetchProfile error:', error);
    return null;
  }
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile,
  'display_name' | 'daily_calorie_goal' | 'daily_protein_goal' | 'daily_carbs_goal' | 'daily_fat_goal' | 'daily_fibre_goal'
>>): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('updateProfile error:', error);
    return null;
  }
  return data;
}

// --- Food Log ---

export async function fetchFoodLogs(userId: string, date: string): Promise<FoodLogEntry[]> {
  const { data, error } = await supabase
    .from('food_log')
    .select('*')
    .eq('user_id', userId)
    .eq('logged_date', date)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('fetchFoodLogs error:', error);
    return [];
  }
  return data ?? [];
}

export async function insertFoodLog(entry: Omit<FoodLogEntry, 'id' | 'created_at' | 'updated_at'>): Promise<FoodLogEntry | null> {
  const { data, error } = await supabase
    .from('food_log')
    .insert(entry)
    .select()
    .single();

  if (error) {
    console.error('insertFoodLog error:', error);
    return null;
  }
  return data;
}

export async function updateFoodLog(id: string, updates: Partial<Pick<FoodLogEntry,
  'quantity_g' | 'calories' | 'protein' | 'carbs' | 'fat' | 'fibre' | 'meal_type' | 'status' | 'food_library_id'
>>): Promise<FoodLogEntry | null> {
  const { data, error } = await supabase
    .from('food_log')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateFoodLog error:', error);
    return null;
  }
  return data;
}

export async function deleteFoodLog(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('food_log')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('deleteFoodLog error:', error);
    return false;
  }
  return true;
}

// --- Food Library ---

export async function fetchFoodLibraryItem(id: string): Promise<FoodLibraryItem | null> {
  const { data, error } = await supabase
    .from('food_library')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('fetchFoodLibraryItem error:', error);
    return null;
  }
  return data;
}

// --- Frequently Logged ---

export async function fetchFrequentFoods(userId: string, limit = 6): Promise<{
  food_name: string;
  quantity_g: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  unit: string;
  food_library_id: string | null;
  count: number;
}[]> {
  const { data, error } = await supabase
    .from('food_log')
    .select('food_name, quantity_g, calories, protein, carbs, fat, fibre, unit, food_library_id')
    .eq('user_id', userId)
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchFrequentFoods error:', error);
    return [];
  }

  const counts = new Map<string, {
    food_name: string;
    quantity_g: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fibre: number;
    unit: string;
    food_library_id: string | null;
    count: number;
  }>();
  for (const row of data ?? []) {
    const existing = counts.get(row.food_name);
    if (existing) {
      existing.count++;
    } else {
      counts.set(row.food_name, {
        food_name: row.food_name,
        quantity_g: row.quantity_g,
        calories: row.calories ?? 0,
        protein: row.protein ?? 0,
        carbs: row.carbs ?? 0,
        fat: row.fat ?? 0,
        fibre: row.fibre ?? 0,
        unit: row.unit,
        food_library_id: row.food_library_id,
        count: 1,
      });
    }
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
