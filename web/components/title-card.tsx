'use client';

import Image from 'next/image';
import { Film, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPosterUrl } from '@/lib/tmdb/images';

export interface TitleCardProps {
  tmdbId: number;
  mediaType: 'tv' | 'movie';
  title: string;
  posterPath: string | null;
  year?: string;
  inLibrary?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  isLoading?: boolean;
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
  inLibrary = false,
  onAdd,
  onRemove,
  isLoading = false,
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

        {/* Year and media type row */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {year && <span>{year}</span>}
          <span className="px-2 py-0.5 bg-muted rounded text-xs uppercase">
            {mediaType === 'tv' ? 'TV Show' : 'Movie'}
          </span>
        </div>

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
