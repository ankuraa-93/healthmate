import { FoodLibraryItem, FoodLogEntry } from './types';

export interface NutritionValues {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
}

export function calculateNutrition(
  quantityG: number,
  libraryItem: FoodLibraryItem
): NutritionValues {
  const factor = quantityG / 100;
  return {
    calories: Math.round(libraryItem.calories_per_100g * factor),
    protein: Math.round(libraryItem.protein_per_100g * factor),
    carbs: Math.round(libraryItem.carbs_per_100g * factor),
    fat: Math.round(libraryItem.fat_per_100g * factor),
    fibre: Math.round(libraryItem.fibre_per_100g * factor),
  };
}

export function scaleNutritionFromEntry(
  quantityG: number,
  entry: FoodLogEntry
): NutritionValues {
  const factor = quantityG / entry.quantity_g;
  return {
    calories: Math.round((entry.calories ?? 0) * factor),
    protein: Math.round((entry.protein ?? 0) * factor),
    carbs: Math.round((entry.carbs ?? 0) * factor),
    fat: Math.round((entry.fat ?? 0) * factor),
    fibre: Math.round((entry.fibre ?? 0) * factor),
  };
}
