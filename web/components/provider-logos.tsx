'use client';

import Image from 'next/image';
import { getProviderLogoUrl } from '@/lib/tmdb/images';

export interface Provider {
  name: string;
  logoPath: string;
}

export interface ProviderLogosProps {
  providers: Provider[];
  maxDisplay?: number;
}

/**
 * Displays streaming provider logos in a row.
 * Shows up to maxDisplay providers (default: 4) with tooltips on hover.
 */
export function ProviderLogos({ providers, maxDisplay = 4 }: ProviderLogosProps) {
  if (!providers || providers.length === 0) {
    return null;
  }

  const displayProviders = providers.slice(0, maxDisplay);

  return (
    <div className="flex items-center gap-1.5">
      {displayProviders.map((provider) => {
        const logoUrl = getProviderLogoUrl(provider.logoPath);
        if (!logoUrl) return null;

        return (
          <div
            key={provider.name}
            className="relative w-6 h-6 rounded overflow-hidden bg-muted"
            title={provider.name}
          >
            <Image
              src={logoUrl}
              alt={provider.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        );
      })}
      {providers.length > maxDisplay && (
        <span className="text-xs text-muted-foreground">
          +{providers.length - maxDisplay}
        </span>
      )}
    </div>
  );
}
