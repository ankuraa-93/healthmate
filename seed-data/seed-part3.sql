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
('Keema Pav', 185, 11.0, 16.0, 8.5, 1.0, 300, 'base', 'g');

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
('Sweet Corn Soup', 52, 2.0, 9.0, 1.0, 0.8, 200, 'base', 'ml');

-- ============================================================================
-- HOT SOUPS (2 items)
-- ============================================================================
INSERT INTO food_library (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, serving_size_g, source, unit) VALUES
('Hot and Sour Soup Veg', 45, 1.5, 7.0, 1.2, 0.5, 200, 'base', 'ml'),
('Manchow Soup', 55, 2.0, 8.0, 1.8, 0.8, 200, 'base', 'ml');

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
('Shrikhand', 195, 5.5, 28.0, 7.5, 0.1, 100, 'base', 'g');

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
('Waffle with Syrup', 275, 5.0, 40.0, 11.0, 0.5, 120, 'base', 'g');

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
('Chicken Wings 6 pcs', 250, 18.5, 8.0, 16.5, 0.3, 180, 'base', 'g');

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
('Raita Mixed Veg', 60, 2.5, 5.5, 3.0, 0.5, 100, 'base', 'g');
