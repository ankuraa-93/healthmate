# Nutrition Data Validation — Our Seed vs Web Sources

## How to read this table
- **Our Seed**: values we generated for the seed SQL (per 100g)
- **Web Sources**: values found via Google search from nutrition databases
- **Delta**: how far off our seed is from web consensus
- **Verdict**: OK / Needs Fix / Add Restaurant Variant

---

## Comparison Table

| Dish | Our Cal | Our P/C/F | Web Cal (range) | Web Source & Notes | Verdict |
|------|---------|-----------|-----------------|-------------------|---------|
| **Palak Paneer** | 130 | 7/5/9.5 | 96–192 | nutritionvalue.org: 96 (light), Kohinoor brand: 163, NutriScan: 192 (rich) | Our 130 is reasonable for homemade. **Add restaurant variant ~190** |
| **Paneer Butter Masala** | 185 | 7.5/7/14.5 | 113–260 | MTR brand: 113, snapcalorie: 197, restaurant: 260. Homemade range: 180-200 | Our 185 is good for homemade. **Add restaurant variant ~250** |
| **Butter Chicken** | 175 | 13/5.5/11.5 | 119–320 | arise-app: 130, calories-info: 240-320 (restaurant). Huge range. | Our 175 is good for homemade. **Add restaurant variant ~240** |
| **Chicken Biryani** | 175 | 8.5/22/6.5 | 131–168 | nutritionvalue.org: 131, arise-app: 168, fitia: 131 | **Our 175 is slightly high.** Consider 150-160. Add restaurant variant ~190 |
| **Dal Makhani** | 140 | 5.5/11.5/8 | 113–200 | Truly Indian: 120, MTR: 113, Haldiram's: 133-200. Restaurant: 180-220 | **Our 140 is slightly high for homemade** (most sources say 115-135). Add restaurant variant ~190 |
| **Chole Masala** | 150 | 6.5/16/6.5 | 140–164 | hitungkalori: 164, snapcalorie: 140, general: ~150 | **Our 150 is spot on.** Add restaurant variant ~180 |
| **Rajma Masala** | 140 | 6/16.5/5.5 | 88–147 | MTR: 94, Aashirvaad: 147, Gits: 127, homemade: ~88 | **Our 140 is on higher end but acceptable** (closer to Aashirvaad). Add restaurant variant ~165 |
| **Kadai Chicken** | 155 | 14/4.5/9 | 148–214 | Bombay Kitchen: 214, snapcalorie calc: ~150/100g from cup data | Our 155 is reasonable for homemade. **Add restaurant variant ~210** |
| **Mutton Rogan Josh** | 158 | 15.5/4.5/9 | ~280 | spelt.lt: 280 (seems high, likely includes bone-in weight or rich recipe) | **Our 158 seems reasonable for homemade.** 280 may be a very rich version. Add restaurant variant ~220 |
| **Malai Kofta** | 195 | 5/12/14 | 188–197 | clearcals: 188, Haldiram's: 197, restaurant: 250+ | **Our 195 matches almost exactly.** Add restaurant variant ~260 |
| **Naan** | 290 | 8.5/50/6 | 262–310 | foodstruct: 291, calorieslism: 262, shellel: 286. Restaurant (with butter): ~310 | **Our 290 is spot on.** Add restaurant variant ~320 (butter naan) |
| **Fish Curry** | 115 | 13/4/5.5 | 97–120 | Kerala Fish Curry: 97, nutritionvalue.org: ~120, general: 97-120 | **Our 115 is good.** Middle of range. |

---

## Summary

### Items that match well (no change needed):
- Chole Masala (150 vs 140-164 web) ✓
- Malai Kofta (195 vs 188-197 web) ✓
- Naan (290 vs 262-310 web) ✓
- Fish Curry (115 vs 97-120 web) ✓
- Palak Paneer (130 — within range for homemade) ✓
- Paneer Butter Masala (185 — good for homemade) ✓
- Butter Chicken (175 — good for homemade) ✓
- Kadai Chicken (155 — good for homemade) ✓
- Rajma Masala (140 — acceptable) ✓

### Items to tweak:
- **Chicken Biryani**: 175 → **155** (most sources say 131-168, midpoint ~150)
- **Dal Makhani**: 140 → **125** (most sources say 113-135 for homemade)

### Restaurant variants to add (~48 items):
Based on the web data, restaurant versions are typically **40-70% higher in calories** than homemade, mainly from added cream, butter, and oil.

**Proposed restaurant multiplier by dish type:**
- Paneer gravies: ~1.5x homemade (more cream, cashew paste, butter)
- Chicken gravies: ~1.4x homemade (more oil, cream)
- Mutton gravies: ~1.4x homemade
- Dals: ~1.5x homemade (ghee, cream tadka)
- Veg curries: ~1.3x homemade (more oil)
- Biryani: ~1.2x (more ghee, fried onions)
- Naan: ~1.1x (extra butter brushing)

---

## Sources
- [nutritionvalue.org — Palak Paneer](https://www.nutritionvalue.org/Palak_Paneer_72125310_nutritional_value.html)
- [Tarla Dalal — Paneer Butter Masala](https://www.tarladalal.com/calories-for-paneer-butter-masala-38973)
- [calories-info.com — Butter Chicken](https://calories-info.com/butter-chicken-calories-kcal/)
- [nutritionvalue.org — Chicken Biryani](https://www.nutritionvalue.org/Biryani_with_chicken_27243100_nutritional_value.html)
- [FatSecret India — Dal Makhani](https://www.fatsecret.co.in/calories-nutrition/search?q=Dal+Makhani)
- [hitungkalori.com — Chole Masala](https://hitungkalori.com/in/calories/chole-masala/)
- [FatSecret India — Rajma Masala](https://www.fatsecret.co.in/calories-nutrition/mtr/rajma-masala/100g)
- [eatthismuch.com — Kadai Chicken](https://www.eatthismuch.com/food/nutrition/kadai-chicken,2102731/)
- [spelt.lt — Mutton Rogan Josh](https://spe.lt/nutrition/mutton-rogan-josh)
- [clearcals.com — Malai Kofta](https://clearcals.com/recipes/malai-kofta/)
- [foodstruct.com — Naan](https://foodstruct.com/food/naan)
- [nutritionvalue.org — Fish Curry](https://www.nutritionvalue.org/Fish_curry_27150320_nutritional_value.html)
- [FatSecret India — Fish Curry](https://www.fatsecret.co.in/calories-nutrition/search?q=Fish+Curry)
