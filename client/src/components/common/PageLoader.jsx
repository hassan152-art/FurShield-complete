import { PawPrint } from "lucide-react";
import PawStepsLoader from "./PawStepsLoader.jsx";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-cream flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2 font-extrabold text-2xl text-forest">
        <PawPrint className="text-coral" /> FurShield
      </div>
      <PawStepsLoader size="lg" color="#2E7D65" />
      <p className="text-muted text-sm">Loading your experience...</p>
    </div>
  );
}
