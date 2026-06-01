import { NextRequest, NextResponse } from 'next/server';
import { flashModelVision, PARSE_IMAGE_SYSTEM_PROMPT } from '@/lib/gemini';
import { withRetry } from '@/lib/gemini-retry';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType, mealType, currentHour } = await req.json();

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'Image (base64) is required' }, { status: 400 });
    }

    const userText = [
      mealType ? `meal_type: ${mealType}` : null,
      currentHour != null ? `current_hour: ${currentHour}` : null,
      'Identify all food items in this photo.',
    ].filter(Boolean).join('\n');

    const result = await withRetry(() =>
      flashModelVision.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: image,
                },
              },
              { text: userText },
            ],
          },
        ],
        systemInstruction: PARSE_IMAGE_SYSTEM_PROMPT,
      })
    );

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    if (!parsed.items || !Array.isArray(parsed.items)) {
      return NextResponse.json({ error: 'Invalid response from image parser' }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error('parse-food-image error:', error);
    const status = (error instanceof Error && 'status' in error) ? (error as { status: number }).status : 500;
    const message = status === 503 || status === 429
      ? 'Gemini is busy — please try again in a moment'
      : 'Failed to analyze image';
    return NextResponse.json({ error: message }, { status });
  }
}
