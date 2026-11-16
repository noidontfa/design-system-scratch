# Pick the custom example component

Parent: [Map](../map.md)
Label: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: hainam
Blocked by: none

## Question

v1 includes one custom component, shown on a single Storybook page that imports it from `@workspace/ui`, to demonstrate how a consuming app builds a custom component on top of core components. Which component is it, and what does the page show?

- The candidate is a DatePicker, composed from Calendar and Popover. Is this the right example, or should it be a different composition (for example, a filter bar built from Combobox and Input)?
- What does the Storybook page demonstrate: composition only, or also variants, props and `className` overrides?
- Does the custom component live in `packages/ui` next to core components, or in an app's own folder as an example of the app-local wrapper pattern?

## Answer

Resolved by grilling, 2026-11-16.

**Component.** `DatePicker`, composed from `Calendar` and `Popover`. It adds no new dependencies, since `Calendar` already brings `react-day-picker` and `date-fns`.

**Home.** A core component in `packages/ui`, not an app-local wrapper. The Storybook page is the demonstration. App-local wrappers stay the per-app escape hatch and are not this example.

**Storybook page.** Shows composition, one prop and one `className` override. No variant matrix. The specific prop (for example `placeholder` or a `format` option) is left for the spec to name.

**Consequences.** No fog graduates from this decision. The spec assembly will list the example as one v1 deliverable.
