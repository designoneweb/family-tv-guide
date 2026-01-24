import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary/20 text-primary border border-primary/30",
        secondary:
          "bg-secondary/20 text-secondary-foreground border border-secondary/30",
        outline:
          "border border-primary/50 text-primary bg-transparent",
        new:
          "bg-warning/20 text-warning border border-warning/30",
        premiere:
          "bg-primary text-primary-foreground border-transparent shadow-gold-glow",
        finale:
          "bg-secondary text-secondary-foreground border-transparent",
        live:
          "bg-destructive/20 text-destructive border border-destructive/30 animate-glow-pulse",
        watched:
          "bg-success/20 text-success border border-success/30",
        // Genre badges
        drama:
          "bg-genre-drama/20 text-genre-drama border border-genre-drama/30",
        comedy:
          "bg-genre-comedy/20 text-genre-comedy border border-genre-comedy/30",
        action:
          "bg-genre-action/20 text-genre-action border border-genre-action/30",
        scifi:
          "bg-genre-scifi/20 text-genre-scifi border border-genre-scifi/30",
        horror:
          "bg-genre-horror/20 text-genre-horror border border-genre-horror/30",
        documentary:
          "bg-genre-documentary/20 text-genre-documentary border border-genre-documentary/30",
        animation:
          "bg-genre-animation/20 text-genre-animation border border-genre-animation/30",
        romance:
          "bg-genre-romance/20 text-genre-romance border border-genre-romance/30",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
