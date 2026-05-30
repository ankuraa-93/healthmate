# HealthMate — Future Enhancements



Instructions:

- Don't change any existing bullet text. You can add. 
- You can rearrange bullets across section if priorities change.
- When a bullet is completed, strikethrough the bullet and add "- Completed" text next to it, with a green tick emoji.

## v1 Goals

> Voice + text parsing should work flawlessly. Auto food addition to food library should work flawlessly. The app should be good looking and inviting to use. Basic UI/UX functions should be available.

### UX

- ~~Swipe-to-delete on food cards (alternative to tap > edit > delete)~~ - Completed ✅
- ~~Pull-to-refresh on dashboard~~ - Completed ✅
- ~~Remove comma from calorie counter~~ - Completed ✅
- ~~Change font, font size and boldness (check if Avenir will look good)~~ - Completed ✅
- ~~Color coding improvements (replace light blue with lightened green, orange based on calorie %)~~ - Completed ✅
- ~~Forgot password flow~~ - Completed ✅
- ~~Weekly date strip with mini calorie rings — replaced date picker with Mon-Sun strip showing daily calorie progress, swipe to change weeks, tap/swipe to change days~~ - Completed ✅
- ~~Grouped meal cards — foods in the same meal grouped into one card with meal label inside, margin-to-margin separators between items, edge-to-edge separator before suggestions~~ - Completed ✅
- ~~Food card layout — calories next to quantity, macros right-aligned on same line, less busy~~ - Completed ✅
- ~~Suggested foods embedded in meal cards — suggestions appear inside the grouped card with edge-to-edge separator~~ - Completed ✅
- ~~Subtle shadows on weekly strip header and bottom nav~~ - Completed ✅
- ~~Consistent styling between dashboard and Log Food sheet — grouped cards, layout, colors match~~ - Completed ✅
- ~~Log Food sheet UX polish — iOS-style "Done" text button, green tick after food names (flashes to spinner on save), chevron down/up for expand/collapse, stepped loading messages ("Identifying food..." → "Logging X foods...")~~ - Completed ✅
- Frequently logged logic — done (renamed to "Suggested", moved to dashboard with pattern-based logic: daily/weekly/biweekly). Dummy test data still in page.tsx — remove before final ship.
- If user hides suggested tray, don't show it again for the same day + meal when page refreshes.

### Add Food

- Option to undo in the toast after food is deleted (since there is no confirmation screen after delete)
- Warning for erroneous quantities

### Nutrition & Data

- Food images — add `image_url` column to `food_library` table. Source options: (1) Gemini web search can return image URLs alongside nutrition data, (2) Unsplash/Pexels API for generic foods, (3) user-uploaded photos. Display on dashboard FoodCards + ConfirmFoodSheet + frequently logged section (currently using initial-letter avatars). Consider storing as Supabase Storage URLs for permanence (external URLs can rot). Will need schema migration + UI updates across FoodCard, ConfirmFoodSheet, AddFoodSheet frequent foods.

---

## v2 Goals

> "Did you mean?" for confusing inputs. Flawless frequently logged food logic.

- "Did you mean?" disambiguation flow — when Gemini encounters ambiguous terms (e.g., "eggs" could be scrambled, boiled, fried, omelette), show a disambiguation screen with options instead of defaulting. Needs new UI screen + Gemini prompt changes to flag ambiguous items.
- Meal level summaries of cal + macros
- Add Noice (Swiggy Instamart private label) products — 200+ artisanal items across bakery, dairy, snacks, beverages, sweets. No public nutrition data yet; need actual packaging labels from Swiggy app or physical products. Start with top sellers: malai paneer, butter cookies, coconut water, spicy potato chips, banana chips, kaju katli, Punjabi lassi, sourdough bread.

---

## v3 Goals

> Weekly, monthly summaries — overview and guidance for current week/month.
> Good to have UI/UX improvements

- Weekly/monthly calorie and macro trends (charts) — weekly calorie overview partially done via weekly strip mini rings; full charts still needed
- History tab — revisit calendar view design (user didn't love v1 calendar)
- High protein, high carb, high fat, high fibre tags instead of detailed values
- Give cues to the user during on what macros to focus on
- Loading states animations/visuals + other "cool" things

---

## Later

- Drag-and-drop food cards between meal groups on dashboard
- Streak tracking (days meeting goals)
- Nutrition insights ("You're consistently low on fibre")
- Export food log as CSV
- Haptic feedback on mobile (vibrate on tap, delete, submit)
- Skeleton loading states while data fetches
- Empty states for no meals logged yet
- Onboarding flow for first-time users (set goals, explain natural language input)
- Dark mode
- Change grouping by food type on daily view (unhealthy snacks, high sugar, whole foods etc.)

