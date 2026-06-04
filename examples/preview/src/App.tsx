import { ArrowRight, Bot, Fingerprint, KeyRound, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { DecisionPill } from "@/components/ui/decision-pill"
import { SignedReceipt } from "@/components/ui/signed-receipt"
import { Field } from "@/components/ui/field"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function Gallery() {
  return (
    <div className="flex min-h-screen flex-col gap-8 bg-background p-10 text-foreground">
      <Section title="Buttons">
        <Button>
          Start building <ArrowRight />
        </Button>
        <Button variant="secondary">Read the docs</Button>
        <Button variant="ghost">View pricing</Button>
        <Button variant="allow">Approve &amp; release</Button>
        <Button variant="deny">Deny</Button>
      </Section>

      <Section title="Status badges">
        <StatusBadge variant="allow">allow</StatusBadge>
        <StatusBadge variant="approval">needs_approval</StatusBadge>
        <StatusBadge variant="deny">deny</StatusBadge>
        <StatusBadge variant="indigo">
          <Fingerprint /> principal
        </StatusBadge>
        <StatusBadge variant="neutral">seq 0042</StatusBadge>
      </Section>

      <Section title="Decision pills">
        <DecisionPill decision="allow" />
        <DecisionPill decision="needs_approval" />
        <DecisionPill decision="deny" />
      </Section>

      <Section title="Signed receipt">
        <SignedReceipt
          seq="0042"
          outcome="allow"
          phase="execution"
          fingerprint="c70d4ee5…d4ed394"
          intentHash="ec949034…04af4619"
          prevHash="a1f0…9c2b"
          className="w-[360px]"
        />
      </Section>

      <Section title="Fields">
        <Field
          label="API key name"
          icon={<KeyRound />}
          defaultValue="agent-checkout-svc"
          hint="focus · indigo halo"
          containerClassName="max-w-[280px]"
        />
        <Field
          label="Search the audit log"
          icon={<Search />}
          placeholder="method · host · fingerprint…"
          hint="placeholder"
          containerClassName="max-w-[280px]"
        />
        <Field
          label="Principal"
          icon={<Bot />}
          defaultValue="agent:checkout"
          hint="valid"
          containerClassName="max-w-[280px]"
        />
      </Section>
    </div>
  )
}

export default function App() {
  return (
    <div className="grid grid-cols-2">
      <Gallery />
      <div className="dark">
        <Gallery />
      </div>
    </div>
  )
}
