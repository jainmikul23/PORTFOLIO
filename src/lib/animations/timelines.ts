import { gsap, initGSAP } from "./gsap";
import { ANIMATION_CONFIG, prefersReducedMotion } from "./config";

export function createHeroTimeline(targetSelector: string): gsap.core.Timeline | null {
  if (prefersReducedMotion()) return null;
  initGSAP();

  const tl = gsap.timeline({ defaults: { ease: ANIMATION_CONFIG.easings.out } });

  tl.from(`${targetSelector} [data-animate="badge"]`, {
    opacity: 0,
    y: -15,
    duration: ANIMATION_CONFIG.durations.normal,
  })
    .from(
      `${targetSelector} [data-animate="headline"]`,
      {
        opacity: 0,
        y: 35,
        duration: ANIMATION_CONFIG.durations.slow,
        stagger: ANIMATION_CONFIG.stagger.tight,
      },
      "-=0.3",
    )
    .from(
      `${targetSelector} [data-animate="intro"]`,
      {
        opacity: 0,
        y: 20,
        duration: ANIMATION_CONFIG.durations.normal,
      },
      "-=0.4",
    )
    .from(
      `${targetSelector} [data-animate="cta"]`,
      {
        opacity: 0,
        scale: 0.95,
        duration: ANIMATION_CONFIG.durations.normal,
        stagger: 0.1,
      },
      "-=0.3",
    )
    .from(
      `${targetSelector} [data-animate="visual"]`,
      {
        opacity: 0,
        x: 30,
        duration: ANIMATION_CONFIG.durations.slow,
      },
      "-=0.6",
    );

  return tl;
}

export function animateSectionEntrance(
  container: HTMLElement,
  triggerOptions?: ScrollTrigger.Vars,
): gsap.core.Tween | null {
  if (prefersReducedMotion()) return null;
  initGSAP();

  return gsap.from(container, {
    scrollTrigger: {
      trigger: container,
      start: "top 85%",
      toggleActions: "play none none reverse",
      ...triggerOptions,
    },
    opacity: 0,
    y: 40,
    duration: ANIMATION_CONFIG.durations.slow,
    ease: ANIMATION_CONFIG.easings.out,
  });
}
