/**
 * TMDB Person Details API Route
 * GET /api/tmdb/person/[id] - Get person details by TMDB person ID
 *
 * Server-side proxy for TMDB to keep API key secure
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPersonDetails } from '@/lib/tmdb/details';
import { TMDBError } from '@/lib/tmdb/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tmdb/person/[id]
 *
 * Path parameters:
 * - id (required): TMDB person ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const personId = parseInt(id, 10);

  if (isNaN(personId) || personId < 1) {
    return NextResponse.json(
      { error: 'Invalid person ID' },
      { status: 400 }
    );
  }

  try {
    const details = await getPersonDetails(personId);

    if (!details) {
      return NextResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(details);
  } catch (error) {
    if (error instanceof TMDBError) {
      console.error(`TMDB API error: ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to fetch person details', details: error.message },
        { status: error.statusCode >= 500 ? 502 : error.statusCode }
      );
    }

    console.error('Unexpected error fetching person details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
