import { GenerateContentResult } from '@google/generative-ai';

export async function withRetry(
  fn: () => Promise<GenerateContentResult>,
  maxRetries = 3
): Promise<GenerateContentResult> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const status = (error instanceof Error && 'status' in error)
        ? (error as { status: number }).status
        : 0;
      const isRetryable = status === 429 || status === 500 || status === 503;

      if (!isRetryable || attempt === maxRetries) throw error;

      const delay = 1000 * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Unreachable');
}
