'use client';

import Image from 'next/image';
import { Film, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPosterUrl } from '@/lib/tmdb/images';
import { ProviderLogos, type Provider } from '@/components/provider-logos';

export interface CurrentEpisode {
  season: number;
  episode: number;
  title: string;
  stillPath: string | null;
}

export interface TitleCardProps {
  tmdbId: number;
  mediaType: 'tv' | 'movie';
  title: string;
  posterPath: string | null;
  year?: string;
  providers?: Provider[];
  inLibrary?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  isLoading?: boolean;
  currentEpisode?: CurrentEpisode | null;
  onMarkWatched?: () => void;
  trackedTitleId?: string;
  isAdvancing?: boolean;
}

/**
 * Reusable title card component for displaying TV shows and movies.
 * Handles poster image, title, year, media type badge, and add/remove actions.
 */
export function TitleCard({
  mediaType,
  title,
  posterPath,
  year,
  providers,
  inLibrary = false,
  onAdd,
  onRemove,
  isLoading = false,
  currentEpisode,
  onMarkWatched,
  isAdvancing = false,
}: TitleCardProps) {
  const posterUrl = getPosterUrl(posterPath);

  return (
    <div className="bg-card rounded-lg overflow-hidden border">
      {/* Poster - 2:3 aspect ratio */}
      <div className="aspect-[2/3] relative bg-muted">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        {/* Title - truncate with ellipsis */}
        <h3 className="font-semibold line-clamp-1" title={title}>
          {title}
        </h3>

        {/* Episode info for TV shows */}
        {currentEpisode && (
          <p className="text-sm text-muted-foreground line-clamp-1" title={`S${currentEpisode.season}E${currentEpisode.episode}: ${currentEpisode.title}`}>
            S{currentEpisode.season}E{currentEpisode.episode}: {currentEpisode.title}
          </p>
        )}

        {/* Year and media type row */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {year && <span>{year}</span>}
          <span className="px-2 py-0.5 bg-muted rounded text-xs uppercase">
            {mediaType === 'tv' ? 'TV Show' : 'Movie'}
          </span>
        </div>

        {/* Streaming providers */}
        {providers && providers.length > 0 && (
          <ProviderLogos providers={providers} />
        )}

        {/* Mark Watched button for TV shows */}
        {currentEpisode && onMarkWatched && (
          <Button
            variant="outline"
            onClick={onMarkWatched}
            disabled={isAdvancing}
            className="w-full"
          >
            {isAdvancing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Advancing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Watched
              </>
            )}
          </Button>
        )}

        {/* Action button */}
        <div>
          {inLibrary && onRemove ? (
            <Button
              variant="destructive"
              onClick={onRemove}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </Button>
          ) : inLibrary && !onRemove ? (
            <Button variant="secondary" disabled className="w-full">
              In Library
            </Button>
          ) : onAdd ? (
            <Button onClick={onAdd} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to Library'
              )}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
