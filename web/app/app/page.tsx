import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome to Family TV Guide
        </h1>
        <p className="text-xl text-muted-foreground">
          Logged in as: {user?.email}
        </p>

        {/* Quick links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/app/profiles/select">
            <Button variant="outline">Switch Profile</Button>
          </Link>
          <Link href="/app/profiles">
            <Button variant="outline">Manage Profiles</Button>
          </Link>
        </div>

        <LogoutButton />
      </main>
    </div>
  );
}
