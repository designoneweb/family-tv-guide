import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentHousehold, getHouseholdProfiles } from '@/lib/services/household';
import { Button } from '@/components/ui/button';
import { ProfileListClient } from './profile-list-client';

export default async function ProfilesPage() {
  const supabase = await createClient();

  // Get current user's household
  const household = await getCurrentHousehold(supabase);

  if (!household) {
    console.error('No household found for user');
    redirect('/login');
  }

  // Get all profiles for the household
  const profiles = await getHouseholdProfiles(supabase, household.id);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Profiles</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage profiles for your household
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/app/profiles/select">
              <Button variant="outline">Back to Selection</Button>
            </Link>
            <Link href="/app/profiles/new">
              <Button>Add Profile</Button>
            </Link>
          </div>
        </div>

        {/* Profile grid */}
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No profiles found.</p>
            <Link href="/app/profiles/new">
              <Button className="mt-4">Create Your First Profile</Button>
            </Link>
          </div>
        ) : (
          <ProfileListClient profiles={profiles} />
        )}
      </div>
    </div>
  );
}
