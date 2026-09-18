import { Link, Outlet, useNavigate } from "react-router-dom";
import { PawPrint, LogOut, ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardLayout({ links = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-sand/40">
      <aside className="w-64 bg-forest text-cream hidden md:flex flex-col p-6 gap-6">
        <div className="flex items-center gap-2 font-extrabold text-lg">
          <PawPrint className="text-golden" /> FurShield
        </div>
        <nav className="flex flex-col gap-2">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-3 py-2 rounded-lg hover:bg-emerald/40 text-sm font-medium">
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="mt-auto flex items-center gap-2 text-sm text-mint/80 hover:text-white"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-sand text-forest transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <p className="font-semibold text-forest">Welcome back, {user?.name?.split(" ")[0]}</p>
          </div>
        </header>
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
