'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, User } from 'lucide-react';
import { getStillUrl, getBackdropUrl, getProfileUrl } from '@/lib/tmdb/images';
import type { TMDBEpisode, TMDBTVDetails, TMDBEpisodeCredits, TMDBCastMember, TMDBGuestStar } from '@/lib/tmdb/types';

interface EpisodeClientProps {
  showId: number;
  seasonNumber: number;
  episodeNumber: number;
}

/**
 * Cast card component for displaying actor/guest star info.
 */
function CastCard({ person, showCharacter = true }: { person: TMDBCastMember | TMDBGuestStar; showCharacter?: boolean }) {
  const profileUrl = getProfileUrl(person.profile_path, 'medium');

  return (
    <div className="flex-shrink-0 w-28">
      <div className="aspect-[2/3] relative bg-muted rounded-lg overflow-hidden">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={person.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <User className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="mt-2 text-sm">
        <p className="font-medium line-clamp-1" title={person.name}>{person.name}</p>
        {showCharacter && person.character && (
          <p className="text-muted-foreground text-xs line-clamp-1" title={person.character}>
            {person.character}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Episode detail client component.
 * Fetches and displays full episode info with cast and guest stars.
 */
export function EpisodeClient({ showId, seasonNumber, episodeNumber }: EpisodeClientProps) {
  const [episode, setEpisode] = useState<TMDBEpisode | null>(null);
  const [credits, setCredits] = useState<TMDBEpisodeCredits | null>(null);
  const [showDetails, setShowDetails] = useState<TMDBTVDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch episode, credits, and show details in parallel
        const [episodeRes, creditsRes, showRes] = await Promise.all([
          fetch(`/api/tmdb/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`),
          fetch(`/api/tmdb/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}/credits`),
          fetch(`/api/tmdb/tv/${showId}`),
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [showId, seasonNumber, episodeNumber]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (error || !episode) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-destructive">
          {error || 'Episode not found'}
        </h1>
        <p className="text-muted-foreground mt-2">
          Unable to load episode details. Please try again later.
        </p>
        <Link
          href={`/app/show/${showId}`}
          className="inline-flex items-center gap-1 text-primary hover:underline mt-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to show
        </Link>
      </div>
    );
  }

  // Get still image URL (fallback to show backdrop if no still)
  const stillUrl = getStillUrl(episode.still_path, 'large')
    || (showDetails?.backdrop_path ? getBackdropUrl(showDetails.backdrop_path, 'large') : null);

  // Format air date
  const formattedDate = episode.air_date
    ? new Date(episode.air_date).toLocaleDateString('en-US', {
        month: 'long',
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

  // Get guest stars
  const guestStars = credits?.guest_stars || [];

  return (
    <div className="min-h-screen pb-8">
      {/* Back navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href={`/app/show/${showId}`}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {showDetails?.name || 'show'}</span>
        </Link>
      </div>

      {/* Large still image */}
      {stillUrl && (
        <div className="relative aspect-video max-h-[500px] overflow-hidden bg-muted">
          <Image
            src={stillUrl}
            alt={`${episode.name} - S${seasonNumber}E${episodeNumber}`}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      )}

      {/* Episode info */}
      <div className="container mx-auto px-4 -mt-16 relative">
        <div className="bg-card rounded-lg p-6 shadow-lg">
          {/* Episode badge */}
          <div className="text-sm text-muted-foreground mb-2">
            Season {seasonNumber}, Episode {episodeNumber}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {episode.name}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            {formattedDate && <span>{formattedDate}</span>}
            {formattedRuntime && (
              <>
                {formattedDate && <span>•</span>}
                <span>{formattedRuntime}</span>
              </>
            )}
            {episode.vote_average > 0 && (
              <>
                <span>•</span>
                <span>★ {episode.vote_average.toFixed(1)}</span>
              </>
            )}
          </div>

          {/* Overview */}
          {episode.overview && (
            <p className="text-foreground leading-relaxed mb-8">
              {episode.overview}
            </p>
          )}

          {/* Main Cast section */}
          {mainCast.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Main Cast</h2>
                {hasMoreCast && (
                  <span className="text-sm text-muted-foreground">
                    +{(credits?.cast?.length || 0) - 10} more
                  </span>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                {mainCast.map((person) => (
                  <CastCard key={person.id} person={person} />
                ))}
              </div>
            </div>
          )}

          {/* Guest Stars section */}
          {guestStars.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Guest Stars</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                {guestStars.map((person) => (
                  <CastCard key={person.id} person={person} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
