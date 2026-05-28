-- ============================================================================
-- HealthMate Food Library — Seed Part 6
-- Category: Restaurant-Style Variants of Popular Indian Dishes
--
-- Restaurant versions are richer than homemade — more butter, cream, oil, ghee.
-- The extra calories come primarily from FAT (cream, butter, ghee, oil).
-- Protein stays roughly the same. Carbs increase slightly (cream, sugar in
-- gravies). Fibre stays the same.
--
-- Multipliers applied (to total calories):
--   Paneer gravies:  ~1.5x
--   Chicken gravies: ~1.4x
--   Mutton gravies:  ~1.4x
--   Dals:            ~1.5x
--   Veg curries:     ~1.3x
--   Biryani:         ~1.2x
--   Naan:            ~1.1x
--   Egg/Fish:        ~1.4x
--   Others:          ~1.2–1.3x (varies)
--
-- All values per 100g. Serving sizes: 200g (curries/dals), 250g (biryani),
-- 80g (naan), 250g (pav bhaji), 300g (chole bhature).
-- Sources: Derived from homemade base values with restaurant-style adjustments
--          informed by USDA branded data (Haldiram's, MTR, Kohinoor) and
--          Indian nutrition databases.
-- 48 items total
-- ============================================================================

-- ============================================================================
-- PANEER GRAVIES — RESTAURANT STYLE (11 items)
-- Multiplier: ~1.5x calories. Extra calories allocated ~80% to fat, ~20% to carbs.
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
-- Palak Paneer: 130 → 195 cal (+65). Fat: 9.5 + 5.8 = 15.3. Carbs: 5.0 + 1.6 = 6.6
('Restaurant Palak Paneer', 195, 7.0, 6.5, 15.5, 1.8, 200, 'base', 'g'),
-- Paneer Butter Masala: 185 → 278 cal (+93). Fat: 14.5 + 8.3 = 22.8. Carbs: 7.0 + 2.3 = 9.3
('Restaurant Paneer Butter Masala', 278, 7.5, 9.5, 23.0, 1.0, 200, 'base', 'g'),
-- Shahi Paneer: 180 → 270 cal (+90). Fat: 13.5 + 8.0 = 21.5. Carbs: 7.0 + 2.3 = 9.3
('Restaurant Shahi Paneer', 270, 7.0, 9.5, 21.5, 0.8, 200, 'base', 'g'),
-- Kadai Paneer: 170 → 255 cal (~1.5x). Fat: 12.0 + 9.0 = 21.0. Carbs: 6.0 + 2.5 = 8.5
('Restaurant Kadai Paneer', 255, 8.0, 8.5, 21.0, 1.5, 200, 'base', 'g'),
-- Paneer Do Pyaza: 160 → 240 cal (~1.5x). Fat: 11.0 + 8.5 = 19.5. Carbs: 7.0 + 2.0 = 9.0
('Restaurant Paneer Do Pyaza', 240, 7.5, 9.0, 19.5, 1.5, 200, 'base', 'g'),
-- Paneer Tikka Masala: 180 → 270 cal (~1.5x). Fat: 13.0 + 9.0 = 22.0. Carbs: 7.5 + 2.5 = 10.0
('Restaurant Paneer Tikka Masala', 270, 8.0, 10.0, 22.0, 1.0, 200, 'base', 'g'),
-- Matar Paneer: 145 → 218 cal (~1.5x). Fat: 9.5 + 7.0 = 16.5. Carbs: 8.0 + 2.0 = 10.0
('Restaurant Matar Paneer', 218, 7.0, 10.0, 16.5, 2.5, 200, 'base', 'g'),
-- Paneer Lababdar: 185 → 278 cal (+93). Fat: 14.0 + 8.3 = 22.3. Carbs: 8.0 + 2.3 = 10.3
('Restaurant Paneer Lababdar', 278, 7.5, 10.5, 22.5, 1.0, 200, 'base', 'g'),
-- Paneer Pasanda: 195 → 290 cal (~1.49x). Fat: 15.0 + 9.5 = 24.5. Carbs: 8.0 + 2.5 = 10.5
('Restaurant Paneer Pasanda', 290, 7.5, 10.5, 24.5, 0.8, 200, 'base', 'g'),
-- Methi Matar Malai: 155 → 233 cal (~1.5x). Fat: 11.0 + 8.0 = 19.0. Carbs: 8.0 + 2.5 = 10.5
('Restaurant Methi Matar Malai', 233, 5.5, 10.5, 19.0, 2.0, 200, 'base', 'g'),
-- Paneer Masala: 165 → 248 cal (~1.5x). Fat: 11.5 + 8.5 = 20.0. Carbs: 6.5 + 2.5 = 9.0
('Restaurant Paneer Masala', 248, 7.5, 9.0, 20.0, 1.5, 200, 'base', 'g');

-- ============================================================================
-- CHICKEN GRAVIES — RESTAURANT STYLE (12 items)
-- Multiplier: ~1.4x calories (1.2x for biryani).
-- Extra calories allocated ~80% to fat, ~20% to carbs.
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
-- Butter Chicken: 175 → 245 cal (+70). Fat: 11.5 + 6.2 = 17.7. Carbs: 5.5 + 1.8 = 7.3
('Restaurant Butter Chicken', 245, 13.0, 7.5, 18.0, 0.6, 200, 'base', 'g'),
-- Chicken Masala: 150 → 210 cal (+60). Fat: 8.5 + 5.3 = 13.8. Carbs: 4.5 + 1.5 = 6.0
('Restaurant Chicken Masala', 210, 14.0, 6.0, 14.0, 1.0, 200, 'base', 'g'),
-- Chicken Tikka Masala: 165 → 231 cal (+66). Fat: 10.0 + 5.9 = 15.9. Carbs: 5.5 + 1.6 = 7.1
('Restaurant Chicken Tikka Masala', 231, 14.0, 7.0, 16.0, 0.8, 200, 'base', 'g'),
-- Kadai Chicken: 155 → 215 cal (~1.39x). Fat: 9.0 + 6.0 = 15.0. Carbs: 4.5 + 1.5 = 6.0
('Restaurant Kadai Chicken', 215, 14.0, 6.0, 15.0, 1.0, 200, 'base', 'g'),
-- Chicken Korma: 170 → 238 cal (+68). Fat: 12.0 + 6.0 = 18.0. Carbs: 6.0 + 1.7 = 7.7
('Restaurant Chicken Korma', 238, 12.0, 8.0, 18.0, 0.5, 200, 'base', 'g'),
-- Chicken Do Pyaza: 145 → 200 cal (~1.38x). Fat: 8.0 + 5.5 = 13.5. Carbs: 5.0 + 1.5 = 6.5
('Restaurant Chicken Do Pyaza', 200, 13.5, 6.5, 13.5, 1.0, 200, 'base', 'g'),
-- Chicken Saag: 140 → 194 cal (~1.39x). Fat: 8.0 + 5.5 = 13.5. Carbs: 4.0 + 1.5 = 5.5
('Restaurant Chicken Saag', 194, 13.0, 5.5, 13.5, 1.5, 200, 'base', 'g'),
-- Chicken Handi: 160 → 224 cal (+64). Fat: 10.5 + 5.7 = 16.2. Carbs: 5.0 + 1.6 = 6.6
('Restaurant Chicken Handi', 224, 12.5, 6.5, 16.0, 0.8, 200, 'base', 'g'),
-- Chicken Mughlai: 175 → 248 cal (~1.42x). Fat: 12.5 + 6.0 = 18.5. Carbs: 6.0 + 1.5 = 7.5
('Restaurant Chicken Mughlai', 248, 12.0, 7.5, 18.5, 0.5, 200, 'base', 'g'),
-- Chicken Curry: 140 → 193 cal (~1.38x). Fat: 7.5 + 5.5 = 13.0. Carbs: 4.0 + 1.5 = 5.5
('Restaurant Chicken Curry', 193, 13.5, 5.5, 13.0, 0.8, 200, 'base', 'g'),
-- Chicken Keema: 160 → 220 cal (~1.38x). Fat: 9.5 + 6.5 = 16.0. Carbs: 3.5 + 1.0 = 4.5
('Restaurant Chicken Keema', 220, 15.0, 4.5, 16.0, 0.5, 200, 'base', 'g'),
-- Chicken Biryani: 155 → 186 cal (1.2x, +31). Fat: 5.5 + 2.5 = 8.0. Carbs: 20.0 + 0.5 = 20.5
('Restaurant Chicken Biryani', 186, 8.5, 20.5, 8.0, 0.6, 250, 'base', 'g');

-- ============================================================================
-- MUTTON GRAVIES — RESTAURANT STYLE (7 items)
-- Multiplier: ~1.4x calories (1.2x for biryani).
-- Extra calories allocated ~80% to fat, ~20% to carbs.
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
-- Mutton Curry: 165 → 231 cal (+66). Fat: 10.0 + 5.9 = 15.9. Carbs: 4.0 + 1.6 = 5.6
('Restaurant Mutton Curry', 231, 15.0, 5.5, 16.0, 0.8, 200, 'base', 'g'),
-- Mutton Rogan Josh: 158 → 221 cal (+63). Fat: 9.0 + 5.6 = 14.6. Carbs: 4.5 + 1.6 = 6.1
('Restaurant Mutton Rogan Josh', 221, 15.5, 6.0, 14.5, 1.0, 200, 'base', 'g'),
-- Mutton Korma: 185 → 259 cal (+74). Fat: 13.0 + 6.6 = 19.6. Carbs: 5.5 + 1.8 = 7.3
('Restaurant Mutton Korma', 259, 13.5, 7.5, 19.5, 0.5, 200, 'base', 'g'),
-- Keema Matar: 155 → 217 cal (+62). Fat: 9.0 + 5.5 = 14.5. Carbs: 5.0 + 1.6 = 6.6
('Restaurant Keema Matar', 217, 14.0, 6.5, 14.5, 1.5, 200, 'base', 'g'),
-- Mutton Keema: 175 → 240 cal (~1.37x). Fat: 11.0 + 6.5 = 17.5. Carbs: 3.0 + 1.5 = 4.5
('Restaurant Mutton Keema', 240, 16.0, 4.5, 17.5, 0.5, 200, 'base', 'g'),
-- Bhuna Gosht: 180 → 252 cal (+72). Fat: 12.0 + 6.4 = 18.4. Carbs: 3.5 + 1.8 = 5.3
('Restaurant Bhuna Gosht', 252, 16.0, 5.5, 18.5, 0.5, 200, 'base', 'g'),
-- Mutton Biryani: 185 → 222 cal (1.2x, +37). Fat: 8.0 + 3.3 = 11.3. Carbs: 21.5 + 0.9 = 22.4
('Restaurant Mutton Biryani', 222, 8.0, 22.5, 11.5, 0.5, 250, 'base', 'g');

-- ============================================================================
-- DALS — RESTAURANT STYLE (3 items)
-- Multiplier: ~1.5x calories.
-- Restaurant dals get ghee/cream tadka, butter finish.
-- Extra calories allocated ~80% to fat, ~20% to carbs.
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
-- Dal Makhani: 125 → 186 cal (1.49x). Fat: 6.5 + 5.5 = 12.0. Carbs: 11.5 + 1.5 = 13.0
('Restaurant Dal Makhani', 186, 5.5, 13.0, 12.0, 3.0, 200, 'base', 'g'),
-- Dal Fry: 110 → 165 cal (+55). Fat: 5.0 + 4.9 = 9.9. Carbs: 11.0 + 1.4 = 12.4
('Restaurant Dal Fry', 165, 5.5, 12.5, 10.0, 2.5, 200, 'base', 'g'),
-- Dhaba Style Dal: 120 → 180 cal (+60). Fat: 6.0 + 5.3 = 11.3. Carbs: 12.0 + 1.5 = 13.5
('Restaurant Dhaba Style Dal', 180, 5.0, 13.5, 11.5, 2.5, 200, 'base', 'g');

-- ============================================================================
-- VEG CURRIES — RESTAURANT STYLE (6 items)
-- Multiplier: ~1.3x calories.
-- Extra calories allocated ~80% to fat, ~20% to carbs.
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
-- Chole Masala: 150 → 192 cal (1.28x). Fat: 6.5 + 4.0 = 10.5. Carbs: 16.0 + 1.0 = 17.0
('Restaurant Chole Masala', 192, 6.5, 17.0, 10.5, 4.5, 200, 'base', 'g'),
-- Rajma Masala: 140 → 180 cal (1.29x). Fat: 5.5 + 4.0 = 9.5. Carbs: 16.5 + 1.0 = 17.5
('Restaurant Rajma Masala', 180, 6.0, 17.5, 9.5, 5.0, 200, 'base', 'g'),
-- Malai Kofta: 195 → 254 cal (+59). Fat: 14.0 + 5.2 = 19.2. Carbs: 12.0 + 1.5 = 13.5
('Restaurant Malai Kofta', 254, 5.0, 13.5, 19.5, 1.5, 200, 'base', 'g'),
-- Navratan Korma: 160 → 208 cal (+48). Fat: 11.5 + 4.3 = 15.8. Carbs: 10.0 + 1.2 = 11.2
('Restaurant Navratan Korma', 208, 4.5, 11.0, 16.0, 1.5, 200, 'base', 'g'),
-- Mixed Veg Curry: 90 → 117 cal (+27). Fat: 5.0 + 2.4 = 7.4. Carbs: 8.5 + 0.7 = 9.2
('Restaurant Mixed Veg Curry', 117, 3.0, 9.0, 7.5, 2.5, 200, 'base', 'g'),
-- Kadhi Pakora: 100 → 130 cal (+30). Fat: 6.0 + 2.7 = 8.7. Carbs: 8.0 + 0.8 = 8.8
('Restaurant Kadhi Pakora', 130, 3.5, 9.0, 8.5, 1.0, 200, 'base', 'g');

-- ============================================================================
-- EGG CURRIES — RESTAURANT STYLE (2 items)
-- Multiplier: ~1.4x calories.
-- Extra calories allocated ~80% to fat, ~20% to carbs.
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
-- Egg Curry: 130 → 182 cal (+52). Fat: 8.5 + 4.6 = 13.1. Carbs: 5.0 + 1.3 = 6.3
('Restaurant Egg Curry', 182, 9.0, 6.5, 13.0, 0.8, 200, 'base', 'g'),
-- Egg Masala: 155 → 213 cal (~1.37x). Fat: 11.0 + 5.5 = 16.5. Carbs: 4.0 + 1.5 = 5.5
('Restaurant Egg Masala', 213, 10.0, 5.5, 16.5, 0.8, 200, 'base', 'g');

-- ============================================================================
-- FISH & PRAWN CURRIES — RESTAURANT STYLE (3 items)
-- Multiplier: ~1.4x calories.
-- Extra calories allocated ~80% to fat, ~20% to carbs.
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
-- Fish Curry: 115 → 161 cal (+46). Fat: 5.5 + 4.1 = 9.6. Carbs: 4.0 + 1.2 = 5.2
('Restaurant Fish Curry', 161, 13.0, 5.0, 9.5, 0.6, 200, 'base', 'g'),
-- Prawn Curry: 120 → 168 cal (+48). Fat: 5.0 + 4.3 = 9.3. Carbs: 4.5 + 1.2 = 5.7
('Restaurant Prawn Curry', 168, 14.0, 5.5, 9.5, 0.5, 200, 'base', 'g'),
-- Prawn Masala: 135 → 189 cal (+54). Fat: 6.5 + 4.8 = 11.3. Carbs: 4.0 + 1.4 = 5.4
('Restaurant Prawn Masala', 189, 15.0, 5.5, 11.5, 0.5, 200, 'base', 'g');

-- ============================================================================
-- OTHERS — RESTAURANT STYLE (4 items)
-- Pav Bhaji: ~1.3x, Chole Bhature: ~1.2x, Veg Biryani: ~1.2x, Naan: ~1.1x
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
-- Pav Bhaji: 175 → 228 cal (1.3x, +53). Fat: 8.0 + 4.7 = 12.7. Carbs: 22.0 + 1.3 = 23.3
('Restaurant Pav Bhaji', 228, 4.5, 23.5, 13.0, 2.5, 250, 'base', 'g'),
-- Chole Bhature: 300 → 358 cal (1.19x). Fat: 15.0 + 5.5 = 20.5. Carbs: 35.0 + 1.5 = 36.5
('Restaurant Chole Bhature', 358, 6.0, 36.5, 20.5, 3.0, 300, 'base', 'g'),
-- Veg Biryani: 155 → 186 cal (1.2x, +31). Fat: 5.5 + 2.8 = 8.3. Carbs: 23.5 + 0.8 = 24.3
('Restaurant Veg Biryani', 186, 3.5, 24.5, 8.5, 1.2, 250, 'base', 'g'),
-- Naan: 290 → 319 cal (1.1x, +29). Fat: 6.0 + 2.6 = 8.6. Carbs: 50.0 + 0.7 = 50.7
('Restaurant Naan', 319, 8.5, 51.0, 8.5, 2.0, 80, 'base', 'g');
