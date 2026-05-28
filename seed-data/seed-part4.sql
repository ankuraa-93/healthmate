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
('Plum',                46,  0.7, 11.4, 0.3, 1.4,  66, 'base', 'g');


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
('Green Chilli',        40,  1.9,  8.8, 0.4, 1.5,   5, 'base', 'g');


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
('Brazil Nuts',              659, 14.3, 11.7, 67.1,  7.5,  20, 'base', 'g');


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
('Ragi Flour',          328, 7.3, 72.0, 1.3, 11.5,  30, 'base', 'g');


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
('Amul Gold',                    87, 3.0, 5.0, 6.0, 0.0, 200, 'base', 'ml');

-- 5b. Curd / Dahi (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Masti Dahi',    65, 4.0, 4.6, 3.1, 0.0, 100, 'base', 'g'),
('Mother Dairy Dahi',  62, 3.7, 5.0, 3.0, 0.0, 100, 'base', 'g'),
('Nestle a+ Dahi',     59, 3.3, 4.6, 3.0, 0.0, 100, 'base', 'g'),
('Milky Mist Curd',    63, 3.2, 4.8, 3.2, 0.0, 100, 'base', 'g'),
('Nandini Curd',       59, 3.8, 4.3, 3.0, 0.0, 100, 'base', 'g'),
('Chitale Dahi',       76, 3.4, 6.5, 4.1, 0.0, 100, 'base', 'g');

-- 5c. Greek Yogurt (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Epigamia Greek Yogurt Plain',       65, 7.0,  5.0, 2.0, 0.0, 100, 'base', 'g'),
('Epigamia Greek Yogurt Strawberry', 102, 6.8, 13.9, 2.1, 0.0, 100, 'base', 'g'),
('Epigamia Greek Yogurt Mango',      106, 6.4, 15.6, 1.7, 0.0, 100, 'base', 'g'),
('Milky Mist Greek Yogurt Plain',     78, 8.0,  6.5, 2.2, 0.0, 100, 'base', 'g'),
('Nestle a+ Greek Yogurt Plain',      65, 5.7,  7.4, 1.7, 0.0, 100, 'base', 'g'),
('Nestle a+ Grekyo Mango',           105, 5.1, 16.6, 2.0, 0.0, 100, 'base', 'g');

-- 5d. Flavoured Yogurt (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Mishti Doi',                     160, 4.8, 26.0, 4.8, 0.0, 100, 'base', 'g'),
('Mother Dairy Fruit Yogurt Strawberry', 136, 4.1, 19.5, 4.6, 0.0, 100, 'base', 'g');

-- 5e. Buttermilk (unit = 'ml', values per 100ml)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Masti Buttermilk',    28, 1.5, 1.8, 1.5, 0.0, 200, 'base', 'ml'),
('Mother Dairy Buttermilk',  20, 1.2, 1.2, 1.2, 0.0, 200, 'base', 'ml'),
('Nandini Majjige',          24, 1.5, 1.8, 1.2, 0.0, 200, 'base', 'ml');

-- 5f. Ghee (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Ghee',              900, 0.0, 0.0, 99.8, 0.0, 10, 'base', 'g'),
('Mother Dairy Ghee',      900, 0.0, 0.0, 99.8, 0.0, 10, 'base', 'g'),
('Patanjali Cow Ghee',     900, 0.0, 0.0, 99.7, 0.0, 10, 'base', 'g'),
('Gowardhan Ghee',         900, 0.0, 0.0, 99.8, 0.0, 10, 'base', 'g'),
('Nandini Ghee',           900, 0.0, 0.0, 99.7, 0.0, 10, 'base', 'g'),
('Aashirvaad Svasti Ghee', 900, 0.0, 0.0, 99.8, 0.0, 10, 'base', 'g');

-- 5g. Butter (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Butter Salted',    720, 0.6, 0.9, 80.0, 0.0, 10, 'base', 'g'),
('Amul Butter Unsalted',  720, 0.6, 0.8, 80.0, 0.0, 10, 'base', 'g'),
('Mother Dairy Butter',   720, 0.7, 0.8, 80.0, 0.0, 10, 'base', 'g'),
('Britannia Butter',      720, 0.5, 1.0, 80.0, 0.0, 10, 'base', 'g'),
('Amul Garlic Butter',    700, 0.6, 1.5, 78.0, 0.0, 10, 'base', 'g'),
('Nutralite Butter',      630, 0.3, 0.0, 70.0, 0.0, 10, 'base', 'g');

-- 5h. Paneer (values per 100g)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Paneer',           312, 20.0, 4.0, 24.0, 0.0, 50, 'base', 'g'),
('Mother Dairy Paneer',   260, 18.0, 1.5, 20.5, 0.0, 50, 'base', 'g'),
('Gowardhan Paneer',      265, 18.0, 2.0, 21.0, 0.0, 50, 'base', 'g'),
('Milky Mist Paneer',     283, 16.1, 5.1, 22.0, 0.0, 50, 'base', 'g'),
('Verka Paneer',          289, 18.5, 3.0, 22.5, 0.0, 50, 'base', 'g'),
('Nandini Paneer',        297, 19.0, 5.0, 23.0, 0.0, 50, 'base', 'g'),
('Chitale Paneer',        346, 20.3, 5.1, 27.1, 0.0, 50, 'base', 'g');

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
('Cheddar Cheese',              403, 24.9, 1.3, 33.1, 0.0, 30, 'base', 'g');

-- 5j. Cream (unit = 'ml', values per 100ml)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Amul Fresh Cream',                250, 2.0, 3.5, 25.0, 0.0, 30, 'base', 'ml');


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
('Cooking Spray',            884, 0.0, 0.0, 100.0, 0.0,  1, 'base', 'g');


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
('Supari Sweet',                  380, 4.0, 55.0, 16.0, 5.0,   5, 'base', 'g');
