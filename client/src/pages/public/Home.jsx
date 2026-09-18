import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { HeartPulse, Stethoscope, PawPrint, ShoppingBag, BookOpen, BellRing, ArrowRight, Bird, Fish, Rabbit, Dog, Cat, ShoppingCart, Star } from "lucide-react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import HeroBannerCarousel from "../../components/common/HeroBannerCarousel.jsx";
import PromoBannerGrid from "../../components/common/PromoBannerGrid.jsx";

const petTypes = [
  { label: "Dog", icon: Dog, bg: "#BFE8D5", to: "/adoption?species=Dog" },
  { label: "Cat", icon: Cat, bg: "#F5C96A55", to: "/adoption?species=Cat" },
  { label: "Small Pet", icon: Rabbit, bg: "#FF806655", to: "/adoption" },
  { label: "Fish", icon: Fish, bg: "#BFE8D5", to: "/products?category=health_supplies" },
  { label: "Bird", icon: Bird, bg: "#F4EBDD", to: "/adoption" },
];

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80", alt: "Golden retriever at a vet checkup", caption: "Wellness checkups" },
  { src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80", alt: "Cat resting at home", caption: "Everyday health tracking" },
  { src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80", alt: "Shelter dog waiting for adoption", caption: "Shelter adoptions" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stats = [
  { label: "Pets cared for", value: "12,400+" },
  { label: "Veterinarians", value: "320+" },
  { label: "Shelter partners", value: "85+" },
  { label: "Successful adoptions", value: "4,900+" },
];

const services = [
  { icon: HeartPulse, title: "Pet Health", desc: "Track vaccinations, treatments and vet visits in one timeline." },
  { icon: Stethoscope, title: "Veterinary Care", desc: "Book trusted vets and manage appointments effortlessly." },
  { icon: PawPrint, title: "Adoption", desc: "Discover pets from verified shelters looking for a home." },
  { icon: ShoppingBag, title: "Pet Products", desc: "Shop food, grooming and health essentials for your pet." },
  { icon: BookOpen, title: "Care Guides", desc: "Articles, videos and FAQs from pet-care experts." },
  { icon: BellRing, title: "Smart Reminders", desc: "Never miss a vaccination, grooming or appointment again." },
];

export default function Home() {
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/banners").then(({ data }) => setBanners(data.data.banners)).catch(() => {});
    api.get("/products", { params: { limit: 4 } }).then(({ data }) => setProducts(data.data.products)).catch(() => {});
  }, []);

  const heroBanners = banners.filter((b) => b.type === "hero");
  const promoBanners = banners.filter((b) => b.type === "promo");

  const addToCart = async (productId) => {
    if (!user || user.role !== "owner") {
      toast.error("Log in as a pet owner to add items to your cart.");
      return;
    }
    try {
      await api.post("/cart/items", { productId, quantity: 1 });
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    }
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-mint/40 to-cream pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <Badge tone="coral">Every Paw/Wing Deserves a Shield of Love</Badge>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-forest leading-tight">
              <span className="flex flex-wrap items-center gap-x-3">
                <span>Better</span>
                <Cat className="text-coral shrink-0" size={36} strokeWidth={2.5} />
                <span>Care.</span>
              </span>
              <span className="flex flex-wrap items-center gap-x-3">
                <span>Happier</span>
                <Dog className="text-golden shrink-0" size={36} strokeWidth={2.5} />
                <span>Pets.</span>
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted max-w-xl">
              FurShield brings pet health, veterinary care, adoption and pet essentials
              together in one caring platform for owners, vets and shelters.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button onClick={() => (window.location.href = "/register")}>
                Explore FurShield <ArrowRight size={18} />
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/vets")}>
                Find a Veterinarian
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-xl2 shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80"
                alt="A dog and cat, best friends, resting together"
                className="w-full h-full object-cover"
              />
            </div>
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80"
              alt="Happy dog"
              className="absolute -top-8 -left-8 w-24 h-24 rounded-2xl object-cover border-4 border-cream shadow-lg hidden sm:block"
            />
            <Card className="absolute -bottom-6 -left-6 w-48 hidden sm:block">
              <p className="text-xs text-muted">Next appointment</p>
              <p className="font-semibold text-forest text-sm">Tomorrow, 10:30 AM</p>
            </Card>
            <Card className="absolute -top-6 -right-6 w-44 hidden sm:block">
              <p className="text-xs text-muted">Vaccination</p>
              <p className="font-semibold text-forest text-sm">Due in 5 days</p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* PROMOTIONAL BANNER CAROUSEL (admin-managed) */}
      {heroBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
          <HeroBannerCarousel banners={heroBanners} />
        </section>
      )}

      {/* SHOP FOR YOUR PET */}
      <section className="max-w-7xl mx-auto px-6 pt-16">
        <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-2xl font-extrabold text-forest mb-6">
          Shop for your pet
        </motion.h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {petTypes.map((p, i) => (
            <motion.div key={p.label} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.05 }}>
              <Link to={p.to} className="flex flex-col items-center gap-2 group">
                <div
                  className="w-full aspect-square rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: p.bg }}
                >
                  <p.icon className="text-forest" size={32} />
                </div>
                <span className="text-sm font-medium text-forest">{p.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SPECIAL OFFERS (admin-managed promo banners) */}
      {promoBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-forest">Special Offers</h2>
            <Link to="/products" className="text-emerald font-medium text-sm">Shop Now →</Link>
          </div>
          <PromoBannerGrid banners={promoBanners} />
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-forest">Featured Products</h2>
            <Link to="/products" className="text-emerald font-medium text-sm">View all products →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <motion.div key={p._id} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.05 }}>
                <Card>
                  <Link to={`/products/${p._id}`}>
                    <div className="aspect-square bg-mint/40 rounded-xl mb-4 overflow-hidden flex items-center justify-center text-forest/40 text-sm">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        "No image"
                      )}
                    </div>
                    <p className="text-xs uppercase text-muted">{p.category.replace("_", " ")}</p>
                    <h3 className="font-semibold text-forest mt-1 hover:text-emerald transition-colors">{p.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 text-golden text-sm mt-1">
                    <Star size={14} fill="currentColor" /> {p.ratingAverage?.toFixed(1) || "New"}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="font-bold text-forest">Rs {p.price.toLocaleString()}</p>
                    <Button variant="ghost" onClick={() => addToCart(p._id)} className="!px-3 !py-2">
                      <ShoppingCart size={18} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 pt-16">
        <div className="bg-white rounded-2xl shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-emerald">{s.value}</p>
              <p className="text-sm text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-forest">Everything your pet needs, in one place</h2>
          <p className="text-muted mt-3">From health tracking to adoption, FurShield covers the full journey of pet care.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full">
                <div className="w-12 h-12 rounded-xl bg-mint flex items-center justify-center mb-4">
                  <s.icon className="text-forest" />
                </div>
                <h3 className="font-semibold text-lg text-forest">{s.title}</h3>
                <p className="text-muted text-sm mt-2">{s.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-forest">Real pets, real care</h2>
          <p className="text-muted mt-3">A glimpse of the moments FurShield helps make possible.</p>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-6">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.caption}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl overflow-hidden aspect-[4/5] group"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 text-cream font-semibold">{img.caption}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-forest rounded-3xl text-center px-8 py-16 text-cream"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold">Give Your Pet the Care They Deserve.</h2>
          <p className="mt-4 text-mint/80 max-w-xl mx-auto">
            Join thousands of pet owners, veterinarians and shelters already using FurShield.
          </p>
          <Link to="/register">
            <Button variant="secondary" className="mt-8">Get Started Free</Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
