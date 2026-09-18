import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import toast from "react-hot-toast";

export default function Vets() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/vets", { params: { q: q || undefined } })
      .then(({ data }) => setVets(data.data.vets))
      .catch(() => toast.error("Unable to load veterinarians"))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-forest">Find a Veterinarian</h1>
      <p className="text-muted mt-2">Browse trusted vets and book an appointment for your pet.</p>

      <input
        value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name..."
        className="mt-8 border border-sand rounded-xl px-4 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-emerald"
      />

      <div className="mt-8">
        {loading ? (
          <Spinner label="Loading veterinarians..." />
        ) : vets.length === 0 ? (
          <EmptyState title="No veterinarians found" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vets.map((v) => (
              <Link to={`/vets/${v._id}`} key={v._id}>
                <Card className="h-full">
                  <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center text-forest font-bold text-xl mb-4">
                    {v.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-forest">{v.name}</h3>
                  <p className="text-sm text-muted mt-1">{v.specialization || "General practice"}</p>
                  <p className="text-sm text-muted">{v.experienceYears || 0} years experience</p>
                  <p className="text-xs text-muted mt-2">{v.address}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
