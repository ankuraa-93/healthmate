import re
import sys

# Parse all seed SQL files and validate calorie formula
# Expected: calories ≈ (protein × 4) + (carbs × 4) + (fat × 9)
# Flag items where deviation > 15%

pattern = re.compile(
    r"\('([^']+)'\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*'base'\s*,\s*'([gm][l]?)'\s*\)"
)

files = [f"seed-part{i}.sql" for i in range(1, 6)] + ["seed-part6-restaurant.sql"]
flagged = []
all_items = []

for fname in files:
    with open(fname) as f:
        content = f.read()

    for match in pattern.finditer(content):
        name = match.group(1)
        cal = float(match.group(2))
        protein = float(match.group(3))
        carbs = float(match.group(4))
        fat = float(match.group(5))
        fibre = float(match.group(6))
        serving = float(match.group(7))
        unit = match.group(8)

        # Atwater formula: cal = protein*4 + carbs*4 + fat*9
        # Fibre contributes ~2 cal/g (not 4), so adjust
        expected_cal = (protein * 4) + ((carbs - fibre) * 4) + (fibre * 2) + (fat * 9)

        all_items.append({
            'name': name, 'cal': cal, 'protein': protein, 'carbs': carbs,
            'fat': fat, 'fibre': fibre, 'expected': expected_cal, 'unit': unit,
            'serving': serving, 'source': fname
        })

        if expected_cal == 0:
            continue

        deviation = abs(cal - expected_cal) / expected_cal * 100

        if deviation > 15:
            flagged.append({
                'name': name,
                'declared_cal': cal,
                'expected_cal': round(expected_cal, 1),
                'deviation': round(deviation, 1),
                'protein': protein,
                'carbs': carbs,
                'fat': fat,
                'fibre': fibre,
                'source': fname
            })

print(f"Total items parsed: {len(all_items)}")
print(f"Items flagged (>15% deviation): {len(flagged)}")
print()

if flagged:
    # Sort by deviation descending
    flagged.sort(key=lambda x: x['deviation'], reverse=True)
    print(f"{'Food Name':<45} {'Declared':>8} {'Expected':>8} {'Dev%':>6}  Macros (P/C/F/Fi)")
    print("-" * 110)
    for item in flagged:
        print(f"{item['name']:<45} {item['declared_cal']:>8.0f} {item['expected_cal']:>8.1f} {item['deviation']:>5.1f}%  {item['protein']}/{item['carbs']}/{item['fat']}/{item['fibre']}  [{item['source']}]")
else:
    print("All items pass the calorie formula check!")

# Also flag any suspicious values
print("\n\n=== SUSPICIOUS VALUES CHECK ===")
print("\nItems with 0 calories:")
for item in all_items:
    if item['cal'] == 0:
        print(f"  {item['name']}")

print("\nItems with calories > 900 per 100g (only pure fat should be this high):")
for item in all_items:
    if item['cal'] > 900:
        print(f"  {item['name']}: {item['cal']} cal/100g")

print("\nItems where protein + carbs + fat > 100g per 100g (impossible):")
for item in all_items:
    total = item['protein'] + item['carbs'] + item['fat']
    if total > 105:  # small tolerance for rounding
        print(f"  {item['name']}: P:{item['protein']} + C:{item['carbs']} + F:{item['fat']} = {total:.1f}g")

print("\nItems with negative or zero macros where unexpected:")
for item in all_items:
    if item['protein'] < 0 or item['carbs'] < 0 or item['fat'] < 0:
        print(f"  {item['name']}: P:{item['protein']} C:{item['carbs']} F:{item['fat']}")
