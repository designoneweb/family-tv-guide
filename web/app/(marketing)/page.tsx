import Link from "next/link";
import {
  Calendar,
  Users,
  PlayCircle,
  CalendarDays,
  Sparkles,
  Tv,
  ChevronDown,
  Home,
  Search,
  GripVertical,
  Sofa
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Floating Glass Navigation */}
      <nav className="fixed top-6 left-6 right-6 z-50 animate-fade-in-up">
        <div className="mx-auto max-w-7xl">
          <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-serif text-2xl font-bold text-gradient-gold">
                FTV
              </span>
            </Link>

            {/* Login Button */}
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Viewport */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

          {/* Ambient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full bg-tertiary/5 blur-[80px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />

          {/* Vignette overlay */}
          <div className="hero-vignette absolute inset-0" />

          {/* Bottom gradient for depth */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          {/* Headline */}
          <h1
            className="text-hero text-foreground mb-6 animate-fade-in-up"
            style={{
              textShadow: '0 0 60px rgba(212, 168, 83, 0.15)',
              animationDelay: '0.2s'
            }}
          >
            Your Family&apos;s TV Guide
          </h1>

          {/* Subheadline */}
          <p
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Track what you&apos;re watching, plan your evenings, and never miss an episode. One home, one schedule, everyone in sync.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full shadow-gold-glow btn-glow transition-all hover:scale-105 hover:bg-primary-light"
            >
              Get Started Free
            </Link>
          </div>

          {/* Secondary Link */}
          <p className="mt-6 text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary-light underline underline-offset-4 transition-colors">
              Log in
            </Link>
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce" style={{ animationDuration: '2s' }}>
          <ChevronDown className="w-8 h-8 text-primary/50" />
        </div>
      </section>

      {/* Feature Showcase - Bento Grid */}
      <section className="relative py-24 md:py-32">
        {/* Velvet gradient background */}
        <div className="velvet-gradient absolute inset-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-page-title text-foreground mb-4">
              Everything your household needs
            </h2>
            <p className="text-lg text-muted-foreground">
              Designed for families who love TV together
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {/* Featured: Tonight View (2x2) */}
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[20px] p-8 bg-gradient-to-br from-secondary/20 via-elevated to-elevated border border-primary/10 shadow-cinema card-hover min-h-[400px] flex flex-col">
              <Calendar className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">
                Tonight&apos;s Lineup
              </h3>
              <p className="text-muted-foreground mb-8">
                See exactly what&apos;s scheduled for your evening at a glance
              </p>

              {/* Mini mockup */}
              <div className="mt-auto space-y-3">
                {[
                  { title: "The Bear", progress: 75, color: "bg-genre-comedy" },
                  { title: "Severance", progress: 40, color: "bg-genre-scifi" },
                  { title: "Shrinking", progress: 90, color: "bg-genre-drama" },
                ].map((show) => (
                  <div key={show.title} className="glass-subtle rounded-lg p-3 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${show.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{show.title}</p>
                      <div className="mt-1 h-1.5 bg-interactive rounded-full overflow-hidden">
                        <div
                          className="h-full bg-tertiary-light rounded-full"
                          style={{ width: `${show.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Family Profiles (1x1) */}
            <div className="group relative overflow-hidden rounded-[20px] p-6 bg-elevated border border-primary/10 shadow-cinema card-hover">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                Family Profiles
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Everyone tracks their own progress
              </p>

              {/* Avatar stack */}
              <div className="flex -space-x-3">
                {["bg-primary", "bg-secondary", "bg-tertiary"].map((color, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full ${color} border-2 border-elevated flex items-center justify-center text-primary-foreground font-semibold`}
                  >
                    {["D", "M", "K"][i]}
                  </div>
                ))}
              </div>
            </div>

            {/* Episode Progress (1x1) */}
            <div className="group relative overflow-hidden rounded-[20px] p-6 bg-elevated border border-primary/10 shadow-cinema card-hover" style={{ background: 'linear-gradient(135deg, rgba(45, 139, 139, 0.1) 0%, #1C2230 100%)' }}>
              <PlayCircle className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                Never Lose Your Place
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Pick up right where you left off
              </p>

              {/* Progress visual */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="episode-number font-mono">S3 E7</span>
                </div>
                <div className="h-2 bg-interactive rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-gradient-to-r from-primary to-primary-light rounded-full" />
                </div>
              </div>
            </div>

            {/* Weekly Schedule (2x1) */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-[20px] p-6 bg-elevated border border-primary/10 shadow-cinema card-hover">
              <CalendarDays className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                Weekly TV Guide
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Plan your shows across the week
              </p>

              {/* Mini schedule grid */}
              <div className="grid grid-cols-7 gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">{day}</p>
                    <div className="space-y-1">
                      {[...Array(Math.floor(Math.random() * 3) + 1)].map((_, j) => (
                        <div
                          key={j}
                          className={`h-3 rounded-sm ${
                            ["bg-genre-comedy", "bg-genre-drama", "bg-genre-scifi", "bg-genre-action"][Math.floor(Math.random() * 4)]
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cast Discovery (1x1) */}
            <div className="group relative overflow-hidden rounded-[20px] p-6 bg-elevated border border-primary/10 shadow-cinema card-hover">
              <Sparkles className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                Discover Cast
              </h3>
              <p className="text-sm text-muted-foreground">
                Explore actor filmographies
              </p>
            </div>

            {/* Streaming Sources (1x1) */}
            <div className="group relative overflow-hidden rounded-[20px] p-6 bg-elevated border border-primary/10 shadow-cinema card-hover">
              <Tv className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                Where to Watch
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                See all your streaming providers
              </p>

              {/* Provider logos placeholder */}
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg bg-interactive" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-page-title text-foreground">
              Up and running in minutes
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-tertiary to-primary/30" />

            {/* Steps */}
            <div className="space-y-16 stagger-children">
              {[
                {
                  number: "01",
                  title: "Create your household",
                  description: "Sign up and we'll create your private family space",
                  icon: Home,
                },
                {
                  number: "02",
                  title: "Add your shows",
                  description: "Search our database of TV shows and movies",
                  icon: Search,
                },
                {
                  number: "03",
                  title: "Build your schedule",
                  description: "Drag shows onto your weekly calendar",
                  icon: GripVertical,
                },
                {
                  number: "04",
                  title: "Watch together",
                  description: "Check tonight's lineup and enjoy",
                  icon: Sofa,
                },
              ].map((step, i) => (
                <div key={step.number} className="relative flex items-start gap-8 md:gap-12">
                  {/* Number circle */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-full bg-elevated border-2 border-primary flex items-center justify-center shadow-gold-glow">
                    <span className="font-serif text-2xl md:text-3xl font-bold text-primary">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-xl md:text-2xl font-serif font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-radial-gradient from-background via-background to-secondary/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-secondary/5 blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-page-title text-foreground mb-8">
            Ready for better TV nights?
          </h2>

          <Link
            href="/login"
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full shadow-gold-glow btn-glow transition-all hover:scale-105 hover:bg-primary-light"
          >
            Start Free Today
          </Link>

          <p className="mt-6 text-sm text-muted-foreground">
            Free forever for households. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-primary/10 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and copyright */}
            <div className="flex items-center gap-3 text-hint">
              <span className="font-serif text-lg font-semibold text-gradient-gold">FTV</span>
              <span>&copy; 2024 Family TV Guide</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
            </div>

            {/* Tagline */}
            <p className="text-sm text-hint">
              Made with ♥ for TV lovers
            </p>
          </div>

          {/* TMDB Attribution */}
          <p className="mt-6 text-center text-xs text-hint">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </footer>
    </div>
  );
}
