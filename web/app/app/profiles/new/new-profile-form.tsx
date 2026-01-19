'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileForm } from '@/components/profile-form';
import { createClient } from '@/lib/supabase/client';
import { createProfile } from '@/lib/services/profile';
import type { MaturityLevel } from '@/lib/database.types';

interface NewProfileFormProps {
  householdId: string;
}

export function NewProfileForm({ householdId }: NewProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: {
    name: string;
    avatar: string;
    maturity_level: MaturityLevel;
  }) {
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const result = await createProfile(supabase, {
        ...data,
        household_id: householdId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Redirect to profile list
      router.push('/app/profiles');
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    router.push('/app/profiles');
  }

  return (
    <ProfileForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}
