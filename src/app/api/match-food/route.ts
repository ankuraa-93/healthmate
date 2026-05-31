import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { flashModel, flashModelWithSearch, MATCH_SYSTEM_PROMPT, SEARCH_NUTRITION_PROMPT } from '@/lib/gemini';
import { withRetry } from '@/lib/gemini-retry';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface ParsedItem {
  name: string;
  quantity_g: number;
  unit: 'g' | 'ml';
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json() as { items: ParsedItem[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    const supabase = getSupabase();

    const itemsWithCandidates = await Promise.all(
      items.map(async (item) => {
        const { data, error } = await supabase.rpc('search_food_library', {
          search_term: item.name,
          max_results: 5,
        });

        if (error) {
          console.error('Fuzzy search error for', item.name, error);
        }

        return {
          ...item,
          candidates: data ?? [],
        };
      })
    );

    const result = await withRetry(() =>
      flashModel.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: JSON.stringify({ items: itemsWithCandidates }) }],
          },
        ],
        systemInstruction: MATCH_SYSTEM_PROMPT,
      })
    );

    const responseText = result.response.text();
    const matched = JSON.parse(responseText);

    if (!matched.items || !Array.isArray(matched.items)) {
      return NextResponse.json({ error: 'Invalid response from matcher' }, { status: 502 });
    }

    interface MatchedItem {
      name: string;
      matched_library_id: string | null;
      matched_library_name: string | null;
      quantity_g: number;
      unit: string;
      meal_type: string;
      calories_per_100g: number;
      protein_per_100g: number;
      carbs_per_100g: number;
      fat_per_100g: number;
      fibre_per_100g: number;
      image_url?: string | null;
    }

    function atwaterCheck(item: MatchedItem): { expected: number; actual: number; deviation: number } {
      const p = item.protein_per_100g;
      const c = item.carbs_per_100g;
      const f = item.fat_per_100g;
      const fi = item.fibre_per_100g;
      const expected = p * 4 + (c - fi) * 4 + fi * 2 + f * 9;
      const actual = item.calories_per_100g;
      const deviation = actual > 0 ? Math.abs(expected - actual) / actual : 0;
      return { expected: Math.round(expected), actual: Math.round(actual), deviation };
    }

    interface SearchNutrition {
      name: string;
      calories_per_100g: number;
      protein_per_100g?: number;
      carbs_per_100g?: number;
      fat_per_100g?: number;
      fibre_per_100g?: number;
    }

    async function searchNutrition(prompt: string): Promise<SearchNutrition[]> {
      const searchResult = await withRetry(() =>
        flashModelWithSearch.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: SEARCH_NUTRITION_PROMPT,
        })
      );
      const searchText = searchResult.response.text();
      const jsonMatch = searchText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return [];
      const searchData = JSON.parse(jsonMatch[0]);
      return searchData.items && Array.isArray(searchData.items) ? searchData.items : [];
    }

    function applySearchResults(targets: MatchedItem[], results: SearchNutrition[]) {
      for (const searchItem of results) {
        const target = targets.find(
          i => i.name.toLowerCase() === searchItem.name.toLowerCase()
        );
        if (target && searchItem.calories_per_100g) {
          target.calories_per_100g = searchItem.calories_per_100g;
          target.protein_per_100g = searchItem.protein_per_100g ?? target.protein_per_100g;
          target.carbs_per_100g = searchItem.carbs_per_100g ?? target.carbs_per_100g;
          target.fat_per_100g = searchItem.fat_per_100g ?? target.fat_per_100g;
          target.fibre_per_100g = searchItem.fibre_per_100g ?? target.fibre_per_100g;
        }
      }
    }

    // Separate matched vs unmatched items
    const matchedItems: MatchedItem[] = matched.items;
    const unmatchedItems = matchedItems.filter(item => !item.matched_library_id);

    // For unmatched items, search the web for real nutrition data
    if (unmatchedItems.length > 0) {
      try {
        const searchPrompt = unmatchedItems.map(i => i.name).join(', ');
        const firstResults = await searchNutrition(`Find nutrition info per 100g for: ${searchPrompt}`);
        applySearchResults(unmatchedItems, firstResults);

        // Atwater validation — retry items that fail
        const failedItems = unmatchedItems.filter(item => {
          const { deviation } = atwaterCheck(item);
          return deviation > 0.15;
        });

        if (failedItems.length > 0) {
          const retryDetails = failedItems.map(item => {
            const { expected, actual, deviation } = atwaterCheck(item);
            return `"${item.name}": you reported ${actual} cal but macros (P:${item.protein_per_100g} C:${item.carbs_per_100g} F:${item.fat_per_100g} Fi:${item.fibre_per_100g}) add up to ${expected} cal (${(deviation * 100).toFixed(0)}% off)`;
          }).join('; ');

          console.warn(`Atwater retry for: ${retryDetails}`);

          const retryPrompt = `The nutrition data you found earlier has errors — the macros don't match the calories (Atwater formula: Cal ≈ P×4 + (C−Fi)×4 + Fi×2 + F×9). Please search again more carefully for: ${failedItems.map(i => i.name).join(', ')}. Previous errors: ${retryDetails}`;
          const retryResults = await searchNutrition(retryPrompt);
          applySearchResults(failedItems, retryResults);

          // Log any items that still fail after retry
          for (const item of failedItems) {
            const { expected, actual, deviation } = atwaterCheck(item);
            if (deviation > 0.15) {
              console.warn(`Atwater still failing for "${item.name}" after retry: reported ${actual} cal, expected ~${expected} cal (${(deviation * 100).toFixed(0)}% off). Using as-is.`);
            }
          }
        }
      } catch (searchError) {
        console.error('Web search nutrition lookup failed, using LLM estimates:', searchError);
      }

    }

    // For matched items, fetch image_url from food_library
    const matchedWithImages = matchedItems.filter(item => item.matched_library_id);
    if (matchedWithImages.length > 0) {
      const ids = matchedWithImages.map(i => i.matched_library_id!);
      const { data: libRows } = await supabase
        .from('food_library')
        .select('id, image_url')
        .in('id', ids);
      if (libRows) {
        const imageMap = new Map(libRows.map(r => [r.id, r.image_url]));
        for (const item of matchedWithImages) {
          item.image_url = imageMap.get(item.matched_library_id!) ?? null;
        }
      }
    }

    // Insert unmatched items into food_library
    const finalItems = await Promise.all(
      matchedItems.map(async (item) => {
        if (item.matched_library_id) {
          return item;
        }

        const source = unmatchedItems.includes(item) ? 'web_search' : 'llm_estimate';
        const { data: newFood, error } = await supabase
          .from('food_library')
          .upsert(
            {
              name: item.name,
              calories_per_100g: item.calories_per_100g,
              protein_per_100g: item.protein_per_100g,
              carbs_per_100g: item.carbs_per_100g,
              fat_per_100g: item.fat_per_100g,
              fibre_per_100g: item.fibre_per_100g,
              serving_size_g: item.quantity_g,
              source,
              unit: item.unit,
              image_url: item.image_url ?? null,
            },
            { onConflict: 'name' }
          )
          .select('id, image_url')
          .single();

        if (error) {
          console.error('Insert food_library error:', error);
          return item;
        }

        return {
          ...item,
          matched_library_id: newFood.id,
          matched_library_name: item.name,
          image_url: newFood.image_url ?? item.image_url ?? null,
        };
      })
    );

    const sanitizedItems = finalItems.map(item => ({
      ...item,
      calories_per_100g: item.calories_per_100g ?? 0,
      protein_per_100g: item.protein_per_100g ?? 0,
      carbs_per_100g: item.carbs_per_100g ?? 0,
      fat_per_100g: item.fat_per_100g ?? 0,
      fibre_per_100g: item.fibre_per_100g ?? 0,
      image_url: item.image_url ?? null,
    }));

    return NextResponse.json({ items: sanitizedItems });
  } catch (error) {
    console.error('match-food error:', error);
    return NextResponse.json({ error: 'Failed to match food' }, { status: 500 });
  }
}
