# @delego/registry

A [shadcn](https://ui.shadcn.com) registry for the **Delego** design system — the
access layer for the agent era. It ships the Delego token theme plus the
signature components that stock shadcn doesn't have (the protocol decision pill,
the signed audit receipt), so any shadcn project can install Delego-branded UI
with one command:

```bash
npx shadcn@latest add @delego/decision-pill
```

Built for **Tailwind v4 / shadcn (CSS variables, OKLCH)**.

## What's in here

| Item | Type | What it is |
| --- | --- | --- |
| `delego-theme` | theme | Delego tokens → shadcn variables (OKLCH, light + dark). Indigo primary, signal-mint accent, the `allow / needs_approval / deny` decision palette, Inter + JetBrains Mono. |
| `button` | ui | primary (indigo glow) · secondary · ghost · outline · link · `allow` · `deny`. |
| `status-badge` | ui | Mono pill + icon + status color. `allow / approval / deny / indigo / neutral`. |
| `decision-pill` | ui | **Signature.** Renders a `Decision` outcome with its canonical icon, label, and color. |
| `signed-receipt` | ui | The ownable audit visual — a hash-chained, Ed25519-signed ledger record. |
| `field` | ui | Labeled input + leading icon + mono hint, lit by the indigo focus halo. |

Source lives in [`registry/delego/`](registry/delego/); the manifest is
[`registry.json`](registry.json).

## Use it (consumer side)

In an existing shadcn project (one that has run `shadcn init`). Until `@delego`
is approved into the Directory, point the namespace at the registry yourself in
`components.json`:

```json
{
  "registries": {
    "@delego": "https://raw.githubusercontent.com/Delego-Dev/registry/main/public/r/{name}.json"
  }
}
```

Then install — `registryDependencies` are resolved transitively, so adding a
component pulls its `status-badge` / `delego-theme` deps automatically:

```bash
npx shadcn@latest add @delego/decision-pill @delego/signed-receipt
```

Once listed in the Directory, the `registries` block is unnecessary — the CLI
resolves `@delego` from the index. You can also install straight from a built
JSON URL without any config:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/Delego-Dev/registry/main/public/r/decision-pill.json
```

**Fonts.** The theme sets the font *stacks* but doesn't load the files. Add
Inter, JetBrains Mono, and (for display headings) Plus Jakarta Sans — e.g. in
`app/layout.tsx` via `next/font`, or in your CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=JetBrains+Mono:wght@400..600&family=Plus+Jakarta+Sans:wght@400..800&display=swap');
```

## Build & host (maintainer side)

```bash
pnpm install
pnpm registry:build      # shadcn build → emits public/r/*.json (with content)
```

Commit `public/r/` and serve it over HTTPS (GitHub raw, GitHub Pages, or any
static host). The CLI fetches `public/r/<item>.json` per the URL template in the
directory entry.

## Preview app (verification)

[`examples/preview/`](examples/preview/) is a Vite + Tailwind v4 app that imports
the **real** `registry/delego/ui` sources (via alias) and renders every item in
light + dark — so what compiles there is exactly what consumers install. Its
theme CSS is generated from `registry.json` (`scripts/gen-theme.mjs`), so it can
never drift from the published tokens. See [`examples/preview/preview.png`](examples/preview/preview.png).

```bash
npm install            # deps are hoisted to this root for both the app + sources
npm run preview        # dev server
npm run preview:build  # gen theme + tsc --noEmit + vite build
```

Two gotchas baked in (in case you add components): registry sources are
out-of-tree, so the app declares them via a Tailwind `@source` in
`src/index.css` (else their utility classes never generate), and `field.tsx`
carries `"use client"` because it uses `useId`.

## List in the shadcn Directory

Once `public/r/` is published and the repo is public:

1. Fork [`shadcn-ui/ui`](https://github.com/shadcn-ui/ui).
2. Add the entry from [`directory-entry.json`](directory-entry.json) to
   `apps/v4/registry/directory.json`. **Verify the field names** against the
   current file first — the directory schema can change.
3. `pnpm validate:registries` in that repo.
4. Open a PR to `shadcn-ui/ui` for review.

Directory requirements (per the [docs](https://ui.shadcn.com/docs/registry/registry-index)):
open source · publicly accessible · valid registry schema · **flat** (`/registry.json`
+ `/<item>.json`, no nesting) · the served index's `files` arrays carry **no
`content` property** (content lives in each item's own JSON, which `shadcn build`
produces).

## Token sync

The design tokens have **one canonical source** — `colors_and_type.css` in the
Delego design system. Everything downstream derives from it: the landing's
`tokens.css` + `/design` copy (byte-identical), and this registry's
`delego-theme` (the hex tokens converted to OKLCH, light + dark).

`npm run verify:tokens` is a drift guard — it asserts every `delego-theme` OKLCH
value still equals the OKLCH of its mapped canonical token, and that the copies
are byte-identical. Run it (from the workspace, with the sibling design-system +
landing folders present) before publishing a token change. It exits non-zero on
any discrepancy.

## License

Apache-2.0, matching the Delego project.
