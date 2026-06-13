import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase();
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, display_name, avatar_url')
    .or(`display_name.ilike.%${q}%`)
    .neq('id', user.id)
    .limit(5);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?per_page=50`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    },
  );
  const authData = await res.json();
  const authUsers: Array<{ id: string; email?: string }> = authData.users ?? [];

  const emailMap = new Map<string, string>();
  for (const u of authUsers) {
    if (u.email) emailMap.set(u.id, u.email);
  }

  const profileMap = new Map<string, { display_name: string | null; avatar_url: string | null }>();
  for (const p of profiles ?? []) {
    profileMap.set(p.id, { display_name: p.display_name, avatar_url: p.avatar_url });
  }

  const nameMatchIds = new Set((profiles ?? []).map(p => p.id));

  const emailMatches = authUsers
    .filter(u => u.id !== user.id && u.email?.toLowerCase().includes(q))
    .map(u => u.id);

  const allIds = new Set([...nameMatchIds, ...emailMatches]);

  const resultsList = [...allIds].slice(0, 6).map(id => ({
    id,
    email: emailMap.get(id) ?? null,
    display_name: profileMap.get(id)?.display_name ?? null,
    avatar_url: profileMap.get(id)?.avatar_url ?? null,
  }));

  const myEmail = user.email!.toLowerCase();
  const resultEmails = resultsList.map(r => r.email?.toLowerCase()).filter(Boolean) as string[];

  if (resultEmails.length > 0) {
    const { data: connections } = await supabaseAdmin
      .from('share_connections')
      .select('owner_email, viewer_email, status')
      .in('status', ['pending', 'accepted'])
      .or(`owner_email.eq.${myEmail},viewer_email.eq.${myEmail}`);

    const shareStatusMap = new Map<string, 'accepted' | 'pending'>();
    const requestStatusMap = new Map<string, 'accepted' | 'pending'>();

    for (const c of connections ?? []) {
      const ownerEmail = c.owner_email.toLowerCase();
      const viewerEmail = c.viewer_email.toLowerCase();

      if (ownerEmail === myEmail) {
        const existing = shareStatusMap.get(viewerEmail);
        if (!existing || c.status === 'accepted') {
          shareStatusMap.set(viewerEmail, c.status);
        }
      }

      if (viewerEmail === myEmail) {
        const existing = requestStatusMap.get(ownerEmail);
        if (!existing || c.status === 'accepted') {
          requestStatusMap.set(ownerEmail, c.status);
        }
      }
    }

    const results = resultsList.map(r => {
      const email = r.email?.toLowerCase() ?? '';
      return {
        ...r,
        share_status: shareStatusMap.get(email) ?? null,
        request_status: requestStatusMap.get(email) ?? null,
      };
    });

    return NextResponse.json({ results });
  }

  const results = resultsList.map(r => ({ ...r, share_status: null, request_status: null }));
  return NextResponse.json({ results });
}
