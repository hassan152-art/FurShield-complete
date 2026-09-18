import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button.jsx";
import PawStepsLoader from "../../components/common/PawStepsLoader.jsx";
import PhoneInput from "../../components/common/PhoneInput.jsx";

const roles = [
  { value: "owner", label: "Pet Owner" },
  { value: "veterinarian", label: "Veterinarian" },
  { value: "shelter", label: "Shelter" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("owner");
  const [form, setForm] = useState({
    name: "", email: "", password: "", contactNumber: "", address: "",
    specialization: "", experienceYears: "", shelterName: "", contactPerson: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register({ role, ...form });
      toast.success("Account created!");
      const roleHome = { owner: "/dashboard", veterinarian: "/vet", shelter: "/shelter" };
      navigate(roleHome[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-sand/40 px-6 py-16">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg">
        <h1 className="text-2xl font-extrabold text-forest">Join FurShield</h1>
        <p className="text-muted text-sm mt-1">Create your account to get started.</p>

        <div className="mt-6 flex gap-2">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                role === r.value ? "bg-emerald text-white border-emerald" : "border-sand text-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink">
              {role === "shelter" ? "Shelter name" : "Full name"}
            </label>
            <input
              required value={form.name} onChange={update("name")}
              className="mt-1 w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald"
            />
          </div>

          {role === "shelter" && (
            <div>
              <label className="text-sm font-medium text-ink">Contact person</label>
              <input
                value={form.contactPerson} onChange={update("contactPerson")}
                className="mt-1 w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald"
              />
            </div>
          )}

          {role === "veterinarian" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-ink">Specialization</label>
                <input
                  value={form.specialization} onChange={update("specialization")}
                  placeholder="e.g. dermatology"
                  className="mt-1 w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink">Experience (years)</label>
                <input
                  type="number" value={form.experienceYears} onChange={update("experienceYears")}
                  className="mt-1 w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-ink">Email</label>
              <input
                type="email" required value={form.email} onChange={update("email")}
                className="mt-1 w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Contact number</label>
              <PhoneInput
                value={form.contactNumber}
                onChange={(v) => setForm({ ...form, contactNumber: v })}
                className="mt-1 w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald"
              />
              <p className="text-xs text-muted mt-1">11 digits, numbers only</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Address</label>
            <input
              value={form.address} onChange={update("address")}
              className="mt-1 w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Password</label>
            <input
              type="password" required minLength={8} value={form.password} onChange={update("password")}
              className="mt-1 w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald"
            />
          </div>

          {error && <p className="text-coral text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full justify-center">
            {loading ? <PawStepsLoader size="sm" color="#FFF9F0" /> : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-muted">
          Already have an account? <Link to="/login" className="text-emerald font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
