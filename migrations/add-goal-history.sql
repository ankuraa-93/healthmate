-- Goal history: a per-week snapshot of a user's daily goals and maintenance
-- calories, so changing activity / goals applies from the current week onward
-- instead of rewriting past weeks.
--
-- One row per (user, week). week_start is the Monday (user's local date) the
-- values take effect. A week uses the latest row with week_start <= its Monday.
-- Saving goals again in the same week overwrites that week's row.

create table if not exists goal_history (
  user_id uuid not null references auth.users on delete cascade,
  week_start date not null,
  daily_calorie_goal numeric not null,
  daily_protein_goal numeric not null,
  daily_carbs_goal numeric not null,
  daily_fat_goal numeric not null,
  daily_fibre_goal numeric not null,
  maintenance_calories numeric,           -- TDEE; null when biometrics aren't filled in
  activity_factor numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id, week_start)
);

alter table goal_history enable row level security;

drop policy if exists "goal_history own rows select" on goal_history;
create policy "goal_history own rows select" on goal_history
  for select using (auth.uid() = user_id);

drop policy if exists "goal_history own rows insert" on goal_history;
create policy "goal_history own rows insert" on goal_history
  for insert with check (auth.uid() = user_id);

drop policy if exists "goal_history own rows update" on goal_history;
create policy "goal_history own rows update" on goal_history
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Backfill: one row per existing user with their current goals, effective from
-- the Monday of the week they signed up, so past weeks keep today's values
-- (the best we know) rather than going blank. Maintenance is recomputed
-- Mifflin–St Jeor × South Asian factor (0.93) × activity factor, matching
-- src/lib/goals.ts, and left null when biometrics are missing.
insert into goal_history (
  user_id, week_start,
  daily_calorie_goal, daily_protein_goal, daily_carbs_goal, daily_fat_goal, daily_fibre_goal,
  maintenance_calories, activity_factor
)
select
  p.id,
  date_trunc('week', p.created_at)::date,   -- ISO week → Monday
  p.daily_calorie_goal, p.daily_protein_goal, p.daily_carbs_goal, p.daily_fat_goal, p.daily_fibre_goal,
  case
    when p.sex in ('male', 'female') and p.birth_date is not null
         and p.height_cm is not null and p.weight_kg is not null and p.activity_factor is not null
    then (
      10 * p.weight_kg + 6.25 * p.height_cm
      - 5 * date_part('year', age(current_date, p.birth_date))
      + case when p.sex = 'male' then 5 else -161 end
    ) * 0.93 * p.activity_factor
  end,
  p.activity_factor
from profiles p
on conflict (user_id, week_start) do nothing;
