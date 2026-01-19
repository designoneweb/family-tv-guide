/**
 * Progress API Route
 * GET /api/progress - Get all progress for a profile
 * POST /api/progress - Set/upsert progress for a show
 * PATCH /api/progress - Advance to next episode
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getProgressForProfile,
  setProgress,
  advanceEpisode,
} from '@/lib/services/progress';

// ============================================================================
// GET /api/progress
// ============================================================================

/**
 * GET /api/progress
 *
 * Query parameters:
 * - profileId (required): Profile ID to fetch progress for
 *
 * Returns:
 * - 200: { progress: ProgressWithTitle[] }
 * - 400: Missing profileId
 * - 401: Not authenticated
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');

  if (!profileId) {
    return NextResponse.json(
      { error: 'profileId query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const result = await getProgressForProfile(supabase, profileId);

    if (result.error) {
      console.error('Progress fetch error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({ progress: result.data });
  } catch (error) {
    console.error('Unexpected error in progress fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/progress
// ============================================================================

interface SetProgressBody {
  profileId: string;
  trackedTitleId: string;
  seasonNumber: number;
  episodeNumber: number;
}

/**
 * POST /api/progress
 *
 * Request body:
 * - profileId (required): Profile ID
 * - trackedTitleId (required): Tracked title ID
 * - seasonNumber (required): Season number
 * - episodeNumber (required): Episode number
 *
 * Returns:
 * - 200: { progress: TvProgress }
 * - 400: Invalid request body
 * - 401: Not authenticated
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  let body: SetProgressBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate body
  if (!body.profileId) {
    return NextResponse.json(
      { error: 'profileId is required' },
      { status: 400 }
    );
  }

  if (!body.trackedTitleId) {
    return NextResponse.json(
      { error: 'trackedTitleId is required' },
      { status: 400 }
    );
  }

  if (typeof body.seasonNumber !== 'number' || body.seasonNumber < 1) {
    return NextResponse.json(
      { error: 'seasonNumber must be a positive number' },
      { status: 400 }
    );
  }

  if (typeof body.episodeNumber !== 'number' || body.episodeNumber < 1) {
    return NextResponse.json(
      { error: 'episodeNumber must be a positive number' },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const result = await setProgress(
      supabase,
      body.profileId,
      body.trackedTitleId,
      body.seasonNumber,
      body.episodeNumber
    );

    if (result.error) {
      console.error('Set progress error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to set progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({ progress: result.data });
  } catch (error) {
    console.error('Unexpected error in set progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/progress
// ============================================================================

interface AdvanceEpisodeBody {
  profileId: string;
  trackedTitleId: string;
  action: 'advance';
  totalEpisodesInSeason: number;
  totalSeasons: number;
}

/**
 * PATCH /api/progress
 *
 * Request body:
 * - profileId (required): Profile ID
 * - trackedTitleId (required): Tracked title ID
 * - action (required): Must be 'advance'
 * - totalEpisodesInSeason (required): Total episodes in current season
 * - totalSeasons (required): Total seasons in the show
 *
 * Returns:
 * - 200: { progress: TvProgress }
 * - 400: Invalid request body
 * - 401: Not authenticated
 * - 500: Server error
 */
export async function PATCH(request: NextRequest) {
  let body: AdvanceEpisodeBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate body
  if (!body.profileId) {
    return NextResponse.json(
      { error: 'profileId is required' },
      { status: 400 }
    );
  }

  if (!body.trackedTitleId) {
    return NextResponse.json(
      { error: 'trackedTitleId is required' },
      { status: 400 }
    );
  }

  if (body.action !== 'advance') {
    return NextResponse.json(
      { error: 'action must be "advance"' },
      { status: 400 }
    );
  }

  if (typeof body.totalEpisodesInSeason !== 'number' || body.totalEpisodesInSeason < 1) {
    return NextResponse.json(
      { error: 'totalEpisodesInSeason must be a positive number' },
      { status: 400 }
    );
  }

  if (typeof body.totalSeasons !== 'number' || body.totalSeasons < 1) {
    return NextResponse.json(
      { error: 'totalSeasons must be a positive number' },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const result = await advanceEpisode(
      supabase,
      body.profileId,
      body.trackedTitleId,
      body.totalEpisodesInSeason,
      body.totalSeasons
    );

    if (result.error) {
      console.error('Advance episode error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to advance episode' },
        { status: 500 }
      );
    }

    return NextResponse.json({ progress: result.data });
  } catch (error) {
    console.error('Unexpected error in advance episode:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
