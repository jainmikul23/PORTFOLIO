"use client";

import React, { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";
import { prefersReducedMotion } from "@/lib/animations/config";

export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(false);
      return;
    }

    // Dismiss as soon as window loads, with maximum 600ms grace to never block LCP
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 500);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${fading ? styles.fadeOut : ""}`}
      aria-hidden="true"
    >
      <div className={styles.centerBox}>
        <div className={styles.pulseRing} />
        <span className={styles.loaderLine} />
        <div className={styles.loaderText}>
          <span className={styles.dot} />
          <span>INITIALIZING DIGITAL EXPERIENCE</span>
        </div>
      </div>
    </div>
  );
};

