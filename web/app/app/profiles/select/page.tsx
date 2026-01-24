import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentHousehold, getHouseholdProfiles } from '@/lib/services/household';
import { ProfileSelectionClient } from './profile-selection-client';
import { LogOut } from 'lucide-react';

export default async function ProfileSelectPage() {
  const supabase = await createClient();

  // Get current user's household
  const household = await getCurrentHousehold(supabase);

  if (!household) {
    console.error('No household found for user');
    redirect('/login');
  }

  // Get all profiles for the household
  const profiles = await getHouseholdProfiles(supabase, household.id);

  if (profiles.length === 0) {
    console.error('No profiles found for household');
    redirect('/login');
  }

  // Check if household has mixed maturity levels
  const maturityLevels = new Set(profiles.map(p => p.maturity_level));
  const showMaturityBadges = maturityLevels.size > 1;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-background" />

        {/* Radial gradient from center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(28,34,48,0.5)_0%,_transparent_70%)]" />

        {/* Ambient orbs - slow drifting animation */}
        <div
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px]"
          style={{ animation: 'pulse 30s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-tertiary/3 blur-[120px]"
          style={{ animation: 'pulse 25s ease-in-out infinite', animationDelay: '10s' }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[100px]"
          style={{ animation: 'pulse 35s ease-in-out infinite', animationDelay: '5s' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Logo */}
        <div className="mb-12 animate-fade-in-up">
          <h2
            className="font-serif text-2xl font-semibold text-foreground"
            style={{ textShadow: '0 0 40px rgba(212, 168, 83, 0.15)' }}
          >
            Family TV Guide
          </h2>
        </div>

        {/* Headline */}
        <h1
          className="text-page-title text-foreground text-center mb-16 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          Who&apos;s watching tonight?
        </h1>

        {/* Profile Cards */}
        <ProfileSelectionClient
          profiles={profiles}
          showMaturityBadges={showMaturityBadges}
        />

        {/* Manage Profiles link */}
        <div
          className="mt-12 animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          <Link
            href="/app/profiles"
            className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors"
          >
            Manage Profiles
          </Link>
        </div>
      </div>

      {/* Sign Out link - Fixed at bottom */}
      <div
        className="relative z-10 pb-12 text-center animate-fade-in-up"
        style={{ animationDelay: '0.7s' }}
      >
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="inline-flex items-center gap-2 text-sm text-hint hover:text-muted-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
