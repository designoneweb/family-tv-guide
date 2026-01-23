'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, User, CheckCircle, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/lib/contexts/profile-context';
import { getStillUrl, getBackdropUrl, getProfileUrl } from '@/lib/tmdb/images';
import type { TMDBEpisode, TMDBTVDetails, TMDBEpisodeCredits, TMDBCastMember, TMDBGuestStar, TMDBSeason } from '@/lib/tmdb/types';

interface EpisodeClientProps {
  showId: number;
  seasonNumber: number;
  episodeNumber: number;
}

/**
 * Cast card component with hover effects and character overlay.
 * Clickable - navigates to person detail page.
 */
function CastCard({ person, showCharacter = true, index = 0 }: { person: TMDBCastMember | TMDBGuestStar; showCharacter?: boolean; index?: number }) {
  const profileUrl = getProfileUrl(person.profile_path, 'medium');

  return (
    <Link
      href={`/app/person/${person.id}`}
      className="flex-shrink-0 w-32 cursor-pointer group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="aspect-[2/3] relative bg-muted rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-xl">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={person.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
            <User className="h-12 w-12" />
          </div>
        )}
        {/* Hover overlay with character name */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          {showCharacter && person.character && (
            <p className="text-white text-xs font-medium line-clamp-2">
              as {person.character}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 text-sm">
        <p className="font-semibold line-clamp-1 group-hover:text-primary transition-colors" title={person.name}>
          {person.name}
        </p>
        {showCharacter && person.character && (
          <p className="text-muted-foreground text-xs line-clamp-1 mt-0.5" title={person.character}>
            {person.character}
          </p>
        )}
      </div>
    </Link>
  );
}

/**
 * Skeleton loader matching the cinematic layout
 */
function EpisodeSkeleton() {
  return (
    <div className="min-h-screen animate-fade-in-up">
      {/* Hero skeleton */}
      <div className="relative w-full min-h-[70vh] bg-muted skeleton-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        {/* Back button skeleton */}
        <div className="absolute top-6 left-6 h-10 w-40 bg-muted-foreground/20 rounded-full skeleton-pulse" />
        {/* Badge skeletons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <div className="h-8 w-20 bg-muted-foreground/20 rounded-full skeleton-pulse" />
          <div className="h-8 w-16 bg-muted-foreground/20 rounded-full skeleton-pulse" />
        </div>
        {/* Title card skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-6 md:p-8">
            <div className="h-4 w-32 bg-muted-foreground/20 rounded skeleton-pulse mb-4" />
            <div className="h-12 w-3/4 bg-muted-foreground/20 rounded skeleton-pulse mb-4" />
            <div className="flex gap-3">
              <div className="h-8 w-28 bg-muted-foreground/20 rounded-full skeleton-pulse" />
              <div className="h-8 w-20 bg-muted-foreground/20 rounded-full skeleton-pulse" />
            </div>
          </div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="h-6 w-full bg-muted rounded skeleton-pulse mb-3" />
        <div className="h-6 w-5/6 bg-muted rounded skeleton-pulse mb-3" />
        <div className="h-6 w-4/6 bg-muted rounded skeleton-pulse mb-8" />
        <div className="h-32 w-full bg-muted rounded-xl skeleton-pulse mb-8" />
        <div className="h-10 w-40 bg-muted rounded-lg skeleton-pulse" />
      </div>
    </div>
  );
}

/**
 * Episode detail client component.
 * Cinematic experience with full-bleed hero, glassmorphism, and premium cast display.
 */
export function EpisodeClient({ showId, seasonNumber, episodeNumber }: EpisodeClientProps) {
  const router = useRouter();
  const { activeProfileId } = useProfile();
  const [episode, setEpisode] = useState<TMDBEpisode | null>(null);
  const [credits, setCredits] = useState<TMDBEpisodeCredits | null>(null);
  const [showDetails, setShowDetails] = useState<TMDBTVDetails | null>(null);
  const [seasonDetails, setSeasonDetails] = useState<TMDBSeason | null>(null);
  const [trackedTitleId, setTrackedTitleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);
  const [markedMessage, setMarkedMessage] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [synopsis, setSynopsis] = useState<{ text: string; source: 'ai' | 'tmdb_truncate' } | null>(null);
  const [isFetchingSynopsis, setIsFetchingSynopsis] = useState(false);
  const [aiSynopsisAvailable, setAiSynopsisAvailable] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch episode, credits, show details, and season details in parallel
        const [episodeRes, creditsRes, showRes, seasonRes] = await Promise.all([
          fetch(`/api/tmdb/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`),
          fetch(`/api/tmdb/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}/credits`),
          fetch(`/api/tmdb/tv/${showId}`),
          fetch(`/api/tmdb/tv/${showId}/season/${seasonNumber}`),
        ]);

        if (!episodeRes.ok) {
          throw new Error('Failed to fetch episode details');
        }

        const episodeData: TMDBEpisode = await episodeRes.json();
        setEpisode(episodeData);

        if (creditsRes.ok) {
          const creditsData: TMDBEpisodeCredits = await creditsRes.json();
          setCredits(creditsData);
        }

        if (showRes.ok) {
          const showData: TMDBTVDetails = await showRes.json();
          setShowDetails(showData);
        }

        if (seasonRes.ok) {
          const seasonData: TMDBSeason = await seasonRes.json();
          setSeasonDetails(seasonData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [showId, seasonNumber, episodeNumber]);

  // Check if AI synopsis is available (API key configured)
  useEffect(() => {
    async function checkAiAvailability() {
      try {
        const response = await fetch('/api/synopsis');
        if (response.ok) {
          const data = await response.json();
          setAiSynopsisAvailable(data.available);
        }
      } catch (err) {
        console.error('Failed to check AI availability:', err);
      }
    }

    checkAiAvailability();
  }, []);

  // Check if show is in library (to show Mark Watched button)
  useEffect(() => {
    async function checkLibrary() {
      try {
        const response = await fetch(`/api/library/check?tmdbId=${showId}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data.inLibrary && data.titleId) {
            setTrackedTitleId(data.titleId);
          }
        }
      } catch (err) {
        console.error('Failed to check library status:', err);
      }
    }

    checkLibrary();
  }, [showId]);

  /**
   * Handle marking episode as watched
   * Sets progress to the NEXT episode after the one being viewed
   */
  const handleMarkWatched = async () => {
    if (!activeProfileId || !trackedTitleId || !showDetails) return;

    setIsMarking(true);
    setMarkedMessage(null);

    try {
      // Get current season episode count
      const seasonResponse = await fetch(`/api/tmdb/tv/${showId}/season/${seasonNumber}`);
      if (!seasonResponse.ok) {
        throw new Error('Failed to fetch season details');
      }
      const seasonData = await seasonResponse.json();
      const totalEpisodesInSeason = seasonData.episodes?.length || 1;
      const totalSeasons = showDetails.number_of_seasons || 1;

      // Calculate the next episode from the CURRENT viewed episode
      let nextSeason = seasonNumber;
      let nextEpisode = episodeNumber;
      let isCompleted = false;

      if (episodeNumber < totalEpisodesInSeason) {
        // Next episode in current season
        nextEpisode = episodeNumber + 1;
      } else if (seasonNumber < totalSeasons) {
        // First episode of next season
        nextSeason = seasonNumber + 1;
        nextEpisode = 1;
      } else {
        // This is the last episode of the last season - show is complete
        isCompleted = true;
      }

      // Set progress directly to the next episode (or mark as completed)
      const setProgressResponse = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: activeProfileId,
          trackedTitleId,
          seasonNumber: nextSeason,
          episodeNumber: nextEpisode,
          completed: isCompleted,
        }),
      });

      if (!setProgressResponse.ok) {
        throw new Error('Failed to set progress');
      }

      const { progress } = await setProgressResponse.json();

      // Trigger celebration animation
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 600);

      if (isCompleted) {
        // Show is complete - stay on page
        setMarkedMessage('All caught up! 🎉');
      } else {
        // Show confirmation message
        setMarkedMessage(`Marked! Next: S${progress.season_number}E${progress.episode_number}`);

        // Navigate to next episode after brief delay
        setTimeout(() => {
          router.push(`/app/show/${showId}/season/${progress.season_number}/episode/${progress.episode_number}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to mark watched:', err);
      setMarkedMessage(null);
    } finally {
      setIsMarking(false);
    }
  };

  /**
   * Fetch AI synopsis for the episode
   */
  const fetchSynopsis = async () => {
    if (!episode || !showDetails || !episode.overview) return;

    setIsFetchingSynopsis(true);
    try {
      const response = await fetch('/api/synopsis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showId,
          showName: showDetails.name,
          seasonNumber,
          episodeNumber,
          episodeName: episode.name,
          overview: episode.overview,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSynopsis({ text: data.blurb, source: data.source });
      }
    } catch (err) {
      console.error('Failed to fetch synopsis:', err);
    } finally {
      setIsFetchingSynopsis(false);
    }
  };

  // Episode navigation helpers
  const totalEpisodesInSeason = seasonDetails?.episodes?.length || 0;
  const hasPreviousEpisode = episodeNumber > 1;
  const hasNextEpisode = episodeNumber < totalEpisodesInSeason;

  // Check if Mark Watched button should be shown
  const canMarkWatched = activeProfileId && trackedTitleId && showDetails;

  // Loading state with skeleton
  if (isLoading) {
    return <EpisodeSkeleton />;
  }

  // Error state
  if (error || !episode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {error || 'Episode not found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            We couldn't load this episode. It may have been removed or there was a connection issue.
          </p>
          <Link href={`/app/show/${showId}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to show
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get still image URL (fallback to show backdrop if no still)
  const stillUrl = getStillUrl(episode.still_path, 'large')
    || (showDetails?.backdrop_path ? getBackdropUrl(showDetails.backdrop_path, 'large') : null);

  // Format air date
  const formattedDate = episode.air_date
    ? new Date(episode.air_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Format runtime
  const formattedRuntime = episode.runtime
    ? `${episode.runtime} min`
    : null;

  // Get top 10 cast members
  const mainCast = credits?.cast?.slice(0, 10) || [];
  const hasMoreCast = (credits?.cast?.length || 0) > 10;

  // Get guest stars (limit to 10)
  const guestStars = (credits?.guest_stars || []).slice(0, 10);
  const hasMoreGuests = (credits?.guest_stars?.length || 0) > 10;

  return (
    <div className="min-h-screen pb-12 animate-fade-in-up">
      {/* Cinematic Full-Bleed Hero */}
      <div className="relative w-full min-h-[70vh] overflow-hidden bg-muted">
        {stillUrl ? (
          <>
            {/* Ken Burns animated background image */}
            <Image
              src={stillUrl}
              alt={`${episode.name} - S${seasonNumber}E${episodeNumber}`}
              fill
              className="object-cover animate-ken-burns"
              unoptimized
              priority
            />
            {/* Multi-layer gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted to-background" />
        )}

        {/* Back navigation - glass pill */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href={`/app/show/${showId}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 glass rounded-full text-sm font-medium hover:bg-background/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{showDetails?.name || 'Back'}</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        {/* Floating badges - episode number and rating */}
        <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
          {/* Episode badge */}
          <div className="glass rounded-full px-4 py-2 text-sm font-semibold">
            S{seasonNumber} E{episodeNumber}
          </div>
          {/* Rating badge */}
          {episode.vote_average > 0 && (
            <div className="glass rounded-full px-4 py-2 flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">{episode.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Floating Glass Title Card */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {/* Episode label */}
            <p className="text-sm text-muted-foreground font-medium mb-2">
              Season {seasonNumber}, Episode {episodeNumber}
            </p>

            {/* Large dramatic title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {episode.name}
            </h1>

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center gap-3">
              {formattedDate && (
                <span className="inline-flex items-center px-3 py-1.5 bg-muted/50 rounded-full text-sm">
                  {formattedDate}
                </span>
              )}
              {formattedRuntime && (
                <span className="inline-flex items-center px-3 py-1.5 bg-muted/50 rounded-full text-sm">
                  {formattedRuntime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Overview */}
        {episode.overview && (
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <p className="text-lg text-foreground/90 leading-relaxed">
              {episode.overview}
            </p>
          </div>
        )}

        {/* AI Synopsis - gradient border card */}
        {episode.overview && aiSynopsisAvailable && (
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {synopsis ? (
              <div className="glass rounded-xl p-5 gradient-border">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Family-Friendly Synopsis</span>
                  <span className="text-xs bg-primary/15 text-primary px-2.5 py-1 rounded-full font-medium">
                    {synopsis.source === 'ai' ? 'AI Generated' : 'TMDB Summary'}
                  </span>
                </div>
                <p className="text-foreground/85 italic leading-relaxed text-base">
                  {synopsis.text}
                </p>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={fetchSynopsis}
                disabled={isFetchingSynopsis}
                className="gap-2 h-11"
              >
                {isFetchingSynopsis ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Get AI Synopsis
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Mark Watched button with glow effect */}
        {canMarkWatched && (
          <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            {markedMessage ? (
              <div className={`inline-flex items-center gap-2 text-base font-medium text-green-500 ${showCelebration ? 'animate-celebrate' : ''}`}>
                <CheckCircle className="h-5 w-5" />
                {markedMessage}
              </div>
            ) : (
              <Button
                onClick={handleMarkWatched}
                disabled={isMarking}
                size="lg"
                className="min-w-[180px] h-12 text-base glow-on-hover"
              >
                {isMarking ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Marking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark Watched
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Divider */}
        {(mainCast.length > 0 || guestStars.length > 0) && (
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />
        )}

        {/* Main Cast section with staggered animation */}
        {mainCast.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold relative">
                Main Cast
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary rounded-full" />
              </h2>
              {hasMoreCast && (
                <span className="text-sm text-muted-foreground">
                  +{(credits?.cast?.length || 0) - 10} more
                </span>
              )}
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 stagger-children">
              {mainCast.map((person, index) => (
                <CastCard key={person.id} person={person} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Guest Stars section with staggered animation */}
        {guestStars.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold relative">
                Guest Stars
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary rounded-full" />
              </h2>
              {hasMoreGuests && (
                <span className="text-sm text-muted-foreground">
                  +{(credits?.guest_stars?.length || 0) - 10} more
                </span>
              )}
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 stagger-children">
              {guestStars.map((person, index) => (
                <CastCard key={person.id} person={person} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Episode Navigation */}
        {totalEpisodesInSeason > 1 && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
            <div className="flex items-center justify-between">
              {/* Previous Episode */}
              {hasPreviousEpisode ? (
                <Link href={`/app/show/${showId}/season/${seasonNumber}/episode/${episodeNumber - 1}`}>
                  <Button variant="ghost" className="gap-2 h-11">
                    <ChevronLeft className="h-5 w-5" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                </Link>
              ) : (
                <div /> /* Spacer */
              )}

              {/* Episode indicator */}
              <span className="text-sm text-muted-foreground font-medium">
                Episode {episodeNumber} of {totalEpisodesInSeason}
              </span>

              {/* Next Episode */}
              {hasNextEpisode ? (
                <Link href={`/app/show/${showId}/season/${seasonNumber}/episode/${episodeNumber + 1}`}>
                  <Button variant="ghost" className="gap-2 h-11">
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <div /> /* Spacer */
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
