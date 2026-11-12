"use client";

import React, { useEffect, useState } from "react";
import styles from "./Navigation.module.css";
import { ThemeToggle } from "./ThemeToggle";
import { Compass, User, Briefcase, FolderGit2, Cpu, Milestone, Heart, Mail } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "hero", label: "Home", icon: <Compass size={16} /> },
  { id: "about", label: "About", icon: <User size={16} /> },
  { id: "capabilities", label: "What I Do", icon: <Briefcase size={16} /> },
  { id: "projects", label: "Projects", icon: <FolderGit2 size={16} /> },
  { id: "skills", label: "Skills", icon: <Cpu size={16} /> },
  { id: "journey", label: "Journey", icon: <Milestone size={16} /> },
  { id: "beyond", label: "Beyond", icon: <Heart size={16} /> },
  { id: "contact", label: "Contact", icon: <Mail size={16} /> },
];

export const Navigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 250;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          const item = navItems[i];
          if (item) {
            setActiveSection(item.id);
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <header className={`${styles.navContainer} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.navBar} aria-label="Main Navigation">
        <a href="#hero" className={styles.brand} onClick={(e) => scrollTo(e, "hero")}>
          <span className={styles.brandDot} />
          <span className={styles.brandText}>Mikul Jain</span>
        </a>

        <div className={styles.links}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollTo(e, item.id)}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={styles.linkIcon}>{item.icon}</span>
                <span className={styles.linkLabel}>{item.label}</span>
                {isActive && <span className={styles.activeDot} />}
              </a>
            );
          })}
        </div>

        <div className={styles.actions}>
          <ThemeToggle />
          <a href="#contact" onClick={(e) => scrollTo(e, "contact")} className={styles.ctaButton}>
            Let&apos;s Connect
          </a>
        </div>
      </nav>
    </header>
  );
};
