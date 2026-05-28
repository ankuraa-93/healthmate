# HealthMate — Calorie Tracking App

## Project Overview
A calorie tracking web app where users log food via natural language text or voice. An LLM (Claude API) parses the input into structured nutrition data. The app learns over time by growing its food library from external lookups.

## Tech Stack
- **Frontend**: Next.js (React) + TypeScript + Tailwind CSS
- **Backend/DB/Auth**: Supabase (Postgres + Auth + Edge Functions)
- **LLM**: Gemini Flash — parses natural language food entries into structured data (~0.4s latency)
- **Voice**: Web Speech API (browser-native)
- **Nutrition fallback**: USDA FoodData Central API (free) — when food not in library
- **Icons**: Lucide Icons
- **Font**: Inter (Google Fonts)
- **Deployment**: GitHub + Vercel (frontend) + Supabase (backend)

## Core Features
1. **Natural language food logging** — user types "2 eggs and toast" and the LLM extracts food items, quantities, calories, and macros (protein, carbs, fat, fibre)
2. **Growing food library** — base library of ~50 common foods. When LLM can't find a food, it searches USDA API and appends results to the library for future use
3. **Voice input** — user can speak into the app, transcription populates a text field they can edit before submitting
4. **Processing state** — if food not in library, entry shows "Processing" badge while background lookup runs. User sees confirmed data once lookup completes
5. **Frequently logged** — shows user's most-logged foods for quick re-entry
6. **History** — calendar view with per-day food logs
7. **Daily goals** — calorie and macro targets (protein, carbs, fat, fibre)

## Database Schema (Supabase/Postgres)

