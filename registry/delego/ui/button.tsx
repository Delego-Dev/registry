import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Delego button — ports the design-system primary/secondary/ghost set, plus the
// protocol-semantic allow/deny actions used in the approval flow. The primary
// carries the indigo glow; allow/deny map to the decision palette.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[--radius] text-sm font-medium tracking-[-0.01em] transition-all duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98]",
        secondary:
          "bg-card text-foreground border border-border hover:bg-accent hover:border-border/80",
        ghost: "bg-transparent text-muted-foreground hover:bg-card hover:text-foreground",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-accent",
        allow:
          "bg-[var(--delego-allow)] text-[oklch(0.15_0.02_265)] font-semibold hover:brightness-110 active:scale-[0.98]",
        deny: "bg-[var(--delego-deny)] text-white font-semibold hover:brightness-110 active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-[18px] py-[11px]",
        sm: "h-9 px-3.5 text-[13px]",
        lg: "h-11 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
