import { prefersReducedMotion } from "@/lib/animations/config";

export type Theme = "dark" | "light";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem("portfolio-theme") as Theme | null;
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // Ignore storage errors
  }
  return "light";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    // Ignore storage quota or access issues
  }

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

    // Respect user's reduced motion preference (instant switch)
    if (prefersReducedMotion()) {
      applyTheme(nextTheme);
      return resolve();
    }

    // Clean up any lingering legacy canvas overlays
    const lingeringCanvas = document.getElementById("ink-transition-canvas");
    if (lingeringCanvas && lingeringCanvas.parentNode) {
      lingeringCanvas.parentNode.removeChild(lingeringCanvas);
    }

    // Modern View Transitions API (Chrome 111+, Safari 18+, Edge 111+)
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    // Calculate origin coordinate for the circular ripple
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

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

    // Exact mathematical distance from click origin to the farthest viewport corner
    const endRadius = Math.ceil(
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
    ) + 4;

    if (doc.startViewTransition) {
      // Freezes conflicting element CSS transitions while capturing snapshot
      document.documentElement.setAttribute("data-theme-transition", "active");

      const transition = doc.startViewTransition(() => {
        applyTheme(nextTheme);
      });

      transition.ready
        .then(() => {
          const animation = document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 460,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
          return animation.finished;
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

    // Gentle CSS transition fallback for legacy browsers without View Transitions
    document.documentElement.classList.add("theme-transitioning");
    applyTheme(nextTheme);
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
      resolve();
    }, 400);
  });
}
