/**
 * TMDB TV Episode API Route
 * GET /api/tmdb/tv/[id]/season/[seasonNumber]/episode/[episodeNumber] - Get episode details
 *
 * Server-side proxy for TMDB to keep API key secure
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTVEpisode } from '@/lib/tmdb/details';
import { TMDBError } from '@/lib/tmdb/client';

interface RouteParams {
  params: Promise<{ id: string; seasonNumber: string; episodeNumber: string }>;
}

/**
 * GET /api/tmdb/tv/[id]/season/[seasonNumber]/episode/[episodeNumber]
 *
 * Path parameters:
 * - id (required): TMDB TV show ID
 * - seasonNumber (required): Season number (1-indexed)
 * - episodeNumber (required): Episode number (1-indexed)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id, seasonNumber, episodeNumber } = await params;
  const tmdbId = parseInt(id, 10);
  const seasonNum = parseInt(seasonNumber, 10);
  const episodeNum = parseInt(episodeNumber, 10);

  if (isNaN(tmdbId) || tmdbId < 1) {
    return NextResponse.json(
      { error: 'Invalid TV show ID' },
      { status: 400 }
    );
  }

  if (isNaN(seasonNum) || seasonNum < 0) {
    return NextResponse.json(
      { error: 'Invalid season number' },
      { status: 400 }
    );
  }

  if (isNaN(episodeNum) || episodeNum < 1) {
    return NextResponse.json(
      { error: 'Invalid episode number' },
      { status: 400 }
    );
  }

  try {
    const episode = await getTVEpisode(tmdbId, seasonNum, episodeNum);

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(episode);
  } catch (error) {
    if (error instanceof TMDBError) {
      console.error(`TMDB API error: ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to fetch episode details', details: error.message },
        { status: error.statusCode >= 500 ? 502 : error.statusCode }
      );
    }

    console.error('Unexpected error fetching episode details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
