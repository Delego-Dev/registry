# Security Policy

This repository is the **@delego shadcn registry** — a design-system theme and
React/Tailwind components. Consumers install code from it directly
(`npx shadcn add @delego/...`), which fetches the built JSON in
[`public/r/`](public/r/) straight from `main`. So `main` is effectively
production, and shipped component code runs in consumers' apps.

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Report privately via GitHub's
[private vulnerability reporting](https://github.com/Delego-Dev/registry/security/advisories/new),
or email **koishore@gmail.com**. We aim to acknowledge within 72 hours.

## In scope

- A component that introduces an injection / XSS vector in a consuming app —
  e.g. unsafe `dangerouslySetInnerHTML`, unsafe URL handling, or rendering
  untrusted input without escaping.
- A mismatch where the published `public/r/*.json` does not correspond to the
  reviewed source in [`registry/delego/`](registry/delego/) — a supply-chain
  concern, since consumers fetch the JSON, not the source.
- A dependency this registry pulls in and uses unsafely.

## Out of scope

- Visual / styling bugs and theme-token drift (open a normal issue).
- Vulnerabilities in shadcn or third-party dependencies themselves (report
  upstream), unless this registry uses them unsafely.

## Supported versions

Pre-1.0; only the latest `main` (the served registry) is maintained.
