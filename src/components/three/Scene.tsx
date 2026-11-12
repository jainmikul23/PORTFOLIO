"use client";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Particles } from "./Particles";
import { AmbientMesh } from "./AmbientMesh";
import { prefersReducedMotion } from "@/lib/animations/config";
import styles from "./Scene.module.css";

export const Scene: React.FC = () => {
  const [supported, setSupported] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (prefersReducedMotion()) {
      setSupported(false);
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setSupported(false);
    } catch {
      setSupported(false);
    }
  }, []);

  if (!mounted || !supported) {
    // Elegant CSS Fallback Mesh
    return <div className={styles.cssFallback} aria-hidden="true" />;
  }

  return (
    <div className={styles.canvasContainer} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 4, 5]} intensity={3.5} color="#FF633D" />
        <pointLight position={[-4, -3, 3]} intensity={2.5} color="#A6A9FF" />
        <pointLight position={[1.6, 0.5, 3]} intensity={2.0} color="#FF805E" />

        <Particles count={650} />
        <AmbientMesh />
      </Canvas>
    </div>
  );
};
