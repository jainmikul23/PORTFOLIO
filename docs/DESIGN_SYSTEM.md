# Design System: "Ink & Brass"

The design system is engineered around Apple-caliber glassmorphism, physical optical properties, and a non-generic high-contrast warm palette.

## Core Palette Tokens

```css
:root {
  /* Surfaces */
  --ink-950: #0a0d11;
  --ink-900: #0f141a;
  --ink-800: #161d25;

  /* Glass Panels */
  --glass: rgba(237, 232, 223, 0.07);
  --glass-hi: rgba(237, 232, 223, 0.12);
  --stroke: rgba(237, 232, 223, 0.16);
  --stroke-hi: rgba(237, 232, 223, 0.34);

  /* Typography */
  --bone: #ede8df;
  --stone: #9c9a92;
  --dim: #6b6f73;

  /* Intentional Accents */
  --brass: #e0a458;      /* Primary interactive accent */
  --sage: #7fb7a4;       /* Success, verified, secondary */
  --vermilion: #e8553d;  /* Warning, error, focal highlights */

  /* Radii & Blur */
  --r-xl: 32px;
  --r-lg: 24px;
  --r-md: 16px;
  --r-sm: 10px;
  --blur: 28px;

  /* Transitions */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## Glassmorphism Formula

Every glass panel implements a multi-layer composite:
1. **Translucent Tint**: `background: var(--glass)`
2. **Optical Diffusion**: `backdrop-filter: blur(var(--blur)) saturate(170%)`
3. **Inner Specular Rim**: `box-shadow: 0 1px 0 rgba(255, 255, 255, 0.28) inset`
4. **Elevation Shadow**: `box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.55)`
5. **Border Stroke**: `border: 1px solid var(--stroke)`
6. **Subtle Grain**: 3% noise texture overlay to eliminate plastic-sheen banding.

