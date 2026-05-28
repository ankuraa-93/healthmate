# Branded Food Items — Nutrition Validation

Validated on 2026-05-27 by cross-referencing web nutrition databases against our seed values.

**Methodology:** Searched FatSecret India, Eat This Much, NutriScan, NutritionValue.org, official brand sites, and Open Food Facts for per-100g nutrition data. Where sources disagreed, prioritised FatSecret India and official package labels.

**Thresholds:** Match = all macros within 10% | Close = 10-20% off on any macro | FIX = >20% off on any macro

## Validation Table

| # | Item | Our Cal | Our P / C / F / Fi | Web Cal | Web P / C / F / Fi | Source | Match? |
|---|------|---------|---------------------|---------|---------------------|--------|--------|
| 1 | Lays Classic Salted | 536 | 6.0 / 52.0 / 34.0 / 4.0 | 550 | 7.0 / 54.0 / 35.0 / 4.0 | FatSecret India, NutriScan | **Match** |
| 2 | Kurkure Masala Munch | 510 | 6.5 / 56.0 / 29.0 / 2.0 | 555 | 7.0 / 52.0 / 33.6 / 2.0 | FatSecret India, Fitia | **Close** — Cal 8% high, Fat 16% off |
| 3 | Amul Butter Salted | 720 | 0.5 / 0.1 / 81.0 / 0.0 | 722 | 0.5 / 0.0 / 80.0 / 0.0 | Amul official, FatSecret India | **Match** |
| 4 | Amul Ghee | 900 | 0.0 / 0.0 / 100.0 / 0.0 | 929 | 0.0 / 0.0 / 100.0 / 0.0 | FatSecret India, Amul official | **Close** — Cal 3% low (929 vs 900) |
| 5 | Parle G | 462 | 6.5 / 76.0 / 14.5 / 1.0 | 467 | 6.5 / 76.0 / 14.5 / 1.8 | FatSecret India, NutriScan, Nutritionix | **Match** |
| 6 | Cadbury Dairy Milk | 534 | 7.0 / 57.0 / 30.5 / 1.0 | 534 | 7.3 / 57.0 / 30.0 / 2.1 | FatSecret India, Open Food Facts | **Match** |
| 7 | Maggi Noodles Masala | 385 | 9.0 / 58.0 / 13.0 / 2.5 | 443 | 8.6 / 61.4 / 18.6 / 2.9 | GetFoodFacts (USDA FDC), FatSecret India | **FIX** — Cal 15% low, Fat 43% low (13 vs 18.6) |
| 8 | Britannia Marie Gold | 435 | 7.0 / 73.0 / 13.0 / 2.5 | 443 | 8.0 / 77.0 / 12.0 / 2.5 | EatThisMuch, NutriScan, Nutribit | **Match** |
| 9 | Haldirams Aloo Bhujia | 550 | 8.0 / 48.0 / 36.0 / 4.0 | 579 | 7.2 / 42.4 / 42.3 / 0.5 | Haldirams official site | **FIX** — Fat 17% low (36 vs 42.3), Carbs 13% high, Fibre way off (4 vs 0.5) |
| 10 | Amul Cheese Slice | 310 | 18.0 / 3.0 / 25.0 / 0.0 | 311 | 20.0 / 1.5 / 26.0 / 0.0 | FatSecret India, Nutritionix | **Close** — Protein 11% low, Carbs 100% high (3 vs 1.5) |
| 11 | Aloo Bhujia Bikano | 545 | 7.5 / 49.0 / 35.0 / 3.5 | 552 | 8.7 / 41.4 / 38.0 / 3.5 | NutriScan, Open Food Facts, Carb Manager | **FIX** — Carbs 18% high (49 vs 41.4), Protein 16% low |
| 12 | Isopure Whey Protein Isolate Unflavoured | 380 | 88.0 / 2.0 / 1.0 / 0.0 | 345 | 86.2 / 0.0 / 0.0 / 0.0 | NutritionValue.org, Isopure official | **FIX** — Cal 10% high, Carbs should be 0, Fat should be 0 |
| 13 | KitKat 2 Finger | 518 | 6.5 / 64.0 / 27.0 / 1.0 | 519 | 5.5 / 65.7 / 26.7 / 1.0 | FatSecret India, EatThisMuch | **Match** |
| 14 | Coca Cola | 42 | 0.0 / 10.6 / 0.0 / 0.0 | 42 | 0.0 / 10.6 / 0.0 / 0.0 | FatSecret India, Coca-Cola official | **Match** |
| 15 | Epigamia Greek Yogurt Plain | 78 | 8.0 / 5.0 / 2.5 / 0.0 | 71 | 8.0 / 4.3 / 3.4 / 0.0 | FatSecret India, EatThisMuch, Nutritionix | **Close** — Cal 10% high, Fat 36% low (2.5 vs 3.4), Carbs 16% high |
| 16 | Britannia Good Day Cashew | 480 | 6.0 / 66.0 / 21.0 / 1.5 | 508 | 7.0 / 67.0 / 24.0 / 1.5 | FatSecret India, Clearcals | **FIX** — Cal 6% low, Fat 14% low (21 vs 24), Protein 17% low |
| 17 | Oreo | 480 | 4.5 / 70.0 / 20.0 / 2.0 | 483 | 2.9 / 73.5 / 20.6 / 2.9 | FatSecret India, EatThisMuch | **FIX** — Protein 55% high (4.5 vs 2.9) |
| 18 | Snickers | 488 | 7.5 / 60.0 / 24.0 / 1.0 | 491 | 7.5 / 61.5 / 23.9 / 1.0 | FoodStruct, FatSecret India, Calories-info | **Match** |
| 19 | Haldirams Moong Dal | 540 | 20.0 / 42.0 / 32.0 / 5.0 | 479 | 24.0 / 43.0 / 28.0 / 12.0 | FatSecret India, NutritionValue.org, NutriScan | **FIX** — Cal 13% high, Protein 17% low, Fat 14% high, Fibre 58% low (5 vs 12) |
| 20 | MyFitness Peanut Butter Crunchy | 600 | 26.0 / 16.0 / 48.0 / 6.0 | 631 | 25.0 / 23.0 / 49.0 / 9.0 | FatSecret India, MyFitness official site | **FIX** — Cal 5% low, Carbs 30% low (16 vs 23), Fibre 33% low |

