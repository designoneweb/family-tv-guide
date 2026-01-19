export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Family TV Guide
        </h1>
        <p className="text-xl text-muted-foreground">
          Your household TV schedule, curated.
        </p>
      </main>
    </div>
  );
}
