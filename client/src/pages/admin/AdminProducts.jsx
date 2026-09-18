import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import { api } from "../../services/api.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import ImageUploadInput from "../../components/common/ImageUploadInput.jsx";

const categories = ["food", "grooming", "toys", "accessories", "health_supplies", "training_aids"];
const emptyForm = { name: "", category: "food", price: "", stock: "", description: "", imageUrl: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    api.get("/admin/products").then(({ data }) => setProducts(data.data.products)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...emptyForm, ...p, imageUrl: p.images?.[0] || "" }); setEditingId(p._id); setShowForm(true); };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form, price: Number(form.price), stock: Number(form.stock),
        images: form.imageUrl ? [form.imageUrl] : [],
      };
      delete payload.imageUrl;
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/admin/products", payload);
        toast.success("Product created");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save product");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success("Product deleted");
      load();
    } catch {
      toast.error("Unable to delete product");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-forest">Products</h1>
        <Button onClick={openNew}><Plus size={18} /> Add Product</Button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-8 grid sm:grid-cols-2 gap-4">
          <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-sand rounded-xl px-4 py-3">
            {categories.map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
          </select>
          <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <input required type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-sand rounded-xl px-4 py-3 sm:col-span-2" />
          <div className="sm:col-span-2">
            <ImageUploadInput value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} label="Product photo" />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <Button type="submit">{editingId ? "Save Changes" : "Create Product"}</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? <Spinner label="Loading products..." /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted border-b border-sand">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-sand/60 last:border-0">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg bg-mint/40 overflow-hidden flex items-center justify-center">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageOff size={16} className="text-forest/40" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-forest">{p.name}</td>
                  <td className="px-4 py-3 capitalize text-muted">{p.category.replace("_", " ")}</td>
                  <td className="px-4 py-3">Rs {p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => openEdit(p)}><Pencil size={14} /></Button>
                    <Button variant="ghost" className="!px-3 !py-1.5 text-coral" onClick={() => onDelete(p._id)}><Trash2 size={14} /></Button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
