import { ShowClient } from './show-client';
import { AlertCircle } from 'lucide-react';

interface ShowPageProps {
  params: Promise<{ id: string }>;
}

/**
 * TV Show page displaying episode grid with season navigation.
 * Server component that extracts show ID and delegates to client component.
 */
export default async function ShowPage({ params }: ShowPageProps) {
  const { id } = await params;
  const tmdbId = parseInt(id, 10);

  if (isNaN(tmdbId) || tmdbId < 1) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-destructive mb-2">Invalid Show ID</h1>
          <p className="text-muted-foreground">
            The show ID provided is not valid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <ShowClient tmdbId={tmdbId} />
    </div>
  );
}
