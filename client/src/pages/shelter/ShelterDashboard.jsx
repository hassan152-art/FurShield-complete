import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PawPrint, Home, CheckCircle2, Plus, Pencil, Trash2, ImageOff, PlayCircle, ClipboardList } from "lucide-react";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import ImageUploadInput from "../../components/common/ImageUploadInput.jsx";
import VideoUploadInput from "../../components/common/VideoUploadInput.jsx";
import StatusPieChart from "../../components/charts/StatusPieChart.jsx";

const toneFor = (s) => ({ available: "mint", pending: "golden", adopted: "coral" }[s] || "mint");
const statuses = ["available", "pending", "adopted"];

const emptyForm = {
  name: "", species: "Dog", breed: "", age: "", gender: "male",
  location: "", healthStatus: "Healthy", personality: "", imageUrl: "", videoUrl: "",
};

const careLogTypes = ["feeding", "grooming", "exercise", "medication", "medical", "note"];
const emptyCareLog = { type: "feeding", notes: "" };

export default function ShelterDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [careLogListingId, setCareLogListingId] = useState(null);
  const [careLogs, setCareLogs] = useState([]);
  const [careLogForm, setCareLogForm] = useState(emptyCareLog);

  const load = () => {
    setLoading(true);
    api.get("/shelter/listings").then(({ data }) => setListings(data.data.listings)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (l) => {
    setForm({ ...emptyForm, ...l, imageUrl: l.images?.[0] || "", videoUrl: l.videoUrl || "" });
    setEditingId(l._id);
    setShowForm(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name, species: form.species, breed: form.breed,
      age: Number(form.age) || undefined, gender: form.gender, location: form.location,
      healthStatus: form.healthStatus, personality: form.personality,
      images: form.imageUrl ? [form.imageUrl] : [],
      videoUrl: form.videoUrl || undefined,
    };
    try {
      if (editingId) {
        await api.put(`/adoptions/${editingId}`, payload);
        toast.success("Listing updated");
      } else {
        await api.post("/adoptions", payload);
        toast.success("Adoption listing added successfully");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save this listing");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Remove this listing? This cannot be undone.")) return;
    try {
      await api.delete(`/adoptions/${id}`);
      toast.success("Listing removed");
      load();
    } catch {
      toast.error("Unable to remove listing");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/adoptions/${id}`, { status });
      toast.success("Status updated");
      load();
    } catch {
      toast.error("Unable to update status");
    }
  };

  const openCareLogs = async (listingId) => {
    if (careLogListingId === listingId) { setCareLogListingId(null); return; }
    setCareLogListingId(listingId);
    setCareLogForm(emptyCareLog);
    try {
      const { data } = await api.get(`/shelter/listings/${listingId}/care-logs`);
      setCareLogs(data.data.logs);
    } catch {
      toast.error("Unable to load care logs");
    }
  };

  const submitCareLog = async (e, listingId) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/shelter/listings/${listingId}/care-logs`, careLogForm);
      setCareLogs((prev) => [data.data.log, ...prev]);
      setCareLogForm(emptyCareLog);
      toast.success("Care log added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to add care log");
    }
  };

  if (loading) return <Spinner label="Loading your listings..." />;

  const available = listings.filter((l) => l.status === "available").length;
  const adopted = listings.filter((l) => l.status === "adopted").length;

  const stats = [
    { label: "Total Listings", value: listings.length, icon: Home, bg: "bg-mint" },
    { label: "Available", value: available, icon: PawPrint, bg: "bg-golden/30" },
    { label: "Adopted", value: adopted, icon: CheckCircle2, bg: "bg-coral/15" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-forest">Shelter Dashboard</h1>
        <Button onClick={openNew}><Plus size={18} /> Add Adoption Pet</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className="text-forest" size={20} />
            </div>
            <div>
              <p className="text-muted text-sm">{s.label}</p>
              <p className="text-2xl font-extrabold text-forest">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {listings.length > 0 && (
        <Card>
          <h2 className="font-semibold text-forest text-lg mb-2">Listing Status Overview</h2>
          <StatusPieChart
            counts={{
              available,
              pending: listings.filter((l) => l.status === "pending").length,
              adopted,
            }}
          />
        </Card>
      )}

      {showForm && (
        <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-sm grid sm:grid-cols-2 gap-4">
          <h3 className="font-semibold text-forest sm:col-span-2">{editingId ? "Edit Listing" : "Add a Pet for Adoption"}</h3>
          <input required placeholder="Pet name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} className="border border-sand rounded-xl px-4 py-3">
            {["Dog", "Cat", "Bird", "Rabbit", "Other"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input placeholder="Breed" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <input type="number" placeholder="Age (years)" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="border border-sand rounded-xl px-4 py-3">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input placeholder="Location (e.g. Karachi)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <select value={form.healthStatus} onChange={(e) => setForm({ ...form, healthStatus: e.target.value })} className="border border-sand rounded-xl px-4 py-3">
            {["Healthy", "Vaccinated", "Under treatment", "Special needs"].map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
          <textarea placeholder="Personality / description" value={form.personality} onChange={(e) => setForm({ ...form, personality: e.target.value })} className="border border-sand rounded-xl px-4 py-3 sm:col-span-2" />

          <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4">
            <ImageUploadInput value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
            <VideoUploadInput value={form.videoUrl} onChange={(url) => setForm({ ...form, videoUrl: url })} />
          </div>

          <div className="sm:col-span-2 flex gap-3">
            <Button type="submit">{editingId ? "Save Changes" : "Add Listing"}</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div>
        <h2 className="font-semibold text-forest text-lg mb-4">My Listings</h2>
        {listings.length === 0 ? (
          <Card>No adoption listings yet. Click "Add Adoption Pet" to create your first one.</Card>
        ) : (
          <div className="grid sm:grid-cols-3 gap-6">
            {listings.map((l) => (
              <Card key={l._id} className="overflow-hidden !p-0">
                <div className="aspect-video bg-mint/40 flex items-center justify-center text-forest/40 relative">
                  {l.images?.[0] ? (
                    <img src={l.images[0]} alt={l.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff size={28} />
                  )}
                  {l.videoUrl && (
                    <span className="absolute bottom-2 right-2 bg-white/90 rounded-full p-1" title="Video available">
                      <PlayCircle size={16} className="text-emerald" />
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-forest">{l.name}</p>
                    <Badge tone={toneFor(l.status)}>{l.status}</Badge>
                  </div>
                  <p className="text-sm text-muted mt-1">{l.species} · {l.breed}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l._id, e.target.value)}
                      className="border border-sand rounded-lg px-2 py-1.5 text-xs flex-1"
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Button variant="ghost" className="!px-2.5 !py-1.5" onClick={() => openEdit(l)}><Pencil size={14} /></Button>
                    <Button variant="ghost" className="!px-2.5 !py-1.5 text-coral" onClick={() => onDelete(l._id)}><Trash2 size={14} /></Button>
                  </div>
                  <Button
                    variant="outline"
                    className="!px-3 !py-1.5 text-xs w-full mt-2 justify-center"
                    onClick={() => openCareLogs(l._id)}
                  >
                    <ClipboardList size={14} /> {careLogListingId === l._id ? "Hide Care Logs" : "Care Logs"}
                  </Button>

                  {careLogListingId === l._id && (
                    <div className="mt-3 pt-3 border-t border-sand">
                      <form onSubmit={(e) => submitCareLog(e, l._id)} className="flex flex-col gap-2 mb-3">
                        <select
                          value={careLogForm.type}
                          onChange={(e) => setCareLogForm({ ...careLogForm, type: e.target.value })}
                          className="border border-sand rounded-lg px-2 py-1.5 text-xs"
                        >
                          {careLogTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <textarea
                          placeholder="Notes (e.g. fed 2 cups kibble, groomed coat)"
                          value={careLogForm.notes}
                          onChange={(e) => setCareLogForm({ ...careLogForm, notes: e.target.value })}
                          className="border border-sand rounded-lg px-2 py-1.5 text-xs"
                          rows={2}
                        />
                        <Button type="submit" className="!px-3 !py-1.5 text-xs">Add Log</Button>
                      </form>
                      {careLogs.length === 0 ? (
                        <p className="text-xs text-muted">No care logs yet for this pet.</p>
                      ) : (
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {careLogs.map((log) => (
                            <div key={log._id} className="text-xs bg-sand/40 rounded-lg px-2.5 py-2">
                              <span className="font-semibold text-forest capitalize">{log.type}</span>
                              <span className="text-muted"> — {new Date(log.createdAt).toLocaleDateString()}</span>
                              {log.notes && <p className="text-muted mt-0.5">{log.notes}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
