import { NextRequest, NextResponse } from 'next/server';
import { flashModel, ACTIVITY_ESTIMATE_PROMPT } from '@/lib/gemini';
import { withRetry } from '@/lib/gemini-retry';

// Estimates a TDEE activity factor + resistance-training flag from a free-text
// description of someone's weekly activity, and extracts structured workouts.
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Activity description is required' }, { status: 400 });
    }

    const result = await withRetry(() =>
      flashModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: text.trim() }] }],
        systemInstruction: ACTIVITY_ESTIMATE_PROMPT,
      })
    );

    const parsed = JSON.parse(result.response.text());

    // Clamp the factor to the valid Mifflin–St Jeor activity range so a stray
    // model value can never blow up the calorie estimate downstream.
    const factor = Number(parsed.activity_factor);
    const activity_factor = Number.isFinite(factor)
      ? Math.min(1.9, Math.max(1.2, factor))
      : 1.2;

    const workouts = Array.isArray(parsed.workouts) ? parsed.workouts : [];

    return NextResponse.json({
      activity_factor,
      does_resistance_training: !!parsed.does_resistance_training,
      rationale: typeof parsed.rationale === 'string' ? parsed.rationale : '',
      workouts,
    });
  } catch (error: unknown) {
    console.error('estimate-activity error:', error);
    const status = (error instanceof Error && 'status' in error) ? (error as { status: number }).status : 500;
    const message = status === 503 || status === 429
      ? 'Gemini is busy — please try again in a moment'
      : 'Failed to estimate activity';
    return NextResponse.json({ error: message }, { status });
  }
}
