"use client";

import React from "react";
import Image from "next/image";
import styles from "./Journey.module.css";
import { profile } from "@/content/profile";
import { GraduationCap, Users, Sparkles, Calendar, Award } from "lucide-react";

export const Journey: React.FC = () => {
  return (
    <section id="journey" className={styles.journeySection} aria-label="Journey & Milestones">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className="label-caps">Chapter 06 &bull; The Story So Far</span>
          <h2 className={styles.sectionTitle}>
            Academic trajectory &amp;{" "}
            <span className={styles.accentText}>milestones.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A chronological timeline of computer science education at AITR, collaborative engineering projects, and independent technical development.
          </p>
        </div>

        <div className={styles.timelineWrapper}>
          {profile.journey.map((item, idx) => (
            <div key={idx} className={styles.timelineItem}>
              {/* Left Column: Period Badge */}
              <div className={styles.periodCol}>
                <span className={styles.periodBadge}>
                  <Calendar size={13} />
                  {item.period}
                </span>
                <span className={styles.categoryTag}>{item.category}</span>
              </div>

              {/* Center Column: Spine & Dot */}
              <div className={styles.spineCol}>
                <span className={styles.spineDot} />
                {idx !== profile.journey.length - 1 && <span className={styles.spineLine} />}
              </div>

              {/* Right Column: Narrative Card */}
              <div className={styles.cardCol}>
                <div className={styles.milestoneCard}>
                  <div className={styles.cardHeader}>
                    {idx === 0 && <GraduationCap size={20} className={styles.headerIcon} />}
                    {idx === 1 && <Users size={20} className={styles.headerIcon} />}
                    {idx === 2 && <Sparkles size={20} className={styles.headerIcon} />}
                    <h3 className={styles.milestoneTitle}>{item.title}</h3>
                  </div>

                  <span className={styles.organization}>{item.organization}</span>
                  <p className={styles.description}>{item.description}</p>

                  {item.image && (
                    <div className={styles.milestoneImageWrapper}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={520}
                        height={340}
                        className={styles.milestoneImage}
                      />
                      <div className={styles.imageOverlayBadge}>
                        <Award size={14} className={styles.awardIcon} />
                        <span>AITR ACM Student Chapter &bull; Powered by Google</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
