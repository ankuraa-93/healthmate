import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-3.1-flash-image-preview';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
const BUCKET = 'food-icons';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const PROMPT = (foodName: string) =>
  `photorealistic 3D render of ${foodName}. If the food can be raw or cooked (rice, dal, pasta, oats, etc.), always show the COOKED version — only show raw if the name explicitly says "raw" or "uncooked". Clean product shot photographed in a pure white studio on a PURE WHITE (#FFFFFF) background — the background must be exactly #FFFFFF with zero grey, cream, or off-white tones. 3/4 view from a high 45-degree angle. Soft diffuse studio lighting from the top-left. Very subtle, soft cast shadow directly underneath the food only — shadow must not darken or tint the white background. Slightly desaturated natural colors, warm neutral tones. No text, no labels, no other objects, no packaging. Clean, minimal, premium aesthetic.`;

export async function POST(req: NextRequest) {
  try {
    const { food_library_id } = await req.json();
    if (!food_library_id || !GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: food, error: fetchErr } = await supabase
      .from('food_library')
      .select('id, name, image_url')
      .eq('id', food_library_id)
      .single();

    if (fetchErr || !food) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    if (food.image_url) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT(food.name) }] }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          imageConfig: { aspectRatio: '1:1' },
        },
      }),
    });

    const data = await res.json();
    if (data.error) {
      console.error('generate-icon: Gemini error', data.error.message);
      return NextResponse.json({ error: 'Gemini error' }, { status: 502 });
    }

    const parts = data.candidates?.[0]?.content?.parts;
    const imagePart = parts?.find((p: Record<string, unknown>) => p.inlineData);
    if (!imagePart) {
      console.error('generate-icon: no image in response');
      return NextResponse.json({ error: 'No image generated' }, { status: 502 });
    }

    const rawBuf = Buffer.from(imagePart.inlineData.data, 'base64');
    const resized = await sharp(rawBuf).resize(256, 256, { fit: 'cover' }).png().toBuffer();

    const slug = slugify(food.name);
    const path = `${slug}.png`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, resized, { contentType: 'image/png', upsert: true });

    if (upErr) {
      console.error('generate-icon: upload error', upErr.message);
      return NextResponse.json({ error: 'Upload failed' }, { status: 502 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const { error: dbErr } = await supabase
      .from('food_library')
      .update({ image_url: urlData.publicUrl, updated_at: new Date().toISOString() })
      .eq('id', food_library_id);

    if (dbErr) {
      console.error('generate-icon: db update error', dbErr.message);
      return NextResponse.json({ error: 'DB update failed' }, { status: 502 });
    }

    console.log(`generate-icon: created icon for "${food.name}"`);
    return NextResponse.json({ ok: true, image_url: urlData.publicUrl });
  } catch (err) {
    console.error('generate-icon: unexpected error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
