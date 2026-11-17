# Design system

The internal design system shared by the company's product apps, and the vocabulary used while specifying it.

## Language

**Design system**:
The single shared set of tokens and core components that every consuming app builds its UI from.
_Avoid_: UI kit, component library

**Core component**:
A component owned by the design system that consuming apps use as-is, varying it only through its public options or by wrapping it.
_Avoid_: shared component, primitive (reserved for the underlying Base UI building blocks)

**Consuming app**:
An internal product app that uses the design system.
_Avoid_: client, host app, consumer

**App shell**:
The persistent frame of a consuming app (navigation, header and content area) that wraps its pages. Owned by the consuming app, not the design system.
_Avoid_: layout, chrome

**Dashboard**:
A page inside an app shell that shows summary content. Currently a placeholder view at `/dashboard`.
_Avoid_: home, overview

**Design token**:
A named design value (colour, radius or font family) that core components read by role, never by raw value.
_Avoid_: theme variable, style constant

**Semantic token**:
A design token named by the role it plays on a surface, such as `primary` or `muted`, rather than by the colour it holds.
_Avoid_: palette token, raw colour

**Landing theme**:
The dark, monochrome look of the landing page: black surfaces, white text, Inter body type and Instrument Serif accents. The design system's semantic tokens take their values from it.
_Avoid_: landing styles, marketing theme
