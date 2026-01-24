import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel: Cinema Ambiance - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute inset-0">
          {/* Base gradient with velvet feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background to-background" />

          {/* Ambient orbs for depth */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/15 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-tertiary/10 blur-[80px]" />

          {/* Vignette */}
          <div className="hero-vignette absolute inset-0" />

          {/* Bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Floating poster elements - decorative */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating show cards at various depths */}
          <div className="absolute top-[15%] left-[10%] w-24 h-36 rounded-lg bg-elevated/30 border border-primary/5 rotate-[-8deg] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[25%] right-[20%] w-20 h-30 rounded-lg bg-elevated/20 border border-primary/5 rotate-[5deg] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[25%] w-16 h-24 rounded-lg bg-elevated/25 border border-primary/5 rotate-[12deg] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
        </div>

        {/* Brand Content - Bottom Left */}
        <div className="relative z-10 mt-auto p-16">
          <h1
            className="font-serif text-4xl font-semibold text-foreground mb-4"
            style={{ textShadow: '0 0 40px rgba(212, 168, 83, 0.2)' }}
          >
            Family TV Guide
          </h1>
          <p className="text-lg italic text-muted-foreground">
            Your evening, perfectly planned.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 md:p-12 relative">
        {/* Mobile background - subtle ambient */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-1/4 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute bottom-1/4 left-0 w-[200px] h-[200px] rounded-full bg-secondary/5 blur-[80px]" />
        </div>

        <div className="relative z-10 w-full max-w-[400px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
