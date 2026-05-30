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

## Step 6: Add Voice Input 🔄 Pivoting to Gemini Audio

### Phase 1 — Web Speech API (done, but Hinglish issues)
1. **Replaced mock recording** in `AddFoodSheet.tsx` with real Web Speech API
   - `SpeechRecognition` with `interimResults=true`, `continuous=true`
   - Mic button conditionally rendered based on browser support (`speechSupported` derived value)
   - Recording state: waveform animation, "Listening..." placeholder, stop button
   - Transcribed text populates input for editing before submit
   - Sheet close auto-stops recognition
2. **TypeScript declarations**: `src/types/speech.d.ts` — full type declarations for Web Speech API
3. **Speech transcript fix**: proper final/interim separation using `event.resultIndex` + `finalTranscriptRef` to accumulate finalized segments. Added `maxAlternatives: 1`.
4. **Hinglish attempts** (all hit limitations):
   - `en-IN` → can't recognize Hindi words ("maida" → "by the")
   - `hi-IN` → outputs Devanagari script, not Roman
   - `hi-Latn-IN` → falls back to `hi-IN` (Devanagari)
   - Built `src/lib/transliterate.ts` — Devanagari → Roman transliteration as workaround (currently wired in)
5. **Conclusion**: Web Speech API has no Hinglish (Hindi in Roman script) support. Transliteration works but is a workaround, not ideal.

### Phase 2 — Gemini Audio Input (planned, not started)
**Decision**: Send audio directly to Gemini Flash instead of using Web Speech API for transcription. Gemini accepts audio natively and can parse food + transcribe in one call.

