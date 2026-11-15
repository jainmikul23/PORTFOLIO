"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ScrollVideo, type ScrollVideoHandle } from "./ScrollVideo";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/animations/gsap";
import { prefersReducedMotion } from "@/lib/animations/config";
import { profile } from "@/content/profile";
import {
  ArrowRight,
  Sparkles,
  Terminal,
  Layers,
  Code2,
  ChevronDown,
  Mail,
} from "lucide-react";
import styles from "./CinematicHero.module.css";

const DECK_ITEMS = [
  { id: 0, label: "01", title: "Master Identity" },
  { id: 1, label: "02", title: "Core Architecture" },
  { id: 2, label: "03", title: "About Mikul" },
  { id: 3, label: "04", title: "Chapters" },
];

export const CinematicHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollVideoRef = useRef<ScrollVideoHandle | null>(null);
  const scrollThumbRef = useRef<HTMLDivElement | null>(null);

  // Direct element refs for 60/120 FPS hardware transforms without React Virtual DOM diffing
  const card1Ref = useRef<HTMLElement | null>(null);
  const card2Ref = useRef<HTMLElement | null>(null);
  const card3Ref = useRef<HTMLElement | null>(null);
  const card4Ref = useRef<HTMLElement | null>(null);

  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const activeCardIndexRef = useRef<number>(0);

  // Direct GPU transform function: runs synchronously inside scroll tick without React re-rendering
  const applyCardTransforms = useCallback((progress: number) => {
    // 1. Advance video canvas
    scrollVideoRef.current?.setProgress(progress);

    // 2. Update scroll thumb
    if (scrollThumbRef.current) {
      const scaleVal = Math.max(0.2, Math.min(1, progress / 0.25));
      scrollThumbRef.current.style.transform = `scaleY(${scaleVal})`;
    }

    // 3. Compute 4 card transforms
    const centers = [0.12, 0.38, 0.65, 0.92];
    const spread = 0.16;
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current];

    for (let i = 0; i < 4; i++) {
      const cardEl = cards[i];
      if (!cardEl) continue;

      const center = centers[i] ?? 0;
      const d = (progress - center) / spread;
      let y = 0;
      let z = 0;
      let rotX = 0;
      let scale = 1;
      let opacity = 0;
      let pointerEvents: "auto" | "none" = "none";

      if (d < -1.2) {
        y = 110;
        z = -180;
        rotX = 12;
        scale = 0.9;
        opacity = 0;
        pointerEvents = "none";
      } else if (d < 0) {
        const p = 1 + d;
        y = (1 - p) * 100;
        z = (1 - p) * -140;
        rotX = (1 - p) * 10;
        scale = 0.92 + p * 0.08;
        opacity = Math.max(0, Math.min(1, p * 1.35));
        pointerEvents = p > 0.5 ? "auto" : "none";
      } else if (d <= 1) {
        const p = d;
        y = -p * 100;
        z = -p * 140;
        rotX = -p * 8;
        scale = 1 - p * 0.07;
        opacity = Math.max(0, Math.min(1, 1 - p * 1.35));
        pointerEvents = p < 0.5 ? "auto" : "none";
      } else {
        y = -110;
        z = -180;
        rotX = -10;
        scale = 0.9;
        opacity = 0;
        pointerEvents = "none";
      }

      cardEl.style.transform = `translate3d(0, ${y}px, ${z}px) rotateX(${rotX}deg) scale(${scale})`;
      cardEl.style.opacity = `${opacity}`;
      cardEl.style.pointerEvents = pointerEvents;
    }

    // 4. Update deck navigation index ONLY when the active card changes (preserves battery & FPS)
    let nextActive = 0;
    if (progress < 0.25) nextActive = 0;
    else if (progress < 0.52) nextActive = 1;
    else if (progress < 0.78) nextActive = 2;
    else nextActive = 3;

    if (activeCardIndexRef.current !== nextActive) {
      activeCardIndexRef.current = nextActive;
      setActiveCardIndex(nextActive);
    }
  }, []);

  useEffect(() => {
    initGSAP();

    if (!sectionRef.current || !pinContainerRef.current) return;

    // Initial positioning on mount
    applyCardTransforms(0);

    if (prefersReducedMotion()) {
      applyCardTransforms(0.65);
      return;
    }

    const isMobile = window.innerWidth <= 768;
    // Responsive pin duration: Snappy 280% on mobile touch, deep 360% on desktop
    const pinDistance = isMobile ? "+=280%" : "+=360%";

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: pinDistance,
        pin: pinContainerRef.current,
        pinSpacing: true,
        scrub: 0.25, // Snappy hardware-locked scrub
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          applyCardTransforms(self.progress);
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [applyCardTransforms]);

  const jumpToCard = (cardIdx: number) => {
    if (!sectionRef.current) return;
    const targets = [0.08, 0.35, 0.62, 0.9];
    const targetProgress = targets[cardIdx] || 0;
    const isMobile = window.innerWidth <= 768;
    const scrollDist = window.innerHeight * (isMobile ? 2.8 : 3.6);
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
      aria-label="Interactive 3D Portfolio"
    >
      <div ref={pinContainerRef} className={styles.pinContainer}>
        {/* 1. Scroll-Controlled Frame-by-Frame Canvas Engine */}
        <ScrollVideo ref={scrollVideoRef} />

        {/* 2. Floating Minimal Deck Indicator */}
        <nav className={styles.deckNav} aria-label="Deck Navigation">
          {DECK_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => jumpToCard(idx)}
              className={`${styles.deckNavDot} ${
                activeCardIndex === idx ? styles.deckNavDotActive : ""
              }`}
              title={item.title}
              aria-label={`Jump to ${item.title}`}
              type="button"
            >
              <span className={styles.dotPill} />
              <span className={styles.dotNumber}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* ========================================================
            3D STACKING CARDS VIEWPORT
            ======================================================== */}
        <div className={styles.cardDeckViewport}>
          {/* ----------------------------------------------------
              CARD 1: MASTER IDENTITY & HEADLINE
              ---------------------------------------------------- */}
          <article
            ref={card1Ref}
            className={`${styles.card} ${styles.cardVision}`}
            style={{ opacity: 1, pointerEvents: "auto" }}
          >
            <div className={styles.cardGlowBorder} aria-hidden="true" />
            <div className={styles.cardInner}>
              <div className={styles.tagBadge}>
                <span className={styles.badgeDot} />
                <span>Full Stack Developer &bull; Systems Architect</span>
              </div>

              {/* Letter-by-Letter Title */}
              <h1 className={styles.masterTitle} aria-label="MIKUL JAIN">
                {"MIKUL JAIN".split("").map((char, i) => (
                  <span
                    key={i}
                    className={styles.titleLetter}
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h1>

              <p className={styles.masterHeadline}>
                DESIGNING THE FUTURE.
                <br />
                <span className={styles.orangeAccent}>
                  BUILDING THE DIGITAL WORLD.
                </span>
              </p>

              <p className={styles.masterSubheading}>
                Product-minded software engineering, distributed systems architecture, and 60 FPS interactive web craft.
              </p>

              {/* Scroll Prompter */}
              <div className={styles.scrollPrompter}>
                <div className={styles.scrollTrack}>
                  <div ref={scrollThumbRef} className={styles.scrollThumb} />
                </div>
                <div className={styles.scrollTextRow}>
                  <ChevronDown size={14} className={styles.orangeIcon} />
                  <span>SCROLL TO ADVANCE</span>
                </div>
              </div>
            </div>
          </article>

          {/* ----------------------------------------------------
              CARD 2: CORE ARCHITECTURE & FOCUS
              ---------------------------------------------------- */}
          <article
            ref={card2Ref}
            className={`${styles.card} ${styles.cardArchitecture}`}
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <div className={styles.cardGlowBorder} aria-hidden="true" />
            <div className={styles.cardInner}>
              <div className={styles.sectionHeader}>
                <span className={styles.categoryLabel}>ENGINEERING FOUNDATION</span>
                <h2 className={styles.cardTitle}>
                  Full-Stack Architecture &amp;{" "}
                  <span className={styles.orangeAccent}>Modern Craft</span>
                </h2>
              </div>

              <div className={styles.focusGrid}>
                <div className={styles.focusBox}>
                  <div className={styles.boxHeader}>
                    <Terminal size={16} className={styles.orangeIcon} />
                    <span>01. RESILIENT SYSTEMS</span>
                  </div>
                  <h3 className={styles.boxTitle}>Full Stack Architecture</h3>
                  <p className={styles.boxDesc}>
                    Scalable cloud products engineered with Next.js 15, React 19, TypeScript, and clean modular domain architecture.
                  </p>
                  <div className={styles.chipRow}>
                    <span className={styles.chip}>Next.js 15</span>
                    <span className={styles.chip}>TypeScript</span>
                    <span className={styles.chip}>Node.js</span>
                  </div>
                </div>

                <div className={styles.focusBox}>
                  <div className={styles.boxHeader}>
                    <Layers size={16} className={styles.orangeIcon} />
                    <span>02. INTELLIGENT PIPELINES</span>
                  </div>
                  <h3 className={styles.boxTitle}>AI &amp; Data Workflows</h3>
                  <p className={styles.boxDesc}>
                    Integrating structured AI inference, robust relational schemas, and low-latency database transactions for mission-critical software.
                  </p>
                  <div className={styles.chipRow}>
                    <span className={styles.chip}>AI Workflows</span>
                    <span className={styles.chip}>MySQL</span>
                    <span className={styles.chip}>REST APIs</span>
                  </div>
                </div>

                <div className={styles.focusBox}>
                  <div className={styles.boxHeader}>
                    <Code2 size={16} className={styles.orangeIcon} />
                    <span>03. HARDWARE ACCELERATION</span>
                  </div>
                  <h3 className={styles.boxTitle}>Interactive Experiences</h3>
                  <p className={styles.boxDesc}>
                    Frame-locked 60 FPS scroll synchronization, GPU canvas acceleration, and accessible responsive design engineered for instant feel.
                  </p>
                  <div className={styles.chipRow}>
                    <span className={styles.chip}>GSAP Engine</span>
                    <span className={styles.chip}>Three.js</span>
                    <span className={styles.chip}>100 Lighthouse</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ----------------------------------------------------
              CARD 3: PERSONAL IDENTITY & PORTRAIT
              ---------------------------------------------------- */}
          <article
            ref={card3Ref}
            className={`${styles.card} ${styles.cardIdentity}`}
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <div className={styles.cardGlowBorder} aria-hidden="true" />
            <div className={styles.identityLayout}>
              {/* Portrait Frame */}
              <div className={styles.portraitWrap}>
                <div className={styles.portraitFrame}>
                  <Image
                    src="/mikul-jain.jpg"
                    alt="Mikul Jain - Full Stack Developer"
                    width={330}
                    height={370}
                    priority
                    fetchPriority="high"
                    quality={85}
                    className={styles.portraitImg}
                  />
                  <div className={styles.portraitOverlay} />
                  <div className={styles.portraitBadge}>
                    <Sparkles size={13} className={styles.orangeIcon} />
                    <span>Available for Opportunities</span>
                  </div>
                </div>
              </div>

              {/* Bio & Credentials */}
              <div className={styles.identityContent}>
                <div className={styles.nameBadgeRow}>
                  <span className={styles.nameBadge}>MIKUL JAIN</span>
                  <span className={styles.locationBadge}>
                    Indore, India
                  </span>
                </div>

                <h2 className={styles.identityHeadline}>
                  Turning Complex Problems Into{" "}
                  <span className={styles.orangeAccent}>
                    Functional Products.
                  </span>
                </h2>

                <p className={styles.identityBio}>
                  {profile.supportingIntro}
                </p>

                {/* Verified Credentials */}
                <div className={styles.credentialsRow}>
                  <div className={styles.credCol}>
                    <span className={styles.credLabel}>EDUCATION</span>
                    <span className={styles.credValue}>
                      B.Tech CSE &bull; AITR
                    </span>
                  </div>
                  <div className={styles.credDivider} />
                  <div className={styles.credCol}>
                    <span className={styles.credLabel}>ACADEMICS</span>
                    <span className={styles.credValue}>
                      8.22 CGPA (3rd Year)
                    </span>
                  </div>
                  <div className={styles.credDivider} />
                  <div className={styles.credCol}>
                    <span className={styles.credLabel}>HONORS</span>
                    <span className={styles.credValue}>
                      Top 10 CodeSpire &bull; Kriyeta Finalist
                    </span>
                  </div>
                </div>

                <div className={styles.btnRow}>
                  <a href="#projects" className={styles.primaryCta}>
                    <span>Explore Selected Work</span>
                    <ArrowRight size={17} />
                  </a>
                  <a href="#contact" className={styles.secondaryCta}>
                    <Mail size={16} />
                    <span>Get In Touch</span>
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* ----------------------------------------------------
              CARD 4: CHAPTER DIRECTORY
              ---------------------------------------------------- */}
          <article
            ref={card4Ref}
            className={`${styles.card} ${styles.cardHub}`}
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <div className={styles.cardGlowBorder} aria-hidden="true" />
            <div className={styles.hubInner}>
              <div className={styles.hubHeading}>
                <span className={styles.categoryLabel}>CHAPTER DIRECTORY</span>
                <h2 className={styles.hubTitle}>
                  Explore the{" "}
                  <span className={styles.orangeAccent}>Portfolio</span>
                </h2>
              </div>

              <div className={styles.hubGrid}>
                <a href="#about" className={styles.hubTile}>
                  <span className={styles.tileNum}>01</span>
                  <span className={styles.tileTitle}>ABOUT ME</span>
                  <span className={styles.tileDesc}>
                    Story, engineering principles &amp; background
                  </span>
                </a>

                <a href="#capabilities" className={styles.hubTile}>
                  <span className={styles.tileNum}>02</span>
                  <span className={styles.tileTitle}>CAPABILITIES</span>
                  <span className={styles.tileDesc}>
                    Full stack architecture, performance &amp; APIs
                  </span>
                </a>

                <a href="#projects" className={styles.hubTile}>
                  <span className={styles.tileNum}>03</span>
                  <span className={styles.tileTitle}>FLAGSHIP PROJECTS</span>
                  <span className={styles.tileDesc}>
                    HealthDost, Civic Issue, Banking Systems
                  </span>
                </a>

                <a href="#skills" className={styles.hubTile}>
                  <span className={styles.tileNum}>04</span>
                  <span className={styles.tileTitle}>TECH STACK</span>
                  <span className={styles.tileDesc}>
                    Next.js, React, Node, Python, MySQL, Three.js
                  </span>
                </a>

                <a href="#journey" className={styles.hubTile}>
                  <span className={styles.tileNum}>05</span>
                  <span className={styles.tileTitle}>HONORS &amp; MILESTONES</span>
                  <span className={styles.tileDesc}>
                    Hackathon podiums &amp; academic distinctions
                  </span>
                </a>

                <a href="#contact" className={styles.hubTile}>
                  <span className={styles.tileNum}>06</span>
                  <span className={styles.tileTitle}>CONTACT</span>
                  <span className={styles.tileDesc}>
                    Open inbox for opportunities &amp; discussions
                  </span>
                </a>
              </div>

              <div className={styles.scrollNextRow}>
                <ChevronDown size={15} className={styles.orangeIcon} />
                <span>SCROLL DOWN TO ENTER PORTFOLIO</span>
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
