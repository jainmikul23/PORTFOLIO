"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { initSmoothScroll, destroySmoothScroll } from "@/lib/animations/scroll";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { JsonLd } from "@/components/seo/JsonLd";

// Lazy-load Three.js WebGL canvas so it does not block initial paint, FCP or LCP
const Scene = dynamic(
  () => import("@/components/three/Scene").then((mod) => mod.Scene),
  { ssr: false }
);

interface ClientProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  const [mount3D, setMount3D] = useState(false);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    initSmoothScroll();

    let timerId: NodeJS.Timeout | null = null;

    const start3D = () => {
      setMount3D(true);
      window.removeEventListener("scroll", start3D);
      window.removeEventListener("pointermove", start3D);
      window.removeEventListener("touchstart", start3D);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", start3D, { passive: true, once: true });
      window.addEventListener("pointermove", start3D, { passive: true, once: true });
      window.addEventListener("touchstart", start3D, { passive: true, once: true });

      // Fallback timer: mount after initial paint window so TBT stays minimal
      timerId = setTimeout(start3D, 2200);
    }

    return () => {
      destroySmoothScroll();
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", start3D);
        window.removeEventListener("pointermove", start3D);
        window.removeEventListener("touchstart", start3D);
      }
      if (timerId !== null) {
        clearTimeout(timerId);
      }
    };
  }, []);

  return (
    <>
      {/* Search Engine & AI Structured Data */}
      <JsonLd />

      {/* Non-Blocking Initial Ambient Indicator */}
      <LoadingScreen />

      {/* Interactive 3D WebGL Canvas */}
      {mount3D && <Scene />}

      {/* Main Page Content */}
      {children}
    </>
  );
};
