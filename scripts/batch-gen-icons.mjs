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
const BATCH_SIZE = 50;
const BATCH_DELAY_MS = 2000;
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 30000;

const PROMPT_TEMPLATE = (foodName) =>
  `photorealistic 3D render of ${foodName}. If the food can be raw or cooked (rice, dal, pasta, oats, etc.), always show the COOKED version — only show raw if the name explicitly says "raw" or "uncooked". Clean product shot photographed in a pure white studio on a PURE WHITE (#FFFFFF) background — the background must be exactly #FFFFFF with zero grey, cream, or off-white tones. 3/4 view from a high 45-degree angle. Soft diffuse studio lighting from the top-left. Very subtle, soft cast shadow directly underneath the food only — shadow must not darken or tint the white background. Slightly desaturated natural colors, warm neutral tones. No text, no labels, no other objects, no packaging. Clean, minimal, premium aesthetic.`;

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

async function resizeImage(buf) {
  return sharp(buf).resize(256, 256, { fit: 'cover' }).png().toBuffer();
}

async function uploadToSupabase(slug, pngBuffer) {
  const path = `${slug}.png`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, pngBuffer, { contentType: 'image/png', upsert: true });
  if (error) throw new Error(`Storage upload error: ${error.message}`);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function updateFoodLibrary(id, imageUrl) {
  const { error } = await supabase
    .from('food_library')
    .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(`DB update error: ${error.message}`);
}

async function main() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoff = thirtyDaysAgo.toISOString().split('T')[0];

  console.log(`\nFetching foods logged since ${cutoff} that need icons...\n`);

  const { data: logs, error: logErr } = await supabase
    .from('food_log')
    .select('food_library_id')
    .gte('logged_date', cutoff)
    .not('food_library_id', 'is', null);

  if (logErr) { console.error('Log query error:', logErr); process.exit(1); }

  const uniqueIds = [...new Set(logs.map(l => l.food_library_id))];

  const { data: foods, error: foodErr } = await supabase
    .from('food_library')
    .select('id, name')
    .in('id', uniqueIds)
    .is('image_url', null)
    .order('name');

  if (foodErr) { console.error('Food query error:', foodErr); process.exit(1); }
  if (!foods.length) { console.log('All recent foods already have icons!'); return; }

  console.log(`Found ${foods.length} foods needing icons.\n`);

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const results = [];
  const totalBatches = Math.ceil(foods.length / BATCH_SIZE);

  for (let b = 0; b < totalBatches; b++) {
    const batch = foods.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
    if (b > 0) {
      console.log(`\n--- Batch ${b + 1}/${totalBatches} (waiting ${BATCH_DELAY_MS / 1000}s) ---\n`);
      await sleep(BATCH_DELAY_MS);
    } else {
      console.log(`--- Batch 1/${totalBatches} ---\n`);
    }

    for (let i = 0; i < batch.length; i++) {
      const food = batch[i];
      const globalIdx = b * BATCH_SIZE + i + 1;
      const slug = slugify(food.name);
      const localPath = `${OUTPUT_DIR}/${slug}.png`;

      process.stdout.write(`[${globalIdx}/${foods.length}] ${food.name}...`);

      try {
        const t0 = Date.now();
        const rawImage = await generateImage(food.name);
        const resized = await resizeImage(rawImage);
        writeFileSync(localPath, resized);

        const publicUrl = await uploadToSupabase(slug, resized);
        await updateFoodLibrary(food.id, publicUrl);

        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        console.log(` done (${elapsed}s, ${(resized.length / 1024).toFixed(0)}KB)`);
        results.push({ name: food.name, slug, status: 'ok' });
      } catch (err) {
        console.log(` FAILED: ${err.message}`);
        results.push({ name: food.name, slug, status: 'failed', error: err.message });
      }
    }
  }

  console.log('\n\n=== Summary ===');
  const ok = results.filter(r => r.status === 'ok');
  const failed = results.filter(r => r.status === 'failed');
  console.log(`  Total: ${results.length}`);
  console.log(`  Succeeded: ${ok.length}`);
  console.log(`  Failed: ${failed.length}`);
  if (failed.length) {
    console.log(`\n  Failures:`);
    failed.forEach(f => console.log(`    - ${f.name}: ${f.error}`));
  }
  console.log(`\n  Local backups: ${OUTPUT_DIR}/`);
  console.log(`  Uploaded to Supabase bucket: ${BUCKET}`);
  console.log(`  food_library.image_url updated for ${ok.length} foods\n`);
}

main().catch(e => { console.error('\nFatal:', e); process.exit(1); });
