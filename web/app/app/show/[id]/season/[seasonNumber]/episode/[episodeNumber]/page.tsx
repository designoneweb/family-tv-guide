import { EpisodeClient } from './episode-client';

interface EpisodePageProps {
  params: Promise<{
    id: string;
    seasonNumber: string;
    episodeNumber: string;
  }>;
}

/**
 * Episode detail page server component.
 * Renders the EpisodeClient with parsed route params.
 */
export default async function EpisodePage({ params }: EpisodePageProps) {
  const { id, seasonNumber, episodeNumber } = await params;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <EpisodeClient
        showId={parseInt(id, 10)}
        seasonNumber={parseInt(seasonNumber, 10)}
        episodeNumber={parseInt(episodeNumber, 10)}
      />
    </div>
  );
}
