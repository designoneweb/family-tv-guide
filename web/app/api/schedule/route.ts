/**
 * Schedule API Route
 * GET /api/schedule - Get week schedule for a profile (with TMDB enrichment)
 * POST /api/schedule - Add title to schedule
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWeekSchedule, addToSchedule, type WeekSchedule } from '@/lib/services/schedule';
import { getCurrentHousehold } from '@/lib/services/household';
import { getTVDetails, getMovieDetails, getTVEpisode } from '@/lib/tmdb/details';
import { getTVWatchProviders, getMovieWatchProviders } from '@/lib/tmdb/providers';
import { getProgressForProfile } from '@/lib/services/progress';
import type { ScheduleEntry, MediaType } from '@/lib/database.types';

// ============================================================================
// Types for enriched schedule entries
// ============================================================================

interface Provider {
  name: string;
  logoPath: string;
  link?: string;
}

interface CurrentEpisode {
  season: number;
  episode: number;
  title: string;
  stillPath: string | null;
  runtime: number | null;
  airDate: string | null;
  overview: string | null;
  completed: boolean;
}

interface EnrichedScheduleEntry {
  id: string;
  weekday: number;
  slotOrder: number;
  enabled: boolean;
  trackedTitleId: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  year: string;
  providers: Provider[];
  runtime: number; // Runtime in minutes (for TV: episode runtime, for movies: total runtime)
  currentEpisode: CurrentEpisode | null; // Episode info for TV shows, null for movies
}

type EnrichedWeekSchedule = {
  [weekday: number]: EnrichedScheduleEntry[];
};

interface TrackedTitleInfo {
  tmdb_id: number;
  media_type: MediaType;
}

interface ProgressInfo {
  seasonNumber: number;
  episodeNumber: number;
  completed: boolean;
}

// ============================================================================
// TMDB Enrichment
// ============================================================================

/**
 * Enrich a schedule entry with TMDB metadata and progress info
 */
async function enrichEntry(
  entry: ScheduleEntry,
  titleInfo: TrackedTitleInfo,
  fetchProviders: boolean,
  progress: ProgressInfo | null
): Promise<EnrichedScheduleEntry | null> {
  try {
    let providers: Provider[] = [];
    let currentEpisode: CurrentEpisode | null = null;

    if (titleInfo.media_type === 'tv') {
      const details = await getTVDetails(titleInfo.tmdb_id);
      if (!details) return null;

      if (fetchProviders) {
        const providerResult = await getTVWatchProviders(titleInfo.tmdb_id);
        if (providerResult?.flatrate) {
          // Include the JustWatch link with each provider
          const providerLink = providerResult.link;
          providers = providerResult.flatrate.map((p) => ({
            name: p.provider_name,
            logoPath: p.logo_path,
            link: providerLink,
          }));
        }
      }

      // Fetch current episode info
      // Default to S1E1 if no progress exists
      const seasonNum = progress?.seasonNumber ?? 1;
      const episodeNum = progress?.episodeNumber ?? 1;

      // Default episode runtime from show details
      const showEpisodeRuntime = details.episode_run_time?.[0] || 30;
      let episodeRuntime = showEpisodeRuntime;

      // Check if show is completed (from progress data)
      const isCompleted = progress?.completed ?? false;

      try {
        const episodeDetails = await getTVEpisode(titleInfo.tmdb_id, seasonNum, episodeNum);
        if (episodeDetails) {
          // Use episode-specific runtime if available, fallback to show average
          episodeRuntime = episodeDetails.runtime ?? showEpisodeRuntime;
          currentEpisode = {
            season: seasonNum,
            episode: episodeNum,
            title: episodeDetails.name,
            stillPath: episodeDetails.still_path,
            runtime: episodeDetails.runtime ?? null,
            airDate: episodeDetails.air_date ?? null,
            overview: episodeDetails.overview ?? null,
            completed: isCompleted,
          };
        } else {
          // Episode not found, still include position without title
          currentEpisode = {
            season: seasonNum,
            episode: episodeNum,
            title: `Episode ${episodeNum}`,
            stillPath: null,
            runtime: null,
            airDate: null,
            overview: null,
            completed: isCompleted,
          };
        }
      } catch (episodeError) {
        console.error(`Failed to fetch episode details for ${titleInfo.tmdb_id} S${seasonNum}E${episodeNum}:`, episodeError);
        // Fallback: show position without title
        currentEpisode = {
          season: seasonNum,
          episode: episodeNum,
          title: `Episode ${episodeNum}`,
          stillPath: null,
          runtime: null,
          airDate: null,
          overview: null,
          completed: isCompleted,
        };
      }

      return {
        id: entry.id,
        weekday: entry.weekday,
        slotOrder: entry.slot_order,
        enabled: entry.enabled,
        trackedTitleId: entry.tracked_title_id,
        tmdbId: titleInfo.tmdb_id,
        mediaType: 'tv',
        title: details.name,
        posterPath: details.poster_path,
        year: details.first_air_date?.substring(0, 4) || '',
        providers,
        runtime: episodeRuntime,
        currentEpisode,
      };
    } else {
      const details = await getMovieDetails(titleInfo.tmdb_id);
      if (!details) return null;

      if (fetchProviders) {
        const providerResult = await getMovieWatchProviders(titleInfo.tmdb_id);
        if (providerResult?.flatrate) {
          // Include the JustWatch link with each provider
          const providerLink = providerResult.link;
          providers = providerResult.flatrate.map((p) => ({
            name: p.provider_name,
            logoPath: p.logo_path,
            link: providerLink,
          }));
        }
      }

      return {
        id: entry.id,
        weekday: entry.weekday,
        slotOrder: entry.slot_order,
        enabled: entry.enabled,
        trackedTitleId: entry.tracked_title_id,
        tmdbId: titleInfo.tmdb_id,
        mediaType: 'movie',
        title: details.title,
        posterPath: details.poster_path,
        year: details.release_date?.substring(0, 4) || '',
        providers,
        runtime: details.runtime || 30, // Default to 30 minutes if no runtime
        currentEpisode: null, // Movies don't have episodes
      };
    }
  } catch (error) {
    console.error(`Failed to enrich schedule entry ${entry.id}:`, error);
    return null;
  }
}

