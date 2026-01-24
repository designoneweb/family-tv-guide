/**
 * JustWatch API Types
 * Types for the JustWatch GraphQL API responses
 */

// Monetization types for streaming offers
export type MonetizationType = 'flatrate' | 'rent' | 'buy' | 'free' | 'ads';

// A single streaming offer (where to watch)
export interface JustWatchOffer {
  providerId: number;
  providerName: string;
  monetizationType: MonetizationType;
  url: string;
}

// Episode offers response
export interface JustWatchEpisodeOffers {
  offers: JustWatchOffer[];
  showLevelUrl?: string; // Fallback URL at show level
}

// Cache entry type
export interface CacheEntry<T> {
  data: T;
  expiry: number;
}
