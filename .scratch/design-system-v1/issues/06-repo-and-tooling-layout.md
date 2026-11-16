# Decide the repo and tooling layout

Parent: [Map](../map.md)
Label: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: hainam
Blocked by: 03

## Question

The design system lives as `packages/ui` inside the apps' existing monorepo (see [Choose the distribution model](./03-choose-distribution-model.md)). How does it fit into that monorepo?

- what the monorepo already uses (package manager, Turborepo or other, Next.js and Tailwind versions), and whether that fits shadcn's monorepo setup (`components.json` per workspace, `transpilePackages`, shared `globals.css`)
- folder layout: `packages/ui` alone, or separate packages for tokens and config; where Storybook lives (e.g. `apps/storybook`)
- whether the shared `globals.css` scans every app (the template's `@source "../../../apps/**"`) or each app owns its own entry CSS
- lint, format, and TypeScript configuration shared with the existing apps

## Answer

Resolved by grilling, 2026-11-16.

**Repo.** `packages/ui` is added to the existing pnpm and Turborepo monorepo. Every consuming app is on Next.js 16, Tailwind v4 and React 19. Pinned to pnpm 11 and Node `>=20.9`. Workspaces are `apps/*` and `packages/*`. `ds/sample-ds` is a throwaway experiment, not the seed. `packages/ui` comes from a fresh `shadcn init --monorepo --base base`.

**Packages.**
- `@workspace/ui` holds the core components, hooks, `cn`, and the tokens in `src/styles/globals.css`. No separate tokens package.
- `@workspace/eslint-config` and `@workspace/typescript-config` follow the shadcn template (ESLint 10; `base`, `nextjs` and `react-library` tsconfigs). `packages/ui`, `apps/storybook` and each consuming app extend them.
- Prettier and `prettier-plugin-tailwindcss` are installed once, at the repo root.

**Exports.** `@workspace/ui` ships raw TSX with no build step and no barrel `index.ts`. The export map is per-file subpaths only: `./globals.css`, `./postcss.config`, `./components/*`, `./lib/*`, `./hooks/*`. Apps import `@workspace/ui/components/button`. Each app's `next.config` lists `@workspace/ui` in `transpilePackages`. No `optimizePackageImports` and no `sideEffects` field are needed.

**CSS.** Each consuming app, and Storybook, owns its entry `globals.css` next to its root layout. That file imports `@workspace/ui/globals.css`, and app-level token overrides go below the import. The shared `globals.css` keeps `@import "tailwindcss"` and scans `packages/ui` only, with `@source` relative to its own file. The template's `@source "../../../apps/**"` is removed. Reason: Tailwind v4 scans from the build's working directory, so each app's build picks up its own classes, and a class used only in `packages/ui` is still generated. `components.json` in each app points its `css` path at the shared file, so `shadcn add` writes into `packages/ui`.

**Storybook.** `apps/storybook` is its own workspace on `@storybook/nextjs-vite`. It keeps its config and stories together, depends on `@workspace/ui` via `workspace:*`, and has a `dev` script so `turbo dev` starts it with the apps.

**Consequences.**
- The stack integration spike is now specifiable. It is recorded as [Stack integration spike](./07-stack-integration-spike.md).
- The `base-*` style is still open. It is chosen at init, and the spike confirms it.
