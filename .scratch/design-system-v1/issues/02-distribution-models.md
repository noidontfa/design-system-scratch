# What are the options for distributing shadcn-based components to several Next.js apps?

Parent: [Map](../map.md)
Label: wayfinder:research
Type: research
Status: resolved
Blocked by: none

## Question

For several internal Next.js (App Router, Tailwind v4, React 19) apps, how do the main distribution models work in practice, and what does each cost?

1. **Shared npm package in a monorepo** (e.g. shadcn's official monorepo support with Turborepo and pnpm, `packages/ui`).
2. **Private shadcn registry** (`shadcn build`, namespaced registries such as `@yourco/button`, auth for private registries).
3. **Hybrid** (tokens and core components as a package, optional extras via a registry).

For each, cover:

- how Tailwind v4 picks up classes from the shared code (`@source` etc.)
- how tokens and theme CSS are shared
- how updates reach apps
- whether consumers can customise components
- tooling it requires
- what it means for apps that live in **separate repos** versus one monorepo

## Answer

Full findings: `research/distribution-models.md` on the `research/distribution-models` branch (commit `4fb0ede`). Never merged; read with `git show research/distribution-models:research/distribution-models.md`.

- **Monorepo package** (`packages/ui`, `workspace:*`, raw TSX, shared `globals.css` with `@source`): one source of truth, all apps updated at once. No versioning or per-app pinning, and it only works inside one repo.
- **Tailwind v4** ignores `node_modules` and anything gitignored. Shared code outside an app needs `@source`. Registry-copied code is local and needs none.
- **Private registry** (`registry.json` + `shadcn build` → static JSON, or route handlers; `@yourco` namespace in `components.json`): auth goes through env-filled headers or params, and you implement the server check yourself. A private GitHub repo with a root `registry.json` also works as a registry with no server (via `gh auth` or a token; github.com only).
- **Registry trade-offs:** no semver. Updates mean `add --overwrite` in each app, which clobbers local edits. Tokens are copied into each app's CSS.
- **Hybrid:** across separate repos the package must be published (GitHub Packages needs a classic personal access token plus `.npmrc`; npmjs private packages are paid). Each app needs `@source` pointing into `node_modules` and `transpilePackages`. Registry extras must reference the token variables, not redefine them.
- **Unverified:** whether Tailwind scans pnpm's symlinked paths; whether `@source` works from a package's own CSS; whether `shadcn apply` takes custom themes; whether `"use client"` survives a `tsc` build; Git-URL installs.
