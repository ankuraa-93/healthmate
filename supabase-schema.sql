-- HealthMate Database Schema
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Food Library (shared, grows over time)
create table food_library (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  calories_per_100g numeric not null,
  protein_per_100g numeric not null,
  carbs_per_100g numeric not null,
  fat_per_100g numeric not null,
  fibre_per_100g numeric not null,
  serving_size_g numeric not null default 100,
  source text not null,
  unit text not null default 'g',
  image_url text,
  image_search_failed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Food Log (per-user daily entries)
create table food_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  food_library_id uuid references food_library,
  food_name text not null,
  quantity_g numeric not null,
  calories numeric,
  protein numeric,
  carbs numeric,
  fat numeric,
  fibre numeric,
  meal_type text not null default 'snack',
  logged_date date not null default current_date,
  status text not null default 'confirmed',
  unit text not null default 'g',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_food_log_user_date on food_log (user_id, logged_date);
create index idx_food_log_user_food on food_log (user_id, food_name);

-- 3. Profiles (user settings and goals)
create table profiles (
  id uuid primary key references auth.users,
  display_name text,
  daily_calorie_goal numeric default 2000,
  daily_protein_goal numeric default 120,
  daily_carbs_goal numeric default 250,
  daily_fat_goal numeric default 65,
  daily_fibre_goal numeric default 30,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Row Level Security

-- food_library: readable by everyone, writable by service role only
alter table food_library enable row level security;
create policy "Food library is readable by all authenticated users"
  on food_library for select
  to authenticated
  using (true);

-- food_log: users can only access their own rows
alter table food_log enable row level security;
create policy "Users can read their own food logs"
  on food_log for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own food logs"
  on food_log for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own food logs"
  on food_log for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own food logs"
  on food_log for delete
  to authenticated
  using (auth.uid() = user_id);

-- profiles: users can only access their own profile
alter table profiles enable row level security;
create policy "Users can read their own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- 5. Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
