'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EpisodeTile } from '@/components/episode-tile';
import { getBackdropUrl } from '@/lib/tmdb/images';
import type { TMDBTVDetails, TMDBSeason } from '@/lib/tmdb/types';

interface ShowClientProps {
  tmdbId: number;
}

/**
 * Client component for TV show page with episode grid and season selector.
 * Fetches show details and season data from TMDB API routes.
 */
export function ShowClient({ tmdbId }: ShowClientProps) {
  const [showDetails, setShowDetails] = useState<TMDBTVDetails | null>(null);
  const [currentSeason, setCurrentSeason] = useState<TMDBSeason | null>(null);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(1);
  const [isLoadingShow, setIsLoadingShow] = useState(true);
  const [isLoadingSeason, setIsLoadingSeason] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch show details on mount
  useEffect(() => {
    async function fetchShowDetails() {
      setIsLoadingShow(true);
      setError(null);

      try {
        const response = await fetch(`/api/tmdb/tv/${tmdbId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch show details');
        }
        const data: TMDBTVDetails = await response.json();
        setShowDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoadingShow(false);
      }
    }

    fetchShowDetails();
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
          <h1 className="text-3xl font-bold mb-6">{showDetails.name}</h1>

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
