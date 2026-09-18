import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, PawPrint, Stethoscope, Home, CalendarDays, HeartHandshake, ShoppingBag, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

const meta = {
  totalUsers: { label: "Total Users", link: "/admin/users", icon: Users, bg: "bg-mint" },
  totalPets: { label: "Total Pets", link: "/admin/pets", icon: PawPrint, bg: "bg-golden/30" },
  vets: { label: "Veterinarians", link: "/admin/users?role=veterinarian", icon: Stethoscope, bg: "bg-mint" },
  shelters: { label: "Shelters", link: "/admin/users?role=shelter", icon: Home, bg: "bg-coral/15" },
  appointments: { label: "Appointments", link: "/admin/appointments", icon: CalendarDays, bg: "bg-mint" },
  adoptions: { label: "Adoptions", link: "/admin/adoptions", icon: HeartHandshake, bg: "bg-coral/15" },
  products: { label: "Products", link: "/admin/products", icon: ShoppingBag, bg: "bg-golden/30" },
  orders: { label: "Orders", link: "/admin/orders", icon: Package, bg: "bg-mint" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/analytics").then(({ data }) => setStats(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading analytics..." />;

  const chartData = Object.entries(stats || {}).map(([key, value]) => ({
    name: (meta[key]?.label || key).replace(/^Total /, ""),
    value,
  }));
  const barColors = ["#2E7D65", "#F5C96A", "#173F35", "#FF8066", "#2E7D65", "#FF8066", "#F5C96A", "#2E7D65"];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest mb-6">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-4 gap-6">
        {Object.entries(stats || {}).map(([key, value]) => {
          const m = meta[key] || { label: key, link: "/admin", icon: Package, bg: "bg-mint" };
          return (
            <Link key={key} to={m.link}>
              <Card className="hover:ring-2 hover:ring-emerald/40 transition-shadow cursor-pointer flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}>
                  <m.icon className="text-forest" size={20} />
                </div>
                <div>
                  <p className="text-muted text-sm">{m.label}</p>
                  <p className="text-2xl font-extrabold text-forest">{value}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="mt-6">
        <h2 className="font-semibold text-forest text-lg mb-2">Platform Overview</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4EBDD" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7771" }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6B7771" }} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
