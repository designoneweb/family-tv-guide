'use client';

import { useState, useEffect } from 'react';
import { Calendar, Tv, Popcorn, CalendarPlus } from 'lucide-react';
import Link from 'next/link';
import { TitleCard } from '@/components/title-card';
import { useProfile } from '@/lib/contexts/profile-context';
import { TitleCardSkeletonGrid } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { MediaType } from '@/lib/database.types';

interface Provider {
  name: string;
  logoPath: string;
}

interface CurrentEpisode {
  season: number;
  episode: number;
  title: string;
  stillPath: string | null;
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
  currentEpisode: CurrentEpisode | null;
}

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function TonightClient() {
  const { activeProfileId } = useProfile();
  const [entries, setEntries] = useState<EnrichedScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advancingIds, setAdvancingIds] = useState<Set<string>>(new Set());

  // Get current day info
  const today = new Date();
  const currentWeekday = today.getDay(); // 0 = Sunday, matches DB

  // Fetch today's schedule
  useEffect(() => {
    if (!activeProfileId) return;

    const fetchTonightSchedule = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/schedule?profileId=${activeProfileId}`,
          { cache: 'no-store' }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch schedule');
        }

        const data = await response.json();
        const todayEntries: EnrichedScheduleEntry[] =
          data.schedule[currentWeekday] || [];

        // Sort by slot order
        todayEntries.sort((a, b) => a.slotOrder - b.slotOrder);
        setEntries(todayEntries);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load schedule'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTonightSchedule();
  }, [activeProfileId, currentWeekday]);

  /**
   * Handle marking an episode as watched
   * Fetches TV details and season info for advance logic, then calls PATCH /api/progress
   */
  const handleMarkWatched = async (entry: EnrichedScheduleEntry) => {
    if (!activeProfileId || !entry.currentEpisode) return;

    const trackedTitleId = entry.trackedTitleId;

    // Add to advancing set
    setAdvancingIds((prev) => new Set(prev).add(trackedTitleId));

    try {
      // Fetch TV details for total seasons
      const tvResponse = await fetch(`/api/tmdb/tv/${entry.tmdbId}`);
      if (!tvResponse.ok) {
        throw new Error('Failed to fetch TV details');
      }
      const tvDetails = await tvResponse.json();
      const totalSeasons = tvDetails.number_of_seasons || 1;

      // Fetch current season for episode count
      const seasonResponse = await fetch(
        `/api/tmdb/tv/${entry.tmdbId}/season/${entry.currentEpisode.season}`
      );
      if (!seasonResponse.ok) {
        throw new Error('Failed to fetch season details');
      }
      const seasonDetails = await seasonResponse.json();
      const totalEpisodesInSeason = seasonDetails.episodes?.length || 1;

      // Call advance API
      const advanceResponse = await fetch('/api/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: activeProfileId,
          trackedTitleId,
          action: 'advance',
          totalEpisodesInSeason,
          totalSeasons,
        }),
      });

      if (!advanceResponse.ok) {
        throw new Error('Failed to advance progress');
      }

      const { progress } = await advanceResponse.json();

      // Check if show is completed (from API response)
      const isCompleted = progress.completed ?? false;

      // Fetch the new episode info to update the UI
      const newEpisodeResponse = await fetch(
        `/api/tmdb/tv/${entry.tmdbId}/season/${progress.season_number}/episode/${progress.episode_number}`
      );

      let newEpisodeTitle = `Episode ${progress.episode_number}`;
      let newStillPath: string | null = null;

      if (newEpisodeResponse.ok) {
        const newEpisodeDetails = await newEpisodeResponse.json();
        newEpisodeTitle = newEpisodeDetails.name || newEpisodeTitle;
        newStillPath = newEpisodeDetails.still_path || null;
      }

      // Update local state with new episode info and completed status
      setEntries((prevEntries) =>
        prevEntries.map((e) =>
          e.trackedTitleId === trackedTitleId
            ? {
                ...e,
                currentEpisode: {
                  season: progress.season_number,
                  episode: progress.episode_number,
                  title: newEpisodeTitle,
                  stillPath: newStillPath,
                  completed: isCompleted,
                },
              }
            : e
        )
      );
    } catch (err) {
      console.error('Failed to mark watched:', err);
      // Could show a toast here in the future
    } finally {
      // Remove from advancing set
      setAdvancingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(trackedTitleId);
        return newSet;
      });
    }
  };

  /**
   * Handle jumping to a specific episode
   * Fetches the new episode title and updates local state
   */
  const handleJumpToEpisode = async (
    entry: EnrichedScheduleEntry,
    newSeason: number,
    newEpisode: number
  ) => {
    const trackedTitleId = entry.trackedTitleId;

    try {
      // Fetch the new episode info to update the UI
      const newEpisodeResponse = await fetch(
        `/api/tmdb/tv/${entry.tmdbId}/season/${newSeason}/episode/${newEpisode}`
      );

      let newEpisodeTitle = `Episode ${newEpisode}`;
      let newStillPath: string | null = null;

      if (newEpisodeResponse.ok) {
        const newEpisodeDetails = await newEpisodeResponse.json();
        newEpisodeTitle = newEpisodeDetails.name || newEpisodeTitle;
        newStillPath = newEpisodeDetails.still_path || null;
      }

      // Update local state with new episode info (not completed since we jumped)
      setEntries((prevEntries) =>
        prevEntries.map((e) =>
          e.trackedTitleId === trackedTitleId
            ? {
                ...e,
                currentEpisode: {
                  season: newSeason,
                  episode: newEpisode,
                  title: newEpisodeTitle,
                  stillPath: newStillPath,
                  completed: false,
                },
              }
            : e
        )
      );
    } catch (err) {
      console.error('Failed to fetch episode info after jump:', err);
      // Still update the state with basic info even if fetch fails
      setEntries((prevEntries) =>
        prevEntries.map((e) =>
          e.trackedTitleId === trackedTitleId
            ? {
                ...e,
                currentEpisode: {
                  season: newSeason,
                  episode: newEpisode,
                  title: `Episode ${newEpisode}`,
                  stillPath: null,
                  completed: false,
                },
              }
            : e
        )
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-2xl bg-primary/10">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Tonight</h1>
            <p className="text-muted-foreground text-lg mt-1">{formatDate(today)}</p>
          </div>
        </div>
        {!isLoading && !error && entries.length > 0 && (
          <p className="text-muted-foreground">
            {entries.length} {entries.length === 1 ? 'show' : 'shows'} scheduled for tonight
          </p>
        )}
      </div>

      {/* Loading State - Skeleton Grid */}
      {isLoading && (
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <TitleCardSkeletonGrid count={3} aspectVideo={true} />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <Tv className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-lg font-medium text-destructive">{error}</p>
          <p className="text-muted-foreground mt-2">Please try refreshing the page.</p>
        </div>
      )}

      {/* Empty State - Enhanced */}
      {!isLoading && !error && entries.length === 0 && (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <Popcorn className="h-10 w-10 text-muted-foreground/60" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Nothing on tonight</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Your {WEEKDAY_NAMES[currentWeekday]} schedule is empty. Add some shows to make the most of your evening!
          </p>
          <Link href="/app/schedule">
            <Button size="lg" className="gap-2">
              <CalendarPlus className="h-5 w-5" />
              Add to Schedule
            </Button>
          </Link>
        </div>
      )}

      {/* Title Grid - Art-forward display with staggered animation */}
      {!isLoading && entries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {entries.map((entry) => (
            <TitleCard
              key={entry.id}
              tmdbId={entry.tmdbId}
              mediaType={entry.mediaType}
              title={entry.title}
              posterPath={entry.posterPath}
              year={entry.year}
              providers={entry.providers}
              inLibrary={true}
              currentEpisode={entry.currentEpisode}
              trackedTitleId={entry.trackedTitleId}
              onMarkWatched={entry.currentEpisode ? () => handleMarkWatched(entry) : undefined}
              isAdvancing={advancingIds.has(entry.trackedTitleId)}
              profileId={activeProfileId || undefined}
              onJumpToEpisode={
                entry.currentEpisode
                  ? (newSeason, newEpisode) => handleJumpToEpisode(entry, newSeason, newEpisode)
                  : undefined
              }
              isCaughtUp={entry.currentEpisode?.completed ?? false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
