import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentHousehold, getHouseholdProfiles } from '@/lib/services/household';
import { Button } from '@/components/ui/button';
import { ProfileListClient } from './profile-list-client';
import { Plus, ArrowLeft, Users } from 'lucide-react';

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
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Page Header */}
      <header className="px-6 lg:px-8 pt-6 pb-4 border-b border-primary/5 animate-fade-in-up">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* Title Section */}
          <div>
            <h1 className="font-serif text-page-title text-foreground">
              Manage Profiles
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage profiles for your household
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/app/profiles/select">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Selection</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <Link href="/app/profiles/new">
              <Button className="gap-2 btn-glow">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Profile</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Profile grid */}
      <div className="px-6 lg:px-8 py-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="max-w-4xl mx-auto">
          {profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-elevated flex items-center justify-center border border-primary/10">
                  <Users className="w-16 h-16 text-primary/40" />
                </div>
              </div>
              <h2 className="font-serif text-section text-foreground mb-2">
                No profiles yet
              </h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Create profiles for each family member to track watch progress separately.
              </p>
              <Link href="/app/profiles/new">
                <Button className="btn-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Profile
                </Button>
              </Link>
            </div>
          ) : (
            <ProfileListClient profiles={profiles} />
          )}
        </div>
      </div>
    </div>
  );
}
