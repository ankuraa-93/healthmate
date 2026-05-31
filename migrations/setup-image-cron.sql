-- Set up pg_cron to trigger backfill-images Edge Function every 4 hours
-- Run in Supabase Dashboard → SQL Editor
--
-- Prerequisites:
-- 1. Enable pg_cron extension: Database → Extensions → search "pg_cron" → Enable
-- 2. Enable pg_net extension: Database → Extensions → search "pg_net" → Enable
-- 3. Deploy the Edge Function: supabase functions deploy backfill-images
-- 4. Replace <SERVICE_ROLE_KEY> below with your actual service role key
--    (Find it in: Supabase Dashboard → Settings → API → service_role key)

-- Schedule: every 4 hours (6 runs/day × 15 items = 90 queries/day, under 100 free limit)
SELECT cron.schedule(
  'backfill-food-images',
  '0 */4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://hnxbjwwfdbbalrpthshk.supabase.co/functions/v1/backfill-images',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer <SERVICE_ROLE_KEY>"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- Useful queries for monitoring:
-- Check cron job status:
--   SELECT * FROM cron.job ORDER BY jobid;
--
-- Check recent run history:
--   SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;
--
-- Delete the cron job if needed:
--   SELECT cron.unschedule('backfill-food-images');
