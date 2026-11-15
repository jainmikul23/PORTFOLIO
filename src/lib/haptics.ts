import { prefersReducedMotion } from "@/lib/animations/config";

export type HapticStyle =
  | "strong"
  | "heavy"
  | "medium"
  | "light"
  | "selection"
  | "impact"
  | "success"
  | "error";

// Strong vibration patterns in milliseconds
const VIBRATION_PATTERNS: Record<HapticStyle, number | number[]> = {
  // Strong double-punch tactile kick
  strong: [60, 35, 65],
  // Single deep punch
  heavy: 75,
  // Crisp medium tap
  medium: 40,
  // Subtle micro-click
  light: 20,
  // Crisp tick for selection / tabs / navigation
  selection: 25,
  // Solid physical snap on scroll cards / milestones
  impact: 48,
  // Upbeat dual kick for confirmation / copy / send
  success: [50, 40, 85],
  // Triple buzz rejection alert
  error: [70, 40, 70, 40, 90],
};

class HapticsEngine {
  private audioCtx: AudioContext | null = null;
  private hasInitializedAudio = false;
  private lastTriggerTime = 0;
  private readonly THROTTLE_MS = 25;

  /**
   * Lazy-initialize Web Audio API for iOS / desktop acoustic haptic feedback
   */
  private initAudioContext() {
    if (this.hasInitializedAudio || typeof window === "undefined") return;

    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.hasInitializedAudio = true;
      }
    } catch {
      // AudioContext unavailable or blocked by autoplay policy
    }
  }

  /**
   * Synthesize a deep, physical sub-bass transient (65Hz -> 30Hz, 15ms)
   * that vibrates phone speakers and chassis on iOS / Safari where navigator.vibrate is restricted
   */
  private playAcousticHaptic(intensity: "light" | "medium" | "strong" = "strong") {
    if (typeof window === "undefined" || prefersReducedMotion()) return;

    if (!this.audioCtx) {
      this.initAudioContext();
    }

    const ctx = this.audioCtx;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime;
      const duration = intensity === "strong" ? 0.024 : 0.016;

      // Low frequency sub-bass thump that creates mechanical speaker excursion
      const baseFreq = intensity === "strong" ? 68 : 85;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(32, startTime + duration);

      const maxGain = intensity === "strong" ? 0.28 : intensity === "medium" ? 0.18 : 0.09;
      gain.gain.setValueAtTime(maxGain, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Audio playback failed silently
    }
  }

  /**
   * Main haptic trigger method
   */
  public trigger(style: HapticStyle = "strong") {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;

    const now = performance.now();
    if (now - this.lastTriggerTime < this.THROTTLE_MS) return;
    this.lastTriggerTime = now;

    // 1. Hardware Vibration API (Android Chrome, supported browsers)
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        const pattern = VIBRATION_PATTERNS[style];
        navigator.vibrate(pattern);
      } catch {
        // Ignore vibration errors
      }
    }

    // 2. Acoustic / Transducer Haptic Click (for iOS Safari and desktop speakers)
    const acousticIntensity =
      style === "strong" || style === "heavy" || style === "success" || style === "error"
        ? "strong"
        : style === "medium" || style === "impact"
        ? "medium"
        : "light";

    this.playAcousticHaptic(acousticIntensity);
  }

  // Convenience methods
  public strong() {
    this.trigger("strong");
  }

  public heavy() {
    this.trigger("heavy");
  }

  public medium() {
    this.trigger("medium");
  }

  public light() {
    this.trigger("light");
  }

  public selection() {
    this.trigger("selection");
  }

  public impact() {
    this.trigger("impact");
  }

  public success() {
    this.trigger("success");
  }

  public error() {
    this.trigger("error");
  }

  /**
   * Attach a global listener so all interactive elements automatically feel physical
   */
  public initGlobalListeners(): () => void {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return () => {};
    }

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a[role="button"], [data-haptic], input[type="submit"], input[type="button"], .ctaButton, [role="tab"]'
      ) as HTMLElement | null;

      if (!interactive) return;

      const customStyle = interactive.getAttribute("data-haptic") as HapticStyle | null;
      if (customStyle && VIBRATION_PATTERNS[customStyle]) {
        this.trigger(customStyle);
      } else {
        this.trigger("strong");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, { passive: true, capture: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, { capture: true });
    };
  }
}

export const haptic = new HapticsEngine();
