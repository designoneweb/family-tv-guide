import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentHousehold } from '@/lib/services/household';
import { NewProfileForm } from './new-profile-form';

export default async function NewProfilePage() {
  const supabase = await createClient();

  // Get current user's household
  const household = await getCurrentHousehold(supabase);

  if (!household) {
    console.error('No household found for user');
    redirect('/login');
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create Profile</h1>
        <p className="text-muted-foreground mb-8">
          Add a new profile to your household
        </p>

        <div className="rounded-xl border border-border bg-card p-6">
          <NewProfileForm householdId={household.id} />
        </div>
      </div>
    </div>
  );
}
