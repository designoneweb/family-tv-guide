import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileProvider } from "@/lib/contexts/profile-context";
import { ProfileGuard } from "@/components/profile-guard";
import { AppNav } from "@/components/app-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ProfileProvider>
      <AppNav />
      <ProfileGuard>{children}</ProfileGuard>
    </ProfileProvider>
  );
}
