/**
 * Synopsis API Route
 * POST /api/synopsis - Generate or retrieve cached episode synopsis
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getBlurb, saveBlurb, truncateOverview } from '@/lib/services/blurbs';
import { generateEpisodeSynopsis } from '@/lib/gemini/client';
import type { BlurbSource } from '@/lib/database.types';

// ============================================================================
// Types
// ============================================================================

interface SynopsisRequestBody {
  showId: number;
  showName: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeName: string;
  overview: string;
}

interface SynopsisResponse {
  blurb: string;
  source: BlurbSource;
  cached: boolean;
}

// ============================================================================
// POST /api/synopsis
// ============================================================================

/**
 * POST /api/synopsis
 *
 * Request body:
 * - showId (required): TMDB show ID
 * - showName (required): Name of the TV show
 * - seasonNumber (required): Season number
 * - episodeNumber (required): Episode number
 * - episodeName (required): Episode title
 * - overview (required): TMDB episode overview
 *
 * Returns:
 * - 200: { blurb: string, source: 'ai' | 'tmdb_truncate', cached: boolean }
 * - 400: Invalid request body
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  let body: SynopsisRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate required fields
  if (typeof body.showId !== 'number' || body.showId < 1) {
    return NextResponse.json(
      { error: 'showId must be a positive number' },
      { status: 400 }
    );
  }

  if (!body.showName || typeof body.showName !== 'string') {
    return NextResponse.json(
      { error: 'showName is required' },
      { status: 400 }
    );
  }

  if (typeof body.seasonNumber !== 'number' || body.seasonNumber < 0) {
    return NextResponse.json(
      { error: 'seasonNumber must be a non-negative number' },
      { status: 400 }
    );
  }

  if (typeof body.episodeNumber !== 'number' || body.episodeNumber < 1) {
    return NextResponse.json(
      { error: 'episodeNumber must be a positive number' },
      { status: 400 }
    );
  }

  if (!body.episodeName || typeof body.episodeName !== 'string') {
    return NextResponse.json(
      { error: 'episodeName is required' },
      { status: 400 }
    );
  }

  if (!body.overview || typeof body.overview !== 'string') {
    return NextResponse.json(
      { error: 'overview is required' },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();

    // Step 1: Check cache for existing blurb
    const cacheResult = await getBlurb(
      supabase,
      body.showId,
      body.seasonNumber,
      body.episodeNumber
    );

    if (cacheResult.error) {
      console.error('Cache lookup error:', cacheResult.error.message);
      // Continue without cache - try to generate fresh
    } else if (cacheResult.data) {
      // Found in cache - return immediately
      const response: SynopsisResponse = {
        blurb: cacheResult.data.blurb_text,
        source: cacheResult.data.source,
        cached: true,
      };
      return NextResponse.json(response);
    }

    // Step 2: Try AI generation with Gemini
    const aiSynopsis = await generateEpisodeSynopsis(
      body.showName,
      body.seasonNumber,
      body.episodeNumber,
      body.episodeName,
      body.overview
    );

    let blurbText: string;
    let source: BlurbSource;

    if (aiSynopsis) {
      // AI generation succeeded
      blurbText = aiSynopsis;
      source = 'ai';
    } else {
      // Fallback to truncated TMDB overview
      blurbText = truncateOverview(body.overview);
      source = 'tmdb_truncate';
    }

    // Step 3: Save to cache
    const saveResult = await saveBlurb(
      supabase,
      body.showId,
      body.seasonNumber,
      body.episodeNumber,
      blurbText,
      source
    );

    if (saveResult.error) {
      // Log but don't fail - we still have a valid blurb to return
      console.error('Failed to cache blurb:', saveResult.error.message);
    }

    // Step 4: Return result
    const response: SynopsisResponse = {
      blurb: blurbText,
      source,
      cached: false,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error in synopsis generation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
