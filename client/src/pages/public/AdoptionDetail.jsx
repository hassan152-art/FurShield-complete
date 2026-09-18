import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PlayCircle } from "lucide-react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import PhoneInput from "../../components/common/PhoneInput.jsx";

export default function AdoptionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [form, setForm] = useState({ contact: "", address: "", reason: "", livingEnvironment: "", previousExperience: "", preferredContactMethod: "phone" });

  useEffect(() => {
    api.get(`/adoptions/${id}`).then(({ data }) => setListing(data.data.listing)).finally(() => setLoading(false));
  }, [id]);

  const submitInterest = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "owner") {
      toast.error("Log in as a pet owner to express interest.");
      return;
    }
    if (form.contact.length !== 11) {
      toast.error("Contact number must be exactly 11 digits.");
      return;
    }
    try {
      await api.post(`/adoptions/${id}/interest`, form);
      toast.success("Adoption interest submitted!");
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit interest");
    }
  };

  if (loading) return <Spinner label="Loading pet details..." />;
  if (!listing) return <div className="max-w-3xl mx-auto px-6 py-16">Listing not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="aspect-video bg-mint/40 rounded-2xl overflow-hidden flex items-center justify-center text-forest/40 relative">
        {showVideo && listing.videoUrl ? (
          <video src={listing.videoUrl} controls autoPlay className="w-full h-full object-cover bg-black" />
        ) : listing.images?.[0] ? (
          <img src={listing.images[0]} alt={listing.name} className="w-full h-full object-cover" />
        ) : (
          "No image"
        )}
        {listing.videoUrl && !showVideo && (
          <button
            onClick={() => setShowVideo(true)}
            className="absolute inset-0 flex items-center justify-center bg-forest/20 hover:bg-forest/30 transition-colors"
          >
            <span className="bg-white/90 rounded-full p-4 shadow-lg">
              <PlayCircle size={36} className="text-emerald" />
            </span>
          </button>
        )}
      </div>
      <h1 className="text-3xl font-extrabold text-forest mt-6">{listing.name}</h1>
      <p className="text-muted mt-1">{listing.breed} · {listing.age} yrs · {listing.gender} · {listing.location}</p>

      <Card className="mt-6">
        <h3 className="font-semibold text-forest mb-2">About {listing.name}</h3>
        <p className="text-sm text-muted">{listing.personality || "No description provided yet."}</p>
        <p className="text-sm text-muted mt-2">Health status: {listing.healthStatus || "Not specified"}</p>
        <p className="text-sm text-muted mt-2">Shelter: {listing.shelter?.shelterName}</p>
      </Card>

      {!showForm ? (
        <Button className="mt-6" onClick={() => setShowForm(true)}>I am interested in adopting</Button>
      ) : (
        <form onSubmit={submitInterest} className="mt-6 bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-forest">Adoption Interest Form</h3>
          <div>
            <PhoneInput
              required
              value={form.contact}
              onChange={(v) => setForm({ ...form, contact: v })}
              placeholder="Contact number (11 digits)"
              className="w-full border border-sand rounded-xl px-4 py-3"
            />
          </div>
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-sand rounded-xl px-4 py-3" />
          <textarea placeholder="Why do you want to adopt this pet?" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full border border-sand rounded-xl px-4 py-3" />
          <input placeholder="Living environment (house/apartment, yard, etc.)" value={form.livingEnvironment} onChange={(e) => setForm({ ...form, livingEnvironment: e.target.value })} className="w-full border border-sand rounded-xl px-4 py-3" />
          <input placeholder="Previous pet experience" value={form.previousExperience} onChange={(e) => setForm({ ...form, previousExperience: e.target.value })} className="w-full border border-sand rounded-xl px-4 py-3" />
          <Button type="submit">Submit Interest</Button>
        </form>
      )}
    </div>
  );
}
