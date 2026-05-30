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

// --- Weekly Calories ---

export async function fetchWeeklyCalories(userId: string, dates: string[]): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('food_log')
    .select('logged_date, calories')
    .eq('user_id', userId)
    .eq('status', 'confirmed')
    .in('logged_date', dates);

  if (error) {
    console.error('fetchWeeklyCalories error:', error);
    return {};
  }

  const totals: Record<string, number> = {};
  for (const row of data ?? []) {
    totals[row.logged_date] = (totals[row.logged_date] ?? 0) + (row.calories ?? 0);
  }
  return totals;
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

// --- Suggestions (pattern-based) ---

export interface SuggestedFood {
  food_name: string;
  quantity_g: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  unit: string;
  food_library_id: string | null;
  meal_type: string;
  pattern: 'daily' | 'weekly' | 'biweekly';
}

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export async function fetchSuggestions(userId: string, targetDate: Date): Promise<SuggestedFood[]> {
  const lookbackDates = [
    addDays(targetDate, -1),
    addDays(targetDate, -2),
    addDays(targetDate, -7),
    addDays(targetDate, -14),
    addDays(targetDate, -28),
  ];

  const { data, error } = await supabase
    .from('food_log')
    .select('food_name, quantity_g, calories, protein, carbs, fat, fibre, unit, food_library_id, meal_type, logged_date')
    .eq('user_id', userId)
    .eq('status', 'confirmed')
    .in('logged_date', lookbackDates);

  if (error) {
    console.error('fetchSuggestions error:', error);
    return [];
  }

  type LogRow = typeof data[number];
  const byDateMeal = new Map<string, Map<string, LogRow>>();
  for (const row of data ?? []) {
    const key = `${row.logged_date}|${row.meal_type}`;
    if (!byDateMeal.has(key)) byDateMeal.set(key, new Map());
    const foodMap = byDateMeal.get(key)!;
    if (!foodMap.has(row.food_name)) foodMap.set(row.food_name, row);
  }

  const getFoods = (date: string, meal: string): Map<string, LogRow> =>
    byDateMeal.get(`${date}|${meal}`) ?? new Map();

  const meals = ['breakfast', 'lunch', 'snack', 'dinner'];
  const seen = new Set<string>();
  const suggestions: SuggestedFood[] = [];

  const addMatch = (row: LogRow, pattern: 'daily' | 'weekly' | 'biweekly') => {
    const key = `${row.meal_type}|${row.food_name}`;
    if (seen.has(key)) return;
    seen.add(key);
    suggestions.push({
      food_name: row.food_name,
      quantity_g: row.quantity_g,
      calories: row.calories ?? 0,
      protein: row.protein ?? 0,
      carbs: row.carbs ?? 0,
      fat: row.fat ?? 0,
      fibre: row.fibre ?? 0,
      unit: row.unit,
      food_library_id: row.food_library_id,
      meal_type: row.meal_type,
      pattern,
    });
  };

  for (const meal of meals) {
    const d1 = getFoods(lookbackDates[0], meal);
    const d2 = getFoods(lookbackDates[1], meal);
    const w1 = getFoods(lookbackDates[2], meal);
    const w2 = getFoods(lookbackDates[3], meal);
    const bw2 = getFoods(lookbackDates[4], meal);

    // Daily: present on both d-1 AND d-2
    for (const [name, row] of d1) {
      if (d2.has(name)) addMatch(row, 'daily');
    }
    // Weekly: present on both d-7 AND d-14
    for (const [name, row] of w1) {
      if (w2.has(name)) addMatch(row, 'weekly');
    }
    // Biweekly: present on both d-14 AND d-28
    for (const [name, row] of w2) {
      if (bw2.has(name)) addMatch(row, 'biweekly');
    }
  }

  return suggestions;
}
