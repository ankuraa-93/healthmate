-- Share Connections: allows users to share/request access to each other's food logs
-- Run this in Supabase SQL Editor

-- Table
CREATE TABLE IF NOT EXISTS share_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_email text NOT NULL,
  viewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  viewer_email text NOT NULL,
  type text NOT NULL CHECK (type IN ('share', 'request')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'revoked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sc_owner ON share_connections(owner_id);
CREATE INDEX IF NOT EXISTS idx_sc_viewer ON share_connections(viewer_id);
CREATE INDEX IF NOT EXISTS idx_sc_owner_email ON share_connections(owner_email);
CREATE INDEX IF NOT EXISTS idx_sc_viewer_email ON share_connections(viewer_email);

ALTER TABLE share_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own connections"
  ON share_connections FOR SELECT
  USING (owner_id = auth.uid() OR viewer_id = auth.uid());

CREATE POLICY "Users can update own connections"
  ON share_connections FOR UPDATE
  USING (owner_id = auth.uid() OR viewer_id = auth.uid());

-- RPC: fetch connections where caller is the viewer (people whose logs I can see)
-- Returns profile info for the avatar row
CREATE OR REPLACE FUNCTION get_viewable_connections()
RETURNS TABLE(
  id uuid,
  owner_id uuid,
  owner_email text,
  owner_display_name text,
  owner_avatar_url text,
  type text,
  accepted_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sc.id,
    sc.owner_id,
    sc.owner_email,
    p.display_name,
    p.avatar_url,
    sc.type,
    sc.updated_at
  FROM share_connections sc
  LEFT JOIN profiles p ON p.id = sc.owner_id
  WHERE sc.viewer_id = auth.uid()
  AND sc.status = 'accepted'
  ORDER BY sc.updated_at ASC;
END;
$$;

-- RPC: fetch pending incoming requests (someone wants to see MY log)
CREATE OR REPLACE FUNCTION get_pending_requests()
RETURNS TABLE(
  id uuid,
  viewer_id uuid,
  viewer_email text,
  viewer_display_name text,
  viewer_avatar_url text,
  type text,
  created_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sc.id,
    sc.viewer_id,
    sc.viewer_email,
    p.display_name,
    p.avatar_url,
    sc.type,
    sc.created_at
  FROM share_connections sc
  LEFT JOIN profiles p ON p.id = sc.viewer_id
  WHERE sc.owner_id = auth.uid()
  AND sc.status = 'pending';
END;
$$;

-- RPC: fetch an owner's food log (used by viewers to see shared data)
-- Validates that caller has an accepted connection before returning data
CREATE OR REPLACE FUNCTION get_connection_log(p_owner_id uuid, p_date date DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  v_date date;
  v_caller uuid;
  v_week_start date;
BEGIN
  v_caller := auth.uid();

  IF NOT EXISTS (
    SELECT 1 FROM share_connections
    WHERE owner_id = p_owner_id
    AND viewer_id = v_caller
    AND status = 'accepted'
  ) THEN
    RAISE EXCEPTION 'No active share connection';
  END IF;

  v_date := COALESCE(p_date, CURRENT_DATE);
  v_week_start := v_date - (EXTRACT(ISODOW FROM v_date)::int - 1);

  SELECT jsonb_build_object(
    'display_name', p.display_name,
    'avatar_url', p.avatar_url,
    'email', u.email,
    'logged_date', v_date,
    'daily_calorie_goal', p.daily_calorie_goal,
    'daily_protein_goal', p.daily_protein_goal,
    'daily_carbs_goal', p.daily_carbs_goal,
    'daily_fat_goal', p.daily_fat_goal,
    'daily_fibre_goal', p.daily_fibre_goal,
    'entries', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', fl.id,
        'food_name', fl.food_name,
        'quantity_g', fl.quantity_g,
        'calories', fl.calories,
        'protein', fl.protein,
        'carbs', fl.carbs,
        'fat', fl.fat,
        'fibre', fl.fibre,
        'meal_type', fl.meal_type,
        'unit', fl.unit,
        'input_source', fl.input_source,
        'image_url', lib.image_url
      ) ORDER BY fl.created_at)
      FROM food_log fl
      LEFT JOIN food_library lib ON lib.id = fl.food_library_id
      WHERE fl.user_id = p_owner_id
      AND fl.logged_date = v_date
      AND fl.status = 'confirmed'
    ), '[]'::jsonb),
    'weekly_calories', COALESCE((
      SELECT jsonb_object_agg(sub.d, sub.total)
      FROM (
        SELECT fl.logged_date AS d, SUM(fl.calories) AS total
        FROM food_log fl
        WHERE fl.user_id = p_owner_id
        AND fl.logged_date BETWEEN v_week_start AND (v_week_start + 6)
        AND fl.status = 'confirmed'
        GROUP BY fl.logged_date
      ) sub
    ), '{}'::jsonb)
  ) INTO result
  FROM profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE p.id = p_owner_id;

  RETURN result;
END;
$$;

-- RPC: fetch all connections for Settings page management
CREATE OR REPLACE FUNCTION get_all_my_connections()
RETURNS TABLE(
  id uuid,
  owner_id uuid,
  owner_email text,
  owner_display_name text,
  owner_avatar_url text,
  viewer_id uuid,
  viewer_email text,
  viewer_display_name text,
  viewer_avatar_url text,
  type text,
  status text,
  created_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sc.id,
    sc.owner_id,
    sc.owner_email,
    op.display_name AS owner_display_name,
    op.avatar_url AS owner_avatar_url,
    sc.viewer_id,
    sc.viewer_email,
    vp.display_name AS viewer_display_name,
    vp.avatar_url AS viewer_avatar_url,
    sc.type,
    sc.status,
    sc.created_at
  FROM share_connections sc
  LEFT JOIN profiles op ON op.id = sc.owner_id
  LEFT JOIN profiles vp ON vp.id = sc.viewer_id
  WHERE (sc.owner_id = auth.uid() OR sc.viewer_id = auth.uid())
  AND sc.status IN ('accepted', 'pending');
END;
$$;
