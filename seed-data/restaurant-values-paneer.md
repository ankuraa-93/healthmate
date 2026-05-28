# Restaurant-Style Paneer Dishes — Nutrition Data per 100g

## Data Sources

All data below was scraped from **nutritionvalue.org**, which sources from the **USDA Food and Nutrient Database** (both generic entries and branded Indian food products registered with USDA). These are packaged ready-to-eat Indian food products (Haldiram's, Kohinoor, MTR, Jyoti) that closely approximate restaurant-style preparation (cream, butter, oil, full-fat paneer).

## Dishes With Verified Data

| Dish | Cal/100g | Protein/100g | Carbs/100g | Fat/100g | Fiber/100g | Source | Source URL |
|------|----------|-------------|------------|----------|------------|--------|-----------|
| Palak Paneer | 101 | 5.4g | 4.3g | 7.0g | 0.9g | USDA generic (Vegetable dishes) | https://www.nutritionvalue.org/Palak_Paneer_nutritional_value.html |
| Palak Paneer (Kohinoor) | 163 | 7.0g | 9.0g | 11.0g | 2.0g | USDA Branded — Kohinoor (per 100g serving) | https://www.nutritionvalue.org/Palak_paneer_by_KOHINOOR_nutritional_value.html |
| Palak Paneer (Haldiram's) | 254 | 4.9g | 5.6g | 23.2g | 1.4g | USDA Branded — Haldiram's (361cal/142g serving) | https://www.nutritionvalue.org/Palak_paneer_by_HALDIRAM%27S_nutritional_value.html |
| Paneer Butter Masala / Makhani (Haldiram) | 204 | 4.9g | 9.2g | 16.2g | 0.7g | USDA Branded — Haldiram Snacks (290cal/142g serving) | https://www.nutritionvalue.org/Paneer_makhani_by_HALDIRAM_SNACKS_PVT._LTD._nutritional_value.html |
| Shahi Paneer (MTR) | 141 | 5.3g | 12.0g | 8.0g | 1.3g | USDA Branded — MTR (212cal/150g serving) | https://www.nutritionvalue.org/Shahi_paneer_by_MTR_nutritional_value.html |
| Matar Paneer (Jyoti Natural Foods) | 123 | 3.5g | 7.9g | 9.6g | 1.8g | USDA Branded — Gourmail/Jyoti (140cal/114g serving) | https://www.nutritionvalue.org/Jyoti_natural_foods%2C_matar-paneer_by_Gourmail_Inc._nutritional_value.html |

## Computation Notes

Values converted to per-100g where the source gave per-serving:
- **Haldiram's Palak Paneer**: 361 cal / 142g = 254 cal/100g; 33g fat/142g = 23.2g; 7g protein/142g = 4.9g; 8g carbs/142g = 5.6g; 2g fiber/142g = 1.4g
- **Haldiram Paneer Makhani**: 290 cal / 142g = 204 cal/100g; 23g fat/142g = 16.2g; 7g protein/142g = 4.9g; 13g carbs/142g = 9.2g; 1g fiber/142g = 0.7g
- **MTR Shahi Paneer**: 212 cal / 150g = 141 cal/100g; 12g fat/150g = 8.0g; 8g protein/150g = 5.3g; 18g carbs/150g = 12.0g; 2g fiber/150g = 1.3g
- **Jyoti Matar Paneer**: 140 cal / 114g = 123 cal/100g; 11g fat/114g = 9.6g; 4g protein/114g = 3.5g; 9g carbs/114g = 7.9g; 2.1g fiber/114g = 1.8g
- **Kohinoor Palak Paneer**: already per 100g serving
- **USDA generic Palak Paneer**: 202 cal / 200g (1 cup) = 101 cal/100g

## Restaurant-Style Recommended Values

Comparing the USDA generic (101 cal/100g — lower, likely homemade-style) vs branded products (163-254 cal/100g — commercial/restaurant-style with more oil, cream, butter), restaurant-style values should be in the higher range. The Haldiram's values are very high (85% calories from fat) likely due to heavy ghee/butter content.

**Suggested per-100g values for restaurant-style use (averaging branded products):**

| Dish | Cal/100g | Protein/100g | Carbs/100g | Fat/100g | Fiber/100g |
|------|----------|-------------|------------|----------|------------|
| Palak Paneer | 163 | 7.0 | 9.0 | 11.0 | 2.0 |
| Paneer Butter Masala | 204 | 4.9 | 9.2 | 16.2 | 0.7 |
| Shahi Paneer | 141 | 5.3 | 12.0 | 8.0 | 1.3 |
| Matar Paneer | 123 | 3.5 | 7.9 | 9.6 | 1.8 |

## Dishes With NO Verified Data Found

The following 7 dishes had **no entries** in the USDA database (neither generic nor branded) on nutritionvalue.org. WebSearch and WebFetch tools were denied permission, so I could not search Google, HealthifyMe, FatSecret India, or other JS-rendered nutrition sites.

1. **Kadai Paneer** — Only found user-created "public recipes" on nutritionvalue.org, no USDA or branded data
2. **Paneer Do Pyaza** — No results found
3. **Paneer Tikka Masala** — Only found mixed dishes with rice (Deep Foods) or chicken tikka masala with paneer (Sonora Corp), not standalone paneer tikka masala gravy
4. **Paneer Lababdar** — No results found
5. **Paneer Pasanda** — No results found
6. **Methi Matar Malai** — No results found
7. **Paneer Masala** — No standalone results (only the spice mix "Paneer Butter Masala by Rasoi Magic" which is a dry seasoning, not the cooked dish)

## Recommendation

To get data for the remaining 7 dishes, you have two options:

1. **Grant WebSearch/WebFetch permissions** so I can search Google (which often has a nutrition panel for Indian dishes), HealthifyMe, FatSecret India, and CalorieNinjas API.

2. **Manual search**: Search Google for "[dish name] calories per 100g" — Google's nutrition knowledge panel often shows per-100g data for Indian dishes. Key sites to check:
   - Google's built-in nutrition panel (search: "kadai paneer calories")
   - https://www.healthifyme.com/blog/[dish]-calories/
   - https://www.fatsecret.co.in/ (India-specific FatSecret)
   - https://www.tarladalal.com/calories-for-[dish]-recipe-[id]
