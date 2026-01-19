'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, User, Calendar, MapPin, Film, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProfileUrl, getPosterUrl } from '@/lib/tmdb/images';
import type {
  TMDBPersonDetails,
  TMDBPersonCombinedCredits,
  TMDBPersonCastCredit,
  TMDBPersonCrewCredit,
} from '@/lib/tmdb/types';

interface PersonClientProps {
  personId: number;
}

type RoleFilter = 'all' | 'acting' | 'crew';
type MediaFilter = 'all' | 'tv' | 'movie';

/**
 * Credit card for filmography section
 */
function CreditCard({
  credit,
  type,
}: {
  credit: TMDBPersonCastCredit | TMDBPersonCrewCredit;
  type: 'cast' | 'crew';
}) {
  const posterUrl = getPosterUrl(credit.poster_path, 'small');
  const title = credit.name || credit.title || 'Unknown';
  const role =
    type === 'cast'
      ? (credit as TMDBPersonCastCredit).character
      : (credit as TMDBPersonCrewCredit).job;

  // Extract year from date
  const date = credit.first_air_date || credit.release_date;
  const year = date ? new Date(date).getFullYear() : null;

  // Episode count for TV shows
  const episodeCount =
    credit.media_type === 'tv' && 'episode_count' in credit
      ? (credit as TMDBPersonCastCredit).episode_count
      : null;

  const isTv = credit.media_type === 'tv';
  const href = isTv ? `/app/show/${credit.id}` : undefined;

  const cardContent = (
    <>
      <div className="aspect-[2/3] relative bg-muted rounded-lg overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            {isTv ? <Tv className="h-8 w-8" /> : <Film className="h-8 w-8" />}
          </div>
        )}
        {/* Episode count badge for TV */}
        {episodeCount && episodeCount > 1 && (
          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {episodeCount} eps
          </div>
        )}
        {/* Media type badge */}
        <div className="absolute top-1 left-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {isTv ? 'TV' : 'Movie'}
        </div>
      </div>
      <div className="mt-2 text-sm">
        <p className="font-medium line-clamp-1" title={title}>
          {title}
        </p>
        {role && (
          <p
            className="text-muted-foreground text-xs line-clamp-1"
            title={role}
          >
            {role}
          </p>
        )}
        {year && (
          <p className="text-muted-foreground text-xs">{year}</p>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block transition-transform duration-150 hover:scale-[1.02]"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="cursor-default" title="Movie pages coming soon">
      {cardContent}
    </div>
  );
}

/**
 * Person detail client component.
 * Fetches and displays person info with filmography.
 */
