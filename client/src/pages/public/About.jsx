import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold text-forest">
        About FurShield
      </motion.h1>
      <p className="text-muted mt-4 max-w-2xl">
        FurShield exists to make pet care simpler, kinder and more connected — bringing
        pet owners, veterinarians and shelters together on one platform.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {[
          { title: "Our Mission", body: "Centralize pet health, veterinary care and adoption so no pet is left without support." },
          { title: "Our Vision", body: "A world where every pet has access to timely care and a loving home." },
          { title: "Our Values", body: "Trust, compassion, transparency and community-driven care." },
        ].map((v) => (
          <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-forest">{v.title}</h3>
            <p className="text-sm text-muted mt-2">{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
