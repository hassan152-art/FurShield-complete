import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { PawPrint, Mail, Send } from "lucide-react";
import { api } from "../../services/api.js";
import Button from "../ui/Button.jsx";

export default function Footer() {
  const [petType, setPetType] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await api.post("/contact", {
        name: "Newsletter Subscriber",
        email,
        subject: "Newsletter signup",
        message: `Pet type: ${petType || "Not specified"}`,
      });
      toast.success("You're subscribed! Keep an eye on your inbox.");
      setEmail("");
      setPetType("");
    } catch {
      toast.error("Unable to subscribe right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="mt-24">
      {/* Newsletter strip */}
      <div className="bg-emerald">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative w-24 h-24 rounded-full bg-golden flex flex-col items-center justify-center text-forest text-center shrink-0">
              <span className="text-2xl font-extrabold leading-none">12k+</span>
              <span className="text-[10px] font-semibold leading-tight px-2">pets cared for</span>
              <div className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-forest border-2 border-cream flex items-center justify-center">
                <PawPrint size={14} className="text-golden" />
              </div>
            </div>
            <p className="text-cream font-bold text-lg sm:text-xl max-w-xs">
              Don't miss vaccination reminders, adoption alerts and pet-care tips!
            </p>
          </div>

          <form onSubmit={subscribe} className="flex flex-1 flex-wrap gap-3 w-full">
            <select
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              className="rounded-full px-4 py-3 text-sm text-ink bg-white border-2 border-forest/20 flex-1 min-w-[160px]"
            >
              <option value="">Please select pet type</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="rounded-full px-4 py-3 text-sm text-ink bg-white border-2 border-forest/20 flex-[2] min-w-[200px]"
            />
            <Button type="submit" disabled={submitting} variant="secondary" className="!rounded-full">
              {submitting ? "..." : <>Subscribe <Send size={14} /></>}
            </Button>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="bg-forest text-cream">
        <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-extrabold text-xl mb-3">
              <PawPrint className="text-golden" /> FurShield
            </div>
            <p className="text-mint/80 text-sm">Every Paw/Wing Deserves a Shield of Love.</p>
            <p className="text-mint/60 text-xs mt-4 flex items-center gap-1.5">
              <Mail size={12} /> support@furshield.com
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-mint/80">
              <li><Link to="/dashboard">My Dashboard</Link></li>
              <li><Link to="/dashboard/appointments/book">Book Appointment</Link></li>
              <li><Link to="/vets">Find a Vet</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-mint/80">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/care">Care Guide</Link></li>
              <li><Link to="/adoption">Adoption</Link></li>
              <li><Link to="/register">Become a Shelter Partner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Shopping</h4>
            <ul className="space-y-2 text-sm text-mint/80">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=health_supplies">Health Supplies</Link></li>
              <li><Link to="/adoption">Adoption Listings</Link></li>
            </ul>
            <p className="text-mint/60 text-xs mt-4">
              Payment and physical delivery are outside this application's scope — orders are requests only.
            </p>
          </div>
        </div>
        <div className="border-t border-mint/20 text-center text-xs text-mint/60 py-4">
          © {new Date().getFullYear()} FurShield. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
