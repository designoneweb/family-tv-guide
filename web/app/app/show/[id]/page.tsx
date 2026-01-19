import { ShowClient } from './show-client';

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
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-destructive">Invalid Show ID</h1>
        <p className="text-muted-foreground mt-2">
          The show ID provided is not valid.
        </p>
      </div>
    );
  }

  return <ShowClient tmdbId={tmdbId} />;
}
