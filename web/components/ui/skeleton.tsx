import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-muted skeleton-pulse',
        className
      )}
    />
  );
}

/**
 * Skeleton card that matches TitleCard layout
 */
export function TitleCardSkeleton({ aspectVideo = false }: { aspectVideo?: boolean }) {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border/50">
      {/* Image skeleton */}
      <Skeleton className={cn('w-full', aspectVideo ? 'aspect-video' : 'aspect-[2/3]')} />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}

/**
 * Grid of skeleton cards for loading states
 */
export function TitleCardSkeletonGrid({
  count = 6,
  aspectVideo = false
}: {
  count?: number;
  aspectVideo?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <TitleCardSkeleton key={i} aspectVideo={aspectVideo} />
      ))}
    </div>
  );
}

/**
 * Skeleton for schedule grid rows
 */
export function ScheduleRowSkeleton() {
  return (
    <div className="flex border-b border-border/30">
      <div className="w-[180px] flex-shrink-0 border-r border-border/30 bg-muted/20 p-3">
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="flex-1 p-2 flex gap-2">
        <Skeleton className="h-[68px] w-[180px] rounded-lg" />
        <Skeleton className="h-[68px] w-[120px] rounded-lg" />
        <Skeleton className="h-[68px] w-[150px] rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Full schedule grid skeleton
 */
export function ScheduleGridSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-border/50 bg-muted/30 h-12">
        <div className="w-[180px] flex-shrink-0 border-r border-border/50" />
        <div className="flex-1 flex items-center gap-8 px-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: 7 }).map((_, i) => (
        <ScheduleRowSkeleton key={i} />
      ))}
    </div>
  );
}
