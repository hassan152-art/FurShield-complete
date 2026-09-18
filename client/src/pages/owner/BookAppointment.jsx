import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CalendarPlus } from "lucide-react";
import { api } from "../../services/api.js";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

export default function BookAppointment() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ petId: "", veterinarianId: "", date: "", time: "", reason: "" });

  useEffect(() => {
    Promise.all([api.get("/pets"), api.get("/vets")])
      .then(([petsRes, vetsRes]) => {
        setPets(petsRes.data.data.pets);
        setVets(vetsRes.data.data.vets);
      })
      .catch(() => toast.error("Unable to load your pets or veterinarians"))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.petId || !form.veterinarianId || !form.date || !form.time) {
      toast.error("Please fill in pet, veterinarian, date and time.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/appointments", form);
      toast.success("Appointment requested successfully.");
      navigate("/dashboard/appointments");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to book this appointment. Please try another time.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner label="Loading booking options..." />;

  if (pets.length === 0) {
    return (
      <EmptyState
        title="Add a pet first"
        description="You need at least one pet profile before booking an appointment."
        action={<Button onClick={() => navigate("/dashboard/pets")}>Add a Pet</Button>}
      />
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <CalendarPlus className="text-emerald" />
        <h1 className="text-2xl font-extrabold text-forest">Book an Appointment</h1>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium text-ink">Pet</label>
          <select
            value={form.petId}
            onChange={(e) => setForm({ ...form, petId: e.target.value })}
            className="mt-1 w-full border border-sand rounded-xl px-4 py-3"
          >
            <option value="">Select a pet</option>
            {pets.map((p) => (
              <option key={p._id} value={p._id}>{p.name} ({p.species})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Veterinarian</label>
          <select
            value={form.veterinarianId}
            onChange={(e) => setForm({ ...form, veterinarianId: e.target.value })}
            className="mt-1 w-full border border-sand rounded-xl px-4 py-3"
          >
            <option value="">Select a veterinarian</option>
            {vets.map((v) => (
              <option key={v._id} value={v._id}>{v.name} — {v.specialization || "General practice"}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink">Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full border border-sand rounded-xl px-4 py-3"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="mt-1 w-full border border-sand rounded-xl px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Reason for visit</label>
          <textarea
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="e.g. Annual checkup, skin allergy, vaccination"
            className="mt-1 w-full border border-sand rounded-xl px-4 py-3"
            rows={3}
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full justify-center">
          {submitting ? "Requesting..." : "Request Appointment"}
        </Button>
      </form>
    </div>
  );
}
