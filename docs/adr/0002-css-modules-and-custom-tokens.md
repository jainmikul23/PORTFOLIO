# ADR 0002: CSS Modules and Custom Design Tokens

## Status
Accepted

## Context
The portfolio demands an Apple-inspired glassmorphism aesthetic based on the "Ink & Brass" color palette. The brief forbids utility frameworks (Tailwind, Bootstrap) and pre-packaged UI kits to eliminate generic design patterns and ensure custom specular reflections, fluid typography, and bespoke glass layers.

## Decision
We adopted **Vanilla CSS Modules coupled with root CSS custom properties (tokens.css, glass.css, typography.css)**.

## Consequences
- **Positive:**
  - Zero runtime CSS overhead, maximum performance and Lighthouse scores.
  - Complete control over layered backdrops (`backdrop-filter`, multi-stop shadows, specular gradients, noise overlays).
  - Scope-isolated component styling without namespace collisions.
  - Native CSS variables allow smooth runtime theme transitions (warm paper light vs ink dark) and dynamic accent tint shifts.
- **Negative:**
  - Requires maintaining custom utility tokens and layout primitives manually rather than relying on standard utility classes.

