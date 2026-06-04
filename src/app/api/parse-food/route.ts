import { NextRequest, NextResponse } from 'next/server';
import { flashModel, PARSE_SYSTEM_PROMPT } from '@/lib/gemini';
import { withRetry } from '@/lib/gemini-retry';

export async function POST(req: NextRequest) {
  try {
    const { text, currentHour } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const userMessage = currentHour != null
      ? `[current_hour: ${currentHour}]\n${text.trim()}`
      : text.trim();

    const result = await withRetry(() =>
      flashModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        systemInstruction: PARSE_SYSTEM_PROMPT,
      })
    );

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    if (!parsed.items || !Array.isArray(parsed.items)) {
      return NextResponse.json({ error: 'Invalid response from parser' }, { status: 502 });
    }

    // Canonicalize the quantity. When the user gives a weight for a liquid (e.g.
    // "150g buttermilk"), the model detects unit=ml but inconsistently emits the
    // amount under quantity_ml — or nulls quantity_g — losing the number. The
    // amount is unit-agnostic (densities ≈ 1, so grams↔ml map 1:1), so pull it
    // from whichever field the model used and always expose it as quantity_g.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parsed.items = parsed.items.map((it: any) => {
      const amount = [it.quantity_g, it.quantity_ml, it.quantity, it.amount]
        .map(Number)
        .find((n) => Number.isFinite(n) && n > 0);
      const unit = it.unit === 'ml' || it.unit === 'g' ? it.unit : 'g';
      return {
        name: it.name,
        quantity_g: amount ?? null,
        unit,
        meal_type: it.meal_type,
      };
    });

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error('parse-food error:', error);
    const status = (error instanceof Error && 'status' in error) ? (error as { status: number }).status : 500;
    const message = status === 503 || status === 429
      ? 'Gemini is busy — please try again in a moment'
      : 'Failed to parse food';
    return NextResponse.json({ error: message }, { status });
  }
}
