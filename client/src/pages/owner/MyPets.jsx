import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil, HeartPulse } from "lucide-react";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ImageUploadInput from "../../components/common/ImageUploadInput.jsx";

const emptyForm = { name: "", species: "", breed: "", age: "", gender: "unknown", weight: "", color: "", imageUrl: "" };

export default function MyPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    api.get("/pets").then(({ data }) => setPets(data.data.pets)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (pet) => { setForm({ ...emptyForm, ...pet, imageUrl: pet.images?.[0] || "" }); setEditingId(pet._id); setShowForm(true); };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, images: form.imageUrl ? [form.imageUrl] : [] };
    delete payload.imageUrl;
    try {
      if (editingId) {
        await api.put(`/pets/${editingId}`, payload);
        toast.success("Pet profile updated successfully.");
      } else {
        await api.post("/pets", payload);
        toast.success("Pet added successfully.");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save your pet. Please try again.");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Remove this pet profile? This cannot be undone.")) return;
    try {
      await api.delete(`/pets/${id}`);
      toast.success("Pet removed successfully.");
      load();
    } catch (err) {
      toast.error("Unable to remove pet.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-forest">My Pets</h1>
        <Button onClick={openNew}><Plus size={18} /> Add Pet</Button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-8 grid sm:grid-cols-2 gap-4">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <input required placeholder="Species (e.g. Dog)" value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <input placeholder="Breed" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="border border-sand rounded-xl px-4 py-3">
            <option value="unknown">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="number" placeholder="Weight (kg)" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <div className="sm:col-span-2">
            <ImageUploadInput value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} label="Pet photo" />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <Button type="submit">{editingId ? "Save Changes" : "Add Pet"}</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <Spinner label="Loading your pets..." />
      ) : pets.length === 0 ? (
        <EmptyState title="No pets yet" description="Add your first pet to start tracking their care." action={<Button onClick={openNew}>Add Pet</Button>} />
      ) : (
        <div className="grid sm:grid-cols-3 gap-6">
          {pets.map((p) => (
            <Card key={p._id} className="overflow-hidden !p-0">
              <div className="aspect-video bg-mint/40 flex items-center justify-center overflow-hidden">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-forest/30">{p.name.charAt(0)}</span>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-forest text-lg">{p.name}</p>
                <p className="text-sm text-muted">{p.species} · {p.breed} · {p.age} yrs</p>
                <div className="flex gap-2 mt-4">
                  <Link to={`/dashboard/pets/${p._id}/health`}>
                    <Button variant="outline" className="!px-3 !py-2 text-xs"><HeartPulse size={14} /> Health</Button>
                  </Link>
                  <Button variant="ghost" className="!px-3 !py-2" onClick={() => openEdit(p)}><Pencil size={16} /></Button>
                  <Button variant="ghost" className="!px-3 !py-2 text-coral" onClick={() => onDelete(p._id)}><Trash2 size={16} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
