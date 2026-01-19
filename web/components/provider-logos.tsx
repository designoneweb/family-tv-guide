'use client';

import Image from 'next/image';
import { getProviderLogoUrl } from '@/lib/tmdb/images';

export interface Provider {
  name: string;
  logoPath: string;
  link?: string;
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

        const logoElement = (
          <div
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

        // Wrap in anchor if link is provided
        if (provider.link) {
          return (
            <a
              key={provider.name}
              href={provider.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 hover:scale-110 transition-all"
            >
              {logoElement}
            </a>
          );
        }

        return (
          <div key={provider.name}>
            {logoElement}
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
