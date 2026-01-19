import { ProfileGuard } from '@/components/profile-guard';
import { TonightClient } from './tonight-client';

export default function TonightPage() {
  return (
    <ProfileGuard>
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <TonightClient />
        </div>
      </div>
    </ProfileGuard>
  );
}
