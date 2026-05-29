# HealthMate — Future Enhancements

## UX Enhancements

- Drag-and-drop food cards between meal groups on dashboard -- v1
- Swipe-to-delete on food cards (alternative to tap → edit → delete) -- v1
- Pull-to-refresh on dashboard -- v1

## Add Food

- "Did you mean?" disambiguation flow — when Gemini encounters ambiguous terms (e.g., "eggs" could be scrambled, boiled, fried, omelette), show a disambiguation screen with options instead of defaulting. Needs new UI screen + Gemini prompt changes to flag ambiguous items. -- v2
- Larger, more photo-focused frequent food cards (explore different layouts) -- v1
- Option to undo in the toast after food is deleted (since there is no confirmation screen after delete) -- v1

## Nutrition & Data

- Weekly/monthly calorie and macro trends (charts) -- v3
- Streak tracking (days meeting goals) -- later
- Nutrition insights ("You're consistently low on fibre") -- later
- Export food log as CSV -- later

## Food Library

- Food images — add `image_url` column to `food_library` table. Source options: (1) Gemini web search can return image URLs alongside nutrition data, (2) Unsplash/Pexels API for generic foods, (3) user-uploaded photos. Display on dashboard FoodCards + ConfirmFoodSheet + frequently logged section (currently using initial-letter avatars). Consider storing as Supabase Storage URLs for permanence (external URLs can rot). Will need schema migration + UI updates across FoodCard, ConfirmFoodSheet, AddFoodSheet frequent foods. -- v1.1
- Add Noice (Swiggy Instamart private label) products — 200+ artisanal items across bakery, dairy, snacks, beverages, sweets. No public nutrition data yet; need actual packaging labels from Swiggy app or physical products. Start with top sellers: malai paneer, butter cookies, coconut water, spicy potato chips, banana chips, kaju katli, Punjabi lassi, sourdough bread. -- v2

## Polish -- later

- Haptic feedback on mobile (vibrate on tap, delete, submit)
- Skeleton loading states while data fetches
- Empty states for no meals logged yet
- Onboarding flow for first-time users (set goals, explain natural language input)
- Dark mode

## Late night thoughts

- Remove comma from calorie counter -- v1
- Warning for errogenous quantities -- v1
- Frequently logged logic -- v2
  - can we move it to dashboard page instead?
  - review logic: daily, weekly and biweekly frequency
- change font, font size and boldness (check if avenir will look good) -- v1
- meal level summaries of cal + macros -- v2

- change grouping by food type on daily view (unhealthy snacks, high sugar, whole foods etc.) -- later
- History tab — revisit calendar view design (user didn't love v1 calendar) -- v3
- color coding improvements (replace light blue with lightened green, orange based on calorie %) -- v1





## v1 goals:

- voice + text parsing should work flawlessly
- auto food addition to food library should work flawlessly
- the app should be good looking and inviting to use
- basic UI/UX functions should be available



## v2 goals:

- did you mean in case of confusing inputs
- flawless frequently logged food logic



## v3 goals:

- weekly, monthly summaries - overview and guidance for current week/mo

