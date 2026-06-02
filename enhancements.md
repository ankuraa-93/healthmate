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
- ~~Frequently logged logic — done (renamed to "Suggested", moved to dashboard with pattern-based logic: daily/weekly/biweekly). Dummy test data still in page.tsx — remove before final ship.~~ - Completed ✅
- ~~If user hides suggested tray, don't show it again for the same day + meal when page refreshes.~~ - Completed ✅
- ~~The microphone turns on as soon as the log food bottom sheet opens. I know we did this because the initial audio being sent to whisper was truncated. But I think we can ask for permission when the bottom sheet opens but actually switch on the microphone only when user clicks on the voice button.~~ - Completed ✅
- ~~Rename app from Calorific to Calorrific (double R — sounds like "terrific")~~ - Completed ✅
- ~~Fix bottom nav bar scrolling on iOS up-swipe — overscroll-behavior: none on html/body, sticky nav, overscroll-contain on scroll container~~ - Completed ✅
- ~~Shareable daily log link — logged-in user taps iOS share icon in dashboard header, generates a unique URL. Viewer sees read-only dashboard (same UI: WeekStrip with owner name, calorie ring, macros, meal cards) without FAB, edit, delete, suggestions, or bottom nav. Viewer can navigate between days. Uses share_links DB table + get_shared_log RPC (SECURITY DEFINER) to bypass RLS for public access.~~ - Completed ✅

### Add Food

- ~~Option to undo in the toast after food is deleted (since there is no confirmation screen after delete)~~ - Completed ✅
- ~~Warning for erroneous quantities~~ - Completed ✅

### Nutrition & Data

- Food images — `image_url` column added to `food_library`, UI wired (FoodCard, EditFoodSheet, AddFoodSheet tray, share page). Edge Function + pg_cron infrastructure deployed. **Blocker: need a working image search API.** Google Custom Search JSON API deprecated for new customers (Jan 2026). Gemini grounding hallucates image URLs (all fail HEAD validation). Next options to try: Brave Search API (free 2,000/mo, real indexed URLs), Bing Image Search API, or SerpAPI.

---

## v2 Goals

> Image logging + automatic food detection

- ~~user can upload an image of the food, pick the meal it belongs. the app automatically identifies the food and estimates the quantity and logs it (sync if its fast without compromising accuracy, async otherwise)~~ - Completed ✅
- onboarding flow to set personalised targets based on goals
- ~~improve signup/in experience: single textbox to enter email which figures new vs existing user. also, sign in automatically after signup.~~ - Completed ✅
- ~~Processing state UX — replace spinning loader on processing photos with a static indicator (less distracting). Remove photo from meal section during processing; keep it only in photo tray. Show "Identifying foods from X photos" text in meal section instead.~~ - Completed ✅
- ~~Option to delete a processing/failed photo from the photo tray with an "are you sure?" confirmation prompt~~ - Completed ✅
- ~~Inline food editing on photo view — when user taps a food item in the processed photo view, expand the card inline (chevron + edit controls like the log food flow) instead of opening a separate bottom sheet. Keeps the photo in view while editing.~~ - Completed ✅
- ~~Gemini quantity overestimation — image-based estimates tend to be 10-20% high. Add calibration guidance in the vision system prompt to lean toward conservative/lower-bound portion estimates rather than applying a blanket multiplier.~~ - Completed ✅
- ~~Resilient image processing — handle Gemini failures (503 overload, rate limits, transient errors) gracefully. Options: fallback to a secondary model (e.g. gemini-2.0-flash), or a retry cron job that picks up failed/stuck processing jobs and reprocesses them on a schedule. Goal: no photo should silently fail — user should always get results, even if delayed.~~ - Completed ✅
- user should be able to edit foods identified from photos (keeping them linked to the photo but with an option to replace in case of wrong ID)
- ~~photos should be visible on the shareable link~~ - Completed ✅

---

## v3 Goals

> Weekly, monthly summaries — overview and guidance for current week/month.
> Good to have UI/UX improvements
>
> "Did you mean?" for confusing inputs. Flawless frequently logged food logic.

- Weekly/monthly calorie and macro trends (charts) — weekly calorie overview partially done via weekly strip mini rings; full charts still needed
- History tab — revisit calendar view design (user didn't love v1 calendar)
- High protein, high carb, high fat, high fibre tags instead of detailed values
- Give cues to the user during on what macros to focus on
- Loading states animations/visuals + other "cool" things
- "Did you mean?" disambiguation flow — when Gemini encounters ambiguous terms (e.g., "eggs" could be scrambled, boiled, fried, omelette), show a disambiguation screen with options instead of defaulting. Needs new UI screen + Gemini prompt changes to flag ambiguous items.
- Meal level summaries of cal + macros — calories done (inline after meal name with dot separator), macros not yet
- Add Noice (Swiggy Instamart private label) products — 200+ artisanal items across bakery, dairy, snacks, beverages, sweets. No public nutrition data yet; need actual packaging labels from Swiggy app or physical products. Start with top sellers: malai paneer, butter cookies, coconut water, spicy potato chips, banana chips, kaju katli, Punjabi lassi, sourdough bread.
- Dynamic goal setting: change calorie and macro targets for remaining days based on week-till-date logs. Also possible to include workout data to change calorie goals.

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

