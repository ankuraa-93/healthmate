// Demo account: a single shared, disposable account recruiters/visitors can
// explore without signing up. The account is reset to this curated seed day on
// every entry (see /api/demo/reset), so each visitor starts from a clean,
// realistic-looking state. Because it's disposable by design, the credentials
// living in the client bundle is intentional and harmless.

export const DEMO_EMAIL = 'demo@calorrific.app';
export const DEMO_PASSWORD = 'explore-calorrific';
export const DEMO_USER_ID = 'b1ecb8f5-3024-4377-bba8-1b11eb7e4e66';

export const DEMO_DISPLAY_NAME = 'Demo Account';
export const DEMO_GOALS = {
  daily_calorie_goal: 2000,
  daily_protein_goal: 120,
  daily_carbs_goal: 250,
  daily_fat_goal: 65,
  daily_fibre_goal: 30,
};

export interface SeedItem {
  food_name: string;
  quantity_g: number;
  unit: 'g' | 'ml';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
}

interface SeedMeal {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  input_source: 'text' | 'voice' | 'image';
  // Absolute URL of the meal photo, set when the meal was logged from an image.
  // These point at real plate photos already in the (public) storage bucket,
  // and the seed items below match what's actually in each photo.
  imageUrl?: string;
  items: SeedItem[];
}

const PHOTO_BASE =
  'https://hnxbjwwfdbbalrpthshk.supabase.co/storage/v1/object/public/food-photos';

// --- Today: an in-progress day (~1,200 cal of 2,000) so the ring shows real
// progress with calories remaining. Breakfast + lunch are photo-logged to show
// off the camera badge + photo gallery; the snack is a plain text entry. ---
const TODAY_MEALS: SeedMeal[] = [
  {
    meal_type: 'breakfast',
    input_source: 'image',
    imageUrl: `${PHOTO_BASE}/${DEMO_USER_ID}/demo-breakfast.jpg`,
    items: [
      { food_name: 'Buttered Toast', quantity_g: 60, unit: 'g', calories: 200, protein: 5, carbs: 26, fat: 9, fibre: 2 },
      { food_name: 'Sprouts Salad', quantity_g: 100, unit: 'g', calories: 120, protein: 8, carbs: 18, fat: 2, fibre: 6 },
      { food_name: 'Masala Chai', quantity_g: 150, unit: 'ml', calories: 90, protein: 3, carbs: 12, fat: 3, fibre: 0 },
    ],
  },
  {
    meal_type: 'lunch',
    input_source: 'image',
    imageUrl: `${PHOTO_BASE}/${DEMO_USER_ID}/demo-lunch.jpg`,
    items: [
      { food_name: 'Palak Paneer', quantity_g: 200, unit: 'g', calories: 280, protein: 14, carbs: 12, fat: 20, fibre: 5 },
      { food_name: 'Roti', quantity_g: 80, unit: 'g', calories: 220, protein: 7, carbs: 44, fat: 4, fibre: 6 },
      { food_name: 'Sev', quantity_g: 15, unit: 'g', calories: 80, protein: 2, carbs: 6, fat: 6, fibre: 1 },
    ],
  },
  {
    meal_type: 'snack',
    input_source: 'text',
    items: [
      { food_name: 'Banana', quantity_g: 120, unit: 'g', calories: 107, protein: 1, carbs: 27, fat: 0, fibre: 3 },
      { food_name: 'Almonds', quantity_g: 20, unit: 'g', calories: 116, protein: 4, carbs: 4, fat: 10, fibre: 2 },
    ],
  },
];

