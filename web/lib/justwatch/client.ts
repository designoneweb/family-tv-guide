/**
 * JustWatch GraphQL API Client
 *
 * Provides episode-level streaming URLs for TV shows.
 * Uses simple in-memory caching to reduce API load.
 *
 * Note: This uses the unofficial JustWatch API which is for non-commercial use only.
 */

import type {
  JustWatchOffer,
  JustWatchEpisodeOffers,
  CacheEntry,
} from './types';

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// In-memory caches
const episodeOffersCache = new Map<string, CacheEntry<JustWatchEpisodeOffers>>();
const showIdCache = new Map<string, CacheEntry<string | null>>();

const JUSTWATCH_GRAPHQL_URL = 'https://apis.justwatch.com/graphql';

/**
 * Make a GraphQL request to JustWatch API
 */
async function graphqlRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch(JUSTWATCH_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`JustWatch API error: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(`GraphQL error: ${result.errors[0]?.message}`);
  }

  return result.data;
}

/**
 * Clean expired entries from cache
 */
function cleanCache<T>(cache: Map<string, CacheEntry<T>>): void {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (entry.expiry < now) {
      cache.delete(key);
    }
  }
}

/**
 * Get cached value if valid
 */
function getCached<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
  const entry = cache.get(key);
  if (entry && entry.expiry > Date.now()) {
    return entry.data;
  }
  return null;
}

/**
 * Set cache value
 */
function setCache<T>(cache: Map<string, CacheEntry<T>>, key: string, data: T): void {
  cache.set(key, {
    data,
    expiry: Date.now() + CACHE_TTL,
  });
  // Periodically clean old entries
  if (cache.size > 100) {
    cleanCache(cache);
  }
}

// GraphQL Queries
const SEARCH_QUERY = `
query SearchTitles($searchQuery: String!, $country: Country!, $language: Language!) {
  popularTitles(country: $country, filter: { searchQuery: $searchQuery, objectTypes: [SHOW] }, first: 10) {
    edges {
      node {
        id
        objectType
        content(country: $country, language: $language) {
          title
          fullPath
          externalIds {
            tmdbId
          }
        }
      }
    }
  }
}
`;

const GET_SHOW_QUERY = `
query GetShow($nodeId: ID!, $country: Country!, $language: Language!) {
  node(id: $nodeId) {
    id
    ... on Show {
      content(country: $country, language: $language) {
        title
        fullPath
      }
      seasons {
        id
        content(country: $country, language: $language) {
          seasonNumber
        }
      }
    }
  }
}
`;

const GET_SEASON_QUERY = `
query GetSeason($nodeId: ID!, $country: Country!, $language: Language!) {
  node(id: $nodeId) {
    id
    ... on Season {
      content(country: $country, language: $language) {
        seasonNumber
      }
      episodes {
        id
        content(country: $country, language: $language) {
          episodeNumber
          title
        }
        offers(country: $country, platform: WEB) {
          standardWebURL
          monetizationType
          package {
            clearName
            packageId
          }
        }
      }
    }
  }
}
`;

interface SearchResult {
  popularTitles: {
    edges: Array<{
      node: {
        id: string;
        objectType: string;
        content: {
          title: string;
          fullPath: string;
          externalIds: {
            tmdbId: string | null;
          };
        };
      };
    }>;
  };
}

interface ShowResult {
  node: {
    id: string;
    content: {
      title: string;
      fullPath: string;
    };
    seasons: Array<{
      id: string;
      content: {
        seasonNumber: number;
      };
    }>;
  } | null;
}

interface SeasonResult {
  node: {
    id: string;
    content: {
      seasonNumber: number;
    };
    episodes: Array<{
      id: string;
      content: {
        episodeNumber: number;
        title: string;
      };
      offers: Array<{
        standardWebURL: string;
        monetizationType: string;
        package: {
          clearName: string;
          packageId: number;
        };
      }> | null;
    }>;
  } | null;
}

/**
 * Search for a show by title and find matching JustWatch ID
 * Uses TMDB ID for matching when available
 */
async function findShowId(
  title: string,
  tmdbId: number
): Promise<string | null> {
  const cacheKey = `${tmdbId}:${title}`;
  const cached = getCached(showIdCache, cacheKey);
  if (cached !== null || showIdCache.has(cacheKey)) {
    return cached;
  }

  try {
    const result = await graphqlRequest<SearchResult>(SEARCH_QUERY, {
      searchQuery: title,
      country: 'US',
      language: 'en',
    });

    const items = result.popularTitles?.edges || [];
    if (items.length === 0) {
      setCache(showIdCache, cacheKey, null);
      return null;
    }

    // Try to match by TMDB ID first
    const tmdbIdStr = String(tmdbId);
    for (const edge of items) {
      if (edge.node.content.externalIds?.tmdbId === tmdbIdStr) {
        setCache(showIdCache, cacheKey, edge.node.id);
        return edge.node.id;
      }
    }

    // Fallback: exact title match
    const normalizedTitle = title.toLowerCase().trim();
    for (const edge of items) {
      if (edge.node.content.title.toLowerCase().trim() === normalizedTitle) {
        setCache(showIdCache, cacheKey, edge.node.id);
        return edge.node.id;
      }
    }

    // Last resort: take the first result
    const firstResult = items[0].node.id;
    setCache(showIdCache, cacheKey, firstResult);
    return firstResult;
  } catch (error) {
    console.error('JustWatch search failed:', error);
    setCache(showIdCache, cacheKey, null);
    return null;
  }
}

/**
 * Get episode offers for a specific TV show episode
 *
 * @param tmdbId - TMDB ID of the TV show
 * @param title - Title of the TV show (for search)
 * @param seasonNumber - Season number (1-indexed)
 * @param episodeNumber - Episode number (1-indexed)
 * @returns Episode offers with streaming URLs
 */
export async function getEpisodeOffers(
  tmdbId: number,
  title: string,
  seasonNumber: number,
  episodeNumber: number
): Promise<JustWatchEpisodeOffers> {
  const cacheKey = `${tmdbId}:${seasonNumber}:${episodeNumber}`;
  const cached = getCached(episodeOffersCache, cacheKey);
  if (cached) {
    return cached;
  }

  const result: JustWatchEpisodeOffers = { offers: [] };

  try {
    // Step 1: Find the JustWatch show ID
    const showId = await findShowId(title, tmdbId);
    if (!showId) {
      setCache(episodeOffersCache, cacheKey, result);
      return result;
    }

    // Step 2: Get show details to find seasons
    const showResult = await graphqlRequest<ShowResult>(GET_SHOW_QUERY, {
      nodeId: showId,
      country: 'US',
      language: 'en',
    });

    if (!showResult.node) {
      setCache(episodeOffersCache, cacheKey, result);
      return result;
    }

    // Set show-level URL as fallback
    if (showResult.node.content?.fullPath) {
      result.showLevelUrl = `https://www.justwatch.com${showResult.node.content.fullPath}`;
    }

    // Step 3: Find the matching season
    const season = showResult.node.seasons?.find(
      (s) => s.content.seasonNumber === seasonNumber
    );
    if (!season) {
      setCache(episodeOffersCache, cacheKey, result);
      return result;
    }

    // Step 4: Get season details with episodes
    const seasonResult = await graphqlRequest<SeasonResult>(GET_SEASON_QUERY, {
      nodeId: season.id,
      country: 'US',
      language: 'en',
    });

    if (!seasonResult.node?.episodes) {
      setCache(episodeOffersCache, cacheKey, result);
      return result;
    }

    // Step 5: Find the matching episode
    const episode = seasonResult.node.episodes.find(
      (e) => e.content.episodeNumber === episodeNumber
    );
    if (!episode?.offers || episode.offers.length === 0) {
      setCache(episodeOffersCache, cacheKey, result);
      return result;
    }

    // Step 6: Map offers to our format (prioritize flatrate/subscription)
    const seenProviders = new Set<number>();
    for (const offer of episode.offers) {
      // Skip if we've already seen this provider (prefer first = usually flatrate)
      if (seenProviders.has(offer.package.packageId)) {
        continue;
      }

      result.offers.push({
        providerId: offer.package.packageId,
        providerName: offer.package.clearName,
        monetizationType: offer.monetizationType.toLowerCase() as 'flatrate' | 'rent' | 'buy' | 'free' | 'ads',
        url: offer.standardWebURL || '',
      });
      seenProviders.add(offer.package.packageId);
    }

    setCache(episodeOffersCache, cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Failed to fetch episode offers for ${title} S${seasonNumber}E${episodeNumber}:`, error);
    setCache(episodeOffersCache, cacheKey, result);
    return result;
  }
}

/**
 * Build a provider ID to offer URL map from episode offers
 * Used to enrich existing provider data with episode-specific URLs
 */
export function buildProviderUrlMap(offers: JustWatchOffer[]): Map<string, string> {
  const map = new Map<string, string>();

  for (const offer of offers) {
    // Only include offers with valid URLs and flatrate monetization
    if (offer.url && offer.monetizationType === 'flatrate') {
      // Map by provider name (normalized) since TMDB and JustWatch may use different IDs
      const normalizedName = offer.providerName.toLowerCase().trim();
      map.set(normalizedName, offer.url);
    }
  }

  return map;
}

/**
 * Clear all caches (useful for testing)
 */
export function clearCaches(): void {
  episodeOffersCache.clear();
  showIdCache.clear();
}
