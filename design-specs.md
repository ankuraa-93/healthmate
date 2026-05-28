# Calorie Tracker — Design Specifications

## 1. Design Principles

- **Glanceable**: Key information (today's calories, macros) visible without scrolling
- **Frictionless logging**: One tap to open, type/speak, submit — under 5 seconds
- **Trustworthy data**: Clear feedback when data is confirmed vs. pending lookup
- **Progressive disclosure**: Simple surface, detail on demand

---

## 2. Design System

### 2.1 Color Palette

| Token              | Value     | Usage                                    |
|---------------------|-----------|------------------------------------------|
| `bg-primary`        | `#FFFFFF` | Main background                          |
| `bg-secondary`      | `#F2F2F7` | Card backgrounds, grouped sections       |
| `bg-tertiary`       | `#E5E5EA` | Dividers, input backgrounds              |
| `text-primary`      | `#1C1C1E` | Headings, primary text                   |
| `text-secondary`    | `#8E8E93` | Labels, timestamps, helper text          |
| `text-tertiary`     | `#AEAEB2` | Placeholder text                         |
| `accent`            | `#34C759` | Primary actions, progress, calories on track |
| `accent-secondary`  | `#007AFF` | Links, secondary actions                 |
| `warning`           | `#FF9500` | Approaching calorie limit                |
| `destructive`       | `#FF3B30` | Over limit, delete actions               |
| `protein`           | `#5E5CE6` | Protein macro indicator                  |
| `carbs`             | `#FF9F0A` | Carbs macro indicator                    |
| `fat`               | `#FF375F` | Fat macro indicator                      |

### 2.2 Typography

Font family: **Inter** (free, closest web equivalent to SF Pro)

| Style         | Size  | Weight | Line Height | Usage                     |
|---------------|-------|--------|-------------|---------------------------|
| `display`     | 34px  | 700    | 40px        | Main calorie number       |
| `title-1`     | 28px  | 700    | 34px        | Screen titles             |
| `title-2`     | 22px  | 600    | 28px        | Section headings          |
| `title-3`     | 20px  | 600    | 24px        | Card headings             |
| `body`        | 17px  | 400    | 22px        | Default body text         |
| `body-bold`   | 17px  | 600    | 22px        | Emphasized body text      |
| `callout`     | 16px  | 400    | 20px        | Supporting text           |
| `subhead`     | 15px  | 400    | 20px        | Table headers, labels     |
| `footnote`    | 13px  | 400    | 18px        | Timestamps, fine print    |
| `caption`     | 12px  | 500    | 16px        | Badges, status indicators |

### 2.3 Spacing Scale (8px grid)

| Token  | Value | Usage                          |
|--------|-------|--------------------------------|
| `xs`   | 4px   | Tight gaps (icon + label)      |
| `sm`   | 8px   | Within components              |
| `md`   | 16px  | Between components             |
| `lg`   | 24px  | Between sections               |
| `xl`   | 32px  | Major section separation       |
| `2xl`  | 48px  | Screen-level padding top       |

### 2.4 Border Radius

| Token     | Value | Usage                     |
|-----------|-------|---------------------------|
| `sm`      | 8px   | Buttons, inputs           |
| `md`      | 12px  | Cards                     |
| `lg`      | 16px  | Modals, sheets            |
| `full`    | 999px | Avatars, circular buttons |

### 2.5 Shadows

| Token     | Value                              | Usage           |
|-----------|------------------------------------|-----------------|
| `card`    | `0 1px 3px rgba(0,0,0,0.08)`      | Subtle card lift|
| `modal`   | `0 8px 32px rgba(0,0,0,0.12)`     | Modals, sheets  |
| `button`  | `0 2px 8px rgba(52,199,89,0.3)`   | FAB button glow |

---

## 3. Component Library

### 3.1 Calorie Ring
- Circular progress indicator (SVG-based)
- 160px diameter on dashboard
- Stroke width: 12px
- Background track: `bg-tertiary`
- Fill color: `accent` (green) → `warning` (orange at 80%) → `destructive` (red at 100%+)
- Center content: remaining calories in `display` type, "remaining" label in `footnote`

### 3.2 Macro Bar
- Horizontal progress bar for each macro (protein, carbs, fat)
- Height: 8px, border-radius: `full`
- Background: `bg-tertiary`
- Fill: respective macro color
- Label above: macro name (`subhead`) + current/goal grams (`body-bold`)

### 3.3 Food Log Card
- Background: `bg-secondary`, border-radius: `md`
- Padding: `md` (16px)
- Layout:
  ```
  [Food emoji]  Food Name                    Calories
                Serving size               P: xx  C: xx  F: xx
  ```
- Food name: `body-bold`
- Serving/macros: `footnote`, `text-secondary`
- Calories: `body-bold`, right-aligned
- Status badge (if pending): yellow dot + "Pending" in `caption`
- Swipe left to reveal delete (destructive red)

### 3.4 Floating Action Button (FAB)
- Position: bottom-right, 24px from edges
- Size: 56px diameter
- Background: `accent` (green)
- Icon: plus, 24px, white
- Shadow: `button`
- On press: opens Add Food sheet

### 3.5 Add Food Sheet (Bottom Sheet)
- Slides up from bottom, border-radius: `lg` on top corners
- Drag handle: 36px wide, 4px tall, `bg-tertiary`, centered, 8px from top
- Overlay: black at 30% opacity behind sheet

### 3.6 Date Picker Chip
- Pill-shaped button: border-radius `full`
- Background: `bg-secondary`
- Padding: 8px horizontal, 4px vertical
- Icon: calendar, 16px, `text-secondary`
- Text: "Today" or formatted date, `callout`
- On tap: native date picker or custom calendar dropdown

### 3.7 Voice Input Button
- Circular, 44px diameter
- Default state: `bg-secondary` background, mic icon in `text-secondary`
- Recording state: `destructive` background pulsing, white mic icon, animated sound wave ring
- Transition: scale up to 1.1x when recording

### 3.8 Text Input Field
- Background: `bg-secondary`
- Border-radius: `sm`
- Padding: 12px horizontal, 14px vertical
- Placeholder: "What did you eat?", `text-tertiary`
- Font: `body`
- No visible border. On focus: 2px ring in `accent` at 30% opacity

### 3.9 Submit Button
- Full width within the sheet
- Height: 50px
- Background: `accent`
- Text: "Log Food", `body-bold`, white
- Border-radius: `sm`
- Disabled state: 40% opacity

### 3.10 Navigation Bar (Bottom)
- Height: 83px (49px bar + 34px safe area)
- Background: `bg-primary` with top border 0.5px `bg-tertiary`
- 3 tabs:
  - **Today** (house icon) — dashboard
  - **History** (calendar icon) — past logs
  - **Settings** (gear icon) — profile, goals
- Active: `accent` color icon + label
- Inactive: `text-secondary` icon + label
- Label: `caption`

---

## 4. Screen Specifications

### 4.1 Auth Screen (Login / Signup)

```
┌──────────────────────────────────┐
│                                  │
│         48px top padding         │
│                                  │
│        🍎 (App Icon 64px)        │
│                                  │
│        HalthMate               │
│     "Track what you eat"         │
│        (text-secondary)          │
│                                  │
│  ┌──────────────────────────┐    │
│  │  Email                   │    │  ← Input field
│  └──────────────────────────┘    │
│        8px gap                   │
│  ┌──────────────────────────┐    │
│  │  Password                │    │  ← Input field
│  └──────────────────────────┘    │
│        16px gap                  │
│  ┌──────────────────────────┐    │
│  │       Sign In            │    │  ← Primary button (accent)
│  └──────────────────────────┘    │
│                                  │
│   Don't have an account? Sign Up │  ← Toggle link
│                                  │
└──────────────────────────────────┘
```

- Centered layout, max-width 360px
- App name: `title-1`
- Tagline: `callout`, `text-secondary`
- Toggle between Login/Signup (Signup adds "Confirm Password" field)
- Error messages appear below fields in `footnote`, `destructive`

### 4.2 Dashboard (Today)

```
┌──────────────────────────────────┐
│ Today              Mon, May 25 ▸ │  ← title-1 + date chip
│                                  │
│         ┌─────────┐              │
│        ╱           ╲             │  ← Calorie ring (160px)
│       │    1,247    │            │     center: remaining cals
│       │  remaining  │            │
│        ╲           ╱             │
│         └─────────┘              │
│    Eaten: 753    Goal: 2,000     │  ← subhead, text-secondary
│                                  │
│  ┌────────┬────────┬────────┐    │
│  │Protein │ Carbs  │  Fat   │    │  ← Macro bars (3 columns)
│  │▓▓▓░░░░ │▓▓▓▓░░░│▓▓░░░░░ │    │
│  │45/120g │82/250g │18/65g  │    │
│  └────────┴────────┴────────┘    │
│                                  │
│  Meals                      Edit │  ← section heading
│  ┌──────────────────────────┐    │
│  │ 🍳 Scrambled eggs    320 │    │  ← Food log card
│  │    2 large eggs  P:24 C:2 F:22│
│  ├──────────────────────────┤    │
│  │ 🍞 Toast w/ butter  185 │    │
│  │    1 slice       P:4 C:24 F:8│
│  ├──────────────────────────┤    │
│  │ 🍌 Banana           105 │    │
│  │    1 medium     P:1 C:27 F:0 │
│  ├──────────────────────────┤    │
│  │ 🍝 Chicken pasta    143 │    │
│  │    ● Pending...          │    │  ← Yellow "pending" badge
│  └──────────────────────────┘    │
│                                  │
│                          [+]     │  ← FAB (bottom-right)
│                                  │
│  [Today]    [History]   [⚙]     │  ← Bottom nav
└──────────────────────────────────┘
```

**Layout specs:**
- Screen padding: 16px horizontal
- Title row: `title-1` left-aligned, date chip right-aligned
- Calorie ring: centered, 24px below title
- Eaten/Goal row: centered, 12px below ring
- Macro bars section: 24px below eaten/goal, 3 equal columns with 12px gap
- "Meals" heading: 24px below macros, `title-3`
- Food log cards: vertically stacked, 8px gap between cards
- FAB: fixed position, 24px from bottom and right edge (above nav bar)

**Interactions:**
- Tap date chip → navigate to that day
- Tap a food log card → expand to show full detail
- Long press / swipe left on card → delete option
- Tap "Edit" → enter edit mode (reorder, delete entries)

### 4.3 Add Food Sheet

Triggered by tapping the FAB (+).

```
┌──────────────────────────────────┐
│          ──── (drag handle)      │
│                                  │
│  Log Food                        │  ← title-2
│                                  │
│  ┌──────────┐                    │
│  │📅 Today ▾│                    │  ← Date picker chip
│  └──────────┘                    │
│                                  │
│  ┌──────────────────────┬──┐     │
│  │ What did you eat?    │🎤│     │  ← Input + mic button
│  └──────────────────────┴──┘     │
│                                  │
│  Examples:                       │  ← footnote, text-secondary
│  "2 eggs and toast with butter"  │
│  "chicken salad, about 300g"     │
│  "a large cappuccino"            │
│                                  │
│  ┌──────────────────────────┐    │
│  │        Log Food          │    │  ← Submit button (accent)
│  └──────────────────────────┘    │
│                                  │
└──────────────────────────────────┘
```

**Layout specs:**
- Sheet max-height: 85vh
- Sheet padding: 24px horizontal, 16px top (below handle)
- Drag handle: centered, 36×4px, `bg-tertiary`
- Title: `title-2`, 16px below handle
- Date chip: 16px below title
- Input row: 16px below date chip
  - Text input takes remaining width
  - Mic button: 44px, 8px gap from input
- Examples: 12px below input, `footnote`, `text-secondary`
- Submit button: 24px below examples

**States:**

1. **Default**: Empty input, submit disabled
2. **Typing**: Input has text, submit enabled
3. **Recording**: Mic button pulsing red, input shows "Listening..." placeholder
4. **Transcribed**: Transcribed text in input (editable), submit enabled
5. **Submitting**: Button shows spinner, input disabled
6. **Success**: Sheet dismisses, toast notification "Food logged ✓" (1.5s)
7. **Pending**: Sheet dismisses, toast "Logged! Nutrition data loading — check back in a minute"

### 4.4 Voice Recording State

When mic is tapped:

```
┌──────────────────────────────────┐
│          ──── (drag handle)      │
│                                  │
│  Log Food                        │
│                                  │
│  ┌──────────┐                    │
│  │📅 Today ▾│                    │
│  └──────────┘                    │
│                                  │
│  ┌──────────────────────┬──┐     │
│  │ Listening...         │⏹│     │  ← Pulsing red stop button
│  └──────────────────────┴──┘     │
│                                  │
│      ∿∿∿ ∿∿∿∿ ∿∿ ∿∿∿∿∿          │  ← Animated waveform
│                                  │
│  Tap stop when done              │  ← footnote, text-secondary
│                                  │
│  ┌──────────────────────────┐    │
│  │        Log Food          │    │  ← Disabled during recording
│  └──────────────────────────┘    │
│                                  │
└──────────────────────────────────┘
```

After recording stops, transcribed text populates the input field. User can edit before submitting.

### 4.5 History Screen

```
┌──────────────────────────────────┐
│ History                          │  ← title-1
│                                  │
│  ◀  May 2025  ▶                  │  ← Month navigator
│  Mo Tu We Th Fr Sa Su            │
│  ·  ·  ·  1  2  3  4            │  ← Calendar grid
│  5  6  7  8  9  10 11           │     Dots under days with logs
│  12 13 14 15 16 17 18           │     Today highlighted (accent)
│  19 20 21 22 23 24 [25]         │     Selected day has ring
│  26 27 28 29 30 31 ·            │
│                                  │
│  Sunday, May 25                  │  ← title-3
│  1,847 / 2,000 cal               │  ← body, text-secondary
│                                  │
│  ┌──────────────────────────┐    │
│  │ 🍳 Scrambled eggs    320 │    │  ← Same food log cards
│  ├──────────────────────────┤    │     as dashboard
│  │ 🍞 Toast w/ butter  185 │    │
│  ├──────────────────────────┤    │
│  │ 🍌 Banana           105 │    │
│  └──────────────────────────┘    │
│                                  │
│                          [+]     │  ← FAB
│                                  │
│  [Today]    [History]   [⚙]     │  ← Bottom nav
└──────────────────────────────────┘
```

**Layout specs:**
- Month navigator: centered, `body-bold`, arrows are tappable 44px hit targets
- Calendar grid: 7 columns, each cell 44×40px, centered text
- Today: `accent` text color
- Selected day: circle background in `accent` at 15% opacity
- Days with log entries: small dot (4px) below the number in `accent`
- Day detail section: 16px below calendar
- Food cards: same component as dashboard

### 4.6 Settings Screen

```
┌──────────────────────────────────┐
│ Settings                         │  ← title-1
│                                  │
│  Profile                         │  ← section heading (subhead)
│  ┌──────────────────────────┐    │
│  │  Display Name        ▸   │    │
│  ├──────────────────────────┤    │
│  │  Email              ▸   │    │
│  └──────────────────────────┘    │
│                                  │
│  Goals                           │
│  ┌──────────────────────────┐    │
│  │  Daily Calories    2,000 │    │  ← Tappable, editable
│  ├──────────────────────────┤    │
│  │  Protein           120g  │    │
│  ├──────────────────────────┤    │
│  │  Carbs             250g  │    │
│  ├──────────────────────────┤    │
│  │  Fat                65g  │    │
│  └──────────────────────────┘    │
│                                  │
│  Account                         │
│  ┌──────────────────────────┐    │
│  │  Sign Out                │    │  ← destructive text color
│  └──────────────────────────┘    │
│                                  │
│  [Today]    [History]   [⚙]     │
└──────────────────────────────────┘
```

- Grouped table style (Apple Settings pattern)
- Each row: 52px height, 16px horizontal padding
- Row background: `bg-secondary`
- Group border-radius: `md`
- 24px gap between groups

---

## 5. User Flows

### 5.1 First-Time User
```
Open App → Auth Screen → Sign Up → Dashboard (empty state)
                                    ↓
                              "No meals logged yet.
                               Tap + to get started."
                               (centered, text-secondary)
```

### 5.2 Log Food (Text)
```
Dashboard → Tap [+] → Sheet slides up → Type food
→ Tap "Log Food" → Sheet dismisses → Toast "Food logged ✓"
→ Entry appears in today's meal list
```

### 5.3 Log Food (Voice)
```
Dashboard → Tap [+] → Tap 🎤 → Speak → Tap ⏹
→ Transcribed text appears in input → Edit if needed
→ Tap "Log Food" → Same as text flow
```

### 5.4 Log Food (Pending Lookup)
```
User submits food → LLM can't find in library
→ Sheet dismisses → Toast "Logged! Nutrition data loading..."
→ Entry appears with yellow "Pending" badge
→ [Background: API lookup → updates food_library → updates entry]
→ Entry updates to confirmed (badge disappears, macros fill in)
```

### 5.5 Log Food for Past Date
```
Tap [+] → Tap date chip "Today ▾" → Date picker opens
→ Select past date → Type/speak food → Submit
→ Entry logged under selected date
→ Dashboard shows today (unchanged), History shows the entry on selected date
```

### 5.6 Delete Food Entry
```
Swipe left on food card → Red "Delete" button revealed
→ Tap Delete → Entry removed → Calorie ring + macros update
```

---

## 6. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| < 428px    | Default mobile layout (full width) |
| 428–768px  | Centered content, max-width 428px |
| > 768px    | Centered card layout, max-width 428px, bg-secondary background fills the rest (app stays phone-sized on desktop) |

The app is designed mobile-first. On larger screens, it presents as a centered phone-width card — no complex desktop layout needed for v1.

---

## 7. Animations & Transitions

| Element              | Animation                                    | Duration |
|----------------------|----------------------------------------------|----------|
| Bottom sheet         | Slide up with spring easing                  | 300ms    |
| Sheet dismiss        | Slide down                                   | 200ms    |
| Toast notification   | Fade in + slide up from bottom               | 200ms in, 1.5s visible, 200ms out |
| Calorie ring fill    | Animate on page load, ease-out               | 600ms    |
| Macro bars fill      | Animate on page load, staggered 100ms        | 400ms each |
| Voice pulse          | Scale 1.0→1.1→1.0, loop                     | 1000ms   |
| Food card enter      | Fade in + slide up                           | 200ms    |
| FAB press            | Scale down to 0.9                            | 100ms    |
| Page transitions     | Fade, no slide (tab bar stays fixed)         | 150ms    |

---

## 8. Iconography

Use **Lucide Icons** (free, consistent, works well with minimal design):
- Home: `house`
- History: `calendar-days`
- Settings: `settings`
- Add: `plus`
- Microphone: `mic`
- Stop recording: `square` (filled)
- Calendar chip: `calendar`
- Chevron: `chevron-right`
- Delete: `trash-2`
- Close: `x`
- Back: `chevron-left`

Icon size: 24px for navigation, 20px for inline, 16px for compact.

---

## 9. Status & Feedback Patterns

| State               | Visual Treatment                              |
|----------------------|----------------------------------------------|
| Food confirmed       | Normal card, no badge                        |
| Food pending lookup  | Yellow dot + "Pending" caption badge         |
| Food lookup failed   | Orange dot + "Estimated" caption badge       |
| Empty day            | Centered illustration + "No meals logged yet" |
| Loading              | Skeleton shimmer on cards                    |
| Network error        | Red banner at top: "Connection lost"         |
| Over calorie goal    | Ring turns red, "Over by X" in destructive   |
