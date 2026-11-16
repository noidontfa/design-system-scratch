# shadcn/ui support for Base UI as the primitive layer

Resolves: [01 — How mature is shadcn/ui's Base UI support?](../.scratch/design-system-v1/issues/01-shadcn-base-ui-support.md)
Researched: 2026-11-16. Snapshot: shadcn CLI `4.23.0` (published 2026-10-27), `@base-ui/react` `1.9.0` (published 2026-10-09), shadcn-ui/ui `main` at commit [`e62c943`](https://github.com/shadcn-ui/ui/commit/e62c9435fff729a175f38983dee73b2cb4f6a069) (2026-11-13).

## TL;DR

- Base UI is a **first-class, default** base in shadcn/ui. Since **2026-07-02**, `npx shadcn init` picks Base UI by default; Radix is "not being deprecated" and stays one flag away (`-b radix`). React Aria became a third base on 2026-07-17. ([changelog: Base UI as the Default](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default), [changelog: React Aria](https://ui.shadcn.com/docs/changelog/2026-07-react-aria))
- You pick the base with `--base base|radix|aria` on `init`/`create`. It's stored in `components.json` as a prefixed `style`, e.g. `"style": "base-nova"`. `style` can't be changed after init. ([CLI docs](https://ui.shadcn.com/docs/cli), [schema.json](https://ui.shadcn.com/schema.json), [components.json docs](https://ui.shadcn.com/docs/components-json))
- **Component parity:** the Base UI registry has every component the Radix registry has, plus a Base-only `toast` (64 vs 63 components). The only component missing from both new bases is the legacy React Hook Form `form` wrapper, which exists only in `new-york-v4`. ([registry source](https://github.com/shadcn-ui/ui/tree/main/apps/v4/registry/bases))
- **API difference:** Base variants use Base UI's `render` prop instead of Radix's `asChild`, and wrapper props are typed from Base UI (e.g. `DialogPrimitive.Root.Props`). shadcn says it keeps "the same abstraction" (the same exported component names), but you still have to write the composition differently. ([changelog](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default), [Drawer docs](https://ui.shadcn.com/docs/components/base/drawer), [Base UI Composition](https://base-ui.com/react/handbook/composition))
- **Base UI itself** has been stable since **v1.0.0 (2025-12-11)** and ships a minor release roughly every month (latest **v1.9.0**, 2026-10-09). New parts first ship as **"preview"** exports, and promoting one to stable has been labelled a **breaking change inside a minor release** (Drawer in 1.3.0, OTPField in 1.6.0). ([Base UI releases](https://base-ui.com/react/overview/releases))

---

## 1. Starting a project / adding components with Base UI

### CLI

- `shadcn init` (alias `shadcn create`) accepts `-b, --base <base>` with values `base`, `radix`, `aria`. ([CLI docs](https://ui.shadcn.com/docs/cli#init))
  - I confirmed this locally: `npx shadcn@4.23.0 init --help` prints `-b, --base <base>  the component library to use. (base, radix, aria)` and `-t, --template` with `next, start, vite, react-router, laravel, astro`.
  - `-d, --defaults`: the installed CLI help says `--template=next --preset=base-nova`, while the [CLI docs page](https://ui.shadcn.com/docs/cli#init) says `--preset=nova`. This is a small docs/CLI mismatch, and either way the result is a Base UI project.
- Base UI is the default when you don't pass `--base`: "New projects default to Base UI. Run `npx shadcn init` and Base UI is the default pick." ([changelog 2026-07](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default))
  - Caveat from the same post: CI scripts that run `shadcn init` non-interactively and expect Radix now need `-b radix`.
- **shadcn/create** (web UI at [ui.shadcn.com/create](https://ui.shadcn.com/create), launched Dec 2025) lets you pick the component library, style, base color, fonts and icons, then generates a command such as `npx shadcn@latest init --preset [CODE] --template next`. That command includes options like `--base`, `--monorepo` and `--rtl`. ([Next.js install docs](https://ui.shadcn.com/docs/installation/next), [changelog 2025-12](https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create))
- After init, `shadcn add <component>` installs the implementation that matches the project's base automatically: "When you pull down components, we auto-detect your library and apply the right transformations." ([changelog 2025-12](https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create))
  - I checked this against the live registry: `https://ui.shadcn.com/r/styles/base-nova/dialog.json` imports `@base-ui/react/dialog`, while `radix-nova/dialog.json` imports from `radix-ui`.
- `shadcn docs <component> -b base|radix|aria` fetches docs for a given base, and by default uses the project's base. ([CLI docs](https://ui.shadcn.com/docs/cli#docs))
- **Registries:** "Building a registry? Ship a `registry:base` config if you want to pin a specific library. Items without one now init as Base UI." ([changelog 2026-07](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default)). `registry:base` is documented as "Use for entire design systems." ([registry-item.json docs source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/registry-item-json.mdx))
- **Runtime requirement (observed, not from the docs):** `shadcn@4.23.0` declares `engines.node >=20.18.1`. npm warned about this on Node 20.15.

### components.json

- The base is encoded in the `style` enum. Allowed values are `radix-*`, `base-*` and `aria-*` × `vega, nova, maia, lyra, mira, luma, sera, rhea`, plus the legacy `default` and `new-york`. ([schema.json](https://ui.shadcn.com/schema.json))
- The docs examples use `"style": "base-nova"`, both for a single app and for every workspace in a monorepo. ([theming docs source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/(root)/theming.mdx), [monorepo docs source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/(root)/monorepo.mdx))
- "The style for your components. **This cannot be changed after initialization.**" ([components.json docs](https://ui.shadcn.com/docs/components-json#style)). In practice, switching base later means migrating, not flipping a config value (see §3).
- For Tailwind v4, leave `tailwind.config` blank. ([components.json docs](https://ui.shadcn.com/docs/components-json#tailwindconfig))
- The base registry item declares `@base-ui/react` as its dependency ([`registry/bases.ts`](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases.ts)), and since Sept 2026 components import `cn` from the `cn` package instead of `@/lib/utils` ([changelog 2026-09](https://ui.shadcn.com/docs/changelog)).

## 2. Component coverage: Base UI vs Radix

Source: the file listings under [`apps/v4/registry/bases/{base,radix,aria}/ui`](https://github.com/shadcn-ui/ui/tree/main/apps/v4/registry/bases) at commit `e62c943`.

**The Base UI variant (64 components):** accordion, alert, alert-dialog, aspect-ratio, attachment, avatar, badge, breadcrumb, bubble, button, button-group, calendar, card, carousel, chart, checkbox, code-block, collapsible, combobox, command, context-menu, dialog, direction, drawer, dropdown-menu, empty, field, hover-card, input, input-group, input-otp, item, kbd, label, marker, menubar, message, message-scroller, native-select, navigation-menu, pagination, popover, progress, questionnaire, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, **toast**, toggle, toggle-group, tooltip, trace.

| Comparison | Result |
| --- | --- |
| In Base UI but not Radix | `toast` (Base-only) |
| In Radix but not Base UI | none |
| In legacy `new-york-v4` but in neither new base | `form` (React Hook Form wrapper) |
| In Base UI but not React Aria | `menubar`, `navigation-menu`, `toast` |

Notes:

- **Toast vs Sonner.** Toast was added in July 2026 "for Base UI projects", built on Base UI's Toast primitive ([changelog 2026-07 Toast](https://ui.shadcn.com/docs/changelog/2026-07-toast)). On the live site, the Base docs page for Sonner (`/docs/components/base/sonner`) returns a 308 redirect to `/docs/components/base/toast`, and Sonner doesn't appear in the Base docs nav ([base meta.json](https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/base/meta.json)). The `sonner` item is still in the Base registry ([registry source](https://github.com/shadcn-ui/ui/tree/main/apps/v4/registry/bases/base/ui)). The Radix registry has no `toast` (`/r/styles/radix-nova/toast.json` returns 404).
- **Shadcn's stated policy:** "every update and new component will ship for both libraries (unless a component only exists in Base UI)". ([changelog 2026-07](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default)). Recent additions (Questionnaire in Aug 2026; Trace and Code Block in Oct 2026) shipped "for Base UI, React Aria and Radix across all eight styles". ([changelog](https://ui.shadcn.com/docs/changelog))
- **Forms:** the docs point to building forms with `Field` plus React Hook Form, TanStack Form or Formisch ([forms docs source](https://github.com/shadcn-ui/ui/tree/main/apps/v4/content/docs/forms)). The old `form` component isn't part of the new bases.
- **Which primitives the Base variant actually uses** (from imports in the source files):
  - **Base UI primitives:** accordion, alert-dialog, avatar, button, checkbox, collapsible, combobox, context-menu, dialog/sheet, direction (DirectionProvider), drawer, dropdown-menu (Menu), hover-card (PreviewCard), input, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, switch, tabs, toast, toggle, toggle-group, tooltip. Badge, breadcrumb, item, sidebar and similar components use Base UI's `useRender` and `mergeProps`.
  - **Still on third-party libraries in the Base variant:** calendar (`react-day-picker`), carousel (`embla-carousel-react`), chart (`recharts`), command (`cmdk`), input-otp (`input-otp`, not Base UI's OTPField), resizable (`react-resizable-panels`), sonner (`sonner`). Message Scroller and Questionnaire use `@shadcn/react`.
  - **Drawer** in the Base variant now uses Base UI's Drawer instead of Vaul, and its docs include a "Migrating from Vaul" section. The Radix drawer still imports `vaul`. ([Base Drawer docs](https://ui.shadcn.com/docs/components/base/drawer), [radix drawer.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/radix/ui/drawer.tsx))
- **Base UI primitives with no shadcn wrapper:** Autocomplete, Checkbox Group, Fieldset, Form, Meter, Number Field, OTP Field and Toolbar appear in [Base UI's component list](https://base-ui.com/llms.txt), but there's no file for them in the shadcn Base registry. (shadcn's `field` and `label` are plain elements, not Base UI's Field.) These would be candidates for the internal design system to wrap itself.

## 3. API differences, gaps and stability caveats

### `asChild` → `render`

- shadcn: "Mechanical things get fixed everywhere (`asChild` is now `render`). Behavior changes get flagged, never silently patched." ([changelog 2026-07](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default))
- Example from the shadcn Base Drawer docs ([source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/base/drawer.mdx)):
  ```diff
  - <DrawerTrigger asChild>
  -   <Button variant="outline">Open</Button>
  - </DrawerTrigger>
  + <DrawerTrigger render={<Button variant="outline" />}>
  +   Open
  + </DrawerTrigger>
  ```
- Base UI's own rules ([Composition handbook](https://base-ui.com/react/handbook/composition)):
  - A custom component passed to `render` "must forward the `ref`, and spread all the received props on its underlying DOM node".
  - `render` calls can be nested, e.g. Tooltip → Dialog → Menu trigger.
  - Props are merged: class names are combined, the render element's `style` values and other attributes win, both event handlers run, and every `ref` is kept.
  - `render` also accepts a function, for performance-sensitive cases.
- **Links styled as buttons:** "Do not use `<Button render={<a />} nativeButton={false} />` for links. The Base UI `Button` component always applies `role="button"`… Use `buttonVariants` with a plain `<a>` tag instead." ([Base Button docs source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/base/button.mdx))
- **Other prop renames** show up per component. For example, the Base Drawer uses `swipeDirection="down"` instead of `direction="bottom"`, and `snapPoint`/`onSnapPointChange` instead of `activeSnapPoint`/`setActiveSnapPoint`. ([Base Drawer docs](https://ui.shadcn.com/docs/components/base/drawer))
- **Shared CSS hooks:** `shadcn/tailwind.css` defines a `data-open:` variant that matches both Radix's `[data-state="open"]` and Base UI's `[data-open]`. The accordion animation also falls back from `--radix-accordion-content-height` to `--accordion-panel-height`. ([CLI docs, eject section](https://ui.shadcn.com/docs/cli#eject))

### Migrating Radix → Base UI

- There is **no CLI codemod**. `shadcn migrate --list` in 4.23.0 offers only `cn`, `icons`, `base-color`, `radix` and `rtl` (`radix` means moving to the unified `radix-ui` package, not to Base UI). ([CLI docs](https://ui.shadcn.com/docs/cli#migrate), confirmed locally)
- Migration is done with an agent skill instead (`npx skills add shadcn/ui`, then for example "migrate accordion to base-ui"):
  - It works one component at a time, and both libraries can coexist while you migrate.
  - It writes a report per component to `.migration/` and makes one commit per component on a branch.
  - shadcn reports testing it on 60+ components (36 of them on Radix) in about 25 minutes at roughly 10k tokens per component. ([changelog 2026-07](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default))
  - I did not run the skill.

### Known gaps and open bugs (snapshot)

- A GitHub issue search on 2026-11-16 found **42 open issues** in shadcn-ui/ui with "base ui" in the title ([search](https://github.com/shadcn-ui/ui/issues?q=is%3Aissue+is%3Aopen+%22base+ui%22+in%3Atitle)). The most recent are mostly styling and accessibility bugs in the Base variants. Examples:
  - [#12697](https://github.com/shadcn-ui/ui/issues/12697): SidebarMenuButton ignores `disabled` when `tooltip` is set.
  - [#12592](https://github.com/shadcn-ui/ui/issues/12592): ComboboxInput trigger has no accessible name.
  - [#12582](https://github.com/shadcn-ui/ui/issues/12582): Accordion has no disabled style with `@base-ui/react` 1.9.0.
  - [#12519](https://github.com/shadcn-ui/ui/issues/12519): Escape from a toast closes the parent Dialog.
  - [#11741](https://github.com/shadcn-ui/ui/issues/11741): Toast renders behind Dialog backdrops (z-index).
  - [#11751](https://github.com/shadcn-ui/ui/issues/11751): Button drops functional `className` callbacks.
  - [#11624](https://github.com/shadcn-ui/ui/issues/11624): the Base UI transformer gives button semantics to button-styled links.

  I did not triage whether these are confirmed or still reproduce.
- Minor docs inconsistency: the Base `data-table` docs page still renders two previews with `styleName="radix-nova"` ([source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/base/data-table.mdx)).

### Stability

- shadcn calls Base UI production-ready ("Base UI is stable. It's at 1.6.0 with 6M+ weekly downloads"), uses it for every new project of its own, and recommends it for new projects. It also advises existing Radix apps not to migrate: "If your app works, keep shipping." ([changelog 2026-07](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default)). I did not independently check the download figure.

## 4. What Base UI says about itself

- **Identity:**
  - Package `@base-ui/react`, MIT license, repo [mui/base-ui](https://github.com/mui/base-ui).
  - "From the creators of Radix, Material UI, and Floating UI".
  - Unstyled and headless, focused on accessibility and following the WAI-ARIA patterns. ([About](https://base-ui.com/react/overview/about), [README](https://github.com/mui/base-ui/blob/master/README.md))
  - It was renamed from `@base-ui-components/react` at v1.0.0. ([v1.0.0 notes](https://base-ui.com/react/overview/releases/v1-0-0))
- **Support matrix:**
  - React 17 and newer. npm peer dependencies: `react`/`react-dom` `^17 || ^18 || ^19`, plus optional `date-fns` and `@date-fns/tz`. I couldn't confirm from the docs what the date-fns peers are for.
  - Browsers: features marked "Baseline Widely Available" at the time of the last major release.
  - Bundlers: Vite, webpack, Turbopack and Parcel.
  - Sources: [About](https://base-ui.com/react/overview/about), `npm view @base-ui/react@1.9.0 peerDependencies`.
- **Release history:**
  - Alpha from Dec 2024, beta from May 2025, **v1.0.0 on 2025-12-11**.
  - Since then: 1.1 (Jan 15), 1.2 (Feb 12), 1.3 (Mar 12), 1.4 (Apr 13), 1.4.1 (Apr 20), 1.5 (May 19), 1.6 (Jun 18), 1.7 (Aug 4), 1.8 (Sep 4) and **1.9 (Oct 9, 2026)**.
  - Sources: [Releases](https://base-ui.com/react/overview/releases), [llms.txt](https://base-ui.com/llms.txt), `npm view @base-ui/react time`.
- **Versioning in practice:** I found no written semver or "preview" policy on base-ui.com or in the repo README. From the release notes:
  - New components or features ship as **preview** first. Examples: Drawer in 1.2.0, `OTPField` in 1.4.0, menu filtering (`Menu.FilterProvider`/`Menu.Input`) in 1.9.0.
  - Promoting a preview to stable renames the export and is labelled **"Breaking change"** in a minor release:
    - 1.3.0: "`Drawer` is no longer marked as preview… should be imported as `{ Drawer } from '@base-ui/react/drawer'`".
    - 1.6.0: "`OTPFieldPreview` → `OTPField`".
  - 1.5.0 also contains a "Breaking change" in the then-preview OTP Field (`sanitizeValue()` → `normalizeValue()`).
  - Sources: [v1.3.0](https://base-ui.com/react/overview/releases/v1-3-0), [v1.5.0](https://base-ui.com/react/overview/releases/v1-5-0), [v1.6.0](https://base-ui.com/react/overview/releases/v1-6-0), [v1.9.0](https://base-ui.com/react/overview/releases/v1-9-0).
  - **Inference (not stated by Base UI):** stable exports seem to follow semver, but preview APIs can break in minor releases. Pin versions and avoid preview parts in the design system.
- **Component list (37 components):** Accordion, Alert Dialog, Autocomplete, Avatar, Button, Checkbox, Checkbox Group, Collapsible, Combobox, Context Menu, Dialog, Drawer, Field, Fieldset, Form, Input, Menu, Menubar, Meter, Navigation Menu, Number Field, OTP Field, Popover, Preview Card, Progress, Radio Group, Scroll Area, Select, Separator, Slider, Switch, Tabs, Toast, Toggle, Toggle Group, Toolbar, Tooltip. Utilities: CSP Provider, Direction Provider, `mergeProps`, `useRender`. ([llms.txt](https://base-ui.com/llms.txt))
  - There are **no** Base UI primitives for Calendar/Date Picker, Command palette, Carousel, Resizable or Chart. That's why the shadcn Base variant still uses third-party libraries for these (see §2).

## Implications for the design-system decisions

- **v1 component list:** the shadcn Base UI variant covers the full shadcn catalog. Candidates beyond it: Base UI primitives that shadcn doesn't wrap (Autocomplete, Number Field, Meter, Toolbar, Checkbox Group, Fieldset, OTP Field).
- **Distribution:** pin `"style": "base-<style>"` in every app's `components.json`, or ship a private registry with a `registry:base` item, so installs don't depend on CLI defaults. Pin `@base-ui/react` because of the monthly minors and the preview churn.
- **Team conventions:** document the `render` prop (ref forwarding, prop spreading) and the "links use `buttonVariants`, not `Button render={<a/>}`" rule.

## Could not verify

- shadcn's "6M+ weekly downloads" and "2 to 1 Base UI over Radix on shadcn/create" figures.
- A formal Base UI semver or preview-stability policy (none found; the behavior above comes from the release notes).
- Whether the open GitHub issues listed are confirmed or still reproduce.
- An end-to-end `shadcn init` run on a fresh Next.js app (I checked CLI help and live registry JSON instead) and the migration skill's output.
- Why `@base-ui/react` declares optional `date-fns` peers.
