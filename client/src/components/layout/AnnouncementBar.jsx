import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const headlines = [
  "🐾 12,400+ pets already cared for on FurShield",
  "🩺 Book a trusted veterinarian in under 2 minutes",
  "🏡 4,900+ successful shelter adoptions and counting",
  "💚 Track vaccinations and health records in one place",
];

const ROTATE_MS = 4000;

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % headlines.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-forest text-cream text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-center gap-2 overflow-hidden">
        <Sparkles size={14} className="text-golden shrink-0" />
        <span key={index} className="announcement-text font-medium text-center truncate">
          {headlines[index]}
        </span>
      </div>
    </div>
  );
}
