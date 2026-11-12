"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Particles: React.FC<{ count?: number }> = ({ count = 650 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Split particles into two aesthetic palettes: 60% Cinematic Orange, 40% Lavender Blue
  const { positions, speeds, colors, scales } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const scs = new Float32Array(count);

    const orange = new THREE.Color("#FF633D");
    const lavender = new THREE.Color("#A6A9FF");

    for (let i = 0; i < count; i++) {
      // Swirl field: cluster some particles around the right sculpture and spread others
      const isClustered = i < count * 0.45;
      const radius = isClustered ? 1.5 + Math.random() * 3.5 : 3.0 + Math.random() * 8.0;
      const angle = Math.random() * Math.PI * 2;
      const centerOffsetX = isClustered ? 1.6 : 0;

      pos[i * 3] = centerOffsetX + Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      spd[i * 3] = (Math.random() - 0.5) * 0.003;
      spd[i * 3 + 1] = 0.003 + Math.random() * 0.006; // Upward buoyant drift
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.003;

      const c = Math.random() > 0.35 ? orange : lavender;
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;

      scs[i] = 0.06 + Math.random() * 0.06;
    }

    return { positions: pos, speeds: spd, colors: cols, scales: scs };
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize individual particle colors into instanced buffer
  useEffect(() => {
    if (!meshRef.current) return;
    const tempColor = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      tempColor.setRGB(colors[idx] ?? 1, colors[idx + 1] ?? 1, colors[idx + 2] ?? 1);
      meshRef.current.setColorAt(i, tempColor);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [count, colors]);

  useFrame(({ clock, pointer }, delta) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime();
    const ptrX = pointer.x * 0.5;
    const ptrY = pointer.y * 0.5;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const speedY = speeds[idx + 1] ?? 0.004;
      const posX = positions[idx] ?? 0;
      let posY = positions[idx + 1] ?? 0;
      const posZ = positions[idx + 2] ?? 0;

      posY += speedY * (delta * 60);

      // Loop particles back when they drift out of top bound
      if (posY > 8) {
        posY = -8;
      }
      positions[idx + 1] = posY;

      // Mouse interactive sway
      const swayX = Math.sin(t * 0.8 + i) * 0.08 + ptrX * (1 / (1 + Math.abs(posZ)));
      const swayY = Math.cos(t * 0.6 + i) * 0.08 - ptrY * 0.1;

      dummy.position.set(posX + swayX, posY + swayY, posZ);
      const baseScale = scales[i] ?? 0.08;
      const pulse = baseScale * (0.8 + Math.sin(t * 2 + i) * 0.35);
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#FFFFFF"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};
