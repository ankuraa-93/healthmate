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
('Egg Paratha',         235, 8.5, 25.0, 11.0, 1.4, 130, 'base', 'g');

-- Chillas & Pancakes (items 11–14)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Suji Chilla',         160, 4.5, 22.0,  6.0, 1.0, 100, 'base', 'g'),
('Besan Chilla',        175, 7.0, 18.0,  8.5, 3.0, 100, 'base', 'g'),
('Moong Dal Chilla',    150, 8.5, 17.0,  5.0, 2.5, 100, 'base', 'g'),
('Oats Chilla',         155, 6.0, 19.0,  6.0, 2.8, 100, 'base', 'g');

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
('Puttu',               210, 4.0, 35.0,  6.0, 2.5, 150, 'base', 'g');

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
('Anda Bhurji Pav',     195, 10.0, 16.0, 10.0, 1.2, 250, 'base', 'g');

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
('Saffola Oats',                  370, 13.5, 62.0,  7.5, 9.5, 40, 'base', 'g');

-- Protein Breakfast (items 53–55)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Egg White Omelette',   70, 11.0,  1.0,  2.5, 0.0, 120, 'base', 'g'),
('Scrambled Eggs',      155, 10.5,  1.5, 12.0, 0.0, 130, 'base', 'g'),
('Overnight Oats',      135,  5.0, 20.0,  4.0, 2.5, 250, 'base', 'g');


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
('Methi Matar Malai',    155, 5.5,  8.0, 11.5, 2.0, 200, 'base', 'g');

-- Legume Curries (items 68–74)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Chole Masala',        150, 6.5, 16.0,  6.5, 4.5, 200, 'base', 'g'),
('Rajma Masala',        140, 6.0, 16.5,  5.5, 5.0, 200, 'base', 'g'),
('Chana Masala',        145, 6.0, 16.0,  6.0, 4.5, 200, 'base', 'g'),
('Kala Chana Curry',    140, 7.0, 17.0,  4.5, 5.5, 200, 'base', 'g'),
('Lobia Curry',         125, 6.5, 16.0,  4.0, 4.0, 200, 'base', 'g'),
('Soya Chunk Curry',    145, 12.0, 8.0,  7.0, 2.5, 200, 'base', 'g'),
('Soya Granule Curry',  140, 11.5, 8.5,  6.5, 2.0, 200, 'base', 'g');

-- Mushroom Curries (items 75–78)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Mushroom Masala',     105, 3.5, 6.5,  7.5, 1.5, 200, 'base', 'g'),
('Mushroom Matar',      100, 4.0, 7.5,  6.0, 2.0, 200, 'base', 'g'),
('Palak Mushroom',       95, 4.0, 5.5,  6.5, 2.0, 200, 'base', 'g'),
('Kadai Mushroom',      110, 3.5, 6.5,  7.5, 1.5, 200, 'base', 'g');

-- Aloo Curries (items 79–82)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Dum Aloo',            140, 3.0, 14.0,  8.0, 1.5, 200, 'base', 'g'),
('Aloo Matar',          115, 3.5, 13.0,  5.5, 2.5, 200, 'base', 'g'),
('Aloo Palak',          110, 3.5, 11.0,  6.0, 2.5, 200, 'base', 'g'),
('Aloo Mutter Gobi',    105, 3.5, 12.0,  5.0, 2.5, 200, 'base', 'g');

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
('Corn Palak',          115, 4.0, 10.0,  6.5, 2.5, 200, 'base', 'g');

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
('Palak Corn',          110, 4.0, 9.5,  6.5, 2.5, 200, 'base', 'g');


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
('Langar ki Dal',        110, 5.0, 12.0,  4.5, 3.0, 200, 'base', 'g');
