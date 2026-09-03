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
const LIMIT = parseInt(process.argv[2] || '20', 10);
const DRY_RUN = process.argv.includes('--dry-run');
const UPLOAD = process.argv.includes('--upload');
const UPLOAD_ONLY = process.argv.includes('--upload-only');

const PROMPT_TEMPLATE = (foodName) =>
  `photorealistic 3D render of ${foodName}. If the food can be raw or cooked (rice, dal, pasta, oats, etc.), always show the COOKED version — only show raw if the name explicitly says "raw" or "uncooked". Clean product shot photographed in a pure white studio on a PURE WHITE (#FFFFFF) background — the background must be exactly #FFFFFF with zero grey, cream, or off-white tones. 3/4 view from a high 45-degree angle. Soft diffuse studio lighting from the top-left. Very subtle, soft cast shadow directly underneath the food only — shadow must not darken or tint the white background. Slightly desaturated natural colors, warm neutral tones. No text, no labels, no other objects, no packaging. Clean, minimal, premium aesthetic.`;

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
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, pngBuffer, {
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
  console.log(`\n🔍 Fetching ${LIMIT} foods without icons...\n`);

  const { data: foods, error } = await supabase
    .from('food_library')
    .select('id, name, unit, source')
    .is('image_url', null)
    .order('created_at', { ascending: false })
    .limit(LIMIT);

  if (error) { console.error('DB error:', error); process.exit(1); }
  if (!foods.length) { console.log('All foods already have icons!'); return; }

  console.log(`Found ${foods.length} foods to process:\n`);
  foods.forEach((f, i) => console.log(`  ${i + 1}. ${f.name}`));

  if (DRY_RUN) {
    console.log('\n--dry-run: stopping here (no images generated)');
    return;
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const results = [];

  for (let i = 0; i < foods.length; i++) {
    const food = foods[i];
    const slug = slugify(food.name);
    const localPath = `${OUTPUT_DIR}/${slug}.png`;

    process.stdout.write(`\n[${i + 1}/${foods.length}] ${food.name}...`);

    try {
      const t0 = Date.now();
      let resized;

      if (UPLOAD_ONLY) {
        if (!existsSync(localPath)) {
          console.log(` SKIPPED (no local file)`);
          results.push({ name: food.name, slug, status: 'failed', error: 'no local file' });
          continue;
        }
        resized = readFileSync(localPath);
      } else {
        const rawImage = await generateImage(food.name);
        resized = await resizeImage(rawImage);
        writeFileSync(localPath, resized);
      }

      const genTime = ((Date.now() - t0) / 1000).toFixed(1);

      let publicUrl = null;
      if (UPLOAD || UPLOAD_ONLY) {
        publicUrl = await uploadToSupabase(slug, resized);
        await updateFoodLibrary(food.id, publicUrl);
      }

      const totalTime = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(` done (${UPLOAD_ONLY ? 'upload' : 'gen'}: ${genTime}s, total: ${totalTime}s, ${(resized.length / 1024).toFixed(0)}KB)`);

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
  console.log(`\n  Local files saved to: ${OUTPUT_DIR}/`);
  if (UPLOAD) {
    console.log(`  Uploaded to Supabase bucket: ${BUCKET}`);
    console.log(`  food_library.image_url updated for ${ok.length} foods`);
  } else {
    console.log(`  To upload to Supabase and update DB, re-run with --upload`);
  }
  console.log();
}

main().catch(e => { console.error('\nFatal:', e); process.exit(1); });
