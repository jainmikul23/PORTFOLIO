"use client";

import React, { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";
import { prefersReducedMotion } from "@/lib/animations/config";

/**
 * Non-blocking ambient loading line that sweeps across the top of the viewport
 * without blocking FCP (First Contentful Paint) or LCP (Largest Contentful Paint).
 */
export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 400);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`${styles.loadingContainer} ${fading ? styles.fadeOut : ""}`}
      aria-hidden="true"
    >
      <div className={styles.loadingBar} />
    </div>
  );
};