**Why Gemini over Whisper API**:
- Already have Gemini API key, no new service needed
- Whisper has the same Hinglish problem (no code-switching, outputs Devanagari for Hindi)
- Gemini handles Hinglish naturally as an LLM — understands context
- Cheaper (~$0.001 per 10-sec clip vs Whisper's $0.006/min)
- One call instead of two (audio → structured food items, skip transcription step)

**Implementation plan**:
1. Replace Web Speech API with **MediaRecorder API** in AddFoodSheet (capture audio as WebM/OGG)
2. New API route `/api/parse-food-audio` — sends audio inline to Gemini Flash with parse system prompt
3. Wire into existing flow: record audio → stop → "Processing..." → match API → confirm screen → log
4. UX change: no real-time transcription while speaking. User records → stops → brief loading → confirm screen with parsed items
5. Can delete `src/lib/transliterate.ts` and `src/types/speech.d.ts` after migration
6. Keep speech recognition error correction in parse prompt as general robustness

## Step 7: Add External Nutrition Lookup ✅ Largely Complete

### What was done (as part of Step 5)
- **Web search grounding** via Gemini Flash with `tools: [{ googleSearch: {} }]`
- When food isn't in library → Gemini searches web for real nutrition data
- **Atwater formula validation**: server-side check (`Cal ≈ P×4 + (C−Fi)×4 + Fi×2 + F×9`), 15% deviation threshold
- **Retry with error feedback**: if Atwater fails, sends detailed error back to Gemini for fresh search
- Auto-inserts validated items into food_library with `source='web_search'`
- Three-tier data quality: `base` (990 seed items) > `web_search` > `llm_estimate`
- **NaN fix**: sanitize null/undefined nutrition fields to 0 before returning from API

### Note
Original plan was USDA FoodData Central API. Gemini's web search grounding turned out to be more versatile (covers Indian brands, restaurant items, etc.) so USDA API was not needed separately.

## Step 8: Deploy ✅ Complete
- Pushed to GitHub (`ankuraa-93/healthmate`)
- Deployed to Vercel via CLI: **https://hm-clone-gamma.vercel.app**
- Env vars configured: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`
- Supabase Site URL updated to production URL for auth redirects
- User account created via Admin API (rate limit workaround)

---

## Session: 2026-05-29 — UX fixes + Voice pivot

### Changes made this session
1. **Brand matching strengthened** (gemini.ts):
   - PARSE prompt: brand names marked CRITICAL — must never be dropped from parsed food names
   - MATCH prompt: if food name contains a brand, only a candidate with that same brand is acceptable. Generic/different-brand matches must be rejected (triggers web search fallback)
   - Added speech recognition error correction guidance to parse prompt (common Hindi food terms, Indian brand names)

2. **Food name wrapping** — removed `truncate` from FoodCard, ConfirmFoodSheet, and AddFoodSheet frequent foods. Long names now wrap with `leading-snug`.

3. **ConfirmFoodSheet back button** — pressing back now reopens AddFoodSheet with original query pre-filled (via `initialInput` prop + inner component pattern for clean remount state)

4. **AddFoodSheet close button** — X button added to header (top-right)

5. **Fixed bottom nav scrolling** — restructured page.tsx from single scrollable div to flex column layout. Scrollable content and BottomNav are now siblings — nav stays pinned regardless of scroll.

6. **AddFoodSheet refactored** to inner/outer component pattern (like ConfirmFoodSheet) to avoid React ESLint setState-in-effect rule while supporting `initialInput` prop.

7. **Voice input**: hi-IN + Devanagari→Roman transliteration currently wired in. Planned pivot to Gemini audio input (see Step 6 Phase 2).

## Session: 2026-05-29 — Log Food sheet redesign + Gemini audio

### Bug fixes
1. **MacroGrid hardcoded values** — protein/carbs/fat/fibre were using static placeholder values (45/82/18/8). Now receives actual totals and targets from dashboard via props.
2. **Quick-add from frequent foods** — tapping frequent foods showed "logged" toast but never inserted to DB (was a TODO stub). Now properly inserts with full nutrition data.

### Log Food sheet redesign
Major rewrite of `AddFoodSheet.tsx` — merged the separate confirm screen into the log food sheet:

1. **Logged foods tray** — confirmed items appear at top of sheet in a "Logged foods" section, grouped by meal type. Items are inserted to DB immediately when they appear (no separate confirm step).
2. **Inline editing** — tray items are expandable (chevron) with quantity input, ±10/±50 pills, and delete button. Edits/deletes update DB in real-time.
3. **Text flow** — type text → submit → textbox shows "Identifying food..." spinner → parse + match + insert → items appear in tray → textbox clears for more input.
4. **Voice flow** — replaced Web Speech API with MediaRecorder API → audio blob sent to new `/api/parse-food-audio` route → Gemini Flash parses audio directly → match + insert → items in tray.
5. **Frequent food toggle** — + icon becomes ✓ when selected, food appears in tray. Tap ✓ to remove (deletes from DB). Horizontal scroll grid layout: 3 rows per column, columns peek for scroll affordance.
6. **Done button** — top-right header, just closes the sheet (items already in DB). Backdrop click also closes.
7. **Additive flow** — textbox clears after each parse, user can keep adding via text, voice, or frequent foods in the same session.

### New API route
- `/api/parse-food-audio` — accepts audio blob (FormData), base64-encodes it, sends as inline data to Gemini Flash with the parse system prompt. Returns structured food items in same format as `/api/parse-food`.

### Removed
- `ConfirmFoodSheet` no longer used from dashboard (file kept but unused)
- Web Speech API replaced by MediaRecorder API
- Devanagari→Roman transliteration no longer imported (was a workaround for Web Speech hi-IN)
- Attached food chips in input bar (replaced by tray)

## Session: 2026-05-29 — Voice input rewrite (Groq Whisper)

### Problem
Voice input wasn't working — `gemini-2.5-flash` returns 503 on ALL audio requests (service-level issue). Pivoted through multiple approaches.

### Investigation & iterations
1. **Gemini 2.5 Flash audio** — 503 on every request regardless of format (webm, mp4, wav). Text works fine.
2. **Gemini 3-flash-preview** — worked but slow (~5s) and inaccurate (merged/dropped food items due to weaker prompt-following)
3. **Two-step approach adopted** — transcribe audio separately, show in textbox for user review, then parse text with gemini-2.5-flash
4. **Gemini 3.5 Flash for transcription** — accurate but slow (~5.4s)
5. **Groq Whisper** — sub-second latency, landed on this

### Groq Whisper tuning
- `whisper-large-v3-turbo`: fast but garbles Hindi words ("rajma masala" → "flat-murves")
- `whisper-large-v3` (full): better accuracy, still sub-second
- Contextual sentence prompt: caused hallucination (Whisper continued the prompt instead of transcribing)
- Word list prompt: best results — Hindi food terms recognized correctly
- `language=en` + `temperature=0`: reduces hallucination
- Prompt limit: 896 characters max (Groq rejects longer)

### Audio capture fix (critical)
Root cause of all transcription failures: `getUserMedia()` takes ~500-750ms to initialize. User starts speaking immediately on tap, so the first words were lost. All "garbled" transcriptions were actually correct transcriptions of truncated audio.

**Fix: mic pre-warming** — `getUserMedia` called when AddFoodSheet opens (on mount). Stream stored in a ref and reused for each recording. When user taps record, MediaRecorder starts instantly from the pre-warmed stream. Stream released on sheet close (unmount cleanup).

Other audio improvements:
- `recorder.start(250)` — timeslice capture every 250ms (was all-at-once on stop)
- `audioBitsPerSecond: 128000` — explicit bitrate
- `echoCancellation`, `noiseSuppression`, `autoGainControl` constraints
- Guard against double-start (`if recorder.state === 'recording' return`)

### Final voice architecture
1. **Mic pre-warm**: `getUserMedia` on sheet open, stream cached in ref
2. **Record**: MediaRecorder with pre-warmed stream, 250ms timeslice, 128kbps
3. **Transcribe**: Groq Whisper `whisper-large-v3`, `language=en`, `temperature=0`, word list prompt with Indian food terms + brand names (453/896 chars)
4. **Show transcript in textbox**: user reviews and edits before submitting
5. **Parse**: user hits submit → existing `/api/parse-food` with `gemini-2.5-flash` (same path as text input)

### Other fixes this session
- **Toast z-index** bumped to z-50 (was z-30, hidden behind AddFoodSheet)
- **Error toasts** added for all failure points (mic denied, parse error, match error, empty results)
- **Loading state gap** fixed — `setLoading(true)` now fires immediately on recording stop

### Files changed
- `src/app/api/parse-food-audio/route.ts` — rewritten: Groq Whisper transcription (was Gemini audio parsing)
- `src/components/AddFoodSheet.tsx` — voice flow: mic pre-warm, transcribe → show in textbox → user submits; error toasts; 128kbps audio
- `src/components/Toast.tsx` — z-index 30 → 50
- `src/app/page.tsx` — pass `onToast` to AddFoodSheet
- `src/lib/gemini.ts` — removed `flashModelAudio` (no longer needed)

### Dependencies added
- Groq API (`GROQ_API_KEY` in `.env.local`) — for Whisper transcription

### Next steps (priority order)
1. **Step 8**: Deploy (GitHub → Vercel + Supabase env vars — needs `GROQ_API_KEY` added)
2. **Enhancements**: See `enhancements.md` for parked ideas

## Session: 2026-05-30 — Deploy + v1 UX enhancements

### Deploy (Step 8)
- Pushed to GitHub, deployed to Vercel via CLI
- Production URL: **https://hm-clone-gamma.vercel.app**
- All 4 env vars configured on Vercel (Supabase URL, anon key, Gemini, Groq)
- Supabase Site URL changed to production for auth email redirects
- User account created via Supabase Admin API (email rate limit workaround)

### v1 UX enhancements
1. **Font**: Inter → system Avenir Next stack (zero font download)
2. **Font weight**: stepped down globally — bold→semibold, semibold→medium
3. **Food card sizing**: food name + calories both 14px font-medium
4. **Remove comma** from calorie counter (`toLocaleString` → direct value)
5. **Swipe-to-delete**: two-step — first swipe reveals delete button, second swipe auto-deletes. Drag/click conflict fixed with `didDrag` ref.
6. **Pull-to-refresh**: touch-based on dashboard, RefreshCw spinner, fetches logs+profile+frequent foods
7. **Forgot password**: "Forgot password?" link on auth page, sends Supabase reset email
8. **Color coding overhaul**: pace-relative logic
   - cal% >= 75%: yellow (75-89%), green (90-110%), red (<75% or >110%)
   - cal% < 75%: calorie ring = light green; macros compared against calorie pace (light green/yellow/red)
   - New CSS vars: `--color-light-green`, `--color-light-yellow`, `--color-light-red`
9. **Fixed date picker**: pinned to top, no longer scrolls with content
10. **Compact spacing**: reduced top padding, bottom nav uses safe-area-inset instead of fixed 83px
11. **Nav label**: "Today" → "Home"
12. **Swipe gap fix**: delete area fills full card (no whitespace between card and red area)

### Bug fixes
- **Timezone bug**: `toISOString().split('T')[0]` used UTC, causing wrong date after 6:30 PM IST. Fixed to use local date methods (`getFullYear`, `getMonth`, `getDate`) in both dashboard and history page.

### Files changed
- `src/app/layout.tsx` — font swap (Inter → Avenir Next system stack)
- `src/app/globals.css` — added light-green, light-yellow, light-red color vars
- `src/components/CalorieRing.tsx` — new color logic, comma removed
- `src/components/MacroGrid.tsx` — pace-relative color logic
- `src/components/FoodCard.tsx` — swipe-to-delete with two-step + drag/click fix
- `src/components/BottomNav.tsx` — "Home" label, compact height
- `src/components/EditFoodSheet.tsx` — font weight reduction
- `src/components/AddFoodSheet.tsx` — font weight reduction
- `src/components/Toast.tsx` — font weight reduction
- `src/app/page.tsx` — pull-to-refresh, fixed date header, swipe-delete wiring, timezone fix
- `src/app/auth/page.tsx` — forgot password flow, font weight
- `src/app/history/page.tsx` — timezone fix, font weight
- `src/app/settings/page.tsx` — font weight

## Session: 2026-05-30 — Suggested foods widget + UX fixes

### Suggested foods widget (replaces "Frequently logged")
Moved food suggestions from AddFoodSheet to the dashboard, with pattern-based logic instead of simple frequency counts.

1. **Pattern-based suggestion logic** (`fetchSuggestions` in `supabase-data.ts`):
   - **Daily**: food logged in same meal on both yesterday and day before yesterday
   - **Weekly**: food logged in same meal on same day-of-week last week AND 2 weeks ago
   - **Biweekly**: food logged in same meal on same day-of-week 2 weeks ago AND 4 weeks ago
   - Fetches food_log for 5 lookback dates (d-1, d-2, d-7, d-14, d-28), computes patterns in JS
   - Daily matches shown first (strongest signal), deduplicated across patterns
   - Already-logged foods filtered out of suggestions

2. **SuggestedFoods component** (`src/components/SuggestedFoods.tsx`):
   - Visually distinct card area: light green-tinted background + subtle green border
   - Compact items: left-aligned food name + quantity, no calories, + button on right
   - Truncated to max 3 items; "N more" link with chevron expands to show all
   - "Hide" text link next to "Suggested" label to dismiss per meal (session-scoped)
   - Positioned at bottom of each meal section (after logged food cards)

3. **Dashboard changes** (`src/app/page.tsx`):
   - All 4 meal sections only shown when they have content (logged food or suggestions)
   - Empty meals hidden entirely (no "No items yet" placeholder)
   - Suggestions shown for today and yesterday only (not older dates)
   - Tap + on suggestion → inserts to DB immediately, shows toast, suggestion disappears
   - Pull-to-refresh and date change both refresh suggestions

4. **AddFoodSheet cleaned up**:
   - Removed frequent foods section entirely (grid, toggle logic, FrequentFood type)
   - Removed `frequentFoods` prop, `getMealType`, `toper100g`, `selectedFrequentNames`
   - Sheet is now text/voice input only with logged foods tray

5. **Dummy test data** currently hardcoded in page.tsx for visual testing:
   - Breakfast: Omelette, Toast, Black Coffee (3 items — no truncation)
   - Lunch: Dal Tadka, Jeera Rice, Paneer Butter Masala, Roti, Raita (5 items — tests truncation + expand)
   - **TODO: Remove dummy data before final ship**

### Swipe-to-delete fix
- **Problem**: vertical scrolling accidentally triggered horizontal swipe to reveal delete button
- **Fix**: direction locking in `FoodCard.tsx` — first 12px of drag movement decides direction. Horizontal only wins if X movement > 1.5× Y movement. Vertical-locked gestures suppress swipe entirely.

### Auth loading fix
- **Problem**: dashboard stuck on loading spinner if Supabase unreachable
- **Fix**: 5-second timeout + catch handler in `AuthProvider.tsx` — stops loading and redirects to auth page instead of spinning forever

### Files changed
- `src/components/SuggestedFoods.tsx` — new component
- `src/lib/supabase-data.ts` — replaced `fetchFrequentFoods` with `fetchSuggestions` + `SuggestedFood` type
- `src/app/page.tsx` — suggested widget integration, dummy test data, meal section rendering
- `src/components/AddFoodSheet.tsx` — removed frequent foods section
- `src/components/FoodCard.tsx` — direction locking for swipe
- `src/components/AuthProvider.tsx` — loading timeout

### Next steps
- Remove dummy suggestion data from page.tsx
- Remaining v1 items: undo toast after delete, warning for erroneous quantities
- See `enhancements.md` for full list
