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

## Session: 2026-05-30 — Log Food sheet UX polish

### Changes
1. **Done button** — replaced green pill with checkmark → iOS-style plain text "Done" link (17px, accent color, no background)
2. **Removed "Logged foods" title** — unnecessary label above tray items
3. **Green tick after food names** — each logged food in the tray shows a small green check after its name, confirming it's been saved
4. **Save feedback** — when user edits quantity (pills or typing), the green check briefly becomes a spinning loader then returns to check (300ms minimum display). Communicates auto-save without a save button.
5. **Chevron direction** — changed from right-pointing (ChevronRight, rotates to 90°) to down-pointing (ChevronDown, rotates to 180°/up). Gives correct spatial cue about where the expanded area will appear.
6. **Stepped loading messages** — replaced static "Identifying food..." with progressive states:
   - "Identifying food..." (during Gemini parse + match)
   - "Logging X foods..." (during DB writes, shown for at least 400ms)
   - Voice flow: "Transcribing..." (during Groq Whisper)

7. **Meal calorie totals on dashboard** — each meal card header shows total calories inline after the meal name with a dot separator (e.g. "BREAKFAST · 380 cal"). Only shown when confirmed entries exist.

### Files changed
- `src/components/AddFoodSheet.tsx` — all changes above (loadingMessage state replaces boolean, savingIndices set, ChevronDown, delay helper)
- `src/app/page.tsx` — meal calorie totals in card headers

### Next steps
- Remove dummy suggestion data from page.tsx
- Remaining v1 items: undo toast after delete, warning for erroneous quantities
- See `enhancements.md` for full list

## Session: 2026-05-31 — Rename + nav fix + shareable links

### Changes
1. **Renamed app**: Calorific → Calorrific (double R, sounds like "terrific"). Updated auth page, layout metadata, Gemini system prompt.

2. **Fixed nav bar scrolling on iOS**: `overscroll-behavior: none` on html/body in globals.css, `touch-action: manipulation` + `position: sticky` on BottomNav, `overscroll-contain` on dashboard scroll container.

3. **Shareable daily log links**:
   - **Share button**: iOS-style (square+arrow) icon in dashboard header top-right. Uses `navigator.share` on mobile (native share sheet), clipboard fallback on desktop.
   - **share_links table**: token + user_id + logged_date, RLS for owner insert/read.
   - **get_shared_log RPC**: `SECURITY DEFINER` function accepts (token, optional target_date). Returns profile (name, email, goals), food entries for the date, and weekly calorie totals. Bypasses RLS for public access.
   - **`/share/[token]` page**: read-only dashboard clone — WeekStrip (with owner name/email before month label), CalorieRing, MacroGrid, FoodCards grouped by meal. No FAB, no BottomNav, no edit/delete, no suggested foods. Supports day navigation (tap/swipe), pull-to-refresh.
   - **AuthProvider updated**: `/share/*` routes excluded from auth redirect.
   - **`getOrCreateShareLink`** in supabase-data.ts: checks for existing token (user+date), creates if not found (12-char UUID slug).

