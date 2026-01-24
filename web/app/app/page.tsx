import { redirect } from 'next/navigation';
import { ProfileGuard } from '@/components/profile-guard';

/**
 * App home page - redirects to Tonight view
 * The Tonight view is the main landing page after profile selection
 */
export default function AppPage() {
  redirect('/app/tonight');
}
