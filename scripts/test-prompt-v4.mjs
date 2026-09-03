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
  `photorealistic 3D render of ${name}. Clean product shot photographed in a pure white studio on a PURE WHITE (#FFFFFF) background — the background must be exactly #FFFFFF with zero grey, cream, or off-white tones. 3/4 view from a high 45-degree angle. Soft diffuse studio lighting from the top-left. Very subtle, soft cast shadow directly underneath the food only — shadow must not darken or tint the white background. Slightly desaturated natural colors, warm neutral tones. No text, no labels, no other objects, no packaging. Clean, minimal, premium aesthetic.`;

const foods = [
  'Apple',
  'Masala Chai',
  'Samosa',
  'Chicken Masala',
  'Kali Masoor Dal',
];

const OUT = 'food-icon-test-prompt/v4';
mkdirSync(OUT, { recursive: true });

async function analyzeCorners(imgBuffer, size = 256) {
  const { data } = await sharp(imgBuffer).raw().toBuffer({ resolveWithObject: true });
  const corners = [
    { name: 'top-left', startX: 0, startY: 0 },
    { name: 'top-right', startX: size - 5, startY: 0 },
    { name: 'bottom-left', startX: 0, startY: size - 5 },
    { name: 'bottom-right', startX: size - 5, startY: size - 5 },
  ];
  const results = {};
  for (const corner of corners) {
    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    for (let y = corner.startY; y < corner.startY + 5; y++) {
      for (let x = corner.startX; x < corner.startX + 5; x++) {
        const idx = (y * size + x) * 3;
        rSum += data[idx];
        gSum += data[idx + 1];
        bSum += data[idx + 2];
        count++;
      }
    }
    results[corner.name] = {
      r: Math.round(rSum / count),
      g: Math.round(gSum / count),
      b: Math.round(bSum / count),
    };
  }
  const allR = Object.values(results).reduce((s, c) => s + c.r, 0) / 4;
  const allG = Object.values(results).reduce((s, c) => s + c.g, 0) / 4;
  const allB = Object.values(results).reduce((s, c) => s + c.b, 0) / 4;
  return {
    corners: results,
    avg: { r: Math.round(allR), g: Math.round(allG), b: Math.round(allB) },
    isPerfectWhite: Math.round(allR) === 255 && Math.round(allG) === 255 && Math.round(allB) === 255,
    distFromWhite: Math.sqrt((255 - allR) ** 2 + (255 - allG) ** 2 + (255 - allB) ** 2),
  };
}

const allResults = [];

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
  if (data.error) { console.log(` ERROR: ${data.error.message}`); continue; }

  const imgPart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!imgPart) { console.log(' no image in response'); continue; }

  const raw = Buffer.from(imgPart.inlineData.data, 'base64');
  const resized = await sharp(raw).resize(256, 256, { fit: 'cover' }).png().toBuffer();
  writeFileSync(`${OUT}/${slug}.png`, resized);

  const analysis = await analyzeCorners(resized);
  allResults.push({ name, ...analysis });

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(` done (${elapsed}s) — avg corner: (${analysis.avg.r},${analysis.avg.g},${analysis.avg.b}) ${analysis.isPerfectWhite ? '✓ PERFECT WHITE' : `✗ dist=${analysis.distFromWhite.toFixed(1)}`}`);
}

console.log('\n=== SUMMARY ===');
const perfectCount = allResults.filter(r => r.isPerfectWhite).length;
const overallR = allResults.reduce((s, r) => s + r.avg.r, 0) / allResults.length;
const overallG = allResults.reduce((s, r) => s + r.avg.g, 0) / allResults.length;
const overallB = allResults.reduce((s, r) => s + r.avg.b, 0) / allResults.length;
const overallDist = Math.sqrt((255 - overallR) ** 2 + (255 - overallG) ** 2 + (255 - overallB) ** 2);

console.log(`Perfect white: ${perfectCount}/${allResults.length}`);
console.log(`Overall avg corner RGB: (${Math.round(overallR)}, ${Math.round(overallG)}, ${Math.round(overallB)})`);
console.log(`Overall distance from white: ${overallDist.toFixed(1)}`);
console.log(`\nPer-food breakdown:`);
for (const r of allResults) {
  console.log(`  ${r.name}: (${r.avg.r},${r.avg.g},${r.avg.b}) dist=${r.distFromWhite.toFixed(1)} ${r.isPerfectWhite ? '✓' : '✗'}`);
}
console.log(`\nImages saved to ${OUT}/`);
