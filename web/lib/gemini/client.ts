/**
 * Gemini AI client wrapper
 * Server-side only - API key is never exposed to client
 */

import { GoogleGenAI } from '@google/genai';

// Model to use for synopsis generation
const GEMINI_MODEL = 'gemini-3-flash-preview';

/**
 * Get the Gemini client instance
 * Returns null if GEMINI_API_KEY is not configured (graceful fallback)
 */
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(
      'GEMINI_API_KEY environment variable is not set. ' +
        'AI synopsis generation will fall back to truncated TMDB overviews.'
    );
    return null;
  }

  return new GoogleGenAI({ apiKey });
}

/**
 * Generate a spoiler-free synopsis for a TV episode
 *
 * @param showName - Name of the TV show
 * @param seasonNumber - Season number
 * @param episodeNumber - Episode number
 * @param episodeName - Episode title
 * @param overview - TMDB episode overview (may contain spoilers)
 * @returns Generated spoiler-free synopsis or null on error
 */
export async function generateEpisodeSynopsis(
  showName: string,
  seasonNumber: number,
  episodeNumber: number,
  episodeName: string,
  overview: string
): Promise<string | null> {
  const client = getGeminiClient();

  if (!client) {
    return null;
  }

  const prompt = `You are creating a spoiler-free TV episode synopsis for a family TV guide app.

Show: ${showName}
Season ${seasonNumber}, Episode ${episodeNumber}: "${episodeName}"

Original overview (may contain spoilers):
${overview}

Create a spoiler-free 2-3 sentence synopsis for this TV episode. Focus on setup and tone without revealing plot twists or endings. Keep it family-friendly and engaging. Do not mention that you're avoiding spoilers - just write the synopsis directly.`;

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      console.error('Gemini returned empty response');
      return null;
    }

    return text;
  } catch (error) {
    console.error('Gemini synopsis generation failed:', error);
    return null;
  }
}
