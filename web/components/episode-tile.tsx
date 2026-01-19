'use client';

import Image from 'next/image';
import { Film } from 'lucide-react';
import { getStillUrl } from '@/lib/tmdb/images';

export interface EpisodeTileProps {
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview: string;
  stillPath: string | null;
  airDate: string;
  onClick?: () => void;
}

/**
 * Episode tile component for displaying individual episodes in a grid.
 * Art-dominant layout with 16:9 still image, episode badge, title, and description.
 */
export function EpisodeTile({
  episodeNumber,
  seasonNumber,
  name,
  overview,
  stillPath,
  airDate,
  onClick,
}: EpisodeTileProps) {
  const stillUrl = getStillUrl(stillPath, 'medium');

  // Format air date for display (e.g., "Jan 15, 2024")
  const formattedDate = airDate
    ? new Date(airDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className={`bg-card rounded-lg overflow-hidden border ${onClick ? 'cursor-pointer hover:border-primary transition-colors' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {/* Still image - 16:9 aspect ratio */}
      <div className="aspect-video relative bg-muted">
        {stillUrl ? (
          <Image
            src={stillUrl}
            alt={`${name} - S${seasonNumber}E${episodeNumber}`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Film className="h-8 w-8" />
            <span className="text-sm">E{episodeNumber}</span>
          </div>
        )}

        {/* Episode number badge overlay */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 rounded text-xs font-medium text-white">
          E{episodeNumber}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        {/* Episode title - truncate to 1 line */}
        <h4 className="font-medium line-clamp-1" title={name}>
          {name}
        </h4>

        {/* Description - truncate to 2 lines */}
        {overview && (
          <p className="text-sm text-muted-foreground line-clamp-2" title={overview}>
            {overview}
          </p>
        )}

        {/* Air date */}
        {formattedDate && (
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        )}
      </div>
    </div>
  );
}
