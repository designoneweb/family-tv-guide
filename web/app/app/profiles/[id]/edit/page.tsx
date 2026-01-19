import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentHousehold } from '@/lib/services/household';
import { getProfileById } from '@/lib/services/profile';
import { EditProfileForm } from './edit-profile-form';

interface EditProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProfilePage({ params }: EditProfilePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user's household
  const household = await getCurrentHousehold(supabase);

  if (!household) {
    console.error('No household found for user');
    redirect('/login');
  }

  // Get the profile
  const result = await getProfileById(supabase, id);

  if (result.error || !result.data) {
    notFound();
  }

  const profile = result.data;

  // Ensure profile belongs to this household
  if (profile.household_id !== household.id) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
        <p className="text-muted-foreground mb-8">
          Update profile settings for {profile.name}
        </p>

        <div className="rounded-xl border border-border bg-card p-6">
          <EditProfileForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