```sql
-- food_library: grows over time as users log new foods
food_library (
  id uuid PK DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  calories_per_100g numeric NOT NULL,
  protein_per_100g numeric NOT NULL,
  carbs_per_100g numeric NOT NULL,
  fat_per_100g numeric NOT NULL,
  fibre_per_100g numeric NOT NULL,
  serving_size_g numeric NOT NULL DEFAULT 100,
  source text NOT NULL,     -- "base", "usda_api", "llm_estimate"
  unit text NOT NULL DEFAULT 'g',  -- "g" (solids) | "ml" (liquids)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- food_log: per-user daily entries
food_log (
  id uuid PK DEFAULT gen_random_uuid(),
  user_id uuid FK → auth.users NOT NULL,
  food_library_id uuid FK → food_library (nullable),
  food_name text NOT NULL,
  quantity_g numeric NOT NULL,
  calories numeric,
  protein numeric,
  carbs numeric,
  fat numeric,
  fibre numeric,
  meal_type text NOT NULL DEFAULT 'snack',  -- "breakfast" | "lunch" | "dinner" | "snack"
  logged_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'confirmed', -- "confirmed" | "processing"
  unit text NOT NULL DEFAULT 'g',           -- "g" | "ml" — copied from food_library at log time
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
-- INDEX: (user_id, logged_date) for daily dashboard queries
-- INDEX: (user_id, food_name) for frequently-logged lookups

-- profiles: user settings
profiles (
  id uuid PK FK → auth.users,
  display_name text,
  daily_calorie_goal numeric DEFAULT 2000,
  daily_protein_goal numeric DEFAULT 120,
  daily_carbs_goal numeric DEFAULT 250,
  daily_fat_goal numeric DEFAULT 65,
  daily_fibre_goal numeric DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

Enable Row Level Security (RLS) on food_log and profiles from day 1.

## Design Decisions (Finalized)

### Dashboard
- Single "Today, May 25" pill centered in header
- Calorie ring shows **consumed** number (e.g., 753) with "of 2,000 cal" below
- "X remaining" as secondary text under the ring
- 4 macro bars: Protein, Carbs, Fat, Fibre — compact layout (80% bar width, 5px height, 12px text)
- Food cards use **photo thumbnails** (rounded rect, 44x44px) not emoji
- Processing entries show orange dot + "Processing" text, dash for calories
- No Edit button in header

### Add Food (Bottom Sheet)
- Input bar **fixed at bottom** (Gemini-style): rounded container with 2-row textarea on top, mic + send buttons in row below
- Placeholder text: "I just had omelette with toast" (teaches natural language format by example)
- **Frequently logged** section above input — shows user's most-logged foods with thumbnails, calorie info, frequency count, and quick-add (+) button
- Tapping a frequent item fills the input field
- Date picker chip in the header row next to "Log Food" title
- Voice recording: waveform animation in body area, input shows "Listening...", suggestions hide during recording
- After recording stops, transcribed text populates input for editing before submit

### Auth
- Simple email + password (Supabase Auth)
- Toggle between Sign In / Sign Up

### Confirm Food (after parsing)
- Shown after user submits natural language text — Gemini Flash parses into structured items (~0.4s)
- Confirmation step: user reviews parsed items before they're logged
- Cards match dashboard style: thumbnail, food name, quantity + compact macros (P:X C:X F:X Fi:X), bold calories right-aligned
- Meal type as section headers with separator line (e.g. "BREAKFAST"), not per-item dropdowns — drag-and-drop reordering planned for later
- Cards collapsed by default with chevron — tap to expand for quantity editing
- Expanded area matches EditFoodSheet layout: wide input bar (right-aligned value + "g"), 44px trash button beside it, ±50g/±10g pill row below
- Original natural language query shown as plain subdued text below header
- Summary bar with total calories at bottom
- "Log N Items" confirm button
- LLM: **Gemini Flash** for natural language → structured food parsing (fast, cheap, sufficient for extraction tasks)

### History
- Calendar with green dots on days with logs
- Tap a day to see its food entries below
- Month navigation arrows

### Settings
- Apple-style grouped rows
- Profile section: display name, email
- Goals section: calories, protein, carbs, fat, fibre
- Sign Out (destructive)

### General
- App max-width: 428px, centered on desktop
- Bottom nav: Today, History, Settings (3 tabs)
- FAB (green +) bottom-right on Today and History screens
- Toast notifications for actions ("Food logged ✓")
- **Animations**: Use Framer Motion throughout — subtle, native-feeling transitions (page transitions, card list stagger, ring fill, sheet spring physics, FAB press, toast slide-in). No flashy effects.
- **Quantities**: Always display in grams (g) for solid foods and millilitres (ml) for drinks/liquids. The LLM parser should translate natural language ("2 eggs", "a cup of coffee") into specific g/ml. This is the canonical unit system for logging, display, and editing.
- Color palette: Apple Health-inspired — white bg, #34C759 accent green, #F2F2F7 secondary bg

## Progress Tracking
Keep `progress.md` up to date as work happens — log design changes, decisions, completed steps, and anything relevant without waiting for a prompt. Use your judgement on what's worth recording.

## Build Order
1. Design + UX (in progress — user has more changes)
2. Finalize DB architecture
3. Build the app shell (Next.js + Supabase auth + UI screens + basic food logging)
4. Build base food library (seed DB)
5. Integrate Claude API (natural language parsing, food matching)
6. Add voice input (Web Speech API)
7. Add external nutrition lookup (USDA fallback)
8. Deploy (GitHub → Vercel + Supabase)

## Design Files
- `design-specs.md` — full design system (colors, typography, spacing, components, screen specs, animations)
- `prototype.html` — all-in-one interactive prototype (requires sign-in flow)
- `screens/01-auth.html` — auth screen
- `screens/02-dashboard-v2.html` — dashboard (latest, with all feedback applied)
- `screens/03-add-food-v2.html` — add food sheet (latest, with all feedback applied)
- `screens/06-confirm-food.html` — confirm parsed items screen (between add food and logging)
- `screens/04-history.html` — history screen
- `screens/05-settings.html` — settings screen

Older versions (superseded):
- `screens/02-dashboard.html` — v1 dashboard
- `screens/03-add-food.html` — v1 add food sheet
