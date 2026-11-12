"use client";

import { useEffect, useRef } from "react";
import {
  bindHeroDisappear,
  bindHeaderDisappear,
  bindCardScrollDisappear,
  bindStickyDissolve,
} from "@/lib/animations/cinematicDisappear";
import { prefersReducedMotion } from "@/lib/animations/config";

/**
 * React hook to attach cinematic scroll-driven disappearance to sections or cards.
 */
export function useHeroDisappear() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const cleanup = bindHeroDisappear(sectionRef.current, {
      headline: headlineRef.current,
      visual: visualRef.current,
      facts: factsRef.current,
      glow: glowRef.current,
    });

    return () => {
      cleanup.kill();
    };
  }, []);

  return { sectionRef, headlineRef, visualRef, factsRef, glowRef };
}

/**
 * Hook to attach scroll disappear to a section's header and cards
 */
export function useSectionDisappear<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) return;

    const cleanups: Array<{ kill: () => void }> = [];

    if (headerRef.current) {
      cleanups.push(bindHeaderDisappear(headerRef.current));
    }

    // Automatically bind to any marked cards or articles within the section container
    const cards = containerRef.current.querySelectorAll<HTMLElement>("[data-scroll-disappear]");
    cards.forEach((card) => {
      cleanups.push(bindCardScrollDisappear(card));
    });

    return () => {
      cleanups.forEach((c) => c.kill());
    };
  }, []);

  return { containerRef, headerRef };
}

/**
 * Hook to attach a sticky dissolve transition to a section
 */
export function useStickyDissolve<T extends HTMLElement, C extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const contentRef = useRef<C>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current || prefersReducedMotion()) return;

    const cleanup = bindStickyDissolve(containerRef.current, contentRef.current);

    return () => {
      cleanup.kill();
    };
  }, []);

  return { containerRef, contentRef };
}
