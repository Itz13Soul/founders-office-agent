"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Card = { radius: number; angle: number; y: number; speed: number; overdue: boolean; tilt: number };

function Scene({ still }: { still: boolean }) {
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const cards = useRef<(THREE.Group | null)[]>([]);

  const items = useMemo<Card[]>(() => {
    const out: Card[] = [];
    const rings = [
      { r: 1.55, n: 6, speed: 0.32 },
      { r: 2.1, n: 8, speed: -0.22 },
      { r: 2.65, n: 10, speed: 0.14 },
    ];
    let k = 0;
    rings.forEach((ring, ri) => {
      for (let i = 0; i < ring.n; i++) {
        out.push({
          radius: ring.r,
          angle: (i / ring.n) * Math.PI * 2 + ri,
          y: Math.sin(k * 1.7) * 0.55,
          speed: ring.speed,
          overdue: (k * 7) % 5 === 0,
          tilt: Math.cos(k * 2.3) * 0.25,
        });
        k++;
      }
    });
    return out;
  }, []);

  const stars = useMemo(() => {
    const n = 260;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 4.5 + ((i * 37) % 100) / 40;
      const t = i * 2.399963;
      const y = ((i * 53) % 200) / 100 - 1;
      const s = Math.sqrt(1 - y * y);
      a[i * 3] = Math.cos(t) * s * r;
      a[i * 3 + 1] = y * r;
      a[i * 3 + 2] = Math.sin(t) * s * r;
    }
    return a;
  }, []);

  useFrame(({ pointer, clock }, dt) => {
    const g = root.current;
    if (g) {
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.45 + pointer.y * 0.25, 0.05);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.x * 0.4, 0.05);
    }
    if (still) return;
    const t = clock.elapsedTime;
    if (core.current) {
      core.current.rotation.x += dt * 0.5;
      core.current.rotation.y += dt * 0.7;
    }
    if (halo.current) halo.current.scale.setScalar(1 + 0.12 * Math.sin(t * 2));
    items.forEach((c, i) => {
      const m = cards.current[i];
      if (!m) return;
      const a = c.angle + t * c.speed;
      m.position.set(Math.cos(a) * c.radius, c.y + Math.sin(t * 0.8 + i) * 0.05, Math.sin(a) * c.radius);
      m.lookAt(0, c.y, 0);
      m.rotateZ(c.tilt);
      if (c.overdue) m.scale.setScalar(1 + 0.12 * Math.sin(t * 4 + i));
    });
  });

  return (
    <group ref={root} rotation={[0.45, 0, 0]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color="#fbbf24" wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.38, 32, 24]} />
        <meshBasicMaterial color="#fcd34d" />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.75, 32, 24]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.12} />
      </mesh>
      {[1.55, 2.1, 2.65].map((r) => (
        <mesh key={r} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.004, 6, 160]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
        </mesh>
      ))}
      {items.map((c, i) => (
        <group
          key={i}
          ref={(el) => {
            cards.current[i] = el;
          }}
          position={[Math.cos(c.angle) * c.radius, c.y, Math.sin(c.angle) * c.radius]}
        >
          <mesh>
            <boxGeometry args={[0.46, 0.3, 0.025]} />
            <meshBasicMaterial color={c.overdue ? "#7f1d1d" : "#1c1917"} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.46, 0.3, 0.025)]} />
            <lineBasicMaterial color={c.overdue ? "#f87171" : "#fbbf24"} />
          </lineSegments>
          <mesh position={[-0.12, 0.05, 0.02]}>
            <planeGeometry args={[0.16, 0.025]} />
            <meshBasicMaterial color={c.overdue ? "#fecaca" : "#fde68a"} />
          </mesh>
          <mesh position={[-0.06, -0.02, 0.02]}>
            <planeGeometry args={[0.28, 0.02]} />
            <meshBasicMaterial color="#78716c" />
          </mesh>
          <mesh position={[-0.09, -0.07, 0.02]}>
            <planeGeometry args={[0.22, 0.02]} />
            <meshBasicMaterial color="#57534e" />
          </mesh>
        </group>
      ))}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#fde68a" size={0.025} transparent opacity={0.7} />
      </points>
    </group>
  );
}

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function PromiseOrbit() {
  const still = useSyncExternalStore(subscribe, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  return (
    <Canvas camera={{ position: [0, 0, 6.2], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <Scene still={still} />
    </Canvas>
  );
}
