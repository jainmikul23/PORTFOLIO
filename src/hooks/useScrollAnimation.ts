"use client";

import { useEffect, useRef } from "react";
import { gsap, initGSAP } from "@/lib/animations/gsap";
import { prefersReducedMotion } from "@/lib/animations/config";

export function useScrollAnimation<T extends HTMLElement>(
  animationCallback?: (element: T, gsapInstance: typeof gsap) => void,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    initGSAP();

    const ctx = gsap.context(() => {
      if (ref.current) {
        if (animationCallback) {
          animationCallback(ref.current, gsap);
        } else {
          gsap.from(ref.current, {
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            y: 35,
            duration: 0.8,
            ease: "power3.out",
          });
        }
      }
    }, ref);

    return () => ctx.revert();
  }, [animationCallback]);

  return ref;
}
