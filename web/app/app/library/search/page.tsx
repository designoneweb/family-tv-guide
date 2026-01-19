import { ProfileGuard } from '@/components/profile-guard';
import { SearchClient } from './search-client';

export default function SearchPage() {
  return (
    <ProfileGuard>
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Add to Library</h1>
            <p className="text-muted-foreground mt-1">
              Search for TV shows and movies to add to your library
            </p>
          </div>
          <SearchClient />
        </div>
      </div>
    </ProfileGuard>
  );
}
