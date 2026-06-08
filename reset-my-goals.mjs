// Reset a user's goal personalization back to defaults so the personalize flow
// can be re-tested from scratch.  Usage:
//   node reset-my-goals.mjs                      # defaults to ankuraa.93@gmail.com
//   node reset-my-goals.mjs someone@example.com
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const email = (process.argv[2] || 'ankuraa.93@gmail.com').toLowerCase();

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Find the user id by email (listUsers is paginated).
let userId = null;
for (let page = 1; ; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
  if (error) { console.error(error); process.exit(1); }
  const u = data.users.find((x) => x.email?.toLowerCase() === email);
  if (u) { userId = u.id; break; }
  if (data.users.length < 1000) break;
}
if (!userId) { console.error(`No user found for ${email}`); process.exit(1); }

const { error } = await supabase
  .from('profiles')
  .update({
    goals_mode: 'default',
    daily_calorie_goal: 2000,
    daily_protein_goal: 120,
    daily_carbs_goal: 250,
    daily_fat_goal: 65,
    daily_fibre_goal: 30,
    sex: null,
    age: null,
    birth_date: null,
    height_cm: null,
    weight_kg: null,
    activity_description: null,
    activity_factor: null,
    does_resistance_training: null,
    activity_workouts: null,
    goal_type: null,
    goal_pace_kg_per_month: null,
    updated_at: new Date().toISOString(),
  })
  .eq('id', userId);

if (error) { console.error(error); process.exit(1); }
console.log(`✓ Reset goals to defaults for ${email}. Reload the app to re-test the personalize flow.`);
