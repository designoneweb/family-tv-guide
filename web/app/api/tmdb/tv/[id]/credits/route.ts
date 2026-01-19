/**
 * TMDB TV Credits API Route
 * GET /api/tmdb/tv/[id]/credits - Get TV show credits by TMDB ID
 *
 * Server-side proxy for TMDB to keep API key secure
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTVCredits } from '@/lib/tmdb/details';
import { TMDBError } from '@/lib/tmdb/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tmdb/tv/[id]/credits
 *
 * Path parameters:
 * - id (required): TMDB TV show ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const tmdbId = parseInt(id, 10);

  if (isNaN(tmdbId) || tmdbId < 1) {
    return NextResponse.json(
      { error: 'Invalid TV show ID' },
      { status: 400 }
    );
  }

  try {
    const credits = await getTVCredits(tmdbId);

    if (!credits) {
      return NextResponse.json(
        { error: 'TV show credits not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(credits);
  } catch (error) {
    if (error instanceof TMDBError) {
      console.error(`TMDB API error: ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to fetch TV credits', details: error.message },
        { status: error.statusCode >= 500 ? 502 : error.statusCode }
      );
    }

    console.error('Unexpected error fetching TV credits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
