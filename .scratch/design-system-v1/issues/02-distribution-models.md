# What are the options for distributing shadcn-based components to several Next.js apps?

Parent: [Map](../map.md)
Label: wayfinder:research
Type: research
Status: open
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