// --- Prior days: lightweight entries so History shows green dots and the week
// strip shows filled bars. Keyed by how many days back from today. ---
const HISTORY_MEALS: Record<number, SeedMeal[]> = {
  1: [
    { meal_type: 'breakfast', input_source: 'voice', items: [
      { food_name: 'Oats with Milk', quantity_g: 250, unit: 'g', calories: 280, protein: 12, carbs: 44, fat: 6, fibre: 6 },
      { food_name: 'Boiled Eggs', quantity_g: 100, unit: 'g', calories: 155, protein: 13, carbs: 1, fat: 11, fibre: 0 },
    ] },
    { meal_type: 'lunch', input_source: 'text', items: [
      { food_name: 'Rajma', quantity_g: 200, unit: 'g', calories: 280, protein: 14, carbs: 40, fat: 6, fibre: 11 },
      { food_name: 'Steamed Rice', quantity_g: 150, unit: 'g', calories: 195, protein: 4, carbs: 43, fat: 0, fibre: 1 },
    ] },
    { meal_type: 'dinner', input_source: 'text', items: [
      { food_name: 'Grilled Chicken', quantity_g: 150, unit: 'g', calories: 248, protein: 47, carbs: 0, fat: 5, fibre: 0 },
      { food_name: 'Mixed Vegetable Salad', quantity_g: 150, unit: 'g', calories: 75, protein: 3, carbs: 12, fat: 2, fibre: 5 },
    ] },
  ],
  2: [
    { meal_type: 'breakfast', input_source: 'text', items: [
      { food_name: 'Idli', quantity_g: 160, unit: 'g', calories: 220, protein: 8, carbs: 44, fat: 1, fibre: 3 },
      { food_name: 'Sambar', quantity_g: 150, unit: 'g', calories: 90, protein: 4, carbs: 14, fat: 2, fibre: 4 },
    ] },
    { meal_type: 'lunch', input_source: 'voice', items: [
      { food_name: 'Dal Tadka', quantity_g: 200, unit: 'g', calories: 240, protein: 12, carbs: 32, fat: 8, fibre: 8 },
      { food_name: 'Roti', quantity_g: 80, unit: 'g', calories: 220, protein: 7, carbs: 44, fat: 4, fibre: 6 },
    ] },
    { meal_type: 'snack', input_source: 'text', items: [
      { food_name: 'Apple', quantity_g: 180, unit: 'g', calories: 94, protein: 0, carbs: 25, fat: 0, fibre: 4 },
    ] },
  ],
  3: [
    { meal_type: 'breakfast', input_source: 'text', items: [
      { food_name: 'Poha', quantity_g: 200, unit: 'g', calories: 270, protein: 6, carbs: 50, fat: 6, fibre: 4 },
    ] },
    { meal_type: 'lunch', input_source: 'text', items: [
      { food_name: 'Chole', quantity_g: 200, unit: 'g', calories: 320, protein: 13, carbs: 42, fat: 11, fibre: 12 },
      { food_name: 'Bhature', quantity_g: 100, unit: 'g', calories: 300, protein: 7, carbs: 42, fat: 12, fibre: 2 },
    ] },
  ],
  7: [
    { meal_type: 'breakfast', input_source: 'text', items: [
      { food_name: 'Banana', quantity_g: 120, unit: 'g', calories: 107, protein: 1, carbs: 27, fat: 0, fibre: 3 },
      { food_name: 'Peanut Butter Toast', quantity_g: 80, unit: 'g', calories: 290, protein: 11, carbs: 30, fat: 15, fibre: 4 },
    ] },
    { meal_type: 'dinner', input_source: 'voice', items: [
      { food_name: 'Veg Pulao', quantity_g: 250, unit: 'g', calories: 360, protein: 8, carbs: 60, fat: 10, fibre: 6 },
    ] },
  ],
};

function ymd(base: Date, offsetDays: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export interface SeedRow {
  user_id: string;
  food_library_id: string | null;
  food_name: string;
  quantity_g: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  meal_type: string;
  logged_date: string;
  status: 'confirmed';
  unit: string;
  input_source: string;
  source_image_url: string | null;
}

// Build all food_log rows for the demo account, dated relative to `todayStr`
// (YYYY-MM-DD) so the seed always looks current.
export function buildSeedRows(todayStr: string): SeedRow[] {
  const base = new Date(`${todayStr}T12:00:00`);
  const rows: SeedRow[] = [];

  const pushMeals = (meals: SeedMeal[], offsetDays: number) => {
    const logged_date = ymd(base, offsetDays);
    for (const meal of meals) {
      const source_image_url = meal.imageUrl ?? null;
      for (const item of meal.items) {
        rows.push({
          user_id: DEMO_USER_ID,
          food_library_id: null,
          food_name: item.food_name,
          quantity_g: item.quantity_g,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fibre: item.fibre,
          meal_type: meal.meal_type,
          logged_date,
          status: 'confirmed',
          unit: item.unit,
          input_source: meal.input_source,
          source_image_url,
        });
      }
    }
  };

  pushMeals(TODAY_MEALS, 0);
  for (const [offset, meals] of Object.entries(HISTORY_MEALS)) {
    pushMeals(meals, -Number(offset));
  }

  return rows;
}
