'use client';

import Image from 'next/image';
import { Film, Play } from 'lucide-react';
import { getStillUrl } from '@/lib/tmdb/images';
import { cn } from '@/lib/utils';

export interface EpisodeTileProps {
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview: string;
  stillPath: string | null;
  airDate: string;
  onClick?: () => void;
  isWatched?: boolean;
}

/**
 * Episode tile component for displaying individual episodes.
 * Cinema Lounge horizontal layout with gold episode number badge.
 */
export function EpisodeTile({
  episodeNumber,
  seasonNumber,
  name,
  overview,
  stillPath,
  airDate,
  onClick,
  isWatched = false,
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
      className={cn(
        'group flex gap-4 bg-elevated rounded-[12px] overflow-hidden border border-primary/10 p-3 shadow-cinema card-hover',
        onClick && 'cursor-pointer',
        isWatched && 'opacity-60'
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {/* Still image - 16:9 aspect ratio, fixed width */}
      <div className="relative flex-shrink-0 w-40 aspect-video rounded-[8px] overflow-hidden bg-interactive">
        {stillUrl ? (
          <Image
            src={stillUrl}
            alt={`${name} - S${seasonNumber}E${episodeNumber}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Film className="h-6 w-6" />
          </div>
        )}

        {/* Episode number badge overlay - gold Cinema Lounge style */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-[6px] text-xs font-mono font-semibold tracking-wider">
          E{episodeNumber}
        </div>

        {/* Play overlay on hover */}
        {onClick && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-3 rounded-full bg-primary text-primary-foreground">
              <Play className="h-5 w-5" />
            </div>
          </div>
        )}
      </div>

      {/* Info - horizontal layout */}
      <div className="flex-1 min-w-0 py-1 space-y-2">
        {/* Episode title */}
        <h4 className="font-serif font-semibold text-foreground line-clamp-1" title={name}>
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
          <p className="text-xs text-hint">{formattedDate}</p>
        )}
      </div>
    </div>
  );
}
