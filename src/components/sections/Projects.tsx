"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Projects.module.css";
import { profile } from "@/content/profile";
import type { Project } from "@/content/schema";
import { ArrowUpRight, ExternalLink, Check, Zap, Layers } from "lucide-react";

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "flagship" | "systems">("all");

  const filteredProjects = profile.projects.filter((p) => {
    if (filter === "flagship") return p.flagship;
    if (filter === "systems") return !p.flagship;
    return true;
  });

  return (
    <section id="projects" className={styles.projectsSection} aria-label="Selected Projects">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className="label-caps">Chapter 04 &bull; Selected Work</span>
          <h2 className={styles.sectionTitle}>
            Ideas turned into{" "}
            <span className={styles.accentText}>functional digital products.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Every project addresses a concrete human or architectural problem: healthcare
            accessibility in rural India, municipal governance accountability, and deterministic
            financial ledgers.
          </p>

          {/* Filter Pills */}
          <div className={styles.filterBar}>
            <button
              onClick={() => setFilter("all")}
              className={`${styles.filterBtn} ${filter === "all" ? styles.activeFilter : ""}`}
            >
              All Products ({profile.projects.length})
            </button>
            <button
              onClick={() => setFilter("flagship")}
              className={`${styles.filterBtn} ${filter === "flagship" ? styles.activeFilter : ""}`}
            >
              Flagship Case Studies (2)
            </button>
            <button
              onClick={() => setFilter("systems")}
              className={`${styles.filterBtn} ${filter === "systems" ? styles.activeFilter : ""}`}
            >
              Systems &amp; Architecture (2)
            </button>
          </div>
        </div>

        {/* Product Cards Showcase */}
        <div className={styles.productsGrid}>
          {filteredProjects.map((project: Project, idx: number) => (
            <article
              key={project.slug}
              className={`${styles.productCard} ${project.flagship ? styles.flagshipCard : ""}`}
            >
              {/* Card Header & Badges */}
              <div className={styles.cardHeader}>
                <div className={styles.badgeRow}>
                  {project.flagship && (
                    <span className={styles.flagshipPill}>
                      <Zap size={13} />
                      Flagship Product
                    </span>
                  )}
                  <span className={styles.roleTag}>{project.role}</span>
                </div>

                <div className={styles.indexTag}>0{idx + 1}</div>
              </div>

              {/* Title & Tagline */}
              <h3 className={styles.projectTitle}>
                <Link href={`/projects/${project.slug}`} className={styles.titleLink}>
                  {project.title}
                  <ArrowUpRight size={22} className={styles.titleArrow} />
                </Link>
              </h3>

              <p className={styles.projectTagline}>{project.tagline}</p>

              {/* Problem → Solution Structured Grid */}
              <div className={styles.productStory}>
                <div className={styles.storyBox}>
                  <span className={styles.storyLabel}>The Problem</span>
                  <p className={styles.storyText}>{project.problem}</p>
                </div>
                <div className={styles.storyBox}>
                  <span className={styles.storyLabel}>The Solution</span>
                  <p className={styles.storyText}>{project.solution}</p>
                </div>
              </div>

              {/* My Direct Contribution */}
              <div className={styles.contributionBox}>
                <span className={styles.contributionLabel}>
                  <Layers size={14} /> My Engineering Contribution:
                </span>
                <p className={styles.contributionText}>{project.myContribution}</p>
              </div>

              {/* Key Highlights */}
              <div className={styles.highlightsContainer}>
                <span className={styles.highlightsHeading}>Technical Architecture Highlights:</span>
                <ul className={styles.highlightsList}>
                  {project.highlights.map((h: string, hIdx: number) => (
                    <li key={hIdx}>
                      <Check size={14} className={styles.checkIcon} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Pills */}
              <div className={styles.stackRow}>
                {project.stack.map((tech: string) => (
                  <span key={tech} className={styles.techPill}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Footer Actions */}
              <div className={styles.cardFooter}>
                <Link href={`/projects/${project.slug}`} className={styles.caseStudyBtn}>
                  Read Product Case Study &rarr;
                </Link>

                <div className={styles.externalLinks}>
                  {project.links.github && !project.links.github.includes("TODO") && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.iconLink}
                      aria-label="GitHub Repository"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </a>
                  )}

                  {project.links.live && !project.links.live.includes("TODO") && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.iconLink}
                      aria-label="Live Demo"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
