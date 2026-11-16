# Choose the distribution model

Parent: [Map](../map.md)
Label: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: hainam
Blocked by: 01, 02

## Question

Given the research in [How mature is shadcn/ui's Base UI support?](./01-shadcn-base-ui-support.md) and [What are the options for distributing shadcn-based components to several Next.js apps?](./02-distribution-models.md), how will internal apps consume the design system: a shared npm package (monorepo), a private shadcn registry, or a hybrid? Also: do the consuming apps live in one monorepo or in separate repos?

## Answer

Resolved by grilling, 2026-11-16.

**A shared internal package inside the apps' monorepo.**

- **Home:** the design system is `packages/ui` in the existing monorepo that holds all consuming apps. It's built there from day one and is the only source; nothing is built elsewhere and copied in.
- **Consumption:** apps depend on it through `workspace:*` (pnpm). Nothing is published (no npm or GitHub Packages) and there's no shadcn registry. v1 has no optional extras (blocks or templates), only core components and tokens.
- **Updates:** lockstep. Every app builds against the current `packages/ui`. A breaking change updates every app's usages in the same PR, with TypeScript and the build surfacing each call site. The owner first asked for apps to upgrade on their own schedules, but that needs published versions, so it's deferred (see revisit triggers).
- **Customisation:**
  - Per-app variation goes through props, `className`, CSS-variable overrides, or a wrapper in the app's own folder.
  - Shared changes are edits to `packages/ui`, with all apps updated in the same PR.
  - No per-app forks of core component source. If an app needs something different, add a variant to `packages/ui`.
- **Revisit triggers** (each would be a new effort): an app moves to its own repo; apps need to upgrade on separate schedules; reusable blocks or templates appear that apps should copy and adapt.

Consequences for the rest of the map:

- **Versioning and release flow:** not needed for v1, since apps move in lockstep.
- **Tailwind class detection:** handled by `@source` within the monorepo (see [What are the options for distributing shadcn-based components to several Next.js apps?](./02-distribution-models.md) §1). The `node_modules` and pnpm-symlink questions from the research no longer apply.
- **Stack integration spike:** now specifiable once the repo layout is decided.
