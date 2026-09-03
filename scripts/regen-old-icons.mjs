import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const API_KEY = env.GEMINI_API_KEY;
const MODEL = 'gemini-3.1-flash-image-preview';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const BUCKET = 'food-icons';

const PROMPT_TEMPLATE = (foodName) =>
  `photorealistic 3D render of ${foodName}. Clean product shot on a PURE WHITE (#FFFFFF) background — the background must be exactly #FFFFFF with zero grey, cream, or off-white tones. 3/4 view from a high 45-degree angle. Soft diffuse studio lighting from the top-left. Very subtle, soft cast shadow directly underneath the food only — shadow must not darken or tint the white background. Slightly desaturated natural colors, warm neutral tones. No text, no labels, no other objects, no packaging. Clean, minimal, premium aesthetic.`;

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const OLD_PROMPT_FOODS = [
  'Snackible Ragi Chips Peri Peri',
  'Harvest Salad Co Grilled Chicken Wrap',
  'Chicken Stroganoff',
  'Herb Rice',
  'Tres Leches Cake',
  'Kesar Ghewar',
  'Ritter Sport Hazelnut Chocolate',
  'Korean Chilli Chicken Balls',
  'Magnolia Bakery Carrot Cake Slice',
  'Chilli Pan Fried Chicken Momo',
  'Chicken Pan Fried Manchurian Momo',
  'Glens Bakehouse Vanilla Cupcake',
  'Chaayos Chicken Tikka Sandwich',
  'Homemade Sambhar',
  'Iced Mocha Latte',
  '4700 BC Nutty Tuxedo Popcorn',
  'Chicken Ghee Roast',
  'Roasted Kurmura',
  'Bhindi Aloo Sabzi',
  'Baked Vegetable Macaroni',
];

const OUT = 'food-icon-regen';
mkdirSync(OUT, { recursive: true });

for (let i = 0; i < OLD_PROMPT_FOODS.length; i++) {
  const name = OLD_PROMPT_FOODS[i];
  const slug = slugify(name);
  process.stdout.write(`\n[${i + 1}/${OLD_PROMPT_FOODS.length}] ${name}...`);

  try {
    const t0 = Date.now();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT_TEMPLATE(name) }] }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          imageConfig: { aspectRatio: '1:1' },
        },
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const imgPart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!imgPart) throw new Error('No image in response');

    const raw = Buffer.from(imgPart.inlineData.data, 'base64');
    const resized = await sharp(raw).resize(256, 256, { fit: 'cover' }).png().toBuffer();
    writeFileSync(`${OUT}/${slug}.png`, resized);

    // Upload to Supabase (overwrite)
    const path = `${slug}.png`;
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, resized, { contentType: 'image/png', upsert: true });
    if (uploadErr) throw new Error(`Upload: ${uploadErr.message}`);

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(` done (${elapsed}s, ${(resized.length / 1024).toFixed(0)}KB)`);
  } catch (err) {
    console.log(` FAILED: ${err.message}`);
  }
}

console.log(`\nDone. Local copies in ${OUT}/`);
