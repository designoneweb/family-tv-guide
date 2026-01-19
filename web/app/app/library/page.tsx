import { ProfileGuard } from '@/components/profile-guard';
import { LibraryClient } from './library-client';

export default function LibraryPage() {
  return (
    <ProfileGuard>
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <LibraryClient />
        </div>
      </div>
    </ProfileGuard>
  );
}
