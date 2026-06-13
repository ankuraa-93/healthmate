DROP FUNCTION IF EXISTS get_viewable_connections();

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
