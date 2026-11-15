"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import styles from "./ScrollVideo.module.css";

export interface ScrollVideoHandle {
  setProgress: (progress: number) => void;
}

interface ScrollVideoProps {
  progress?: number; // Optional initial or fallback progress
  totalFrames?: number;
  className?: string;
}

const TOTAL_FRAMES = 190;

export const ScrollVideo = forwardRef<ScrollVideoHandle, ScrollVideoProps>(
  ({ progress = 0, totalFrames = TOTAL_FRAMES, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
    const currentFrameRef = useRef<number>(0);
    const rafIdRef = useRef<number | null>(null);
    const [_loadedCount, setLoadedCount] = useState<number>(0);

    // Helper to get frame path
    const getFramePath = useCallback((index: number) => {
      const frameNum = Math.min(Math.max(1, index + 1), TOTAL_FRAMES);
      const padded = String(frameNum).padStart(3, "0");
      return `/frames/frame_${padded}.webp`;
    }, []);

    // Draw a specific frame to canvas with object-fit: cover
    const drawFrame = useCallback((frameIdx: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let ctx = ctxRef.current;
      if (!ctx) {
        ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctxRef.current = ctx;
        }
      }
      if (!ctx) return;

      // Use closest loaded frame if requested frame is still downloading
      let img = imagesRef.current.get(frameIdx);
      if (!img || !img.complete || img.naturalWidth === 0) {
        let closest = -1;
        let minDiff = Infinity;
        imagesRef.current.forEach((cachedImg, idx) => {
          if (cachedImg.complete && cachedImg.naturalWidth > 0) {
            const diff = Math.abs(idx - frameIdx);
            if (diff < minDiff) {
              minDiff = diff;
              closest = idx;
            }
          }
        });
        if (closest !== -1) {
          img = imagesRef.current.get(closest);
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Calculate "cover" scale and positioning
      const hRatio = cw / iw;
      const vRatio = ch / ih;
      const ratio = Math.max(hRatio, vRatio);

      const nw = iw * ratio;
      const nh = ih * ratio;
      const cx = (cw - nw) / 2;
      const cy = (ch - nh) / 2;

      ctx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh);
    }, []);

    // Update canvas internal dimensions on resize
    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Cap at 2x DPR to protect mobile GPU fillrate while maintaining crystal clarity
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const targetWidth = Math.floor(rect.width * dpr);
      const targetHeight = Math.floor(rect.height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctxRef.current = ctx;
        }
        drawFrame(currentFrameRef.current);
      }
    }, [drawFrame]);

    // Load a single frame by index on-demand
    const loadSingle = useCallback(
      (index: number): Promise<void> => {
        return new Promise((resolve) => {
          if (imagesRef.current.has(index)) return resolve();

          const img = new Image();
          img.src = getFramePath(index);
          img.onload = () => {
            imagesRef.current.set(index, img);
            setLoadedCount((c) => c + 1);
            if (currentFrameRef.current === index) {
              drawFrame(index);
            }
            resolve();
          };
          img.onerror = () => resolve();
        });
      },
      [drawFrame, getFramePath]
    );

    // Direct high-performance imperative progress handler
    const handleProgress = useCallback(
      (p: number) => {
        const targetFrame = Math.min(
          Math.max(0, Math.floor(p * (totalFrames - 1))),
          totalFrames - 1
        );

        // Preload immediate neighbors [target - 2, target + 4]
        for (let offset = -2; offset <= 4; offset++) {
          const nearbyIdx = targetFrame + offset;
          if (
            nearbyIdx >= 0 &&
            nearbyIdx < totalFrames &&
            !imagesRef.current.has(nearbyIdx)
          ) {
            loadSingle(nearbyIdx);
          }
        }

        if (currentFrameRef.current !== targetFrame) {
          currentFrameRef.current = targetFrame;
          if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = requestAnimationFrame(() => {
            drawFrame(targetFrame);
          });
        }
      },
      [totalFrames, loadSingle, drawFrame]
    );

    useImperativeHandle(
      ref,
      () => ({
        setProgress: handleProgress,
      }),
      [handleProgress]
    );

    // Initial setup: Load frame 1 immediately, then schedule background keyframe preloading
    useEffect(() => {
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas, { passive: true });

      let isMounted = true;

      // 1. Load First Frame with maximum priority
      const firstImg = new Image();
      firstImg.src = getFramePath(0);
      firstImg.onload = () => {
        if (!isMounted) return;
        imagesRef.current.set(0, firstImg);
        drawFrame(0);
        setLoadedCount((c) => c + 1);
      };

      // 2. High-performance idle loading:
      // Uses requestIdleCallback to keep main thread completely unblocked
      const scheduleBackgroundLoad = () => {
        const priorityIndices: number[] = [];
        const secondaryIndices: number[] = [];

        for (let i = 1; i < totalFrames; i++) {
          if (i % 4 === 0) {
            priorityIndices.push(i);
          } else {
            secondaryIndices.push(i);
          }
        }

        const runBatch = async () => {
          const CHUNK_SIZE = 4;
          for (let i = 0; i < priorityIndices.length; i += CHUNK_SIZE) {
            if (!isMounted) break;
            const chunk = priorityIndices.slice(i, i + CHUNK_SIZE);
            await Promise.all(chunk.map((idx) => loadSingle(idx)));
          }

          // Fill in remaining intermediate frames
          for (let i = 0; i < secondaryIndices.length; i += CHUNK_SIZE) {
            if (!isMounted) break;
            const chunk = secondaryIndices.slice(i, i + CHUNK_SIZE);
            await Promise.all(chunk.map((idx) => loadSingle(idx)));
          }
        };

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          window.requestIdleCallback(() => runBatch(), { timeout: 3000 });
        } else {
          setTimeout(runBatch, 1200);
        }
      };

      scheduleBackgroundLoad();

      return () => {
        isMounted = false;
        window.removeEventListener("resize", resizeCanvas);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      };
    }, [drawFrame, getFramePath, resizeCanvas, totalFrames, loadSingle]);

    // Handle initial progress prop if passed
    useEffect(() => {
      handleProgress(progress);
    }, [progress, handleProgress]);

    return (
      <div className={`${styles.videoContainer} ${className || ""}`}>
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* Warm Cinematic Amber/Orange Glow & Vignette Overlays */}
        <div className={styles.warmAmbientGlow} aria-hidden="true" />
        <div className={styles.cinematicVignette} aria-hidden="true" />
        <div className={styles.scanlineOverlay} aria-hidden="true" />
      </div>
    );
  }
);

ScrollVideo.displayName = "ScrollVideo";
