# Stack integration spike

Parent: [Map](../map.md)
Label: wayfinder:prototype
Type: prototype
Status: resolved
Assignee: hainam
Blocked by: 06

## Question

Does the layout decided in [Decide the repo and tooling layout](./06-repo-and-tooling-layout.md) work end to end? Build one themed core component in `packages/ui`, show it in `apps/storybook`, and consume it from one Next.js app. It must confirm:

- `shadcn init --monorepo --base base` works in the monorepo, and which `base-*` style it writes to `components.json` (this can't be changed later).
- The `@source` in the shared `globals.css` picks up classes used only in `packages/ui`, and a class used only in one app does not appear in another app's CSS.
- `"use client"` in raw TSX inside `packages/ui` behaves correctly through `transpilePackages`, in both the app and Storybook.
- Per-file subpath imports (`@workspace/ui/components/button`) resolve in both the app and Storybook.

## Answer

Resolved by a throwaway prototype, 2026-11-16. The layout works. Prototype: `prototype/stack-integration-spike` on branch `prototype/stack-integration-spike` (commits `4af6734`, Node 26 pin `fbd5ab9`). Never merged.

**Init.** shadcn CLI 4.23.0. The first successful init was on Node 22.16.0; the effort uses Node 26 (verified 26.3.1):

`pnpm dlx shadcn@latest init --monorepo --base base --template next --defaults --yes`

`--defaults` means `--template=next --preset=base-nova`. Both `components.json` files end as `"style": "base-nova"`. The template's first write is `radix-nova`; the CLI rewrites it to `base-nova` only after install succeeds. A failed install leaves `radix-nova`.

**Node.** The generated repo pins `pnpm@11.25.0` and claimed `"node": ">=20.9.0"`. pnpm 11.25.0 does not start on Node 20.15.0 (`node:sqlite`). This effort uses Node 26. `.nvmrc` is `26`, `engines.node` is `>=26`, and `pnpm install` plus `pnpm typecheck` succeeded on Node 26.3.1.

**CSS.** Removed the template's `@source "../../../apps/**"` and `@source "../../../components/**"`. Kept `@source "../**/*.{ts,tsx}"`, which from `packages/ui/src/styles/globals.css` scans `packages/ui` only. `apps/web`, `apps/other`, and `apps/storybook` each own an entry CSS file that imports `@workspace/ui/globals.css`, with token overrides below the import. `components.json` still points `css` at the shared file. Production CSS:

- `border-[#a11ce0]`, used only in `packages/ui`, is in web, other, and Storybook.
- `border-[#b22df1]`, used only in web, is in web only.
- `border-[#c33e02]`, used only in other, is in other only.

Computed button backgrounds followed each app's `--primary` override (blue in web, green in other, the shared neutral in Storybook).

**Client boundary.** The generated `button.tsx` has no `"use client"`. `@base-ui/react/button` has it. The spike added `"use client"` and a click count on the button, with `transpilePackages: ["@workspace/ui"]`. In both Next apps the page stays a Server Component: the server timestamp did not change on click, and the count went from 0 to 1. The same click worked in Storybook 10.6.7 (`@storybook/nextjs-vite`). Vite warns that `"use client"` may not be preserved while bundling; the Storybook preview is client-side and the click still ran.

**Imports.** `@workspace/ui/components/button` typechecked and rendered in web, other, and Storybook. No barrel. `pnpm typecheck` and `pnpm build` both succeeded.

Run it from the prototype directory on Node 26: `pnpm dev`. web is :3000, other is :3010, Storybook is :6006.

Consequences:

- The style a real init will lock in, if it uses this default preset, is `base-nova`.
- The spec should require Node 26 for this pnpm pin. Node 20 cannot run it.
- Where `"use client"` sits on a wrapper is still open. The generated button omits it. See the server/client item in Not yet specified.
