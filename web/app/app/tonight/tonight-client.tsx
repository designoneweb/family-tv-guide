'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Tv, Sofa, CalendarPlus, CheckCircle, ListOrdered, Loader2, ChevronRight } from 'lucide-react';
import { TitleCard } from '@/components/title-card';
import { useProfile } from '@/lib/contexts/profile-context';
import { TitleCardSkeletonGrid, Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThinProgress } from '@/components/ui/progress';
import { getBackdropUrl, getStillUrl } from '@/lib/tmdb/images';
import { cn } from '@/lib/utils';
import type { MediaType } from '@/lib/database.types';

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
  backdropPath?: string | null;
  year: string;
  providers: Provider[];
  currentEpisode: CurrentEpisode | null;
  totalEpisodes?: number;
  watchedEpisodes?: number;
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
  const [heroAdvancing, setHeroAdvancing] = useState(false);

  // Get current day info
  const today = new Date();
  const currentWeekday = today.getDay();

  // Featured show is the first entry
  const featuredShow = entries[0] || null;
  const remainingShows = entries.slice(1);

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

  const handleMarkWatched = async (entry: EnrichedScheduleEntry, isHero = false) => {
    if (!activeProfileId || !entry.currentEpisode) return;

    const trackedTitleId = entry.trackedTitleId;

    if (isHero) {
      setHeroAdvancing(true);
    } else {
      setAdvancingIds((prev) => new Set(prev).add(trackedTitleId));
    }

    try {
      const tvResponse = await fetch(`/api/tmdb/tv/${entry.tmdbId}`);
      if (!tvResponse.ok) throw new Error('Failed to fetch TV details');
      const tvDetails = await tvResponse.json();
      const totalSeasons = tvDetails.number_of_seasons || 1;

      const seasonResponse = await fetch(
        `/api/tmdb/tv/${entry.tmdbId}/season/${entry.currentEpisode.season}`
      );
      if (!seasonResponse.ok) throw new Error('Failed to fetch season details');
      const seasonDetails = await seasonResponse.json();
      const totalEpisodesInSeason = seasonDetails.episodes?.length || 1;

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

      if (!advanceResponse.ok) throw new Error('Failed to advance progress');

      const { progress } = await advanceResponse.json();
      const isCompleted = progress.completed ?? false;

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
    } finally {
      if (isHero) {
        setHeroAdvancing(false);
      } else {
        setAdvancingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(trackedTitleId);
          return newSet;
        });
      }
    }
  };

  const handleJumpToEpisode = async (
    entry: EnrichedScheduleEntry,
    newSeason: number,
    newEpisode: number
  ) => {
    const trackedTitleId = entry.trackedTitleId;

    try {
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

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Hero Skeleton */}
        <div className="relative h-[50vh] min-h-[400px] bg-elevated animate-shimmer" />

        {/* Cards Section Skeleton */}
        <div className="px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <TitleCardSkeletonGrid count={3} aspectVideo={true} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
            <Tv className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">{error}</h2>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (entries.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          {/* Illustration placeholder */}
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-elevated border border-primary/10 mb-8">
            <Sofa className="h-16 w-16 text-muted-foreground/40" />
          </div>

          <h2 className="font-serif text-section text-foreground mb-3">
            Nothing scheduled for tonight
          </h2>
          <p className="text-muted-foreground mb-8">
            Head to your schedule to plan your {WEEKDAY_NAMES[currentWeekday]} evening viewing
          </p>

          <Link href="/app/schedule">
            <Button size="lg" className="gap-2">
              <CalendarPlus className="h-5 w-5" />
              Go to Schedule
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get backdrop image for hero
  const heroBackdrop = featuredShow?.currentEpisode?.stillPath
    ? getStillUrl(featuredShow.currentEpisode.stillPath, 'large')
    : featuredShow?.backdropPath
    ? getBackdropUrl(featuredShow.backdropPath, 'large')
    : null;

  const isCaughtUp = featuredShow?.currentEpisode?.completed ?? false;

  return (
    <div className="space-y-0">
      {/* Hero Section - Featured Show */}
      {featuredShow && (
        <section className="relative h-[50vh] min-h-[400px] lg:h-[55vh] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            {heroBackdrop ? (
              <Image
                src={heroBackdrop}
                alt={featuredShow.title}
                fill
                className="object-cover animate-ken-burns"
                style={{ filter: 'saturate(0.85)' }}
                unoptimized
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-elevated" />
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="hero-vignette absolute inset-0" />
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-12 lg:pb-16">
              <div className="max-w-xl animate-fade-in-up">
                {/* Tonight Label */}
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-micro text-primary tracking-widest">TONIGHT</span>
                </div>

                {/* Show Title */}
                <Link href={`/app/show/${featuredShow.tmdbId}`}>
                  <h1
                    className="font-serif text-page-title text-foreground mb-3 hover:text-primary transition-colors"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                  >
                    {featuredShow.title}
                  </h1>
                </Link>

                {/* Episode Info */}
                {featuredShow.currentEpisode && (
                  <p className="text-lg text-muted-foreground mb-4">
                    <span className="episode-number">
                      S{featuredShow.currentEpisode.season} E{featuredShow.currentEpisode.episode}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{featuredShow.currentEpisode.title}</span>
                  </p>
                )}

                {/* Progress Bar */}
                {featuredShow.totalEpisodes && (
                  <div className="max-w-[200px] mb-6">
                    <ThinProgress
                      value={((featuredShow.watchedEpisodes || 0) / featuredShow.totalEpisodes) * 100}
                    />
                    <p className="text-xs text-hint mt-2">
                      {featuredShow.watchedEpisodes || 0} of {featuredShow.totalEpisodes} episodes
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {featuredShow.currentEpisode && (
                  <div className="flex flex-wrap gap-3">
                    {isCaughtUp ? (
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-[8px] bg-success/10 border border-success/20 text-success font-medium">
                        <CheckCircle className="w-5 h-5" />
                        All caught up!
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleMarkWatched(featuredShow, true)}
                        disabled={heroAdvancing}
                        className="gap-2"
                      >
                        {heroAdvancing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Advancing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Mark Watched
                          </>
                        )}
                      </Button>
                    )}

                    <Link href={`/app/show/${featuredShow.tmdbId}`}>
                      <Button variant="outline" className="gap-2">
                        <ListOrdered className="w-5 h-5" />
                        Jump to Episode
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Streaming Badge */}
                {featuredShow.providers && featuredShow.providers.length > 0 && (
                  featuredShow.providers[0].link ? (
                    <a
                      href={featuredShow.providers[0].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 glass-subtle rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors"
                    >
                      <span className="text-xs text-muted-foreground">Watch on</span>
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${featuredShow.providers[0].logoPath}`}
                        alt={featuredShow.providers[0].name}
                        width={20}
                        height={20}
                        className="rounded"
                        unoptimized
                      />
                    </a>
                  ) : (
                    <div className="mt-4 inline-flex items-center gap-2 glass-subtle rounded-full px-3 py-1.5">
                      <span className="text-xs text-muted-foreground">Watch on</span>
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${featuredShow.providers[0].logoPath}`}
                        alt={featuredShow.providers[0].name}
                        width={20}
                        height={20}
                        className="rounded"
                        unoptimized
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tonight's Lineup Section */}
      {remainingShows.length > 0 && (
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-section text-foreground">
                Tonight&apos;s Lineup
              </h2>
              <Badge variant="outline" className="glass-subtle">
                {entries.length} {entries.length === 1 ? 'show' : 'shows'} scheduled
              </Badge>
            </div>

            {/* Show Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {remainingShows.map((entry) => (
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
          </div>
        </section>
      )}

      {/* Single show - show it as a card below hero */}
      {entries.length === 1 && (
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-section text-foreground">
                Tonight&apos;s Lineup
              </h2>
              <Badge variant="outline" className="glass-subtle">
                1 show scheduled
              </Badge>
            </div>

            <p className="text-muted-foreground">
              Just the one show tonight. Enjoy!
            </p>
          </div>
        </section>
      )}

      {/* Quick Link to Schedule */}
      <section className="py-8 border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href="/app/schedule"
            className="group flex items-center justify-between p-6 rounded-[20px] bg-elevated border border-primary/10 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-[12px] bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <CalendarPlus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Manage your schedule</h3>
                <p className="text-sm text-muted-foreground">Add or rearrange shows for any day</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </section>
    </div>
  );
}
