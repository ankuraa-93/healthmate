import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ownerId = req.nextUrl.searchParams.get('ownerId');
  const date = req.nextUrl.searchParams.get('date');

  if (!ownerId) {
    return NextResponse.json({ error: 'ownerId required' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('get_connection_log', {
    p_owner_id: ownerId,
    p_date: date || null,
  });

  if (error) {
    console.error('get_connection_log error:', error);
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  return NextResponse.json(data);
}
