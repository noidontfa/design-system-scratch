# Distribution models for a shadcn/Base UI design system

Research for ticket [02 – distribution models](../.scratch/design-system-v1/issues/02-distribution-models.md).
Researched 2026-11-16 against primary sources only. Context: several internal Next.js (App Router) apps, Tailwind CSS v4, React 19, shadcn/ui on Base UI, tokens as CSS variables, one developer.

Conventions in this doc:

- Every factual claim links to the source that owns it (link list at the bottom).
- **Inference:** marks a conclusion drawn from the sources rather than stated by them.
- **Unverified:** marks something no primary source confirmed.

Versions at the time of writing: `shadcn` CLI `4.23.0` on npm ([npm-shadcn]); the official `templates/next-monorepo` in `shadcn-ui/ui` was last changed in commit `077fd2b` on 2026-11-13 ([gh-template-tree]).

---

## 0. Background that applies to all three models

**How Tailwind v4 finds classes.** Tailwind scans source files as plain text for anything that looks like a class name. It scans every file in the project *except* files in `.gitignore`, anything in `node_modules`, binaries, CSS files and lockfiles ([tw-detect]). Paths outside that set must be registered with `@source "<path>"`, which is resolved **relative to the stylesheet** ([tw-detect]). Tailwind's own example of this is exactly the shared-library case: `@source "../node_modules/@acmecorp/ui-lib";` ([tw-detect]). Related controls:

- `@import "tailwindcss" source("../src")` sets the base scan path, "useful when working with monorepos where your build commands run from the root" ([tw-detect]).
- `source(none)` turns off auto-detection so only explicit `@source` paths are scanned ([tw-detect]).
- `@source inline("…")` safelists classes that don't appear in scanned files ([tw-detect]).
- Classes must appear as complete strings. Tailwind can't see `bg-${color}-600` ([tw-detect]).

**How tokens work in Tailwind v4.** Tokens are "theme variables" declared with `@theme`. They generate utilities (for example `--color-mint-500` gives you `bg-mint-500`) and are also emitted as normal CSS variables ([tw-theme]). `@theme inline` is used when a theme variable references another variable ([tw-theme]). Only used variables are emitted unless you write `@theme static` ([tw-theme]). Tailwind's docs say directly that sharing tokens is "just a matter of throwing them into their own CSS file that you can import in each project", and that this file can live "in their own package in monorepo setups or even publish them to NPM and import them just like any other third-party CSS files" ([tw-theme]).

**shadcn + Base UI.** The CLI's `init` takes `-b, --base <base>` with options `base`, `radix` or `aria` ([shadcn-cli]). The monorepo docs' sample `components.json` uses `"style": "base-nova"` ([shadcn-monorepo]). shadcn's `init` adds `@import "shadcn/tailwind.css"` (shared custom variants such as `data-open:` and animations) to the global CSS. `shadcn eject` inlines that import and removes the `shadcn` runtime dependency ([shadcn-cli]).

**How the shadcn CLI handles updates.** The CLI reference has no `update` command and no standalone `diff` command. `add` has `--overwrite`, `--dry-run`, `--diff [path]` and `--view [path]` ([shadcn-cli]). **Inference:** refreshing a component that was installed as source means re-running `add <item> --overwrite`, previewing first with `--diff` or `--dry-run`. Local edits to that file get overwritten, so you have to merge them back by hand.

---

## 1. Shared package in a monorepo (`packages/ui`)

### How it works

`shadcn init --monorepo` scaffolds a Turborepo workspace with `apps/web` and `packages/ui` ([shadcn-monorepo]). Running `shadcn add button` from `apps/web` puts `button` in `packages/ui` and rewrites the app's imports. Running `add login-01` puts the primitives in `packages/ui` and the block (`login-form`) in `apps/web/components` ([shadcn-monorepo]). Apps import `@workspace/ui/components/button`, `@workspace/ui/lib/utils` and so on ([shadcn-monorepo]).

Requirements ([shadcn-monorepo]):

- Every workspace needs its own `components.json` with aliases.
- `style`, `iconLibrary` and `baseColor` must match across all of them.
- For Tailwind v4, `tailwind.config` stays empty.
- The app's `components.json` points `tailwind.css` at `../../packages/ui/src/styles/globals.css`.
- `package.json#imports` (`#components/*`) works for package-local aliases. Cross-workspace imports must go through the UI package's `exports`.

