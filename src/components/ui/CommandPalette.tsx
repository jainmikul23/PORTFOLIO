"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./CommandPalette.module.css";
import { Glass } from "./Glass";
import { profile } from "@/content/profile";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Action" | "Social";
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      close();
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("mikuljain09@gmail.com");
    alert("Email copied to clipboard!");
    close();
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
    close();
  };

  const commands: CommandItem[] = [
    { id: "hero", title: "Go to Home", category: "Navigation", action: () => scrollTo("hero") },
    { id: "about", title: "Go to About", category: "Navigation", action: () => scrollTo("about") },
    {
      id: "skills",
      title: "Go to Skills Constellation",
      category: "Navigation",
      action: () => scrollTo("skills"),
    },
    {
      id: "projects",
      title: "Go to Projects & Case Studies",
      category: "Navigation",
      action: () => scrollTo("projects"),
    },
    {
      id: "journey",
      title: "Go to Education & Journey",
      category: "Navigation",
      action: () => scrollTo("journey"),
    },
    {
      id: "playground",
      title: "Go to Architecture Playground",
      category: "Navigation",
      action: () => scrollTo("playground"),
    },
    {
      id: "contact",
      title: "Go to Contact",
      category: "Navigation",
      action: () => scrollTo("contact"),
    },
    {
      id: "copy-email",
      title: "Copy Email Address",
      category: "Action",
      shortcut: "C",
      action: copyEmail,
    },
    {
      id: "toggle-theme",
      title: "Toggle Dark / Light Theme",
      category: "Action",
      shortcut: "T",
      action: toggleTheme,
    },
    {
      id: "resume",
      title: "View Professional Profile (LinkedIn)",
      category: "Action",
      action: () => {
        window.open(profile.links.linkedin, "_blank");
        close();
      },
    },
    {
      id: "linkedin",
      title: "Open LinkedIn Profile",
      category: "Social",
      action: () => {
        window.open("https://www.linkedin.com/in/mikul-jain-29b6b231a", "_blank");
        close();
      },
    },
    {
      id: "github",
      title: "Open GitHub Profile",
      category: "Social",
      action: () => {
        window.open("https://github.com/jainmikul23", "_blank");
        close();
      },
    },
  ];

  const filtered = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on backtick (`) or Cmd+K / Ctrl+K
      if (e.key === "`" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        toggleOpen();
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          selected.action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, toggleOpen, close]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <Glass variant="sheet" className={styles.dialog}>
          <div className={styles.header}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" x2="16.65" y1="21" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.input}
              placeholder="Type a command or jump to section... (or press Esc to exit)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              autoFocus
            />
            <span className={styles.badge}>ESC</span>
          </div>

          <div className={styles.results} role="listbox">
            {filtered.length === 0 ? (
              <div className={styles.empty}>No commands matching &quot;{query}&quot;</div>
            ) : (
              filtered.map((cmd, idx) => (
                <div
                  key={cmd.id}
                  className={`${styles.item} ${idx === selectedIndex ? styles.selected : ""}`}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  role="option"
                  aria-selected={idx === selectedIndex}
                >
                  <span className={styles.category}>{cmd.category}</span>
                  <span className={styles.title}>{cmd.title}</span>
                  {cmd.shortcut && <span className={styles.shortcut}>{cmd.shortcut}</span>}
                </div>
              ))
            )}
          </div>
        </Glass>
      </div>
    </div>
  );
};
