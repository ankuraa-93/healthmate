import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const demoFoods = [
  'Buttered Toast', 'Sprouts Salad', 'Masala Chai',
  'Palak Paneer', 'Roti', 'Sev',
  'Banana', 'Almonds',
  'Oats with Milk', 'Boiled Eggs',
  'Rajma', 'Steamed Rice',
  'Grilled Chicken', 'Mixed Vegetable Salad',
  'Idli', 'Sambar',
  'Dal Tadka',
  'Apple',
  'Poha',
  'Chole', 'Bhature',
  'Peanut Butter Toast',
  'Veg Pulao',
];

const { data, error } = await supabase
  .from('food_library')
  .select('name, image_url')
  .in('name', demoFoods);

if (error) { console.error(error); process.exit(1); }

const found = new Map(data.map(r => [r.name, r.image_url]));

for (const name of demoFoods) {
  if (!found.has(name)) {
    console.log('NOT IN LIBRARY  ' + name);
  } else if (!found.get(name)) {
    console.log('NO ICON         ' + name);
  } else {
    console.log('HAS ICON        ' + name);
  }
}

const withIcon = data.filter(r => r.image_url).length;
const noIcon = data.filter(r => !r.image_url).length;
const notInLib = demoFoods.length - data.length;
console.log('\nTotal: ' + demoFoods.length + ' foods');
console.log('  ' + withIcon + ' with icons');
console.log('  ' + noIcon + ' in library but no icon');
console.log('  ' + notInLib + ' not in library at all');
