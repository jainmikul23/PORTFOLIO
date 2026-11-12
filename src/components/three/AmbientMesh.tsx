"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const AmbientMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }, _delta) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.12 + pointer.y * 0.2;
      meshRef.current.rotation.y = t * 0.15 + pointer.x * 0.2;
      // Gentle breathing idle float
      meshRef.current.position.y = Math.sin(t * 0.6) * 0.2;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.2;
      ringRef.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.4) * 0.1;
    }
  });

  return (
    <group position={[2.8, 0, -2]}>
      {/* Central Glass Geometry: Torus Knot */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.2, 0.35, 128, 32]} />
        <meshStandardMaterial
          color="#141720"
          emissive="#FF633D"
          emissiveIntensity={0.2}
          roughness={0.25}
          metalness={0.8}
          wireframe={true}
        />
      </mesh>

      {/* Outer Orbiting Energy Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[2.2, 2.24, 64]} />
        <meshBasicMaterial
          color="#A6A9FF"
          side={THREE.DoubleSide}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};
