import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, PawPrint, Bell, LayoutDashboard, LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../ui/Button.jsx";
import WaveDivider from "../common/WaveDivider.jsx";
import ScrollProgressBar from "../common/ScrollProgressBar.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/vets", label: "Find a Vet" },
  { to: "/adoption", label: "Adoption" },
  { to: "/products", label: "Products" },
  { to: "/care", label: "Care Guide" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const roleHome = { owner: "/dashboard", veterinarian: "/vet", shelter: "/shelter", admin: "/admin" };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToDashboard = () => navigate(roleHome[user?.role] || "/");

  return (
    <header className="sticky top-0 z-50">
      {/* Dark gradient bar, flowing from forest to emerald and back */}
      <div
        className={`bg-gradient-to-r from-forest via-emerald to-forest transition-shadow duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-cream">
            <PawPrint className="text-golden" /> FurShield
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? "text-golden" : "text-cream/85 hover:text-golden"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                {user.role === "owner" && (
                  <Link to="/dashboard/cart" className="p-2 rounded-full hover:bg-white/10" aria-label="Cart">
                    <ShoppingCart size={20} className="text-cream" />
                  </Link>
                )}
                <Link to="/notifications" className="p-2 rounded-full hover:bg-white/10" aria-label="Notifications">
                  <Bell size={20} className="text-cream" />
                </Link>
                <button
                  onClick={goToDashboard}
                  className="flex items-center gap-2 text-sm font-semibold text-cream px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </button>
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="flex items-center gap-2 text-sm font-semibold text-cream/90 border border-cream/40 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-semibold text-cream px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  Login
                </button>
                <Button variant="secondary" onClick={() => navigate("/register")}>Get Started</Button>
              </>
            )}
          </div>

          <button className="lg:hidden text-cream" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden px-6 pb-6 flex flex-col gap-4"
          >
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-cream/90 font-medium">
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <button
                  onClick={() => { setOpen(false); goToDashboard(); }}
                  className="flex items-center gap-2 text-cream font-medium"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </button>
                {user.role === "owner" && (
                  <Link to="/dashboard/cart" onClick={() => setOpen(false)} className="text-cream/90 font-medium flex items-center gap-2">
                    <ShoppingCart size={18} /> Cart
                  </Link>
                )}
                <Link to="/notifications" onClick={() => setOpen(false)} className="text-cream/90 font-medium flex items-center gap-2">
                  <Bell size={18} /> Notifications
                </Link>
                <button
                  onClick={() => { logout(); setOpen(false); navigate("/"); }}
                  className="flex items-center gap-2 text-cream/90 font-medium border border-cream/40 rounded-full px-4 py-2 w-fit"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => { setOpen(false); navigate("/login"); }}
                  className="text-cream font-medium border border-cream/40 rounded-full px-4 py-2"
                >
                  Login
                </button>
                <Button variant="secondary" onClick={() => { setOpen(false); navigate("/register"); }}>Get Started</Button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Flowing wave underline, mint-to-golden, echoing the "go with the flow" motif */}
      <WaveDivider fill="#BFE8D5" className="h-2.5 -mb-px" />

      {/* Scroll progress: fills as the person scrolls down the current page */}
      <ScrollProgressBar />
    </header>
  );
}
