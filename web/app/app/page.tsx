import { createClient } from "@/lib/supabase/server";
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
        <LogoutButton />
      </main>
    </div>
  );
}
