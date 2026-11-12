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

    let idleId: number | null = null;
    let timerId: NodeJS.Timeout | null = null;

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        idleId = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
          .requestIdleCallback(() => setMount3D(true), { timeout: 600 });
      } else {
        timerId = setTimeout(() => setMount3D(true), 250);
      }
    }

    return () => {
      destroySmoothScroll();
      if (idleId !== null && typeof window !== "undefined" && "cancelIdleCallback" in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
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
