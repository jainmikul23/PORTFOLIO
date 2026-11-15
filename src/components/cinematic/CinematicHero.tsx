"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ScrollVideo } from "./ScrollVideo";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/animations/gsap";
import { prefersReducedMotion } from "@/lib/animations/config";
import { profile } from "@/content/profile";
import { ArrowRight, MessageSquare, Terminal, Sparkles, Shield, Cpu, Gauge } from "lucide-react";
import styles from "./CinematicHero.module.css";

export const CinematicHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // References for stage elements
  const stage1Ref = useRef<HTMLDivElement | null>(null);
  const stage2Ref = useRef<HTMLDivElement | null>(null);
  const stage3Ref = useRef<HTMLDivElement | null>(null);
  const stage4Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initGSAP();

    if (!sectionRef.current || !pinContainerRef.current) return;

    if (prefersReducedMotion()) {
      setScrollProgress(0.7);
      return;
    }

    const ctx = gsap.context(() => {
      // Pin the full-screen container for 400vh of scroll distance
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=350%",
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

  // Compute visibility / transforms for each stage based on scrollProgress
  // Stage 1: Opening & Master Title (0.00 -> 0.28)
  const s1Opacity = Math.max(0, Math.min(1, 1 - (scrollProgress - 0.12) / 0.14));
  const s1Scale = 1 - scrollProgress * 0.2;
  const s1Y = -scrollProgress * 100;

  // Stage 2: Luxury Automotive Cockpit Telemetry (0.24 -> 0.58)
  let s2Opacity = 0;
  if (scrollProgress >= 0.22 && scrollProgress <= 0.6) {
    if (scrollProgress < 0.34) {
      s2Opacity = (scrollProgress - 0.22) / 0.12;
    } else if (scrollProgress > 0.48) {
      s2Opacity = 1 - (scrollProgress - 0.48) / 0.12;
    } else {
      s2Opacity = 1;
    }
  }
  const s2Y = 40 - (scrollProgress - 0.22) * 80;

  // Stage 3: Personal Introduction & Portrait Reveal (0.54 -> 0.88)
  let s3Opacity = 0;
  if (scrollProgress >= 0.52 && scrollProgress <= 0.9) {
    if (scrollProgress < 0.64) {
      s3Opacity = (scrollProgress - 0.52) / 0.12;
    } else if (scrollProgress > 0.78) {
      s3Opacity = 1 - (scrollProgress - 0.78) / 0.12;
    } else {
      s3Opacity = 1;
    }
  }
  const s3Y = 30 - (scrollProgress - 0.52) * 60;

  // Stage 4: Spatial Navigation Bridge (0.84 -> 1.00)
  let s4Opacity = 0;
  if (scrollProgress >= 0.82) {
    s4Opacity = Math.min(1, (scrollProgress - 0.82) / 0.14);
  }
  const s4Y = 25 - (scrollProgress - 0.82) * 50;

  return (
    <section ref={sectionRef} id="hero" className={styles.section} aria-label="Cinematic Experience">
      <div ref={pinContainerRef} className={styles.pinContainer}>
        {/* 1. Scroll-Controlled Frame-by-Frame Canvas Engine */}
        <ScrollVideo progress={scrollProgress} />

        {/* 2. Top Status Bar (Automotive HUD telemetry) */}
        <header className={styles.hudHeader}>
          <div className={styles.hudBadge}>
            <span className={styles.pulseDot} />
            <span className={styles.hudText}>MIKUL.DEV // SCROLL-LINKED 3D ENGINE</span>
          </div>
          <div className={styles.hudStats}>
            <span className={styles.hudStatItem}>
              <Gauge size={13} className={styles.hudIcon} />
              FRAME: {Math.min(190, Math.floor(scrollProgress * 190) + 1)} / 190
            </span>
            <span className={styles.hudDivider}>|</span>
            <span className={styles.hudStatItem}>
              <Cpu size={13} className={styles.hudIcon} />
              60 FPS GPU
            </span>
          </div>
        </header>

        {/* 3. Stage 1: Master Title & Opening (Scroll 0% - 28%) */}
        <div
          ref={stage1Ref}
          className={styles.stage}
          style={{
            opacity: s1Opacity,
            transform: `translate3d(0, ${s1Y}px, 0) scale(${s1Scale})`,
            pointerEvents: scrollProgress > 0.25 ? "none" : "auto",
          }}
        >
          <div className={styles.stage1Content}>
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
              <span className={styles.magentaGradientText}>BUILDING THE DIGITAL WORLD.</span>
            </p>

            <p className={styles.masterSubheading}>
              Full Stack Developer &bull; Creative Technologist &bull; AI Enthusiast
            </p>

            {/* Interactive Scroll Indicator */}
            <div className={styles.scrollPrompter}>
              <div className={styles.scrollTrack}>
                <div
                  className={styles.scrollThumb}
                  style={{ transform: `scaleY(${Math.max(0.15, scrollProgress)})` }}
                />
              </div>
              <span className={styles.scrollPromptText}>
                SCROLL TO NAVIGATE THE EXPERIENCE
              </span>
            </div>
          </div>
        </div>

        {/* 4. Stage 2: Luxury Automotive Cockpit Telemetry (Scroll 24% - 58%) */}
        <div
          ref={stage2Ref}
          className={styles.stage}
          style={{
            opacity: s2Opacity,
            transform: `translate3d(0, ${s2Y}px, 0)`,
            pointerEvents: s2Opacity > 0.5 ? "auto" : "none",
          }}
        >
          <div className={styles.stage2Grid}>
            <div className={styles.hudCard}>
              <div className={styles.hudCardTop}>
                <Terminal size={14} className={styles.magentaIcon} />
                <span>01 // CORE ARCHITECTURE</span>
              </div>
              <h3 className={styles.hudCardTitle}>Resilient Full Stack Engineering</h3>
              <p className={styles.hudCardText}>
                Architecting enterprise-grade applications with Next.js 15, React 19,
                Node.js, and TypeScript with zero-compromise runtime stability.
              </p>
              <div className={styles.hudCardTagRow}>
                <span className={styles.hudChip}>Next.js 15</span>
                <span className={styles.hudChip}>React 19</span>
                <span className={styles.hudChip}>TypeScript</span>
              </div>
            </div>

            <div className={styles.hudCenterGauge}>
              <div className={styles.neonArc} />
              <span className={styles.centerGaugeTitle}>AESTHETIC</span>
              <span className={styles.centerGaugeValue}>LUXURY AUTOMOTIVE</span>
              <span className={styles.centerGaugeSub}>DEEP BURGUNDY &bull; NEON MAGENTA</span>
            </div>

            <div className={styles.hudCard}>
              <div className={styles.hudCardTop}>
                <Shield size={14} className={styles.magentaIcon} />
                <span>02 // HIGH PERFORMANCE</span>
              </div>
              <h3 className={styles.hudCardTitle}>Cinematic 3D &amp; Spatial Web</h3>
              <p className={styles.hudCardText}>
                Blending automotive-grade gloss aesthetics, GPU-accelerated canvas scrubbing,
                and micro-interactions with award-winning Awwwards craft.
              </p>
              <div className={styles.hudCardTagRow}>
                <span className={styles.hudChip}>Canvas 60FPS</span>
                <span className={styles.hudChip}>GSAP Scrub</span>
                <span className={styles.hudChip}>WebGL</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Stage 3: Personal Introduction & Authentic Portrait (Scroll 54% - 88%) */}
        <div
          ref={stage3Ref}
          className={styles.stage}
          style={{
            opacity: s3Opacity,
            transform: `translate3d(0, ${s3Y}px, 0)`,
            pointerEvents: s3Opacity > 0.5 ? "auto" : "none",
          }}
        >
          <div className={styles.stage3Layout}>
            {/* Authentic Photographic Portrait */}
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
                <div className={styles.portraitChassisBorder} />
                <div className={styles.portraitTag}>
                  <Sparkles size={13} className={styles.magentaIcon} />
                  <span>Available for Engineering Roles</span>
                </div>
              </div>
            </div>

            {/* Narrative & Credentials */}
            <div className={styles.stage3Narrative}>
              <div className={styles.badgeRow}>
                <span className={styles.neonBadge}>MIKUL JAIN</span>
                <span className={styles.roleBadge}>FULL STACK DEVELOPER</span>
              </div>

              <h2 className={styles.stage3Headline}>
                Turning Complex Architecture Into{" "}
                <span className={styles.magentaGradientText}>Seamless Experiences.</span>
              </h2>

              <p className={styles.stage3Bio}>
                {profile.supportingIntro}
              </p>

              {/* Verified Credentials */}
              <div className={styles.credStrip}>
                <div className={styles.credItem}>
                  <span className={styles.credLabel}>EDUCATION</span>
                  <span className={styles.credValue}>B.Tech CSE &bull; AITR Indore</span>
                </div>
                <div className={styles.credDivider} />
                <div className={styles.credItem}>
                  <span className={styles.credLabel}>ACADEMIC RECORD</span>
                  <span className={styles.credValue}>8.22 CGPA (3rd Year)</span>
                </div>
                <div className={styles.credDivider} />
                <div className={styles.credItem}>
                  <span className={styles.credLabel}>RECOGNITION</span>
                  <span className={styles.credValue}>Top 10 CodeSpire &bull; Kriyeta Finalist</span>
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
        </div>

        {/* 6. Stage 4: Spatial Navigation Hub (Scroll 82% - 100%) */}
        <div
          ref={stage4Ref}
          className={styles.stage}
          style={{
            opacity: s4Opacity,
            transform: `translate3d(0, ${s4Y}px, 0)`,
            pointerEvents: s4Opacity > 0.5 ? "auto" : "none",
          }}
        >
          <div className={styles.stage4Hub}>
            <div className={styles.hubHeader}>
              <span className={styles.hubSubtitle}>CHAPTER INDEX</span>
              <h2 className={styles.hubTitle}>
                Explore the <span className={styles.magentaGradientText}>Portfolio Universe</span>
              </h2>
            </div>

            <div className={styles.hubGrid}>
              <a href="#about" className={styles.hubCard}>
                <span className={styles.hubCardNum}>01</span>
                <span className={styles.hubCardTitle}>ABOUT ME</span>
                <span className={styles.hubCardDesc}>Story, background &amp; philosophy</span>
              </a>

              <a href="#capabilities" className={styles.hubCard}>
                <span className={styles.hubCardNum}>02</span>
                <span className={styles.hubCardTitle}>WHAT I DO</span>
                <span className={styles.hubCardDesc}>Architecture, systems &amp; craft</span>
              </a>

              <a href="#projects" className={styles.hubCard}>
                <span className={styles.hubCardNum}>03</span>
                <span className={styles.hubCardTitle}>PROJECTS</span>
                <span className={styles.hubCardDesc}>HealthDost, Civic Issue, Banking</span>
              </a>

              <a href="#skills" className={styles.hubCard}>
                <span className={styles.hubCardNum}>04</span>
                <span className={styles.hubCardTitle}>TECH STACK</span>
                <span className={styles.hubCardDesc}>Languages, frameworks &amp; tooling</span>
              </a>

              <a href="#journey" className={styles.hubCard}>
                <span className={styles.hubCardNum}>05</span>
                <span className={styles.hubCardTitle}>EXPERIENCE</span>
                <span className={styles.hubCardDesc}>Hackathons, achievements &amp; milestones</span>
              </a>

              <a href="#contact" className={styles.hubCard}>
                <span className={styles.hubCardNum}>06</span>
                <span className={styles.hubCardTitle}>CONTACT</span>
                <span className={styles.hubCardDesc}>Initiate collaboration or inquiry</span>
              </a>
            </div>

            <div className={styles.releaseIndicator}>
              <div className={styles.mouseIcon}>
                <div className={styles.mouseWheel} />
              </div>
              <span>CONTINUE SCROLLING TO ENTER CHAPTERS</span>
            </div>
          </div>
        </div>

        {/* 7. Bottom Gradient Ambient Floor */}
        <div className={styles.ambientFloor} aria-hidden="true" />
      </div>
    </section>
  );
};
