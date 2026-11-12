import { gsap } from "./gsap";
import { prefersReducedMotion } from "./config";

export function pageFadeIn(container: HTMLElement, onComplete?: () => void): gsap.core.Tween | null {
  if (prefersReducedMotion()) {
    onComplete?.();
    return null;
  }

  return gsap.fromTo(
    container,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      onComplete,
    },
  );
}

export function pageFadeOut(container: HTMLElement, onComplete?: () => void): gsap.core.Tween | null {
  if (prefersReducedMotion()) {
    onComplete?.();
    return null;
  }

  return gsap.to(container, {
    opacity: 0,
    duration: 0.35,
    ease: "power2.in",
    onComplete,
  });
}
