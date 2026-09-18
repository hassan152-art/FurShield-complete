import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CalendarPlus } from "lucide-react";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

const toneFor = (s) => ({ pending: "golden", confirmed: "mint", rescheduled: "golden", completed: "mint", cancelled: "coral" }[s] || "mint");

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/appointments").then(({ data }) => setAppointments(data.data.appointments)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const cancel = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await api.patch(`/appointments/${id}/status`, { status: "cancelled" });
      toast.success("Appointment cancelled");
      load();
    } catch {
      toast.error("Unable to cancel appointment");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-forest">My Appointments</h1>
        <Link to="/dashboard/appointments/book">
          <Button><CalendarPlus size={18} /> Book Appointment</Button>
        </Link>
      </div>

      {loading ? (
        <Spinner label="Loading your appointments..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No appointments yet"
          description="Book your first veterinary appointment."
          action={<Link to="/dashboard/appointments/book"><Button>Book Appointment</Button></Link>}
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <Card key={a._id} className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-semibold text-forest">{a.pet?.name} with Dr. {a.veterinarian?.name}</p>
                <p className="text-sm text-muted">{new Date(a.date).toLocaleDateString()} at {a.time}</p>
                {a.reason && <p className="text-sm text-muted mt-1">Reason: {a.reason}</p>}
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={toneFor(a.status)}>{a.status}</Badge>
                {["pending", "confirmed", "rescheduled"].includes(a.status) && (
                  <Button variant="ghost" className="text-coral !px-3 !py-1.5 text-xs" onClick={() => cancel(a._id)}>
                    Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
