import * as React from "react"
import { BadgeCheck, Clock, ShieldX } from "lucide-react"

import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/ui/status-badge"

// Decision pill — the signature Delego element. A delego Decision has exactly one
// of three outcomes; this renders it with the canonical icon + mono label + color
// so an outcome looks identical everywhere it appears. The default label is the
// protocol's own token (e.g. `needs_approval`); pass children to override.
type Decision = "allow" | "needs_approval" | "deny"

const DECISION = {
  allow: { variant: "allow", icon: BadgeCheck, label: "allow" },
  needs_approval: { variant: "approval", icon: Clock, label: "needs_approval" },
  deny: { variant: "deny", icon: ShieldX, label: "deny" },
} as const

function DecisionPill({
  decision,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof StatusBadge>, "variant"> & {
  decision: Decision
}) {
  const { variant, icon: Icon, label } = DECISION[decision]
  return (
    <StatusBadge
      variant={variant}
      data-decision={decision}
      className={cn(className)}
      {...props}
    >
      <Icon aria-hidden />
      {children ?? label}
    </StatusBadge>
  )
}

export { DecisionPill, type Decision }
