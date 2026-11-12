"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const AmbientMesh: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();

    // Smooth mouse tilt tracking for the entire sculpture
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.35 + Math.sin(t * 0.4) * 0.1,
        0.05,
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.45 + t * 0.15,
        0.05,
      );
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.25;
    }

    // Individual component rotations
    if (knotRef.current) {
      knotRef.current.rotation.x = t * 0.2;
      knotRef.current.rotation.z = t * 0.15;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.3;
      coreRef.current.rotation.z = Math.PI / 4 + Math.sin(t * 0.5) * 0.2;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.25;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.3) * 0.15;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = -t * 0.2;
      outerRingRef.current.rotation.z = Math.PI / 6 + Math.cos(t * 0.35) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[1.6, 0.1, 0]}>
      {/* 1. Luminous Inner Geometric Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#FF633D"
          emissive="#FF633D"
          emissiveIntensity={1.2}
          wireframe
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* 2. Glassmorphic Torus Knot Sculpture */}
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[1.35, 0.38, 128, 32]} />
        <meshStandardMaterial
          color="#1F2333"
          emissive="#FF633D"
          emissiveIntensity={0.65}
          roughness={0.2}
          metalness={0.85}
          wireframe
        />
      </mesh>

      {/* 3. Orbiting Inner Energy Ring (Cyan/Lavender) */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.2, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#A6A9FF"
          emissive="#A6A9FF"
          emissiveIntensity={1.0}
          roughness={0.1}
        />
      </mesh>

      {/* 4. Outer Gyroscopic Orbit Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.7, 0.02, 16, 120]} />
        <meshStandardMaterial
          color="#FF633D"
          emissive="#FF633D"
          emissiveIntensity={0.8}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};
