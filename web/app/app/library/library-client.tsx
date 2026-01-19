'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, Film, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TitleCard } from '@/components/title-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { MediaType } from '@/lib/database.types';

interface Provider {
  name: string;
  logoPath: string;
}

interface LibraryTitle {
  id: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  year: string;
  providers: Provider[];
}

type FilterType = 'all' | 'tv' | 'movie';

export function LibraryClient() {
  const [titles, setTitles] = useState<LibraryTitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<LibraryTitle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch library on mount
  useEffect(() => {
    const fetchLibrary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/library');
        if (!response.ok) {
          throw new Error('Failed to fetch library');
        }
        const data = await response.json();
        setTitles(data.titles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load library');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  // Handle remove action - open confirmation dialog
  const handleRemoveClick = useCallback((title: LibraryTitle) => {
    setDeleteTarget(title);
  }, []);

  // Confirm deletion
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/library/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove title');
      }

      // Remove from local state
      setTitles((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    } catch (err) {
      console.error('Error removing title:', err);
      // Could show error toast here
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  // Cancel deletion
  const handleCancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  // Filter titles based on selected filter
  const filteredTitles = titles.filter((title) => {
    if (filter === 'all') return true;
    return title.mediaType === filter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Library</h1>
          <p className="text-muted-foreground mt-1">
            {titles.length} {titles.length === 1 ? 'title' : 'titles'} in your library
          </p>
        </div>
        <Link href="/app/library/search">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Titles
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={filter === 'tv' ? 'default' : 'outline'}
          onClick={() => setFilter('tv')}
          size="sm"
        >
          TV Shows
        </Button>
        <Button
          variant={filter === 'movie' ? 'default' : 'outline'}
          onClick={() => setFilter('movie')}
          size="sm"
        >
          Movies
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 text-destructive">
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && titles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Film className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-4">No titles in your library.</p>
          <Link href="/app/library/search">
            <Button>Search to add some!</Button>
          </Link>
        </div>
      )}

      {/* No Results for Filter */}
      {!isLoading && !error && titles.length > 0 && filteredTitles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No {filter === 'tv' ? 'TV shows' : 'movies'} in your library.</p>
        </div>
      )}

      {/* Title Grid */}
      {!isLoading && filteredTitles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTitles.map((title) => (
            <TitleCard
              key={title.id}
              tmdbId={title.tmdbId}
              mediaType={title.mediaType}
              title={title.title}
              posterPath={title.posterPath}
              year={title.year}
              providers={title.providers}
              inLibrary={true}
              onRemove={() => handleRemoveClick(title)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Library?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;{deleteTarget?.title}&quot; from your library?
              This will also remove any schedule entries and progress for this title.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
