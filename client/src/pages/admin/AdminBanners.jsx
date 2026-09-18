import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { api } from "../../services/api.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import ImageUploadInput from "../../components/common/ImageUploadInput.jsx";

const types = ["hero", "promo", "utility"];
const emptyForm = {
  title: "", subtitle: "", imageUrl: "", linkUrl: "", linkLabel: "Learn more",
  type: "promo", backgroundColor: "#BFE8D5", order: 0, isActive: true,
};

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    api.get("/admin/banners").then(({ data }) => setBanners(data.data.banners)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (b) => { setForm(b); setEditingId(b._id); setShowForm(true); };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editingId) {
        await api.put(`/admin/banners/${editingId}`, payload);
        toast.success("Banner updated");
      } else {
        await api.post("/admin/banners", payload);
        toast.success("Banner created");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save banner");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await api.delete(`/admin/banners/${id}`);
      toast.success("Banner deleted");
      load();
    } catch {
      toast.error("Unable to delete banner");
    }
  };

  const toggleActive = async (b) => {
    try {
      await api.put(`/admin/banners/${b._id}`, { isActive: !b.isActive });
      load();
    } catch {
      toast.error("Unable to update banner");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-forest">Banners</h1>
        <Button onClick={openNew}><Plus size={18} /> Add Banner</Button>
      </div>
      <p className="text-muted text-sm mb-6">
        Hero banners appear as the rotating carousel on the homepage. Promo banners appear in the "Special Offers" grid.
      </p>

      {showForm && (
        <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-8 grid sm:grid-cols-2 gap-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-sand rounded-xl px-4 py-3 sm:col-span-2" />
          <input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="border border-sand rounded-xl px-4 py-3 sm:col-span-2" />
          <input required placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="border border-sand rounded-xl px-4 py-3 sm:col-span-2" />
          <div className="sm:col-span-2">
            <ImageUploadInput value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} label="Or upload an image from your device" />
          </div>
          <input placeholder="Link URL (e.g. /products)" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <input placeholder="Link label (e.g. Shop Now)" value={form.linkLabel} onChange={(e) => setForm({ ...form, linkLabel: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border border-sand rounded-xl px-4 py-3">
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input type="color" value={form.backgroundColor} onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })} className="w-12 h-12 border border-sand rounded-xl" />
            <input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="border border-sand rounded-xl px-4 py-3 flex-1" />
          </div>
          <label className="flex items-center gap-2 sm:col-span-2 text-sm text-ink">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active (visible on the site)
          </label>
          <div className="sm:col-span-2 flex gap-3">
            <Button type="submit">{editingId ? "Save Changes" : "Create Banner"}</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <Spinner label="Loading banners..." />
      ) : banners.length === 0 ? (
        <div className="bg-sand/50 rounded-2xl p-10 text-center text-muted">No banners yet. Add one to feature it on the homepage.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-32 relative" style={{ backgroundColor: b.backgroundColor }}>
                {b.imageUrl ? (
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-forest/40"><ImageIcon /></div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge tone="mint">{b.type}</Badge>
                  {!b.isActive && <Badge tone="coral">Hidden</Badge>}
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-forest">{b.title}</p>
                {b.subtitle && <p className="text-sm text-muted mt-1 line-clamp-2">{b.subtitle}</p>}
                <div className="flex gap-2 mt-4">
                  <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => toggleActive(b)}>
                    {b.isActive ? "Hide" : "Show"}
                  </Button>
                  <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => openEdit(b)}><Pencil size={14} /></Button>
                  <Button variant="ghost" className="!px-3 !py-1.5 text-coral" onClick={() => onDelete(b._id)}><Trash2 size={14} /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
