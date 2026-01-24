'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProfile } from '@/lib/contexts/profile-context';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Profile, MaturityLevel } from '@/lib/database.types';

interface ProfileSelectionClientProps {
  profiles: Profile[];
  showMaturityBadges?: boolean;
}

/**
 * Get the color for a profile avatar based on the first character of the name.
 * Cinema Lounge palette with rich, warm colors.
 */
function getAvatarColor(name: string): string {
  const colors = [
    'bg-primary',
    'bg-secondary',
    'bg-tertiary',
    'bg-genre-drama',
    'bg-genre-action',
    'bg-genre-scifi',
    'bg-genre-documentary',
    'bg-genre-animation',
  ];
  const charCode = name.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
}

/**
 * Get a readable label for maturity level.
 */
function getMaturityLabel(level: MaturityLevel): string {
  const labels: Record<MaturityLevel, string> = {
    kids: 'Kids',
    teen: 'Teen',
    adult: 'Adult',
  };
  return labels[level];
}

/**
 * Get badge variant for maturity level.
 */
function getMaturityVariant(level: MaturityLevel): 'default' | 'secondary' | 'outline' {
  const variants: Record<MaturityLevel, 'default' | 'secondary' | 'outline'> = {
    kids: 'default',
    teen: 'outline',
    adult: 'secondary',
  };
  return variants[level];
}

export function ProfileSelectionClient({ profiles, showMaturityBadges = false }: ProfileSelectionClientProps) {
  const router = useRouter();
  const { activeProfileId, setActiveProfile } = useProfile();
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const handleSelectProfile = (profile: Profile) => {
    setSelectingId(profile.id);

    // Brief delay for selection animation
    setTimeout(() => {
      setActiveProfile(profile.id);
      router.push('/app');
    }, 200);
  };

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-10 stagger-children">
      {profiles.map((profile, index) => {
        const initial = profile.name.charAt(0).toUpperCase();
        const avatarColor = getAvatarColor(profile.name);
        const isSelecting = selectingId === profile.id;
        const isActive = profile.id === activeProfileId;

        return (
          <button
            key={profile.id}
            type="button"
            onClick={() => handleSelectProfile(profile)}
            className={cn(
              'group flex flex-col items-center gap-4 w-[140px] focus:outline-none',
              'animate-fade-in-up'
            )}
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            aria-label={`Select profile: ${profile.name}${showMaturityBadges ? `, ${getMaturityLabel(profile.maturity_level)}` : ''}`}
          >
            {/* Avatar Container */}
            <div
              className={cn(
                'relative w-[120px] h-[120px] rounded-[32px] flex items-center justify-center',
                'border-[3px] border-transparent',
                'transition-all duration-300 ease-out',
                'group-hover:border-primary group-hover:scale-[1.08] group-hover:shadow-gold-glow',
                'group-focus-visible:border-primary group-focus-visible:scale-[1.08] group-focus-visible:shadow-gold-glow group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background',
                isSelecting && 'scale-95 border-primary',
                isActive && 'border-primary/50',
                avatarColor
              )}
            >
              {/* Avatar Initial */}
              <span className="font-serif text-4xl font-semibold text-primary-foreground select-none">
                {initial}
              </span>
            </div>

            {/* Profile Name */}
            <span
              className={cn(
                'text-lg font-medium text-muted-foreground text-center truncate max-w-full',
                'transition-colors duration-200',
                'group-hover:text-foreground group-focus-visible:text-foreground'
              )}
            >
              {profile.name}
            </span>

            {/* Maturity Badge (conditional) */}
            {showMaturityBadges && (
              <Badge variant={getMaturityVariant(profile.maturity_level)} size="sm">
                {getMaturityLabel(profile.maturity_level)}
              </Badge>
            )}
          </button>
        );
      })}

      {/* Add Profile Card */}
      <Link
        href="/app/profiles?create=true"
        className={cn(
          'group flex flex-col items-center gap-4 w-[140px] focus:outline-none',
          'animate-fade-in-up'
        )}
        style={{ animationDelay: `${0.2 + profiles.length * 0.1}s` }}
        aria-label="Add new profile"
      >
        {/* Dashed Avatar Container */}
        <div
          className={cn(
            'relative w-[120px] h-[120px] rounded-[32px] flex items-center justify-center',
            'border-2 border-dashed border-interactive bg-transparent',
            'transition-all duration-300 ease-out',
            'group-hover:border-primary group-hover:scale-[1.08]',
            'group-focus-visible:border-primary group-focus-visible:scale-[1.08] group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background'
          )}
        >
          <Plus
            className={cn(
              'w-12 h-12 text-interactive',
              'transition-colors duration-200',
              'group-hover:text-primary group-focus-visible:text-primary'
            )}
          />
        </div>

        {/* Label */}
        <span
          className={cn(
            'text-lg font-medium text-muted-foreground text-center',
            'transition-colors duration-200',
            'group-hover:text-foreground group-focus-visible:text-foreground'
          )}
        >
          Add Profile
        </span>
      </Link>
    </div>
  );
}

/**
 * Empty state component for first-time users with no profiles
 */
export function EmptyProfileState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
      <Link
        href="/app/profiles?create=true"
        className="group flex flex-col items-center gap-6 focus:outline-none"
      >
        {/* Large Add Card */}
        <div
          className={cn(
            'relative w-[200px] h-[200px] rounded-[40px] flex flex-col items-center justify-center gap-4',
            'border-2 border-dashed border-primary/50 bg-elevated/50',
            'transition-all duration-300 ease-out',
            'group-hover:border-primary group-hover:scale-[1.05] group-hover:shadow-gold-glow',
            'group-focus-visible:border-primary group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background'
          )}
        >
          <div className="relative">
            <Plus className="w-16 h-16 text-primary" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary-light" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
            Create Your First Profile
          </h3>
          <p className="text-muted-foreground">
            Start by adding a family member
          </p>
        </div>
      </Link>
    </div>
  );
}
