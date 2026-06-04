import * as React from "react"
import { BadgeCheck, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"

// Signed receipt — the ownable audit visual: one hash-chained, Ed25519-signed
// record from the ledger. The left signal bar + seal read "verified"; the kv grid
// is mono, with fingerprint/hash fields tinted in the signal color. Outcome tints
// to the decision palette.
type SignedReceiptProps = React.ComponentProps<"div"> & {
  seq: string | number
  outcome: "allow" | "needs_approval" | "deny"
  fingerprint: string
  intentHash: string
  prevHash?: string
  phase?: string
  signatureOk?: boolean
}

const OUTCOME_COLOR: Record<SignedReceiptProps["outcome"], string> = {
  allow: "var(--delego-allow)",
  needs_approval: "var(--delego-approval)",
  deny: "var(--delego-deny)",
}

function Row({ k, v, hash }: { k: string; v: React.ReactNode; hash?: boolean }) {
  return (
    <>
      <span className="text-muted-foreground">{k}</span>
      <span className={cn("text-foreground/80", hash && "text-[var(--delego-hash)]")}>
        {v}
      </span>
    </>
  )
}

function SignedReceipt({
  seq,
  outcome,
  fingerprint,
  intentHash,
  prevHash,
  phase = "execution",
  signatureOk = true,
  className,
  ...props
}: SignedReceiptProps) {
  return (
    <div
      data-slot="signed-receipt"
      className={cn(
        "relative overflow-hidden rounded-[14px] border border-border bg-popover px-[18px] py-4",
        className
      )}
      {...props}
    >
      <span className="absolute inset-y-0 left-0 w-[3px] bg-[linear-gradient(var(--delego-signal),color-mix(in_oklch,var(--delego-signal)_55%,black))]" />
      <div className="mb-[13px] flex items-center gap-[9px]">
        <div className="grid size-[26px] place-items-center rounded-lg border border-[color-mix(in_oklch,var(--delego-allow)_34%,transparent)] bg-[color-mix(in_oklch,var(--delego-allow)_12%,transparent)] text-[var(--delego-allow)]">
          <BadgeCheck className="size-[15px]" />
        </div>
        <div className="font-mono text-[13px] text-foreground">
          receipt · <span className="text-muted-foreground">seq</span> {seq}
        </div>
        {signatureOk && (
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--delego-allow)]">
            <ShieldCheck className="size-[13px]" />
            signature ok
          </span>
        )}
      </div>
      <div className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-[5px] font-mono text-[11.5px]">
        <Row k="phase" v={phase} />
        <Row
          k="outcome"
          v={<span style={{ color: OUTCOME_COLOR[outcome] }}>{outcome}</span>}
        />
        <Row k="fingerprint" v={fingerprint} hash />
        <Row k="intent_hash" v={intentHash} />
        {prevHash ? <Row k="prev_hash" v={prevHash} /> : null}
      </div>
    </div>
  )
}

export { SignedReceipt, type SignedReceiptProps }
