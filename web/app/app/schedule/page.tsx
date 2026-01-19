import { ProfileGuard } from '@/components/profile-guard';
import { ScheduleClient } from './schedule-client';

export default function SchedulePage() {
  return (
    <ProfileGuard>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <ScheduleClient />
        </div>
      </div>
    </ProfileGuard>
  );
}
