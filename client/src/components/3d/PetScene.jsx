import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// A stylized low-poly "pet" built from primitives — no external model files needed,
// keeps the bundle tiny and load time near-zero.
function PetBlob({ position, bodyColor, earColor, scale = 1, floatSpeed = 1 }) {
  return (
    <Float speed={floatSpeed} rotationIntensity={0.4} floatIntensity={0.8}>
      <group position={position} scale={scale}>
        {/* body */}
        <mesh castShadow>
          <sphereGeometry args={[0.9, 24, 24]} />
          <meshStandardMaterial color={bodyColor} roughness={0.5} />
        </mesh>
        {/* head */}
        <mesh position={[0, 0.95, 0.3]} castShadow>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial color={bodyColor} roughness={0.5} />
        </mesh>
        {/* ears */}
        <mesh position={[-0.35, 1.35, 0.3]} rotation={[0, 0, 0.4]}>
          <coneGeometry args={[0.18, 0.4, 12]} />
          <meshStandardMaterial color={earColor} roughness={0.5} />
        </mesh>
        <mesh position={[0.35, 1.35, 0.3]} rotation={[0, 0, -0.4]}>
          <coneGeometry args={[0.18, 0.4, 12]} />
          <meshStandardMaterial color={earColor} roughness={0.5} />
        </mesh>
        {/* snout */}
        <mesh position={[0, 0.85, 0.75]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#FFF9F0" roughness={0.6} />
        </mesh>
        {/* nose */}
        <mesh position={[0, 0.85, 0.95]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#17221E" roughness={0.4} />
        </mesh>
        {/* tail */}
        <mesh position={[0, 0.2, -0.9]} rotation={[0.6, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
          <meshStandardMaterial color={earColor} roughness={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function PawPrint({ position, scale = 1 }) {
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <group position={position} scale={scale}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#FF8066" roughness={0.4} />
        </mesh>
        {[[-0.22, 0.28, 0], [0.22, 0.28, 0], [-0.1, 0.4, 0], [0.1, 0.4, 0]].map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#FF8066" roughness={0.4} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function HeartShape({ position, scale = 1 }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0, 0.3, -0.5, 0.3, -0.5, -0.05);
    s.bezierCurveTo(-0.5, -0.4, 0, -0.6, 0, -0.9);
    s.bezierCurveTo(0, -0.6, 0.5, -0.4, 0.5, -0.05);
    s.bezierCurveTo(0.5, 0.3, 0, 0.3, 0, 0);
    return s;
  }, []);
  const geometry = useMemo(() => new THREE.ExtrudeGeometry(shape, { depth: 0.15, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 }), [shape]);

  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1.4}>
      <mesh position={position} scale={scale} geometry={geometry} rotation={[0, 0, Math.PI]}>
        <meshStandardMaterial color="#F5C96A" roughness={0.4} />
      </mesh>
    </Float>
  );
}

function MedicalCross({ position, scale = 1 }) {
  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} scale={scale}>
        <RoundedBox args={[0.6, 0.2, 0.15]} radius={0.04}>
          <meshStandardMaterial color="#2E7D65" roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[0.2, 0.6, 0.15]} radius={0.04}>
          <meshStandardMaterial color="#2E7D65" roughness={0.4} />
        </RoundedBox>
      </group>
    </Float>
  );
}

function Scene({ pointer }) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    // subtle parallax toward pointer / scroll position
    const targetX = pointer.current.y * 0.15;
    const targetY = pointer.current.x * 0.25;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 2]} intensity={1.1} castShadow />

      <PetBlob position={[-1.1, -0.3, 0]} bodyColor="#F5C96A" earColor="#E8A33D" scale={0.85} floatSpeed={1} />
      <PetBlob position={[1.1, -0.5, -0.4]} bodyColor="#BFE8D5" earColor="#2E7D65" scale={0.7} floatSpeed={1.3} />

      <PawPrint position={[1.6, 1.2, 0.3]} scale={0.8} />
      <PawPrint position={[-1.8, 0.9, -0.3]} scale={0.6} />
      <HeartShape position={[0.2, 1.5, 0.2]} scale={0.5} />
      <MedicalCross position={[-0.3, -1.4, 0.5]} scale={0.7} />
    </group>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

// Static gradient fallback for reduced-motion preference or if WebGL fails.
function StaticFallback() {
  return (
    <div className="w-full h-full rounded-xl2 bg-gradient-to-br from-emerald to-forest flex items-center justify-center">
      <span className="text-6xl">🐾</span>
    </div>
  );
}

export default function PetScene() {
  const reducedMotion = usePrefersReducedMotion();
  const pointer = useRef({ x: 0, y: 0 });
  const [hasError, setHasError] = useState(false);

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    };
  };

  if (reducedMotion || hasError) return <StaticFallback />;

  return (
    <div className="w-full h-full" onMouseMove={onMouseMove}>
      <Suspense fallback={<StaticFallback />}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], fov: 42 }}
          onError={() => setHasError(true)}
        >
          <Scene pointer={pointer} />
        </Canvas>
      </Suspense>
    </div>
  );
}
