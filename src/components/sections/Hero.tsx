"use client";

import React from "react";
import Image from "next/image";
import styles from "./Hero.module.css";
import { profile } from "@/content/profile";
import { ArrowRight, MessageSquare, Terminal, Sparkles, MapPin } from "lucide-react";
import { useHeroDisappear } from "@/hooks/useCinematicScrollDisappear";

export const Hero: React.FC = () => {
  const { sectionRef, headlineRef, visualRef, factsRef, glowRef } = useHeroDisappear();

  return (
    <section
      id="hero"
      ref={sectionRef}
      className={styles.heroSection}
      aria-label="Introduction"
    >
      <div ref={glowRef} className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.ambientCoolGlow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Cinematic Headline & Narrative */}
          <div ref={headlineRef} className={styles.content}>
            <div className={styles.taglineBadge}>
              <span className={styles.badgePulse} />
              <span className={styles.badgeText}>
                {profile.positioning}
              </span>
              <span className={styles.badgeDot}>&bull;</span>
              <span className={styles.location}>
                <MapPin size={12} className={styles.pinIcon} />
                Indore, India
              </span>
            </div>

            <h1 className={styles.headline}>
              I don&apos;t just write code.
              <br />
              <span className={styles.accentText}>I turn ideas into experiences.</span>
            </h1>

            <p className={styles.intro}>
              {profile.supportingIntro}
            </p>

            <div className={styles.ctaRow}>
              <a href="#projects" className={styles.primaryCta}>
                <span>Explore My Work</span>
                <ArrowRight size={18} />
              </a>

              <a href="#contact" className={styles.secondaryCta}>
                <MessageSquare size={16} />
                <span>Let&apos;s Connect</span>
              </a>
            </div>

            {/* Quick Facts Strip */}
            <div ref={factsRef} className={styles.factsStrip}>
              <div className={styles.factItem}>
                <span className={styles.factLabel}>Education</span>
                <span className={styles.factValue}>B.Tech CSE &bull; AITR</span>
              </div>
              <div className={styles.factDivider} />
              <div className={styles.factItem}>
                <span className={styles.factLabel}>Academic Record</span>
                <span className={styles.factValue}>8.22 CGPA (3rd Year)</span>
              </div>
              <div className={styles.factDivider} />
              <div className={styles.factItem}>
                <span className={styles.factLabel}>Focus</span>
                <span className={styles.factValue}>Full Stack &amp; AI Integration</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Cinematic Portrait & Live System Console */}
          <div className={styles.visualCol}>
            {/* Real Photograph Frame with Cinematic Orange Lighting */}
            <div ref={visualRef} className={styles.portraitCard}>
              <div className={styles.portraitFrame}>
                <Image
                  src="/mikul-jain.jpg"
                  alt="Mikul Jain - Product-Minded Full Stack Developer"
                  width={340}
                  height={380}
                  priority
                  quality={85}
                  sizes="(max-width: 768px) 100vw, 380px"
                  className={styles.portraitImg}
                />
                <div className={styles.portraitOverlay} />
                <div className={styles.portraitBadge}>
                  <Sparkles size={14} className={styles.sparkleIcon} />
                  <span>Available for Engineering Roles</span>
                </div>
              </div>

              {/* Miniature Console Snippet */}
              <div className={styles.consoleSnippet}>
                <div className={styles.consoleTop}>
                  <Terminal size={13} className={styles.consoleIcon} />
                  <span className={styles.consoleTitle}>mikul.dev ~ system-status</span>
                </div>
                <p className={styles.consoleText}>
                  <span className={styles.consolePrompt}>&gt;</span> Stack: Next.js 15, React 19, Node.js, Three.js, MySQL<br />
                  <span className={styles.consolePrompt}>&gt;</span> Philosophy: <em>Problem &rarr; Architecture &rarr; Impact</em>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <a href="#about" className={styles.scrollLink} aria-label="Scroll to About Section">
            <span className={styles.scrollMouse}>
              <span className={styles.scrollWheel} />
            </span>
            <span className={styles.scrollText}>Chapter 01 &bull; Explore The Journey</span>
          </a>
        </div>
      </div>
    </section>
  );
};
