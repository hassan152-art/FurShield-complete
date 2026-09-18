import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PawPrint, CalendarDays, CalendarPlus, Plus, BellRing } from "lucide-react";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import StatusPieChart from "../../components/charts/StatusPieChart.jsx";

const toneFor = (s) => ({ pending: "golden", confirmed: "mint", rescheduled: "golden", completed: "mint", cancelled: "coral" }[s] || "mint");

export default function DashboardHome() {
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/pets"), api.get("/appointments")])
      .then(([petsRes, apptRes]) => {
        setPets(petsRes.data.data.pets);
        setAppointments(apptRes.data.data.appointments);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading your dashboard..." />;

  const upcoming = appointments.filter((a) => ["pending", "confirmed", "rescheduled"].includes(a.status));

  return (
    <div className="space-y-8">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard/appointments/book">
          <Button><CalendarPlus size={18} /> Book Appointment</Button>
        </Link>
        <Link to="/dashboard/pets">
          <Button variant="outline"><Plus size={18} /> Add Pet</Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-mint flex items-center justify-center shrink-0">
            <PawPrint className="text-forest" />
          </div>
          <div>
            <p className="text-muted text-sm">My Pets</p>
            <p className="text-3xl font-extrabold text-forest">{pets.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-golden/30 flex items-center justify-center shrink-0">
            <CalendarDays className="text-forest" />
          </div>
          <div>
            <p className="text-muted text-sm">Total Appointments</p>
            <p className="text-3xl font-extrabold text-forest">{appointments.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-coral/15 flex items-center justify-center shrink-0">
            <BellRing className="text-coral" />
          </div>
          <div>
            <p className="text-muted text-sm">Upcoming</p>
            <p className="text-3xl font-extrabold text-forest">{upcoming.length}</p>
          </div>
        </Card>
      </div>

      {/* Appointment status chart */}
      {appointments.length > 0 && (
        <Card>
          <h2 className="font-semibold text-forest text-lg mb-2">Appointment Status Overview</h2>
          <StatusPieChart
            counts={{
              pending: appointments.filter((a) => a.status === "pending").length,
              confirmed: appointments.filter((a) => a.status === "confirmed").length,
              rescheduled: appointments.filter((a) => a.status === "rescheduled").length,
              completed: appointments.filter((a) => a.status === "completed").length,
              cancelled: appointments.filter((a) => a.status === "cancelled").length,
            }}
          />
        </Card>
      )}

      {/* Upcoming appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-forest text-lg">Upcoming Appointments</h2>
          <Link to="/dashboard/appointments" className="text-emerald text-sm font-medium">View all →</Link>
        </div>
        {upcoming.length === 0 ? (
          <Card>No upcoming appointments. <Link to="/dashboard/appointments/book" className="text-emerald font-medium">Book one now</Link>.</Card>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((a) => (
              <Card key={a._id} className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-medium text-forest">{a.pet?.name} with Dr. {a.veterinarian?.name}</p>
                  <p className="text-sm text-muted">{new Date(a.date).toLocaleDateString()} at {a.time}</p>
                </div>
                <Badge tone={toneFor(a.status)}>{a.status}</Badge>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-forest text-lg">My Pets</h2>
          <Link to="/dashboard/pets" className="text-emerald text-sm font-medium">Manage pets →</Link>
        </div>
        {pets.length === 0 ? (
          <Card>No pets yet. Add your first pet to get started.</Card>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {pets.map((p) => (
              <Card key={p._id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center font-bold text-forest">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-forest">{p.name}</p>
                  <p className="text-sm text-muted">{p.species} · {p.breed}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
