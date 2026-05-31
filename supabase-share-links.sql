-- Run this in Supabase SQL Editor to enable the share feature
-- Safe to re-run — uses IF NOT EXISTS and CREATE OR REPLACE

-- 1. Create the share_links table (skip if already exists)
CREATE TABLE IF NOT EXISTS share_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  logged_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, logged_date)
);

ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- RLS policies (drop first to avoid duplicate errors on re-run)
DROP POLICY IF EXISTS "Users can insert own share links" ON share_links;
CREATE POLICY "Users can insert own share links"
  ON share_links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own share links" ON share_links;
CREATE POLICY "Users can read own share links"
  ON share_links FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Drop old 1-param version if it exists, then create the 2-param version
DROP FUNCTION IF EXISTS get_shared_log(text);
DROP FUNCTION IF EXISTS get_shared_log(text, date);

CREATE FUNCTION get_shared_log(share_token text, target_date date DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  link_user_id uuid;
  the_date date;
  week_start date;
  result jsonb;
BEGIN
  SELECT user_id INTO link_user_id
  FROM share_links
  WHERE token = share_token;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  the_date := COALESCE(target_date, CURRENT_DATE);
  week_start := the_date - ((EXTRACT(ISODOW FROM the_date)::int - 1));

  SELECT jsonb_build_object(
    'display_name', p.display_name,
    'email', u.email,
    'logged_date', the_date,
    'daily_calorie_goal', p.daily_calorie_goal,
    'daily_protein_goal', p.daily_protein_goal,
    'daily_carbs_goal', p.daily_carbs_goal,
    'daily_fat_goal', p.daily_fat_goal,
    'daily_fibre_goal', p.daily_fibre_goal,
    'entries', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', f.id,
          'food_name', f.food_name,
          'quantity_g', f.quantity_g,
          'calories', f.calories,
          'protein', f.protein,
          'carbs', f.carbs,
          'fat', f.fat,
          'fibre', f.fibre,
          'meal_type', f.meal_type,
          'unit', f.unit
        ) ORDER BY f.created_at
      )
      FROM food_log f
      WHERE f.user_id = link_user_id
        AND f.logged_date = the_date
        AND f.status = 'confirmed'
    ), '[]'::jsonb),
    'weekly_calories', COALESCE((
      SELECT jsonb_object_agg(wf.d::text, wf.total_cal)
      FROM (
        SELECT logged_date AS d, SUM(calories) AS total_cal
        FROM food_log
        WHERE user_id = link_user_id
          AND status = 'confirmed'
          AND logged_date >= week_start
          AND logged_date < week_start + 7
        GROUP BY logged_date
      ) wf
    ), '{}'::jsonb)
  ) INTO result
  FROM profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE p.id = link_user_id;

  RETURN result;
END;
$$;
