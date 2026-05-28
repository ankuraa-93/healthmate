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
('Too Yumm Multigrain Chips', 475, 6.5, 70.0, 19.0, 5.0, 30, 'base', 'g');

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
('Chivda Bombay Mix', 485, 9.0, 52.0, 26.5, 3.5, 30, 'base', 'g');

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
('Tiger Biscuits', 455, 7.0, 72.0, 15.0, 2.0, 25, 'base', 'g');

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
('Bournville Dark', 525, 4.6, 65.3, 27.3, 6.0, 33, 'base', 'g');

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
('Chings Hakka Noodles Instant', 405, 8.0, 58.0, 15.5, 2.5, 70, 'base', 'g');

-- ============================================================================
-- PACKAGED SNACKS — POPCORN & OTHER (3 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Act II Sour Cream and Cheese Popcorn', 480, 7.0, 53.0, 27.0, 8.0, 30, 'base', 'g'),
('Act II Butter Popcorn', 449, 9.0, 66.0, 19.0, 8.5, 30, 'base', 'g'),
('Act II Classic Salted Popcorn', 507, 10.0, 60.0, 26.0, 9.0, 30, 'base', 'g');

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
('Too Yumm Karare', 470, 7.5, 58.0, 23.0, 4.5, 30, 'base', 'g');

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
('Iced Tea Sweetened', 32, 0.0, 8.0, 0.0, 0.0, 250, 'base', 'ml');

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
('Chaas Buttermilk Homemade', 18, 1.0, 2.0, 0.5, 0.0, 200, 'base', 'ml');

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
('Maaza Mango Drink', 50, 0.0, 12.5, 0.0, 0.0, 200, 'base', 'ml');

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
('Appy Fizz', 48, 0.0, 12.0, 0.0, 0.1, 250, 'base', 'ml');

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
('Sattu Drink', 35, 2.5, 5.5, 0.5, 0.8, 300, 'base', 'ml');

-- ============================================================================
-- BEVERAGES — NON-ALCOHOLIC — ENERGY & HEALTH (3 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Red Bull', 46, 0.0, 11.0, 0.0, 0.0, 250, 'base', 'ml'),
('Glucon D Glass', 30, 0.0, 7.5, 0.0, 0.0, 200, 'base', 'ml'),
('Electral ORS Glass', 10, 0.0, 2.5, 0.0, 0.0, 200, 'base', 'ml');

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
('Chivas Regal', 250, 0.0, 0.0, 0.0, 0.0, 30, 'base', 'ml');

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
('Hoegaarden', 45, 0.5, 3.5, 0.0, 0.0, 330, 'base', 'ml');

-- ============================================================================
-- ALCOHOLIC BEVERAGES — WINE (4 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Red Wine', 85, 0.1, 2.6, 0.0, 0.0, 150, 'base', 'ml'),
('White Wine', 82, 0.1, 2.6, 0.0, 0.0, 150, 'base', 'ml'),
('Sula Chenin Blanc', 80, 0.1, 2.5, 0.0, 0.0, 150, 'base', 'ml'),
('Sula Shiraz', 86, 0.1, 2.8, 0.0, 0.0, 150, 'base', 'ml');

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
('Breezer Bacardi', 60, 0.0, 9.0, 0.0, 0.0, 275, 'base', 'ml');

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
('AS IT IS Whey Protein', 380, 80.0, 7.0, 3.0, 0.5, 30, 'base', 'g');

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
('Alpino Peanut Butter', 645, 30.0, 18.0, 49.0, 6.0, 32, 'base', 'g');

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
('Aloe Vera Juice', 8, 0.0, 2.0, 0.0, 0.0, 30, 'base', 'ml');

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
('Cup Noodles Nissin', 465, 10.0, 60.9, 19.2, 2.5, 70, 'base', 'g');

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
('Coconut Cream', 330, 3.3, 6.7, 33.5, 2.2, 30, 'base', 'ml');

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
('Cheese Toast', 310, 11.0, 28.0, 17.0, 1.5, 50, 'base', 'g');

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
('Chicken Frankie', 195, 10.0, 22.0, 7.5, 1.5, 200, 'base', 'g');

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
('Onion Raita', 52, 2.5, 4.5, 2.5, 0.3, 50, 'base', 'g');

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
('Bread Butter Jam', 330, 6.0, 48.0, 13.0, 1.5, 60, 'base', 'g');

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
('Bun Maska', 295, 6.5, 42.0, 11.5, 1.5, 80, 'base', 'g');

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
('Amritsari Macchi', 220, 14.0, 12.0, 13.5, 0.5, 100, 'base', 'g');

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
('Rice Cake', 387, 8.0, 81.0, 2.8, 1.5, 9, 'base', 'g');

-- ============================================================================
-- ADDITIONAL BRANDED — SPREADS (5 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Nutella', 539, 6.3, 57.5, 30.9, 3.4, 15, 'base', 'g'),
('Kissan Mixed Fruit Jam', 285, 0.3, 70.5, 0.1, 0.5, 20, 'base', 'g'),
('Kissan Mango Jam', 262, 0.2, 65.0, 0.0, 0.3, 20, 'base', 'g'),
('Hersheys Chocolate Syrup', 276, 1.0, 65.0, 0.5, 1.0, 20, 'base', 'ml'),
('Mapro Jam Strawberry', 255, 0.3, 63.0, 0.0, 0.5, 20, 'base', 'g');

-- ============================================================================
-- ADDITIONAL BRANDED — READY MIXES (3 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('MTR Rava Dosa Mix', 360, 9.0, 74.0, 3.0, 2.5, 50, 'base', 'g'),
('MTR Poha Ready to Eat', 145, 2.5, 22.0, 5.0, 1.5, 180, 'base', 'g'),
('Gits Dhokla Mix', 340, 10.0, 73.0, 0.8, 3.0, 40, 'base', 'g');

-- ============================================================================
-- ADDITIONAL BRANDED — BREAD BRANDS (5 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Harvest Gold Bread White', 228, 7.4, 46.2, 1.4, 2.5, 30, 'base', 'g'),
('Harvest Gold Bread Wheat', 248, 10.2, 46.3, 2.5, 5.0, 30, 'base', 'g'),
('Modern Bread White', 247, 7.0, 51.5, 1.7, 2.5, 30, 'base', 'g'),
('Britannia Bread White', 252, 7.3, 52.0, 1.7, 2.5, 30, 'base', 'g'),
('English Oven Bread', 261, 8.7, 54.9, 1.0, 2.5, 30, 'base', 'g');

-- ============================================================================
-- ADDITIONAL BRANDED — FROZEN NON-VEG (4 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Licious Chicken Sausage', 207, 10.0, 7.3, 15.2, 0.5, 50, 'base', 'g'),
('Licious Chicken Salami', 234, 13.0, 8.7, 17.0, 0.5, 30, 'base', 'g'),
('Licious Mutton Keema', 175, 17.0, 2.0, 11.0, 0.5, 100, 'base', 'g'),
('FreshToHome Fish Fillet', 84, 18.0, 0.0, 1.0, 0.0, 100, 'base', 'g');

-- ============================================================================
-- ADDITIONAL BRANDED — SAUCES (3 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Chings Schezwan Chutney', 165, 2.0, 15.0, 10.5, 3.0, 15, 'base', 'g'),
('Funfoods Pasta Sauce Cheese Herbs', 105, 2.5, 10.0, 6.0, 0.5, 30, 'base', 'g'),
('Del Monte Pasta Sauce Red', 55, 1.5, 8.5, 1.5, 1.5, 30, 'base', 'g');

-- ============================================================================
-- ADDITIONAL BRANDED — HEALTH DRINKS (5 items)
-- All values per 100ml of prepared drink (powder + milk)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Bournvita with Milk', 78, 3.5, 11.0, 2.5, 0.5, 200, 'base', 'ml'),
('Horlicks with Milk', 76, 3.5, 11.0, 2.0, 0.5, 200, 'base', 'ml'),
('Complan with Milk', 85, 4.0, 11.5, 2.5, 0.3, 200, 'base', 'ml'),
('Boost with Milk', 78, 3.5, 11.5, 2.0, 0.5, 200, 'base', 'ml'),
('Ensure Nutrition Shake', 105, 3.8, 16.9, 2.5, 0.5, 200, 'base', 'ml');

-- ============================================================================
-- ADDITIONAL BRANDED — ENERGY & OTHERS (3 items)
-- All values per 100ml
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Pepsi Black Zero Sugar', 0.4, 0.0, 0.0, 0.0, 0.0, 250, 'base', 'ml'),
('Sting Energy Drink', 28, 0.0, 7.0, 0.0, 0.0, 250, 'base', 'ml'),
('Monster Energy Drink', 47, 0.0, 11.0, 0.0, 0.0, 250, 'base', 'ml');

-- ============================================================================
-- END OF SEED PART 5
-- Total unique items: ~342 (after skipping 4 duplicates: items 186, 294, 301, 310, 313)
-- ============================================================================
