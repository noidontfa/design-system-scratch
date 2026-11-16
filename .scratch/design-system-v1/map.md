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
- **Team:** one developer working solo, so keep v1 small: 24 core components plus one custom example (see [Pick the v1 component list](issues/05-v1-component-list.md)).
- **Skills to consult:** `grilling` + `domain-modeling` for grilling tickets; `research` for research tickets; `prototype` for prototype tickets.
- **Tracker:** local markdown in this folder. The owner will move it to GitHub Issues later.

## Decisions so far

<!-- one line per resolved ticket: [title](link): gist -->

- [How mature is shadcn/ui's Base UI support?](issues/01-shadcn-base-ui-support.md): mature. Base UI has been shadcn's default since Jul 2026 and covers every Radix component plus Toast, with `render` replacing `asChild`. Base UI is stable at v1.x; pin it and avoid preview APIs.
- [What are the options for distributing shadcn-based components to several Next.js apps?](issues/02-distribution-models.md): a monorepo package gives one source of truth but stays in one repo; a private registry suits separate repos but updates are manual and tokens get copied per app; the hybrid works across repos but means two pipelines. The choice hinges on whether apps share a repo.
- [Choose the distribution model](issues/03-choose-distribution-model.md): `packages/ui` inside the apps' monorepo via `workspace:*`, unpublished and with no registry. Apps move in lockstep; they vary components through props, `className`, CSS variables or app-local wrappers, never forks.
- [Decide the repo and tooling layout](issues/06-repo-and-tooling-layout.md): `packages/ui` added to the existing pnpm and Turborepo monorepo, with per-file subpath exports and no barrel. Shared ESLint and TypeScript packages and `apps/storybook` sit beside it. Each app owns its entry CSS, and the shared CSS scans only `packages/ui`.
- [Stack integration spike](issues/07-stack-integration-spike.md): the layout works. Default init writes `base-nova`. Shared `@source` keeps package classes in every app and keeps one app's classes out of another's. `"use client"` in `packages/ui` and `@workspace/ui/components/button` work in Next and Storybook. This effort uses Node 26. pnpm 11.25.0 does not run on Node 20.
- [Pick the v1 component list](issues/05-v1-component-list.md): 24 shadcn core components in three build tiers: foundations, forms and data, then overlays and advanced display. Adds Calendar, Combobox, Command, Chart, Carousel, Resizable, Label and Field to the original 16. One custom example, shown in Storybook, is split out to [Pick the custom example component](issues/08-custom-example-component.md). Base UI primitives shadcn doesn't wrap stay out of v1.
- [Pick the custom example component](issues/08-custom-example-component.md): a `DatePicker` composed from `Calendar` and `Popover`, kept as a core component in `packages/ui`. Its Storybook page shows composition, one prop and one `className` override, with no variant matrix. The specific prop is left for the spec to name.
- [Define the design token model](issues/04-token-model.md): colour, radius and font family only, as semantic tokens in one shared stylesheet with shadcn's names and no palette layer. Light values sit in `:root`, dark values in `.dark`, and dark is the default a person sees, in Storybook and every app. Owners edit the semantic colours, `--font-sans`, `--font-mono` and `--radius` in that file.

## Not yet specified

- **Change management under lockstep:** with no versions, how breaking changes to `packages/ui` are made safely (e.g. a changelog, deprecating a prop before removing it, a PR checklist that touches every app). Possibly small enough to fold into the final spec.
- **Testing strategy:** accessibility checks, visual regression, interaction tests in Storybook. Unclear how much is worth it for a solo v1.
- **Server and client component boundaries:** where `"use client"` lives, and whether anything ships as a Server Component. The base-nova button wrapper ships without the directive; `@base-ui/react` has it. A wrapper that holds state needs its own.
- **Component API conventions:** variant handling (cva / tailwind-variants), composition and `render` props from Base UI, naming, and how far to deviate from upstream shadcn code.
- **Adoption path:** how existing internal apps migrate onto the system.
- **Icons:** lucide (shadcn default) or something else.
- **Third-party dependency policy:** five v1 components pull in libraries outside Base UI: Calendar (`react-day-picker`, `date-fns`), Command (`cmdk`), Chart (`recharts`), Carousel (`embla-carousel-react`) and Resizable (`react-resizable-panels`). Open: pinning, upgrade cadence, and what to do when a library breaks against React 19 or Next.js.
- **Final spec assembly:** turning resolved decisions into the handoff spec document.

## Out of scope

- Figma or design-token sync: tokens live in code for v1.
- Multi-brand or white-label theming: one brand only.
- Publishing publicly on npm or open-sourcing.
- Publishing a private package, a shadcn registry, and per-app versioning, all ruled out for v1 by [Choose the distribution model](issues/03-choose-distribution-model.md). They come back as a new effort if an app leaves the monorepo, apps need independent upgrades, or copy-and-adapt blocks appear.
- React Native or mobile.
- Building the design system itself: the destination is the spec. The build comes after handoff.
