# Session 4 — Pending Fixes (Not Yet Applied)

These fixes were identified by validation agents but NOT yet applied to SQL files.
Apply these next session.

## Beverages/Supplements Agent — 16 fixes needed (seed-part5.sql)

| # | Item | Old Values (Cal/P/C/F) | New Values (Cal/P/C/F/Fi) | Source |
|---|------|----------------------|--------------------------|--------|
| 1 | Chocolate Milk Amul | 78/3.2/11.0/2.5 | 109/3.8/17.0/2.9/0.5 | FatSecret India |
| 2 | Amul Kool Flavoured Milk | 72/3.0/10.5/2.0 | 89/3.0/12.5/2.5/0.0 | FatSecret India |
| 3 | Real Pomegranate Juice | 54/0.3/13.0/0.0 | 60/0.0/15.0/0.0/0.0 | FatSecret India |
| 4 | Paper Boat Aamras | 68/0.3/16.5/0.1 | 84/0.0/21.0/0.0/0.0 | MyNetDiary, PurpleKaddu |
| 5 | Hoegaarden | 45/0.5/4.5/0.0 | 45/0.5/3.5/0.0/0.0 | EatThisMuch (carbs 29% off) |
| 6 | Breezer Bacardi | 55/0.0/7.0/0.0 | 60/0.0/9.0/0.0/0.0 | Inlivo (carbs 29% off) |
| 7 | Isopure Whey Protein Isolate Chocolate | 367/84.4/4.4/1.1 | 333/76.0/3.0/1.0/1.0 | Multiple US sources |
| 8 | Nakpro Whey Protein | 390/78.1/6.3/3.1 | 395/70.3/16.2/5.4/0.5 | FatSecret India, Nakpro official |
| 9 | Alpino Peanut Butter | 600/27.0/19.0/47.0 | 645/30.0/18.0/49.0/6.0 | FatSecret India |
| 10 | Sundrop Peanut Butter Crunchy | 590/25.0/21.0/45.0 | 619/26.0/20.0/50.0/6.0 | FatSecret India, Amazon |
| 11 | MyFitness Peanut Butter Smooth | 597/28.1/18.8/46.9 | 625/28.0/18.0/49.0/5.0 | FatSecret India |
| 12 | RiteBite Max Protein Bar | 370/28.0/38.0/13.0 | 417/26.7/37.0/17.3/6.7 | Amazon India |
| 13 | Yoga Bar Protein Bar | 380/29.0/35.0/14.0 | 350/33.3/30.0/12.0/8.0 | NutriScan, FatSecret |
| 14 | Kissan Mixed Fruit Jam | 260/0.3/64.0/0.0 | 285/0.3/70.5/0.1/0.5 | NutriBit |
| 15 | Hersheys Chocolate Syrup | 290/2.0/66.0/1.5 | 276/1.0/65.0/0.5/1.0 | FatSecret India |
| 16 | Ensure Nutrition Shake | 100/4.2/13.0/3.5 | 105/3.8/16.9/2.5/0.5 | NutritionValue (Abbott) |

### Beverages validated as MATCH/CLOSE (no fix needed):
Tropicana Orange, B Natural Mixed Fruit, Red Bull, Monster, Kingfisher Premium/Ultra, Bira White/Blonde, Budweiser, Heineken, Corona, Tuborg, Carlsberg, Sula Chenin Blanc/Shiraz, Old Monk, Isopure Unflavoured, MuscleBlaze Whey, AS IT IS Whey, MuscleBlaze Protein Bar, Bournvita, Horlicks, Complan, Boost, Mapro Jam

## Snacks Agent — 17 fixes needed (seed-part5.sql)

