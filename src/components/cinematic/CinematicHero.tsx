"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { ScrollVideo } from "./ScrollVideo";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/animations/gsap";
import { prefersReducedMotion } from "@/lib/animations/config";
import { profile } from "@/content/profile";
import {
  ArrowRight,
  MessageSquare,
  Terminal,
  Sparkles,
  Shield,
  Cpu,
  Gauge,
  ChevronDown,
} from "lucide-react";
import styles from "./CinematicHero.module.css";

interface CardState {
  y: number;
  z: number;
  rotX: number;
  scale: number;
  opacity: number;
  pointerEvents: "auto" | "none";
}

const CARDS_META = [
  { id: 0, label: "01 // VISION", title: "Master Vision" },
  { id: 1, label: "02 // COCKPIT", title: "Core Architecture" },
  { id: 2, label: "03 // IDENTITY", title: "Mikul Jain" },
  { id: 3, label: "04 // CHAPTERS", title: "Portfolio Hub" },
];

export const CinematicHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    initGSAP();

    if (!sectionRef.current || !pinContainerRef.current) return;

    if (prefersReducedMotion()) {
      setScrollProgress(0.65);
      return;
    }

    const ctx = gsap.context(() => {
      // Pin the full-screen container for 400vh of scroll distance
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=380%",
        pin: pinContainerRef.current,
        pinSpacing: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Compute 3D Card Stack transforms smoothly for each of the 4 cards
  const cards = useMemo(() => {
    const centers = [0.12, 0.38, 0.65, 0.92];
    const spread = 0.16;

    return centers.map((center): CardState => {
      const d = (scrollProgress - center) / spread;

      if (d < -1.2) {
        // Far below
        return {
          y: 120,
          z: -200,
          rotX: 14,
          scale: 0.88,
          opacity: 0,
          pointerEvents: "none",
        };
      } else if (d < 0) {
        // Entering from bottom
        const p = 1 + d; // 0 to 1
        return {
          y: (1 - p) * 110,
          z: (1 - p) * -160,
          rotX: (1 - p) * 12,
          scale: 0.9 + p * 0.1,
          opacity: Math.max(0, Math.min(1, p * 1.3)),
          pointerEvents: p > 0.5 ? "auto" : "none",
        };
      } else if (d <= 1) {
        // Exiting to top
        const p = d; // 0 to 1
        return {
          y: -p * 110,
          z: -p * 150,
          rotX: -p * 10,
          scale: 1 - p * 0.08,
          opacity: Math.max(0, Math.min(1, 1 - p * 1.3)),
          pointerEvents: p < 0.5 ? "auto" : "none",
        };
      } else {
        // Far above
        return {
          y: -120,
          z: -200,
          rotX: -12,
          scale: 0.88,
          opacity: 0,
          pointerEvents: "none",
        };
      }
    });
  }, [scrollProgress]);

  // Active card index (for sidebar indicator)
  const activeCardIndex = useMemo(() => {
    if (scrollProgress < 0.25) return 0;
    if (scrollProgress < 0.52) return 1;
    if (scrollProgress < 0.78) return 2;
    return 3;
  }, [scrollProgress]);

  // Jump to specific card stage
  const jumpToCard = (cardIdx: number) => {
    if (!sectionRef.current) return;
    const targets = [0.08, 0.35, 0.62, 0.9];
    const targetProgress = targets[cardIdx] || 0;
    const scrollDist = window.innerHeight * 3.8;
    const targetScrollY =
      sectionRef.current.offsetTop + targetProgress * scrollDist;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={styles.section}
      aria-label="Cinematic 3D Experience"
    >
      <div ref={pinContainerRef} className={styles.pinContainer}>
        {/* 1. Scroll-Controlled Frame-by-Frame Canvas Engine */}
        <ScrollVideo progress={scrollProgress} />

        {/* 2. Top Status Bar (Automotive HUD telemetry) */}
        <header className={styles.hudHeader}>
          <div className={styles.hudBadge}>
            <span className={styles.pulseDot} />
            <span className={styles.hudText}>
              MIKUL.DEV // SCROLL 3D CARD STACK
            </span>
          </div>

          <div className={styles.hudStats}>
            <span className={styles.hudStatItem}>
              <Gauge size={13} className={styles.magentaIcon} />
              FRAME: {Math.min(190, Math.floor(scrollProgress * 190) + 1)} / 190
            </span>
            <span className={styles.hudDivider}>|</span>
            <span className={styles.hudStatItem}>
              <Cpu size={13} className={styles.magentaIcon} />
              60 FPS GPU
            </span>
          </div>
        </header>

        {/* 3. Floating Card Deck Navigator (Right HUD Dock) */}
        <nav className={styles.cardDeckNav} aria-label="Deck Navigation">
          {CARDS_META.map((meta, idx) => (
            <button
              key={meta.id}
              onClick={() => jumpToCard(idx)}
              className={`${styles.deckNavBtn} ${
                activeCardIndex === idx ? styles.deckNavBtnActive : ""
              }`}
              title={meta.title}
              aria-label={`Jump to ${meta.title}`}
            >
              <span className={styles.deckNavDot} />
              <span className={styles.deckNavLabel}>{meta.label}</span>
            </button>
          ))}
        </nav>

        {/* ========================================================
            3D STACKING CARDS VIEWPORT
            ======================================================== */}
        <div className={styles.cardDeckViewport}>
          {/* ----------------------------------------------------
              CARD 1: MASTER IDENTITY & VISION
              ---------------------------------------------------- */}
          <article
            className={`${styles.cinematicCard} ${styles.visionCard}`}
            style={{
              opacity: cards[0]?.opacity,
              transform: `translate3d(0, ${cards[0]?.y}px, ${cards[0]?.z}px) rotateX(${cards[0]?.rotX}deg) scale(${cards[0]?.scale})`,
              pointerEvents: cards[0]?.pointerEvents,
            }}
          >
            <div className={styles.cardGlowBorder} aria-hidden="true" />
            <div className={styles.cardContent}>
              <div className={styles.identityBadge}>
                <Sparkles size={14} className={styles.magentaIcon} />
                <span>ULTRA-PREMIUM 3D EXPERIENCE</span>
              </div>

              {/* Letter-by-Letter Master Title */}
              <h1 className={styles.masterTitle} aria-label="MIKUL JAIN">
                {"MIKUL JAIN".split("").map((char, i) => (
                  <span
                    key={i}
                    className={styles.titleLetter}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h1>

              <p className={styles.masterHeadline}>
                DESIGNING THE FUTURE.
                <br />
                <span className={styles.magentaGradientText}>
                  BUILDING THE DIGITAL WORLD.
                </span>
              </p>

              <p className={styles.masterSubheading}>
                Full Stack Developer &bull; Creative Technologist &bull; AI
                Enthusiast
              </p>

              {/* Interactive Scroll Prompter */}
              <div className={styles.scrollPrompter}>
                <div className={styles.scrollTrack}>
                  <div
                    className={styles.scrollThumb}
                    style={{
                      transform: `scaleY(${Math.max(
                        0.2,
                        scrollProgress / 0.25,
                      )})`,
                    }}
                  />
                </div>
                <div className={styles.scrollTextRow}>
                  <ChevronDown size={14} className={styles.magentaIcon} />
                  <span className={styles.scrollPromptText}>
                    SCROLL DOWN TO ADVANCE CARDS
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* ----------------------------------------------------
              CARD 2: AUTOMOTIVE COCKPIT & ARCHITECTURE
              ---------------------------------------------------- */}
          <article
            className={`${styles.cinematicCard} ${styles.cockpitCard}`}
            style={{
              opacity: cards[1]?.opacity,
              transform: `translate3d(0, ${cards[1]?.y}px, ${cards[1]?.z}px) rotateX(${cards[1]?.rotX}deg) scale(${cards[1]?.scale})`,
              pointerEvents: cards[1]?.pointerEvents,
            }}
          >
            <div className={styles.cardGlowBorder} aria-hidden="true" />
            <div className={styles.cockpitCardContent}>
              <div className={styles.cockpitHeader}>
                <span className={styles.cockpitTag}>
                  SYSTEM TELEMETRY // 02
                </span>
                <h2 className={styles.cockpitTitle}>
                  Automotive-Grade Craft &amp;{" "}
                  <span className={styles.magentaGradientText}>
                    Architecture
                  </span>
                </h2>
              </div>

              <div className={styles.cockpitGrid}>
                <div className={styles.cockpitSubcard}>
                  <div className={styles.subcardTop}>
                    <Terminal size={15} className={styles.magentaIcon} />
                    <span>01. CORE ENGINEERING</span>
                  </div>
                  <h3 className={styles.subcardTitle}>Resilient Full Stack</h3>
                  <p className={styles.subcardText}>
                    Architecting scalable web applications with Next.js 15,
                    React 19, TypeScript, and Node.js with deterministic runtime
                    safety.
                  </p>
                  <div className={styles.chipRow}>
                    <span className={styles.chip}>Next.js 15</span>
                    <span className={styles.chip}>React 19</span>
                    <span className={styles.chip}>TypeScript</span>
                  </div>
                </div>

                <div className={styles.cockpitCenterTelemetry}>
                  <div className={styles.neonArc} />
                  <span className={styles.telemetryTag}>
                    CABIN AMBIENT HUD
                  </span>
                  <span className={styles.telemetryValue}>
                    MERCEDES INSPIRATION
                  </span>
                  <span className={styles.telemetryDesc}>
                    DEEP BURGUNDY &bull; NEON MAGENTA &bull; 60 FPS
                  </span>
                </div>

                <div className={styles.cockpitSubcard}>
                  <div className={styles.subcardTop}>
                    <Shield size={15} className={styles.magentaIcon} />
                    <span>02. SPATIAL &amp; PERFORMANCE</span>
                  </div>
                  <h3 className={styles.subcardTitle}>
                    Cinematic Interactivity
                  </h3>
                  <p className={styles.subcardText}>
                    Frame-accurate scroll synchronization, GPU canvas
                    compositing, and micro-interactions optimized for buttery
                    60fps.
                  </p>
                  <div className={styles.chipRow}>
                    <span className={styles.chip}>Canvas Engine</span>
                    <span className={styles.chip}>GSAP Scrub</span>
                    <span className={styles.chip}>WebGL 3D</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ----------------------------------------------------
              CARD 3: PERSONAL IDENTITY & CREDENTIALS
              ---------------------------------------------------- */}
          <article
            className={`${styles.cinematicCard} ${styles.identityCard}`}
            style={{
              opacity: cards[2]?.opacity,
              transform: `translate3d(0, ${cards[2]?.y}px, ${cards[2]?.z}px) rotateX(${cards[2]?.rotX}deg) scale(${cards[2]?.scale})`,
              pointerEvents: cards[2]?.pointerEvents,
            }}
          >
            <div className={styles.cardGlowBorder} aria-hidden="true" />
            <div className={styles.identityLayout}>
              {/* Authentic Portrait Frame */}
              <div className={styles.portraitChassis}>
                <div className={styles.portraitFrame}>
                  <Image
                    src="/mikul-jain.jpg"
                    alt="Mikul Jain - Full Stack Developer and Creative Technologist"
                    width={340}
                    height={380}
                    priority
                    fetchPriority="high"
                    quality={85}
                    className={styles.portraitImg}
                  />
                  <div className={styles.portraitGlossOverlay} />
                  <div className={styles.portraitBorderGlow} />
                  <div className={styles.portraitTag}>
                    <Sparkles size={13} className={styles.magentaIcon} />
                    <span>Available for High-Impact Roles</span>
                  </div>
                </div>
              </div>

              {/* Narrative & Verified Badges */}
              <div className={styles.identityNarrative}>
                <div className={styles.badgeRow}>
                  <span className={styles.neonBadge}>MIKUL JAIN</span>
                  <span className={styles.roleBadge}>
                    CREATIVE TECHNOLOGIST
                  </span>
                </div>

                <h2 className={styles.identityHeadline}>
                  Turning Complex Architecture Into{" "}
                  <span className={styles.magentaGradientText}>
                    Seamless Experiences.
                  </span>
                </h2>

                <p className={styles.identityBio}>
                  {profile.supportingIntro}
                </p>

                {/* Verified Credentials */}
                <div className={styles.credStrip}>
                  <div className={styles.credItem}>
                    <span className={styles.credLabel}>EDUCATION</span>
                    <span className={styles.credValue}>
                      B.Tech CSE &bull; AITR Indore
                    </span>
                  </div>
                  <div className={styles.credDivider} />
                  <div className={styles.credItem}>
                    <span className={styles.credLabel}>ACADEMIC RECORD</span>
                    <span className={styles.credValue}>
                      8.22 CGPA (3rd Year)
                    </span>
                  </div>
                  <div className={styles.credDivider} />
                  <div className={styles.credItem}>
                    <span className={styles.credLabel}>ACHIEVEMENTS</span>
                    <span className={styles.credValue}>
                      Top 10 CodeSpire &bull; Kriyeta Finalist
                    </span>
                  </div>
                </div>

                <div className={styles.actionRow}>
                  <a href="#projects" className={styles.primaryBtn}>
                    <span>Explore Selected Work</span>
                    <ArrowRight size={17} />
                  </a>
                  <a href="#contact" className={styles.secondaryBtn}>
                    <MessageSquare size={16} />
                    <span>Let&apos;s Connect</span>
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* ----------------------------------------------------
              CARD 4: SPATIAL PORTFOLIO CHAPTER HUB
              ---------------------------------------------------- */}
          <article
            className={`${styles.cinematicCard} ${styles.hubCardMaster}`}
            style={{
              opacity: cards[3]?.opacity,
              transform: `translate3d(0, ${cards[3]?.y}px, ${cards[3]?.z}px) rotateX(${cards[3]?.rotX}deg) scale(${cards[3]?.scale})`,
              pointerEvents: cards[3]?.pointerEvents,
            }}
          >
            <div className={styles.cardGlowBorder} aria-hidden="true" />
            <div className={styles.hubContainer}>
              <div className={styles.hubHeader}>
                <span className={styles.hubSubtitle}>
                  CHAPTER NAVIGATION // 04
                </span>
                <h2 className={styles.hubTitle}>
                  Explore the{" "}
                  <span className={styles.magentaGradientText}>
                    Portfolio Universe
                  </span>
                </h2>
              </div>

              <div className={styles.hubGrid}>
                <a href="#about" className={styles.hubSubcard}>
                  <span className={styles.hubCardNum}>01</span>
                  <span className={styles.hubCardTitle}>ABOUT ME</span>
                  <span className={styles.hubCardDesc}>
                    Story, college background &amp; philosophy
                  </span>
                </a>

                <a href="#capabilities" className={styles.hubSubcard}>
                  <span className={styles.hubCardNum}>02</span>
                  <span className={styles.hubCardTitle}>WHAT I DO</span>
                  <span className={styles.hubCardDesc}>
                    Systems architecture &amp; modern web craft
                  </span>
                </a>

                <a href="#projects" className={styles.hubSubcard}>
                  <span className={styles.hubCardNum}>03</span>
                  <span className={styles.hubCardTitle}>FLAGSHIP PROJECTS</span>
                  <span className={styles.hubCardDesc}>
                    HealthDost, Civic Issue, Banking System
                  </span>
                </a>

                <a href="#skills" className={styles.hubSubcard}>
                  <span className={styles.hubCardNum}>04</span>
                  <span className={styles.hubCardTitle}>TECH STACK</span>
                  <span className={styles.hubCardDesc}>
                    Languages, frameworks, tooling &amp; databases
                  </span>
                </a>

                <a href="#journey" className={styles.hubSubcard}>
                  <span className={styles.hubCardNum}>05</span>
                  <span className={styles.hubCardTitle}>JOURNEY &amp; AWARDS</span>
                  <span className={styles.hubCardDesc}>
                    Hackathons, achievements &amp; milestones
                  </span>
                </a>

                <a href="#contact" className={styles.hubSubcard}>
                  <span className={styles.hubCardNum}>06</span>
                  <span className={styles.hubCardTitle}>GET IN TOUCH</span>
                  <span className={styles.hubCardDesc}>
                    Inquiries, collaborations &amp; opportunities
                  </span>
                </a>
              </div>

              <div className={styles.releaseIndicator}>
                <div className={styles.mouseIcon}>
                  <div className={styles.mouseWheel} />
                </div>
                <span>SCROLL DOWN TO ENTER CHAPTERS</span>
              </div>
            </div>
          </article>
        </div>

        {/* Ambient Floor Shadow */}
        <div className={styles.ambientFloor} aria-hidden="true" />
      </div>
    </section>
  );
};
