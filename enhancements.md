# HealthMate — Future Enhancements

## UX Enhancements
- Drag-and-drop food cards between meal groups on dashboard
- History tab — revisit calendar view design (user didn't love v1 calendar)
- Swipe-to-delete on food cards (alternative to tap → edit → delete)
- Pull-to-refresh on dashboard

## Add Food
- "Did you mean?" disambiguation flow — when Gemini encounters ambiguous terms (e.g., "eggs" could be scrambled, boiled, fried, omelette), show a disambiguation screen with options instead of defaulting. Needs new UI screen + Gemini prompt changes to flag ambiguous items.
- When user taps + on a frequent food, the + icon should turn to a tick (✓) to indicate it's been added to the textbox
- Map meal type for frequently logged foods (so they auto-assign to the correct meal group on submit)
- Larger, more photo-focused frequent food cards (explore different layouts)
- Smart suggestions based on time of day (breakfast items in morning, etc.)
- Recent searches / recent natural language inputs
- Multi-line voice transcription editing before submit

## Edit Food
- Inline quantity editing (tap quantity on card directly without opening sheet)
- Unit toggle (g ↔ ml) on edit sheet for ambiguous items
- "Delete & re-log" flow when user wants to change the food itself

## Nutrition & Data
- Weekly/monthly calorie and macro trends (charts)
- Streak tracking (days meeting goals)
- Nutrition insights ("You're consistently low on fibre")
- Export food log as CSV

## Food Library
- Food images — add `image_url` column to `food_library` table. Source options: (1) Gemini web search can return image URLs alongside nutrition data, (2) Unsplash/Pexels API for generic foods, (3) user-uploaded photos. Display on dashboard FoodCards + ConfirmFoodSheet + frequently logged section (currently using initial-letter avatars). Consider storing as Supabase Storage URLs for permanence (external URLs can rot). Will need schema migration + UI updates across FoodCard, ConfirmFoodSheet, AddFoodSheet frequent foods.
- Add Noice (Swiggy Instamart private label) products — 200+ artisanal items across bakery, dairy, snacks, beverages, sweets. No public nutrition data yet; need actual packaging labels from Swiggy app or physical products. Start with top sellers: malai paneer, butter cookies, coconut water, spicy potato chips, banana chips, kaju katli, Punjabi lassi, sourdough bread.

## Polish
- Haptic feedback on mobile (vibrate on tap, delete, submit)
- Skeleton loading states while data fetches
- Empty states for no meals logged yet
- Onboarding flow for first-time users (set goals, explain natural language input)
- Dark mode
