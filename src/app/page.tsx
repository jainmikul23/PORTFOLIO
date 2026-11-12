import React from "react";
import { Navigation } from "@/components/ui/Navigation";
import { Hero } from "@/components/sections/Hero";
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

      {/* Complete 7-Chapter Storytelling Structure */}
      <main id="main-content">
        <Hero />
        <About />
        <Capabilities />
        <Projects />
        <Skills />
        <Journey />
        <Beyond />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
