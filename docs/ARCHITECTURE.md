# Architecture Overview

This document outlines the architectural principles, directory layout, rendering strategy, and 3D integration pipeline for Mikul Jain's Full Stack Engineer Portfolio.

```mermaid
flowchart TD
  subgraph Client ["Client Browser (Next.js 15 App Router)"]
    DOM["Glass UI Layer (CSS Modules + Framer Motion)"]
    Canvas["Persistent 3D Canvas (R3F + Drei)"]
    Camera["Scroll Camera Controller (GSAP ScrollTrigger)"]
  end

  subgraph StateContent ["Content & State Engine"]
    Profile["Typed Profile Schema (src/content/profile.ts)"]
    MDX["MDX Case Studies (src/content/projects/*.mdx)"]
    Env["Zod Environment Guard (src/lib/env.ts)"]
  end

  subgraph ServerRoute ["Edge & Route Handlers"]
    ContactAPI["/api/contact (Zod + Honeypot)"]
    RateLimiter["Rate Limiter (Upstash / In-Memory LRU)"]
    Resend["Resend API Email Dispatcher"]
  end

  Profile --> DOM
  MDX --> DOM
  DOM --> ContactAPI
  ContactAPI --> RateLimiter
  RateLimiter --> Resend
  Camera -.-> Canvas
```

## Layer Responsibilities

1. **Presentation (DOM & Glass)**: Server-rendered React components hydrated with Framer Motion for micro-interactions and custom CSS modules for high-performance glassmorphism.
2. **3D Scene Graph (R3F)**: Rendered through a single persistent `<Canvas>` background. Driven by scroll offsets and mouse parallax via `useFrame`.
3. **Data Layer**: Strictly validated schema (`src/content/profile.ts`) and MDX frontmatter with zero unchecked any types.
4. **API & Defense**: Next.js App Router Route Handler protected by client rate limiting, honeypot spam detection, and Zod input validation.
