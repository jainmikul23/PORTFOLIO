import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let initialized = false;

export function initGSAP(): typeof gsap {
  if (typeof window !== "undefined" && !initialized) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({
      ease: "power3.out",
      duration: 0.8,
    });
    initialized = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };

