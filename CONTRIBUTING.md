# Contributing to @delego/registry

A [shadcn](https://ui.shadcn.com) registry for the Delego design system. The source
components live in [`registry/delego/`](registry/delego/) and the manifest is
[`registry.json`](registry.json); the **built artifacts** consumers actually
download live in [`public/r/`](public/r/).

## The one rule that matters: rebuild `public/r/`

Consumers install with `npx shadcn add @delego/...`, which fetches
`public/r/<name>.json` **raw from `main`**. That generated output is committed to
the repo and is the real published surface — so it must always match the source.

**Any change to `registry.json` or a component under `registry/delego/` must be
followed by a rebuild, with the regenerated `public/r/` committed in the same PR:**

```bash
npm ci
npm run registry:build      # shadcn build → regenerates public/r/*.json
git add public/r
```

CI enforces this (`.github/workflows/registry.yml`): it runs `registry:build` and
fails the PR if `public/r/` is not up to date.

## Local setup & preview

Requires Node 20+.

```bash
npm ci
npm run preview             # the examples/preview app (Vite)
```

## Token sync (`verify:tokens`)

`npm run verify:tokens` is a **cross-repo** drift guard: it asserts the registry's
OKLCH theme derives from the canonical design-system tokens and that the `landing`
copies are byte-identical. It needs the sibling `Delego Design System/` and
`landing/` checked out next to this repo, so it is a **local** check and is not run
in this repo's CI. Run it from the full workspace whenever you touch theme tokens.

## Pull requests

- **Fork** and open the PR from a branch in your fork; `main` is branch-protected
  and requires review (it is the live registry).
- Include the rebuilt `public/r/` — the CI drift check will block otherwise.
- Explain the *why*; keep component APIs consistent with the existing set.

## A note on AI assistance

AI-assisted contributions are welcome — but you are accountable for what you
submit. Review and test generated code, and disclose significant AI assistance in
the PR description.
