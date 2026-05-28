# Branded Food Validation — COMPLETE

## Final status
- **994 food items** across 6 seed SQL files (seed-part1 through seed-part6-restaurant)
- 3 uncommon items removed (Milky Mist Whipping Cream, Rich's Non Dairy Cream, Epigamia Snack Pack Mango)
- **ALL branded items validated** across 5 sessions
- **114 items fixed total** (9 session 1, 17 session 2, 23 session 3, 27 session 4, 38 session 5)
- Atwater calorie formula validation passed on all 994 items
- Only expected deviations: alcohol (ethanol calories), tea/coffee (negligible cal), raw produce (15-20% on low-cal items)

## Session 5 fixes (2026-05-28) — 38 items

### Pending fixes applied from session4-pending-fixes.md — 33 items

#### Snacks (seed-part5.sql) — 17 fixes
| Item | Old Cal | New Cal | Key Issue |
|------|---------|---------|-----------|
| Kurkure Masala Munch | 520 | 555 | Fat 12% off |
| Kurkure Chilli Chatka | 518 | 558 | Fat 17% off |
| Kurkure Green Chutney | 515 | 561 | Fat 22% off |
| Bingo Mad Angles Achari Masti | 505 | 547 | Fat 20% off |
| Bingo Mad Angles Tomato Madness | 500 | 545 | Fat 20% off |
| Bingo Tedhe Medhe | 515 | 565 | Fat 24% off |
| Too Yumm Multigrain Chips | 460 | 475 | Carbs 17% off |
| Haldirams Moong Dal | 479 | 479 | Protein/carbs/fat all off, cal same |
| Haldirams Navratan Mix | 505 | 522 | Protein 70% off |
| Haldirams Khatta Meetha | 480 | 530 | Cal 10% off, fat 17% off |
| Haldirams All in One | 510 | 536 | Protein 30% off |
| Haldirams Nut Cracker | 530 | 634 | Everything wrong |
| Parle G | 462 | 454 | Fat 23% off |
| Britannia NutriChoice Digestive | 460 | 450 | Protein/carbs/fat all off |
| Unibic Cookies Choco Chip | 495 | 471 | Fat 26% off |
| Act II Butter Popcorn | 475 | 449 | Fat/carbs off (uncertain — may be unpopped) |
| Act II Classic Salted | 460 | 507 | Cal 10% off |

#### Beverages & Supplements (seed-part5.sql) — 16 fixes
| Item | Old Cal | New Cal | Key Issue |
|------|---------|---------|-----------|
| Chocolate Milk Amul | 78 | 109 | Cal 40% off, carbs 55% off |
| Amul Kool Flavoured Milk | 72 | 89 | Cal 24% off |
| Real Pomegranate Juice | 54 | 60 | Carbs 15% off |
| Paper Boat Aamras | 68 | 84 | Cal 24% off |
| Hoegaarden | 45 | 45 | Carbs 29% off |
| Breezer Bacardi | 55 | 60 | Carbs 29% off |
| Isopure Whey Protein Chocolate | 367 | 333 | Protein/cal off |
| Nakpro Whey Protein | 390 | 395 | Carbs 157% off |
| Alpino Peanut Butter | 600 | 645 | Cal 8% off, fat off |
| Sundrop Peanut Butter Crunchy | 590 | 619 | Cal 5% off, fat 11% off |
| MyFitness Peanut Butter Smooth | 597 | 625 | Cal 5% off, fat off |
| RiteBite Max Protein Bar | 370 | 417 | Cal 13% off, fat 33% off |
| Yoga Bar Protein Bar | 380 | 350 | Cal 9% off, protein 15% off |
| Kissan Mixed Fruit Jam | 260 | 285 | Carbs 10% off |
| Hersheys Chocolate Syrup | 290 | 276 | Fat 200% off |
| Ensure Nutrition Shake | 100 | 105 | Carbs 30% off |

### Packaging label fixes (from user photos) — 5 items

#### seed-part5.sql — 3 fixes
| Item | Old Cal | New Cal | Source |
|------|---------|---------|--------|
| Bikano Aloo Bhujia | 538 | 624 | Actual packaging label |
| Bikano Bikaneri Bhujia | 555 | 610 | Actual packaging label |
| Bikano Navratan Mix | 500 | 590 | Actual packaging label |

#### seed-part4.sql — 2 fixes
| Item | Old Cal | New Cal | Source |
|------|---------|---------|--------|
| Nestle a+ Greek Yogurt Plain | 57 | 65 | Actual packaging label |
| Britannia Cheese Block | 328 | 313 | Actual packaging label |

### Items removed — 3
- Milky Mist Whipping Cream (uncommon)
- Rich's Non Dairy Cream (uncommon)
- Epigamia Snack Pack Mango (uncommon combo product)

## Key patterns found (all sessions)
1. Full cream milks: 3.5% fat → 6% (FSSAI classification)
2. Buttermilk: all three brands massively wrong (cal, protein, fat all too low)
3. Paneer brands: carbs underestimated, Chitale worst (275→346 cal)
4. Yogurts: Mishti Doi and Fruit Yogurt both ~39% low on calories
5. Greek yogurt: fat percentages inconsistent
6. RTE rich curries: fat underestimated ~2x (butter/cream/ghee)
7. Dry mixes: fat often overestimated (grain-based mixes have very little oil)
8. Licious frozen products: our values consistently too high (may have used cooked values for raw/frozen)
9. Chocolate/biscuit fat overestimated
10. Instant noodles underestimated
11. Kurkure/Bingo snacks: fat consistently underestimated (~20-25% low)
12. Bikano namkeen: massively wrong — fat underestimated by 30-50% across all 3 products
13. Peanut butter brands: fat underestimated by 5-10%
14. Amul flavoured milks: cal 24-40% underestimated

## Next steps (next session)
1. Merge all 6 seed files into one final SQL
2. Run against Supabase to populate food_library table
3. Mark Step 4 complete in progress.md
4. Continue to Step 5: Gemini Flash integration
