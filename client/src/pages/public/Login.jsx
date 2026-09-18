import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button.jsx";
import PawStepsLoader from "../../components/common/PawStepsLoader.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success("Welcome back!");
      const roleHome = { owner: "/dashboard", veterinarian: "/vet", shelter: "/shelter", admin: "/admin" };
      navigate(roleHome[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-sand/40 px-6 py-16">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-forest">Welcome back</h1>
        <p className="text-muted text-sm mt-1">Log in to your FurShield account.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink">Email</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Password</label>
            <input
              type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-coral text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full justify-center">
            {loading ? <PawStepsLoader size="sm" color="#FFF9F0" /> : "Log In"}
          </Button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <Link to="/forgot-password" className="text-emerald font-medium">Forgot password?</Link>
          <Link to="/register" className="text-emerald font-medium">Create an account</Link>
        </div>

        <div className="mt-8 border-t pt-6 text-xs text-muted">
          <p className="font-semibold mb-1">Demo accounts (after seeding):</p>
          <p>owner@furshield.com · vet@furshield.com · shelter@furshield.com · admin@furshield.com</p>
        </div>
      </div>
    </div>
  );
}
