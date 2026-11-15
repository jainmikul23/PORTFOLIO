import React from "react";
import { Navigation } from "@/components/ui/Navigation";
import { CinematicHero } from "@/components/cinematic/CinematicHero";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Journey } from "@/components/sections/Journey";
import { Beyond } from "@/components/sections/Beyond";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { CommandPalette } from "@/components/ui/CommandPalette";

export default function HomePage() {
  return (
    <>
      {/* Skip Link for accessibility */}
      <a href="#hero" className="skip-link">
        Skip to main content
      </a>

      {/* Interactive Command Palette (Keyboard shortcut ` or Cmd+K) */}
      <CommandPalette />

      {/* Floating Cinematic Navigation */}
      <Navigation />

      {/* Master Cinematic Experience & 6-Chapter Storytelling Structure */}
      <main id="main-content">
        {/* 01 & 02 — Pinned Scroll-Controlled Google Flow 3D Experience */}
        <CinematicHero />
        {/* 03 — About Me */}
        <About />
        {/* 04 — Tech Stack & Capabilities */}
        <Capabilities />
        {/* 05 — Selected Projects */}
        <Projects />
        <Skills />
        <Journey />
        <Beyond />
        {/* 06 — Contact */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