/**
 * Enrich all schedule entries with TMDB metadata and progress info
 */
async function enrichSchedule(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  schedule: WeekSchedule,
  profileId: string
): Promise<EnrichedWeekSchedule> {
  // Collect all unique tracked_title_ids
  const allEntries: ScheduleEntry[] = [];
  const trackedTitleIds = new Set<string>();

  for (const weekday of Object.keys(schedule)) {
    const entries = schedule[Number(weekday)];
    for (const entry of entries) {
      allEntries.push(entry);
      trackedTitleIds.add(entry.tracked_title_id);
    }
  }

  if (trackedTitleIds.size === 0) {
    // No entries, return empty schedule
    return { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  }

  // Fetch tracked_titles for tmdb_id and media_type
  const { data: trackedTitles, error: titlesError } = await supabase
    .from('tracked_titles')
    .select('id, tmdb_id, media_type')
    .in('id', Array.from(trackedTitleIds));

  if (titlesError || !trackedTitles) {
    console.error('Failed to fetch tracked titles:', titlesError?.message);
    return { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  }

  // Create lookup map
  const titleInfoMap = new Map<string, TrackedTitleInfo>();
  for (const title of trackedTitles) {
    titleInfoMap.set(title.id, {
      tmdb_id: title.tmdb_id,
      media_type: title.media_type,
    });
  }

  // Fetch progress for this profile
  const progressResult = await getProgressForProfile(supabase, profileId);
  const progressMap = new Map<string, ProgressInfo>();

  if (!progressResult.error && progressResult.data) {
    for (const progress of progressResult.data) {
      progressMap.set(progress.tracked_title_id, {
        seasonNumber: progress.season_number,
        episodeNumber: progress.episode_number,
        completed: progress.completed,
      });
    }
  }

  // Enrich entries with TMDB data (limit providers to first 20)
  const PROVIDER_LIMIT = 20;
  let enrichedCount = 0;

  const enrichedSchedule: EnrichedWeekSchedule = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  // Process entries by weekday to maintain order
  for (const weekdayStr of Object.keys(schedule)) {
    const weekday = Number(weekdayStr);
    const entries = schedule[weekday];

    const enrichedEntries = await Promise.all(
      entries.map(async (entry) => {
        const titleInfo = titleInfoMap.get(entry.tracked_title_id);
        if (!titleInfo) return null;

        const fetchProviders = enrichedCount < PROVIDER_LIMIT;
        enrichedCount++;

        // Get progress for this title (null for movies or shows without progress)
        const progress = titleInfo.media_type === 'tv'
          ? progressMap.get(entry.tracked_title_id) || null
          : null;

        return enrichEntry(entry, titleInfo, fetchProviders, progress);
      })
    );

    // Filter out nulls and add to schedule
    enrichedSchedule[weekday] = enrichedEntries.filter(
      (e): e is EnrichedScheduleEntry => e !== null
    );
  }

  return enrichedSchedule;
}

/**
 * GET /api/schedule
 *
 * Query parameters:
 * - profileId (required): Profile ID to fetch schedule for
 *
 * Returns:
 * - 200: { schedule: { [weekday: number]: EnrichedScheduleEntry[] } }
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
    // Get authenticated user
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

    // Fetch week schedule
    const result = await getWeekSchedule(supabase, profileId);

    if (result.error) {
      console.error('Schedule fetch error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to fetch schedule' },
        { status: 500 }
      );
    }

    // Enrich with TMDB metadata and progress info
    const enrichedSchedule = await enrichSchedule(supabase, result.data, profileId);

    return NextResponse.json({ schedule: enrichedSchedule });
  } catch (error) {
    console.error('Unexpected error in schedule fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface AddToScheduleBody {
  profileId: string;
  trackedTitleId: string;
  weekday: number;
}

/**
 * POST /api/schedule
 *
 * Request body:
 * - profileId (required): Profile ID
 * - trackedTitleId (required): Tracked title ID to add
 * - weekday (required): Day of week (0-6)
 *
 * Returns:
 * - 200: { entry: ScheduleEntry }
 * - 400: Invalid request body
 * - 401: Not authenticated
 * - 404: No household found
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  let body: AddToScheduleBody;

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

  if (typeof body.weekday !== 'number' || body.weekday < 0 || body.weekday > 6) {
    return NextResponse.json(
      { error: 'weekday must be a number between 0 and 6' },
      { status: 400 }
    );
  }

  try {
    // Get authenticated user
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

    // Get user's household
    const household = await getCurrentHousehold(supabase);
    if (!household) {
      return NextResponse.json(
        { error: 'No household found for user' },
        { status: 404 }
      );
    }

    // Add to schedule
    const result = await addToSchedule(supabase, {
      profileId: body.profileId,
      trackedTitleId: body.trackedTitleId,
      weekday: body.weekday,
      householdId: household.id,
    });

    if (result.error) {
      console.error('Add to schedule error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to add to schedule' },
        { status: 500 }
      );
    }

    return NextResponse.json({ entry: result.data });
  } catch (error) {
    console.error('Unexpected error in schedule add:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
