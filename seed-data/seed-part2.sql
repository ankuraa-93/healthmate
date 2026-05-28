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
('Chicken Xacuti', 165, 14.0, 5.0, 10.0, 1.2, 200, 'base', 'g');

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
('Bhuna Gosht', 188, 16.0, 3.5, 12.5, 0.8, 200, 'base', 'g');

-- 1c. Egg Curries (5 items)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Egg Curry', 130, 9.0, 5.0, 8.5, 0.8, 200, 'base', 'g'),
('Egg Masala', 155, 10.5, 4.5, 10.5, 0.7, 150, 'base', 'g'),
('Egg Bhurji', 170, 11.0, 3.5, 12.5, 0.5, 150, 'base', 'g'),
('Omelette', 155, 11.0, 0.7, 12.0, 0.0, 60, 'base', 'g'),
('Masala Omelette', 160, 10.5, 2.5, 12.0, 0.5, 75, 'base', 'g');

-- 1d. Fish & Seafood (8 items)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Fish Curry', 115, 13.0, 4.0, 5.5, 0.6, 200, 'base', 'g'),
('Fish Masala', 145, 15.0, 4.5, 7.5, 0.8, 150, 'base', 'g'),
('Prawn Curry', 110, 12.5, 4.5, 5.0, 0.5, 200, 'base', 'g'),
('Prawn Masala', 135, 14.0, 5.0, 6.5, 0.7, 150, 'base', 'g'),
('Goan Fish Curry', 125, 13.0, 4.5, 6.0, 0.8, 200, 'base', 'g'),
('Kerala Fish Curry', 130, 13.5, 4.0, 6.5, 0.7, 200, 'base', 'g'),
('Fish Moilee', 140, 12.5, 4.5, 8.5, 0.6, 200, 'base', 'g'),
('Crab Masala', 125, 14.0, 5.0, 5.5, 0.8, 200, 'base', 'g');

-- 1e. Grilled / Tandoori (7 items)
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Grilled Chicken Tikka', 165, 25.0, 2.5, 6.0, 0.3, 150, 'base', 'g'),
('Tandoori Chicken', 160, 24.0, 3.0, 5.5, 0.4, 200, 'base', 'g'),
('Grilled Chicken Malai Tikka', 195, 22.0, 2.5, 10.5, 0.2, 150, 'base', 'g'),
('Grilled Chicken Seekh Kebab', 175, 18.0, 4.0, 9.5, 0.6, 100, 'base', 'g'),
('Grilled Mutton Seekh Kebab', 210, 16.5, 4.0, 14.0, 0.5, 100, 'base', 'g'),
('Grilled Fish Tikka', 135, 20.0, 2.5, 5.0, 0.3, 150, 'base', 'g'),
('Grilled Tandoori Prawns', 125, 20.5, 3.0, 3.5, 0.2, 150, 'base', 'g');


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
('French Beans Sabzi', 72, 2.5, 7.0, 3.5, 3.0, 150, 'base', 'g');


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
('Hyderabadi Biryani', 190, 8.5, 22.0, 8.0, 0.5, 250, 'base', 'g');


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
('Pathiri', 260, 7.0, 50.0, 3.5, 1.5, 35, 'base', 'g');


-- ---------------------------------------------------------------------------
-- 5. EGGS & EGG DISHES (6 items — excludes duplicates from Non-Veg section)
-- ---------------------------------------------------------------------------

INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Boiled Egg', 155, 13.0, 1.1, 11.0, 0.0, 50, 'base', 'g'),
('Boiled Egg White', 52, 11.0, 0.7, 0.2, 0.0, 33, 'base', 'g'),
('Fried Egg', 196, 13.5, 0.8, 15.0, 0.0, 46, 'base', 'g'),
('Poached Egg', 143, 12.5, 0.7, 10.0, 0.0, 50, 'base', 'g'),
('Scrambled Eggs', 148, 10.0, 1.6, 11.0, 0.0, 100, 'base', 'g'),
('Anda Bhurji', 175, 11.0, 3.0, 13.0, 0.5, 150, 'base', 'g');


-- ============================================================================
-- END OF SEED PART 2 — 128 items total
-- ============================================================================