### Files changed
- `src/app/auth/page.tsx` — rename
- `src/app/layout.tsx` — rename
- `src/lib/gemini.ts` — rename in system prompt
- `src/app/globals.css` — overscroll-behavior: none
- `src/components/BottomNav.tsx` — sticky + touch-action
- `src/app/page.tsx` — share button, overscroll-contain, share handler
- `src/components/AuthProvider.tsx` — /share/* public route
- `src/components/WeekStrip.tsx` — ownerLabel prop
- `src/lib/supabase-data.ts` — getOrCreateShareLink
- `src/app/share/[token]/page.tsx` — server component (token extraction)
- `src/app/share/[token]/ShareDashboard.tsx` — read-only dashboard client component
- `supabase-share-links.sql` — table + RPC function

### Follow-up fix
- **Persist dismissed suggestions**: changed `sessionStorage` → `localStorage` so hidden suggestion trays stay dismissed across tab closes and browser restarts.

## Session: 2026-06-01 — Food images (v1 feature)

### What was done
1. **`image_url` column added to `food_library`** — schema, types, migration SQL. NOT stored in `food_log` — fetched via join from `food_library` at query time.

2. **Dashboard/UI wired for images**:
   - `fetchFoodLogs` joins `food_library:food_library_id(image_url)` to get images
   - `FoodCard`, `EditFoodSheet`, `AddFoodSheet` tray — show `<img>` thumbnail when `image_url` present, letter avatar fallback on null/broken URLs
   - Share page `get_shared_log` RPC updated to LEFT JOIN food_library for `image_url`
   - React state-based fallback (not DOM manipulation) for broken image URLs
   - No grey background on image thumbnails (transparent-friendly)
   - SuggestedFoods widget does NOT use images (no thumbnails in that widget)

3. **On-the-fly Gemini image search — built then removed**:
   - Initially added `SEARCH_IMAGE_PROMPT` + separate Gemini call in match-food API
   - Issues: Gemini returned hotlink-blocked URLs (kindpng, pngimg), unreliable results, added 1-2s latency
   - Decided to move to batch background processing instead

4. **Batch image backfill system (code complete, deployment pending)**:
   - **Supabase Edge Function** (`supabase/functions/backfill-images/index.ts`):
     - Queries food_library for items with `image_url IS NULL`
     - Uses Google Custom Search API (image search) to find food photos
     - Validates URLs with HEAD request (checks 200 + content-type: image/*)
     - Batch size: 15 items per run
     - `image_search_failed_at` column prevents re-querying failed items (retries after 30 days)
     - Handles quota exhaustion gracefully (stops batch, partial results)
     - 120s global deadline to stay within Edge Function timeout
   - **pg_cron schedule** (`migrations/setup-image-cron.sql`):
     - Every 4 hours (6 runs/day × 15 items = 90 queries/day, under 100 free/day Google limit)
     - Uses pg_net `http_post` to invoke Edge Function
   - **Google Custom Search Engine** configured with curated site list (Wikipedia, Unsplash, Pexels, Amazon.in, BigBasket, Blinkit, JioMart, Flipkart, FatSecret, Nutritionix)

### Deployment steps remaining
1. Run migration: `ALTER TABLE food_library ADD COLUMN IF NOT EXISTS image_search_failed_at timestamptz;`
2. Re-run `supabase-share-links.sql` (updated RPC with image_url LEFT JOIN)
3. User: finish Google Custom Search Engine setup (add sites from `google-cse-sites.txt`, get cx)
4. Install Supabase CLI: `brew install supabase/tap/supabase`
5. Set secrets: `supabase secrets set GOOGLE_CUSTOM_SEARCH_API_KEY=... GOOGLE_CUSTOM_SEARCH_CX=...`
6. Deploy Edge Function: `supabase functions deploy backfill-images --project-ref hnxbjwwfdbbalrpthshk`
7. Enable pg_cron + pg_net extensions in Supabase Dashboard
8. Run `migrations/setup-image-cron.sql` (replace <SERVICE_ROLE_KEY>)
9. Push code to GitHub (triggers Vercel auto-deploy)

### Files created
- `supabase/functions/backfill-images/index.ts` — Edge Function
- `migrations/add-image-url.sql` — schema migration
- `migrations/setup-image-cron.sql` — pg_cron schedule
- `google-cse-sites.txt` — sites for Google Custom Search Engine

### Files changed
- `src/lib/types.ts` — added `image_url` to FoodLibraryItem (required) and FoodLogEntry (optional)
- `src/lib/supabase-data.ts` — fetchFoodLogs joins food_library for image_url
- `src/lib/gemini.ts` — removed SEARCH_IMAGE_PROMPT
- `src/app/api/match-food/route.ts` — removed on-the-fly image search, fetches image_url from library for matched items
- `src/components/FoodCard.tsx` — image thumbnail with state-based fallback
- `src/components/AddFoodSheet.tsx` — FoodThumbnail component for tray items
- `src/components/EditFoodSheet.tsx` — EditFoodThumbnail component
- `src/app/share/[token]/ShareDashboard.tsx` — image_url in SharedEntry
- `src/app/page.tsx` — passes image_url for suggestion-added entries
- `src/lib/mock-data.ts` — added image_url: null to mock entries
- `supabase-schema.sql` — added image_url + image_search_failed_at columns
- `supabase-share-links.sql` — LEFT JOIN food_library for image_url in RPC
- `tsconfig.json` — excluded supabase/ from TypeScript compilation

### Key decisions
- `image_url` lives only in `food_library`, not duplicated in `food_log` — fetched via join
- Supabase Edge Function + pg_cron over Vercel cron (150s timeout vs 10s)
- Curated site list instead of "Search entire web" (Google deprecated that feature for new CSEs)
- Google API key: `AIzaSyCJIL71TgGTgS1waCaIiiMsGy5pHHD4fk4`
- Gemini API key: `AIzaSyDnaQjd-Bsll25rlBAVQ3SoHIq3ySVDR1Q`

## Session: 2026-06-01 — Food images deployment + image search API investigation

### Infrastructure deployed
1. **SQL migrations run** — `image_url` + `image_search_failed_at` columns on food_library, updated `get_shared_log` RPC with image_url LEFT JOIN
2. **Supabase CLI installed** — `brew install supabase/tap/supabase` (v2.102.0)
3. **Supabase secrets set** — `GOOGLE_CUSTOM_SEARCH_API_KEY`, `GOOGLE_CUSTOM_SEARCH_CX`, `GEMINI_API_KEY` (via `SUPABASE_ACCESS_TOKEN` env var — `supabase login` doesn't persist in all shells)
4. **Edge Function deployed** — `backfill-images` on project `hnxbjwwfdbbalrpthshk`
5. **pg_cron + pg_net extensions enabled** — pg_cron in `pg_catalog` schema, pg_net in `extensions` schema
6. **Cron job registered** — then unscheduled (image search not working yet)

### Image search API investigation (all failed)

**Google Custom Search JSON API:**
- API enabled, key configured, CSE created (cx: `c631bdb48cb784068`) with curated site list
- 403 error: "This project does not have the access to Custom Search JSON API"
- Root cause: Google deprecated Custom Search JSON API for new customers (January 2026). Final shutdown for existing customers: January 2027. User's project was created after the cutoff.
- No workaround — permanent block for new projects

**Gemini with Google Search grounding:**
- Switched Edge Function from Google CSE to single Gemini call with `googleSearch` grounding tool
- Fixed: removed `responseMimeType: "application/json"` (incompatible with tools), added code fence stripping
- Gemini returns plausible-looking URLs (Wikipedia, cookwithmanali, Amazon) but ALL are hallucinated — return 404/400 on HEAD validation
- LLMs fundamentally can't return exact image URLs reliably, even with grounding

**Pexels (considered, not tried):**
- Good for generic dishes but no branded/packaged food coverage (Kurkure, Maggi etc.)
- User tested on pexels.com, confirmed poor results for Indian branded items

### What's still deployed but inactive
- Edge Function `backfill-images` exists on Supabase (original Google CSE version, non-functional)
- Secrets set: `GOOGLE_CUSTOM_SEARCH_API_KEY`, `GOOGLE_CUSTOM_SEARCH_CX`, `GEMINI_API_KEY`
- pg_cron + pg_net extensions enabled (no active cron jobs)
- `image_search_failed_at` timestamps reset to NULL (ready for retry with working solution)

### Next steps for food images (decided approach)
**Two-tier image search (free):**
1. **Pexels API** for dishes/generic foods (dal tadka, paneer paratha, omelette etc.) — free, good food photography
2. **JioMart / BigBasket internal APIs** for branded/packaged products (Kurkure, Maggi, Amul etc.) — their frontend search endpoints return JSON with clean CDN image URLs. Reverse-engineer by inspecting network tab on their websites.
3. Classify each food_library item as "packaged" vs "dish" to route to the right source
4. Update Edge Function with two-tier logic
5. Batch 50 items/run, schedule overnight (3-6am IST) for initial backfill

**Rejected alternatives:**
- Brave Search API — viable but untested
- SerpAPI — $50/mo, too expensive for this use case
- Gemini grounding — hallucates URLs
- Google Custom Search JSON API — deprecated for new customers

## Session: 2026-06-01 — Image-based food logging (v2 feature) + delete bug fix

### Bug fix: delete-with-undo losing data
- **Root cause**: `handleDeleteWithUndo` deferred the actual `deleteFoodLog()` call by 5 seconds via `setTimeout` to allow undo. If user closed tab or navigated away during that window, the timer never fired and the DB delete was silently lost.
- **Fix**: delete from DB immediately on swipe/tap. Undo now **re-inserts** the entry via `insertFoodLog` instead of cancelling a timer. Entry gets a new ID on re-insert but all food data is preserved.
- Removed `deleteTimer` ref entirely.

### Image-based food logging (v2 feature)
Full implementation of photo-based food logging with async processing.

#### Architecture
1. **`processing_jobs` table** — separate from `food_log` to avoid polluting food data with placeholder rows. Tracks in-flight image analysis jobs (id, user_id, meal_type, logged_date, image_url, status).
2. **`food-photos` Supabase Storage bucket** — stores resized thumbnails (800px max width). Original full-res images sent to Gemini and discarded.
3. **`input_source` column on `food_log`** — `'text'` | `'voice'` | `'image'` (default `'text'`). Camera icon shown on image-sourced food cards.
4. **`source_image_url` column on `food_log`** — links food entries back to the source photo for verification.

#### New components & routes
- **`PhotoReviewSheet`** — full-screen dark overlay for reviewing selected photos before submit. Features: swipe between photos, rotate (90° increments, baked into image before upload/Gemini call), per-photo meal type selector (4 chips), remove individual photos, add more photos (+), submit button.
- **`/api/parse-food-image`** — accepts full-res base64 image, sends to Gemini 2.5 Flash vision with food identification system prompt, returns structured items (same format as `/api/parse-food`).
- **`image-utils.ts`** — `processImage()` resizes to 800px thumbnail + keeps original base64. `applyRotation()` bakes rotation into both thumbnail blob and original base64 via canvas.

#### Flow
1. User taps camera icon in AddFoodSheet → file picker (camera capture or gallery, multi-select)
2. Full-screen PhotoReviewSheet opens — review, rotate, assign meal types per photo
3. Submit → sheet closes → for each photo:
   - Rotation applied to image data (not just CSS)
   - Resized thumbnail uploaded to Supabase Storage
   - `processing_job` row inserted → dashboard shows "Identifying foods..." card with photo thumbnail
   - Photo tray appears below week strip showing uploaded photos with meal captions
4. Async: Gemini Flash vision identifies foods → match API → insert `food_log` rows with `input_source='image'` + `source_image_url` → delete processing job → dashboard refreshes
5. Photo tray: tap photo to open detail view — shows photo + list of identified foods with edit (pencil → EditFoodSheet) and delete (trash) per item. "Delete All" removes photo and all linked foods.

#### Key decisions
- **Async over sync** — photo processing takes 3-5s (vision + match + DB). Async with processing_jobs is more reliable than blocking UI, especially for multi-photo batch uploads.
- **Separate `processing_jobs` table** over fake food_log rows — avoids polluting calorie totals, suggestions, and frequent food queries with placeholder data.
- **Supabase Storage** over client-state blob URLs — photos persist across refresh, serve as verification tool for Gemini's identification accuracy.
- **Full-res to Gemini, thumbnail to storage** — best identification accuracy without storage cost (free tier: 1GB storage, ~3000-5000 photos).
- **Rotation baked into image** — CSS rotation would only work visually; Gemini and stored thumbnails need the actual rotated pixels.

#### DB migration
- `migrations/add-image-logging.sql` — adds `processing_jobs` table + RLS, `input_source` + `source_image_url` columns on `food_log`, `food-photos` Storage bucket + policies.

#### Files created
- `src/components/PhotoReviewSheet.tsx`
- `src/lib/image-utils.ts`
- `src/app/api/parse-food-image/route.ts`
- `migrations/add-image-logging.sql`

#### Files changed
- `src/app/page.tsx` — photo tray, processing job cards, photo detail view, async processing handler, delete bug fix
- `src/components/AddFoodSheet.tsx` — camera button, file picker, PhotoReviewSheet integration, removed old photo strip
- `src/components/FoodCard.tsx` — camera icon for image-sourced entries
- `src/lib/gemini.ts` — `flashModelVision` config, `PARSE_IMAGE_SYSTEM_PROMPT`
- `src/lib/supabase-data.ts` — processing jobs CRUD, photo upload, fetchSourceImages with meal type
- `src/lib/types.ts` — `ProcessingJob` interface, `input_source` + `source_image_url` on `FoodLogEntry`
- `src/app/share/[token]/ShareDashboard.tsx` — added new required fields to type adapter
- `src/lib/mock-data.ts` — added new fields to mock entries
- `supabase-schema.sql` — added `input_source` + `source_image_url` columns

## Session: 2026-06-01 — v2 image processing polish (5 items)

### Bug fix
- **Gemini API key on Vercel** — old key was revoked by Google, production text parsing was broken (all submissions returned "Failed to parse"). Updated `GEMINI_API_KEY` env var on Vercel and redeployed.

### v2 enhancements completed (5 of 7 pending items)

#### 1. Resilient image processing
- Extracted `processOnePhoto()` as reusable function from `handlePhotosSubmitted` — used by both initial processing and retry
- Failed Gemini calls now mark jobs as `status: 'failed'` instead of silently swallowing errors
- Added `updateProcessingJob()` to supabase-data.ts
- `fetchProcessingJobs` now fetches both `'processing'` and `'failed'` jobs
- Added `processingDataRef` (useRef Map) to cache original base64 data per job for retry
- `handleRetryProcessingJob` re-runs processing from cached data; shows "re-upload" toast if cache expired (page refreshed)

#### 2. Delete processing/failed photo
- Processing/failed photos in tray are tappable — opens photo detail view (same as completed photos but with status message)
- Small X button on top-right corner of tray thumbnail triggers delete confirmation dialog
- Confirmation dialog: "Delete failed photo?" / "Cancel processing?" with Cancel, Retry (failed only), Delete buttons
- Processing photo detail view: shows photo + "Identifying foods..." or "Analysis failed" with Retry button

#### 3. Processing state UX
- **Photo tray**: replaced spinning RefreshCw with iOS-style pie loading indicator (SVG arc that fills based on simulated progress). Failed jobs show red AlertCircle icon
- **Simulated progress**: useEffect with interval, random increments (fast at start, slows down), caps at 92% until job completes
- **Meal sections**: removed per-job thumbnail cards. Replaced with aggregated text: pulsing green dot + "Identifying foods from X photos..." for processing, red dot + "X photos failed" for failures
- Photo tray thumbnails doubled in size (w-14 → w-28, 56px → 112px)
- Peeking photos: tray extends to right screen edge (`-mr-4` + `pr-4` on scroll container) so photos clip at edge, hinting at more content

#### 4. Gemini quantity overestimation
- Updated `PARSE_IMAGE_SYSTEM_PROMPT` rule 3 with calibration guidance:
  - Explicit instruction: "AI vision models overestimate by 10-20%, apply 10-15% mental reduction"
  - Reduced reference quantities: roti 35-45g (was 40-50g), rice/dal servings 150-180g (was 200g+)
  - "Use LOW end of typical weight range for single items"

#### 5. Inline food editing on photo view
- Food items in expanded photo detail view now expand inline on tap (chevron toggle)
- Expanded area: quantity input (dark-themed), ±10/±50g adjustment pills, trash button
- Uses `scaleNutritionFromEntry` for proportional nutrition recalculation
- Removed old edit button that closed photo view to open separate EditFoodSheet
- Photo stays visible while editing

### Other UI fixes
- Photo detail view: solid black background + solid `#1c1c1e` food card background (was semi-transparent, screen behind was visible)
- Added "Dev Workflow" section to CLAUDE.md: always rebuild and restart server after code changes

### Files changed
- `src/app/page.tsx` — all 5 features: processOnePhoto extraction, retry/delete/confirm handlers, pie loading indicator, tray size + peeking, inline editing, processing state UX
- `src/lib/supabase-data.ts` — `updateProcessingJob`, `fetchProcessingJobs` includes failed
- `src/lib/gemini.ts` — vision prompt calibration
- `CLAUDE.md` — dev workflow instruction
- `enhancements.md` — marked 5 items complete

## Session: 2026-06-02 — Prod auth bug fix (email-existence check)

**Symptom:** Registered email recognized as new (showed "Create Account") on prod, but worked correctly on localhost.

### Root cause
- `/api/check-email` is the only code path using `SUPABASE_SERVICE_ROLE_KEY`. The var was in `.env.local` (localhost OK) but **not set in Vercel production**, so the Supabase admin call failed.
- The route **failed open** — both the error path and the `catch` returned `{ exists: false }`, so any failure silently meant "new user" → client showed signup for an existing email.
- Secondary: the primary query hit `/rest/v1/users` (PostgREST `public.users`), not `auth.users`, so it never actually matched — the app had been silently relying on the admin-API fallback all along.

### Fixes (commit `9eb79fd`)
- Added `SUPABASE_SERVICE_ROLE_KEY` to Vercel production (`vercel env add`). Confirmed it was the only missing prod var; other 4 already present.
- Rewrote `src/app/api/check-email/route.ts`: use GoTrue admin API directly, drop the dead `public.users` query, and **fail closed** — return 500 if the key/url is missing, 502 on lookup error, with `console.error` logging instead of silent `exists:false`.
- `src/app/auth/page.tsx`: on an inconclusive check, surface a "Couldn't verify your email" retry message and stay on the email step instead of defaulting to signup.

### Lesson
Server-only env vars (no `NEXT_PUBLIC_` prefix) are not synced from `.env.local` to Vercel — they must be added per-environment in Vercel and require a redeploy. "Works locally, broken on prod" for a secret-touching feature usually means a missing Vercel env var.

### Files changed
- `src/app/api/check-email/route.ts` — reliable, fail-closed email-existence check
- `src/app/auth/page.tsx` — don't guess new-vs-existing on a failed check

## Session: 2026-06-03 — Photos on shareable link (v2)

Made uploaded meal photos visible on the public read-only share page.

### Changes
- `supabase-share-links.sql`: `get_shared_log` RPC now also returns a `source_images` array — grouped by `source_image_url` (one entry per unique uploaded photo) with `mealType` and `foodIds`, mirroring the dashboard's `fetchSourceImages`. Filters to confirmed, `input_source='image'`, non-null url. **Must be re-run in Supabase SQL Editor** (CREATE OR REPLACE FUNCTION).
- `src/app/share/[token]/ShareDashboard.tsx`: added `SharedSourceImage` type + `source_images` to `SharedData`; renders a read-only photo tray (between summary and meals) and a read-only expanded photo viewer (photo + identified foods, no edit/delete/processing-job UI). The `food-photos` bucket is already public so viewers can load images.

### Note
Action required: run the updated `supabase-share-links.sql` in the Supabase SQL Editor for the photos to appear on existing/new share links.

### Follow-up: photo viewer escaped the mobile frame
- The expanded photo viewer used `fixed inset-0`, positioning against the browser viewport — on desktop it went full-width, breaking the 428px mobile frame illusion.
- Fixed by switching to `absolute inset-0` (the pattern EditFoodSheet/AddFoodSheet already use; the `layout.tsx` frame is `relative`). Applied in `ShareDashboard.tsx` (share photo viewer) and `page.tsx` (both the photo detail viewer and the processing-job detail viewer).

### Build gotcha (noted)
Running `next build` while a `next start` still holds `.next` can leave `.next/server/app/` missing → every route 404s despite a "successful" build log. Fix: kill the server first, `rm -rf .next` if needed, then rebuild. Always kill 3002 before rebuilding.
