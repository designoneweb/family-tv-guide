'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, AlertCircle, Star, Calendar, Clock, Tv } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EpisodeTile } from '@/components/episode-tile';
import { ProviderLogos, type Provider } from '@/components/provider-logos';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { getBackdropUrl, getProfileUrl, getPosterUrl } from '@/lib/tmdb/images';
import type { TMDBTVDetails, TMDBSeason, TMDBTVCredits, TMDBCastMember, TMDBWatchProviderResult } from '@/lib/tmdb/types';

interface ShowClientProps {
  tmdbId: number;
}

/**
 * Cast card component for displaying actor info with clickable navigation.
 */
function CastCard({ person }: { person: TMDBCastMember }) {
  const profileUrl = getProfileUrl(person.profile_path, 'medium');

  return (
    <Link
      href={`/app/person/${person.id}`}
      className="flex-shrink-0 w-[140px] group"
    >
      <div className="aspect-[2/3] relative bg-elevated rounded-xl overflow-hidden border border-primary/5 shadow-cinema transition-all duration-300 group-hover:scale-105 group-hover:shadow-gold-glow group-hover:border-primary/20">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={person.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-elevated">
            <User className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="font-medium text-sm text-foreground line-clamp-1" title={person.name}>
          {person.name}
        </p>
        {person.character && (
          <p className="text-xs text-muted-foreground line-clamp-1" title={person.character}>
            {person.character}
          </p>
        )}
      </div>
    </Link>
  );
}

/**
 * Client component for TV show page with episode grid and season selector.
 * Fetches show details and season data from TMDB API routes.
 */
export function ShowClient({ tmdbId }: ShowClientProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState<TMDBTVDetails | null>(null);
  const [credits, setCredits] = useState<TMDBTVCredits | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [currentSeason, setCurrentSeason] = useState<TMDBSeason | null>(null);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(1);
  const [isLoadingShow, setIsLoadingShow] = useState(true);
  const [isLoadingSeason, setIsLoadingSeason] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  // Fetch show details, credits, and providers on mount
  useEffect(() => {
    async function fetchShowData() {
      setIsLoadingShow(true);
      setError(null);

      try {
        // Fetch show details, credits, and providers in parallel
        const [detailsRes, creditsRes, providersRes] = await Promise.all([
          fetch(`/api/tmdb/tv/${tmdbId}`),
          fetch(`/api/tmdb/tv/${tmdbId}/credits`),
          fetch(`/api/tmdb/tv/${tmdbId}/providers`),
        ]);

        if (!detailsRes.ok) {
          throw new Error('Failed to fetch show details');
        }
        const detailsData: TMDBTVDetails = await detailsRes.json();
        setShowDetails(detailsData);

        // Credits are optional - don't fail if unavailable
        if (creditsRes.ok) {
          const creditsData: TMDBTVCredits = await creditsRes.json();
          setCredits(creditsData);
        }

        // Providers are optional - don't fail if unavailable
        if (providersRes.ok) {
          const providersData: TMDBWatchProviderResult = await providersRes.json();
          if (providersData?.flatrate) {
            const providerLink = providersData.link;
            setProviders(
              providersData.flatrate.map((p) => ({
                name: p.provider_name,
                logoPath: p.logo_path,
                link: providerLink,
              }))
            );
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoadingShow(false);
      }
    }

    fetchShowData();
  }, [tmdbId]);

  // Fetch season data when show loads or season changes
  useEffect(() => {
    async function fetchSeason() {
      if (!showDetails) return;

      setIsLoadingSeason(true);

      try {
        const response = await fetch(
          `/api/tmdb/tv/${tmdbId}/season/${selectedSeasonNumber}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch season details');
        }
        const data: TMDBSeason = await response.json();
        setCurrentSeason(data);
      } catch (err) {
        console.error('Error fetching season:', err);
        setCurrentSeason(null);
      } finally {
        setIsLoadingSeason(false);
      }
    }

    fetchSeason();
  }, [tmdbId, selectedSeasonNumber, showDetails]);

  // Handle season change
  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeasonNumber(seasonNumber);
  };

  // Loading state - skeleton
  if (isLoadingShow) {
    return (
      <div className="animate-fade-in-up">
        {/* Hero Skeleton */}
        <div className="relative h-[50vh] md:h-[60vh]">
          <Skeleton className="absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
              <Skeleton className="hidden md:block w-[200px] h-[300px] rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-24 w-full max-w-2xl" />
              </div>
            </div>
          </div>
        </div>
        {/* Content Skeleton */}
        <div className="px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-3 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[180px] w-[140px] rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !showDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6 animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-destructive mb-2">
          {error || 'Show not found'}
        </h1>
        <p className="text-muted-foreground">
          Unable to load show details. Please try again later.
        </p>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(showDetails.backdrop_path, 'large');
  const posterUrl = getPosterUrl(showDetails.poster_path, 'medium');
  const totalSeasons = showDetails.number_of_seasons;
  const useDropdown = totalSeasons > 6;

  // Generate season numbers array (1 to totalSeasons)
  const seasonNumbers = Array.from({ length: totalSeasons }, (_, i) => i + 1);

  // Get year range for display
  const startYear = showDetails.first_air_date?.substring(0, 4);
  const endYear = showDetails.last_air_date?.substring(0, 4);
  const yearDisplay = startYear ? (
    showDetails.status === 'Ended' && endYear && startYear !== endYear
      ? `${startYear}-${endYear}`
      : showDetails.status === 'Ended'
        ? startYear
        : `${startYear}-`
  ) : '';

  // Get top 10 cast members for display
  const mainCast = credits?.cast?.slice(0, 10) || [];
  const hasMoreCast = (credits?.cast?.length || 0) > 10;

  // Check if overview should be truncated
  const shouldTruncateOverview = showDetails.overview && showDetails.overview.length > 300;

  return (
    <div className="animate-fade-in-up">
      {/* Immersive Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image with Ken Burns effect */}
        {backdropUrl && (
          <div className="absolute inset-0">
            <Image
              src={backdropUrl}
              alt={showDetails.name}
              fill
              className="object-cover animate-ken-burns"
              style={{ filter: 'saturate(0.8)' }}
              unoptimized
              priority
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
            {/* Vignette */}
            <div className="absolute inset-0 hero-vignette" />
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Poster (Desktop) */}
            {posterUrl && (
              <div className="hidden md:block flex-shrink-0">
                <div className="relative w-[200px] h-[300px] rounded-xl overflow-hidden border-2 border-primary/20 shadow-cinema-lg">
                  <Image
                    src={posterUrl}
                    alt={showDetails.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            )}

            {/* Show Info */}
            <div className="flex-1 max-w-2xl">
              {/* Title */}
              <h1
                className="font-serif text-page-title text-foreground mb-4"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
              >
                {showDetails.name}
              </h1>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {showDetails.vote_average > 0 && (
                  <Badge variant="default" className="gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {showDetails.vote_average.toFixed(1)}
                  </Badge>
                )}
                {yearDisplay && (
                  <Badge variant="outline" className="glass">
                    <Calendar className="h-3 w-3 mr-1" />
                    {yearDisplay}
                  </Badge>
                )}
                <Badge variant="outline" className="glass">
                  <Tv className="h-3 w-3 mr-1" />
                  {totalSeasons} {totalSeasons === 1 ? 'Season' : 'Seasons'}
                </Badge>
                {showDetails.episode_run_time?.[0] && (
                  <Badge variant="outline" className="glass">
                    <Clock className="h-3 w-3 mr-1" />
                    {showDetails.episode_run_time[0]} min
                  </Badge>
                )}
                {showDetails.genres?.slice(0, 2).map((genre) => (
                  <Badge key={genre.id} variant="secondary" className="glass">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              {/* Overview */}
              {showDetails.overview && (
                <div className="mb-4">
                  <p className={cn(
                    'text-muted-foreground leading-relaxed',
                    !isOverviewExpanded && shouldTruncateOverview && 'line-clamp-3'
                  )}>
                    {showDetails.overview}
                  </p>
                  {shouldTruncateOverview && (
                    <button
                      onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                      className="text-primary hover:text-primary-light text-sm font-medium mt-1 transition-colors"
                    >
                      {isOverviewExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}

              {/* Streaming Providers */}
              {providers.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Available on</span>
                  <ProviderLogos providers={providers} maxDisplay={6} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Cast Section */}
          {mainCast.length > 0 && (
            <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-section text-foreground">Cast</h2>
                {hasMoreCast && (
                  <span className="text-sm text-muted-foreground">
                    +{(credits?.cast?.length || 0) - 10} more
                  </span>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin">
                {mainCast.map((person) => (
                  <CastCard key={person.id} person={person} />
                ))}
              </div>
            </section>
          )}

          {/* Season Selector */}
          <section className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <h2 className="font-serif text-section text-foreground mb-4">Episodes</h2>
            <div className="mb-6">
              {useDropdown ? (
                <Select
                  value={selectedSeasonNumber.toString()}
                  onValueChange={(value) => handleSeasonChange(parseInt(value, 10))}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasonNumbers.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Season {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="inline-flex p-1 rounded-full glass border border-primary/10 overflow-x-auto max-w-full">
                  {seasonNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSeasonChange(num)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                        selectedSeasonNumber === num
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Season {num}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Episode Grid */}
            {isLoadingSeason ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-xl" />
                ))}
              </div>
            ) : currentSeason?.episodes && currentSeason.episodes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
                {currentSeason.episodes.map((episode) => (
                  <EpisodeTile
                    key={episode.id}
                    episodeNumber={episode.episode_number}
                    seasonNumber={episode.season_number}
                    name={episode.name}
                    overview={episode.overview}
                    stillPath={episode.still_path}
                    airDate={episode.air_date}
                    onClick={() => router.push(`/app/show/${tmdbId}/season/${episode.season_number}/episode/${episode.episode_number}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-elevated flex items-center justify-center mb-4 border border-primary/10">
                  <Tv className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <p className="text-lg text-muted-foreground">No episodes found for this season.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