| # | Item | Old Values (Cal/P/C/F) | New Values (Cal/P/C/F/Fi) | Source |
|---|------|----------------------|--------------------------|--------|
| 1 | Kurkure Masala Munch | 520/6.7/56.0/30.0 | 555/6.0/57.3/33.6/3.0 | FatSecret India |
| 2 | Kurkure Chilli Chatka | 518/6.5/56.5/29.5 | 558/5.6/56.2/34.5/3.2 | FatSecret India |
| 3 | Kurkure Green Chutney | 515/6.5/57.0/29.0 | 561/5.6/52.2/35.3/3.0 | FatSecret India |
| 4 | Bingo Mad Angles Achari Masti | 505/6.0/58.0/27.0 | 547/5.9/58.1/32.3/2.5 | FatSecret India |
| 5 | Bingo Mad Angles Tomato Madness | 500/6.0/59.0/26.5 | 545/6.2/58.4/31.8/2.5 | FatSecret India |
| 6 | Bingo Tedhe Medhe | 515/7.0/56.0/29.0 | 565/6.1/54.1/36.0/2.8 | FatSecret India |
| 7 | Too Yumm Multigrain Chips | 460/8.0/60.0/21.0 | 475/6.5/70.0/19.0/5.0 | FatSecret India |
| 8 | Haldirams Moong Dal | 479/24.0/43.0/28.0 | 479/21.7/52.9/20.1/7.5 | FatSecret India (Atwater fails on our values!) |
| 9 | Haldirams Navratan Mix | 505/10.0/50.0/29.5 | 522/17.0/46.0/30.0/14.0 | FatSecret India (protein 70% off!) |
| 10 | Haldirams Khatta Meetha | 480/9.0/55.0/25.0 | 530/9.3/57.4/29.3/3.5 | FatSecret India |
| 11 | Haldirams All in One | 510/10.5/49.0/30.0 | 536/13.7/48.0/32.2/1.1 | Haldirams official |
| 12 | Haldirams Nut Cracker | 530/12.0/46.0/33.0 | 634/20.0/26.0/50.0/4.5 | FatSecret India (EVERYTHING wrong) |
| 13 | Parle G | 462/6.5/73.0/16.0 | 454/6.9/77.3/13.0/1.5 | FatSecret India |
| 14 | Britannia NutriChoice Digestive | 460/8.0/64.0/19.0 | 450/6.0/60.0/22.0/6.0 | Nutribit |
| 15 | Unibic Cookies Choco Chip | 495/6.0/63.0/24.5 | 471/5.8/68.0/19.5/2.0 | FatSecret India |
| 16 | Act II Butter Popcorn | 475/7.0/52.0/27.0 | 449/9.0/66.0/19.0/8.5 | FatSecret India (UNCERTAIN — may be unpopped) |
| 17 | Act II Classic Salted | 460/7.5/55.0/24.0 | 507/10.0/60.0/26.0/9.0 | FatSecret India |

### UNCERTAIN fixes (need packaging verification):
- Bikano Bikaneri Bhujia: FatSecret has "Bikaji" not "Bikano" — 609/14.0/37.0/45.0/5.0
- Bikano Aloo Bhujia: sources vary wildly (452-633 cal) — 633/10.0/40.0/47.0/3.5
- Bikano Navratan Mix: 600/13.3/43.3/40.0/4.0

### Snacks validated as MATCH/CLOSE (no fix needed):
Lays Classic/American/Chile Limon, Uncle Chipps (2), Pringles (2), Balaji (2), Haldirams Aloo Bhujia (MATCH), Britannia Good Day Cashew (MATCH), Marie Gold, Bourbon, 50-50, NutriChoice Oats, Monaco, Krackjack, McVities, Unibic Cashew (borderline), Jim Jam, Tiger, Act II Cheese, Mars Bar

## ALL VALIDATION NOW COMPLETE
No remaining items to validate. All ~997 items have been checked across 4 sessions.

## Recommended next steps
1. Apply the 33 pending fixes from this file (16 beverages + 17 snacks)
2. Skip the 3 uncertain Bikano items (need actual packaging)
3. Run Atwater cross-check script on ALL 997 items as final safety net
4. Merge 6 seed files → run against Supabase → Step 4 DONE
5. Continue to Step 5: Gemini Flash integration
