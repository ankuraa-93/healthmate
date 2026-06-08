'use client';

import { useCallback, useRef, useState } from 'react';

function getAudioMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  for (const type of ['audio/webm', 'audio/mp4', 'audio/ogg']) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}

interface VoiceInputOptions {
  endpoint?: string; // defaults to plain transcription
  onTranscript: (text: string) => void;
  onError?: (message: string) => void;
}

/**
 * MediaRecorder → server transcription, factored out of AddFoodSheet so any
 * field can offer the same mic. Posts the recording to `endpoint` (default
 * /api/transcribe) and hands the resulting transcript back to the caller.
 */
export function useVoiceInput({ endpoint = '/api/transcribe', onTranscript, onError }: VoiceInputOptions) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const supported =
    typeof window !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    getAudioMimeType() !== '';

  const process = useCallback(async (blob: Blob) => {
    setTranscribing(true);
    try {
      const fd = new FormData();
      fd.append('audio', blob);
      const res = await fetch(endpoint, { method: 'POST', body: fd });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Transcription failed');
      const { transcript } = await res.json();
      if (!transcript) {
        onError?.('Could not recognize speech — try again');
        return;
      }
      onTranscript(transcript);
    } catch (e) {
      onError?.(e instanceof Error ? e.message : 'Voice input failed');
    } finally {
      setTranscribing(false);
    }
  }, [endpoint, onTranscript, onError]);

  const start = useCallback(async () => {
    if (recorderRef.current?.state === 'recording') return;
    try {
      let stream = streamRef.current;
      if (!stream || !stream.active) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        streamRef.current = stream;
      }
      const mimeType = getAudioMimeType();
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        audioBitsPerSecond: 128000,
      });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        await process(new Blob(chunksRef.current, { type: mimeType || 'audio/webm' }));
      };
      recorder.start(250);
      recorderRef.current = recorder;
      setRecording(true);
    } catch (e) {
      console.error('Mic error:', e);
      onError?.('Microphone access denied');
    }
  }, [process, onError]);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    setRecording(false);
  }, []);

  const toggle = useCallback(() => {
    if (recording) stop(); else start();
  }, [recording, start, stop]);

  return { recording, transcribing, supported, toggle };
}
