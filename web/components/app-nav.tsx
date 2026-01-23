'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Library, CalendarDays, Users, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: '/app/tonight', label: 'Tonight', icon: Calendar },
  { href: '/app/library', label: 'Library', icon: Library },
  { href: '/app/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/app/profiles', label: 'Profiles', icon: Users },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-6">
          {/* App Title with icon */}
          <Link href="/app/tonight" className="flex items-center gap-2 font-bold text-lg mr-2 group">
            <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Tv className="h-5 w-5 text-primary" />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              TV Guide
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/app/tonight' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'hover:bg-accent/80 hover:text-accent-foreground',
                    'active:scale-[0.98]',
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className={cn('h-4 w-4 transition-colors', isActive && 'text-primary')} />
                  <span className="hidden sm:inline">{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
