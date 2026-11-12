"use client";

import React from "react";
import styles from "./Beyond.module.css";
import { profile } from "@/content/profile";
import { Compass, Film, Music, Dumbbell, BookOpen, Waves, Trophy } from "lucide-react";
import { useSectionDisappear } from "@/hooks/useCinematicScrollDisappear";

export const Beyond: React.FC = () => {
  const { containerRef, headerRef } = useSectionDisappear<HTMLElement>();

  const getInterestIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "cricket":
        return <Trophy size={20} />;
      case "football":
        return <Dumbbell size={20} />;
      case "hiking & rafting":
      case "river rafting":
        return <Waves size={20} />;
      case "cinema & reading":
      case "reading books":
        return <BookOpen size={20} />;
      case "music":
        return <Music size={20} />;
      default:
        return <Film size={20} />;
    }
  };

  return (
    <section
      id="beyond"
      ref={containerRef}
      className={styles.beyondSection}
      aria-label="Beyond Development"
    >
      <div className={styles.container}>
        <div ref={headerRef} className={styles.sectionHeader}>
          <span className="label-caps">Chapter 07 &bull; Beyond The Screen</span>
          <h2 className={styles.sectionTitle}>
            The mindset outside <span className={styles.accentText}>the code editor.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Great engineering is shaped by diverse perspectives. The disciplines, sports, and
            creative interests that cultivate strategic thinking, teamwork, and stamina.
          </p>
        </div>

        {/* Interests Editorial Grid */}
        <div className={styles.interestsGrid}>
          {profile.interests.map((interest, idx) => (
            <div
              key={idx}
              data-scroll-disappear
              className={styles.interestCard}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconBox}>{getInterestIcon(interest.name)}</div>
                <span className={styles.interestCategory}>{interest.category}</span>
              </div>

              <h3 className={styles.interestName}>{interest.name}</h3>
              <p className={styles.interestReflection}>{interest.reflection}</p>

              <div className={styles.cardAccentBar} />
            </div>
          ))}
        </div>

        {/* Human Note Banner */}
        <div data-scroll-disappear className={styles.quoteBanner}>
          <div className={styles.quoteIcon}>
            <Compass size={28} className={styles.compassSvg} />
          </div>
          <div className={styles.quoteContent}>
            <p className={styles.quoteText}>
              &quot;Curiosity doesn&apos;t turn off when the terminal closes. Exploring rivers,
              analyzing cinema, or planning a run-chase on the cricket pitch reinforces the same
              principles I bring to software: patience, spatial awareness, and decisive
              execution.&quot;
            </p>
            <span className={styles.quoteAuthor}>&mdash; Mikul Jain</span>
          </div>
        </div>
      </div>
    </section>
  );
};
