# ADR 0001: Use React Three Fiber (R3F) for 3D Graphics

## Status
Accepted

## Context
The portfolio requires an always-moving, living 3D world with an interactive camera path linked to page scroll, ambient floating particles, interactive glass materials (`MeshTransmissionMaterial`), and dynamic system architecture diagrams. We needed a graphics abstraction that maintains 60 fps on desktop while integrating seamlessly with Next.js React component lifecycles.

## Decision
We chose **Three.js via React Three Fiber (@react-three/fiber)** paired with `@react-three/drei` and `@react-three/postprocessing`.

## Consequences
- **Positive:**
  - Declarative scene graph that synchronizes cleanly with React state and Next.js App Router.
  - Ecosystem support from `@react-three/drei` for advanced shaders, materials, and geometry helpers.
  - Native performance optimizations (frame looping, adaptive DPR, frustum culling, instancing).
- **Negative:**
  - Requires strict lifecycle management and explicit disposal (`dispose()`) of meshes and geometries on unmount to prevent WebGL context leaks.
  - 3D bundle size must be isolated and loaded dynamically (`next/dynamic` with `ssr: false`) to safeguard LCP performance budgets.
