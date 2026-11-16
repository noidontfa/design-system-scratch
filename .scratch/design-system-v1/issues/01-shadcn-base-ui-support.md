# How mature is shadcn/ui's Base UI support?

Parent: [Map](../map.md)
Label: wayfinder:research
Type: research
Status: resolved
Blocked by: none

## Question

What is the current state of shadcn/ui's support for Base UI (`@base-ui/react`) as the primitive layer instead of Radix?

- How do you start a project or add components with Base UI selected (CLI flags, `components.json` settings, `shadcn create`)?
- Which shadcn components exist in the Base UI variant, and which are Radix-only or missing?
- Are there known gaps, API differences (e.g. `asChild` vs Base UI's `render` prop), or stability caveats?
- What does the Base UI project itself say about its own stability, versioning, and component list?

Answers feed the v1 component-list decision and the distribution decision.

## Answer

Full findings: `research/shadcn-base-ui-support.md` on the `research/shadcn-base-ui-support` branch (commit `13fde2a`). Never merged; read with `git show research/shadcn-base-ui-support:research/shadcn-base-ui-support.md`.

- **Default base:** Base UI has been shadcn's default base since 2 Jul 2026. Radix is still supported (`-b radix`), and React Aria was added as a third base on 17 Jul 2026.
- **Setup:** `npx shadcn init --base base` (or the shadcn/create page). This writes a prefixed style to `components.json` (e.g. `"style": "base-nova"`), which can't be changed after init. `shadcn add` then installs Base variants automatically. Checked against CLI 4.23.0.
- **Coverage:** all 63 Radix components plus a Base-only Toast. Nothing is Radix-only. The legacy RHF `form` wrapper exists only in `new-york`. Calendar, Carousel, Chart, Command, Input OTP, Resizable and Sonner still depend on third-party libraries. Base UI primitives shadcn doesn't wrap: Autocomplete, Number Field, Meter, Toolbar, Checkbox Group, Fieldset, Form, OTP Field.
- **API:** `render` replaces `asChild`; custom elements passed to `render` must forward ref and spread props. Some props are renamed per component. For a link styled as a button, use `buttonVariants` on `<a>`.
- **Migration:** there's no codemod; shadcn offers an agent skill that migrates one component at a time.
- **Known issues:** about 42 open shadcn issues mention Base UI, mostly styling and accessibility.
- **Base UI stability:** v1.0 stable since 11 Dec 2025, currently v1.9.0 with roughly monthly minors, 37 components, React 17 to 19. Preview parts have been renamed in breaking ways inside minor releases, so pin the version and avoid preview APIs.
