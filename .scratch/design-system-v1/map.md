# Map: Design system v1 (Next.js + shadcn/ui + Base UI)

Label: wayfinder:map

## Destination

A written **v1 spec** for an internal design system built on Next.js, shadcn/ui and [Base UI](https://base-ui.com/), covering architecture, distribution, token model, v1 component list, and documentation, ready to break into build tickets.

## Notes

- **Domain:** frontend engineering / design systems.
- **Consumers:** several internal apps, all on Next.js App Router, Tailwind CSS v4, and React 19.
- **Primitives:** Base UI (`@base-ui/react`) under shadcn/ui, in place of Radix. Not Uber's Base Web.
- **Visual starting point:** shadcn defaults. The owner will configure colours, fonts, radius, etc. later.
- **Theming:** one brand, light and dark mode.
- **Tokens:** live in code as CSS variables (shadcn style). No Figma sync.
- **Docs and playground:** Storybook for v1.
- **Team:** one developer working solo, so keep v1 to ~15–20 core components.
- **Skills to consult:** `grilling` + `domain-modeling` for grilling tickets; `research` for research tickets; `prototype` for prototype tickets.
- **Tracker:** local markdown in this folder. The owner will move it to GitHub Issues later.

## Decisions so far

<!-- one line per resolved ticket: [title](link): gist -->

- [How mature is shadcn/ui's Base UI support?](issues/01-shadcn-base-ui-support.md): mature. Base UI has been shadcn's default since Jul 2026 and covers every Radix component plus Toast, with `render` replacing `asChild`. Base UI is stable at v1.x; pin it and avoid preview APIs.
- [What are the options for distributing shadcn-based components to several Next.js apps?](issues/02-distribution-models.md): a monorepo package gives one source of truth but stays in one repo; a private registry suits separate repos but updates are manual and tokens get copied per app; the hybrid works across repos but means two pipelines. The choice hinges on whether apps share a repo.

## Not yet specified

- **Versioning and release flow** (e.g. changesets, semver, how apps upgrade): depends on the distribution model.
- **Testing strategy:** accessibility checks, visual regression, interaction tests in Storybook. Unclear how much is worth it for a solo v1.
- **Server and client component boundaries:** where `"use client"` lives, and whether anything ships as a Server Component.
- **Component API conventions:** variant handling (cva / tailwind-variants), composition and `render` props from Base UI, naming, how far to deviate from upstream shadcn code, and which shadcn `base-*` style to start from (it can't be changed after init).
- **Stack integration spike:** a tiny end-to-end proof (one component, themed, in Storybook, consumed by a Next.js app). It can only be specified once the distribution model and repo layout are known. It must also confirm points the research left unverified: whether Tailwind v4 scans pnpm-symlinked or shared-package paths via `@source`, whether `"use client"` survives the package build, and that `shadcn init --base base` works end to end in a fresh Next.js app.
- **Adoption path:** how existing internal apps migrate onto the system.
- **Icons:** lucide (shadcn default) or something else.
- **Final spec assembly:** turning resolved decisions into the handoff spec document.

## Out of scope

- Figma or design-token sync: tokens live in code for v1.
- Multi-brand or white-label theming: one brand only.
- Publishing publicly on npm or open-sourcing.
- React Native or mobile.
- Building the design system itself: the destination is the spec. The build comes after handoff.
