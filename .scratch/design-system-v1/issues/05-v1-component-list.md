# Pick the v1 component list

Parent: [Map](../map.md)
Label: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: hainam
Blocked by: 01

## Question

Which ~15–20 components make up v1, and in what priority order? The list should be informed by what the Base UI variant of shadcn already provides (see [How mature is shadcn/ui's Base UI support?](./01-shadcn-base-ui-support.md)) and by what the internal apps actually need. Also decide which components, if any, are custom (not in shadcn) and which are out of v1.

## Answer

Resolved by grilling, 2026-11-16.

**Audience.** The consuming apps are internal CRUD, dashboard and settings apps. The list favours forms, data tables, status display, dialogs and dropdowns.

**Upstream set: 24 shadcn components, all `base-nova`.** The solo cap of ~15–20 is raised to fit the set.

- **Actions and inputs (8):** Button, Input, Textarea, Select, Checkbox, Switch, Combobox, Calendar
- **Form structure (2):** Label, Field (Field pulls in Separator as a dependency; Separator is not on the priority list)
- **Overlays and commands (6):** Dialog, Dropdown Menu, Popover, Tooltip, Toast, Command
- **Display and data (8):** Card, Badge, Avatar, Table, Skeleton, Chart, Carousel, Resizable

Calendar, Command, Chart, Carousel and Resizable are included even though they pull in third-party libraries (`react-day-picker` with `date-fns`, `cmdk`, `recharts`, `embla-carousel-react`, `react-resizable-panels`). Combobox is a Base UI component. Calendar and Popover are the building blocks for a date picker, which is why they are both on the list.

**Custom components.** v1 has one custom example, not a set of custom composites. It is a core component in `packages/ui`, shown on one Storybook page that imports it from `@workspace/ui`, to demonstrate how a consuming app builds a custom component. Which component it is goes to [Pick the custom example component](./08-custom-example-component.md).

**Priority order.** Tier placement for the components added in this round was not specified, so it is set here. Change it if the order is wrong.

- **Tier 1, foundations (8):** Button, Input, Label, Field, Card, Badge, Avatar, Skeleton
- **Tier 2, forms and data (7):** Textarea, Checkbox, Switch, Select, Combobox, Calendar, Table
- **Tier 3, overlays and advanced display (9):** Dialog, Dropdown Menu, Popover, Tooltip, Toast, Command, Chart, Carousel, Resizable

**Not in v1.** Base UI primitives that shadcn does not wrap: Autocomplete, Checkbox Group, Fieldset, Form, Meter, Number Field, OTP Field and Toolbar. They are not in the destination's scope for v1, so they are not on the map's Out of scope list. Form, which is in the research notes as the legacy React Hook Form wrapper, is also not part of the new bases.

**Consequences.**
- The map's Notes count is updated from ~15–20 to 24 plus one custom example.
- Third-party dependency policy for the five library-backed components is recorded as fog on the map.
- Component API conventions and testing are still open, as recorded on the map.
