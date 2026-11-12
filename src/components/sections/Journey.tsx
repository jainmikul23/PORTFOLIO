"use client";

import React from "react";
import Image from "next/image";
import styles from "./Journey.module.css";
import { profile } from "@/content/profile";
import { GraduationCap, Users, Sparkles, Calendar, Award, ExternalLink } from "lucide-react";
import { useSectionDisappear } from "@/hooks/useCinematicScrollDisappear";

const getCategoryIcon = (category: string) => {
  if (category.includes("Academic")) return <GraduationCap size={20} className={styles.headerIcon} />;
  if (category.includes("Hackathon")) return <Award size={20} className={styles.headerIcon} />;
  if (category.includes("Collaborative")) return <Users size={20} className={styles.headerIcon} />;
  return <Sparkles size={20} className={styles.headerIcon} />;
};

export const Journey: React.FC = () => {
  const { containerRef, headerRef } = useSectionDisappear<HTMLElement>();

  return (
    <section
      id="journey"
      ref={containerRef}
      className={styles.journeySection}
      aria-label="Journey & Milestones"
    >
      <div className={styles.container}>
        <div ref={headerRef} className={styles.sectionHeader}>
          <span className="label-caps">Chapter 06 &bull; The Story So Far</span>
          <h2 className={styles.sectionTitle}>
            Academic trajectory &amp;{" "}
            <span className={styles.accentText}>milestones.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A chronological timeline of computer science education at AITR, hackathon recognitions, collaborative engineering projects, and independent technical development.
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
                <div data-scroll-disappear className={styles.milestoneCard}>
                  <div className={styles.cardHeader}>
                    {getCategoryIcon(item.category)}
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
                        <span>{item.badge || item.organization}</span>
                      </div>
                    </div>
                  )}

                  {item.link && (
                    <div className={styles.cardActions}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkedinLink}
                        aria-label={`View verified LinkedIn post for ${item.title}`}
                      >
                        <span>View Verified Post</span>
                        <ExternalLink size={13} />
                      </a>
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
