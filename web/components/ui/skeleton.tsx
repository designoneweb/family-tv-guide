import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-[8px] animate-shimmer',
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
    <div className="bg-elevated rounded-[20px] overflow-hidden border border-primary/10 shadow-cinema">
      {/* Image skeleton */}
      <Skeleton className={cn('w-full rounded-none', aspectVideo ? 'aspect-video' : 'aspect-[2/3]')} />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-12 w-full rounded-[8px]" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
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
    <div className="flex border-b border-primary/10">
      <div className="w-[180px] flex-shrink-0 border-r border-primary/10 bg-interactive/30 p-3">
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="flex-1 p-2 flex gap-2">
        <Skeleton className="h-[68px] w-[180px] rounded-[12px]" />
        <Skeleton className="h-[68px] w-[120px] rounded-[12px]" />
        <Skeleton className="h-[68px] w-[150px] rounded-[12px]" />
      </div>
    </div>
  );
}

/**
 * Full schedule grid skeleton
 */
export function ScheduleGridSkeleton() {
  return (
    <div className="bg-elevated rounded-[20px] border border-primary/10 overflow-hidden shadow-cinema">
      {/* Header */}
      <div className="flex border-b border-primary/10 bg-interactive/30 h-12">
        <div className="w-[180px] flex-shrink-0 border-r border-primary/10" />
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
