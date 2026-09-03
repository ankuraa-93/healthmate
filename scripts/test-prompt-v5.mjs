import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const API_KEY = env.GEMINI_API_KEY;
const MODEL = 'gemini-3.1-flash-image-preview';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const PROMPT = (name) =>
  `photorealistic 3D render of ${name}. If the food can be raw or cooked (rice, dal, pasta, oats, etc.), always show the COOKED version — only show raw if the name explicitly says "raw" or "uncooked". Clean product shot photographed in a pure white studio on a PURE WHITE (#FFFFFF) background — the background must be exactly #FFFFFF with zero grey, cream, or off-white tones. 3/4 view from a high 45-degree angle. Soft diffuse studio lighting from the top-left. Very subtle, soft cast shadow directly underneath the food only — shadow must not darken or tint the white background. Slightly desaturated natural colors, warm neutral tones. No text, no labels, no other objects, no packaging. Clean, minimal, premium aesthetic.`;

// 3 cooked-vs-raw test foods + 2 variety
const foods = [
  'Steamed Rice',
  'Dal Tadka',
  'Oats with Milk',
  'Egg Bhurji',
  'Ghee Roti',
];

const OUT = 'food-icon-test-prompt/v5';
mkdirSync(OUT, { recursive: true });

async function sampleCorners(pngBuffer) {
  const { data, info } = await sharp(pngBuffer).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, ch = info.channels;
  const regions = [
    { name: 'top-left', x0: 0, y0: 0, x1: 5, y1: 5 },
    { name: 'top-right', x0: w - 5, y0: 0, x1: w, y1: 5 },
    { name: 'bottom-left', x0: 0, y0: h - 5, x1: 5, y1: h },
    { name: 'bottom-right', x0: w - 5, y0: h - 5, x1: w, y1: h },
  ];
  let totalR = 0, totalG = 0, totalB = 0, count = 0;
  for (const r of regions) {
    for (let y = r.y0; y < r.y1; y++) {
      for (let x = r.x0; x < r.x1; x++) {
        const idx = (y * w + x) * ch;
        totalR += data[idx]; totalG += data[idx + 1]; totalB += data[idx + 2];
        count++;
      }
    }
  }
  return {
    r: Math.round(totalR / count),
    g: Math.round(totalG / count),
    b: Math.round(totalB / count),
  };
}

const results = [];

for (let i = 0; i < foods.length; i++) {
  const name = foods[i];
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  process.stdout.write(`[${i + 1}/${foods.length}] ${name}...`);
  const t0 = Date.now();

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: PROMPT(name) }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: { aspectRatio: '1:1' },
      },
    }),
  });

  const data = await res.json();
  if (data.error) { console.log(` ERROR: ${data.error.message}`); results.push({ name, error: data.error.message }); continue; }

  const imgPart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!imgPart) { console.log(' no image in response'); results.push({ name, error: 'no image' }); continue; }

  const raw = Buffer.from(imgPart.inlineData.data, 'base64');
  const resized = await sharp(raw).resize(256, 256, { fit: 'cover' }).png().toBuffer();
  writeFileSync(`${OUT}/${slug}.png`, resized);

  const corners = await sampleCorners(resized);
  const dist = Math.sqrt((255 - corners.r) ** 2 + (255 - corners.g) ** 2 + (255 - corners.b) ** 2);
  const perfect = corners.r === 255 && corners.g === 255 && corners.b === 255;

  console.log(` done (${((Date.now() - t0) / 1000).toFixed(1)}s) — corners: (${corners.r},${corners.g},${corners.b}) dist=${dist.toFixed(1)} ${perfect ? '✓ PERFECT' : ''}`);
  results.push({ name, corners, dist, perfect });
}

console.log('\n\n=== V5 Prompt Test Summary ===');
const valid = results.filter(r => r.corners);
const perfectCount = valid.filter(r => r.perfect).length;
const avgR = Math.round(valid.reduce((s, r) => s + r.corners.r, 0) / valid.length);
const avgG = Math.round(valid.reduce((s, r) => s + r.corners.g, 0) / valid.length);
const avgB = Math.round(valid.reduce((s, r) => s + r.corners.b, 0) / valid.length);
const avgDist = (valid.reduce((s, r) => s + r.dist, 0) / valid.length).toFixed(1);

console.log(`Perfect white: ${perfectCount}/${valid.length}`);
console.log(`Avg corner RGB: (${avgR}, ${avgG}, ${avgB})`);
console.log(`Avg distance from white: ${avgDist}`);
console.log(`\nPer-food:`);
for (const r of results) {
  if (r.error) { console.log(`  ${r.name}: ERROR — ${r.error}`); continue; }
  console.log(`  ${r.name}: (${r.corners.r},${r.corners.g},${r.corners.b}) dist=${r.dist.toFixed(1)} ${r.perfect ? '✓' : ''}`);
}
console.log(`\nImages saved to ${OUT}/`);
