import { prefersReducedMotion } from "@/lib/animations/config";
import { generateInkPolygon, inkTransitionEngine } from "@/lib/animations/inkTransition";

export type Theme = "dark" | "light";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("portfolio-theme") as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);

  // Sync meta color-scheme for native UI elements (scrollbars, form controls)
  const meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
  if (meta) {
    meta.content = theme;
  }
}

export function switchThemeWithTransition(
  nextTheme: Theme,
  event?: React.MouseEvent | MouseEvent
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") return resolve();

    // Respect user's reduced motion preference
    if (prefersReducedMotion()) {
      applyTheme(nextTheme);
      return resolve();
    }

    // Modern View Transitions API (Chrome 111+, Safari 18+, Edge 111+)
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    // Calculate origin coordinate for the ink splatter
    let x = window.innerWidth - 60;
    let y = 44;

    if (
      event &&
      typeof event.clientX === "number" &&
      typeof event.clientY === "number" &&
      (event.clientX > 0 || event.clientY > 0)
    ) {
      x = event.clientX;
      y = event.clientY;
    } else {
      const toggleEl = document.querySelector('button[aria-label*="theme"]') as HTMLElement | null;
      if (toggleEl) {
        const rect = toggleEl.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    const endRadius =
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      ) * 1.38;

    if (doc.startViewTransition) {
      document.documentElement.setAttribute("data-theme-transition", "ink");

      // Launch WebGL 2 ink splatter animation synchronously
      inkTransitionEngine.play(x, y, nextTheme, 800);

      const transition = doc.startViewTransition(() => {
        applyTheme(nextTheme);
      });

      transition.ready
        .then(() => {
          // Generate procedural organic ink polygon keyframes
          const steps = 9;
          const keyframes: Keyframe[] = [];
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const currentRadius = t * endRadius;
            keyframes.push({
              clipPath: generateInkPolygon(x, y, currentRadius, 2.5, t * 2.5, 72),
            });
          }

          document.documentElement.animate(keyframes, {
            duration: 750,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          });
        })
        .catch(() => {
          applyTheme(nextTheme);
        });

      transition.finished.finally(() => {
        document.documentElement.removeAttribute("data-theme-transition");
        resolve();
      });
      return;
    }

    // High-performance WebGL 2 Ink Bloom Fallback for browsers without View Transitions
    inkTransitionEngine.play(x, y, nextTheme, 800);
    setTimeout(() => {
      applyTheme(nextTheme);
      resolve();
    }, 380);
  });
}