The official template (verified from source, [gh-template]) is:

- **`packages/ui/package.json`**: `"name": "@workspace/ui"`, `"private": true`, version `0.0.0`. `exports` maps `./globals.css`, `./postcss.config`, `./components/*` → `./src/components/*.tsx`, and similar paths for `lib` and `hooks`. It has **no build script** (it exports raw TSX).
- **`apps/web/package.json`**: `"@workspace/ui": "workspace:*"`.
- **`apps/web/next.config.ts`**: `transpilePackages: ["@workspace/ui"]`.
- **`apps/web/app/layout.tsx`**: `import "@workspace/ui/globals.css"`. The app's `postcss.config.mjs` re-exports `@workspace/ui/postcss.config`.
- **Root**: `turbo` and `pnpm-workspace.yaml` (`apps/*`, `packages/*`), with `packageManager: pnpm@11.25.0`.

Turborepo calls this a **Just-in-Time internal package**: the consuming app's bundler compiles it. That means minimal config, but Turborepo **can't cache a build** for the package, the package can't use TS `paths`, and type errors in the package show up in the consumers' type-checks ([turbo-internal]). The alternatives are a *Compiled* package (its own `tsc` build into `dist`, cacheable) or a *Publishable* package (most config; Turborepo recommends Changesets for it) ([turbo-internal]).

Next.js docs: Turbopack transpiles workspace packages automatically under both routers, and webpack does too for the App Router. `transpilePackages` is still needed when a `node_modules` dependency ships raw TS/JSX ([next-transpile]). **Inference:** inside the monorepo, the template's `transpilePackages` entry is belt-and-braces. It becomes *required* once the same raw-TSX package is consumed from `node_modules` in another repo.

### Tailwind class detection

The template's `packages/ui/src/styles/globals.css` begins ([gh-template]):

```css
@import "tailwindcss";
@source "../../../apps/**/*.{ts,tsx}";
@source "../../../components/**/*.{ts,tsx}";
@source "../**/*.{ts,tsx}";
```

So the one shared stylesheet owned by `packages/ui` registers both the package's own source and every app's source. Each app gets that stylesheet by importing it ([gh-template]). **Inference:** each app's CSS bundle is generated from the classes used across *all* apps plus the package, because the globs cover `apps/**`. That's harmless for a few internal apps, but it means one app's bundle includes another app's classes. If you don't want that, each app can own its own entry CSS with `source(none)` plus `@source` for itself and `packages/ui` ([tw-detect]).

### Tokens and theme CSS

Tokens live in `packages/ui/src/styles/globals.css`, which shadcn manages through the `tailwind.css` path in both `components.json` files ([shadcn-monorepo]). They're shared by importing `@workspace/ui/globals.css` ([gh-template]). Turborepo's Tailwind guide shows a variant with a dedicated `@repo/tailwind-config` package exporting `shared-styles.css` (containing `@import "tailwindcss"` and `@theme {…}`), which apps `@import` ([turbo-tailwind]).

### How updates reach apps

The dependency is `workspace:*`, and pnpm's `workspace:` protocol only ever resolves to the local workspace package ([pnpm-workspaces]). **Inference:** a change in `packages/ui` is picked up by every app on its next dev or build. You don't version, publish or bump anything. The flip side is that every app moves at once, and nothing lets one app stay on an older component.

### Consumer customisation

- **Inference** (from how shadcn components are built): apps customise through props, `className` merged with `cn` (shadcn's `cn` is `twMerge(clsx(...))`, [shadcn-cli]), by overriding CSS variables ([tw-theme]), or by wrapping. To fork a component for one app, copy it into `apps/x/components`.
- The CLI's routing supports a split: blocks land in the app, primitives land in the package ([shadcn-monorepo]).

### Tooling

pnpm workspaces ([pnpm-workspaces]), Turborepo ([turbo-internal]), and a `components.json` per workspace ([shadcn-monorepo]). No registry server or package registry is needed.

### Separate repos vs one monorepo

This model assumes one repo. To reach an app in **another repo**, `packages/ui` has to become a published package, which turns it into the hybrid/published path (see §3 and the "publishing" notes below). Turborepo describes moving from internal to publishable as the most demanding strategy ([turbo-internal]).

---

## 2. Private shadcn registry

### How it works

A registry is a `registry.json` catalog plus one JSON file per item, conforming to shadcn's schemas. It can be "a Next.js, Vite, Vue, Svelte, PHP or any other framework as long as it supports serving JSON over HTTP", or a GitHub repository ([shadcn-reg-start]). You can serve it two ways ([shadcn-reg-start]):

- **Static:** `shadcn build` flattens `registry.json` (including `include`d sub-registries) into `public/r/*.json`. Change the output folder with `--output`.
- **Dynamic:** route handlers using `loadRegistry` / `loadRegistryItem` from `shadcn/registry`.

Item types include `registry:ui`, `registry:block`, `registry:lib`, `registry:hook`, `registry:theme`, `registry:style`, `registry:font`, `registry:file`, `registry:item`, and `registry:base` ("entire design systems") ([shadcn-item]). Items declare npm `dependencies`, `registryDependencies` (other items, possibly from other registries), `cssVars` (`theme`, `light`, `dark`), raw `css` (`@layer`, `@utility`, `@plugin`, `@keyframes`), `envVars`, and file `target`s ([shadcn-item]). Target placeholders (`@ui/`, `@components/`, `@lib/`, `@hooks/`) resolve against the consumer's `components.json` aliases ([shadcn-item]).

**Namespaces.** Consumers add a registry under `registries` in `components.json`, for example `"@yourco": "https://registry.yourco.com/r/{name}.json"`, or with `shadcn registry add @yourco=…`. Then they run `shadcn add @yourco/button` ([shadcn-ns], [shadcn-reg-start], [shadcn-components-json]). Namespaces are decentralised: no central authority, any `@name` you like ([shadcn-ns]). `{style}` is an optional URL placeholder for serving per-style variants ([shadcn-ns]). `list`, `search` and `view` work against namespaces ([shadcn-cli]).

**Auth.** The object form of a registry entry takes `url`, `headers` and `params`. `${VAR}` is expanded from `process.env` (for example from `.env.local`) in URLs, headers and params. Supported schemes include Bearer, API key headers, Basic and query-string tokens ([shadcn-ns], [shadcn-auth]). The CLI reports missing env vars, 401s and 403s, and shows custom error messages returned by the server ([shadcn-ns], [shadcn-auth]). The server side is your job. The docs show a Next.js route handler that checks the token and returns the item ([shadcn-auth]). **Inference:** a purely static `public/r` deployment is unauthenticated unless the host provides access control, so a private registry served over HTTP means running *some* server or edge logic.

**GitHub-repo registries (relevant alternative to hosting).** Any `github.com` repo with a root `registry.json` is a registry, addressed as `owner/repo/item` and pinnable with `#tag` or `#sha` ([shadcn-gh]). **Private repos work with no server**: locally through `gh auth login`, in CI through `GH_TOKEN`/`GITHUB_TOKEN` (a fine-grained PAT with Contents read-only is recommended). A workflow's built-in `GITHUB_TOKEN` generally can't read *another* private repo ([shadcn-gh]). Limits: github.com only (no GitHub Enterprise hosts), 5 MiB per file, avoid symlinks ([shadcn-gh]). You use a namespace instead when you want custom hosting, auth headers or a stable alias ([shadcn-ns]).

**Versioning.** Registries have no built-in semver. The docs suggest passing a version in `params` (for example `"version": "${REGISTRY_VERSION}"`) and implementing it server-side ([shadcn-ns]). GitHub registries pin with `#ref`, and refs are *not* inherited by `registryDependencies` ([shadcn-gh], [shadcn-item]).

### Tailwind class detection

**Inference** from [tw-detect]: registry items are copied into the consuming project as ordinary source files. They aren't in `node_modules` or `.gitignore`, so Tailwind's automatic detection picks them up and **you don't need any `@source`**. In a monorepo consumer, the CLI writes them into `packages/ui` ([shadcn-monorepo]), so the monorepo `@source` setup from §1 applies.

### Tokens and theme CSS

Tokens ship as registry data, not as a CSS import:

- **Theme items:** `registry:theme` / `registry:style` items with `cssVars` and `css` ([shadcn-item], [shadcn-examples]).
- **Whole-system base:** a `registry:base` item, which can also set `config` (style, iconLibrary, baseColor, aliases, `registries`, and so on) and can use `extends: "none"` to skip shadcn's defaults ([shadcn-examples]). The style example says it is applied "on `npx shadcn init`" ([shadcn-examples]), and `init` accepts item names/URLs as arguments ([shadcn-cli]).
- **Merging:** the CLI deep-merges `cssVars`, `css` and `tailwind` from every item it resolves ([shadcn-ns]).

**Inference:** the result is that each app's global CSS file ends up holding its *own copy* of the token values. Changing a token later means re-applying the theme item to every app. `shadcn apply <preset> --only theme` exists for presets ([shadcn-cli]). **Unverified:** whether `apply` accepts arbitrary custom registry theme/base items or only shadcn preset codes. The docs only show preset codes.

### How updates reach apps

Updates only arrive when you pull them. **Inference** from [shadcn-cli]: in each app, run `shadcn add @yourco/<item> --overwrite`, preview with `--diff` or `--dry-run`, then commit. Nothing notifies an app that a newer item exists. Apps drift independently, and that's both the cost and the feature.

### Consumer customisation

Full. The code lives in the app, and editing it is the intended model (the docs describe the copy-and-paste method, where `components.json` is optional, [shadcn-components-json]). Registry-level overriding also exists: an item listed later in `registryDependencies` overwrites files with the same target, and later `cssVars` override earlier ones ("last one wins") ([shadcn-ns]). **Inference:** the cost of that freedom is that customised files conflict with `--overwrite` updates.

### Tooling

`registry.json` plus `shadcn build` (or `shadcn/registry` loaders) ([shadcn-reg-start]). Then pick one of:

- **(a)** static hosting, if it doesn't need to be private;
- **(b)** a server or route handler with token checks, plus token distribution through env vars ([shadcn-auth]);
- **(c)** a private github.com repo plus `gh`/PAT ([shadcn-gh]).

`shadcn registry validate` checks GitHub registries ([shadcn-gh]). The registry can live in its own repo or as an app inside a monorepo. **Inference:** a Next.js app serving `public/r` is the documented default ([shadcn-reg-start]).

### Separate repos vs one monorepo

Separate repos are the natural fit. Each app only needs a `components.json` entry plus credentials, with no package manager or registry setup ([shadcn-ns]). In one monorepo, a registry mostly duplicates what `workspace:*` already gives you. **Inference:** it still has a use there as a catalogue of *optional* blocks that get installed into `packages/ui` or an app on demand ([shadcn-monorepo]).

---

## 3. Hybrid: tokens + core components as a package, extras via a registry

### How it works

This is a combination of §1 or a published package for the stable core (tokens, `cn`, primitives), plus §2 for things apps *copy* and adapt (blocks, page templates, rarely-used components). The shadcn docs describe the pieces this needs but no named "hybrid" recipe. **Inference** from:

- registry items can depend on other registries and items, and can use alias placeholders like `@ui/` ([shadcn-item]);
- in a monorepo, the CLI puts primitives in the package and blocks in the app ([shadcn-monorepo]);
- consumers can configure several namespaces at once ([shadcn-ns]).

**Shipping the core package to separate repos** means publishing it (all from primary docs):

- **GitHub Packages (npm):** scoped names only (`@owner/pkg`); private by default. *Installing* also needs a token: GitHub says a "personal access token (classic)" is the only supported PAT type, alongside `GITHUB_TOKEN` in Actions. Each consumer needs an `.npmrc` with `@owner:registry=https://npm.pkg.github.com` ([gh-packages-npm]). Free quota for private packages is 500 MB storage / 1 GB transfer per month on GitHub Free, and 2 GB / 10 GB on Pro and Team, shared with Actions artifacts. Downloads through `GITHUB_TOKEN` in Actions don't count ([gh-packages-billing]).
- **npmjs private packages:** need a paid user or org account; always scoped ([npm-private]).
- **Versioning tooling:** pnpm replaces `workspace:*` with the real version at pack/publish time ([pnpm-workspaces]). pnpm lists `pnpm change` / `pnpm version -r` and Changesets for releases ([pnpm-workspaces]). Turborepo recommends Changesets ([turbo-internal]).

### Tailwind class detection

- **Package part, consumed from `node_modules` in another repo:** `node_modules` is ignored by default, so each app's CSS needs `@source "../node_modules/@yourco/ui"` or similar ([tw-detect]). The package must ship strings Tailwind can read: TSX source or compiled JS both work, since scanning is plain text ([tw-detect]). If it ships raw TSX, the Next app needs `transpilePackages: ["@yourco/ui"]` ([next-transpile]).
  - **Unverified:** whether Tailwind's scanner follows pnpm's symlinked `node_modules/@yourco/ui` path without issues. Test this.
  - **Unverified:** whether an `@source` placed *inside* the package's own CSS (relative to that file in `node_modules`) reliably registers the package. Tailwind documents `@source` as relative to the stylesheet ([tw-detect]) but doesn't document this self-registration case. Turborepo's alternative skips the problem by having the UI package **precompile its own CSS** with `@tailwindcss/cli` into `dist/index.css`, using `@import "tailwindcss" prefix(ui)` so its classes are prefixed `ui:` to avoid specificity clashes ([turbo-tailwind]).
- **Package part, consumed inside one monorepo:** same as §1.
- **Registry part:** copied into the app, so it's auto-detected (same as §2).

### Tokens and theme CSS

The package exports the theme CSS (`@theme` / CSS variables), and apps `@import` it ([tw-theme], [turbo-tailwind], [gh-template]). **Inference:** in this model, registry items should *reference* token variables, not ship `cssVars` that redefine them. The CLI merges an item's `cssVars` into the app's CSS file ([shadcn-ns], [shadcn-item]), which would fork the tokens per app.

### How updates reach apps

- **Package:** in a monorepo, instantly through `workspace:*`. In separate repos, by publishing a version and bumping it in each app ([pnpm-workspaces], [gh-packages-npm]). **Inference:** Renovate/Dependabot-style automation can raise the bumps, but no researched source covers that.
- **Registry extras:** pulled manually with `add --overwrite` (§2).

### Consumer customisation

Core components are customised by configuration (props, `className`, CSS variables). Extras are copied, so apps own and edit them freely. **Inference:** the line between "core" and "extra" becomes a design decision you have to keep revisiting.

### Tooling

Everything from §1 (or a publish pipeline) plus everything from §2: two release mechanisms to maintain.

### Separate repos vs one monorepo

In one monorepo, the package half costs nothing extra and the registry half is optional. Across repos, both halves need infrastructure: a private package registry with tokens on every consumer and in CI, *and* a registry host or private GitHub repo.

---

## 4. Comparison

| | 1. Monorepo `packages/ui` | 2. Private shadcn registry | 3. Hybrid |
|---|---|---|---|
| Where component code lives | One shared package ([shadcn-monorepo]) | Copied into each app ([shadcn-reg-start]) | Core in a package; extras copied into apps |
| Tailwind `@source` | Shared CSS globs `apps/**` + package ([gh-template]) | None needed, files are local (inference, [tw-detect]) | Package needs `@source` to `node_modules` across repos ([tw-detect]); extras none |
| Token sharing | Import `@workspace/ui/globals.css` ([gh-template]) | Theme/base item `cssVars` merged into each app's CSS ([shadcn-ns]) | Import package CSS ([tw-theme]) |
| How updates arrive | Immediate, all apps at once (`workspace:*`, [pnpm-workspaces]) | Manual re-`add --overwrite` per app ([shadcn-cli]) | Package: instant (mono) or version bump (multi-repo); extras: manual |
| Per-app divergence | Low: wrap or fork locally | High: edit freely; conflicts with overwrite | Low for core, high for extras |
| Required infra | pnpm + Turborepo ([turbo-internal]) | JSON host, or server + tokens, or private GitHub repo + `gh`/PAT ([shadcn-auth], [shadcn-gh]) | Both, plus a package registry if multi-repo ([gh-packages-npm]) |
| Versioning | None (single version) | DIY via params or GitHub `#ref` ([shadcn-ns], [shadcn-gh]) | Semver for package; DIY for extras |
| Works across separate repos | No, unless published | Yes, natively | Yes, with both infra pieces |
| Ongoing solo-dev effort | Lowest (one place to change) | Per-app update chores | Highest (two pipelines) |

---

## 5. Questions to answer before choosing

1. **Will all the apps live in one repo, or do some have to stay in their own repos?** This sets which models are even possible without publishing.
2. **When a component changes, should every app get it immediately, or should each app opt in on its own schedule?**
3. **How often do you expect an app to need a component that differs from the shared one?** Occasional differences favour a package with local wrappers. Frequent differences favour copied code.
4. **Should tokens have a single source that every app imports, or is a per-app copy (re-applied when tokens change) acceptable?**
5. **How much release infrastructure will you run alone?** Options include a private npm registry plus tokens in every app and CI, a registry server with auth, or a private GitHub repo with PATs.
6. **Is a version history and rollback per component or package needed, or is "whatever is on `main`" enough?**
7. **Are there components that are truly optional or app-specific (blocks, page templates)?** If so, how many? This decides whether a registry layer earns its keep.
8. **Which GitHub plan or hosting do you already have?** This affects GitHub Packages quotas and PAT requirements ([gh-packages-billing], [gh-packages-npm]), and whether a private-GitHub-repo registry is an option at all (github.com only, [shadcn-gh]).

## 6. Not verified / follow-ups

- Tailwind v4 scanning a pnpm-symlinked package in `node_modules` through `@source` (§3).
- `@source` declared inside a package's own CSS file when consumed from `node_modules` (§3).
- Whether `shadcn apply` works with custom (non-preset) theme or base registry items (§2).
- Whether compiling a package with `tsc` preserves the `"use client"` directives the components need for the App Router. Not researched; check before choosing a Compiled package.
- Git-URL dependencies (installing a package straight from a Git repo, skipping a package registry) weren't researched.

---

## Sources

[shadcn-monorepo]: https://ui.shadcn.com/docs/monorepo
[shadcn-cli]: https://ui.shadcn.com/docs/cli
[shadcn-components-json]: https://ui.shadcn.com/docs/components-json
[shadcn-reg-start]: https://ui.shadcn.com/docs/registry/getting-started
[shadcn-item]: https://ui.shadcn.com/docs/registry/registry-item-json
[shadcn-examples]: https://ui.shadcn.com/docs/registry/examples
[shadcn-ns]: https://ui.shadcn.com/docs/registry/namespace
[shadcn-auth]: https://ui.shadcn.com/docs/registry/authentication
[shadcn-gh]: https://ui.shadcn.com/docs/registry/github
[gh-template]: https://github.com/shadcn-ui/ui/tree/main/templates/next-monorepo
[gh-template-tree]: https://github.com/shadcn-ui/ui/commits/main/templates/next-monorepo
[npm-shadcn]: https://www.npmjs.com/package/shadcn
[tw-detect]: https://tailwindcss.com/docs/detecting-classes-in-source-files
[tw-theme]: https://tailwindcss.com/docs/theme
[turbo-internal]: https://turborepo.com/docs/core-concepts/internal-packages
[turbo-tailwind]: https://turborepo.com/docs/guides/tools/tailwind
[pnpm-workspaces]: https://pnpm.io/workspaces
[next-transpile]: https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages
[gh-packages-npm]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
[gh-packages-billing]: https://docs.github.com/en/billing/concepts/product-billing/github-packages
[npm-private]: https://docs.npmjs.com/about-private-packages

- shadcn monorepo: https://ui.shadcn.com/docs/monorepo
- shadcn CLI: https://ui.shadcn.com/docs/cli
- shadcn components.json: https://ui.shadcn.com/docs/components-json
- shadcn registry getting started: https://ui.shadcn.com/docs/registry/getting-started
- shadcn registry-item.json: https://ui.shadcn.com/docs/registry/registry-item-json
- shadcn registry examples: https://ui.shadcn.com/docs/registry/examples
- shadcn namespaces: https://ui.shadcn.com/docs/registry/namespace
- shadcn registry authentication: https://ui.shadcn.com/docs/registry/authentication
- shadcn GitHub registries: https://ui.shadcn.com/docs/registry/github
- shadcn next-monorepo template source (commit `077fd2b`, 2026-11-13): https://github.com/shadcn-ui/ui/tree/main/templates/next-monorepo
- shadcn on npm (`4.23.0`): https://www.npmjs.com/package/shadcn
- Tailwind, detecting classes / `@source`: https://tailwindcss.com/docs/detecting-classes-in-source-files
- Tailwind, theme variables / `@theme`: https://tailwindcss.com/docs/theme
- Turborepo internal packages: https://turborepo.com/docs/core-concepts/internal-packages
- Turborepo Tailwind guide: https://turborepo.com/docs/guides/tools/tailwind
- pnpm workspaces: https://pnpm.io/workspaces
- Next.js `transpilePackages`: https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages
- GitHub Packages npm registry: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
- GitHub Packages billing: https://docs.github.com/en/billing/concepts/product-billing/github-packages
- npm private packages: https://docs.npmjs.com/about-private-packages
