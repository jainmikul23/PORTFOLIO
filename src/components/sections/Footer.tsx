"use client";

import React from "react";
import styles from "./Footer.module.css";
import { profile } from "@/content/profile";
import { Heart, Terminal, ArrowUp } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.brandBlock}>
            <span className={styles.brandName}>{profile.name}</span>
            <p className={styles.brandPositioning}>
              {profile.positioning} &bull; {profile.education.college} (RGPV)
            </p>
          </div>

          <div className={styles.statusBox}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>
              All Systems Operational &bull; 8.15 CGPA &bull; Full Stack MERN &amp; Python
            </span>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            Designed &amp; Developed with Next.js 15, TypeScript &amp; Cinematic Digital
            Storytelling.
          </p>

          <div className={styles.actionsGroup}>
            <span className={styles.craftedWith}>
              Crafted with curiosity <Heart size={13} className={styles.heartIcon} /> in Indore
            </span>

            <button onClick={scrollToTop} className={styles.backToTopBtn} aria-label="Back to top">
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        <div className={styles.easterEggBar}>
          <Terminal size={12} className={styles.termIcon} />
          <span>
            Press <kbd className={styles.kbd}>`</kbd> or <kbd className={styles.kbd}>⌘K</kbd>{" "}
            anywhere for the interactive command palette
          </span>
        </div>
      </div>
    </footer>
  );
};
