# Phase 3 Discovery: TMDB Integration

**Level:** 2 - Standard Research
**Date:** 2026-01-19

## Research Questions

1. Which TMDB API version to use?
2. What are the rate limits?
3. How to construct image URLs?
4. What endpoints do we need?

## Findings

### API Version

- **TMDB API v3** is the current stable version
- Authentication: Bearer token via `Authorization: Bearer {api_key}` header
- Base URL: `https://api.themoviedb.org/3`
- API key obtained from TMDB account settings

### Rate Limiting

- Legacy rate limits (40 requests/10 seconds) were **disabled** in December 2019
- Current soft limit: ~40 requests/second
- Respect 429 responses if received
- **Impact:** Very generous for our use case (family app with 20-40 shows)

### Image URL Construction

Pattern: `https://image.tmdb.org/t/p/{size}/{file_path}`

Where:
- `{size}` is a predefined size (e.g., `w500`, `w780`, `original`)
- `{file_path}` is returned from API (e.g., `/1E5baAaEse26fej7uHcjOgEE2t2.jpg`)

Available sizes (can be fetched from `/configuration` endpoint):
- Posters: `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`
- Backdrops: `w300`, `w780`, `w1280`, `original`
- Stills: `w92`, `w185`, `w300`, `original`

**Decision:** Hardcode common sizes rather than fetching config (simpler, sizes rarely change)

### Required Endpoints

| Endpoint | Method | Use Case |
|----------|--------|----------|
| `/search/tv` | GET | Search for TV shows |
| `/search/movie` | GET | Search for movies |
| `/tv/{series_id}` | GET | Get TV show details |
| `/movie/{movie_id}` | GET | Get movie details |
| `/tv/{series_id}/watch/providers` | GET | Get streaming providers |
| `/movie/{movie_id}/watch/providers` | GET | Get streaming providers |

### Response Shapes (Relevant Fields)

**Search TV Response:**
```typescript
{
  page: number;
  results: Array<{
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    vote_average: number;
    popularity: number;
  }>;
  total_pages: number;
  total_results: number;
}
```

**TV Details Response:**
```typescript
{
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string; // "Returning Series", "Ended", etc.
  genres: Array<{ id: number; name: string }>;
}
```

**Watch Providers Response:**
```typescript
{
  id: number;
  results: {
    US?: {
      link: string;
      flatrate?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
      rent?: Array<...>;
      buy?: Array<...>;
    };
    // ... other countries
  };
}
```

## Decisions

1. **Server-side only:** All TMDB calls go through Next.js server actions or API routes. TMDB API key never exposed to client.

2. **Hardcode image sizes:** Use fixed size constants rather than dynamic config fetch. Sizes: `w342` for posters, `w780` for backdrops, `w300` for stills.

3. **US region for providers:** Start with US region for watch providers, can expand later.

4. **No local caching in Phase 3:** Rely on TMDB's generous limits. Caching strategy for later if needed.

5. **Service pattern:** Follow established `lib/services/*.ts` pattern for TMDB functions.

## Architecture

```
web/lib/
├── tmdb/
│   ├── client.ts       # Base fetch wrapper with auth
│   ├── types.ts        # Response types for API
│   ├── search.ts       # Search functions
│   ├── details.ts      # Details functions
│   ├── providers.ts    # Watch provider functions
│   └── images.ts       # Image URL helpers
```

## Next Steps

Create 2 plans:
1. **03-01**: TMDB client setup + search endpoints
2. **03-02**: Metadata fetching + watch providers + image helpers
