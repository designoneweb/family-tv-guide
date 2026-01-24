"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-interactive",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 rounded-full bg-primary transition-all duration-300 ease-out",
        indicatorClassName
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// Episode progress bar with Cinema Lounge styling
interface EpisodeProgressProps {
  watched: number
  total: number
  className?: string
  showLabel?: boolean
}

function EpisodeProgress({ watched, total, className, showLabel = false }: EpisodeProgressProps) {
  const percentage = total > 0 ? (watched / total) * 100 : 0
  const isComplete = watched === total && total > 0

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className={cn(
            "font-mono",
            isComplete ? "text-success" : "text-primary"
          )}>
            {watched}/{total}
          </span>
        </div>
      )}
      <Progress
        value={percentage}
        className="h-1.5"
        indicatorClassName={cn(
          isComplete && "bg-success"
        )}
      />
    </div>
  )
}

// Thin progress bar for cards
interface ThinProgressProps {
  value: number
  className?: string
}

function ThinProgress({ value, className }: ThinProgressProps) {
  return (
    <div className={cn("h-1 w-full overflow-hidden rounded-full bg-interactive/50", className)}>
      <div
        className="h-full rounded-full bg-tertiary-light transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export { Progress, EpisodeProgress, ThinProgress }
