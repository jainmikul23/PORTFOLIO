"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Luminous Cybernetic Sculpture
 * An interactive, glowing geometric sculpture (inner octahedron + torus knot + dual gyro rings)
 * engineered for high visual fidelity and ultra-smooth 60fps rendering with zero PBR lighting lag.
 */
export const AmbientMesh: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();

    // Responsive pointer tracking with gentle natural breathing drift
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.3 + Math.sin(t * 0.35) * 0.08,
        0.05,
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.35 + t * 0.12,
        0.05,
      );
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.2;
    }

    if (knotRef.current) {
      knotRef.current.rotation.x = t * 0.18;
      knotRef.current.rotation.z = t * 0.12;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.25;
      coreRef.current.rotation.z = Math.PI / 4 + Math.sin(t * 0.4) * 0.15;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.2;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.25) * 0.12;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = -t * 0.16;
      outerRingRef.current.rotation.z = Math.PI / 6 + Math.cos(t * 0.3) * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[1.3, 0.1, 0]}>
      {/* 1. Luminous Inner Octahedron Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.85, 0]} />
        <meshBasicMaterial
          color="#FF633D"
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 2. Glassmorphic Torus Knot Sculpture */}
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[1.3, 0.35, 80, 20]} />
        <meshBasicMaterial
          color="#FF633D"
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* 3. Orbiting Inner Energy Ring (Cyan/Lavender) */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.1, 0.02, 16, 64]} />
        <meshBasicMaterial
          color="#A6A9FF"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 4. Outer Gyroscopic Orbit Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.6, 0.018, 16, 72]} />
        <meshBasicMaterial
          color="#FF805E"
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};
