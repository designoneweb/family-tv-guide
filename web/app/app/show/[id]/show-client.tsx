'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EpisodeTile } from '@/components/episode-tile';
import { ProviderLogos, type Provider } from '@/components/provider-logos';
import { getBackdropUrl, getProfileUrl } from '@/lib/tmdb/images';
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
      className="flex-shrink-0 w-24 cursor-pointer transition-transform duration-150 hover:scale-[1.02]"
    >
      <div className="aspect-[2/3] relative bg-muted rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
            <User className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="mt-2 text-xs">
        <p className="font-medium line-clamp-1" title={person.name}>{person.name}</p>
        {person.character && (
          <p className="text-muted-foreground line-clamp-1" title={person.character}>
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

  // Loading state
  if (isLoadingShow) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (error || !showDetails) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-destructive">
          {error || 'Show not found'}
        </h1>
        <p className="text-muted-foreground mt-2">
          Unable to load show details. Please try again later.
        </p>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(showDetails.backdrop_path, 'large');
  const totalSeasons = showDetails.number_of_seasons;
  const useDropdown = totalSeasons > 6;

  // Generate season numbers array (1 to totalSeasons)
  const seasonNumbers = Array.from({ length: totalSeasons }, (_, i) => i + 1);

  // Get year range for display
  const startYear = showDetails.first_air_date?.substring(0, 4);
  const yearDisplay = startYear ? (showDetails.status === 'Ended' ? startYear : `${startYear}-`) : '';

  // Get top 10 cast members for display
  const mainCast = credits?.cast?.slice(0, 10) || [];
  const hasMoreCast = (credits?.cast?.length || 0) > 10;

  return (
    <div className="min-h-screen">
      {/* Header with backdrop */}
      <div className="relative">
        {backdropUrl && (
          <div className="absolute inset-0 h-64 overflow-hidden">
            <Image
              src={backdropUrl}
              alt={showDetails.name}
              fill
              className="object-cover opacity-30"
              unoptimized
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          </div>
        )}

        <div className="container mx-auto py-8 px-4 relative">
          <h1 className="text-3xl font-bold mb-4">{showDetails.name}</h1>

          {/* Metadata row: rating, year, seasons */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            {showDetails.vote_average > 0 && (
              <span className="font-medium">
                <span className="text-yellow-500">&#9733;</span> {showDetails.vote_average.toFixed(1)}/10
              </span>
            )}
            {yearDisplay && <span>{yearDisplay}</span>}
            <span>{totalSeasons} {totalSeasons === 1 ? 'Season' : 'Seasons'}</span>
            {showDetails.genres && showDetails.genres.length > 0 && (
              <span>{showDetails.genres.map((g) => g.name).join(', ')}</span>
            )}
          </div>

          {/* Streaming providers */}
          {providers.length > 0 && (
            <div className="mb-4">
              <ProviderLogos providers={providers} maxDisplay={6} />
            </div>
          )}

          {/* Synopsis */}
          {showDetails.overview && (
            <p className="text-foreground/90 leading-relaxed mb-6 max-w-3xl">
              {showDetails.overview}
            </p>
          )}

          {/* Main Cast - horizontal scroll */}
          {mainCast.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Cast</h2>
                {hasMoreCast && (
                  <span className="text-sm text-muted-foreground">
                    +{(credits?.cast?.length || 0) - 10} more
                  </span>
                )}
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                {mainCast.map((person) => (
                  <CastCard key={person.id} person={person} />
                ))}
              </div>
            </div>
          )}

          {/* Season Selector */}
          <div className="mb-6">
            {useDropdown ? (
              <Select
                value={selectedSeasonNumber.toString()}
                onValueChange={(value) => handleSeasonChange(parseInt(value, 10))}
              >
                <SelectTrigger className="w-[180px]">
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
              <Tabs
                value={selectedSeasonNumber.toString()}
                onValueChange={(value) => handleSeasonChange(parseInt(value, 10))}
              >
                <TabsList>
                  {seasonNumbers.map((num) => (
                    <TabsTrigger key={num} value={num.toString()}>
                      Season {num}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </div>
        </div>
      </div>

      {/* Episode Grid */}
      <div className="container mx-auto px-4 pb-8">
        {isLoadingSeason ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : currentSeason?.episodes && currentSeason.episodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          <div className="text-center py-12 text-muted-foreground">
            No episodes found for this season.
          </div>
        )}
      </div>
    </div>
  );
}
