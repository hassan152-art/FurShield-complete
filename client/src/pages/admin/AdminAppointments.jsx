import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Badge from "../../components/ui/Badge.jsx";

const toneFor = (s) => ({ pending: "golden", confirmed: "mint", rescheduled: "golden", completed: "mint", cancelled: "coral" }[s] || "mint");

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/appointments")
      .then(({ data }) => setAppointments(data.data.appointments))
      .catch(() => toast.error("Unable to load appointments"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest mb-6">Appointments</h1>
      {loading ? <Spinner label="Loading appointments..." /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted border-b border-sand">
              <tr>
                <th className="px-4 py-3">Pet</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Veterinarian</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="border-b border-sand/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-forest">{a.pet?.name} <span className="text-muted">({a.pet?.species})</span></td>
                  <td className="px-4 py-3 text-muted">{a.owner?.name}</td>
                  <td className="px-4 py-3 text-muted">{a.veterinarian?.name}</td>
                  <td className="px-4 py-3 text-muted">{new Date(a.date).toLocaleDateString()} · {a.time}</td>
                  <td className="px-4 py-3"><Badge tone={toneFor(a.status)}>{a.status}</Badge></td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No appointments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
