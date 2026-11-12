"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Particles: React.FC<{ count?: number }> = ({ count = 450 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate particle positions and random drift factors
  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      spd[i * 3] = (Math.random() - 0.5) * 0.002;
      spd[i * 3 + 1] = 0.001 + Math.random() * 0.003; // Gentle upward drift
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    return { positions: pos, speeds: spd };
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const speedY = speeds[idx + 1] ?? 0.002;
      const posX = positions[idx] ?? 0;
      let posY = positions[idx + 1] ?? 0;
      const posZ = positions[idx + 2] ?? 0;

      posY += speedY * (delta * 60);

      // Loop particles back to bottom
      if (posY > 10) {
        posY = -10;
      }
      positions[idx + 1] = posY;

      dummy.position.set(posX, posY, posZ);
      dummy.scale.setScalar(0.04 + Math.sin(i * 10 + posY) * 0.015);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#FF633D"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};
