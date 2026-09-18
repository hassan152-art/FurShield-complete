import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2, Syringe, Stethoscope, FlaskConical, CalendarClock, ShieldCheck, FileText } from "lucide-react";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import DocumentUploadInput from "../../components/common/DocumentUploadInput.jsx";

const recordTypes = [
  { value: "vaccination", label: "Vaccination", icon: Syringe },
  { value: "vet_visit", label: "Vet Visit", icon: Stethoscope },
  { value: "treatment", label: "Treatment", icon: Stethoscope },
  { value: "lab_result", label: "Lab Result", icon: FlaskConical },
  { value: "follow_up", label: "Follow-up", icon: CalendarClock },
  { value: "illness", label: "Illness", icon: Stethoscope },
];
const iconFor = (t) => recordTypes.find((r) => r.value === t)?.icon || Stethoscope;

const emptyRecord = { type: "vaccination", title: "", diagnosis: "", medication: "", notes: "", date: "", followUpDate: "" };
const emptyDoc = { label: "", fileUrl: "", fileType: "" };
const emptyPolicy = { provider: "", policyNumber: "", startDate: "", endDate: "", coverageInfo: "", documents: [] };

export default function PetHealth() {
  const { id: petId } = useParams();
  const [pet, setPet] = useState(null);
  const [records, setRecords] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("timeline");

  const [showRecordForm, setShowRecordForm] = useState(false);
  const [recordForm, setRecordForm] = useState(emptyRecord);

  const [showDocForm, setShowDocForm] = useState(false);
  const [docForm, setDocForm] = useState(emptyDoc);

  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [policyForm, setPolicyForm] = useState(emptyPolicy);

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      api.get(`/pets/${petId}`),
      api.get(`/health-records`, { params: { petId } }),
      api.get(`/medical-documents`, { params: { petId } }),
      api.get(`/insurance`, { params: { petId } }),
    ])
      .then(([petRes, recordsRes, docsRes, policiesRes]) => {
        setPet(petRes.data.data.pet);
        setRecords(recordsRes.data.data.records);
        setDocuments(docsRes.data.data.documents);
        setPolicies(policiesRes.data.data.policies);
      })
      .catch(() => toast.error("Unable to load health information"))
      .finally(() => setLoading(false));
  };
  useEffect(loadAll, [petId]);

  const submitRecord = async (e) => {
    e.preventDefault();
    try {
      await api.post("/health-records", { ...recordForm, pet: petId });
      toast.success("Health record added");
      setShowRecordForm(false);
      setRecordForm(emptyRecord);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to add health record");
    }
  };

  const deleteRecord = async (id) => {
    if (!confirm("Remove this health record?")) return;
    try {
      await api.delete(`/health-records/${id}`);
      toast.success("Health record removed");
      loadAll();
    } catch {
      toast.error("Unable to remove record");
    }
  };

  const submitDoc = async (e) => {
    e.preventDefault();
    if (!docForm.fileUrl) return toast.error("Please upload a file first");
    try {
      await api.post("/medical-documents", { ...docForm, pet: petId });
      toast.success("Document saved");
      setShowDocForm(false);
      setDocForm(emptyDoc);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save document");
    }
  };

  const deleteDoc = async (id) => {
    if (!confirm("Remove this document?")) return;
    try {
      await api.delete(`/medical-documents/${id}`);
      toast.success("Document removed");
      loadAll();
    } catch {
      toast.error("Unable to remove document");
    }
  };

  const submitPolicy = async (e) => {
    e.preventDefault();
    try {
      await api.post("/insurance", { ...policyForm, pet: petId });
      toast.success("Insurance policy saved");
      setShowPolicyForm(false);
      setPolicyForm(emptyPolicy);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save policy");
    }
  };

  const deletePolicy = async (id) => {
    if (!confirm("Remove this insurance policy?")) return;
    try {
      await api.delete(`/insurance/${id}`);
      toast.success("Policy removed");
      loadAll();
    } catch {
      toast.error("Unable to remove policy");
    }
  };

  if (loading) return <Spinner label="Loading health information..." />;
  if (!pet) return <EmptyState title="Pet not found" description="This pet profile could not be loaded." />;

  const tabs = [
    { key: "timeline", label: "Health Timeline" },
    { key: "documents", label: "Documents" },
    { key: "insurance", label: "Insurance" },
  ];

  return (
    <div className="space-y-6">
      <Link to="/dashboard/pets" className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest">
        <ArrowLeft size={16} /> Back to My Pets
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-mint/40 flex items-center justify-center overflow-hidden shrink-0">
          {pet.images?.[0] ? <img src={pet.images[0]} alt={pet.name} className="w-full h-full object-cover" /> : <span className="font-bold text-forest/30 text-xl">{pet.name.charAt(0)}</span>}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-forest">{pet.name}'s Health</h1>
          <p className="text-sm text-muted">{pet.species} · {pet.breed}</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-sand">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${tab === t.key ? "border-emerald text-emerald" : "border-transparent text-muted hover:text-forest"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "timeline" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setShowRecordForm((v) => !v)}><Plus size={18} /> Add Record</Button>
          </div>

          {showRecordForm && (
            <form onSubmit={submitRecord} className="bg-white rounded-2xl p-6 shadow-sm grid sm:grid-cols-2 gap-4">
              <select value={recordForm.type} onChange={(e) => setRecordForm({ ...recordForm, type: e.target.value })} className="border border-sand rounded-xl px-4 py-3">
                {recordTypes.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <input required placeholder="Title (e.g. Rabies vaccine)" value={recordForm.title} onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
              <input type="date" value={recordForm.date} onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
              <input type="date" placeholder="Follow-up date" value={recordForm.followUpDate} onChange={(e) => setRecordForm({ ...recordForm, followUpDate: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
              <input placeholder="Diagnosis / allergy / illness" value={recordForm.diagnosis} onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })} className="border border-sand rounded-xl px-4 py-3 sm:col-span-2" />
              <input placeholder="Medication" value={recordForm.medication} onChange={(e) => setRecordForm({ ...recordForm, medication: e.target.value })} className="border border-sand rounded-xl px-4 py-3 sm:col-span-2" />
              <textarea placeholder="Notes" value={recordForm.notes} onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} className="border border-sand rounded-xl px-4 py-3 sm:col-span-2" />
              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit">Save Record</Button>
                <Button type="button" variant="outline" onClick={() => setShowRecordForm(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {records.length === 0 ? (
            <EmptyState title="No health records yet" description="Add vaccinations, treatments and vet visits to build your pet's timeline." />
          ) : (
            <div className="relative pl-6 border-l-2 border-mint space-y-6">
              {records.map((r) => {
                const Icon = iconFor(r.type);
                return (
                  <div key={r._id} className="relative">
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald border-4 border-white" />
                    <Card>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Icon size={18} className="text-emerald mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-forest">{r.title}</p>
                            <p className="text-xs text-muted mt-0.5">{new Date(r.date).toLocaleDateString()} {r.veterinarian?.name && `· Dr. ${r.veterinarian.name}`}</p>
                            {r.diagnosis && <p className="text-sm text-ink mt-2"><span className="font-medium">Diagnosis:</span> {r.diagnosis}</p>}
                            {r.medication && <p className="text-sm text-ink mt-1"><span className="font-medium">Medication:</span> {r.medication}</p>}
                            {r.notes && <p className="text-sm text-muted mt-1 whitespace-pre-line">{r.notes}</p>}
                            {r.followUpDate && <p className="text-xs text-coral mt-2">Follow-up due: {new Date(r.followUpDate).toLocaleDateString()}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge>{recordTypes.find((t) => t.value === r.type)?.label}</Badge>
                          <button onClick={() => deleteRecord(r._id)} className="text-coral" aria-label="Delete record"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "documents" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setShowDocForm((v) => !v)}><Plus size={18} /> Add Document</Button>
          </div>

          {showDocForm && (
            <form onSubmit={submitDoc} className="bg-white rounded-2xl p-6 shadow-sm grid sm:grid-cols-2 gap-4">
              <input required placeholder="Label (e.g. Vet certificate, X-ray, lab report)" value={docForm.label} onChange={(e) => setDocForm({ ...docForm, label: e.target.value })} className="border border-sand rounded-xl px-4 py-3 sm:col-span-2" />
              <div className="sm:col-span-2">
                <DocumentUploadInput value={docForm.fileUrl} onChange={(url) => setDocForm({ ...docForm, fileUrl: url })} />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit">Save Document</Button>
                <Button type="button" variant="outline" onClick={() => setShowDocForm(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {documents.length === 0 ? (
            <EmptyState title="No documents yet" description="Scan and store vet certificates, X-rays and lab reports here." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {documents.map((d) => (
                <Card key={d._id} className="flex items-center justify-between gap-3">
                  <a href={d.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 min-w-0">
                    <FileText size={20} className="text-emerald shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-forest truncate">{d.label}</p>
                      <p className="text-xs text-muted">{new Date(d.createdAt).toLocaleDateString()}</p>
                    </div>
                  </a>
                  <button onClick={() => deleteDoc(d._id)} className="text-coral shrink-0" aria-label="Delete document"><Trash2 size={16} /></button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "insurance" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setShowPolicyForm((v) => !v)}><Plus size={18} /> Add Policy</Button>
          </div>

          {showPolicyForm && (
            <form onSubmit={submitPolicy} className="bg-white rounded-2xl p-6 shadow-sm grid sm:grid-cols-2 gap-4">
              <input required placeholder="Insurance provider" value={policyForm.provider} onChange={(e) => setPolicyForm({ ...policyForm, provider: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
              <input required placeholder="Policy number" value={policyForm.policyNumber} onChange={(e) => setPolicyForm({ ...policyForm, policyNumber: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
              <input type="date" value={policyForm.startDate} onChange={(e) => setPolicyForm({ ...policyForm, startDate: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
              <input type="date" value={policyForm.endDate} onChange={(e) => setPolicyForm({ ...policyForm, endDate: e.target.value })} className="border border-sand rounded-xl px-4 py-3" />
              <textarea placeholder="Coverage details" value={policyForm.coverageInfo} onChange={(e) => setPolicyForm({ ...policyForm, coverageInfo: e.target.value })} className="border border-sand rounded-xl px-4 py-3 sm:col-span-2" />
              <div className="sm:col-span-2">
                <DocumentUploadInput
                  label="Policy document (optional)"
                  value={policyForm.documents[0] || ""}
                  onChange={(url) => setPolicyForm({ ...policyForm, documents: url ? [url] : [] })}
                />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit">Save Policy</Button>
                <Button type="button" variant="outline" onClick={() => setShowPolicyForm(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {policies.length === 0 ? (
            <EmptyState title="No insurance policies yet" description="Store your pet's insurance details and claim documents for safekeeping." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {policies.map((p) => (
                <Card key={p._id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={20} className="text-emerald mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-forest">{p.provider}</p>
                        <p className="text-xs text-muted">Policy #{p.policyNumber}</p>
                        {(p.startDate || p.endDate) && (
                          <p className="text-xs text-muted mt-1">
                            {p.startDate && new Date(p.startDate).toLocaleDateString()} – {p.endDate && new Date(p.endDate).toLocaleDateString()}
                          </p>
                        )}
                        {p.coverageInfo && <p className="text-sm text-ink mt-2">{p.coverageInfo}</p>}
                        {p.documents?.[0] && (
                          <a href={p.documents[0]} target="_blank" rel="noreferrer" className="text-xs text-emerald font-medium inline-flex items-center gap-1 mt-2">
                            <FileText size={14} /> View document
                          </a>
                        )}
                      </div>
                    </div>
                    <button onClick={() => deletePolicy(p._id)} className="text-coral shrink-0" aria-label="Delete policy"><Trash2 size={16} /></button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
