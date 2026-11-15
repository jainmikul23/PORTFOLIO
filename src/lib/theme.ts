import { prefersReducedMotion } from "@/lib/animations/config";

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

    const hasClickCoordinates =
      event &&
      typeof event.clientX === "number" &&
      typeof event.clientY === "number" &&
      (event.clientX > 0 || event.clientY > 0);

    if (doc.startViewTransition) {
      if (hasClickCoordinates) {
        document.documentElement.setAttribute("data-theme-transition", "circle");
        const x = event.clientX;
        const y = event.clientY;
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        const transition = doc.startViewTransition(() => {
          applyTheme(nextTheme);
        });

        transition.ready
          .then(() => {
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: 500,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                pseudoElement: "::view-transition-new(root)",
              }
            );
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

      // Default smooth cross-fade via View Transitions
      const transition = doc.startViewTransition(() => {
        applyTheme(nextTheme);
      });
      transition.finished.finally(() => resolve());
      return;
    }

    // CSS Transition Fallback for legacy browsers
    document.documentElement.classList.add("theme-transitioning");
    applyTheme(nextTheme);

    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
      resolve();
    }, 450);
  });
}

