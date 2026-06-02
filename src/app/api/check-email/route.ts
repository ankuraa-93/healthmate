import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Fail closed: if we can't check, say so instead of silently treating
  // a registered user as new. (This is what broke on prod when the
  // service role key wasn't set in Vercel.)
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('check-email: missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
    return NextResponse.json(
      { error: 'Email check is not configured on the server' },
      { status: 500 }
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Query the GoTrue admin API for this exact email. This is the
    // supported way to read auth users with the service role key.
    const res = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(normalizedEmail)}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error('check-email: admin API error', res.status, body);
      return NextResponse.json({ error: 'Could not verify email' }, { status: 502 });
    }

    const data = await res.json();
    // Some GoTrue versions ignore the email filter and return a full page,
    // so match explicitly rather than trusting the result is pre-filtered.
    const users: Array<{ email?: string }> = data.users ?? [];
    const exists = users.some((u) => u.email?.toLowerCase() === normalizedEmail);

    return NextResponse.json({ exists });
  } catch (err) {
    console.error('check-email: unexpected error', err);
    return NextResponse.json({ error: 'Could not verify email' }, { status: 502 });
  }
}
