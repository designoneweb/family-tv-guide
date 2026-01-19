import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentHousehold, getHouseholdProfiles } from '@/lib/services/household';
import { ProfileSelectionClient } from './profile-selection-client';

export default async function ProfileSelectPage() {
  const supabase = await createClient();

  // Get current user's household
  const household = await getCurrentHousehold(supabase);

  if (!household) {
    // No household found - this shouldn't happen with auto-provisioning,
    // but redirect to a fallback in case
    console.error('No household found for user');
    redirect('/login');
  }

  // Get all profiles for the household
  const profiles = await getHouseholdProfiles(supabase, household.id);

  if (profiles.length === 0) {
    // No profiles found - this also shouldn't happen with auto-provisioning
    console.error('No profiles found for household');
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          Who&apos;s Watching?
        </h1>
        <p className="text-muted-foreground text-center mb-12">
          Select your profile to continue
        </p>

        <ProfileSelectionClient profiles={profiles} />

        {/* Manage Profiles link - placeholder for future */}
        <div className="text-center mt-12">
          <button
            type="button"
            disabled
            className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Manage Profiles
          </button>
        </div>
      </div>
    </div>
  );
}
