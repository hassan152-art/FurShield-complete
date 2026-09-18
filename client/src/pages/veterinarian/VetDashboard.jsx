import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarClock, CheckCircle2, Clock3, Users, Stethoscope, History } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import StatusPieChart from "../../components/charts/StatusPieChart.jsx";

const toneFor = (s) => ({ pending: "golden", confirmed: "mint", rescheduled: "golden", completed: "mint", cancelled: "coral" }[s] || "mint");

const emptyLog = { symptoms: "", diagnosis: "", medication: "", followUpNotes: "", followUpDate: "" };

export default function VetDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggingId, setLoggingId] = useState(null);
  const [logForm, setLogForm] = useState(emptyLog);
  const [historyForPet, setHistoryForPet] = useState(null); // { petId, name, records }

  const load = () => {
    setLoading(true);
    api.get("/appointments").then(({ data }) => setAppointments(data.data.appointments)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      toast.success("Appointment updated");
      load();
    } catch {
      toast.error("Unable to update appointment");
    }
  };

  const openLog = (id) => { setLoggingId(id); setLogForm(emptyLog); };

  const submitLog = async (e, id) => {
    e.preventDefault();
    try {
      await api.patch(`/appointments/${id}/log`, logForm);
      toast.success("Treatment logged — saved to the pet's health record");
      setLoggingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to log treatment");
    }
  };

  const viewHistory = async (petId, petName) => {
    try {
      const { data } = await api.get("/health-records", { params: { petId } });
      setHistoryForPet({ petId, name: petName, records: data.data.records });
    } catch {
      toast.error("Unable to load this pet's health history");
    }
  };

  if (loading) return <Spinner label="Loading your appointments..." />;

  const today = new Date().toDateString();
  const todays = appointments.filter((a) => new Date(a.date).toDateString() === today);
  const pending = appointments.filter((a) => a.status === "pending");
  const completed = appointments.filter((a) => a.status === "completed");
  const uniquePatients = new Set(appointments.map((a) => a.pet?._id)).size;

  const stats = [
    { label: "Today's Appointments", value: todays.length, icon: CalendarClock, bg: "bg-mint" },
    { label: "Pending", value: pending.length, icon: Clock3, bg: "bg-golden/30" },
    { label: "Completed", value: completed.length, icon: CheckCircle2, bg: "bg-mint" },
    { label: "Patients", value: uniquePatients, icon: Users, bg: "bg-coral/15" },
  ];

  // Build a 7-day look-ahead (today + next 6 days) count of appointments per day
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    const label = d.toLocaleDateString(undefined, { weekday: "short" });
    const count = appointments.filter((a) => new Date(a.date).toDateString() === d.toDateString()).length;
    return { day: label, appointments: count };
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold text-forest">Veterinarian Dashboard</h1>

      <div className="grid sm:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className="text-forest" size={20} />
            </div>
            <div>
              <p className="text-muted text-sm">{s.label}</p>
              <p className="text-2xl font-extrabold text-forest">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {appointments.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-semibold text-forest text-lg mb-2">Next 7 Days</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={next7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4EBDD" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6B7771" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6B7771" }} />
                <Tooltip />
                <Bar dataKey="appointments" fill="#2E7D65" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <h2 className="font-semibold text-forest text-lg mb-2">Status Breakdown</h2>
            <StatusPieChart
              counts={{
                pending: appointments.filter((a) => a.status === "pending").length,
                confirmed: appointments.filter((a) => a.status === "confirmed").length,
                rescheduled: appointments.filter((a) => a.status === "rescheduled").length,
                completed: appointments.filter((a) => a.status === "completed").length,
                cancelled: appointments.filter((a) => a.status === "cancelled").length,
              }}
              height={220}
            />
          </Card>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-forest text-lg mb-4">All Appointments</h2>
        {appointments.length === 0 ? (
          <Card>No appointments yet.</Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((a) => (
              <Card key={a._id}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-semibold text-forest">{a.pet?.name} · {a.owner?.name}</p>
                    <p className="text-sm text-muted">{new Date(a.date).toLocaleDateString()} at {a.time}</p>
                    {a.notes && <p className="text-xs text-muted mt-1 whitespace-pre-line">{a.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={toneFor(a.status)}>{a.status}</Badge>
                    <div className="flex flex-wrap gap-2">
                      {a.status === "pending" && <Button onClick={() => updateStatus(a._id, "confirmed")} className="!px-3 !py-1.5 text-xs">Confirm</Button>}
                      {["confirmed", "completed"].includes(a.status) && (
                        <Button variant="outline" className="!px-3 !py-1.5 text-xs" onClick={() => openLog(a._id)}>
                          <Stethoscope size={14} /> Log Treatment
                        </Button>
                      )}
                      <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => viewHistory(a.pet?._id, a.pet?.name)}>
                        <History size={14} /> History
                      </Button>
                      {a.status !== "completed" && a.status !== "cancelled" && (
                        <Button variant="outline" className="!px-3 !py-1.5 text-xs" onClick={() => updateStatus(a._id, "completed")}>Complete</Button>
                      )}
                      {a.status !== "cancelled" && (
                        <Button variant="ghost" className="text-coral !px-3 !py-1.5 text-xs" onClick={() => updateStatus(a._id, "cancelled")}>Cancel</Button>
                      )}
                    </div>
                  </div>
                </div>

                {loggingId === a._id && (
                  <form onSubmit={(e) => submitLog(e, a._id)} className="mt-4 pt-4 border-t border-sand grid sm:grid-cols-2 gap-3">
                    <input placeholder="Symptoms" value={logForm.symptoms} onChange={(e) => setLogForm({ ...logForm, symptoms: e.target.value })} className="border border-sand rounded-xl px-4 py-2.5 sm:col-span-2" />
                    <input required placeholder="Diagnosis" value={logForm.diagnosis} onChange={(e) => setLogForm({ ...logForm, diagnosis: e.target.value })} className="border border-sand rounded-xl px-4 py-2.5 sm:col-span-2" />
                    <input placeholder="Prescribed medication" value={logForm.medication} onChange={(e) => setLogForm({ ...logForm, medication: e.target.value })} className="border border-sand rounded-xl px-4 py-2.5 sm:col-span-2" />
                    <textarea placeholder="Follow-up notes" value={logForm.followUpNotes} onChange={(e) => setLogForm({ ...logForm, followUpNotes: e.target.value })} className="border border-sand rounded-xl px-4 py-2.5 sm:col-span-2" />
                    <input type="date" value={logForm.followUpDate} onChange={(e) => setLogForm({ ...logForm, followUpDate: e.target.value })} className="border border-sand rounded-xl px-4 py-2.5" />
                    <div className="flex gap-3 sm:col-span-2">
                      <Button type="submit" className="!px-4 !py-2 text-sm">Save Treatment Log</Button>
                      <Button type="button" variant="outline" className="!px-4 !py-2 text-sm" onClick={() => setLoggingId(null)}>Cancel</Button>
                    </div>
                  </form>
                )}

                {historyForPet?.petId === a.pet?._id && (
                  <div className="mt-4 pt-4 border-t border-sand">
                    <p className="font-semibold text-forest text-sm mb-2">{historyForPet.name}'s Health History</p>
                    {historyForPet.records.length === 0 ? (
                      <p className="text-sm text-muted">No health records yet for this pet.</p>
                    ) : (
                      <div className="space-y-2">
                        {historyForPet.records.map((r) => (
                          <div key={r._id} className="text-sm bg-sand/40 rounded-xl px-4 py-2.5">
                            <span className="font-medium text-forest">{r.title}</span>
                            <span className="text-muted"> — {new Date(r.date).toLocaleDateString()}</span>
                            {r.diagnosis && <p className="text-muted mt-0.5">{r.diagnosis}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
