"use client";

import React, { useState } from "react";
import styles from "./Skills.module.css";
import { profile } from "@/content/profile";
import { Code, Server, Database, Terminal, Wrench, Sparkles } from "lucide-react";

interface SkillCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  skills: string[];
  description: string;
}

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories: SkillCategory[] = [
    {
      id: "frontend",
      name: "Frontend Development",
      icon: <Code size={20} />,
      skills: profile.skills.frontend,
      description: "Building responsive, GPU-accelerated client interfaces with modern component patterns and fluid layouts.",
    },
    {
      id: "backend",
      name: "Backend Development",
      icon: <Server size={20} />,
      skills: profile.skills.backend,
      description: "Architecting REST APIs, routing logic, and business workflows across Node.js/Express and Python/Django.",
    },
    {
      id: "database",
      name: "Database Management",
      icon: <Database size={20} />,
      skills: profile.skills.database,
      description: "Designing normalized relational schemas in MySQL and document structures in MongoDB with ACID guarantees.",
    },
    {
      id: "languages",
      name: "Programming Languages",
      icon: <Terminal size={20} />,
      skills: profile.skills.languages,
      description: "Core fluency in typed languages and scripting for systems logic, data structures, and algorithms.",
    },
    {
      id: "tools",
      name: "Tools & Technologies",
      icon: <Wrench size={20} />,
      skills: profile.skills.tools,
      description: "Version control workflows, API debugging, local development tooling, and formal UML software design.",
    },
    {
      id: "aiEmerging",
      name: "AI & Emerging Tech",
      icon: <Sparkles size={20} />,
      skills: profile.skills.aiEmerging,
      description: "Integrating multimodal LLMs (Gemini 2.5 Flash), WebRTC peer streams, and geospatial Overpass queries.",
    },
  ];

  const displayed = activeCategory === "all"
    ? categories
    : categories.filter((c) => c.id === activeCategory);

  return (
    <section id="skills" className={styles.skillsSection} aria-label="Technical Skills">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className="label-caps">Chapter 05 &bull; Technical Universe</span>
          <h2 className={styles.sectionTitle}>
            Tools, architectures &amp;{" "}
            <span className={styles.accentText}>engineering stack.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A structured breakdown of my full stack engineering toolkit. Evaluated through practical implementation in flagship products and university computer science coursework.
          </p>

          {/* Filter Pills */}
          <div className={styles.filterRow}>
            <button
              onClick={() => setActiveCategory("all")}
              className={`${styles.filterBtn} ${activeCategory === "all" ? styles.activeFilter : ""}`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`${styles.filterBtn} ${activeCategory === c.id ? styles.activeFilter : ""}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className={styles.categoryGrid}>
          {displayed.map((cat) => (
            <div key={cat.id} className={styles.categoryCard}>
              <div className={styles.catHeader}>
                <div className={styles.iconBox}>{cat.icon}</div>
                <h3 className={styles.catName}>{cat.name}</h3>
              </div>

              <p className={styles.catDesc}>{cat.description}</p>

              <div className={styles.skillsWrapper}>
                {cat.skills.map((skill) => (
                  <span key={skill} className={styles.skillBadge}>
                    <span className={styles.skillDot} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
