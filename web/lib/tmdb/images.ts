/**
 * TMDB Image URL Helpers
 * Utility functions for constructing TMDB image URLs
 */

/**
 * Base URL for TMDB images
 */
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Size constants for different image types
 * These sizes rarely change and are hardcoded to avoid extra API calls
 */
export const TMDB_IMAGE_SIZES = {
  poster: { small: 'w185', medium: 'w342', large: 'w500' },
  backdrop: { small: 'w300', medium: 'w780', large: 'w1280' },
  still: { small: 'w185', medium: 'w300', large: 'w300' },
  logo: { small: 'w92', medium: 'w154', large: 'w300' },
  profile: { small: 'w45', medium: 'w185', large: 'h632' },
} as const;

type ImageType = keyof typeof TMDB_IMAGE_SIZES;
type ImageSize = 'small' | 'medium' | 'large';

/**
 * Build a TMDB image URL
 *
 * @param path - The image path from TMDB (e.g., "/abc123.jpg")
 * @param type - The type of image (poster, backdrop, still, logo)
 * @param size - The size variant (small, medium, large)
 * @returns Full image URL or null if path is null
 */
export function getTMDBImageUrl(
  path: string | null,
  type: ImageType,
  size: ImageSize
): string | null {
  if (!path) {
    return null;
  }

  const sizeCode = TMDB_IMAGE_SIZES[type][size];
  return `${TMDB_IMAGE_BASE_URL}/${sizeCode}${path}`;
}

/**
 * Get poster image URL
 * Convenience wrapper defaulting to medium size
 *
 * @param path - The poster_path from TMDB
 * @param size - Size variant (default: medium)
 * @returns Full image URL or null
 */
export function getPosterUrl(
  path: string | null,
  size: ImageSize = 'medium'
): string | null {
  return getTMDBImageUrl(path, 'poster', size);
}

/**
 * Get backdrop image URL
 * Convenience wrapper defaulting to medium size
 *
 * @param path - The backdrop_path from TMDB
 * @param size - Size variant (default: medium)
 * @returns Full image URL or null
 */
export function getBackdropUrl(
  path: string | null,
  size: ImageSize = 'medium'
): string | null {
  return getTMDBImageUrl(path, 'backdrop', size);
}

/**
 * Get episode still image URL
 * Convenience wrapper defaulting to medium size
 *
 * @param path - The still_path from TMDB
 * @param size - Size variant (default: medium)
 * @returns Full image URL or null
 */
export function getStillUrl(
  path: string | null,
  size: ImageSize = 'medium'
): string | null {
  return getTMDBImageUrl(path, 'still', size);
}

/**
 * Get provider logo URL
 * Always uses small size for provider logos
 *
 * @param path - The logo_path from TMDB provider
 * @returns Full image URL or null
 */
export function getProviderLogoUrl(path: string | null): string | null {
  return getTMDBImageUrl(path, 'logo', 'small');
}

/**
 * Get profile image URL
 * Convenience wrapper defaulting to medium size
 *
 * @param path - The profile_path from TMDB
 * @param size - Size variant (default: medium)
 * @returns Full image URL or null
 */
export function getProfileUrl(
  path: string | null,
  size: ImageSize = 'medium'
): string | null {
  return getTMDBImageUrl(path, 'profile', size);
}
