import { GenerateContentResult } from '@google/generative-ai';

export async function withRetry(
  fn: () => Promise<GenerateContentResult>,
  maxRetries = 2
): Promise<GenerateContentResult> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const isRetryable =
        error instanceof Error &&
        ('status' in error) &&
        ((error as { status: number }).status === 503 || (error as { status: number }).status === 429);

      if (!isRetryable || attempt === maxRetries) throw error;

      const delay = 1000 * (attempt + 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Unreachable');
}
