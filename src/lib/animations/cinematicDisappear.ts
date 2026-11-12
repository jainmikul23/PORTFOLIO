import { gsap, initGSAP } from "./gsap";
import { prefersReducedMotion } from "./config";

/**
 * Premium Cinematic Scroll-Disappear Animation Architecture
 * Synchronized with GSAP ScrollTrigger and Lenis smooth scroll.
 * Features:
 * - Scrub-based vertical exit & fade out
 * - Scale down + progressive blur
 * - Staggered multi-layer depth (headings, cards, background)
 * - Bidirectional fluid scrub (smooth reversal on scroll up)
 * - Graceful fallback on reduced-motion preference
 */

export interface DisappearCleanups {
  kill: () => void;
}

/**
 * Hero Section Cinematic Scroll Disappearance
 * Smoothly dissolves the hero elements with progressive blur, vertical translation,
 * and scale down as the user scrolls into Chapter 02.
 */
export function bindHeroDisappear(
  heroSection: HTMLElement,
  elements: {
    headline?: HTMLElement | null;
    visual?: HTMLElement | null;
    facts?: HTMLElement | null;
    glow?: HTMLElement | null;
  },
): DisappearCleanups {
  if (prefersReducedMotion() || typeof window === "undefined") {
    return { kill: () => {} };
  }

  initGSAP();

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom 15%",
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    if (elements.headline) {
      tl.to(
        elements.headline,
        {
          y: -70,
          opacity: 0,
          ease: "power2.inOut",
        },
        0,
      );
    }

    if (elements.visual) {
      tl.to(
        elements.visual,
        {
          y: -45,
          scale: 0.91,
          opacity: 0,
          ease: "power2.inOut",
        },
        0.05,
      );
    }

    if (elements.facts) {
      tl.to(
        elements.facts,
        {
          y: -25,
          opacity: 0,
          ease: "power2.inOut",
        },
        0.1,
      );
    }

    if (elements.glow) {
      tl.to(
        elements.glow,
        {
          opacity: 0,
          scale: 0.8,
          ease: "power1.inOut",
        },
        0,
      );
    }
  }, heroSection);

  return {
    kill: () => ctx.revert(),
  };
}

/**
 * Section Header Disappearance
 * As any section header nears the top third of the viewport, it subtly floats up,
 * blurs, and fades out so the section content commands the screen.
 */
export function bindHeaderDisappear(headerElement: HTMLElement): DisappearCleanups {
  if (prefersReducedMotion() || typeof window === "undefined") {
    return { kill: () => {} };
  }

  initGSAP();

  const ctx = gsap.context(() => {
    gsap.to(headerElement, {
      scrollTrigger: {
        trigger: headerElement,
        start: "top 12%",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
      },
      y: -50,
      opacity: 0,
      ease: "power2.inOut",
    });
  }, headerElement);

  return {
    kill: () => ctx.revert(),
  };
}

/**
 * Card / Container Scroll Disappear
 * As individual cards, grids, or visual blocks scroll toward the top of the viewport,
 * they smoothly scale down, fade, and blur away in a staggered, layer-by-layer sequence.
 */
export function bindCardScrollDisappear(
  cardElement: HTMLElement,
  options?: {
    scale?: number;
    y?: number;
    blur?: number;
    start?: string;
    end?: string;
  },
): DisappearCleanups {
  if (prefersReducedMotion() || typeof window === "undefined") {
    return { kill: () => {} };
  }

  initGSAP();

  const targetScale = options?.scale ?? 0.93;
  const targetY = options?.y ?? -40;
  const triggerStart = options?.start ?? "top 18%";
  const triggerEnd = options?.end ?? "bottom 8%";

  const ctx = gsap.context(() => {
    gsap.to(cardElement, {
      scrollTrigger: {
        trigger: cardElement,
        start: triggerStart,
        end: triggerEnd,
        scrub: 1.1,
        invalidateOnRefresh: true,
      },
      scale: targetScale,
      y: targetY,
      opacity: 0,
      transformOrigin: "center top",
      ease: "power2.inOut",
    });
  }, cardElement);

  return {
    kill: () => ctx.revert(),
  };
}

/**
 * Sticky Section Transition with Dissolve
 * Pins the section in place while its content scales down and blurs out,
 * creating a seamless high-end transition into the incoming chapter.
 */
export function bindStickyDissolve(
  sectionElement: HTMLElement,
  contentElement: HTMLElement,
  options?: {
    pinDistance?: number | string;
  },
): DisappearCleanups {
  if (prefersReducedMotion() || typeof window === "undefined") {
    return { kill: () => {} };
  }

  initGSAP();

  const pinDistance = options?.pinDistance ?? "+=450";

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionElement,
        start: "top top",
        end: pinDistance,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(contentElement, {
      scale: 0.9,
      y: -60,
      opacity: 0,
      ease: "power2.inOut",
    });
  }, sectionElement);

  return {
    kill: () => ctx.revert(),
  };
}
