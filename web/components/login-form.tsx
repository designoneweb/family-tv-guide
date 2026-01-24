"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      // Sign up successful - check your email for confirmation
      setError("Check your email for a confirmation link.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/app");
    router.refresh();
  };

  return (
    <div className="w-full stagger-children">
      {/* FTV Monogram - Mobile and Form */}
      <div className="text-center mb-12">
        <Link href="/" className="inline-block">
          <span className="font-serif text-5xl font-bold text-gradient-gold">
            FTV
          </span>
        </Link>
      </div>

      {/* Welcome Text */}
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
          {isSignUp ? "Create Account" : "Welcome back"}
        </h2>
        <p className="text-muted-foreground">
          {isSignUp
            ? "Sign up to start using Family TV Guide"
            : "Sign in to continue to your household"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className={cn(
              "h-14",
              error && "border-destructive focus:border-destructive focus:ring-destructive/30"
            )}
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className={cn(
                "h-14 pr-12",
                error && "border-destructive focus:border-destructive focus:ring-destructive/30"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={cn(
            "px-4 py-3 rounded-[8px] text-sm",
            error.includes("Check your email")
              ? "bg-success/10 text-success border border-success/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          )}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-interactive" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-xs uppercase tracking-wider text-muted-foreground bg-background">
            or
          </span>
        </div>
      </div>

      {/* Future: Social Auth Placeholder */}
      <Button
        type="button"
        variant="outline"
        disabled
        className="w-full h-12 opacity-50 cursor-not-allowed"
      >
        Continue with Google (Coming Soon)
      </Button>

      {/* Footer Links */}
      <div className="mt-8 text-center space-y-3">
        <p className="text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="font-semibold text-primary hover:text-primary-light transition-colors"
          >
            {isSignUp ? "Sign In" : "Create one free"}
          </button>
        </p>

        {!isSignUp && (
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot password?
          </button>
        )}
      </div>

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-hint hover:text-muted-foreground transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
