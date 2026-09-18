import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import toast from "react-hot-toast";

const speciesOptions = ["", "Dog", "Cat", "Bird", "Rabbit", "Other"];
const genderOptions = ["", "male", "female"];
const healthOptions = ["", "Healthy", "Vaccinated", "Under treatment", "Special needs"];

export default function Adoption() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const species = searchParams.get("species") || "";
  const breed = searchParams.get("breed") || "";
  const gender = searchParams.get("gender") || "";
  const location = searchParams.get("location") || "";
  const healthStatus = searchParams.get("healthStatus") || "";

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const activeCount = [species, breed, gender, location, healthStatus].filter(Boolean).length;

  useEffect(() => {
    setLoading(true);
    api.get("/adoptions", { params: { species: species || undefined, breed: breed || undefined, gender: gender || undefined, location: location || undefined, healthStatus: healthStatus || undefined } })
      .then(({ data }) => setListings(data.data.listings))
      .catch(() => toast.error("Unable to load adoption listings"))
      .finally(() => setLoading(false));
  }, [species, breed, gender, location, healthStatus]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-forest">Find Your Companion</h1>
      <p className="text-muted mt-2">Pets from verified shelters, ready for a loving home.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {speciesOptions.map((s) => (
          <button
            key={s}
            onClick={() => setParam("species", s)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              species === s ? "bg-emerald text-white border-emerald" : "border-sand text-muted"
            }`}
          >
            {s || "All Species"}
          </button>
        ))}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="px-4 py-2 rounded-full text-sm font-medium border border-sand text-forest flex items-center gap-1.5"
        >
          <SlidersHorizontal size={14} /> More filters {activeCount > 0 && `(${activeCount})`}
        </button>
        {activeCount > 0 && (
          <button onClick={clearFilters} className="px-4 py-2 rounded-full text-sm font-medium text-coral flex items-center gap-1">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-4 grid sm:grid-cols-4 gap-3 bg-white rounded-2xl p-4 shadow-sm">
          <input
            placeholder="Breed"
            value={breed}
            onChange={(e) => setParam("breed", e.target.value)}
            className="border border-sand rounded-xl px-4 py-2.5 text-sm"
          />
          <select value={gender} onChange={(e) => setParam("gender", e.target.value)} className="border border-sand rounded-xl px-4 py-2.5 text-sm">
            {genderOptions.map((g) => <option key={g} value={g}>{g ? g.charAt(0).toUpperCase() + g.slice(1) : "Any gender"}</option>)}
          </select>
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setParam("location", e.target.value)}
            className="border border-sand rounded-xl px-4 py-2.5 text-sm"
          />
          <select value={healthStatus} onChange={(e) => setParam("healthStatus", e.target.value)} className="border border-sand rounded-xl px-4 py-2.5 text-sm">
            {healthOptions.map((h) => <option key={h} value={h}>{h || "Any health status"}</option>)}
          </select>
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <Spinner label="Loading adoptable pets..." />
        ) : listings.length === 0 ? (
          <EmptyState
            title="No pets match these filters"
            description="Try widening your search or check back soon — new pets are added regularly."
            action={activeCount > 0 ? <Button variant="outline" onClick={clearFilters}>Clear Filters</Button> : undefined}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <Link to={`/adoption/${l._id}`} key={l._id}>
                <Card className="h-full">
                  <div className="aspect-video bg-mint/40 rounded-xl mb-4 flex items-center justify-center text-forest/40 text-sm overflow-hidden">
                    {l.images?.[0] ? (
                      <img src={l.images[0]} alt={l.name} className="w-full h-full object-cover" />
                    ) : (
                      "No image"
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-forest text-lg">{l.name}</h3>
                    <Badge tone="mint">{l.healthStatus || "Healthy"}</Badge>
                  </div>
                  <p className="text-muted text-sm mt-1">{l.breed} · {l.age} yrs · {l.gender}</p>
                  <p className="text-muted text-sm mt-1">{l.location}</p>
                  <p className="text-xs text-muted mt-3">via {l.shelter?.shelterName || "FurShield Shelter Partner"}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
