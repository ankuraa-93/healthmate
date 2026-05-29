# HealthMate — Future Enhancements

## v1 Goals
> Voice + text parsing should work flawlessly. Auto food addition to food library should work flawlessly. The app should be good looking and inviting to use. Basic UI/UX functions should be available.

### UX
- Swipe-to-delete on food cards (alternative to tap > edit > delete) — done
- Pull-to-refresh on dashboard — done
- Remove comma from calorie counter — done
- Change font, font size and boldness (check if Avenir will look good) — done
- Color coding improvements (replace light blue with lightened green, orange based on calorie %) — done
- Forgot password flow — done
- Drag-and-drop food cards between meal groups on dashboard — moved to later
- Frequently logged logic — can we move it to dashboard page instead? Review logic: daily, weekly and biweekly frequency.

### Add Food
- Larger, more photo-focused frequent food cards (explore different layouts)
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

- Weekly/monthly calorie and macro trends (charts)
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