export function PersonClient({ personId }: PersonClientProps) {
  const router = useRouter();
  const [person, setPerson] = useState<TMDBPersonDetails | null>(null);
  const [credits, setCredits] = useState<TMDBPersonCombinedCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bioExpanded, setBioExpanded] = useState(false);

  // Filters
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch person details and credits in parallel
        const [personRes, creditsRes] = await Promise.all([
          fetch(`/api/tmdb/person/${personId}`),
          fetch(`/api/tmdb/person/${personId}/credits`),
        ]);

        if (!personRes.ok) {
          throw new Error('Person not found');
        }

        const personData: TMDBPersonDetails = await personRes.json();
        setPerson(personData);

        if (creditsRes.ok) {
          const creditsData: TMDBPersonCombinedCredits = await creditsRes.json();
          setCredits(creditsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [personId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (error || !person) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-destructive">
          {error || 'Person not found'}
        </h1>
        <p className="text-muted-foreground mt-2">
          Unable to load person details. Please try again later.
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-primary hover:underline mt-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
      </div>
    );
  }

  // Profile image
  const profileUrl = getProfileUrl(person.profile_path, 'large');

  // Format dates
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const birthDate = formatDate(person.birthday);
  const deathDate = formatDate(person.deathday);

  // Bio truncation
  const bio = person.biography || '';
  const shouldTruncateBio = bio.length > 500;
  const displayBio =
    shouldTruncateBio && !bioExpanded ? bio.slice(0, 500) + '...' : bio;

  // Filter and sort credits
  const getFilteredCredits = () => {
    if (!credits) return [];

    let allCredits: Array<{
      credit: TMDBPersonCastCredit | TMDBPersonCrewCredit;
      type: 'cast' | 'crew';
    }> = [];

    // Add cast credits
    if (roleFilter === 'all' || roleFilter === 'acting') {
      credits.cast.forEach((c) => allCredits.push({ credit: c, type: 'cast' }));
    }

    // Add crew credits
    if (roleFilter === 'all' || roleFilter === 'crew') {
      credits.crew.forEach((c) => allCredits.push({ credit: c, type: 'crew' }));
    }

    // Apply media filter
    if (mediaFilter !== 'all') {
      allCredits = allCredits.filter(
        (item) => item.credit.media_type === mediaFilter
      );
    }

    // Sort by date (most recent first)
    allCredits.sort((a, b) => {
      const dateA = a.credit.first_air_date || a.credit.release_date || '';
      const dateB = b.credit.first_air_date || b.credit.release_date || '';
      // Empty dates go to the end
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    // Dedupe by id + type (same show can appear multiple times with different roles)
    const seen = new Set<string>();
    return allCredits.filter((item) => {
      const key = `${item.credit.id}-${item.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const filteredCredits = getFilteredCredits();

  return (
    <div className="min-h-screen pb-8">
      {/* Back navigation */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Profile header */}
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-48 md:w-56 aspect-[2/3] relative bg-muted rounded-lg overflow-hidden">
                {profileUrl ? (
                  <Image
                    src={profileUrl}
                    alt={person.name}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <User className="h-16 w-16" />
                  </div>
                )}
              </div>
            </div>

            {/* Info column */}
            <div className="flex-1">
              {/* Name */}
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">
                {person.name}
              </h1>

              {/* Known for badge */}
              {person.known_for_department && (
                <div className="mb-4 text-center md:text-left">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {person.known_for_department}
                  </span>
                </div>
              )}

              {/* Dates and location */}
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                {birthDate && (
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Born: {birthDate}
                      {deathDate && ` — Died: ${deathDate}`}
                    </span>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <MapPin className="h-4 w-4" />
                    <span>{person.place_of_birth}</span>
                  </div>
                )}
              </div>

              {/* Biography */}
              {bio && (
                <div className="mt-4">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {displayBio}
                  </p>
                  {shouldTruncateBio && (
                    <button
                      onClick={() => setBioExpanded(!bioExpanded)}
                      className="text-primary hover:underline mt-2 text-sm"
                    >
                      {bioExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filmography section */}
      {credits && (credits.cast.length > 0 || credits.crew.length > 0) && (
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Filmography</h2>

            {/* Filter row */}
            <div className="flex flex-wrap gap-4 mb-6">
              {/* Role filter */}
              <div className="flex gap-1">
                <Button
                  variant={roleFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRoleFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={roleFilter === 'acting' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRoleFilter('acting')}
                >
                  Acting
                </Button>
                <Button
                  variant={roleFilter === 'crew' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRoleFilter('crew')}
                >
                  Crew
                </Button>
              </div>

              {/* Media filter */}
              <div className="flex gap-1">
                <Button
                  variant={mediaFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMediaFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={mediaFilter === 'tv' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMediaFilter('tv')}
                >
                  <Tv className="h-4 w-4 mr-1" />
                  TV
                </Button>
                <Button
                  variant={mediaFilter === 'movie' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMediaFilter('movie')}
                >
                  <Film className="h-4 w-4 mr-1" />
                  Movies
                </Button>
              </div>
            </div>

            {/* Credits grid */}
            {filteredCredits.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredCredits.map((item, idx) => (
                  <CreditCard
                    key={`${item.credit.id}-${item.type}-${idx}`}
                    credit={item.credit}
                    type={item.type}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No credits found for the selected filters.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
