import Lenis from "lenis";
import { gsap, ScrollTrigger, initGSAP } from "./gsap";
import { prefersReducedMotion } from "./config";

let lenisInstance: Lenis | null = null;
let clickHandler: ((e: MouseEvent) => void) | null = null;

export function initSmoothScroll(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (prefersReducedMotion()) return null;

  if (lenisInstance) return lenisInstance;

  initGSAP();

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenisInstance = lenis;

  // Synchronize Lenis scroll with GSAP ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  // Delegated smooth scroll for any internal anchor
  clickHandler = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest('a[href^="#"]');
    if (!target) return;
    const href = target.getAttribute("href");
    if (href && href.startsWith("#") && href.length > 1) {
      const element = document.querySelector(href);
      if (element) {
        e.preventDefault();
        lenis.scrollTo(element as HTMLElement, { offset: -60 });
      }
    }
  };

  document.addEventListener("click", clickHandler);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroySmoothScroll(): void {
  if (clickHandler) {
    document.removeEventListener("click", clickHandler);
    clickHandler = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
