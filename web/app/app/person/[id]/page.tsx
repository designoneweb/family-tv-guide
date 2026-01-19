import { PersonClient } from './person-client';

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const personId = parseInt(id, 10);

  if (isNaN(personId)) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-destructive">Invalid person ID</h1>
        <p className="text-muted-foreground mt-2">
          Please provide a valid person ID.
        </p>
      </div>
    );
  }

  return <PersonClient personId={personId} />;
}
