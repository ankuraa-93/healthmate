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

const GEMINI_API_KEY = env.GEMINI_API_KEY;
const MODEL = 'gemini-3.1-flash-image-preview';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
const BUCKET = 'food-icons';
const OUTPUT_DIR = 'food-icon-batch';
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 30000;

const PROMPT_TEMPLATE = (foodName) =>
  `photorealistic 3D render of ${foodName}. If the food can be raw or cooked (rice, dal, pasta, oats, etc.), always show the COOKED version — only show raw if the name explicitly says "raw" or "uncooked". Clean product shot photographed in a pure white studio on a PURE WHITE (#FFFFFF) background — the background must be exactly #FFFFFF with zero grey, cream, or off-white tones. 3/4 view from a high 45-degree angle. Soft diffuse studio lighting from the top-left. Very subtle, soft cast shadow directly underneath the food only — shadow must not darken or tint the white background. Slightly desaturated natural colors, warm neutral tones. No text, no labels, no other objects, no packaging. Clean, minimal, premium aesthetic.`;

// Demo foods with their nutrition (per 100g) and unit, derived from the seed data
const DEMO_FOODS_TO_INSERT = [
  { name: 'Buttered Toast', calories_per_100g: 333, protein_per_100g: 8, carbs_per_100g: 43, fat_per_100g: 15, fibre_per_100g: 3, serving_size_g: 60, unit: 'g' },
  { name: 'Almonds', calories_per_100g: 580, protein_per_100g: 20, carbs_per_100g: 20, fat_per_100g: 50, fibre_per_100g: 10, serving_size_g: 20, unit: 'g' },
  { name: 'Oats with Milk', calories_per_100g: 112, protein_per_100g: 5, carbs_per_100g: 18, fat_per_100g: 2, fibre_per_100g: 2, serving_size_g: 250, unit: 'g' },
  { name: 'Boiled Eggs', calories_per_100g: 155, protein_per_100g: 13, carbs_per_100g: 1, fat_per_100g: 11, fibre_per_100g: 0, serving_size_g: 100, unit: 'g' },
  { name: 'Rajma', calories_per_100g: 140, protein_per_100g: 7, carbs_per_100g: 20, fat_per_100g: 3, fibre_per_100g: 6, serving_size_g: 200, unit: 'g' },
  { name: 'Grilled Chicken', calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3, fibre_per_100g: 0, serving_size_g: 150, unit: 'g' },
  { name: 'Mixed Vegetable Salad', calories_per_100g: 50, protein_per_100g: 2, carbs_per_100g: 8, fat_per_100g: 1, fibre_per_100g: 3, serving_size_g: 150, unit: 'g' },
  { name: 'Sambar', calories_per_100g: 60, protein_per_100g: 3, carbs_per_100g: 9, fat_per_100g: 1, fibre_per_100g: 3, serving_size_g: 150, unit: 'ml' },
  { name: 'Chole', calories_per_100g: 160, protein_per_100g: 7, carbs_per_100g: 21, fat_per_100g: 6, fibre_per_100g: 6, serving_size_g: 200, unit: 'g' },
  { name: 'Bhature', calories_per_100g: 300, protein_per_100g: 7, carbs_per_100g: 42, fat_per_100g: 12, fibre_per_100g: 2, serving_size_g: 100, unit: 'g' },
  { name: 'Peanut Butter Toast', calories_per_100g: 363, protein_per_100g: 14, carbs_per_100g: 38, fat_per_100g: 19, fibre_per_100g: 5, serving_size_g: 80, unit: 'g' },
  { name: 'Veg Pulao', calories_per_100g: 144, protein_per_100g: 3, carbs_per_100g: 24, fat_per_100g: 4, fibre_per_100g: 2, serving_size_g: 250, unit: 'g' },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImage(foodName, attempt = 1) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: PROMPT_TEMPLATE(foodName) }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: { aspectRatio: '1:1' },
      },
    }),
  });

  const data = await res.json();
  if (data.error) {
    const msg = data.error.message || '';
    const isRateLimit = res.status === 429 || msg.includes('quota') || msg.includes('rate');
    if (isRateLimit && attempt <= MAX_RETRIES) {
      const wait = BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
      process.stdout.write(` rate-limited, waiting ${wait / 1000}s...`);
      await sleep(wait);
      return generateImage(foodName, attempt + 1);
    }
    throw new Error(`Gemini API error: ${msg}`);
  }

  const parts = data.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error('No parts in response');
  const imagePart = parts.find(p => p.inlineData);
  if (!imagePart) throw new Error('No image in response');
  return Buffer.from(imagePart.inlineData.data, 'base64');
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Step 1: Insert missing foods into food_library
  console.log('\n=== Step 1: Insert missing foods into food_library ===\n');
  for (const food of DEMO_FOODS_TO_INSERT) {
    const { data: existing } = await supabase
      .from('food_library')
      .select('id, name')
      .eq('name', food.name)
      .maybeSingle();

    if (existing) {
      console.log(`  EXISTS  ${food.name}`);
      continue;
    }

    if (dryRun) {
      console.log(`  WOULD INSERT  ${food.name}`);
      continue;
    }

    const { error } = await supabase
      .from('food_library')
      .insert({ ...food, source: 'base' });

    if (error) {
      console.error(`  FAILED  ${food.name}: ${error.message}`);
    } else {
      console.log(`  INSERTED  ${food.name}`);
    }
  }

  // Step 2: Find all demo foods needing icons
  console.log('\n=== Step 2: Generate icons for demo foods without them ===\n');

  const allDemoNames = [
    'Buttered Toast', 'Sprouts Salad', 'Masala Chai',
    'Palak Paneer', 'Roti', 'Sev', 'Banana', 'Almonds',
    'Oats with Milk', 'Boiled Eggs', 'Rajma', 'Steamed Rice',
    'Grilled Chicken', 'Mixed Vegetable Salad', 'Idli', 'Sambar',
    'Dal Tadka', 'Apple', 'Poha', 'Chole', 'Bhature',
    'Peanut Butter Toast', 'Veg Pulao',
  ];

  const { data: foods, error: fetchErr } = await supabase
    .from('food_library')
    .select('id, name, image_url')
    .in('name', allDemoNames);

  if (fetchErr) { console.error(fetchErr); process.exit(1); }

  const needsIcon = foods.filter(f => !f.image_url);
  if (needsIcon.length === 0) {
    console.log('All demo foods already have icons!');
    return;
  }

  console.log(`${needsIcon.length} foods need icons:\n`);

  for (let i = 0; i < needsIcon.length; i++) {
    const food = needsIcon[i];
    const slug = slugify(food.name);
    process.stdout.write(`[${i + 1}/${needsIcon.length}] ${food.name}...`);

    if (dryRun) {
      console.log(' (dry run)');
      continue;
    }

    try {
      const rawImage = await generateImage(food.name);
      const resized = await sharp(rawImage).resize(256, 256, { fit: 'cover' }).png().toBuffer();

      writeFileSync(`${OUTPUT_DIR}/${slug}.png`, resized);

      const path = `${slug}.png`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, resized, { contentType: 'image/png', upsert: true });
      if (upErr) throw new Error(`Upload error: ${upErr.message}`);

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const { error: dbErr } = await supabase
        .from('food_library')
        .update({ image_url: urlData.publicUrl, updated_at: new Date().toISOString() })
        .eq('id', food.id);
      if (dbErr) throw new Error(`DB update error: ${dbErr.message}`);

      console.log(' done');
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
    }

    if (i < needsIcon.length - 1) await sleep(2000);
  }

  console.log('\nDone!');
}

main().catch(console.error);
