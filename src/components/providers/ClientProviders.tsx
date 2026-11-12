"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { initSmoothScroll, destroySmoothScroll } from "@/lib/animations/scroll";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { JsonLd } from "@/components/seo/JsonLd";

// Dynamically import 3D WebGL Scene so it only mounts on the client
const Scene = dynamic(
  () => import("@/components/three/Scene").then((mod) => mod.Scene),
  { ssr: false }
);

interface ClientProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  useEffect(() => {
    initSmoothScroll();

    return () => {
      destroySmoothScroll();
    };
  }, []);

  return (
    <>
      {/* Search Engine & AI Structured Data */}
      <JsonLd />

      {/* Abstract Non-Blocking Initial Loader */}
      <LoadingScreen />

      {/* Persistent 3D WebGL Canvas / Particles */}
      <Scene />

      {/* Main Page Layout */}
      {children}
    </>
  );
};
