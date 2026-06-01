-- Migration: Image-based food logging
-- Run in Supabase Dashboard → SQL Editor

-- 1. Add input_source and source_image_url to food_log
ALTER TABLE food_log
  ADD COLUMN IF NOT EXISTS input_source text NOT NULL DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS source_image_url text;

-- 2. Processing jobs table (tracks in-flight image analysis)
CREATE TABLE IF NOT EXISTS processing_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  meal_type text NOT NULL DEFAULT 'snack',
  logged_date date NOT NULL DEFAULT CURRENT_DATE,
  image_url text NOT NULL,
  status text NOT NULL DEFAULT 'processing',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_processing_jobs_user_date
  ON processing_jobs (user_id, logged_date);

-- 3. RLS for processing_jobs
ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own processing jobs"
  ON processing_jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own processing jobs"
  ON processing_jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own processing jobs"
  ON processing_jobs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Supabase Storage bucket for food photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-photos', 'food-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated users can upload, anyone can read (public bucket)
CREATE POLICY "Authenticated users can upload food photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'food-photos');

CREATE POLICY "Anyone can view food photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'food-photos');

CREATE POLICY "Users can delete their own food photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'food-photos');
