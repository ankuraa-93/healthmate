# HealthMate — Progress Log

## Step 1: Design + UX ✅ Complete

### What was done
1. Created comprehensive design specs (`design-specs.md`) covering:
   - Design system: color palette, typography (Inter, 10 styles), 8px spacing grid, border radii, shadows
   - 10 reusable components: calorie ring, macro bars, food log cards, FAB, bottom sheet, voice input button, date picker chip, text input, submit button, bottom nav
   - 6 screen specs with ASCII wireframes: auth, dashboard, add food, voice recording, history, settings
   - 6 user flows: first-time user, text logging, voice logging, pending lookup, past-date logging, delete entry
   - Responsive behavior, animation specs, icon set (Lucide), status patterns

2. Built interactive HTML/CSS prototypes:
   - `prototype.html` — all-in-one with navigation (requires clicking through auth)
   - Split into 5 standalone screen files in `screens/` for direct viewing

3. Iterated based on feedback (v1 → v2):

   **Dashboard changes:**
   - Removed redundant "Today" title + date chip → single "Today, May 25" pill
   - Calorie ring now shows consumed (753) instead of remaining (1,247)
   - Replaced emoji with stock photo thumbnails for food cards
   - Added Fibre as 4th macro bar
   - Reduced macro bar width by 20% to reduce crowding
   - Changed "Pending — check back shortly" → "Processing"
   - Removed Edit button from header
   - Rearranged top section: calorie ring (150px) on left + 2x2 macro grid on right in a horizontal row
   - Macro cells show: bold name → progress bar (full width) → light grey "Xg / Yg" value
   - "X remaining" text moved below the ring instead of separate centered line
   - Added dynamic color coding for calorie ring + macro bars:
     - When calories < 80% of target: all bars show light green (#A8E6CF)
     - When calories >= 80%: each bar colored by its own ratio — red (<80% or >110%), yellow (80–90%), green (90–110%)
   - Macro bar width set to 80% (reduced from full width)
   - Added monotone icons after each macro name (14px, secondary grey): drumstick, wheat, droplet, leaf
   - Added lightning bolt icon next to calorie value inside ring (custom SVG, 16x24px tall proportion for non-square look)
   - Centered the date pill in the header (was left-aligned)

   **Add Food sheet changes:**
   - Moved text input + mic + send button to fixed bottom bar (messaging app pattern)
   - Removed "Suggested for you" chips section
   - Renamed "Recently logged" → "Frequently logged" with frequency counts
   - Removed "Try typing naturally..." hint
   - Changed placeholder to "I just had omelette with toast"
   - Redesigned input bar as Gemini-style container: rounded box wrapping a 2-row textarea on top, mic + send buttons in a row below (more spacious feel)

   **Confirm Food screen (new):**
   - New screen between Add Food submit and logging: shows parsed items for user review before confirming
   - Flow: user submits natural lang → Gemini Flash parses (~0.4s) → confirm screen shows structured items → user confirms → items logged
   - Cards match dashboard style: thumbnail, food name, quantity + compact macros (P:X C:X F:X Fi:X), bold calories right-aligned
   - Meal type shown as section headers (e.g. "BREAKFAST") with separator line, not per-item dropdowns
   - Cards collapsed by default with chevron — tap to expand for quantity editing
   - Expanded area matches EditFoodSheet: wide input bar (right-aligned value + "g"), 44px trash button, ±50g/±10g pill row
   - Original query shown as plain subdued text below header (no icon/quotes/background)
   - Summary bar with total calories, "Log N Items" confirm button
   - Remove card animates out, empty meal sections auto-remove

### Latest design files (use these)
- `screens/02-dashboard-v2.html`
- `screens/03-add-food-v2.html`
- `screens/06-confirm-food.html` (new)
- `screens/01-auth.html` (unchanged)
- `screens/04-history.html` (unchanged)
- `screens/05-settings.html` (unchanged)

---

## Step 2: Finalize DB Architecture ✅ Complete
- Schema finalized in CLAUDE.md (3 tables: food_library, food_log, profiles)
- Changes from draft:
  - Added `UNIQUE` constraint on `food_library.name`
  - Added `NOT NULL` constraints and sensible defaults throughout
  - Added `meal_type` to food_log (breakfast/lunch/dinner/snack)
  - Added `updated_at` columns to all tables
  - Added default goal values to profiles (2000 cal, 120g protein, etc.)
  - Added composite indexes: `(user_id, logged_date)` and `(user_id, food_name)`
  - Used `timestamptz` instead of `timestamp`
  - Added `DEFAULT gen_random_uuid()` for PKs
- Animation decision: use Framer Motion for subtle transitions throughout the app
- Added `unit` column (`'g'` | `'ml'`) to `food_library` and `food_log` — solids display in g, liquids in ml. Nutrition math assumes 1ml ≈ 1g (close enough for water-based drinks). Keeps UX natural without adding density complexity.

## Step 3: Build App Shell 🔄 In Progress

### What was done
1. Initialized Next.js project with TypeScript + Tailwind CSS
2. Installed dependencies: framer-motion, @supabase/supabase-js, lucide-react
3. Set up design system in globals.css (all color tokens from design specs)
4. Created Supabase client config (needs real keys in .env.local)
5. Created TypeScript types for all DB entities
6. Built reusable components with Framer Motion animations:
   - BottomNav — 2-tab nav (Today, Settings) — History removed for now
   - CalorieRing — animated SVG ring with consumed/target display + lightning bolt icon, "X remaining" removed
   - MacroGrid — 2x2 grid with animated progress bars + color coding (light blue when <80%)
   - FoodCard — food entries with staggered animation, onClick for confirmed entries, tap feedback
   - FAB — floating action button with spring animation
   - AddFoodSheet — bottom sheet with spring physics, Gemini-style input, 2-col grid frequent foods with large photos, food attachment chips (Gemini-style), voice recording. Date picker removed (uses dashboard date).
   - EditFoodSheet — edit quantity (with ±10/±50 quick-adjust), meal type selector, live nutrition recalc, delete (trash icon inline with quantity), save button
   - Toast — animated notification with optional undo action button
7. Built utility layer:
   - `nutrition.ts` — calculateNutrition and scaleNutritionFromEntry functions
   - `mock-data.ts` — mockFoodLibrary with per_100g data for recalculation
8. Built pages:
   - `/` — Dashboard with date picker, calorie ring, macros, food cards grouped by meal type (Breakfast/Lunch/Snack/Dinner with separator lines), FAB → add food, tap card → edit food
   - `/auth` — Sign In / Sign Up with toggle
   - `/settings` — Profile, daily goals, sign out
9. All pages use mock data — ready for Supabase wiring
10. History page exists but is removed from nav — parked for redesign

### Key design decisions made during build
- Quantities always in g (solids) / ml (drinks) — no colloquial units
- Meal type order: Breakfast, Lunch, Snack, Dinner
- Macro icons (not colored dots) on edit sheet for consistency with dashboard
- Delete shows "[Food name] deleted" toast with Undo button (3s duration)
- Processing entries are not tappable/editable
- Frequent foods attach as chips in input container (structured data), free text goes to LLM
- Images bumped to 400px resolution to avoid pixelation
- Turbopack hangs on dev — use `next build && next start` for now

### Animations included
- Page elements fade/slide in on mount
- Calorie ring fills with eased animation
- Macro bars animate width with staggered delays
- Food cards stagger in from below with tap scale feedback
- FAB springs in with bounce
- Bottom sheets slide up with spring physics (damping:30, stiffness:300)
- Frequent food grid items stagger in
- Food attachment chips scale in/out
- Voice recording waveform bars animate continuously
- Toast slides up/down with optional action button
- All interactive elements have whileTap scale feedback

### Supabase Auth ✅
- Installed `@supabase/ssr` for cookie-based session management
- Set up browser client (`supabase.ts`) and server client (`supabase-server.ts`)
- Created `AuthProvider` context — tracks session via `onAuthStateChange`, exposes `useAuth()` hook, shows loading spinner during init, redirects unauthenticated users to `/auth` and authenticated users away from it
- Wired auth page: sign in (`signInWithPassword`), sign up (`signUp`), confirm password validation, error display, loading state
- Wired settings page: email from auth user (not hardcoded), sign out with `supabase.auth.signOut()`
- Downgraded from Next.js 16 to 15 — Next.js 16 had a "manifests singleton" bug in production builds
- Removed middleware approach (Next.js 16 deprecated it) — auth protection handled client-side in AuthProvider instead

### Supabase Database + Wiring ✅
- Created `supabase-schema.sql` with all 3 tables, indexes, RLS policies, and auto-create-profile trigger
- Tables created in Supabase: food_library, food_log, profiles
- RLS: food_library readable by all authenticated users; food_log and profiles restricted to own user
- Created `supabase-data.ts` data layer: fetchProfile, updateProfile, fetchFoodLogs, insertFoodLog, updateFoodLog, deleteFoodLog, fetchFoodLibraryItem, fetchFrequentFoods
- Dashboard wired to Supabase: fetches profile + food logs for selected date, update/delete entries hit Supabase
- Settings wired to Supabase: profile fetched from DB, email from auth
- AddFoodSheet: accepts frequentFoods as prop (fetched from food_log), no more mock images — uses initial letter avatars
- EditFoodSheet: fetches library item from Supabase for nutrition recalc, shows unit (g/ml) correctly
- FoodCard: removed mock image dependency, uses initial letter avatar, shows correct unit
- Removed all mock data dependencies from pages/components (mock-data.ts still exists but unused)
- Downgraded from Next.js 16 to 15 (middleware bug), removed middleware entirely
- Added eye/toggle icons on auth password fields

### What's next
- Test full flow end-to-end (sign in → empty dashboard → log food → see it appear)
- LLM integration (Gemini Flash for natural language parsing) — Step 5
- Voice input — Step 6
- USDA fallback — Step 7
- See `enhancements.md` for parked feature ideas
## Step 4: Build Base Food Library ✅ Complete

### What was done
1. Built 994 food items across 6 seed SQL files:
   - `seed-part1.sql` — Staples, fruits, breakfast items (~165 items)
   - `seed-part2.sql` — Main dishes, curries, dals, rice dishes (~180 items)
   - `seed-part3.sql` — Desserts, sweets, salads (~140 items)
   - `seed-part4.sql` — Dairy, oils, vegetables (~190 items)
   - `seed-part5.sql` — Packaged snacks, beverages, supplements, frozen, misc (~340 items)
   - `seed-part6-restaurant.sql` — Restaurant/chain food items (~80 items)

2. All values per 100g (solids) or 100ml (liquids), with serving_size_g for default portions

3. Comprehensive branded food validation across 5 sessions:
   - 114 items fixed total (9 + 17 + 23 + 27 + 38 across sessions)
   - Sources: FatSecret India, official packaging labels (user-provided photos), brand websites
   - Categories validated: all dairy, milks, yogurts, paneer, cheese, butter, ghee, oils, chips, namkeen, biscuits, chocolates, noodles, popcorn, frozen/RTE, protein powders, peanut butters, protein bars, juices, soft drinks, energy drinks, health drinks, spreads, beers, wines, spirits
   - 3 uncommon items removed (Milky Mist Whipping Cream, Rich's Non Dairy Cream, Epigamia Snack Pack Mango)

4. Atwater calorie formula validation passed (validate.py):
   - Formula: Cal ≈ P×4 + (C-Fi)×4 + Fi×2 + F×9
   - 994 items checked, only expected deviations (alcohol, tea, raw produce)
   - No suspicious values (0 cal, >900 cal, impossible macro totals, negative macros)

5. 12 composite dishes cross-checked against web sources (validation-comparison.md)

6. Merged all seed files → `seed-all-safe.sql` (with ON CONFLICT DO NOTHING for dedup)
7. Loaded into Supabase food_library: **990 unique items** (4 cross-file duplicates skipped)

## Step 5: Integrate Gemini Flash (LLM Parsing) ✅ Complete

### What was done
1. **Two-call architecture**: parse → fuzzy match → confirm → log
   - `/api/parse-food` — Gemini 2.5 Flash parses natural language into structured food items (name, quantity_g, unit, meal_type)
   - `/api/match-food` — fuzzy searches food_library (pg_trgm), sends candidates to Gemini to pick best match or reject & estimate
2. **Fuzzy search**: Postgres `pg_trgm` extension + `search_food_library()` RPC function with similarity scoring
3. **Auto-growing library**: unmatched foods get LLM nutrition estimates and are auto-inserted into food_library with `source='llm_estimate'`
4. **ConfirmFoodSheet component**: review screen between parsing and logging
   - Cards grouped by meal type (Breakfast/Lunch/Snack/Dinner)
   - Expandable quantity editing with ±10/±50 pills, trash button
   - Total calories summary, "Log N Items" confirm button
   - Spring animations matching rest of app
5. **System prompts**: detailed instructions for both parse and match calls
   - Parse: handles Indian food context, colloquial quantities ("2 eggs" → 120g), branded items
   - Match: semantic matching, brand specificity, preparation-aware (fried vs boiled)
6. **Retry logic**: auto-retries on 503/429 with backoff, user-friendly error messages
7. **Full dashboard wiring**: AddFoodSheet → parse API → match API → ConfirmFoodSheet → insertFoodLog → refresh

### Key decisions
- **Gemini 2.5 Flash** (not 2.0 — deprecated for new users)
- **Two Gemini calls** per submission (simpler than single combined call)
- **pg_trgm** with similarity threshold 0.15 + ILIKE fallback for fuzzy search
- **Anon RLS policies** on food_library for API route access (no service role key needed)
- **Direct Supabase client** in API routes (not cookie-based server client)
- **Key-based remount** for ConfirmFoodSheet state sync (avoids React ESLint setState-in-effect rule)

### Files created/modified
- `src/lib/gemini.ts` — Gemini config + system prompts
- `src/lib/gemini-retry.ts` — retry with backoff for 503/429
- `src/app/api/parse-food/route.ts` — parse API
- `src/app/api/match-food/route.ts` — match API
- `src/components/ConfirmFoodSheet.tsx` — confirm/review UI
- `src/app/page.tsx` — wired full flow

## Step 6: Add Voice Input — Not started
## Step 7: Add External Nutrition Lookup — Not started
## Step 8: Deploy — Not started
