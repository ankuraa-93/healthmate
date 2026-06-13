import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function getUser(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function lookupUserByEmail(email: string): Promise<{ id: string; email: string } | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  const users: Array<{ id: string; email?: string }> = data.users ?? [];
  const match = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  return match ? { id: match.id, email: match.email! } : null;
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type, targetEmail } = await req.json();
  if (!type || !targetEmail) {
    return NextResponse.json({ error: 'type and targetEmail required' }, { status: 400 });
  }

  const normalizedEmail = targetEmail.toLowerCase().trim();
  if (normalizedEmail === user.email?.toLowerCase()) {
    return NextResponse.json({ error: 'Cannot share with yourself' }, { status: 400 });
  }

  const targetUser = await lookupUserByEmail(normalizedEmail);

  let ownerEmail: string;
  let ownerId: string | null;
  let viewerEmail: string;
  let viewerId: string | null;
  let status: string;

  if (type === 'share') {
    ownerId = user.id;
    ownerEmail = user.email!;
    viewerId = targetUser?.id ?? null;
    viewerEmail = normalizedEmail;
    status = 'accepted';
  } else if (type === 'request') {
    ownerId = targetUser?.id ?? null;
    ownerEmail = normalizedEmail;
    viewerId = user.id;
    viewerEmail = user.email!;
    status = 'pending';
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const { data: existing } = await supabaseAdmin
    .from('share_connections')
    .select('id, status')
    .eq('owner_email', ownerEmail)
    .eq('viewer_email', viewerEmail)
    .in('status', ['pending', 'accepted'])
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'Connection already exists', existing: true }, { status: 409 });
  }

  const { data: revoked } = await supabaseAdmin
    .from('share_connections')
    .select('id')
    .eq('owner_email', ownerEmail)
    .eq('viewer_email', viewerEmail)
    .in('status', ['revoked', 'declined'])
    .maybeSingle();

  if (revoked) {
    const { data: updated, error } = await supabaseAdmin
      .from('share_connections')
      .update({
        type,
        status,
        owner_id: ownerId,
        viewer_id: viewerId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', revoked.id)
      .select()
      .single();

    if (error) {
      console.error('share-connections update error:', error);
      return NextResponse.json({ error: 'Failed to create connection' }, { status: 500 });
    }
    return NextResponse.json({ connection: updated, targetExists: !!targetUser });
  }

  const { data: created, error } = await supabaseAdmin
    .from('share_connections')
    .insert({
      owner_id: ownerId,
      owner_email: ownerEmail,
      viewer_id: viewerId,
      viewer_email: viewerEmail,
      type,
      status,
    })
    .select()
    .single();

  if (error) {
    console.error('share-connections insert error:', error);
    return NextResponse.json({ error: 'Failed to create connection' }, { status: 500 });
  }

  return NextResponse.json({ connection: created, targetExists: !!targetUser });
}

export async function PATCH(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { connectionId, action } = await req.json();
  if (!connectionId || !action) {
    return NextResponse.json({ error: 'connectionId and action required' }, { status: 400 });
  }

  const { data: conn } = await supabaseAdmin
    .from('share_connections')
    .select('*')
    .eq('id', connectionId)
    .single();

  if (!conn) {
    return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
  }

  if (conn.owner_id !== user.id && conn.viewer_id !== user.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  let newStatus: string;
  if (action === 'accept') {
    if (conn.owner_id !== user.id) {
      return NextResponse.json({ error: 'Only the owner can accept' }, { status: 403 });
    }
    newStatus = 'accepted';
  } else if (action === 'decline') {
    if (conn.owner_id !== user.id) {
      return NextResponse.json({ error: 'Only the owner can decline' }, { status: 403 });
    }
    newStatus = 'declined';
  } else if (action === 'revoke') {
    newStatus = 'revoked';
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const { data: updated, error } = await supabaseAdmin
    .from('share_connections')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', connectionId)
    .select()
    .single();

  if (error) {
    console.error('share-connections patch error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }

  return NextResponse.json({ connection: updated });
}
