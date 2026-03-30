"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, User, Calendar, ClipboardList, ChevronRight,
  X, Plus, Trash2, FlaskConical, Loader2, CheckCircle,
  AlertCircle, FileText, Pill, ChevronDown, ChevronUp
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

// ─── Status badge ────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    pending:   "bg-amber-50  text-amber-700  border-amber-100",
    cancelled: "bg-red-50    text-red-600    border-red-100",
    completed: "bg-blue-50   text-blue-700   border-blue-100",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize border ${map[status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

// ─── Prescription Modal ─────────────────────────────────────
function PrescriptionModal({ patient, onClose, onSaved }) {
  const [details, setDetails] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "" }]);
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [tab, setTab] = useState("write"); // 'write' | 'history'

  useEffect(() => {
    fetchHistory();
  }, [patient.patientEmail]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/doctor/prescriptions?patientEmail=${encodeURIComponent(patient.patientEmail)}`);
      const data = await res.json();
      setHistory(data.prescriptions || []);
    } catch {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const addMedicine = () =>
    setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);

  const removeMedicine = (i) =>
    setMedicines(medicines.filter((_, idx) => idx !== i));

  const updateMedicine = (i, field, val) =>
    setMedicines(medicines.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)));

  const handleSave = async () => {
    if (!details.trim()) {
      toast.error("Please add clinical notes before saving.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/doctor/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientEmail: patient.patientEmail,
          details,
          medicines: medicines.filter((m) => m.name.trim()),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Prescription saved successfully!");
        setDetails("");
        setMedicines([{ name: "", dosage: "", duration: "" }]);
        onSaved();
        fetchHistory();
        setTab("history");
      } else {
        toast.error(data.error || "Failed to save prescription.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <User className="w-5 h-5 text-[#7BA1C7]" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{patient.patientName}</p>
              <p className="text-xs text-slate-400">{patient.patientEmail}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6">
          {["write", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${
                tab === t
                  ? "border-[#7BA1C7] text-[#7BA1C7]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {t === "write" ? "Write Prescription" : `History (${history.length})`}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "write" ? (
            <div className="space-y-5">
              {/* Clinical Notes */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Clinical Notes / Diagnosis
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the patient's condition, diagnosis, and treatment plan..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7BA1C7]/40 resize-none placeholder:text-slate-300"
                />
              </div>

              {/* Medicines */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Medicines
                  </label>
                  <button
                    onClick={addMedicine}
                    className="flex items-center gap-1.5 text-xs text-[#7BA1C7] font-semibold hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Medicine
                  </button>
                </div>
                <div className="space-y-2">
                  {medicines.map((med, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                      <input
                        placeholder="Medicine name"
                        value={med.name}
                        onChange={(e) => updateMedicine(i, "name", e.target.value)}
                        className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA1C7]/40"
                      />
                      <input
                        placeholder="Dosage (e.g. 500mg)"
                        value={med.dosage}
                        onChange={(e) => updateMedicine(i, "dosage", e.target.value)}
                        className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA1C7]/40"
                      />
                      <input
                        placeholder="Duration (e.g. 7 days)"
                        value={med.duration}
                        onChange={(e) => updateMedicine(i, "duration", e.target.value)}
                        className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA1C7]/40"
                      />
                      <button
                        onClick={() => removeMedicine(i)}
                        className="p-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {loadingHistory ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-[#7BA1C7] animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="w-10 h-10 text-slate-200 mb-3" />
                  <p className="text-slate-400 text-sm">No prescriptions issued yet for this patient.</p>
                </div>
              ) : (
                history.map((rx, i) => (
                  <div key={rx._id} className="border border-slate-100 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Prescription #{history.length - i}
                      </p>
                      <p className="text-xs text-slate-400">
                        {format(new Date(rx.date), "MMM do, yyyy")}
                      </p>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{rx.details}</p>
                    {rx.medicines?.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {rx.medicines.map((med, mi) => (
                          <div key={mi} className="flex items-center gap-2 text-xs text-slate-600">
                            <Pill className="w-3.5 h-3.5 text-[#7BA1C7] shrink-0" />
                            <span className="font-semibold">{med.name}</span>
                            {med.dosage && <span className="text-slate-400">· {med.dosage}</span>}
                            {med.duration && <span className="text-slate-400">· {med.duration}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {tab === "write" && (
          <div className="p-6 border-t bg-slate-50/50">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><CheckCircle className="w-4 h-4" /> Save Prescription</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────
export default function PatientRecordsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // patient for modal

  const fetchPatients = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/patients?search=${encodeURIComponent(q)}`);
      const data = await res.json();
      setPatients(data.patients || []);
    } catch {
      toast.error("Failed to load patient records.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchPatients(search), 400);
    return () => clearTimeout(t);
  }, [search, fetchPatients]);

  return (
    <div className="p-6 md:p-10 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Patient Records</h1>
            <span className="bg-[#7BA1C7] text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-sm">
              {patients.length} Patients
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            View clinical history and issue prescriptions for your patients.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA1C7]/40 bg-white"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-[#7BA1C7] animate-spin" />
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-[32px] p-20 text-center border border-dashed flex flex-col items-center justify-center">
          <User className="w-12 h-12 text-slate-200 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800">No patients found</h3>
          <p className="text-slate-500 text-sm">Patients will appear here once they book an appointment with you.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-50/50">
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Details</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Visits</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Last Visit</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Prescription</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => (
                  <tr key={p.patientEmail} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BA1C7]/20 to-[#7BA1C7]/40 flex items-center justify-center text-[#7BA1C7] font-bold text-sm shrink-0">
                          {p.patientName?.charAt(0)?.toUpperCase() || "P"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{p.patientName}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{p.patientEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-slate-500 font-medium">
                        {p.patientAge ? `${p.patientAge}y` : "—"}
                        {p.patientGender ? ` · ${p.patientGender}` : ""}
                        {p.patientBloodGroup ? ` · ${p.patientBloodGroup}` : ""}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-slate-100 text-slate-600 font-bold text-xs px-2.5 py-1 rounded-full">
                        {p.totalVisits} {p.totalVisits === 1 ? "visit" : "visits"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 font-medium">
                      {p.lastVisit ? format(new Date(p.lastVisit), "MMM do, yyyy") : "—"}
                    </td>
                    <td className="px-6 py-5">
                      {p.hasPrescription ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                          <CheckCircle className="w-3 h-3" /> Issued
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                          <AlertCircle className="w-3 h-3" /> None
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => setSelected(p)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7BA1C7] bg-blue-50 hover:bg-[#7BA1C7] hover:text-white px-3 py-2 rounded-xl transition-all"
                      >
                        <ClipboardList className="w-3.5 h-3.5" />
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {selected && (
        <PrescriptionModal
          patient={selected}
          onClose={() => setSelected(null)}
          onSaved={() => fetchPatients(search)}
        />
      )}
    </div>
  );
}
