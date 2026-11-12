"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap, initGSAP } from "@/lib/animations/gsap";
import { prefersReducedMotion } from "@/lib/animations/config";

export function useTextReveal<T extends HTMLElement>(options?: {
  types?: "words" | "chars" | "lines" | "words,chars";
  stagger?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    initGSAP();

    let splitInstance: SplitType | null = null;

    // Ensure fonts are loaded before splitting to prevent wrong line breaks
    document.fonts.ready.then(() => {
      if (!ref.current) return;

      splitInstance = new SplitType(ref.current, {
        types: options?.types || "words,chars",
      });

      const targets = splitInstance.chars || splitInstance.words;
      if (targets && targets.length > 0) {
        gsap.from(targets, {
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 25,
          rotateZ: 4,
          duration: options?.duration || 0.65,
          stagger: options?.stagger || 0.02,
          ease: "power3.out",
          delay: options?.delay || 0,
        });
      }
    });

    return () => {
      if (splitInstance) {
        splitInstance.revert();
      }
    };
  }, [options?.delay, options?.duration, options?.stagger, options?.types]);

  return ref;
}
