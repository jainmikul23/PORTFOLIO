"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./ScrollVideo.module.css";

interface ScrollVideoProps {
  progress: number; // 0 to 1 (driven by scroll)
  totalFrames?: number;
  className?: string;
}

const TOTAL_FRAMES = 190;

export const ScrollVideo: React.FC<ScrollVideoProps> = ({
  progress,
  totalFrames = TOTAL_FRAMES,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    const ctx = canvas.getContext("2d", { alpha: false });
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const targetWidth = Math.floor(rect.width * dpr);
    const targetHeight = Math.floor(rect.height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
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

  // Initial setup: Load frame 1 immediately, then schedule background keyframe preloading
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

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

  // Synchronize canvas rendering with scroll progress + lookahead preloading
  useEffect(() => {
    const targetFrame = Math.min(
      Math.max(0, Math.floor(progress * (totalFrames - 1))),
      totalFrames - 1
    );

    // Lookahead: Preload neighboring frames immediately around current scroll position
    for (let offset = -2; offset <= 4; offset++) {
      const nearbyIdx = targetFrame + offset;
      if (nearbyIdx >= 0 && nearbyIdx < totalFrames && !imagesRef.current.has(nearbyIdx)) {
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
  }, [progress, totalFrames, drawFrame, loadSingle]);

  return (
    <div className={`${styles.videoContainer} ${className || ""}`}>
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Warm Cinematic Amber/Orange Glow & Vignette Overlays */}
      <div className={styles.warmAmbientGlow} aria-hidden="true" />
      <div className={styles.cinematicVignette} aria-hidden="true" />
      <div className={styles.scanlineOverlay} aria-hidden="true" />
    </div>
  );
};
