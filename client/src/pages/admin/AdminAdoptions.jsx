import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Badge from "../../components/ui/Badge.jsx";

const statuses = ["available", "pending", "adopted"];
const toneFor = (s) => ({ available: "mint", pending: "golden", adopted: "coral" }[s] || "mint");

export default function AdminAdoptions() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/admin/adoptions").then(({ data }) => setListings(data.data.listings)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/adoptions/${id}/status`, { status });
      toast.success("Listing updated");
      load();
    } catch {
      toast.error("Unable to update listing");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest mb-6">Adoption Listings</h1>
      {loading ? <Spinner label="Loading adoption listings..." /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted border-b border-sand">
              <tr>
                <th className="px-4 py-3">Pet</th>
                <th className="px-4 py-3">Shelter</th>
                <th className="px-4 py-3">Species</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l._id} className="border-b border-sand/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-forest">{l.name}</td>
                  <td className="px-4 py-3 text-muted">{l.shelter?.shelterName}</td>
                  <td className="px-4 py-3 text-muted">{l.species}</td>
                  <td className="px-4 py-3"><Badge tone={toneFor(l.status)}>{l.status}</Badge></td>
                  <td className="px-4 py-3">
                    <select value={l.status} onChange={(e) => updateStatus(l._id, e.target.value)} className="border border-sand rounded-lg px-2 py-1 text-xs">
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No adoption listings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
