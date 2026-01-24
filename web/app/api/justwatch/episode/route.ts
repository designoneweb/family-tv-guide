/**
 * JustWatch Episode Offers API
 *
 * GET /api/justwatch/episode?tmdbId=X&title=Y&season=Z&episode=W
 *
 * Returns episode-specific streaming URLs from JustWatch.
 * Falls back gracefully if data is unavailable.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEpisodeOffers } from '@/lib/justwatch/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const tmdbIdParam = searchParams.get('tmdbId');
  const title = searchParams.get('title');
  const seasonParam = searchParams.get('season');
  const episodeParam = searchParams.get('episode');

  // Validate required parameters
  if (!tmdbIdParam || !title || !seasonParam || !episodeParam) {
    return NextResponse.json(
      {
        error: 'Missing required parameters: tmdbId, title, season, episode',
        offers: [],
      },
      { status: 400 }
    );
  }

  const tmdbId = parseInt(tmdbIdParam, 10);
  const season = parseInt(seasonParam, 10);
  const episode = parseInt(episodeParam, 10);

  if (isNaN(tmdbId) || isNaN(season) || isNaN(episode)) {
    return NextResponse.json(
      {
        error: 'tmdbId, season, and episode must be valid numbers',
        offers: [],
      },
      { status: 400 }
    );
  }

  try {
    const result = await getEpisodeOffers(tmdbId, title, season, episode);
    return NextResponse.json(result);
  } catch (error) {
    console.error('JustWatch API error:', error);
    // Return empty offers on error - graceful degradation
    return NextResponse.json({ offers: [] });
  }
}
