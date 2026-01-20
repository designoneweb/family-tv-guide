'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Film, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPosterUrl, getStillUrl } from '@/lib/tmdb/images';
import { ProviderLogos, type Provider } from '@/components/provider-logos';
import { JumpToEpisodeDialog } from '@/components/jump-to-episode-dialog';

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
  profileId?: string;
  onJumpToEpisode?: (newSeason: number, newEpisode: number) => void;
  isCaughtUp?: boolean;
}

/**
 * Reusable title card component for displaying TV shows and movies.
 * Handles poster image, title, year, media type badge, and add/remove actions.
 */
export function TitleCard({
  tmdbId,
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
  trackedTitleId,
  isAdvancing = false,
  profileId,
  onJumpToEpisode,
  isCaughtUp = false,
}: TitleCardProps) {
  const [jumpDialogOpen, setJumpDialogOpen] = useState(false);
  const posterUrl = getPosterUrl(posterPath);

  // Get episode still URL if current episode has a still
  const episodeStillUrl = currentEpisode?.stillPath
    ? getStillUrl(currentEpisode.stillPath, 'large')
    : null;

  // Determine which image to use: episode still (16:9) or poster (2:3)
  const useEpisodeStill = mediaType === 'tv' && currentEpisode && episodeStillUrl;
  const displayImageUrl = useEpisodeStill ? episodeStillUrl : posterUrl;
  const aspectRatioClass = useEpisodeStill ? 'aspect-video' : 'aspect-[2/3]';

  // Handle successful jump to episode
  const handleJumpSuccess = (newSeason: number, newEpisode: number) => {
    if (onJumpToEpisode) {
      onJumpToEpisode(newSeason, newEpisode);
    }
  };

  // Check if jump to episode is available (need trackedTitleId and profileId)
  const canJumpToEpisode = currentEpisode && trackedTitleId && profileId && onJumpToEpisode;

  // Determine image link destination:
  // - TV with currentEpisode: link to episode detail page
  // - TV without currentEpisode: link to show detail page
  // - Movie: no link (null)
  const imageUrl = mediaType === 'tv'
    ? currentEpisode
      ? `/app/show/${tmdbId}/season/${currentEpisode.season}/episode/${currentEpisode.episode}`
      : `/app/show/${tmdbId}`
    : null;

  // Link to show detail page (only for TV shows)
  const showDetailUrl = mediaType === 'tv' ? `/app/show/${tmdbId}` : null;

  return (
    <div className="bg-card rounded-lg overflow-hidden border">
      {/* Image - 16:9 for episode stills, 2:3 for posters, clickable for TV shows */}
      {imageUrl ? (
        <Link href={imageUrl} className={`block ${aspectRatioClass} relative bg-muted hover:opacity-90 transition-opacity`}>
          {displayImageUrl ? (
            <Image
              src={displayImageUrl}
              alt={currentEpisode ? `${title} - S${currentEpisode.season}E${currentEpisode.episode}` : title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Film className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </Link>
      ) : (
        <div className={`${aspectRatioClass} relative bg-muted`}>
          {displayImageUrl ? (
            <Image
              src={displayImageUrl}
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
      )}

      {/* Info */}
      <div className="p-4 space-y-3">
        {/* Title - truncate with ellipsis, clickable for TV shows */}
        {showDetailUrl ? (
          <Link href={showDetailUrl} className="block">
            <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors" title={title}>
              {title}
            </h3>
          </Link>
        ) : (
          <h3 className="font-semibold line-clamp-1" title={title}>
            {title}
          </h3>
        )}

        {/* Episode info for TV shows */}
        {currentEpisode && (
          canJumpToEpisode ? (
            <button
              onClick={() => setJumpDialogOpen(true)}
              className="text-sm text-muted-foreground line-clamp-1 text-left hover:text-primary hover:underline cursor-pointer transition-colors"
              title="Click to change episode"
            >
              S{currentEpisode.season}E{currentEpisode.episode}: {currentEpisode.title}
            </button>
          ) : (
            <p className="text-sm text-muted-foreground line-clamp-1" title={`S${currentEpisode.season}E${currentEpisode.episode}: ${currentEpisode.title}`}>
              S{currentEpisode.season}E{currentEpisode.episode}: {currentEpisode.title}
            </p>
          )
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
          isCaughtUp ? (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-green-500">
              <CheckCircle className="h-4 w-4" />
              All caught up!
            </div>
          ) : (
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
          )
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

      {/* Jump to Episode Dialog */}
      {canJumpToEpisode && trackedTitleId && profileId && currentEpisode && (
        <JumpToEpisodeDialog
          open={jumpDialogOpen}
          onOpenChange={setJumpDialogOpen}
          trackedTitleId={trackedTitleId}
          tmdbId={tmdbId}
          profileId={profileId}
          currentSeason={currentEpisode.season}
          currentEpisode={currentEpisode.episode}
          onSuccess={handleJumpSuccess}
        />
      )}
    </div>
  );
}
