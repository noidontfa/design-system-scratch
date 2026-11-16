# Define the design token model

Parent: [Map](../map.md)
Label: wayfinder:grilling
Type: grilling
Status: resolved
Blocked by: none

## Question

Which token categories does v1 have, and how are they named and structured?

- **Categories:** colour, typography, radius, spacing, shadow, motion, z-index, breakpoints.
- **Naming:** keep shadcn's semantic names (`--background`, `--primary`, `--muted`, ...), or add a primitive layer (raw palette such as `--blue-500`) underneath the semantic layer?
- **Light and dark:** how are they expressed?
- **Overrides:** which tokens is the owner expected to change when "configuring colours, fonts, and corner rounding"?

## Answer

Resolved by grilling, 2026-11-16.

- **Naming (yes):** one semantic colour layer using shadcn's names (`--background`, `--primary`, `--muted`, ...). No palette layer underneath. Components read semantic tokens only, and Tailwind's built-in palette remains ordinary utilities outside the token model.
- **Categories (yes):** three token categories. Colour, with the `base-nova` neutral scaffold kept intact, including `chart-1` to `chart-5` and `sidebar-*`. Radius, with one base `--radius` at `0.625rem` and the `radius-sm` to `radius-4xl` steps derived in `@theme inline`. Font family, with `--font-sans` and `--font-mono`. Spacing, shadow, motion, z-index, breakpoints and the type scale (size, weight, line height) stay on Tailwind defaults.
- **Colour inventory (yes):** add `success` / `success-foreground` and `warning` / `warning-foreground`. No `info` token (use `primary`). No `destructive-foreground`.

- **Light and dark mechanism (yes):** both palettes live in the shared stylesheet. `:root` holds the light values, and `.dark` redefines the same semantic tokens. The design system ships no theme toggle.
- **Default appearance (yes):** dark is what a person sees first, in Storybook and in every consuming app. Each one puts `class="dark"` on `<html>` in the initial markup, so the dark values render before client code runs. Removing the class shows the light values.
- **Owner overrides (yes):** configuring the brand means editing the shared stylesheet in both `:root` and `.dark`. The edits cover every semantic colour (including `success`, `warning`, `chart-*` and `sidebar-*`), `--font-sans`, `--font-mono`, and `--radius`. The derived radius steps and the `@theme inline` wiring are not edited. A consuming app may override any semantic token below the import, as an app-level choice separate from brand configuration.

