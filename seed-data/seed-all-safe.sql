-- ============================================================================
-- HealthMate Food Library — Seed Part 1
-- Categories covered:
--   1. Breakfast Dishes (items 1–55)
--   2. Curries & Gravies — Veg (items 56–100)
--   3. Dals & Lentils (items 101–120)
--
-- All values are per 100g (solids) or per 100ml (liquids).
-- Sources: IFCT 2017, USDA FoodData Central, Tarla Dalal.
-- serving_size_g = typical single-serve portion in grams.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. BREAKFAST DISHES (55 items)
-- ────────────────────────────────────────────────────────────────────────────

-- Parathas (items 1–10)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Aloo Paratha',        220, 4.5, 28.0, 10.0, 1.8, 120, 'base', 'g'),
('Paneer Paratha',      245, 8.0, 26.0, 12.0, 1.5, 120, 'base', 'g'),
('Methi Paratha',       210, 5.0, 27.0,  9.5, 2.5, 120, 'base', 'g'),
('Gobi Paratha',        215, 4.5, 27.5,  9.8, 2.2, 120, 'base', 'g'),
('Mooli Paratha',       205, 4.2, 27.0,  9.0, 2.0, 120, 'base', 'g'),
('Pyaaz Paratha',       218, 4.5, 28.0,  9.8, 1.6, 120, 'base', 'g'),
('Paneer Shimla Mirch Paratha', 240, 7.5, 26.5, 11.5, 1.8, 120, 'base', 'g'),
('Plain Paratha',       260, 5.5, 32.0, 12.5, 1.5, 80, 'base', 'g'),
('Laccha Paratha',      290, 5.0, 33.0, 15.5, 1.3, 90, 'base', 'g'),
('Egg Paratha',         235, 8.5, 25.0, 11.0, 1.4, 130, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- Chillas & Pancakes (items 11–14)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Suji Chilla',         160, 4.5, 22.0,  6.0, 1.0, 100, 'base', 'g'),
('Besan Chilla',        175, 7.0, 18.0,  8.5, 3.0, 100, 'base', 'g'),
('Moong Dal Chilla',    150, 8.5, 17.0,  5.0, 2.5, 100, 'base', 'g'),
('Oats Chilla',         155, 6.0, 19.0,  6.0, 2.8, 100, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- South Indian Breakfast (items 15–25)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Idli',                130, 3.5, 24.0,  1.5, 1.0, 40, 'base', 'g'),
('Dosa (Plain)',        165, 4.0, 25.0,  5.5, 0.8, 80, 'base', 'g'),
('Masala Dosa',         175, 4.2, 22.0,  7.5, 1.5, 150, 'base', 'g'),
('Onion Dosa',          180, 4.0, 24.0,  7.0, 1.2, 100, 'base', 'g'),
('Rava Dosa',           190, 3.5, 23.0,  9.0, 0.8, 100, 'base', 'g'),
('Uttapam',             170, 4.5, 24.0,  6.0, 1.5, 120, 'base', 'g'),
('Medu Vada',           250, 7.0, 22.0, 15.0, 2.0, 50, 'base', 'g'),
('Pongal (Ven)',        145, 4.0, 18.0,  6.0, 0.8, 200, 'base', 'g'),
('Pesarattu',           145, 7.5, 18.0,  4.5, 2.5, 100, 'base', 'g'),
('Appam',               140, 2.5, 25.0,  3.0, 0.5, 60, 'base', 'g'),
('Puttu',               210, 4.0, 35.0,  6.0, 2.5, 150, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- Other Breakfast (items 26–43)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Poha',                155, 3.0, 23.0,  5.5, 1.2, 200, 'base', 'g'),
('Upma',                130, 3.5, 18.0,  5.0, 1.5, 200, 'base', 'g'),
('Sabudana Khichdi',    185, 2.0, 30.0,  7.0, 0.5, 200, 'base', 'g'),
('Daliya Porridge',     100, 3.5, 17.0,  2.0, 2.5, 250, 'base', 'g'),
('Oats Porridge',        70, 2.5, 12.0,  1.5, 1.5, 250, 'base', 'g'),
('Sprouts Salad',        85, 5.5, 12.0,  1.0, 4.0, 150, 'base', 'g'),
('Bread Toast with Butter', 310, 7.0, 38.0, 14.0, 2.0, 50, 'base', 'g'),
('Bread Omelette',      195, 10.0, 18.0,  9.5, 1.0, 180, 'base', 'g'),
('French Toast',        230, 7.5, 25.0, 11.0, 0.8, 100, 'base', 'g'),
('Vegetable Sandwich',  180, 5.0, 24.0,  7.0, 2.5, 150, 'base', 'g'),
('Chicken Sandwich',    215, 12.0, 22.0,  8.5, 1.5, 180, 'base', 'g'),
('Pav Bhaji',           190, 4.5, 24.0,  8.5, 2.5, 300, 'base', 'g'),
('Chole Bhature',       275, 7.0, 30.0, 14.0, 3.0, 250, 'base', 'g'),
('Misal Pav',           175, 6.5, 22.0,  7.0, 3.5, 300, 'base', 'g'),
('Dhokla',              160, 5.5, 22.0,  5.0, 1.5, 80, 'base', 'g'),
('Khandvi',             150, 5.0, 15.0,  7.5, 1.0, 80, 'base', 'g'),
('Thepla',              240, 6.0, 30.0, 10.5, 2.5, 50, 'base', 'g'),
('Anda Bhurji Pav',     195, 10.0, 16.0, 10.0, 1.2, 250, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- Cereals (items 44–52)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Kelloggs Cornflakes with Milk', 105, 3.5, 19.0,  1.5, 0.5, 250, 'base', 'g'),
('Kelloggs Chocos with Milk',     120, 3.0, 21.0,  2.5, 1.0, 250, 'base', 'g'),
('Kelloggs Muesli',               370, 9.0, 66.0,  7.5, 6.5, 50, 'base', 'g'),
('Bagrrys Muesli',                365, 10.0, 63.0,  8.0, 7.0, 50, 'base', 'g'),
('Yogabar Muesli',                380, 11.0, 60.0,  9.5, 7.5, 50, 'base', 'g'),
('Granola',                       440, 10.0, 58.0, 18.0, 6.0, 50, 'base', 'g'),
('Quaker Oats',                   367, 13.0, 62.0,  7.0, 10.0, 40, 'base', 'g'),
('Saffola Masala Oats',           370, 12.0, 60.0,  8.5, 8.5, 40, 'base', 'g'),
('Saffola Oats',                  370, 13.5, 62.0,  7.5, 9.5, 40, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- Protein Breakfast (items 53–55)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Egg White Omelette',   70, 11.0,  1.0,  2.5, 0.0, 120, 'base', 'g'),
('Scrambled Eggs',      155, 10.5,  1.5, 12.0, 0.0, 130, 'base', 'g'),
('Overnight Oats',      135,  5.0, 20.0,  4.0, 2.5, 250, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- 2. CURRIES & GRAVIES — VEG (45 items)
-- ────────────────────────────────────────────────────────────────────────────

-- Paneer Curries (items 56–67)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Palak Paneer',        130, 7.0,  5.0,  9.5, 1.8, 200, 'base', 'g'),
('Paneer Butter Masala', 185, 7.5,  7.0, 14.5, 1.0, 200, 'base', 'g'),
('Paneer Masala',        160, 7.5,  6.5, 12.0, 1.2, 200, 'base', 'g'),
('Shahi Paneer',         190, 7.0,  7.5, 15.0, 0.8, 200, 'base', 'g'),
('Kadai Paneer',         175, 8.0,  6.0, 13.0, 1.5, 200, 'base', 'g'),
('Paneer Do Pyaza',      165, 7.5,  7.0, 12.0, 1.3, 200, 'base', 'g'),
('Paneer Tikka Masala',  180, 8.5,  7.0, 13.0, 1.5, 200, 'base', 'g'),
('Matar Paneer',         145, 7.0,  7.5, 10.0, 2.0, 200, 'base', 'g'),
('Paneer Lababdar',      185, 7.0,  8.0, 14.0, 1.0, 200, 'base', 'g'),
('Paneer Bhurji',        195, 10.0,  5.0, 15.0, 1.2, 150, 'base', 'g'),
('Paneer Pasanda',       200, 8.0,  8.5, 15.0, 0.8, 200, 'base', 'g'),
('Methi Matar Malai',    155, 5.5,  8.0, 11.5, 2.0, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- Legume Curries (items 68–74)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Chole Masala',        150, 6.5, 16.0,  6.5, 4.5, 200, 'base', 'g'),
('Rajma Masala',        140, 6.0, 16.5,  5.5, 5.0, 200, 'base', 'g'),
('Chana Masala',        145, 6.0, 16.0,  6.0, 4.5, 200, 'base', 'g'),
('Kala Chana Curry',    140, 7.0, 17.0,  4.5, 5.5, 200, 'base', 'g'),
('Lobia Curry',         125, 6.5, 16.0,  4.0, 4.0, 200, 'base', 'g'),
('Soya Chunk Curry',    145, 12.0, 8.0,  7.0, 2.5, 200, 'base', 'g'),
('Soya Granule Curry',  140, 11.5, 8.5,  6.5, 2.0, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- Mushroom Curries (items 75–78)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Mushroom Masala',     105, 3.5, 6.5,  7.5, 1.5, 200, 'base', 'g'),
('Mushroom Matar',      100, 4.0, 7.5,  6.0, 2.0, 200, 'base', 'g'),
('Palak Mushroom',       95, 4.0, 5.5,  6.5, 2.0, 200, 'base', 'g'),
('Kadai Mushroom',      110, 3.5, 6.5,  7.5, 1.5, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- Aloo Curries (items 79–82)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Dum Aloo',            140, 3.0, 14.0,  8.0, 1.5, 200, 'base', 'g'),
('Aloo Matar',          115, 3.5, 13.0,  5.5, 2.5, 200, 'base', 'g'),
('Aloo Palak',          110, 3.5, 11.0,  6.0, 2.5, 200, 'base', 'g'),
('Aloo Mutter Gobi',    105, 3.5, 12.0,  5.0, 2.5, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- Rich / Restaurant-style (items 83–91)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Malai Kofta',         195, 5.0, 12.0, 14.0, 1.5, 200, 'base', 'g'),
('Navratan Korma',      165, 4.5, 10.0, 12.0, 2.0, 200, 'base', 'g'),
('Vegetable Korma',     130, 3.5, 10.0,  9.0, 2.0, 200, 'base', 'g'),
('Veg Kofta',           180, 4.5, 13.0, 12.5, 1.5, 200, 'base', 'g'),
('Kadhi Pakora',        115, 4.0, 8.5,  7.0, 1.0, 200, 'base', 'g'),
('Mixed Veg Curry',      95, 3.0, 9.0,  5.5, 2.5, 200, 'base', 'g'),
('Baby Corn Masala',    100, 3.0, 8.0,  6.5, 2.0, 200, 'base', 'g'),
('Stuffed Capsicum Curry', 120, 4.0, 10.0, 7.0, 2.0, 200, 'base', 'g'),
('Corn Palak',          115, 4.0, 10.0,  6.5, 2.5, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- Other Veg Curries (items 92–100)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Tinda Masala',         80, 2.0, 7.0,  5.0, 1.5, 200, 'base', 'g'),
('Arbi Masala',         120, 2.5, 14.0,  6.0, 2.0, 200, 'base', 'g'),
('Parwal Curry',         85, 2.0, 7.5,  5.5, 2.0, 200, 'base', 'g'),
('Kathal Curry',        105, 2.5, 12.0,  5.5, 2.5, 200, 'base', 'g'),
('Gatte ki Sabzi',      140, 5.0, 12.0,  8.0, 2.0, 200, 'base', 'g'),
('Ker Sangri',          100, 3.5, 8.0,  6.0, 3.5, 150, 'base', 'g'),
('Dahi Aloo',           115, 3.0, 12.0,  6.0, 1.5, 200, 'base', 'g'),
('Aloo Capsicum Curry', 100, 2.5, 11.0,  5.5, 2.0, 200, 'base', 'g'),
('Palak Corn',          110, 4.0, 9.5,  6.5, 2.5, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- 3. DALS & LENTILS (20 items)
-- ────────────────────────────────────────────────────────────────────────────

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Dal Tadka',            105, 5.5, 11.0,  4.5, 2.5, 200, 'base', 'g'),
('Masoor Dal',            95, 5.5, 11.5,  3.0, 2.0, 200, 'base', 'g'),
('Moong Dal',             90, 6.0, 10.5,  2.5, 1.5, 200, 'base', 'g'),
('Chana Dal',            115, 6.5, 13.0,  4.0, 3.5, 200, 'base', 'g'),
('Urad Dal',             110, 6.0, 12.0,  4.0, 2.5, 200, 'base', 'g'),
('Palak Dal',            100, 6.0, 10.0,  3.5, 2.5, 200, 'base', 'g'),
('Dal Makhani',          125, 5.5, 11.5,  6.5, 3.0, 200, 'base', 'g'),
('Dal Fry',              110, 5.5, 11.0,  5.0, 2.5, 200, 'base', 'g'),
('Panchmel Dal',         105, 5.5, 11.5,  4.0, 2.5, 200, 'base', 'g'),
('Masoor Dal Sabut',     100, 6.0, 12.0,  3.0, 3.0, 200, 'base', 'g'),
('Sambhar',               65, 3.0, 8.0,  2.5, 2.0, 200, 'base', 'g'),
('Rasam',                 30, 1.0, 4.0,  1.0, 0.5, 200, 'base', 'ml'),
('Khichdi',              110, 4.0, 16.0,  3.0, 1.5, 250, 'base', 'g'),
('Moong Dal Khichdi',    105, 4.5, 15.0,  3.0, 1.5, 250, 'base', 'g'),
('Bajra Khichdi',        120, 4.0, 17.0,  4.0, 2.5, 250, 'base', 'g'),
('Tadka Moong Dal',       95, 6.0, 10.5,  3.0, 1.5, 200, 'base', 'g'),
('Kali Masoor Dal',      100, 6.0, 12.0,  3.0, 3.0, 200, 'base', 'g'),
('Mixed Dal',            100, 5.5, 11.0,  3.5, 2.5, 200, 'base', 'g'),
('Dhaba Style Dal',      125, 5.5, 11.0,  6.5, 2.5, 200, 'base', 'g'),
('Langar ki Dal',        110, 5.0, 12.0,  4.5, 3.0, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;
-- ============================================================================
-- HealthMate Food Library — Seed Part 2
-- ============================================================================
-- Categories covered:
--   1. Non-Veg Curries & Mains (45 items: #1–#45)
--      - Chicken (16), Mutton/Lamb (9), Egg (5), Fish & Seafood (8), Grilled/Tandoori (7)
--   2. Vegetable Sides / Sabzis (35 items: #46–#80)
--   3. Rice Dishes (20 items: #81–#100)
--   4. Breads & Rotis (22 items: #101–#122)
--   5. Eggs & Egg Dishes (6 items: #123–#128)
--
-- Total: 128 items
--
-- All nutrition values are per 100g (solids) or 100ml (liquids) of COOKED/PREPARED food.
-- Sources: IFCT 2017, USDA FoodData Central, Tarla Dalal, NIN (India).
-- serving_size_g = typical single-serving weight in grams.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 1. NON-VEG CURRIES & MAINS
-- ---------------------------------------------------------------------------

-- 1a. Chicken (16 items)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Chicken Masala', 148, 14.5, 4.2, 8.5, 0.8, 200, 'base', 'g'),
('Butter Chicken', 175, 13.0, 5.5, 11.5, 0.6, 200, 'base', 'g'),
('Chicken Tikka Masala', 165, 13.5, 5.0, 10.5, 0.7, 200, 'base', 'g'),
('Kadai Chicken', 155, 14.0, 4.5, 9.0, 1.0, 200, 'base', 'g'),
('Chicken Korma', 180, 12.5, 6.0, 12.0, 0.8, 200, 'base', 'g'),
('Chicken Do Pyaza', 142, 14.0, 5.5, 7.5, 1.0, 200, 'base', 'g'),
('Chicken Saag', 138, 13.5, 4.0, 8.0, 1.5, 200, 'base', 'g'),
('Chicken Vindaloo', 152, 14.5, 5.0, 8.5, 1.2, 200, 'base', 'g'),
('Chicken Chettinad', 160, 14.0, 4.5, 9.5, 1.0, 200, 'base', 'g'),
('Chicken Handi', 158, 13.0, 5.0, 10.0, 0.7, 200, 'base', 'g'),
('Chicken Changezi', 170, 13.0, 5.5, 11.0, 0.8, 200, 'base', 'g'),
('Chicken Mughlai', 178, 12.5, 5.8, 12.0, 0.6, 200, 'base', 'g'),
('Chicken Keema', 162, 16.0, 3.5, 9.5, 0.8, 200, 'base', 'g'),
('Chicken Curry', 135, 14.0, 4.0, 7.0, 0.8, 200, 'base', 'g'),
('Chicken Cafreal', 168, 15.0, 3.0, 10.5, 0.9, 200, 'base', 'g'),
('Chicken Xacuti', 165, 14.0, 5.0, 10.0, 1.2, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- 1b. Mutton / Lamb (9 items)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Mutton Curry', 165, 15.0, 4.0, 10.0, 0.7, 200, 'base', 'g'),
('Mutton Rogan Josh', 158, 15.5, 4.5, 9.0, 1.0, 200, 'base', 'g'),
('Mutton Korma', 195, 13.5, 5.5, 13.5, 0.7, 200, 'base', 'g'),
('Keema Matar', 155, 14.5, 5.5, 8.5, 1.5, 200, 'base', 'g'),
('Mutton Keema', 175, 16.5, 2.5, 11.0, 0.5, 200, 'base', 'g'),
('Nihari', 185, 14.0, 5.0, 12.5, 0.6, 250, 'base', 'g'),
('Paya', 120, 12.0, 2.5, 7.0, 0.3, 250, 'base', 'g'),
('Mutton Do Pyaza', 162, 15.0, 5.0, 9.5, 1.0, 200, 'base', 'g'),
('Bhuna Gosht', 188, 16.0, 3.5, 12.5, 0.8, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- 1c. Egg Curries (5 items)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Egg Curry', 130, 9.0, 5.0, 8.5, 0.8, 200, 'base', 'g'),
('Egg Masala', 155, 10.5, 4.5, 10.5, 0.7, 150, 'base', 'g'),
('Egg Bhurji', 170, 11.0, 3.5, 12.5, 0.5, 150, 'base', 'g'),
('Omelette', 155, 11.0, 0.7, 12.0, 0.0, 60, 'base', 'g'),
('Masala Omelette', 160, 10.5, 2.5, 12.0, 0.5, 75, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- 1d. Fish & Seafood (8 items)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Fish Curry', 115, 13.0, 4.0, 5.5, 0.6, 200, 'base', 'g'),
('Fish Masala', 145, 15.0, 4.5, 7.5, 0.8, 150, 'base', 'g'),
('Prawn Curry', 110, 12.5, 4.5, 5.0, 0.5, 200, 'base', 'g'),
('Prawn Masala', 135, 14.0, 5.0, 6.5, 0.7, 150, 'base', 'g'),
('Goan Fish Curry', 125, 13.0, 4.5, 6.0, 0.8, 200, 'base', 'g'),
('Kerala Fish Curry', 130, 13.5, 4.0, 6.5, 0.7, 200, 'base', 'g'),
('Fish Moilee', 140, 12.5, 4.5, 8.5, 0.6, 200, 'base', 'g'),
('Crab Masala', 125, 14.0, 5.0, 5.5, 0.8, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- 1e. Grilled / Tandoori (7 items)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Grilled Chicken Tikka', 165, 25.0, 2.5, 6.0, 0.3, 150, 'base', 'g'),
('Tandoori Chicken', 160, 24.0, 3.0, 5.5, 0.4, 200, 'base', 'g'),
('Grilled Chicken Malai Tikka', 195, 22.0, 2.5, 10.5, 0.2, 150, 'base', 'g'),
('Grilled Chicken Seekh Kebab', 175, 18.0, 4.0, 9.5, 0.6, 100, 'base', 'g'),
('Grilled Mutton Seekh Kebab', 210, 16.5, 4.0, 14.0, 0.5, 100, 'base', 'g'),
('Grilled Fish Tikka', 135, 20.0, 2.5, 5.0, 0.3, 150, 'base', 'g'),
('Grilled Tandoori Prawns', 125, 20.5, 3.0, 3.5, 0.2, 150, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ---------------------------------------------------------------------------
-- 2. VEGETABLE SIDES / SABZIS (35 items)
-- ---------------------------------------------------------------------------

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Aloo Gobi', 110, 2.5, 12.0, 6.0, 2.0, 150, 'base', 'g'),
('Aloo ki Sukhi Sabji', 120, 2.0, 14.5, 6.0, 1.8, 150, 'base', 'g'),
('Aloo Jeera', 118, 2.0, 13.5, 6.5, 1.5, 150, 'base', 'g'),
('Aloo Methi', 108, 2.8, 12.0, 5.5, 2.2, 150, 'base', 'g'),
('Aloo Capsicum', 105, 2.2, 12.5, 5.5, 1.8, 150, 'base', 'g'),
('Bhindi Masala', 95, 2.5, 8.0, 6.0, 3.5, 150, 'base', 'g'),
('Bhindi Fry', 115, 2.5, 8.5, 8.0, 3.2, 120, 'base', 'g'),
('Baingan Bharta', 90, 2.0, 7.5, 6.0, 3.0, 150, 'base', 'g'),
('Baingan Masala', 95, 2.2, 8.0, 6.0, 3.0, 150, 'base', 'g'),
('Karela Sabzi', 70, 2.0, 5.5, 4.5, 2.8, 100, 'base', 'g'),
('Lauki Sabzi', 52, 1.2, 5.5, 3.0, 1.0, 150, 'base', 'g'),
('Tori Sabzi', 55, 1.5, 5.0, 3.5, 1.2, 150, 'base', 'g'),
('Gobhi Matar', 85, 3.0, 8.5, 4.5, 2.5, 150, 'base', 'g'),
('Patta Gobi Sabzi', 72, 1.8, 7.0, 4.0, 2.0, 150, 'base', 'g'),
('Palak', 65, 3.0, 3.5, 4.5, 2.5, 100, 'base', 'g'),
('Methi Sabzi', 68, 3.2, 4.0, 4.5, 2.8, 100, 'base', 'g'),
('Sem ki Phali', 78, 2.5, 8.5, 3.5, 3.0, 150, 'base', 'g'),
('Gajar Matar', 82, 2.5, 9.5, 3.5, 2.5, 150, 'base', 'g'),
('Mixed Veg Sabzi', 85, 2.5, 8.5, 4.5, 2.5, 150, 'base', 'g'),
('Kaddu Sabzi', 72, 1.2, 9.0, 3.5, 1.5, 150, 'base', 'g'),
('Tinda Sabzi', 58, 1.5, 5.5, 3.5, 1.2, 150, 'base', 'g'),
('Arbi Fry', 135, 2.0, 16.0, 7.0, 2.0, 120, 'base', 'g'),
('Raw Banana Sabzi', 115, 1.5, 15.0, 5.5, 1.8, 150, 'base', 'g'),
('Sev Tamatar', 130, 3.0, 10.0, 9.0, 2.0, 150, 'base', 'g'),
('Beans Poriyal', 75, 2.5, 7.0, 4.0, 3.0, 120, 'base', 'g'),
('Cabbage Poriyal', 68, 1.8, 6.5, 4.0, 2.2, 120, 'base', 'g'),
('Moong Sprouts Sabzi', 95, 5.5, 8.5, 4.5, 3.0, 120, 'base', 'g'),
('Shimla Mirch Aloo', 105, 2.0, 12.0, 5.5, 2.0, 150, 'base', 'g'),
('Parwal Sabzi', 65, 1.5, 6.5, 3.5, 1.5, 150, 'base', 'g'),
('Chana Aloo Sabzi', 125, 4.5, 14.0, 5.5, 3.0, 150, 'base', 'g'),
('Corn Capsicum Sabzi', 110, 3.0, 13.5, 5.0, 2.5, 150, 'base', 'g'),
('Sarson ka Saag', 90, 3.5, 5.0, 6.5, 2.5, 150, 'base', 'g'),
('Saag', 82, 3.2, 4.5, 5.5, 2.8, 150, 'base', 'g'),
('Sukhe Aloo Gobi', 115, 2.5, 12.5, 6.5, 2.0, 150, 'base', 'g'),
('French Beans Sabzi', 72, 2.5, 7.0, 3.5, 3.0, 150, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ---------------------------------------------------------------------------
-- 3. RICE DISHES (20 items)
-- ---------------------------------------------------------------------------

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Steamed Rice', 130, 2.7, 28.0, 0.3, 0.4, 150, 'base', 'g'),
('Brown Rice', 123, 2.7, 25.5, 1.0, 1.8, 150, 'base', 'g'),
('Jeera Rice', 145, 2.8, 26.0, 3.5, 0.5, 150, 'base', 'g'),
('Vegetable Pulao', 142, 2.8, 22.0, 4.5, 1.2, 200, 'base', 'g'),
('Peas Pulao', 148, 3.5, 23.0, 4.5, 1.5, 200, 'base', 'g'),
('Mushroom Fried Rice', 155, 3.5, 23.5, 5.5, 1.0, 200, 'base', 'g'),
('Egg Fried Rice', 170, 5.5, 24.0, 6.0, 0.8, 200, 'base', 'g'),
('Chicken Fried Rice', 178, 7.0, 23.5, 6.5, 0.7, 200, 'base', 'g'),
('Veg Fried Rice', 158, 3.0, 24.0, 5.5, 1.0, 200, 'base', 'g'),
('Mushroom Egg Fried Rice', 168, 5.0, 23.5, 6.0, 0.9, 200, 'base', 'g'),
('Lemon Rice', 155, 2.8, 26.5, 4.5, 0.8, 180, 'base', 'g'),
('Curd Rice', 115, 3.5, 18.0, 3.0, 0.3, 200, 'base', 'g'),
('Tomato Rice', 148, 2.8, 24.0, 4.5, 1.0, 180, 'base', 'g'),
('Coconut Rice', 175, 2.8, 24.5, 7.5, 1.5, 180, 'base', 'g'),
('Tamarind Rice', 160, 2.5, 26.0, 5.0, 1.0, 180, 'base', 'g'),
('Schezwan Fried Rice', 172, 3.5, 25.0, 6.5, 0.8, 200, 'base', 'g'),
('Chicken Biryani', 155, 8.5, 20.0, 5.5, 0.6, 250, 'base', 'g'),
('Mutton Biryani', 185, 8.0, 21.5, 8.0, 0.5, 250, 'base', 'g'),
('Veg Biryani', 155, 3.5, 23.5, 5.5, 1.2, 250, 'base', 'g'),
('Hyderabadi Biryani', 190, 8.5, 22.0, 8.0, 0.5, 250, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ---------------------------------------------------------------------------
-- 4. BREADS & ROTIS (22 items)
-- ---------------------------------------------------------------------------

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Roti', 265, 8.5, 48.0, 3.5, 3.5, 30, 'base', 'g'),
('Ghee Roti', 310, 8.0, 45.0, 11.0, 3.2, 35, 'base', 'g'),
('Tandoori Roti', 260, 8.5, 49.0, 3.0, 3.0, 40, 'base', 'g'),
('Rumali Roti', 245, 7.5, 46.0, 3.0, 2.0, 30, 'base', 'g'),
('Missi Roti', 275, 10.5, 42.0, 7.0, 4.5, 40, 'base', 'g'),
('Makki ki Roti', 250, 6.0, 48.0, 4.0, 3.5, 50, 'base', 'g'),
('Naan', 290, 8.5, 50.0, 6.0, 2.0, 80, 'base', 'g'),
('Butter Naan', 320, 8.0, 48.0, 10.5, 2.0, 85, 'base', 'g'),
('Garlic Naan', 300, 8.5, 49.0, 7.5, 2.2, 85, 'base', 'g'),
('Cheese Naan', 340, 10.0, 45.0, 13.0, 1.8, 90, 'base', 'g'),
('Kulcha', 300, 8.0, 50.0, 7.0, 2.0, 80, 'base', 'g'),
('Amritsari Kulcha', 280, 7.5, 42.0, 9.0, 2.5, 100, 'base', 'g'),
('Puri', 350, 6.5, 42.0, 17.5, 2.0, 25, 'base', 'g'),
('Bhatura', 330, 7.0, 45.0, 14.0, 1.8, 60, 'base', 'g'),
('Ladi Pav', 280, 8.0, 50.0, 5.0, 2.0, 40, 'base', 'g'),
('Ladi Pav with Amul Butter', 320, 7.5, 47.0, 11.5, 1.8, 50, 'base', 'g'),
('Bread Slice White', 265, 8.0, 50.0, 3.5, 2.5, 28, 'base', 'g'),
('Bread Slice Brown', 250, 9.0, 46.0, 3.5, 4.5, 28, 'base', 'g'),
('Zero Maida Protein Bread', 235, 14.0, 38.0, 3.0, 6.0, 28, 'base', 'g'),
('Pita Bread', 275, 9.0, 55.0, 1.5, 2.5, 60, 'base', 'g'),
('Tortilla Wrap', 310, 8.5, 50.0, 8.0, 3.0, 40, 'base', 'g'),
('Pathiri', 260, 7.0, 50.0, 3.5, 1.5, 35, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ---------------------------------------------------------------------------
-- 5. EGGS & EGG DISHES (6 items — excludes duplicates from Non-Veg section)
-- ---------------------------------------------------------------------------

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Boiled Egg', 155, 13.0, 1.1, 11.0, 0.0, 50, 'base', 'g'),
('Boiled Egg White', 52, 11.0, 0.7, 0.2, 0.0, 33, 'base', 'g'),
('Fried Egg', 196, 13.5, 0.8, 15.0, 0.0, 46, 'base', 'g'),
('Poached Egg', 143, 12.5, 0.7, 10.0, 0.0, 50, 'base', 'g'),
('Scrambled Eggs', 148, 10.0, 1.6, 11.0, 0.0, 100, 'base', 'g'),
('Anda Bhurji', 175, 11.0, 3.0, 13.0, 0.5, 150, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ============================================================================
-- END OF SEED PART 2 — 128 items total
-- ============================================================================
-- ============================================================================
-- HealthMate Food Library — Seed Part 3
-- Categories: Street Food & Chaat, Indo-Chinese, Hot Soups, Sweets & Mithai,
--             Desserts & Bakery, Fast Food & Western, Salads
-- All values per 100g of COOKED/PREPARED dish
-- Sources: USDA FoodData Central, IFCT (Indian Food Composition Tables),
--          Tarla Dalal, verified nutrition databases
-- 155 items total
-- ============================================================================

-- ============================================================================
-- STREET FOOD & CHAAT (33 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Vada Pav', 210, 5.0, 28.0, 9.0, 1.8, 170, 'base', 'g'),
('Samosa', 262, 5.5, 28.0, 14.5, 2.0, 80, 'base', 'g'),
('Kachori', 320, 5.0, 32.0, 19.0, 2.5, 60, 'base', 'g'),
('Aloo Tikki', 195, 3.5, 24.0, 9.5, 2.0, 80, 'base', 'g'),
('Pani Puri', 140, 3.0, 22.0, 4.5, 1.5, 180, 'base', 'g'),
('Sev Puri', 210, 4.0, 26.0, 10.0, 2.0, 150, 'base', 'g'),
('Bhel Puri', 165, 4.0, 25.0, 5.5, 2.5, 200, 'base', 'g'),
('Dahi Puri', 175, 4.5, 24.0, 7.0, 1.5, 180, 'base', 'g'),
('Ragda Pattice', 145, 4.0, 20.0, 5.5, 2.5, 250, 'base', 'g'),
('Dahi Bhalla', 150, 5.0, 20.0, 5.5, 1.0, 200, 'base', 'g'),
('Papdi Chaat', 185, 4.5, 23.0, 8.5, 1.8, 200, 'base', 'g'),
('Aloo Chaat', 155, 3.0, 22.0, 6.0, 2.0, 200, 'base', 'g'),
('Corn Chaat', 130, 3.5, 20.0, 4.5, 2.5, 150, 'base', 'g'),
('Dabeli', 195, 4.5, 27.0, 7.5, 2.0, 150, 'base', 'g'),
('Chole Kulche', 170, 6.0, 24.0, 5.5, 3.5, 300, 'base', 'g'),
('Misal Pav', 155, 6.5, 22.0, 4.5, 3.0, 350, 'base', 'g'),
('Kathi Roll Veg', 195, 5.5, 24.0, 8.5, 2.0, 200, 'base', 'g'),
('Kathi Roll Chicken', 210, 11.0, 22.0, 9.0, 1.5, 200, 'base', 'g'),
('Egg Roll', 215, 9.0, 23.0, 9.5, 1.5, 180, 'base', 'g'),
('Chicken Roll', 220, 12.0, 22.0, 9.5, 1.2, 200, 'base', 'g'),
('Paneer Roll', 230, 9.0, 22.0, 12.0, 1.5, 200, 'base', 'g'),
('Frankie Veg', 190, 5.0, 25.0, 8.0, 2.0, 180, 'base', 'g'),
('Pakora', 290, 5.5, 25.0, 19.0, 2.5, 30, 'base', 'g'),
('Paneer Pakora', 305, 10.0, 18.0, 22.0, 1.5, 40, 'base', 'g'),
('Bread Pakora', 275, 6.5, 28.0, 15.5, 1.8, 60, 'base', 'g'),
('Onion Bhaji', 280, 5.0, 26.0, 17.5, 2.5, 30, 'base', 'g'),
('Chicken Momos Steamed', 150, 10.0, 18.0, 4.5, 1.0, 180, 'base', 'g'),
('Chicken Momos Fried', 225, 10.5, 20.0, 11.5, 1.0, 200, 'base', 'g'),
('Veg Momos Steamed', 135, 4.5, 22.0, 3.5, 1.5, 180, 'base', 'g'),
('Veg Momos Fried', 210, 5.0, 24.0, 10.5, 1.5, 200, 'base', 'g'),
('Chicken Shawarma', 180, 12.0, 16.0, 7.5, 1.5, 250, 'base', 'g'),
('Spring Roll Veg', 245, 4.0, 28.0, 13.0, 2.0, 60, 'base', 'g'),
('Keema Pav', 185, 11.0, 16.0, 8.5, 1.0, 300, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- INDO-CHINESE (18 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Veg Manchurian Dry', 195, 4.0, 20.0, 11.0, 2.0, 200, 'base', 'g'),
('Veg Manchurian Gravy', 125, 3.0, 14.0, 6.5, 1.5, 250, 'base', 'g'),
('Gobi Manchurian Dry', 200, 4.0, 21.0, 11.5, 2.5, 200, 'base', 'g'),
('Gobi Manchurian Gravy', 120, 3.0, 14.0, 6.0, 2.0, 250, 'base', 'g'),
('Chicken Manchurian Dry', 215, 13.0, 15.0, 11.0, 1.0, 200, 'base', 'g'),
('Chilli Chicken Dry', 220, 14.0, 12.0, 13.0, 1.0, 200, 'base', 'g'),
('Chilli Chicken Gravy', 155, 10.5, 10.0, 8.5, 1.0, 250, 'base', 'g'),
('Chilli Paneer Dry', 235, 10.0, 12.0, 16.5, 1.5, 200, 'base', 'g'),
('Chilli Paneer Gravy', 160, 7.5, 10.0, 10.5, 1.5, 250, 'base', 'g'),
('Hakka Noodles Veg', 170, 4.5, 25.0, 6.0, 1.5, 250, 'base', 'g'),
('Hakka Noodles Chicken', 185, 8.5, 23.0, 6.5, 1.2, 250, 'base', 'g'),
('Chilli Garlic Noodles', 180, 5.0, 25.0, 7.0, 1.2, 250, 'base', 'g'),
('Crispy Honey Chilli Potato', 275, 3.0, 35.0, 13.5, 2.0, 200, 'base', 'g'),
('American Chop Suey', 195, 5.0, 28.0, 7.5, 1.5, 300, 'base', 'g'),
('Paneer 65', 265, 11.0, 14.0, 18.5, 1.0, 200, 'base', 'g'),
('Chicken 65', 240, 16.0, 12.0, 14.5, 0.8, 200, 'base', 'g'),
('Dragon Chicken', 230, 14.0, 14.0, 13.0, 1.0, 200, 'base', 'g'),
('Sweet Corn Soup', 52, 2.0, 9.0, 1.0, 0.8, 200, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- HOT SOUPS (2 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Hot and Sour Soup Veg', 45, 1.5, 7.0, 1.2, 0.5, 200, 'base', 'ml'),
('Manchow Soup', 55, 2.0, 8.0, 1.8, 0.8, 200, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SWEETS & MITHAI (30 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Gulab Jamun', 325, 4.5, 48.0, 13.0, 0.3, 40, 'base', 'g'),
('Rasgulla', 186, 4.0, 38.0, 1.5, 0.0, 50, 'base', 'g'),
('Rasmalai', 210, 6.0, 28.0, 8.5, 0.1, 80, 'base', 'g'),
('Kaju Katli', 500, 10.0, 46.0, 31.0, 0.5, 20, 'base', 'g'),
('Kaju Barfi', 480, 9.5, 48.0, 28.0, 0.5, 25, 'base', 'g'),
('Badam Barfi', 460, 11.0, 42.0, 28.0, 2.0, 25, 'base', 'g'),
('Besan Barfi', 430, 8.0, 46.0, 24.0, 2.0, 25, 'base', 'g'),
('Motichoor Ladoo', 380, 5.5, 50.0, 18.0, 1.0, 40, 'base', 'g'),
('Besan Ladoo', 420, 7.5, 44.0, 24.0, 2.5, 40, 'base', 'g'),
('Boondi Ladoo', 390, 5.5, 52.0, 18.0, 1.0, 40, 'base', 'g'),
('Coconut Ladoo', 395, 4.0, 45.0, 22.0, 4.0, 25, 'base', 'g'),
('Jalebi', 370, 3.0, 58.0, 14.0, 0.2, 60, 'base', 'g'),
('Imarti', 365, 3.5, 56.0, 14.0, 0.5, 50, 'base', 'g'),
('Gajar ka Halwa', 175, 3.0, 22.0, 8.5, 1.5, 100, 'base', 'g'),
('Moong Dal Halwa', 310, 6.0, 32.0, 18.0, 1.5, 80, 'base', 'g'),
('Suji ka Halwa', 240, 3.5, 32.0, 11.5, 0.5, 100, 'base', 'g'),
('Badam Halwa', 340, 8.0, 30.0, 22.0, 2.0, 80, 'base', 'g'),
('Kheer', 135, 3.5, 18.0, 5.5, 0.2, 150, 'base', 'g'),
('Phirni', 130, 3.0, 18.5, 5.0, 0.2, 150, 'base', 'g'),
('Rabri', 210, 5.0, 20.0, 12.0, 0.0, 100, 'base', 'g'),
('Malpua', 300, 5.0, 38.0, 14.5, 0.5, 80, 'base', 'g'),
('Balushahi', 370, 4.0, 48.0, 18.0, 0.5, 40, 'base', 'g'),
('Soan Papdi', 425, 5.0, 50.0, 23.0, 0.5, 30, 'base', 'g'),
('Mysore Pak', 470, 5.5, 38.0, 33.0, 1.5, 30, 'base', 'g'),
('Peda', 400, 7.0, 48.0, 20.0, 0.2, 20, 'base', 'g'),
('Sandesh', 280, 8.0, 35.0, 12.0, 0.1, 30, 'base', 'g'),
('Ghevar', 350, 4.5, 45.0, 17.0, 0.3, 60, 'base', 'g'),
('Kulfi Malai', 195, 4.5, 22.0, 10.0, 0.0, 80, 'base', 'g'),
('Kulfi Mango', 185, 3.5, 26.0, 8.0, 0.5, 80, 'base', 'g'),
('Shrikhand', 195, 5.5, 28.0, 7.5, 0.1, 100, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- DESSERTS & BAKERY (25 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Butterscotch Cake', 340, 4.0, 45.0, 16.0, 0.3, 80, 'base', 'g'),
('Chocolate Cake', 370, 5.0, 48.0, 18.0, 1.5, 80, 'base', 'g'),
('Vanilla Cake', 330, 4.0, 46.0, 14.5, 0.2, 80, 'base', 'g'),
('Black Forest Cake', 345, 4.5, 44.0, 17.0, 1.0, 80, 'base', 'g'),
('Red Velvet Cake', 355, 4.5, 45.0, 17.5, 0.5, 80, 'base', 'g'),
('Brownie', 405, 5.5, 50.0, 21.0, 2.0, 60, 'base', 'g'),
('Chocolate Chip Cookie', 480, 5.5, 60.0, 24.0, 2.0, 30, 'base', 'g'),
('Cream Pastry', 320, 4.0, 38.0, 17.0, 0.3, 80, 'base', 'g'),
('Chocolate Pastry', 355, 5.0, 42.0, 19.0, 1.2, 80, 'base', 'g'),
('Veg Puff', 310, 5.0, 30.0, 19.0, 1.5, 80, 'base', 'g'),
('Chicken Puff', 295, 8.0, 27.0, 17.5, 1.0, 80, 'base', 'g'),
('Croissant Plain', 406, 8.0, 45.0, 21.0, 2.0, 60, 'base', 'g'),
('Chocolate Croissant', 420, 7.5, 47.0, 23.0, 2.0, 70, 'base', 'g'),
('Doughnut Glazed', 400, 5.0, 51.0, 19.5, 1.0, 60, 'base', 'g'),
('Bread Pudding', 185, 5.0, 28.0, 6.5, 0.5, 120, 'base', 'g'),
('Ice Cream Vanilla', 207, 3.5, 24.0, 11.0, 0.0, 100, 'base', 'g'),
('Ice Cream Chocolate', 216, 3.8, 28.0, 11.0, 1.0, 100, 'base', 'g'),
('Ice Cream Mango', 200, 3.0, 26.0, 9.5, 0.5, 100, 'base', 'g'),
('Ice Cream Butterscotch', 210, 3.5, 26.0, 10.5, 0.1, 100, 'base', 'g'),
('Amul Ice Cream Vanilla', 190, 3.5, 23.0, 10.0, 0.0, 100, 'base', 'g'),
('Kwality Walls Cornetto', 240, 4.0, 30.0, 12.0, 1.0, 95, 'base', 'g'),
('Magnum Classic', 290, 4.0, 28.0, 18.0, 1.5, 86, 'base', 'g'),
('Cheesecake', 320, 5.5, 26.0, 22.0, 0.3, 100, 'base', 'g'),
('Tiramisu', 280, 5.0, 30.0, 15.5, 0.5, 100, 'base', 'g'),
('Waffle with Syrup', 275, 5.0, 40.0, 11.0, 0.5, 120, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- FAST FOOD & WESTERN (35 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Pizza Margherita', 240, 10.0, 28.0, 10.0, 1.5, 120, 'base', 'g'),
('Pizza Farmhouse Veg', 225, 8.5, 27.0, 9.5, 2.0, 130, 'base', 'g'),
('Pizza Chicken Tikka', 245, 12.0, 26.0, 10.5, 1.5, 130, 'base', 'g'),
('Pizza Pepperoni', 270, 12.0, 26.0, 13.0, 1.5, 120, 'base', 'g'),
('Dominos Margherita 1 Slice', 235, 10.0, 30.0, 8.5, 1.5, 100, 'base', 'g'),
('Dominos Peppy Paneer 1 Slice', 250, 9.5, 28.0, 11.0, 1.5, 110, 'base', 'g'),
('Burger Veg McAloo Style', 210, 5.0, 28.0, 9.0, 2.0, 170, 'base', 'g'),
('Burger Chicken', 225, 13.0, 22.0, 10.0, 1.2, 200, 'base', 'g'),
('Burger Chicken Zinger', 245, 13.5, 23.0, 12.0, 1.2, 210, 'base', 'g'),
('McDonalds McAloo Tikki', 215, 5.5, 30.0, 8.5, 2.0, 150, 'base', 'g'),
('McDonalds Chicken McGrill', 210, 14.0, 22.0, 7.5, 1.5, 180, 'base', 'g'),
('French Fries Medium', 312, 3.5, 38.0, 16.0, 3.0, 120, 'base', 'g'),
('Loaded Fries Cheese', 280, 6.0, 30.0, 15.5, 2.5, 200, 'base', 'g'),
('Garlic Bread 2 pcs', 350, 8.0, 42.0, 16.0, 2.0, 80, 'base', 'g'),
('Cheesy Garlic Bread 2 pcs', 370, 10.0, 38.0, 19.0, 1.5, 90, 'base', 'g'),
('Nachos with Cheese', 305, 6.5, 34.0, 16.0, 3.0, 150, 'base', 'g'),
('Onion Rings', 325, 4.5, 38.0, 17.0, 2.0, 100, 'base', 'g'),
('Wrap Veg', 185, 5.5, 24.0, 7.5, 2.0, 200, 'base', 'g'),
('Wrap Chicken', 200, 11.0, 22.0, 8.0, 1.5, 220, 'base', 'g'),
('Subway Veg Sub 6 inch', 155, 5.5, 24.0, 4.0, 2.5, 230, 'base', 'g'),
('Subway Chicken Sub 6 inch', 165, 10.0, 22.0, 4.5, 2.0, 250, 'base', 'g'),
('Pasta Red Sauce', 130, 4.5, 20.0, 3.5, 1.5, 250, 'base', 'g'),
('Pasta White Sauce', 175, 5.0, 18.0, 9.5, 0.8, 250, 'base', 'g'),
('Pasta Pesto', 165, 5.5, 18.0, 8.0, 1.0, 250, 'base', 'g'),
('Mac and Cheese', 180, 7.0, 17.0, 9.5, 0.8, 250, 'base', 'g'),
('Grilled Chicken Breast', 165, 31.0, 0.0, 3.6, 0.0, 150, 'base', 'g'),
('Grilled Paneer', 265, 18.5, 3.0, 20.0, 0.0, 100, 'base', 'g'),
('Caesar Salad', 95, 3.5, 8.0, 5.5, 1.5, 200, 'base', 'g'),
('Chicken Caesar Salad', 120, 9.5, 6.0, 7.0, 1.5, 250, 'base', 'g'),
('Hot Dog', 245, 9.0, 22.0, 13.5, 1.0, 150, 'base', 'g'),
('Fish and Chips', 210, 11.0, 18.0, 10.5, 1.5, 300, 'base', 'g'),
('Panini Veg', 220, 7.0, 25.0, 10.0, 2.0, 200, 'base', 'g'),
('Panini Chicken', 235, 12.0, 23.0, 10.5, 1.5, 220, 'base', 'g'),
('Fried Chicken 1 pc KFC style', 260, 18.0, 12.0, 16.0, 0.5, 100, 'base', 'g'),
('Chicken Wings 6 pcs', 250, 18.5, 8.0, 16.5, 0.3, 180, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SALADS (12 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Green Salad', 18, 1.2, 3.0, 0.2, 1.5, 100, 'base', 'g'),
('Sprouts Salad', 85, 5.5, 13.0, 1.0, 3.5, 150, 'base', 'g'),
('Kachumber Salad', 25, 1.0, 4.5, 0.3, 1.2, 100, 'base', 'g'),
('Fruit Salad', 50, 0.5, 12.0, 0.2, 1.5, 150, 'base', 'g'),
('Greek Salad', 90, 4.0, 5.0, 6.5, 1.5, 200, 'base', 'g'),
('Corn Salad', 95, 3.0, 15.0, 3.0, 2.0, 150, 'base', 'g'),
('Quinoa Salad', 115, 4.5, 16.0, 4.0, 2.5, 200, 'base', 'g'),
('Chickpea Salad', 110, 5.5, 15.0, 3.5, 4.0, 200, 'base', 'g'),
('Coleslaw', 120, 1.2, 10.0, 8.5, 1.5, 100, 'base', 'g'),
('Raita Cucumber', 55, 2.5, 5.0, 2.5, 0.3, 100, 'base', 'g'),
('Raita Boondi', 95, 3.0, 10.0, 4.5, 0.5, 100, 'base', 'g'),
('Raita Mixed Veg', 60, 2.5, 5.5, 3.0, 0.5, 100, 'base', 'g')
ON CONFLICT (name) DO NOTHING;
-- ============================================================================
-- HealthMate Food Library — Seed Part 4
-- Categories covered:
--   1. Fruits (items 1–25)
--   2. Raw Vegetables (items 26–53)
--   3. Nuts, Seeds & Dry Fruits (items 54–75)
--   4. Grains, Pulses & Staples — Dry/Raw (items 76–100)
--   5. Dairy — Branded (items 101–160)
--   6. Oils & Fats (items 161–172)
--   7. Condiments & Accompaniments (items 173–197)
--
-- All values are per 100g (solids) or per 100ml (liquids).
-- Sources: USDA FoodData Central (primary), Indian branded product packaging.
-- serving_size_g = typical single-serve portion in grams (or ml for liquids).
-- ============================================================================


-- ────────────────────────────────────────────────────────────────────────────
-- 1. FRUITS (25 items)
-- ────────────────────────────────────────────────────────────────────────────

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Banana',              89,  1.1, 22.8, 0.3, 2.6, 120, 'base', 'g'),
('Apple',               52,  0.3, 13.8, 0.2, 2.4, 180, 'base', 'g'),
('Mango',               60,  0.8, 15.0, 0.4, 1.6, 150, 'base', 'g'),
('Pink Guava',          68,  2.6, 14.3, 1.0, 5.4, 150, 'base', 'g'),
('Watermelon',          30,  0.6,  7.6, 0.2, 0.4, 200, 'base', 'g'),
('Papaya',              43,  0.5, 10.8, 0.3, 1.7, 150, 'base', 'g'),
('Grapes Green',        69,  0.7, 18.1, 0.2, 0.9, 150, 'base', 'g'),
('Grapes Black',        70,  0.7, 18.1, 0.2, 0.9, 150, 'base', 'g'),
('Pomegranate',         83,  1.7, 18.7, 1.2, 4.0, 100, 'base', 'g'),
('Orange',              47,  0.9, 11.8, 0.1, 2.4, 150, 'base', 'g'),
('Mosambi',             43,  0.7, 10.5, 0.2, 0.5, 150, 'base', 'g'),
('Pineapple',           50,  0.5, 13.1, 0.1, 1.4, 150, 'base', 'g'),
('Chikoo',              83,  0.4, 20.0, 1.1, 5.3, 100, 'base', 'g'),
('Kiwi',                61,  1.1, 14.7, 0.5, 3.0,  75, 'base', 'g'),
('Strawberry',          32,  0.7,  7.7, 0.3, 2.0, 100, 'base', 'g'),
('Pear',                57,  0.4, 15.2, 0.1, 3.1, 180, 'base', 'g'),
('Litchi',              66,  0.8, 16.5, 0.4, 1.3, 100, 'base', 'g'),
('Jackfruit',           95,  1.7, 23.2, 0.6, 1.5, 100, 'base', 'g'),
('Custard Apple',      101,  1.7, 25.2, 0.6, 2.4, 100, 'base', 'g'),
('Jamun',               60,  0.7, 14.0, 0.2, 0.6, 100, 'base', 'g'),
('Coconut Fresh',      354,  3.3,  15.2, 33.5, 9.0,  50, 'base', 'g'),
('Dates',              277,  1.8, 75.0, 0.2, 6.7,  30, 'base', 'g'),
('Dried Figs',         249,  3.3, 63.9, 0.9, 9.8,  30, 'base', 'g'),
('Muskmelon',           34,  0.8,  8.2, 0.2, 0.9, 200, 'base', 'g'),
('Plum',                46,  0.7, 11.4, 0.3, 1.4,  66, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- 2. RAW VEGETABLES (28 items)
-- ────────────────────────────────────────────────────────────────────────────

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Potato',              77,  2.0, 17.5, 0.1, 2.2, 150, 'base', 'g'),
('Onion',               40,  1.1,  9.3, 0.1, 1.7, 100, 'base', 'g'),
('Tomato',              18,  0.9,  3.9, 0.2, 1.2, 100, 'base', 'g'),
('Cucumber',            15,  0.7,  3.6, 0.1, 0.5, 100, 'base', 'g'),
('Carrot',              41,  0.9,  9.6, 0.2, 2.8,  80, 'base', 'g'),
('Beetroot',            43,  1.6,  9.6, 0.2, 2.8, 100, 'base', 'g'),
('Bottle Gourd Lauki',  15,  0.6,  3.4, 0.0, 0.5, 100, 'base', 'g'),
('Ridge Gourd Tori',    20,  0.5,  4.4, 0.2, 0.5, 100, 'base', 'g'),
('Bitter Gourd Karela', 17,  1.0,  3.7, 0.2, 2.8, 100, 'base', 'g'),
('Cabbage',             25,  1.3,  5.8, 0.1, 2.5, 100, 'base', 'g'),
('Cauliflower',         25,  1.9,  5.0, 0.3, 2.0, 100, 'base', 'g'),
('Broccoli',            34,  2.8,  6.6, 0.4, 2.6, 100, 'base', 'g'),
('Spinach Palak',       23,  2.9,  3.6, 0.4, 2.2, 100, 'base', 'g'),
('Methi Leaves',        49,  4.4,  6.0, 0.9, 3.9,  50, 'base', 'g'),
('Green Peas',          81,  5.4, 14.5, 0.4, 5.7,  80, 'base', 'g'),
('Mushroom Button',     22,  3.1,  3.3, 0.3, 1.0, 100, 'base', 'g'),
('Capsicum Green',      20,  0.9,  4.6, 0.2, 1.7,  80, 'base', 'g'),
('Capsicum Red',        31,  1.0,  6.0, 0.3, 2.1,  80, 'base', 'g'),
('Lady Finger Bhindi',  33,  1.9,  7.5, 0.2, 3.2, 100, 'base', 'g'),
('Radish Mooli',        16,  0.7,  3.4, 0.1, 1.6, 100, 'base', 'g'),
('Sweet Potato',        86,  1.6, 20.1, 0.1, 3.0, 130, 'base', 'g'),
('Sweet Corn',          86,  3.3, 19.0, 1.4, 2.7, 100, 'base', 'g'),
('Drumstick',           37,  2.1,  8.5, 0.2, 2.0, 100, 'base', 'g'),
('French Beans',        31,  1.8,  7.0, 0.1, 3.4, 100, 'base', 'g'),
('Spring Onion',        32,  1.8,  7.3, 0.2, 2.6,  50, 'base', 'g'),
('Ginger',              80,  1.8, 17.8, 0.8, 2.0,  10, 'base', 'g'),
('Garlic',             149,  6.4, 33.1, 0.5, 2.1,  10, 'base', 'g'),
('Green Chilli',        40,  1.9,  8.8, 0.4, 1.5,   5, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- 3. NUTS, SEEDS & DRY FRUITS (22 items)
-- ────────────────────────────────────────────────────────────────────────────

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Almonds Raw',              579, 21.2, 21.6, 49.9, 12.5,  30, 'base', 'g'),
('Almonds Roasted Salted',   598, 20.9, 21.0, 52.5, 11.8,  30, 'base', 'g'),
('Cashews Raw',              553, 18.2, 30.2, 43.9,  3.3,  30, 'base', 'g'),
('Cashews Roasted Salted',   574, 15.3, 32.7, 46.4,  3.0,  30, 'base', 'g'),
('Walnuts',                  654, 15.2, 13.7, 65.2,  6.7,  30, 'base', 'g'),
('Pistachios',               560, 20.2, 27.2, 45.3, 10.6,  30, 'base', 'g'),
('Peanuts Raw',              567, 25.8, 16.1, 49.2,  8.5,  30, 'base', 'g'),
('Peanuts Roasted',          585, 23.7, 21.5, 49.7,  8.0,  30, 'base', 'g'),
('Raisins',                  299,  3.1, 79.2,  0.5,  3.7,  30, 'base', 'g'),
('Mixed Dry Fruits',         540, 16.0, 30.0, 42.0,  6.0,  30, 'base', 'g'),
('Chia Seeds',               486, 16.5, 42.1, 30.7, 34.4,  15, 'base', 'g'),
('Flax Seeds',               534, 18.3, 28.9, 42.2, 27.3,  15, 'base', 'g'),
('Sunflower Seeds',          584, 20.8, 20.0, 51.5,  8.6,  30, 'base', 'g'),
('Pumpkin Seeds',            559, 30.2, 10.7, 49.1,  6.0,  30, 'base', 'g'),
('Makhana Roasted',          362,  9.7, 76.9,  0.1,  7.6,  30, 'base', 'g'),
('Makhana Raw',              347,  9.7, 76.9,  0.1,  7.6,  30, 'base', 'g'),
('Sesame Seeds',             573, 17.7, 23.4, 49.7, 11.8,  10, 'base', 'g'),
('Coconut Dried',            660,  6.9, 23.7, 64.5, 16.3,  20, 'base', 'g'),
('Dried Apricot',            241,  3.4, 62.6,  0.5,  7.3,  30, 'base', 'g'),
('Prunes',                   240,  2.2, 63.9,  0.4,  7.1,  30, 'base', 'g'),
('Pine Nuts',                673, 13.7, 13.1, 68.4,  3.7,  20, 'base', 'g'),
('Brazil Nuts',              659, 14.3, 11.7, 67.1,  7.5,  20, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- 4. GRAINS, PULSES & STAPLES — DRY/RAW (25 items)
-- ────────────────────────────────────────────────────────────────────────────

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('White Rice Raw',      365, 7.1, 80.0, 0.7, 1.3,  75, 'base', 'g'),
('Brown Rice Raw',      370, 7.9, 77.2, 2.9, 3.5,  75, 'base', 'g'),
('Basmati Rice Raw',    356, 7.0, 78.0, 0.6, 0.7,  75, 'base', 'g'),
('Wheat Flour Atta',    340, 13.2, 72.0, 1.7, 10.7, 30, 'base', 'g'),
('Maida',               364, 10.3, 76.3, 1.0, 2.7,  30, 'base', 'g'),
('Besan',               387, 22.0, 58.0, 6.7, 10.8, 30, 'base', 'g'),
('Rava Suji',           360, 10.3, 77.7, 0.8, 3.9,  30, 'base', 'g'),
('Oats Raw',            389, 16.9, 66.3, 6.9, 10.6, 40, 'base', 'g'),
('Quinoa Raw',          368, 14.1, 64.2, 6.1, 7.0,  50, 'base', 'g'),
('Toor Dal Dry',        343, 22.3, 62.8, 1.2, 15.0, 50, 'base', 'g'),
('Masoor Dal Dry',      352, 25.4, 59.0, 1.1, 10.8, 50, 'base', 'g'),
('Moong Dal Dry',       347, 23.9, 62.6, 1.2, 16.3, 50, 'base', 'g'),
('Chana Dal Dry',       364, 20.2, 61.0, 5.3, 12.2, 50, 'base', 'g'),
('Urad Dal Dry',        341, 25.2, 59.6, 1.6, 18.3, 50, 'base', 'g'),
('Rajma Dry',           333, 23.6, 60.0, 0.8, 15.2, 50, 'base', 'g'),
('Kabuli Chana Dry',    364, 19.3, 60.6, 6.0, 12.2, 50, 'base', 'g'),
('Kala Chana Dry',      360, 20.5, 60.0, 4.9, 12.0, 50, 'base', 'g'),
('Lobia Dry',           336, 23.5, 60.0, 1.5, 10.6, 50, 'base', 'g'),
('Poha Dry',            358,  6.7, 77.3, 2.7, 2.4,  50, 'base', 'g'),
('Sabudana Dry',        358,  0.2, 88.7, 0.0, 0.9,  50, 'base', 'g'),
('Vermicelli Dry',      352, 11.3, 73.5, 1.2, 2.0,  50, 'base', 'g'),
('Macaroni Dry',        371, 13.0, 74.7, 1.5, 3.2,  75, 'base', 'g'),
('Cornflour',           381,  0.3, 91.3, 0.1, 0.9,  15, 'base', 'g'),
('Rice Flour',          366,  5.9, 80.1, 1.4, 2.4,  30, 'base', 'g'),
('Ragi Flour',          328, 7.3, 72.0, 1.3, 11.5,  30, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- 5. DAIRY — BRANDED (60 items)
-- ────────────────────────────────────────────────────────────────────────────

-- 5a. Milk (unit = 'ml', values per 100ml)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Full Cream Milk',         87, 3.2, 5.0, 6.0, 0.0, 200, 'base', 'ml'),
('Amul Toned Milk',              58, 3.1, 4.7, 3.0, 0.0, 200, 'base', 'ml'),
('Amul Lactose Free Milk',       59, 3.0, 4.8, 3.1, 0.0, 200, 'base', 'ml'),
('Mother Dairy Full Cream Milk', 89, 3.3, 5.0, 6.2, 0.0, 200, 'base', 'ml'),
('Mother Dairy Toned Milk',      59, 3.1, 4.7, 3.1, 0.0, 200, 'base', 'ml'),
('Mother Dairy Double Toned Milk', 46, 3.1, 5.0, 1.5, 0.0, 200, 'base', 'ml'),
('Nandini Full Cream Milk',      89, 3.5, 5.1, 6.1, 0.0, 200, 'base', 'ml'),
('Amul Taaza',                   58, 3.0, 4.8, 3.0, 0.0, 200, 'base', 'ml'),
('Amul Gold',                    87, 3.0, 5.0, 6.0, 0.0, 200, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- 5b. Curd / Dahi (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Masti Dahi',    65, 4.0, 4.6, 3.1, 0.0, 100, 'base', 'g'),
('Mother Dairy Dahi',  62, 3.7, 5.0, 3.0, 0.0, 100, 'base', 'g'),
('Nestle a+ Dahi',     59, 3.3, 4.6, 3.0, 0.0, 100, 'base', 'g'),
('Milky Mist Curd',    63, 3.2, 4.8, 3.2, 0.0, 100, 'base', 'g'),
('Nandini Curd',       59, 3.8, 4.3, 3.0, 0.0, 100, 'base', 'g'),
('Chitale Dahi',       76, 3.4, 6.5, 4.1, 0.0, 100, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- 5c. Greek Yogurt (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Epigamia Greek Yogurt Plain',       65, 7.0,  5.0, 2.0, 0.0, 100, 'base', 'g'),
('Epigamia Greek Yogurt Strawberry', 102, 6.8, 13.9, 2.1, 0.0, 100, 'base', 'g'),
('Epigamia Greek Yogurt Mango',      106, 6.4, 15.6, 1.7, 0.0, 100, 'base', 'g'),
('Milky Mist Greek Yogurt Plain',     78, 8.0,  6.5, 2.2, 0.0, 100, 'base', 'g'),
('Nestle a+ Greek Yogurt Plain',      65, 5.7,  7.4, 1.7, 0.0, 100, 'base', 'g'),
('Nestle a+ Grekyo Mango',           105, 5.1, 16.6, 2.0, 0.0, 100, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- 5d. Flavoured Yogurt (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Mishti Doi',                     160, 4.8, 26.0, 4.8, 0.0, 100, 'base', 'g'),
('Mother Dairy Fruit Yogurt Strawberry', 136, 4.1, 19.5, 4.6, 0.0, 100, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- 5e. Buttermilk (unit = 'ml', values per 100ml)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Masti Buttermilk',    28, 1.5, 1.8, 1.5, 0.0, 200, 'base', 'ml'),
('Mother Dairy Buttermilk',  20, 1.2, 1.2, 1.2, 0.0, 200, 'base', 'ml'),
('Nandini Majjige',          24, 1.5, 1.8, 1.2, 0.0, 200, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- 5f. Ghee (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Ghee',              900, 0.0, 0.0, 99.8, 0.0, 10, 'base', 'g'),
('Mother Dairy Ghee',      900, 0.0, 0.0, 99.8, 0.0, 10, 'base', 'g'),
('Patanjali Cow Ghee',     900, 0.0, 0.0, 99.7, 0.0, 10, 'base', 'g'),
('Gowardhan Ghee',         900, 0.0, 0.0, 99.8, 0.0, 10, 'base', 'g'),
('Nandini Ghee',           900, 0.0, 0.0, 99.7, 0.0, 10, 'base', 'g'),
('Aashirvaad Svasti Ghee', 900, 0.0, 0.0, 99.8, 0.0, 10, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- 5g. Butter (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Butter Salted',    720, 0.6, 0.9, 80.0, 0.0, 10, 'base', 'g'),
('Amul Butter Unsalted',  720, 0.6, 0.8, 80.0, 0.0, 10, 'base', 'g'),
('Mother Dairy Butter',   720, 0.7, 0.8, 80.0, 0.0, 10, 'base', 'g'),
('Britannia Butter',      720, 0.5, 1.0, 80.0, 0.0, 10, 'base', 'g'),
('Amul Garlic Butter',    700, 0.6, 1.5, 78.0, 0.0, 10, 'base', 'g'),
('Nutralite Butter',      630, 0.3, 0.0, 70.0, 0.0, 10, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- 5h. Paneer (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Paneer',           312, 20.0, 4.0, 24.0, 0.0, 50, 'base', 'g'),
('Mother Dairy Paneer',   260, 18.0, 1.5, 20.5, 0.0, 50, 'base', 'g'),
('Gowardhan Paneer',      265, 18.0, 2.0, 21.0, 0.0, 50, 'base', 'g'),
('Milky Mist Paneer',     283, 16.1, 5.1, 22.0, 0.0, 50, 'base', 'g'),
('Verka Paneer',          289, 18.5, 3.0, 22.5, 0.0, 50, 'base', 'g'),
('Nandini Paneer',        297, 19.0, 5.0, 23.0, 0.0, 50, 'base', 'g'),
('Chitale Paneer',        346, 20.3, 5.1, 27.1, 0.0, 50, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- 5i. Cheese (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Cheese Slice',           311, 20.0, 1.5, 26.0, 0.0, 20, 'base', 'g'),
('Britannia Cheese Slice',      310, 18.5, 5.0, 24.0, 0.0, 20, 'base', 'g'),
('Go Cheese Slice',             280, 14.0, 2.0, 24.0, 0.0, 20, 'base', 'g'),
('Amul Cheese Spread Plain',    247, 11.5, 3.0, 21.0, 0.0, 20, 'base', 'g'),
('Amul Cheese Spread Pepper',   247, 11.5, 3.5, 21.0, 0.0, 20, 'base', 'g'),
('Amul Cheese Block',           330, 23.0, 2.5, 26.0, 0.0, 30, 'base', 'g'),
('Britannia Cheese Block',      313, 19.5, 4.6, 24.0, 0.0, 30, 'base', 'g'),
('Amul Processed Cheese',       314, 20.0, 1.5, 26.0, 0.0, 20, 'base', 'g'),
('Cream Cheese',                342, 5.9, 4.1, 34.2, 0.0, 30, 'base', 'g'),
('Mozzarella Cheese',           280, 22.2, 2.2, 21.0, 0.0, 30, 'base', 'g'),
('Cheddar Cheese',              403, 24.9, 1.3, 33.1, 0.0, 30, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- 5j. Cream (unit = 'ml', values per 100ml)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Fresh Cream',                250, 2.0, 3.5, 25.0, 0.0, 30, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- 6. OILS & FATS (12 items)
-- ────────────────────────────────────────────────────────────────────────────

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Mustard Oil',              884, 0.0, 0.0, 100.0, 0.0, 10, 'base', 'ml'),
('Groundnut Oil',            884, 0.0, 0.0, 100.0, 0.0, 10, 'base', 'ml'),
('Sunflower Oil',            884, 0.0, 0.0, 100.0, 0.0, 10, 'base', 'ml'),
('Olive Oil Extra Virgin',   884, 0.0, 0.0, 100.0, 0.0, 10, 'base', 'ml'),
('Olive Oil Regular',        884, 0.0, 0.0, 100.0, 0.0, 10, 'base', 'ml'),
('Coconut Oil',              892, 0.0, 0.0, 100.0, 0.0, 10, 'base', 'ml'),
('Rice Bran Oil',            884, 0.0, 0.0, 100.0, 0.0, 10, 'base', 'ml'),
('Sesame Oil',               884, 0.0, 0.0, 100.0, 0.0, 10, 'base', 'ml'),
('Saffola Oil',              884, 0.0, 0.0, 100.0, 0.0, 10, 'base', 'ml'),
('Fortune Sunflower Oil',    884, 0.0, 0.0, 100.0, 0.0, 10, 'base', 'ml'),
('Dalda Vanaspati',          900, 0.0, 0.0, 100.0, 0.0, 10, 'base', 'g'),
('Cooking Spray',            884, 0.0, 0.0, 100.0, 0.0,  1, 'base', 'g')
ON CONFLICT (name) DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- 7. CONDIMENTS & ACCOMPANIMENTS (25 items)
-- ────────────────────────────────────────────────────────────────────────────

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Coconut Chutney',               130, 2.5, 10.0,  9.0, 2.5,  30, 'base', 'g'),
('Tomato Chutney',                 85, 1.2, 12.0,  3.5, 1.5,  30, 'base', 'g'),
('Green Chutney Mint Coriander',   55, 2.0,  5.0,  3.0, 2.0,  20, 'base', 'g'),
('Tamarind Chutney',              210, 0.5, 52.0,  0.3, 2.0,  20, 'base', 'g'),
('Garlic Chutney',                290, 7.0, 35.0, 14.0, 3.0,  10, 'base', 'g'),
('Peanut Chutney',                310, 12.0, 18.0, 22.0, 4.0,  30, 'base', 'g'),
('Mango Pickle',                  185, 1.5,  8.0, 16.0, 1.5,  15, 'base', 'g'),
('Lime Pickle',                   180, 1.0,  9.0, 15.0, 2.0,  15, 'base', 'g'),
('Mixed Pickle',                  190, 1.5,  8.5, 16.5, 1.5,  15, 'base', 'g'),
('Papad Roasted',                 320, 22.0, 47.0,  4.5, 5.0,  15, 'base', 'g'),
('Papad Fried',                   400, 18.0, 42.0, 18.0, 4.0,  18, 'base', 'g'),
('Kissan Ketchup',                133, 1.3, 33.3,  0.0, 0.5,  15, 'base', 'g'),
('Maggi Hot and Sweet',           127, 0.6, 31.5,  0.0, 0.5,  15, 'base', 'g'),
('Mayonnaise',                    680, 1.0,  1.0, 75.0, 0.0,  15, 'base', 'g'),
('Veeba Mayonnaise',              530, 0.7,  8.0, 55.0, 0.0,  15, 'base', 'g'),
('Mustard Sauce',                  66, 4.4,  5.3,  3.3, 3.0,  10, 'base', 'g'),
('Schezwan Sauce',                160, 1.5, 22.0,  7.5, 1.5,  15, 'base', 'g'),
('Soy Sauce',                      53, 8.1,  4.9,  0.6, 0.8,  10, 'base', 'ml'),
('Honey',                         304, 0.3, 82.4,  0.0, 0.2,  15, 'base', 'g'),
('Jaggery',                       383, 0.4, 95.0,  0.1, 0.0,  15, 'base', 'g'),
('Powdered Sugar',                389, 0.0, 99.8,  0.0, 0.0,   5, 'base', 'g'),
('White Sugar',                   387, 0.0, 99.8,  0.0, 0.0,   5, 'base', 'g'),
('Brown Sugar',                   380, 0.0, 98.1,  0.0, 0.0,   5, 'base', 'g'),
('Mukhwas',                       350, 9.0, 42.0, 16.0, 8.0,   5, 'base', 'g'),
('Supari Sweet',                  380, 4.0, 55.0, 16.0, 5.0,   5, 'base', 'g')
ON CONFLICT (name) DO NOTHING;
-- ============================================================================
-- HealthMate Food Library — Seed Part 5
-- Categories: Packaged Snacks (Chips, Namkeen, Biscuits, Chocolate, Noodles,
--             Popcorn), Additional Packaged, Beverages (Non-Alcoholic &
--             Alcoholic), Supplements & Health Foods, Frozen & Ready-to-Eat,
--             Cooking Ingredients, Homemade Snacks & Teatime, Sandwiches &
--             Wraps, Dips & Dressings, Breakfast Combos, Miscellaneous,
--             Regional Specialties, Sugar-Free / Diet, Additional Branded
-- All values per 100g (solids) or per 100ml (liquids)
-- Sources: Actual packaging nutrition labels, USDA FoodData Central,
--          IFCT (Indian Food Composition Tables), verified nutrition databases
-- ~340 items total (after skipping duplicates)
-- ============================================================================

-- ============================================================================
-- PACKAGED SNACKS — CHIPS (17 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Lays Classic Salted', 536, 6.3, 52.0, 33.0, 3.5, 52, 'base', 'g'),
('Lays Magic Masala', 540, 6.5, 51.0, 34.0, 3.8, 52, 'base', 'g'),
('Lays American Style Cream and Onion', 538, 6.2, 52.0, 33.5, 3.5, 52, 'base', 'g'),
('Lays Chile Limon', 535, 6.0, 53.0, 33.0, 3.5, 52, 'base', 'g'),
('Kurkure Masala Munch', 555, 6.0, 57.3, 33.6, 3.0, 45, 'base', 'g'),
('Kurkure Chilli Chatka', 558, 5.6, 56.2, 34.5, 3.2, 45, 'base', 'g'),
('Kurkure Green Chutney', 561, 5.6, 52.2, 35.3, 3.0, 45, 'base', 'g'),
('Uncle Chipps Spicy Treat', 530, 6.0, 54.0, 32.0, 3.0, 55, 'base', 'g'),
('Uncle Chipps Plain Salted', 533, 6.0, 53.0, 33.0, 3.0, 55, 'base', 'g'),
('Bingo Mad Angles Achari Masti', 547, 5.9, 58.1, 32.3, 2.5, 45, 'base', 'g'),
('Bingo Mad Angles Tomato Madness', 545, 6.2, 58.4, 31.8, 2.5, 45, 'base', 'g'),
('Bingo Tedhe Medhe', 565, 6.1, 54.1, 36.0, 2.8, 45, 'base', 'g'),
('Pringles Original', 536, 4.0, 50.0, 35.0, 3.0, 30, 'base', 'g'),
('Pringles Sour Cream and Onion', 533, 4.5, 51.0, 34.0, 3.0, 30, 'base', 'g'),
('Balaji Wafers Masala', 540, 5.5, 52.0, 34.5, 3.0, 40, 'base', 'g'),
('Balaji Wafers Simply Salted', 538, 5.5, 52.0, 34.0, 3.0, 40, 'base', 'g'),
('Too Yumm Multigrain Chips', 475, 6.5, 70.0, 19.0, 5.0, 30, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PACKAGED SNACKS — NAMKEEN (16 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Aloo Bhujia Bikano', 552, 8.7, 41.4, 38.0, 3.5, 30, 'base', 'g'),
('Haldirams Aloo Bhujia', 579, 7.2, 42.4, 42.3, 0.5, 30, 'base', 'g'),
('Haldirams Bhujia Bikaneri', 560, 15.0, 42.0, 37.0, 5.0, 30, 'base', 'g'),
('Haldirams Moong Dal', 479, 21.7, 52.9, 20.1, 7.5, 30, 'base', 'g'),
('Haldirams Navratan Mix', 522, 17.0, 46.0, 30.0, 14.0, 30, 'base', 'g'),
('Haldirams Khatta Meetha', 530, 9.3, 57.4, 29.3, 3.5, 30, 'base', 'g'),
('Haldirams All in One', 536, 13.7, 48.0, 32.2, 1.1, 30, 'base', 'g'),
('Haldirams Nut Cracker', 634, 20.0, 26.0, 50.0, 4.5, 30, 'base', 'g'),
('Bikano Bikaneri Bhujia', 610, 13.5, 33.4, 46.9, 5.0, 30, 'base', 'g'),
('Bikano Aloo Bhujia', 624, 8.7, 41.4, 47.1, 0.0, 30, 'base', 'g'),
('Bikano Navratan Mix', 590, 14.6, 42.1, 40.4, 4.0, 30, 'base', 'g'),
('Banana Chips', 520, 2.0, 58.0, 31.0, 4.0, 30, 'base', 'g'),
('Mathri', 480, 7.0, 50.0, 28.0, 2.5, 30, 'base', 'g'),
('Shakkar Para', 470, 5.5, 60.0, 23.0, 1.5, 30, 'base', 'g'),
('Murukku Chakli', 490, 8.0, 55.0, 26.0, 3.0, 30, 'base', 'g'),
('Chivda Bombay Mix', 485, 9.0, 52.0, 26.5, 3.5, 30, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PACKAGED SNACKS — BISCUITS (19 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Parle G', 454, 6.9, 77.3, 13.0, 1.5, 28, 'base', 'g'),
('Britannia Marie Gold', 435, 7.0, 74.0, 12.0, 2.5, 28, 'base', 'g'),
('Britannia Good Day Cashew', 508, 7.0, 67.0, 24.0, 1.5, 33, 'base', 'g'),
('Britannia Good Day Butter', 495, 6.0, 63.0, 24.0, 1.5, 33, 'base', 'g'),
('Britannia Bourbon', 480, 5.5, 65.0, 22.0, 2.0, 25, 'base', 'g'),
('Britannia 50 50', 470, 7.0, 65.0, 20.0, 2.0, 25, 'base', 'g'),
('Britannia NutriChoice Digestive', 450, 6.0, 60.0, 22.0, 6.0, 25, 'base', 'g'),
('Britannia NutriChoice Oats', 450, 8.5, 63.0, 18.0, 6.0, 25, 'base', 'g'),
('Parle Hide and Seek', 484, 6.4, 72.0, 18.8, 2.0, 33, 'base', 'g'),
('Parle Monaco', 480, 8.0, 62.0, 22.0, 2.0, 28, 'base', 'g'),
('Parle Krackjack', 475, 7.5, 64.0, 21.0, 1.8, 25, 'base', 'g'),
('Sunfeast Dark Fantasy Choco Fills', 510, 6.0, 60.0, 28.0, 2.0, 30, 'base', 'g'),
('Sunfeast Dark Fantasy Choco Creme', 486, 7.3, 67.6, 20.7, 2.0, 30, 'base', 'g'),
('McVities Digestive', 468, 7.0, 66.0, 20.0, 4.0, 30, 'base', 'g'),
('Oreo', 483, 2.9, 73.5, 20.6, 2.9, 25, 'base', 'g'),
('Unibic Cookies Cashew', 490, 6.5, 62.0, 24.0, 2.0, 30, 'base', 'g'),
('Unibic Cookies Choco Chip', 471, 5.8, 68.0, 19.5, 2.0, 30, 'base', 'g'),
('Jim Jam', 475, 5.0, 67.0, 21.0, 1.5, 25, 'base', 'g'),
('Tiger Biscuits', 455, 7.0, 72.0, 15.0, 2.0, 25, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PACKAGED SNACKS — CHOCOLATE & CANDY (13 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Cadbury Dairy Milk', 534, 7.5, 56.5, 30.5, 1.0, 24, 'base', 'g'),
('Cadbury Dairy Milk Silk', 546, 7.0, 55.0, 33.0, 1.0, 60, 'base', 'g'),
('Cadbury 5 Star', 444, 3.3, 72.9, 15.9, 0.5, 22, 'base', 'g'),
('KitKat 2 Finger', 518, 6.5, 63.0, 27.0, 1.5, 18, 'base', 'g'),
('KitKat 4 Finger', 518, 6.5, 63.0, 27.0, 1.5, 37, 'base', 'g'),
('Munch', 435, 6.0, 50.0, 23.4, 1.0, 23, 'base', 'g'),
('Snickers', 488, 8.0, 56.0, 25.5, 1.5, 52, 'base', 'g'),
('Mars Bar', 449, 4.5, 65.0, 18.5, 0.5, 51, 'base', 'g'),
('Amul Dark Chocolate', 520, 6.0, 52.0, 32.0, 5.0, 40, 'base', 'g'),
('Ferrero Rocher', 576, 8.5, 47.0, 40.0, 2.5, 12, 'base', 'g'),
('Perk', 517, 3.9, 68.3, 25.1, 1.0, 22, 'base', 'g'),
('Gems', 469, 3.5, 75.9, 17.5, 1.0, 18, 'base', 'g'),
('Bournville Dark', 525, 4.6, 65.3, 27.3, 6.0, 33, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PACKAGED SNACKS — INSTANT NOODLES (8 items)
-- Values per 100g DRY weight as sold
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Maggi Noodles Masala', 443, 8.6, 61.4, 18.6, 2.9, 70, 'base', 'g'),
('Maggi Atta Noodles', 314, 7.7, 50.3, 10.3, 5.5, 75, 'base', 'g'),
('Maggi Cup Noodles', 415, 8.0, 56.0, 17.5, 2.5, 70, 'base', 'g'),
('Yippee Noodles Classic Masala', 468, 9.0, 62.6, 20.1, 2.5, 70, 'base', 'g'),
('Yippee Noodles Magic Masala', 468, 9.0, 62.6, 20.1, 2.5, 70, 'base', 'g'),
('Top Ramen Curry', 460, 8.9, 67.9, 16.0, 2.5, 70, 'base', 'g'),
('Wai Wai Noodles', 470, 9.4, 61.2, 20.9, 2.0, 75, 'base', 'g'),
('Chings Hakka Noodles Instant', 405, 8.0, 58.0, 15.5, 2.5, 70, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PACKAGED SNACKS — POPCORN & OTHER (3 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Act II Sour Cream and Cheese Popcorn', 480, 7.0, 53.0, 27.0, 8.0, 30, 'base', 'g'),
('Act II Butter Popcorn', 449, 9.0, 66.0, 19.0, 8.5, 30, 'base', 'g'),
('Act II Classic Salted Popcorn', 507, 10.0, 60.0, 26.0, 9.0, 30, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ADDITIONAL PACKAGED (7 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Almond Chocolate Bar', 550, 9.0, 50.0, 35.0, 3.5, 25, 'base', 'g'),
('RiteBite Max Protein Bar', 417, 26.7, 37.0, 17.3, 6.7, 35, 'base', 'g'),
('Yoga Bar Protein Bar', 350, 33.3, 30.0, 12.0, 8.0, 35, 'base', 'g'),
('MuscleBlaze Protein Bar', 375, 30.0, 34.0, 13.5, 5.0, 35, 'base', 'g'),
('McCain French Fries Frozen Baked', 170, 2.5, 27.0, 6.0, 2.5, 100, 'base', 'g'),
('Cornitos Nacho Crisps', 490, 6.5, 62.0, 24.0, 3.0, 30, 'base', 'g'),
('Too Yumm Karare', 470, 7.5, 58.0, 23.0, 4.5, 30, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- BEVERAGES — NON-ALCOHOLIC — TEA & COFFEE (13 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Chai Tea with Sugar and Milk', 42, 1.5, 5.5, 1.5, 0.0, 150, 'base', 'ml'),
('Black Tea', 1, 0.0, 0.2, 0.0, 0.0, 200, 'base', 'ml'),
('Green Tea', 1, 0.0, 0.2, 0.0, 0.0, 200, 'base', 'ml'),
('Masala Chai', 45, 1.5, 6.0, 1.5, 0.0, 150, 'base', 'ml'),
('Ginger Tea Adrak Chai', 43, 1.5, 5.5, 1.5, 0.0, 150, 'base', 'ml'),
('Lemon Tea', 20, 0.1, 5.0, 0.0, 0.0, 200, 'base', 'ml'),
('Filter Coffee South Indian', 38, 1.5, 4.0, 1.5, 0.0, 150, 'base', 'ml'),
('Black Coffee', 2, 0.3, 0.0, 0.0, 0.0, 200, 'base', 'ml'),
('Instant Coffee Nescafe with Milk', 35, 1.5, 4.0, 1.2, 0.0, 150, 'base', 'ml'),
('Cappuccino', 40, 2.0, 4.0, 1.8, 0.0, 200, 'base', 'ml'),
('Latte', 38, 2.5, 4.0, 1.5, 0.0, 250, 'base', 'ml'),
('Cold Coffee with Milk', 55, 2.0, 8.0, 1.5, 0.0, 250, 'base', 'ml'),
('Iced Tea Sweetened', 32, 0.0, 8.0, 0.0, 0.0, 250, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- BEVERAGES — NON-ALCOHOLIC — MILK-BASED (8 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Badam Milk', 72, 3.0, 9.0, 2.8, 0.5, 200, 'base', 'ml'),
('Haldi Doodh Turmeric Milk', 55, 3.0, 5.5, 2.5, 0.2, 200, 'base', 'ml'),
('Chocolate Milk Amul', 109, 3.8, 17.0, 2.9, 0.5, 200, 'base', 'ml'),
('Amul Kool Flavoured Milk', 89, 3.0, 12.5, 2.5, 0.0, 200, 'base', 'ml'),
('Lassi Sweet', 75, 2.5, 12.0, 2.0, 0.0, 200, 'base', 'ml'),
('Lassi Salted', 40, 2.5, 3.5, 2.0, 0.0, 200, 'base', 'ml'),
('Mango Lassi', 85, 2.5, 14.0, 2.0, 0.3, 200, 'base', 'ml'),
('Chaas Buttermilk Homemade', 18, 1.0, 2.0, 0.5, 0.0, 200, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- BEVERAGES — NON-ALCOHOLIC — JUICES & DRINKS (12 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Fresh Orange Juice', 45, 0.7, 10.4, 0.2, 0.2, 200, 'base', 'ml'),
('Fresh Mosambi Juice', 43, 0.5, 10.0, 0.2, 0.1, 200, 'base', 'ml'),
('Sugarcane Juice', 40, 0.2, 9.8, 0.0, 0.0, 250, 'base', 'ml'),
('Coconut Water Fresh', 19, 0.7, 3.7, 0.2, 0.1, 200, 'base', 'ml'),
('Coconut Water Packaged', 22, 0.5, 4.5, 0.1, 0.0, 200, 'base', 'ml'),
('Tropicana Orange Juice', 45, 0.5, 10.5, 0.0, 0.0, 200, 'base', 'ml'),
('Real Mango Juice', 60, 0.2, 14.5, 0.1, 0.2, 200, 'base', 'ml'),
('Real Pomegranate Juice', 60, 0.0, 15.0, 0.0, 0.0, 200, 'base', 'ml'),
('B Natural Mixed Fruit Juice', 52, 0.3, 12.5, 0.0, 0.2, 200, 'base', 'ml'),
('Paper Boat Aamras', 84, 0.0, 21.0, 0.0, 0.0, 200, 'base', 'ml'),
('Frooti Mango Drink', 65, 0.0, 16.2, 0.0, 0.0, 200, 'base', 'ml'),
('Maaza Mango Drink', 50, 0.0, 12.5, 0.0, 0.0, 200, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- BEVERAGES — NON-ALCOHOLIC — SOFT DRINKS (9 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Coca Cola', 42, 0.0, 10.6, 0.0, 0.0, 250, 'base', 'ml'),
('Thums Up', 42, 0.0, 10.6, 0.0, 0.0, 250, 'base', 'ml'),
('Pepsi', 43, 0.0, 10.8, 0.0, 0.0, 250, 'base', 'ml'),
('Sprite', 40, 0.0, 10.0, 0.0, 0.0, 250, 'base', 'ml'),
('7 Up', 40, 0.0, 10.0, 0.0, 0.0, 250, 'base', 'ml'),
('Fanta', 44, 0.0, 11.0, 0.0, 0.0, 250, 'base', 'ml'),
('Limca', 42, 0.0, 10.5, 0.0, 0.0, 250, 'base', 'ml'),
('Mountain Dew', 46, 0.0, 11.5, 0.0, 0.0, 250, 'base', 'ml'),
('Appy Fizz', 48, 0.0, 12.0, 0.0, 0.1, 250, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- BEVERAGES — NON-ALCOHOLIC — TRADITIONAL (7 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Nimbu Pani', 22, 0.1, 5.5, 0.0, 0.1, 250, 'base', 'ml'),
('Jaljeera', 15, 0.3, 3.5, 0.1, 0.2, 200, 'base', 'ml'),
('Aam Panna', 40, 0.2, 10.0, 0.0, 0.2, 200, 'base', 'ml'),
('Rooh Afza Diluted', 35, 0.0, 8.5, 0.0, 0.0, 200, 'base', 'ml'),
('Thandai', 85, 3.0, 11.0, 3.5, 0.5, 200, 'base', 'ml'),
('Shikanji', 28, 0.1, 7.0, 0.0, 0.1, 250, 'base', 'ml'),
('Sattu Drink', 35, 2.5, 5.5, 0.5, 0.8, 300, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- BEVERAGES — NON-ALCOHOLIC — ENERGY & HEALTH (3 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Red Bull', 46, 0.0, 11.0, 0.0, 0.0, 250, 'base', 'ml'),
('Glucon D Glass', 30, 0.0, 7.5, 0.0, 0.0, 200, 'base', 'ml'),
('Electral ORS Glass', 10, 0.0, 2.5, 0.0, 0.0, 200, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ALCOHOLIC BEVERAGES — WHISKY (14 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Whisky', 250, 0.0, 0.0, 0.0, 0.0, 60, 'base', 'ml'),
('Johnnie Walker Black Label', 250, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Johnnie Walker Red Label', 250, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Jack Daniels', 238, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Blenders Pride', 244, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Royal Stag', 244, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Signature McDowells', 244, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Antiquity Blue', 244, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Black Dog', 244, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('100 Pipers', 250, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Jim Beam', 238, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Teachers Highland Cream', 250, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Glenfiddich 12', 250, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Chivas Regal', 250, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ALCOHOLIC BEVERAGES — BEER (10 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Kingfisher Premium', 42, 0.3, 3.5, 0.0, 0.0, 330, 'base', 'ml'),
('Kingfisher Ultra', 40, 0.3, 3.2, 0.0, 0.0, 330, 'base', 'ml'),
('Bira White', 50, 0.4, 5.0, 0.0, 0.0, 330, 'base', 'ml'),
('Bira Blonde', 43, 0.3, 3.5, 0.0, 0.0, 330, 'base', 'ml'),
('Budweiser', 42, 0.3, 3.5, 0.0, 0.0, 330, 'base', 'ml'),
('Heineken', 42, 0.4, 3.2, 0.0, 0.0, 330, 'base', 'ml'),
('Corona Extra', 42, 0.3, 3.7, 0.0, 0.0, 330, 'base', 'ml'),
('Tuborg', 41, 0.3, 3.3, 0.0, 0.0, 330, 'base', 'ml'),
('Carlsberg', 40, 0.3, 3.2, 0.0, 0.0, 330, 'base', 'ml'),
('Hoegaarden', 45, 0.5, 3.5, 0.0, 0.0, 330, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ALCOHOLIC BEVERAGES — WINE (4 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Red Wine', 85, 0.1, 2.6, 0.0, 0.0, 150, 'base', 'ml'),
('White Wine', 82, 0.1, 2.6, 0.0, 0.0, 150, 'base', 'ml'),
('Sula Chenin Blanc', 80, 0.1, 2.5, 0.0, 0.0, 150, 'base', 'ml'),
('Sula Shiraz', 86, 0.1, 2.8, 0.0, 0.0, 150, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ALCOHOLIC BEVERAGES — OTHER SPIRITS (7 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Old Monk Rum', 230, 0.0, 0.3, 0.0, 0.0, 30, 'base', 'ml'),
('Bacardi White Rum', 231, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Vodka', 231, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Absolut Vodka', 231, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Gin', 263, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Bombay Sapphire Gin', 263, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml'),
('Breezer Bacardi', 60, 0.0, 9.0, 0.0, 0.0, 275, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SUPPLEMENTS & HEALTH FOODS — PROTEIN POWDERS (8 items)
-- All values per 100g dry powder
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Isopure Whey Protein Isolate Unflavoured', 345, 86.2, 0.0, 0.0, 0.0, 45, 'base', 'g'),
('Isopure Whey Protein Isolate Chocolate', 333, 76.0, 3.0, 1.0, 1.0, 45, 'base', 'g'),
('MuscleBlaze Whey Protein', 394, 72.7, 12.0, 6.0, 1.0, 33, 'base', 'g'),
('Optimum Nutrition Gold Standard Whey', 382, 79.0, 10.0, 3.0, 0.5, 31, 'base', 'g'),
('MyProtein Impact Whey Unflavoured', 373, 82.0, 4.0, 7.5, 0.5, 25, 'base', 'g'),
('MyProtein Impact Whey Chocolate', 390, 76.0, 8.0, 6.0, 2.0, 25, 'base', 'g'),
('Nakpro Whey Protein', 395, 70.3, 16.2, 5.4, 0.5, 32, 'base', 'g'),
('AS IT IS Whey Protein', 380, 80.0, 7.0, 3.0, 0.5, 30, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SUPPLEMENTS & HEALTH FOODS — PEANUT BUTTER (6 items)
-- All values per 100g
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('MyFitness Peanut Butter Crunchy', 631, 25.0, 23.0, 49.0, 9.0, 32, 'base', 'g'),
('MyFitness Peanut Butter Smooth', 625, 28.0, 18.0, 49.0, 5.0, 32, 'base', 'g'),
('Pintola Peanut Butter Crunchy', 612, 30.0, 15.0, 49.0, 6.0, 32, 'base', 'g'),
('Pintola Peanut Butter Smooth', 612, 30.0, 15.0, 49.0, 6.0, 32, 'base', 'g'),
('Sundrop Peanut Butter Crunchy', 619, 26.0, 20.0, 50.0, 6.0, 32, 'base', 'g'),
('Alpino Peanut Butter', 645, 30.0, 18.0, 49.0, 6.0, 32, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SUPPLEMENTS & HEALTH FOODS — OTHER (7 items)
-- Skipping item 186 (Zero Maida Protein Bread) — already in breads
-- Skipping item 313 (Black Coffee No Sugar) — already in beverages
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Protein Lassi', 55, 5.0, 6.0, 1.0, 0.0, 200, 'base', 'ml'),
('Apple Cider Vinegar', 22, 0.0, 0.9, 0.0, 0.0, 15, 'base', 'ml'),
('Flaxseed Powder', 534, 18.3, 28.9, 42.2, 27.3, 10, 'base', 'g'),
('Sattu Powder Dry', 406, 20.6, 65.0, 7.2, 3.5, 30, 'base', 'g'),
('Wheatgrass Juice', 20, 1.5, 2.5, 0.2, 0.5, 30, 'base', 'ml'),
('Amla Juice', 48, 0.5, 11.0, 0.1, 1.0, 30, 'base', 'ml'),
('Aloe Vera Juice', 8, 0.0, 2.0, 0.0, 0.0, 30, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- FROZEN & READY-TO-EAT (17 items)
-- All values per 100g or 100ml as marked
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('ITC Chicken Nuggets', 219, 11.3, 18.9, 10.9, 1.5, 100, 'base', 'g'),
('ITC Chicken Seekh Kebab', 181, 15.5, 9.2, 9.1, 1.0, 100, 'base', 'g'),
('Licious Chicken 65', 190, 16.0, 10.0, 10.0, 1.0, 100, 'base', 'g'),
('Licious Chicken Tikka', 117, 15.0, 3.0, 5.0, 0.5, 100, 'base', 'g'),
('Licious Chicken Seekh Kebab', 173, 15.0, 5.0, 10.0, 1.0, 100, 'base', 'g'),
('Licious Chicken Keema', 137, 17.0, 2.0, 7.0, 0.5, 100, 'base', 'g'),
('McCain Aloo Tikki', 161, 2.5, 25.4, 5.6, 2.0, 60, 'base', 'g'),
('ITC Aloo Tikki', 165, 2.7, 22.9, 6.9, 2.0, 60, 'base', 'g'),
('Gits Dal Makhani', 159, 5.7, 14.5, 8.8, 2.5, 300, 'base', 'g'),
('Gits Paneer Makhani', 167, 4.0, 5.5, 14.0, 1.0, 300, 'base', 'g'),
('MTR Bisibele Bath', 130, 3.5, 18.0, 5.0, 1.5, 300, 'base', 'g'),
('MTR Rava Idli Mix', 404, 10.0, 73.0, 8.0, 4.0, 50, 'base', 'g'),
('Haldirams Minute Khana Rajma Chawal', 135, 4.5, 20.0, 3.5, 3.0, 300, 'base', 'g'),
('Haldirams Minute Khana Dal Makhani', 137, 4.2, 11.6, 8.2, 2.5, 300, 'base', 'g'),
('Knorr Soup Tomato', 46, 0.7, 9.2, 0.8, 0.5, 200, 'base', 'ml'),
('Knorr Soup Hot and Sour', 28, 0.8, 4.5, 0.7, 0.3, 200, 'base', 'ml'),
('Cup Noodles Nissin', 465, 10.0, 60.9, 19.2, 2.5, 70, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- COOKING INGREDIENTS (14 items)
-- All values per 100g or 100ml as marked
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Paneer Raw', 265, 18.3, 1.2, 20.8, 0.0, 50, 'base', 'g'),
('Tofu', 76, 8.1, 1.9, 4.8, 0.3, 100, 'base', 'g'),
('Soya Chunks Dry', 345, 52.0, 33.0, 0.5, 13.0, 30, 'base', 'g'),
('Soya Granules Dry', 340, 52.0, 33.0, 0.5, 13.0, 30, 'base', 'g'),
('Chicken Breast Raw', 120, 22.5, 0.0, 2.6, 0.0, 150, 'base', 'g'),
('Chicken Thigh Raw', 177, 17.3, 0.0, 11.5, 0.0, 150, 'base', 'g'),
('Mutton Raw Boneless', 178, 18.5, 0.0, 11.0, 0.0, 100, 'base', 'g'),
('Fish Fillet Raw', 84, 18.0, 0.0, 1.0, 0.0, 100, 'base', 'g'),
('Prawns Raw', 85, 18.0, 0.9, 0.5, 0.0, 100, 'base', 'g'),
('Egg Raw Whole', 143, 12.6, 0.7, 9.9, 0.0, 50, 'base', 'g'),
('Garlic Butter Amul', 720, 0.5, 0.5, 80.0, 0.0, 10, 'base', 'g'),
('Hung Curd Homemade', 98, 11.0, 4.0, 4.3, 0.0, 100, 'base', 'g'),
('Coconut Milk Canned', 197, 2.0, 2.8, 21.0, 0.0, 100, 'base', 'ml'),
('Coconut Cream', 330, 3.3, 6.7, 33.5, 2.2, 30, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- HOMEMADE SNACKS & TEATIME (15 items)
-- All values per 100g of prepared item
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Homemade Samosa', 262, 5.5, 28.0, 14.5, 2.0, 80, 'base', 'g'),
('Homemade Aloo Bonda', 250, 4.5, 28.0, 13.5, 2.0, 50, 'base', 'g'),
('Cutlet Veg', 230, 4.0, 26.0, 12.0, 2.5, 60, 'base', 'g'),
('Cutlet Chicken', 245, 14.0, 16.0, 13.0, 1.0, 70, 'base', 'g'),
('Homemade Mathri', 480, 7.0, 50.0, 28.0, 2.5, 20, 'base', 'g'),
('Namak Pare', 490, 6.5, 52.0, 28.5, 2.0, 30, 'base', 'g'),
('Homemade Shakkar Pare', 470, 5.5, 60.0, 23.0, 1.5, 30, 'base', 'g'),
('Popcorn Homemade Plain', 375, 11.0, 74.0, 4.5, 14.5, 30, 'base', 'g'),
('Popcorn Homemade Butter', 430, 9.0, 60.0, 18.0, 10.0, 30, 'base', 'g'),
('Roasted Chana', 370, 22.0, 53.0, 5.5, 12.0, 30, 'base', 'g'),
('Roasted Makhana', 350, 9.7, 76.0, 0.1, 0.0, 30, 'base', 'g'),
('Murmura Puffed Rice', 390, 6.0, 87.0, 1.2, 1.0, 20, 'base', 'g'),
('Homemade Chivda', 420, 7.0, 55.0, 19.5, 3.0, 30, 'base', 'g'),
('Masala Papad', 310, 18.0, 45.0, 6.0, 5.0, 20, 'base', 'g'),
('Cheese Toast', 310, 11.0, 28.0, 17.0, 1.5, 50, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SANDWICHES & WRAPS (10 items)
-- All values per 100g of prepared item
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Grilled Sandwich Veg', 195, 7.0, 22.0, 9.0, 2.0, 150, 'base', 'g'),
('Grilled Sandwich Chicken', 210, 12.0, 20.0, 9.5, 1.5, 170, 'base', 'g'),
('Club Sandwich', 215, 12.0, 18.0, 10.5, 1.5, 250, 'base', 'g'),
('Paneer Tikka Sandwich', 225, 10.0, 20.0, 11.5, 2.0, 180, 'base', 'g'),
('Chicken Keema Sandwich', 220, 13.0, 19.0, 10.0, 1.5, 200, 'base', 'g'),
('Egg Sandwich', 200, 10.0, 21.0, 8.5, 1.5, 150, 'base', 'g'),
('Cheese Sandwich', 270, 10.0, 24.0, 15.0, 1.5, 140, 'base', 'g'),
('Chicken Macaroni Baked', 165, 9.0, 18.0, 6.5, 1.0, 250, 'base', 'g'),
('Veg Frankie', 190, 5.0, 25.0, 8.0, 2.0, 180, 'base', 'g'),
('Chicken Frankie', 195, 10.0, 22.0, 7.5, 1.5, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- DIPS & DRESSINGS (10 items)
-- All values per 100g or 100ml as marked
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Schezwan Chutney Homemade', 155, 2.5, 15.0, 9.5, 3.0, 15, 'base', 'g'),
('Hummus', 166, 7.9, 14.3, 9.6, 6.0, 30, 'base', 'g'),
('Guacamole', 160, 2.0, 8.5, 14.7, 6.7, 30, 'base', 'g'),
('Tzatziki', 56, 3.5, 4.0, 3.0, 0.5, 30, 'base', 'g'),
('Salsa', 36, 1.5, 7.0, 0.2, 1.5, 30, 'base', 'g'),
('Ranch Dressing', 410, 1.5, 6.0, 42.0, 0.5, 30, 'base', 'ml'),
('Thousand Island Dressing', 345, 1.0, 15.0, 31.0, 0.5, 30, 'base', 'ml'),
('Vinaigrette Dressing', 220, 0.2, 6.0, 22.0, 0.0, 15, 'base', 'ml'),
('Mint Raita', 50, 2.5, 4.0, 2.5, 0.3, 50, 'base', 'g'),
('Onion Raita', 52, 2.5, 4.5, 2.5, 0.3, 50, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- BREAKFAST COMBOS (10 items)
-- All values per 100g of the complete serving
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Idli Sambhar Chutney Plate of 3', 110, 3.5, 18.0, 2.5, 1.5, 250, 'base', 'g'),
('Dosa Sambhar Chutney 1 Dosa', 160, 3.5, 22.0, 6.5, 1.5, 200, 'base', 'g'),
('Chole Bhature 1 Serving', 220, 6.5, 25.0, 10.5, 3.5, 300, 'base', 'g'),
('Puri Aloo Sabzi 2 Puri', 210, 4.5, 26.0, 10.0, 2.5, 200, 'base', 'g'),
('Poha with Sev 1 Plate', 130, 2.5, 21.0, 4.0, 1.5, 200, 'base', 'g'),
('Upma with Chutney 1 Plate', 120, 3.0, 18.0, 4.0, 1.5, 220, 'base', 'g'),
('Paratha with Curd', 185, 5.5, 22.0, 8.5, 1.5, 200, 'base', 'g'),
('Vada Pav with Chutneys', 210, 5.0, 28.0, 9.0, 1.8, 170, 'base', 'g'),
('Misal Pav 1 Serving', 155, 6.5, 22.0, 4.5, 3.0, 350, 'base', 'g'),
('Bread Butter Jam', 330, 6.0, 48.0, 13.0, 1.5, 60, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- MISCELLANEOUS (24 items)
-- All values per 100g of prepared/cooked item
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Maggi Cooked 1 Pack', 140, 3.2, 20.5, 5.1, 1.0, 200, 'base', 'g'),
('Instant Pasta Yippee', 145, 3.5, 21.0, 5.0, 1.0, 200, 'base', 'g'),
('Oats Upma', 100, 3.5, 14.0, 3.5, 2.5, 200, 'base', 'g'),
('Ragi Dosa', 150, 3.5, 24.0, 4.5, 2.0, 80, 'base', 'g'),
('Ragi Mudde', 110, 3.0, 23.0, 0.7, 3.5, 100, 'base', 'g'),
('Jowar Roti', 290, 8.0, 60.0, 1.8, 6.5, 35, 'base', 'g'),
('Bajra Roti', 295, 8.5, 55.0, 5.0, 6.0, 35, 'base', 'g'),
('Multigrain Roti', 280, 9.0, 52.0, 4.5, 5.5, 35, 'base', 'g'),
('Multigrain Bread', 250, 10.0, 42.0, 4.5, 5.0, 30, 'base', 'g'),
('Grilled Paneer Tikka', 240, 16.0, 5.0, 18.0, 0.5, 100, 'base', 'g'),
('Soya Chaap', 145, 12.0, 10.0, 6.0, 2.0, 100, 'base', 'g'),
('Tandoori Soya Chaap', 160, 12.5, 10.5, 7.5, 2.0, 100, 'base', 'g'),
('Malai Soya Chaap', 180, 9.0, 8.0, 13.0, 1.5, 150, 'base', 'g'),
('Fish Fry 1 Piece', 220, 16.0, 10.0, 13.0, 0.5, 80, 'base', 'g'),
('Prawn Fry', 225, 17.0, 10.0, 13.5, 0.5, 80, 'base', 'g'),
('Grilled Mutton Seekh Kebab', 210, 16.0, 6.0, 13.5, 0.5, 60, 'base', 'g'),
('Paneer Tikka Roll', 195, 8.5, 22.0, 8.0, 1.5, 200, 'base', 'g'),
('Chicken Tikka Roll', 190, 11.0, 20.0, 7.5, 1.5, 200, 'base', 'g'),
('Tandoori Momos 6 pcs', 170, 9.0, 20.0, 6.0, 1.0, 200, 'base', 'g'),
('Afghani Momos 6 pcs', 210, 9.0, 18.0, 11.5, 1.0, 200, 'base', 'g'),
('Cream Roll Bakery', 360, 5.0, 40.0, 20.0, 0.5, 60, 'base', 'g'),
('Fan Bakery', 420, 6.0, 55.0, 20.0, 1.0, 30, 'base', 'g'),
('Khari Biscuit', 465, 7.0, 55.0, 24.0, 2.0, 15, 'base', 'g'),
('Bun Maska', 295, 6.5, 42.0, 11.5, 1.5, 80, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- REGIONAL SPECIALTIES (17 items)
-- Skipping item 294 (Gatte ki Sabzi) — duplicate
-- Skipping item 301 (Mishti Doi) — same as Amul Mishti Doi
-- Skipping item 310 (Sarson ka Saag with Makki Roti) — both exist separately
-- All values per 100g of prepared item
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Dal Baati Churma', 250, 6.0, 30.0, 12.0, 2.5, 300, 'base', 'g'),
('Undhiyu', 130, 4.0, 12.0, 7.5, 3.5, 200, 'base', 'g'),
('Fafda with Jalebi', 380, 5.5, 48.0, 19.0, 1.5, 160, 'base', 'g'),
('Puran Poli', 240, 5.0, 42.0, 6.0, 2.0, 100, 'base', 'g'),
('Thalipeeth', 215, 6.5, 30.0, 8.0, 3.0, 80, 'base', 'g'),
('Sabudana Vada', 280, 3.0, 36.0, 14.0, 1.0, 50, 'base', 'g'),
('Usal Sprouts Curry', 110, 6.5, 12.0, 4.0, 4.0, 200, 'base', 'g'),
('Kosha Mangsho', 175, 14.0, 4.0, 11.5, 0.5, 200, 'base', 'g'),
('Shukto', 85, 2.5, 8.0, 5.0, 2.5, 200, 'base', 'g'),
('Double Ka Meetha', 265, 5.0, 35.0, 12.0, 0.5, 100, 'base', 'g'),
('Lukhmi', 280, 7.0, 25.0, 17.0, 1.0, 60, 'base', 'g'),
('Kerala Parotta', 290, 6.0, 40.0, 12.0, 1.5, 80, 'base', 'g'),
('Beef Fry Kerala', 195, 18.0, 4.0, 12.0, 1.0, 100, 'base', 'g'),
('Appam with Stew', 115, 3.5, 16.0, 4.0, 1.5, 200, 'base', 'g'),
('Puttu with Kadala Curry', 140, 5.0, 22.0, 3.5, 3.0, 250, 'base', 'g'),
('Amritsari Macchi', 220, 14.0, 12.0, 13.5, 0.5, 100, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SUGAR-FREE / DIET (14 items)
-- Skipping item 313 (Black Coffee No Sugar) — already in beverages
-- All values per 100g or 100ml as marked
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Sugar Free Chai', 15, 1.5, 1.0, 0.5, 0.0, 150, 'base', 'ml'),
('Diet Coke', 0.4, 0.0, 0.0, 0.0, 0.0, 250, 'base', 'ml'),
('Coke Zero', 0.4, 0.0, 0.0, 0.0, 0.0, 250, 'base', 'ml'),
('Green Smoothie Spinach Banana', 45, 1.5, 9.0, 0.5, 1.5, 250, 'base', 'ml'),
('Protein Smoothie Whey Banana Milk', 70, 5.5, 9.0, 1.5, 0.5, 300, 'base', 'ml'),
('Egg White Bhurji', 75, 11.0, 1.5, 2.5, 0.0, 100, 'base', 'g'),
('Grilled Chicken Salad', 95, 10.0, 5.0, 4.0, 2.0, 250, 'base', 'g'),
('Ragi Porridge', 65, 1.5, 13.0, 0.5, 1.5, 200, 'base', 'g'),
('Oats Smoothie', 55, 2.5, 9.0, 1.0, 1.5, 250, 'base', 'ml'),
('Skim Milk', 34, 3.4, 5.0, 0.1, 0.0, 200, 'base', 'ml'),
('Low Fat Curd', 50, 4.5, 5.5, 1.0, 0.0, 100, 'base', 'g'),
('Diet Namkeen Baked', 420, 10.0, 62.0, 14.0, 4.0, 30, 'base', 'g'),
('Multigrain Thins', 400, 12.0, 58.0, 13.0, 6.0, 20, 'base', 'g'),
('Rice Cake', 387, 8.0, 81.0, 2.8, 1.5, 9, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ADDITIONAL BRANDED — SPREADS (5 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Nutella', 539, 6.3, 57.5, 30.9, 3.4, 15, 'base', 'g'),
('Kissan Mixed Fruit Jam', 285, 0.3, 70.5, 0.1, 0.5, 20, 'base', 'g'),
('Kissan Mango Jam', 262, 0.2, 65.0, 0.0, 0.3, 20, 'base', 'g'),
('Hersheys Chocolate Syrup', 276, 1.0, 65.0, 0.5, 1.0, 20, 'base', 'ml'),
('Mapro Jam Strawberry', 255, 0.3, 63.0, 0.0, 0.5, 20, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ADDITIONAL BRANDED — READY MIXES (3 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('MTR Rava Dosa Mix', 360, 9.0, 74.0, 3.0, 2.5, 50, 'base', 'g'),
('MTR Poha Ready to Eat', 145, 2.5, 22.0, 5.0, 1.5, 180, 'base', 'g'),
('Gits Dhokla Mix', 340, 10.0, 73.0, 0.8, 3.0, 40, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ADDITIONAL BRANDED — BREAD BRANDS (5 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Harvest Gold Bread White', 228, 7.4, 46.2, 1.4, 2.5, 30, 'base', 'g'),
('Harvest Gold Bread Wheat', 248, 10.2, 46.3, 2.5, 5.0, 30, 'base', 'g'),
('Modern Bread White', 247, 7.0, 51.5, 1.7, 2.5, 30, 'base', 'g'),
('Britannia Bread White', 252, 7.3, 52.0, 1.7, 2.5, 30, 'base', 'g'),
('English Oven Bread', 261, 8.7, 54.9, 1.0, 2.5, 30, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ADDITIONAL BRANDED — FROZEN NON-VEG (4 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Licious Chicken Sausage', 207, 10.0, 7.3, 15.2, 0.5, 50, 'base', 'g'),
('Licious Chicken Salami', 234, 13.0, 8.7, 17.0, 0.5, 30, 'base', 'g'),
('Licious Mutton Keema', 175, 17.0, 2.0, 11.0, 0.5, 100, 'base', 'g'),
('FreshToHome Fish Fillet', 84, 18.0, 0.0, 1.0, 0.0, 100, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ADDITIONAL BRANDED — SAUCES (3 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Chings Schezwan Chutney', 165, 2.0, 15.0, 10.5, 3.0, 15, 'base', 'g'),
('Funfoods Pasta Sauce Cheese Herbs', 105, 2.5, 10.0, 6.0, 0.5, 30, 'base', 'g'),
('Del Monte Pasta Sauce Red', 55, 1.5, 8.5, 1.5, 1.5, 30, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ADDITIONAL BRANDED — HEALTH DRINKS (5 items)
-- All values per 100ml of prepared drink (powder + milk)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Bournvita with Milk', 78, 3.5, 11.0, 2.5, 0.5, 200, 'base', 'ml'),
('Horlicks with Milk', 76, 3.5, 11.0, 2.0, 0.5, 200, 'base', 'ml'),
('Complan with Milk', 85, 4.0, 11.5, 2.5, 0.3, 200, 'base', 'ml'),
('Boost with Milk', 78, 3.5, 11.5, 2.0, 0.5, 200, 'base', 'ml'),
('Ensure Nutrition Shake', 105, 3.8, 16.9, 2.5, 0.5, 200, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ADDITIONAL BRANDED — ENERGY & OTHERS (3 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Pepsi Black Zero Sugar', 0.4, 0.0, 0.0, 0.0, 0.0, 250, 'base', 'ml'),
('Sting Energy Drink', 28, 0.0, 7.0, 0.0, 0.0, 250, 'base', 'ml'),
('Monster Energy Drink', 47, 0.0, 11.0, 0.0, 0.0, 250, 'base', 'ml')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- END OF SEED PART 5
-- Total unique items: ~342 (after skipping 4 duplicates: items 186, 294, 301, 310, 313)
-- ============================================================================
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
('Restaurant Paneer Masala', 248, 7.5, 9.0, 20.0, 1.5, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

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
('Restaurant Chicken Biryani', 186, 8.5, 20.5, 8.0, 0.6, 250, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

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
('Restaurant Mutton Biryani', 222, 8.0, 22.5, 11.5, 0.5, 250, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

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
('Restaurant Dhaba Style Dal', 180, 5.0, 13.5, 11.5, 2.5, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

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
('Restaurant Kadhi Pakora', 130, 3.5, 9.0, 8.5, 1.0, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- EGG CURRIES — RESTAURANT STYLE (2 items)
-- Multiplier: ~1.4x calories.
-- Extra calories allocated ~80% to fat, ~20% to carbs.
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
-- Egg Curry: 130 → 182 cal (+52). Fat: 8.5 + 4.6 = 13.1. Carbs: 5.0 + 1.3 = 6.3
('Restaurant Egg Curry', 182, 9.0, 6.5, 13.0, 0.8, 200, 'base', 'g'),
-- Egg Masala: 155 → 213 cal (~1.37x). Fat: 11.0 + 5.5 = 16.5. Carbs: 4.0 + 1.5 = 5.5
('Restaurant Egg Masala', 213, 10.0, 5.5, 16.5, 0.8, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

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
('Restaurant Prawn Masala', 189, 15.0, 5.5, 11.5, 0.5, 200, 'base', 'g')
ON CONFLICT (name) DO NOTHING;

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
('Restaurant Naan', 319, 8.5, 51.0, 8.5, 2.0, 80, 'base', 'g')
ON CONFLICT (name) DO NOTHING;
