import { NextRequest, NextResponse } from 'next/server';

// Plain speech-to-text (Groq Whisper) with no downstream parsing — used by the
// goal-personalization activity field, where the transcript is free-form text
// about workouts rather than food. Mirrors /api/parse-food-audio's Whisper call.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }
    if (audioFile.size < 100) {
      return NextResponse.json({ error: 'Audio recording too short — try again' }, { status: 400 });
    }

    const audioBytes = await audioFile.arrayBuffer();
    const mimeType = audioFile.type || 'audio/webm';
    const ext = mimeType.includes('mp4') ? 'm4a' : mimeType.includes('ogg') ? 'ogg' : 'webm';
    const audioBlob = new Blob([audioBytes], { type: mimeType });

    const groqForm = new FormData();
    groqForm.append('file', audioBlob, `audio.${ext}`);
    groqForm.append('model', 'whisper-large-v3');
    groqForm.append('language', 'en');
    groqForm.append('temperature', '0');
    // Sport/exercise word list biases recognition toward activity vocabulary.
    groqForm.append('prompt', 'weightlifting, strength training, gym, resistance training, deadlift, squat, bench press, cardio, running, jogging, cycling, swimming, yoga, pilates, HIIT, CrossFit, badminton, table tennis, pickleball, tennis, squash, cricket, football, basketball, walking, hiking, trainer, academy, sessions, per week');

    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: groqForm,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Groq Whisper error:', res.status, err);
      return NextResponse.json(
        { error: res.status === 429 ? 'Too many requests — wait a moment' : 'Transcription failed' },
        { status: res.status },
      );
    }

    const { text } = await res.json();
    const transcript = text?.trim();

    if (!transcript) {
      return NextResponse.json({ error: 'Could not recognize speech' }, { status: 502 });
    }

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('transcribe error:', error);
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }
}
