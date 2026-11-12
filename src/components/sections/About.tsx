"use client";

import React from "react";
import Image from "next/image";
import styles from "./About.module.css";
import { profile } from "@/content/profile";
import { GraduationCap, Award, Lightbulb, Compass, Code2 } from "lucide-react";
import { useSectionDisappear } from "@/hooks/useCinematicScrollDisappear";

export const About: React.FC = () => {
  const { containerRef, headerRef } = useSectionDisappear<HTMLElement>();

  return (
    <section
      id="about"
      ref={containerRef}
      className={styles.aboutSection}
      aria-label="About Mikul Jain"
    >
      <div className={styles.container}>
        <div ref={headerRef} className={styles.sectionHeader}>
          <span className="label-caps">Chapter 02 &bull; The Person Behind The Screen</span>
          <h2 className={styles.sectionTitle}>
            Engineering rigor powered by{" "}
            <span className={styles.accentText}>product curiosity.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Bridging the gap between software engineering, user-centric product architecture, and relentless exploration of modern technologies.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Left Column: Visual Editorial Card with Authentic Hackathon Achievement */}
          <div className={styles.editorialVisual}>
            <div data-scroll-disappear className={styles.imageCard}>
              <div className={styles.imageFrame}>
                <Image
                  src="/images/mikul-hackathon-award.jpg"
                  alt="Mikul Jain receiving Hackathon Certificate of Achievement at Acropolis Institute of Technology and Research (AITR ACM Student Chapter, Powered by Google)"
                  width={440}
                  height={340}
                  className={styles.realPhoto}
                />
                <div className={styles.imageGradient} />
              </div>

              <div className={styles.captionBox}>
                <span className={styles.captionTag}>HackDay &bull; 2nd Position</span>
                <p className={styles.captionText}>
                  On stage at Acropolis Institute &bull; Awarded 2nd Position at HackDay, hosted by the AITR ACM Student Chapter and ACM-W (Powered by Google).
                </p>
              </div>
            </div>

            {/* Academic Credential Card */}
            <div data-scroll-disappear className={styles.credentialCard}>
              <div className={styles.credentialIconBox}>
                <GraduationCap size={24} className={styles.credIcon} />
              </div>
              <div className={styles.credentialDetails}>
                <span className={styles.credSchool}>{profile.education.college}</span>
                <span className={styles.credDegree}>{profile.education.degree}</span>
                <div className={styles.credBadgeRow}>
                  <span className={styles.cgpaBadge}>
                    <Award size={13} />
                    CGPA: {profile.education.cgpa}
                  </span>
                  <span className={styles.yearBadge}>{profile.education.year}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & 3 Core Pillars */}
          <div className={styles.narrativeCol}>
            <div data-scroll-disappear className={styles.proseBlock}>
              <p className={styles.leadParagraph}>
                I see code not as an end in itself, but as the raw material to <em>solve real human problems</em>. As a third-year Computer Science student, my journey is driven by answering two fundamental questions: <strong>What value does this create?</strong> and <strong>How do we build it to be resilient and fast?</strong>
              </p>
              <p className={styles.bodyParagraph}>
                Whether designing transactional relational schemas in MySQL, crafting responsive frontends in React and Next.js, or experimenting with Gemini 2.5 Flash for rural healthcare triage, I approach every project with the analytical discipline of an engineer and the empathy of a product builder.
              </p>
            </div>

            {/* Three Distinct Dimensions */}
            <div className={styles.pillarsGrid}>
              <div data-scroll-disappear className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <Lightbulb size={20} className={styles.pillarIcon} />
                  <h3 className={styles.pillarTitle}>Product Thinking</h3>
                </div>
                <p className={styles.pillarDesc}>
                  Understanding user pain points, mapping user journeys, and prioritizing core capabilities over feature bloat.
                </p>
              </div>

              <div data-scroll-disappear className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <Code2 size={20} className={styles.pillarIcon} />
                  <h3 className={styles.pillarTitle}>Full Stack Craft</h3>
                </div>
                <p className={styles.pillarDesc}>
                  Strong foundations in MERN architecture, REST APIs, schema design, and deterministic state management.
                </p>
              </div>

              <div data-scroll-disappear className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <Compass size={20} className={styles.pillarIcon} />
                  <h3 className={styles.pillarTitle}>Curiosity &amp; Innovation</h3>
                </div>
                <p className={styles.pillarDesc}>
                  Active experimentation with multimodal AI, WebRTC peer streams, and interactive WebGL 3D graphics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
