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
    return <div className={styles.cssFallback} aria-hidden="true" />;
  }

  return (
    <div className={styles.canvasContainer} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
        }}
      >
        <Particles count={300} />
        <AmbientMesh />
      </Canvas>
    </div>
  );
};
