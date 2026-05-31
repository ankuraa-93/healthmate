-- Add image_url and image_search_failed_at columns to food_library
-- Run in Supabase Dashboard → SQL Editor

ALTER TABLE food_library ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE food_library ADD COLUMN IF NOT EXISTS image_search_failed_at timestamptz;
