import { PawPrint } from "lucide-react";

const sizes = {
  sm: { icon: 14, gap: "gap-1" },
  md: { icon: 22, gap: "gap-2" },
  lg: { icon: 32, gap: "gap-3" },
};

export default function PawStepsLoader({ size = "md", color }) {
  const s = sizes[size] || sizes.md;
  return (
    <span className={`paw-steps inline-flex items-center ${s.gap}`}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i}>
          <PawPrint size={s.icon} color={color} />
        </span>
      ))}
    </span>
  );
}
