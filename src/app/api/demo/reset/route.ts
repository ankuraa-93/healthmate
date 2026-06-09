import { NextRequest, NextResponse } from 'next/server';
import {
  DEMO_USER_ID,
  DEMO_DISPLAY_NAME,
  DEMO_GOALS,
  buildSeedRows,
} from '@/lib/demo';

// Resets the shared demo account back to the curated seed day. Called right
// before a visitor is signed into the demo, so everyone starts clean. Uses the
// service role key to bypass RLS; only ever touches DEMO_USER_ID's own rows.
export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('demo/reset: missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
    return NextResponse.json({ error: 'Demo is not configured on the server' }, { status: 500 });
  }

  // Client passes its local date so "today" matches what the user sees; fall
  // back to the server's date if it's missing or malformed.
  let todayStr = new Date().toISOString().slice(0, 10);
  try {
    const body = await req.json();
    if (typeof body?.today === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.today)) {
      todayStr = body.today;
    }
  } catch {
    // no body — use server date
  }

  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };

  const del = (table: string) =>
    fetch(`${supabaseUrl}/rest/v1/${table}?user_id=eq.${DEMO_USER_ID}`, {
      method: 'DELETE',
      headers,
    });

  try {
    // 1. Wipe whatever the previous visitor left behind.
    for (const table of ['food_log', 'processing_jobs', 'share_links']) {
      const res = await del(table);
      if (!res.ok && res.status !== 404) {
        const text = await res.text();
        console.error(`demo/reset: failed clearing ${table}`, res.status, text);
        return NextResponse.json({ error: 'Demo reset failed' }, { status: 502 });
      }
    }

    // 2. Restore the demo profile (display name + goals).
    const profRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${DEMO_USER_ID}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        display_name: DEMO_DISPLAY_NAME,
        avatar_url: null,
        ...DEMO_GOALS,
        goals_mode: 'default',
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
      }),
    });
    if (!profRes.ok) {
      const text = await profRes.text();
      console.error('demo/reset: failed updating profile', profRes.status, text);
      return NextResponse.json({ error: 'Demo reset failed' }, { status: 502 });
    }

    // 3. Re-seed the curated day, dated relative to today.
    const rows = buildSeedRows(todayStr);
    const seedRes = await fetch(`${supabaseUrl}/rest/v1/food_log`, {
      method: 'POST',
      headers,
      body: JSON.stringify(rows),
    });
    if (!seedRes.ok) {
      const text = await seedRes.text();
      console.error('demo/reset: failed seeding food_log', seedRes.status, text);
      return NextResponse.json({ error: 'Demo reset failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('demo/reset: unexpected error', err);
    return NextResponse.json({ error: 'Demo reset failed' }, { status: 502 });
  }
}
