// Centralized Animation Tokens, Easings, and Performance Thresholds

export const ANIMATION_CONFIG = {
  durations: {
    instant: 0.15,
    fast: 0.3,
    normal: 0.6,
    slow: 1.0,
    cinematic: 1.4,
  },
  easings: {
    out: "power3.out",
    inOut: "power3.inOut",
    expo: "expo.out",
    spring: "elastic.out(1, 0.75)",
    smooth: "sine.inOut",
  },
  stagger: {
    tight: 0.04,
    normal: 0.08,
    loose: 0.15,
  },
  scrollTrigger: {
    start: "top 85%",
    end: "bottom 15%",
    toggleActions: "play none none reverse",
  },
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

