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
    <>
      {/* Desktop Navigation - Glass Top Bar */}
      <nav className="sticky top-0 z-50 glass hidden md:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center gap-8">
            {/* FTV Monogram Logo */}
            <Link href="/app/tonight" className="flex items-center gap-3 group">
              <div className="relative p-2 rounded-[8px] bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:shadow-gold-glow">
                <Tv className="h-5 w-5 text-primary" />
              </div>
              <span className="font-serif text-xl font-semibold text-gradient-gold">
                FTV
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/app/tonight' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm font-medium transition-all duration-200',
                      'hover:bg-interactive hover:text-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Icon className={cn('h-4 w-4', isActive && 'text-primary')} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-heavy md:hidden safe-area-bottom">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/app/tonight' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-[8px] min-w-[64px] transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  isActive && 'scale-110'
                )} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
