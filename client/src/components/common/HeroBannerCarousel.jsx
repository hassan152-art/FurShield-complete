import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const AUTOPLAY_MS = 5000;

export default function HeroBannerCarousel({ banners = [] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const next = useCallback(() => setIndex((i) => (i + 1) % banners.length), [banners.length]);
  const prev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (!playing || banners.length <= 1) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [playing, next, banners.length]);

  if (banners.length === 0) return null;
  const banner = banners[index];

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg">
      <Link to={banner.linkUrl || "#"} className="block">
        <div
          className="relative h-64 sm:h-80 flex items-center px-8 sm:px-14"
          style={{ backgroundColor: banner.backgroundColor || "#BFE8D5" }}
        >
          <div className="relative z-10 max-w-md">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-forest">{banner.title}</h3>
            {banner.subtitle && <p className="text-forest/80 mt-2">{banner.subtitle}</p>}
            {banner.linkUrl && (
              <span className="inline-block mt-5 font-semibold text-forest underline underline-offset-4">
                {banner.linkLabel || "Learn more"} →
              </span>
            )}
          </div>
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-90 hidden sm:block"
            style={{ maskImage: "linear-gradient(to right, transparent, black 25%)", WebkitMaskImage: "linear-gradient(to right, transparent, black 25%)" }}
          />
        </div>
      </Link>

      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
          >
            <ChevronLeft size={18} className="text-forest" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
          >
            <ChevronRight size={18} className="text-forest" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/70 rounded-full px-3 py-1.5">
            <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause carousel" : "Play carousel"}>
              {playing ? <Pause size={12} className="text-forest" /> : <Play size={12} className="text-forest" />}
            </button>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to banner ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-emerald" : "bg-forest/30"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
