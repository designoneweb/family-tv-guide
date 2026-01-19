/**
 * Library API Route
 * GET /api/library
 *
 * Returns the household's library with TMDB metadata enrichment
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentHousehold } from '@/lib/services/household';
import { getLibrary } from '@/lib/services/library';
import { getTVDetails, getMovieDetails } from '@/lib/tmdb/details';
import { getTVWatchProviders, getMovieWatchProviders } from '@/lib/tmdb/providers';
import type { TrackedTitle } from '@/lib/database.types';

interface Provider {
  name: string;
  logoPath: string;
}

interface EnrichedTitle {
  id: string;
  tmdbId: number;
  mediaType: 'tv' | 'movie';
  title: string;
  posterPath: string | null;
  year: string;
  providers: Provider[];
}

/**
 * Enrich a tracked title with TMDB metadata and optionally providers
 */
async function enrichTitle(
  tracked: TrackedTitle,
  fetchProviders: boolean
): Promise<EnrichedTitle | null> {
  try {
    let providers: Provider[] = [];

    if (tracked.media_type === 'tv') {
      const details = await getTVDetails(tracked.tmdb_id);
      if (!details) return null;

      // Fetch streaming providers for first batch only
      if (fetchProviders) {
        const providerResult = await getTVWatchProviders(tracked.tmdb_id);
        if (providerResult?.flatrate) {
          providers = providerResult.flatrate.map((p) => ({
            name: p.provider_name,
            logoPath: p.logo_path,
          }));
        }
      }

      return {
        id: tracked.id,
        tmdbId: tracked.tmdb_id,
        mediaType: 'tv',
        title: details.name,
        posterPath: details.poster_path,
        year: details.first_air_date?.substring(0, 4) || '',
        providers,
      };
    } else {
      const details = await getMovieDetails(tracked.tmdb_id);
      if (!details) return null;

      // Fetch streaming providers for first batch only
      if (fetchProviders) {
        const providerResult = await getMovieWatchProviders(tracked.tmdb_id);
        if (providerResult?.flatrate) {
          providers = providerResult.flatrate.map((p) => ({
            name: p.provider_name,
            logoPath: p.logo_path,
          }));
        }
      }

      return {
        id: tracked.id,
        tmdbId: tracked.tmdb_id,
        mediaType: 'movie',
        title: details.title,
        posterPath: details.poster_path,
        year: details.release_date?.substring(0, 4) || '',
        providers,
      };
    }
  } catch (error) {
    console.error(`Failed to enrich title ${tracked.tmdb_id}:`, error);
    return null;
  }
}

/**
 * GET /api/library
 *
 * Returns:
 * - 200: { titles: EnrichedTitle[] }
 * - 401: Not authenticated
 * - 404: No household found
 * - 500: Server error
 */
export async function GET() {
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

    // Fetch library
    const result = await getLibrary(supabase, household.id);

    if (result.error) {
      console.error('Library fetch error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to fetch library' },
        { status: 500 }
      );
    }

    const trackedTitles = result.data;

    // Enrich with TMDB metadata (batch of 20 max to avoid rate limits)
    // Only fetch providers for first 20 titles to avoid slow page loads
    const BATCH_SIZE = 20;
    const PROVIDER_LIMIT = 20;
    const enrichedTitles: EnrichedTitle[] = [];

    for (let i = 0; i < trackedTitles.length; i += BATCH_SIZE) {
      const batch = trackedTitles.slice(i, i + BATCH_SIZE);
      const fetchProviders = i < PROVIDER_LIMIT;

      const enrichedBatch = await Promise.all(
        batch.map((t) => enrichTitle(t, fetchProviders))
      );

      // Filter out nulls (failed enrichments)
      for (const enriched of enrichedBatch) {
        if (enriched) {
          enrichedTitles.push(enriched);
        }
      }
    }

    return NextResponse.json({ titles: enrichedTitles });
  } catch (error) {
    console.error('Unexpected error in library fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
