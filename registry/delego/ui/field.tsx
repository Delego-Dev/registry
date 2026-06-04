"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// Field — a labeled input with an optional leading icon and a mono hint, lit by the
// indigo focus halo on focus-within. Ports the design-system form field; wraps a
// native <input> so it stays a drop-in.
type FieldProps = React.ComponentProps<"input"> & {
  label?: string
  hint?: string
  icon?: React.ReactNode
  trailing?: React.ReactNode
  containerClassName?: string
}

function Field({
  label,
  hint,
  icon,
  trailing,
  className,
  containerClassName,
  id,
  ...props
}: FieldProps) {
  const reactId = React.useId()
  const inputId = id ?? reactId
  return (
    <div className={cn("flex flex-1 flex-col gap-[7px]", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-[12.5px] font-medium text-foreground/80">
          {label}
        </label>
      )}
      <div className="flex items-center gap-[9px] rounded-[--radius] border border-border bg-popover px-[13px] py-[11px] transition-all duration-200 focus-within:border-[var(--delego-indigo)] focus-within:ring-[3px] focus-within:ring-ring/45 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground">
        {icon}
        <input
          id={inputId}
          className={cn(
            "w-full bg-transparent font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground/70",
            className
          )}
          {...props}
        />
        {trailing}
      </div>
      {hint && <span className="font-mono text-[10.5px] text-muted-foreground">{hint}</span>}
    </div>
  )
}

export { Field, type FieldProps }
