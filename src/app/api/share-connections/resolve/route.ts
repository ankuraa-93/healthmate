import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const email = user.email.toLowerCase();

  const { data: asOwner } = await supabaseAdmin
    .from('share_connections')
    .select('id')
    .eq('owner_email', email)
    .is('owner_id', null);

  if (asOwner && asOwner.length > 0) {
    await supabaseAdmin
      .from('share_connections')
      .update({ owner_id: user.id, updated_at: new Date().toISOString() })
      .eq('owner_email', email)
      .is('owner_id', null);
  }

  const { data: asViewer } = await supabaseAdmin
    .from('share_connections')
    .select('id')
    .eq('viewer_email', email)
    .is('viewer_id', null);

  if (asViewer && asViewer.length > 0) {
    await supabaseAdmin
      .from('share_connections')
      .update({ viewer_id: user.id, updated_at: new Date().toISOString() })
      .eq('viewer_email', email)
      .is('viewer_id', null);
  }

  const resolved = (asOwner?.length ?? 0) + (asViewer?.length ?? 0);
  return NextResponse.json({ resolved });
}
