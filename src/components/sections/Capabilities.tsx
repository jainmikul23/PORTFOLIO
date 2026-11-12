"use client";

import React from "react";
import styles from "./Capabilities.module.css";
import { profile } from "@/content/profile";
import { CheckCircle2, ArrowUpRight } from "lucide-react";

export const Capabilities: React.FC = () => {
  return (
    <section
      id="capabilities"
      className={styles.capabilitiesSection}
      aria-label="Professional Capabilities"
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className="label-caps">Chapter 03 &bull; What I Do</span>
          <h2 className={styles.sectionTitle}>
            Three dimensions of a{" "}
            <span className={styles.accentText}>product-minded engineer.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A balanced approach: understanding the &quot;why&quot; before writing the
            &quot;how&quot;, executing full-stack architectures, and continuously exploring emerging
            technologies.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {profile.capabilities.map((cap) => (
            <div key={cap.id} className={styles.capabilityCard}>
              <div className={styles.cardTop}>
                <span className={styles.cardHeaderNumber}>{cap.title.split("—")[0]}</span>
                <span className={styles.cardHeaderTitle}>{cap.title.split("—")[1]}</span>
              </div>

              <h3 className={styles.cardSubtitle}>{cap.subtitle}</h3>
              <p className={styles.cardDesc}>{cap.description}</p>

              <div className={styles.itemsList}>
                <span className={styles.itemsHeading}>Core Practices:</span>
                <ul>
                  {cap.items.map((item, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={15} className={styles.checkIcon} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardFooter}>
                <a href="#projects" className={styles.cardAction}>
                  <span>See In Practice</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
