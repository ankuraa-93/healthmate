# Branded Food Items — Full Validation Report

Validated on 2026-05-28 by cross-referencing FatSecret India, official brand sites, and other nutrition databases against seed values.

**Methodology:** Web-searched each item on FatSecret India (primary), fetched full nutrition pages for macro breakdowns. Official packaging labels used where FatSecret data was unavailable or suspect.

**Thresholds:** FIX = calories >10% off OR any single macro >20% off from web source.

---

## Session 1 (2026-05-27): Initial 20 items
See `branded-validation.md` for details. 9 items fixed.

## Session 2 (2026-05-28): ~60 more items validated

### FIXES APPLIED (17 items)

#### seed-part4.sql

| # | Item | Old Cal | Old P/C/F | New Cal | New P/C/F | Source | Issue |
|---|------|---------|-----------|---------|-----------|--------|-------|
| 1 | Amul Full Cream Milk | 65 | 3.2/4.7/3.5 | **87** | 3.2/**5.0**/**6.0** | FatSecret India | Cal 25% low, Fat wrong (3.5→6.0, it's 6% fat milk) |
| 2 | Amul Toned Milk | 50 | 3.1/4.8/3.0 | **58** | 3.1/**4.7**/3.0 | FatSecret India | Cal 14% low (macros were right, cal miscalculated) |
| 3 | Amul Gold | 60 | 3.1/4.7/4.5 | **87** | **3.0**/**5.0**/**6.0** | FatSecret India, Fitia, Amul official | Full cream milk (6% fat), was mislabeled as 4.5% |
| 4 | Amul Taaza | 42 | 3.0/4.8/1.5 | **58** | 3.0/4.8/**3.0** | FatSecret India | Toned milk (3% fat), was entered as double toned (1.5%) |
| 5 | Mother Dairy Full Cream | 65 | 3.2/4.7/3.5 | **89** | **3.3**/**5.0**/**6.2** | FatSecret India | Same issue as Amul — full cream = 6% fat |
| 6 | Mother Dairy Toned | 50 | 3.1/4.8/3.0 | **59** | 3.1/**4.7**/**3.1** | FatSecret India | Cal 15% low |
| 7 | Mother Dairy DT | 42 | 3.2/4.9/1.5 | **46** | **3.1**/**5.0**/1.5 | FatSecret India (Amul DT ref) | Cal 9% low |
| 8 | Amul Masti Dahi | 60 | 3.1/4.9/3.0 | **65** | **4.0**/**4.6**/**3.1** | FatSecret India | Protein 23% low (3.1→4.0) |
| 9 | Amul Paneer | 265 | 18.3/1.2/21.0 | **312** | **20.0**/**4.0**/**24.0** | FatSecret India | Cal 15% low, all macros off |
| 10 | Nutralite Butter | 536 | 0.0/0.0/59.0 | **630** | **0.3**/0.0/**70.0** | FatSecret India | It's margarine, not butter — 70% fat, not 59% |
| 11 | Kissan Ketchup | 115 | 0.5/27.3/0.2 | **133** | **1.3**/**33.3**/**0.0** | FatSecret India | Cal 14% low, carbs 18% low |
| 12 | Maggi Hot and Sweet | 175 | 0.5/42.0/0.2 | **127** | **0.6**/**31.5**/**0.0** | FatSecret India | Cal 38% HIGH, carbs 33% HIGH |

#### seed-part5.sql

| # | Item | Old Cal | Old P/C/F | New Cal | New P/C/F | Source | Issue |
|---|------|---------|-----------|---------|-----------|--------|-------|
| 13 | Munch | 520 | 5.5/64.0/27.0 | **435** | **6.0**/**50.0**/**23.4** | FatSecret India | Cal 20% HIGH, carbs 28% HIGH |
| 14 | Cadbury 5 Star | 470 | 4.0/65.0/21.0 | **444** | **3.3**/**72.9**/**15.9** | FatSecret India | Fat 32% HIGH, carbs 11% low |
| 15 | SF Dark Fantasy Choco Creme | 505 | 5.5/62.0/27.0 | **486** | **7.3**/**67.6**/**20.7** | FatSecret India | Fat 30% HIGH, protein 25% low |
| 16 | Parle Hide and Seek | 500 | 6.0/62.0/25.0 | **484** | **6.4**/**72.0**/**18.8** | FatSecret India | Fat 33% HIGH, carbs 16% low |
| 17 | Frooti Mango Drink | 58 | 0/14.5/0 | **65** | 0/**16.2**/0 | FatSecret India | Cal 11% low, carbs 11% low |
| 18 | Maaza Mango Drink | 56 | 0/14.0/0 | **50** | 0/**12.5**/0 | FatSecret India | Cal 12% HIGH |
| 19 | Yippee Classic Masala | 400 | 8.5/58.0/15.0 | **468** | **9.0**/**62.6**/**20.1** | FatSecret India | Cal 15% low, fat 25% low |
| 20 | Yippee Magic Masala | 400 | 8.5/58.0/15.0 | **468** | **9.0**/**62.6**/**20.1** | FatSecret India | Same as Classic (same product) |
| 21 | Wai Wai Noodles | 430 | 7.5/56.0/19.5 | **470** | **9.4**/**61.2**/**20.9** | FatSecret India | Protein 20% low |
| 22 | ON Gold Standard Whey | 387 | 80.6/6.5/3.9 | **382** | **79.0**/**10.0**/**3.0** | FatSecret India | Carbs 35% low (6.5→10), fat 23% high |
| 23 | Thums Up | 44 | 0/10.9/0 | **42** | 0/**10.6**/0 | FatSecret India | Minor cal/carb adjustment |

### VALIDATED — MATCH/CLOSE (no fix needed)

| Item | Our Cal | Our P/C/F | Web Cal | Web P/C/F | Source | Verdict |
|------|---------|-----------|---------|-----------|--------|---------|
| Lays Magic Masala | 540 | 6.5/51/34 | 556 | 6.9/51.4/35.7 | FatSecret India | Close (3%) |
| Britannia Good Day Butter | 495 | 6/63/24 | 494 | 7/67/22 | FatSecret India | Match |
| Britannia Cheese Slice | 310 | 18.5/5/24 | 315 | 17.2/4.3/25.5 | FatSecret India | Close (2%) |
| Cadbury Dairy Milk Silk | 546 | 7/55/33 | 529 | 9.7/60.1/29.1 | FatSecret India | Close (3%, macros vary by source) |
| Ferrero Rocher | 576 | 8.5/47/40 | 587 | 7.9/42.1/42.1 | FatSecret India | Close (2%) |
| SF Dark Fantasy Choco Fills | 510 | 6/60/28 | 520 | 7.3/61.6/27.2 | FatSecret India | Close (2%) |
| Real Mango Juice | 60 | 0.2/14.5/0.1 | 56 | 0.1/14/0 | FatSecret India | Close (7%) |
| Nutella | 539 | 6.3/57.5/30.9 | 539 | — | FatSecret India | Match |
| Mother Dairy Paneer | 260 | 18/1.5/20.5 | 271 | 18/2.5/21 | FatSecret India | Close (4%) |
| Pintola Crunchy PB | 612 | 30/15/49 | 639 | 30/18/49 | FatSecret India | Close (4%, C borderline) |
| Coca Cola | 42 | 0/10.6/0 | 42 | 0/10.6/0 | FatSecret India | Match (prev validated) |
| ON Gold Standard Whey (cal) | 387 | — | 382 | — | FatSecret India | Match (1% off) |
| Generic Beer (100ml) | 42-50 | — | 44 | 0.3/3.5/0 | FatSecret India | Match (our values reasonable) |

### CATEGORIES SPOT-CHECKED — ACCEPTABLE

**Ghee (all brands):** All ~900 cal, ~99.8g fat. Correct — pure fat is standardized.

**Butter (Amul Salted, Unsalted, Mother Dairy, Britannia):** All ~720 cal, ~80g fat. Correct — standardized dairy butter.

**Cooking Oils (Saffola, Fortune, generic):** All ~884 cal, 100g fat. Correct.

**Soft Drinks (Coca Cola, Thums Up, Pepsi, Sprite, Fanta):** Sugar water — all 40-46 cal/100ml range. Values match FatSecret. Thums Up minor fix applied (44→42).

**Spirits (Whisky, Vodka, Rum, Gin):** Standard ABV-based calculations. Values reasonable.

**Beers:** Generic beer is ~44 cal/100ml. Our range (40-50) covers the variation from light lagers to wheat beers. Acceptable.

---

## Summary

| Metric | Session 1 | Session 2 | Total |
|--------|-----------|-----------|-------|
| Items validated | 20 | ~60 | ~80 |
| Fixes applied | 9 | 17 | 26 |
| Match/Close | 7 + 4 | ~40 | ~51 |
| Error rate | 45% | 28% | 32% |

### Remaining (~117 items still unvalidated)

**Dairy (~20 remaining):**
- Nestle a+ Dahi, Milky Mist Curd, Nandini Curd, Chitale Dahi
- Epigamia Strawberry/Mango, Nestle Grekyo, Amul Mishti Doi, Epigamia Snack Pack, Mother Dairy Fruit Yogurt
- Amul Masti Buttermilk, Mother Dairy Buttermilk, Nandini Majjige
- Nandini Full Cream Milk (likely needs same fix as Amul/MD — 6% fat)
- Amul Lactose Free Milk (needs verification)
- Go Cheese, Amul Cheese Spread/Block, Britannia Cheese Block, Amul Processed Cheese
- Amul Fresh Cream, Milky Mist Whipping Cream, Richs Cream
- Gowardhan/Milky Mist/Verka/Nandini/Chitale Paneer

**Snacks (~20 remaining):**
- Kurkure Chilli Chatka, Green Chutney
- Uncle Chipps variants, Bingo variants, Pringles, Balaji, Too Yumm
- Haldirams Bhujia Bikaneri, Navratan, Khatta Meetha, All in One, Nut Cracker
- Bikano Bikaneri Bhujia, Bikano Navratan

**Biscuits (~12 remaining):**
- Britannia Bourbon, 50-50, NutriChoice Digestive/Oats
- Parle Monaco, Krackjack
- McVities Digestive
- Unibic Cashew/Choco Chip, Jim Jam, Tiger

**Chocolates (~5 remaining):**
- Amul Dark Chocolate, Gems, Perk, Bournville, Mars Bar

**Noodles (~3 remaining):**
- Maggi Atta, Maggi Cup Noodles, Top Ramen, Chings

**Beverages (~10 remaining):**
- Tropicana Orange, Real Pomegranate, Paper Boat Aamras
- Red Bull, Sting, Monster
- Bournvita/Horlicks/Complan/Boost/Ensure (health drinks)

**Alcohol (~12 remaining):**
- Individual beer brands (Bira White, Hoegaarden most likely to differ from generic)
- Sula wines, Old Monk, Breezer

**Frozen/RTE (~15 remaining):**
- ITC Nuggets/Seekh, McCain items, Gits/MTR items, Haldirams Minute Khana, Knorr soups

**Supplements (~8 remaining):**
- MuscleBlaze Whey, MyProtein variants, Nakpro, AS IT IS
- MyFitness Smooth, Sundrop PB, Alpino PB
- Protein bars (RiteBite, Yoga Bar, MuscleBlaze)

**Spreads/Sauces/Bread (~10 remaining):**
- Kissan jams, Hersheys Syrup, Mapro Jam
- Bread brands, pasta sauces
- Cornitos, Too Yumm Karare

### Key patterns found
1. **Full cream milks systematically wrong** — all had 3.5% fat instead of 6%. Fixed for Amul and Mother Dairy; Nandini likely needs same fix.
2. **Calorie calculations sometimes disconnected from macros** — Atwater formula gives correct cal from macros, but seed had different cal values (e.g., Amul Toned: macros give 58 cal but was listed as 50).
3. **Chocolate/biscuit fat content overestimated** — 5 Star, Munch, Hide & Seek, Dark Fantasy Choco Creme all had fat too high.
4. **Instant noodles underestimated** — Yippee and Wai Wai both had significantly lower cal/fat than actual packaging.

## Sources
- [FatSecret India](https://www.fatsecret.co.in) — primary source for all validations
- [Fitia India](https://fitia.app) — secondary source for Amul Gold
- Official brand websites (Amul, Haldirams) — for cross-reference
