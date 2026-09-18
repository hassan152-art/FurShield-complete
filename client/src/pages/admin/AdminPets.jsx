import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ImageOff } from "lucide-react";
import { api } from "../../services/api.js";
import Spinner from "../../components/ui/Spinner.jsx";

export default function AdminPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/pets")
      .then(({ data }) => setPets(data.data.pets))
      .catch(() => toast.error("Unable to load pets"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest mb-6">Pets</h1>
      {loading ? <Spinner label="Loading pets..." /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted border-b border-sand">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Species</th>
                <th className="px-4 py-3">Breed</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Added</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((p) => (
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
                  <td className="px-4 py-3 text-muted">{p.species}</td>
                  <td className="px-4 py-3 text-muted">{p.breed}</td>
                  <td className="px-4 py-3 text-muted">{p.owner?.name}</td>
                  <td className="px-4 py-3 text-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {pets.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No pets yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
