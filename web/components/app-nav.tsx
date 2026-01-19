'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Library, CalendarDays, Users } from 'lucide-react';
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
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-4">
          {/* App Title */}
          <Link href="/app/tonight" className="font-semibold text-lg mr-4">
            TV Guide
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
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
