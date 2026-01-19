'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Film, Loader2 } from 'lucide-react';
import { getPosterUrl } from '@/lib/tmdb/images';
import type { TMDBMultiSearchResult } from '@/lib/tmdb/types';
import Image from 'next/image';

interface LibraryStatus {
  inLibrary: boolean;
  titleId?: string;
}

type SearchResultWithStatus = TMDBMultiSearchResult & {
  libraryStatus?: LibraryStatus;
  isAdding?: boolean;
};

export function SearchClient() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResultWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce query input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/tmdb/search?query=${encodeURIComponent(debouncedQuery)}&type=multi`
        );

        if (!response.ok) {
          throw new Error('Failed to search');
        }

        const data = await response.json();
        const searchResults: SearchResultWithStatus[] = data.results || [];

        // Check library status for each result
        const resultsWithStatus = await Promise.all(
          searchResults.map(async (result) => {
            try {
              const statusResponse = await fetch(
                `/api/library/check?tmdbId=${result.id}`
              );
              if (statusResponse.ok) {
                const status = await statusResponse.json();
                return { ...result, libraryStatus: status };
              }
            } catch {
              // Ignore individual status check errors
            }
            return result;
          })
        );

        setResults(resultsWithStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleAdd = useCallback(async (result: SearchResultWithStatus) => {
    // Update UI to show loading
    setResults((prev) =>
      prev.map((r) => (r.id === result.id ? { ...r, isAdding: true } : r))
    );

    try {
      const response = await fetch('/api/library/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: result.id,
          mediaType: result.media_type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to library');
      }

      const data = await response.json();

      // Update UI to show "In Library"
      setResults((prev) =>
        prev.map((r) =>
          r.id === result.id
            ? {
                ...r,
                isAdding: false,
                libraryStatus: { inLibrary: true, titleId: data.id },
              }
            : r
        )
      );
    } catch (err) {
      console.error('Error adding to library:', err);
      // Reset loading state on error
      setResults((prev) =>
        prev.map((r) => (r.id === result.id ? { ...r, isAdding: false } : r))
      );
    }
  }, []);

  const getTitle = (result: TMDBMultiSearchResult): string => {
    if (result.media_type === 'tv') {
      return result.name;
    }
    return result.title;
  };

  const getYear = (result: TMDBMultiSearchResult): string => {
    const dateStr =
      result.media_type === 'tv' ? result.first_air_date : result.release_date;
    if (!dateStr) return '';
    return dateStr.substring(0, 4);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search TV shows and movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
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
      {!isLoading && !error && debouncedQuery && results.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No results found for &quot;{debouncedQuery}&quot;</p>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => {
            const posterUrl = getPosterUrl(result.poster_path);
            const title = getTitle(result);
            const year = getYear(result);
            const inLibrary = result.libraryStatus?.inLibrary ?? false;
            const isAdding = result.isAdding ?? false;

            return (
              <div
                key={`${result.media_type}-${result.id}`}
                className="bg-card rounded-lg overflow-hidden border"
              >
                {/* Poster */}
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
                  <h3 className="font-semibold line-clamp-1" title={title}>
                    {title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {year && <span>{year}</span>}
                    <span className="px-2 py-0.5 bg-muted rounded text-xs uppercase">
                      {result.media_type === 'tv' ? 'TV Show' : 'Movie'}
                    </span>
                  </div>

                  {/* Action Button */}
                  {inLibrary ? (
                    <Button variant="secondary" disabled className="w-full">
                      In Library
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleAdd(result)}
                      disabled={isAdding}
                      className="w-full"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add to Library'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Initial State */}
      {!isLoading && !debouncedQuery && (
        <div className="text-center py-12 text-muted-foreground">
          <Film className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Start typing to search for TV shows and movies</p>
        </div>
      )}
    </div>
  );
}
