-- Share-link viewer: return the goals in effect for the viewed week (from
-- goal_history) instead of the profile's current goals, so a past day isn't
-- measured against a goal set later. Same signature → CREATE OR REPLACE keeps
-- existing grants. Kept in sync with supabase-share-links.sql.

CREATE OR REPLACE FUNCTION get_shared_log(share_token text, target_date date DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  link_user_id uuid;
  the_date date;
  view_week_start date;
  result jsonb;
BEGIN
  SELECT user_id INTO link_user_id
  FROM share_links
  WHERE token = share_token;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  the_date := COALESCE(target_date, CURRENT_DATE);
  view_week_start := the_date - ((EXTRACT(ISODOW FROM the_date)::int - 1));

  SELECT jsonb_build_object(
    'display_name', p.display_name,
    'email', u.email,
    'logged_date', the_date,
    'daily_calorie_goal', COALESCE(gh.daily_calorie_goal, p.daily_calorie_goal),
    'daily_protein_goal', COALESCE(gh.daily_protein_goal, p.daily_protein_goal),
    'daily_carbs_goal', COALESCE(gh.daily_carbs_goal, p.daily_carbs_goal),
    'daily_fat_goal', COALESCE(gh.daily_fat_goal, p.daily_fat_goal),
    'daily_fibre_goal', COALESCE(gh.daily_fibre_goal, p.daily_fibre_goal),
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
          'unit', f.unit,
          'input_source', f.input_source,
          'image_url', fl.image_url
        ) ORDER BY f.created_at
      )
      FROM food_log f
      LEFT JOIN food_library fl ON fl.id = f.food_library_id
      WHERE f.user_id = link_user_id
        AND f.logged_date = the_date
        AND f.status = 'confirmed'
    ), '[]'::jsonb),
    'source_images', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'url', s.url,
          'mealType', s.meal_type,
          'foodIds', s.food_ids
        ) ORDER BY s.first_created
      )
      FROM (
        SELECT
          source_image_url AS url,
          (array_agg(meal_type ORDER BY created_at))[1] AS meal_type,
          jsonb_agg(id ORDER BY created_at) AS food_ids,
          MIN(created_at) AS first_created
        FROM food_log
        WHERE user_id = link_user_id
          AND logged_date = the_date
          AND status = 'confirmed'
          AND input_source = 'image'
          AND source_image_url IS NOT NULL
        GROUP BY source_image_url
      ) s
    ), '[]'::jsonb),
    'weekly_calories', COALESCE((
      SELECT jsonb_object_agg(wf.d::text, wf.total_cal)
      FROM (
        SELECT logged_date AS d, SUM(calories) AS total_cal
        FROM food_log
        WHERE user_id = link_user_id
          AND status = 'confirmed'
          AND logged_date >= view_week_start
          AND logged_date < view_week_start + 7
        GROUP BY logged_date
      ) wf
    ), '{}'::jsonb)
  ) INTO result
  FROM profiles p
  JOIN auth.users u ON u.id = p.id
  -- Goals in effect for the viewed week (latest snapshot on/before its Monday),
  -- so past days keep the goals they had then. Falls back to the profile.
  LEFT JOIN LATERAL (
    SELECT g.daily_calorie_goal, g.daily_protein_goal, g.daily_carbs_goal,
           g.daily_fat_goal, g.daily_fibre_goal
    FROM goal_history g
    WHERE g.user_id = link_user_id
      AND g.week_start <= view_week_start
    ORDER BY g.week_start DESC
    LIMIT 1
  ) gh ON true
  WHERE p.id = link_user_id;

  RETURN result;
END;
$$;
