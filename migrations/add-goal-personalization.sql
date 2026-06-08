-- Goal personalization: biometrics, activity estimate, and weight-goal inputs.
-- The existing daily_*_goal columns stay as the COMPUTED OUTPUT the dashboard
-- reads; these new columns are the raw INPUTS used to compute them, so a user
-- can re-personalize later without re-entering everything.
--
-- activity_workouts is captured now but unused — it's the structured workout
-- history (sessions/week, minutes, intensity) that a future "dynamic daily
-- goals" feature will draw on. Storing it from day one avoids a cold start.

alter table profiles
  add column if not exists sex text,                              -- 'male' | 'female'
  add column if not exists age integer,
  add column if not exists height_cm numeric,
  add column if not exists weight_kg numeric,
  add column if not exists activity_description text,             -- raw free text, re-editable
  add column if not exists activity_factor numeric,              -- 1.2–1.9, Gemini-estimated
  add column if not exists does_resistance_training boolean,
  add column if not exists activity_workouts jsonb,              -- WorkoutEntry[] — for future dynamic goals
  add column if not exists goal_type text,                       -- 'lose' | 'maintain' | 'gain'
  add column if not exists goal_pace_kg_per_month numeric,
  add column if not exists goals_mode text not null default 'default'; -- 'default' | 'personalized' | 'manual'
