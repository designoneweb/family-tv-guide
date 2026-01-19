import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Family TV Guide
          </h1>
          <p className="mt-4 text-2xl text-muted-foreground">
            What are we watching tonight?
          </p>

          <ul className="mt-12 space-y-4 text-left text-lg text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span>Schedule shows by day of week</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span>Track progress per family member</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span>Browse episodes with art-forward design</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span>Explore cast and filmographies</span>
            </li>
          </ul>

          <Link
            href="/login"
            className="mt-12 inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Log In
          </Link>
        </div>
      </main>

      <footer className="border-t border-border p-4 text-center text-sm text-muted-foreground">
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </div>
  );
}
