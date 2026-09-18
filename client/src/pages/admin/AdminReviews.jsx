import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Star } from "lucide-react";
import { api } from "../../services/api.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/admin/reviews").then(({ data }) => setReviews(data.data.reviews)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm("Remove this review?")) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      toast.success("Review removed");
      load();
    } catch {
      toast.error("Unable to remove review");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest mb-6">Reviews</h1>
      {loading ? <Spinner label="Loading reviews..." /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted border-b border-sand">
              <tr>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className="border-b border-sand/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-forest">{r.author?.name}</td>
                  <td className="px-4 py-3 text-muted capitalize">{r.targetType}</td>
                  <td className="px-4 py-3 flex items-center gap-1 text-golden"><Star size={14} fill="currentColor" /> {r.rating}</td>
                  <td className="px-4 py-3 text-muted max-w-xs truncate">{r.comment}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" className="!px-3 !py-1.5 text-coral" onClick={() => remove(r._id)}><Trash2 size={14} /></Button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No reviews yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
