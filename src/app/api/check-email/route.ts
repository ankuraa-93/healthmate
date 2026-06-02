import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Query auth.users directly via PostgREST with service role key
    const res = await fetch(
      `${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email.toLowerCase().trim())}&select=id`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );

    if (!res.ok) {
      // Fallback: try the GoTrue admin endpoint
      const adminRes = await fetch(`${supabaseUrl}/auth/v1/admin/users?page=1&per_page=500`, {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      });

      if (!adminRes.ok) {
        return NextResponse.json({ exists: false });
      }

      const adminData = await adminRes.json();
      const normalizedEmail = email.toLowerCase().trim();
      const exists = adminData.users?.some(
        (u: { email?: string }) => u.email?.toLowerCase() === normalizedEmail
      ) ?? false;

      return NextResponse.json({ exists });
    }

    const data = await res.json();
    return NextResponse.json({ exists: Array.isArray(data) && data.length > 0 });
  } catch {
    return NextResponse.json({ exists: false });
  }
}
