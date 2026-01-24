import { PersonClient } from './person-client';
import { AlertCircle } from 'lucide-react';

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const personId = parseInt(id, 10);

  if (isNaN(personId)) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-destructive mb-2">Invalid person ID</h1>
          <p className="text-muted-foreground">
            Please provide a valid person ID.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <PersonClient personId={personId} />
    </div>
  );
}
