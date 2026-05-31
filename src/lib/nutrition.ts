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

export interface QuantityWarning {
  message: string;
  highlight: 'quantity' | 'calories';
}

export function getQuantityWarning(quantityG: number, caloriesPer100g: number): QuantityWarning | null {
  if (quantityG <= 0) return { message: 'Quantity must be greater than zero', highlight: 'quantity' };
  const totalCal = (caloriesPer100g * quantityG) / 100;
  if (totalCal > 600) return { message: 'Seems too high for single serve', highlight: 'calories' };
  return null;
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
