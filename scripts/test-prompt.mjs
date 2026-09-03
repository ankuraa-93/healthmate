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

const foods = [
  'Kesar Ghewar',
  'Chicken Stroganoff',
  'Iced Mocha Latte',
  'Korean Chilli Chicken Balls',
  'Bhindi Aloo Sabzi',
];

const OUT = 'food-icon-test-prompt';
mkdirSync(OUT, { recursive: true });

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

  console.log(` done (${((Date.now() - t0) / 1000).toFixed(1)}s, ${(resized.length / 1024).toFixed(0)}KB)`);
}

console.log(`\nSaved to ${OUT}/`);