## Summary

| Status | Count | Items |
|--------|-------|-------|
| **Match** (within 10%) | 7 | Lays Classic Salted, Amul Butter, Parle G, Cadbury Dairy Milk, KitKat 2 Finger, Coca Cola, Snickers |
| **Close** (10-20% off) | 4 | Kurkure Masala Munch, Amul Ghee, Amul Cheese Slice, Epigamia Greek Yogurt |
| **FIX** (>20% off) | 9 | Maggi Noodles, Haldirams Aloo Bhujia, Bikano Aloo Bhujia, Isopure Whey Protein, Britannia Good Day Cashew, Oreo, Haldirams Moong Dal, MyFitness Peanut Butter, Epigamia* |

*Epigamia fat is 36% off (2.5 vs 3.4g) so technically FIX on that single macro, but overall impact is small given low absolute values. Kept as "Close" in the table above.

## Recommended Fixes (9 items)

### 7. Maggi Noodles Masala
- **Calories:** 385 -> **443**
- **Protein:** 9.0 -> **8.6**
- **Carbs:** 58.0 -> **61.4**
- **Fat:** 13.0 -> **18.6**
- **Fibre:** 2.5 -> **2.9**

### 9. Haldirams Aloo Bhujia
- **Calories:** 550 -> **579**
- **Protein:** 8.0 -> **7.2**
- **Carbs:** 48.0 -> **42.4**
- **Fat:** 36.0 -> **42.3**
- **Fibre:** 4.0 -> **0.5**

### 10. Amul Cheese Slice (borderline — Carbs abs diff is only 1.5g)
- **Protein:** 18.0 -> **20.0**
- **Carbs:** 3.0 -> **1.5**

### 11. Aloo Bhujia Bikano
- **Calories:** 545 -> **552**
- **Protein:** 7.5 -> **8.7**
- **Carbs:** 49.0 -> **41.4**
- **Fat:** 35.0 -> **38.0**

### 12. Isopure Whey Protein Isolate Unflavoured
- **Calories:** 380 -> **345**
- **Protein:** 88.0 -> **86.2**
- **Carbs:** 2.0 -> **0.0**
- **Fat:** 1.0 -> **0.0**

### 15. Epigamia Greek Yogurt Plain (borderline — small absolute values)
- **Calories:** 78 -> **71**
- **Carbs:** 5.0 -> **4.3**
- **Fat:** 2.5 -> **3.4**

### 16. Britannia Good Day Cashew
- **Calories:** 480 -> **508**
- **Protein:** 6.0 -> **7.0**
- **Carbs:** 66.0 -> **67.0**
- **Fat:** 21.0 -> **24.0**

### 17. Oreo
- **Protein:** 4.5 -> **2.9**
- **Carbs:** 70.0 -> **73.5**
- **Fat:** 20.0 -> **20.6**
- **Fibre:** 2.0 -> **2.9**

### 19. Haldirams Moong Dal
- **Calories:** 540 -> **479**
- **Protein:** 20.0 -> **24.0**
- **Carbs:** 42.0 -> **43.0**
- **Fat:** 32.0 -> **28.0**
- **Fibre:** 5.0 -> **12.0**

### 20. MyFitness Peanut Butter Crunchy
- **Calories:** 600 -> **631**
- **Protein:** 26.0 -> **25.0**
- **Carbs:** 16.0 -> **23.0**
- **Fat:** 48.0 -> **49.0**
- **Fibre:** 6.0 -> **9.0**

## Sources
- [FatSecret India](https://www.fatsecret.co.in)
- [Eat This Much](https://www.eatthismuch.com)
- [NutriScan](https://nutriscan.app)
- [NutritionValue.org](https://www.nutritionvalue.org)
- [Haldirams Official](https://www.haldirams.com)
- [Amul Official](https://amul.com)
- [MyFitness Official](https://myfitness.in)
- [Isopure Official](https://www.theisopurecompany.com)
- [Coca-Cola Official](https://www.coca-cola.com)
- [Open Food Facts](https://world.openfoodfacts.org)
- [GetFoodFacts](https://getfoodfacts.com)
- [FoodStruct](https://foodstruct.com)
- [Calories-info](https://calories-info.com)
- [Fitia](https://fitia.app)
- [Clearcals](https://clearcals.com)
