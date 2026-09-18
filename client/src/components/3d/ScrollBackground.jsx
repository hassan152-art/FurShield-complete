import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// A calm, minimal 3D layer: a few translucent paw prints that drift and
// gently "wave" as elapsed time and the current scroll position both feed
// into their motion, so scrolling visibly ripples through them.
function FloatingPaw({ baseX, baseZ, phase, color, size = 1 }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const scrollY = window.scrollY || 0;
    // Wave term: shapes further right lag further behind in phase, creating a
    // gentle rolling wave as the scroll offset feeds into the sine argument.
    const wave = Math.sin(t * 0.35 + phase + scrollY * 0.0015) * 0.45;
    const drift = Math.sin(t * 0.08 + phase) * 0.3;
    ref.current.position.y = wave;
    ref.current.position.x = baseX + drift;
    ref.current.rotation.z = Math.sin(t * 0.2 + phase) * 0.25;
    ref.current.rotation.y += 0.0012;
  });

  return (
    <group ref={ref} position={[baseX, 0, baseZ]} scale={size}>
      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color={color} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      {[[-0.22, 0.3, 0], [0.22, 0.3, 0], [-0.1, 0.42, 0], [0.1, 0.42, 0]].map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color={color} transparent opacity={0.22} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

const shapes = [
  { baseX: -5, baseZ: -4, phase: 0, color: "#FF8066", size: 0.8 },
  { baseX: -1.5, baseZ: -5, phase: 1.6, color: "#2E7D65", size: 0.55 },
  { baseX: 2.5, baseZ: -4.5, phase: 3.1, color: "#BFE8D5", size: 0.7 },
  { baseX: 5.5, baseZ: -5.5, phase: 4.7, color: "#F5C96A", size: 0.5 },
];

function Scene() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 4]} intensity={0.6} />
      {shapes.map((s, i) => (
        <FloatingPaw key={i} baseX={s.baseX} baseZ={s.baseZ} phase={s.phase} color={s.color} size={s.size} />
      ))}
    </>
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

// Fixed, full-viewport, click-through 3D layer that sits behind page content.
// It's only visible through gaps in the layout (page background, section padding),
// which keeps text fully readable while adding ambient motion to the whole site.
export default function ScrollBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const [hasError, setHasError] = useState(false);

  if (reducedMotion || hasError) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-50" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 6], fov: 50 }}
          onError={() => setHasError(true)}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
