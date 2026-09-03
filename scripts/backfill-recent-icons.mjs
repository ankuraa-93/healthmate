import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
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
const OUTPUT_DIR = 'food-icon-test-batch';
const BATCH_SIZE = parseInt(process.argv[2] || '20', 10);
const DRY_RUN = process.argv.includes('--dry-run');
const DAYS = 60;

const PROMPT_TEMPLATE = (foodName) =>
  `photorealistic 3D render of ${foodName}. Clean product shot on a PURE WHITE (#FFFFFF) background — the background must be exactly #FFFFFF with zero grey, cream, or off-white tones. 3/4 view from a high 45-degree angle. Soft diffuse studio lighting from the top-left. Very subtle, soft cast shadow directly underneath the food only — shadow must not darken or tint the white background. Slightly desaturated natural colors, warm neutral tones. No text, no labels, no other objects, no packaging. Clean, minimal, premium aesthetic.`;

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function generateImage(foodName) {
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
  if (data.error) throw new Error(`Gemini API error: ${data.error.message}`);
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
  const { error } = await supabase.storage.from(BUCKET).upload(path, pngBuffer, {
    contentType: 'image/png',
    upsert: true,
  });
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
  const cutoff = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  console.log(`\n🔍 Finding foods logged in the last ${DAYS} days (since ${cutoff}) without icons...\n`);

  const { data: loggedFoods, error: logError } = await supabase
    .from('food_log')
    .select('food_library_id')
    .gte('logged_date', cutoff)
    .not('food_library_id', 'is', null);

  if (logError) { console.error('Log query error:', logError); process.exit(1); }

  const uniqueIds = [...new Set(loggedFoods.map(f => f.food_library_id))];
  console.log(`${uniqueIds.length} unique foods logged in last ${DAYS} days.`);

  const { data: missingIcons, error: libError } = await supabase
    .from('food_library')
    .select('id, name, unit, source')
    .in('id', uniqueIds)
    .is('image_url', null)
    .order('created_at', { ascending: false });

  if (libError) { console.error('Library query error:', libError); process.exit(1); }

  console.log(`${missingIcons.length} of those need icons.`);

  if (!missingIcons.length) { console.log('All recently-logged foods already have icons!'); return; }

  const batch = missingIcons.slice(0, BATCH_SIZE);
  console.log(`\nProcessing batch of ${batch.length} (of ${missingIcons.length} total):\n`);
  batch.forEach((f, i) => console.log(`  ${i + 1}. ${f.name}`));

  if (DRY_RUN) {
    console.log('\n--dry-run: stopping here (no images generated)');
    return;
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const results = [];

  for (let i = 0; i < batch.length; i++) {
    const food = batch[i];
    const slug = slugify(food.name);
    const localPath = `${OUTPUT_DIR}/${slug}.png`;

    process.stdout.write(`\n[${i + 1}/${batch.length}] ${food.name}...`);

    try {
      const t0 = Date.now();
      const rawImage = await generateImage(food.name);
      const resized = await resizeImage(rawImage);
      writeFileSync(localPath, resized);
      const genTime = ((Date.now() - t0) / 1000).toFixed(1);

      const publicUrl = await uploadToSupabase(slug, resized);
      await updateFoodLibrary(food.id, publicUrl);

      const totalTime = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(` done (gen: ${genTime}s, total: ${totalTime}s, ${(resized.length / 1024).toFixed(0)}KB)`);
      results.push({ name: food.name, slug, localPath, publicUrl, status: 'ok' });
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
      results.push({ name: food.name, slug, status: 'failed', error: err.message });
    }
  }

  console.log('\n\n--- Summary ---');
  const ok = results.filter(r => r.status === 'ok');
  const failed = results.filter(r => r.status === 'failed');
  console.log(`  Generated: ${ok.length}/${results.length}`);
  if (failed.length) {
    console.log(`  Failed:`);
    failed.forEach(f => console.log(`    - ${f.name}: ${f.error}`));
  }
  console.log(`  Uploaded to Supabase bucket: ${BUCKET}`);
  console.log(`  food_library.image_url updated for ${ok.length} foods`);
  console.log(`  Remaining: ${missingIcons.length - batch.length} foods still need icons`);
  console.log();
}

main().catch(e => { console.error('\nFatal:', e); process.exit(1); });
