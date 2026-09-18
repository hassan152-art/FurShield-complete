import { Link } from "react-router-dom";

export default function PromoBannerGrid({ banners = [] }) {
  if (banners.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {banners.map((b) => (
        <Link key={b._id} to={b.linkUrl || "#"}>
          <div
            className="relative rounded-2xl overflow-hidden h-40 flex items-end p-5 group"
            style={{ backgroundColor: b.backgroundColor || "#F4EBDD" }}
          >
            <img
              src={b.imageUrl}
              alt={b.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
            />
            <div className="relative z-10">
              <p className="font-bold text-forest text-lg">{b.title}</p>
              {b.subtitle && <p className="text-forest/80 text-sm mt-1">{b.subtitle}</p>}
              {b.linkUrl && (
                <span className="text-xs font-semibold text-forest underline underline-offset-2 mt-2 inline-block">
                  {b.linkLabel || "Shop Now"} →
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
