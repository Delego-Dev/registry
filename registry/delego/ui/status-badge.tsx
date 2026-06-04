import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Status badge — the design-system pill: mono label + leading icon + status color.
// Variants mirror the protocol vocabulary (decision outcomes + principal/audit tags).
// Soft fills are derived from the semantic var via color-mix so they track the theme.
const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border py-[5px] pl-[9px] pr-[11px] font-mono text-xs font-medium [&_svg]:size-[13px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        allow:
          "text-[var(--delego-allow)] border-[color-mix(in_oklch,var(--delego-allow)_32%,transparent)] bg-[color-mix(in_oklch,var(--delego-allow)_10%,transparent)]",
        approval:
          "text-[var(--delego-approval)] border-[color-mix(in_oklch,var(--delego-approval)_32%,transparent)] bg-[color-mix(in_oklch,var(--delego-approval)_10%,transparent)]",
        deny: "text-[var(--delego-deny)] border-[color-mix(in_oklch,var(--delego-deny)_32%,transparent)] bg-[color-mix(in_oklch,var(--delego-deny)_10%,transparent)]",
        indigo:
          "text-[var(--delego-indigo)] border-[color-mix(in_oklch,var(--delego-indigo)_34%,transparent)] bg-[color-mix(in_oklch,var(--delego-indigo)_12%,transparent)]",
        neutral: "text-foreground/80 border-border bg-card",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

function StatusBadge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof statusBadgeVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp
      data-slot="status-badge"
      className={cn(statusBadgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { StatusBadge, statusBadgeVariants }
