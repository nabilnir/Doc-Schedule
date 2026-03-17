"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
    Stethoscope, CheckCircle, XCircle, Clock, ShieldCheck,
    Users, DollarSign, Calendar, Activity, ChevronRight,
    Tag, Ban, RefreshCw, AlertTriangle, Star, Flag,
    Trash2, BadgeCheck, TrendingUp, Wallet
} from "lucide-react";

// ─── Utility ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
    const map = {
        pending: "bg-amber-50 text-amber-600 border-amber-200",
        approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
        rejected: "bg-red-50 text-red-500 border-red-200",
    };
    const safeStatus = status || "pending";
    const label = safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1);
    return (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${map[safeStatus] || map.pending}`}>
            {label}
        </span>
    );
}

function TabButton({ id, label, icon: Icon, active, onClick, count }) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${active
                ? "bg-[#7BA1C7] text-white shadow-lg shadow-[#7BA1C7]/30"
                : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
            {count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${active ? "bg-white/20" : "bg-slate-100"}`}>
                    {count}
                </span>
            )}
        </button>
    );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function PendingApprovals({ doctors, onAction, loading }) {
    const pending = doctors.filter(d => d.verificationStatus === "pending" || (!d.isVerified && d.verificationStatus !== "rejected"));

    if (pending.length === 0) return (
        <div className="py-16 text-center bg-white rounded-[24px] border border-dashed border-slate-200">
            <CheckCircle className="w-10 h-10 text-emerald-300 mx-auto mb-3" />
            <p className="font-bold text-slate-500">No pending approvals</p>
        </div>
    );

    return (
        <div className="space-y-4">
            {pending.map(doc => (
                <div key={doc._id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                                {doc.image
                                    ? <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400">
                                        {doc.name?.[0] || "?"}
                                    </div>
                                }
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-lg">{doc.name}</p>
                                <p className="text-sm text-slate-500">{doc.specialty} • {doc.hospital}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    {doc.registrationNumber && (
                                        <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">
                                            Reg: {doc.registrationNumber}
                                        </span>
                                    )}
                                    <p className="text-xs text-slate-400">{doc.education} • {doc.experience}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => onAction(doc._id, "approve")}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
                            >
                                <CheckCircle className="w-4 h-4" /> Approve
                            </button>
                            <button
                                onClick={() => onAction(doc._id, "reject")}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                                <XCircle className="w-4 h-4" /> Reject
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const SPECIALIZATION_OPTIONS = [
    "Cardiology", "Neurology", "Dental", "Pediatrics", "Dermatology",
    "Orthopedics", "Gynecology", "Psychiatry", "Ophthalmology", "ENT",
    "Gastroenterology", "Urology", "General Medicine"
];

function AllDoctors({ doctors, onAction, loading }) {
    const [expandedTags, setExpandedTags] = useState(null);
    const [tagInput, setTagInput] = useState([]);

    const startTagEdit = (doc) => {
        setExpandedTags(doc._id);
        setTagInput(doc.specializations || []);
    };
    const toggleTag = (tag) => setTagInput(prev =>
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    const saveTag = (docId) => {
        onAction(docId, "updateTags", tagInput);
        setExpandedTags(null);
    };

    return (
        <div className="space-y-4">
            {doctors.map(doc => (
                <div key={doc._id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                                {doc.image
                                    ? <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">{doc.name?.[0]}</div>
                                }
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-bold text-slate-800">{doc.name}</p>
                                    <StatusBadge status={doc.verificationStatus} />
                                    {doc.isVerified && <BadgeCheck className="w-4 h-4 text-[#7BA1C7]" />}
                                </div>
                                <p className="text-sm text-slate-500 truncate">{doc.specialty} • {doc.hospital}</p>
                            </div>
                        </div>
                        {/* Stats */}
                        <div className="flex gap-4 text-center shrink-0">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">Completed</p>
                                <p className="font-black text-slate-800">{doc.stats?.completed ?? 0}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">Cancelled</p>
                                <p className="font-black text-red-400">{doc.stats?.cancelled ?? 0}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">Success</p>
                                <p className={`font-black ${(doc.stats?.successRate ?? 100) >= 70 ? "text-emerald-500" : "text-amber-500"}`}>
                                    {doc.stats?.successRate !== null ? `${doc.stats.successRate}%` : "N/A"}
                                </p>
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => startTagEdit(doc)}
                                className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
                                title="Manage specialization tags"
                            >
                                <Tag className="w-4 h-4" />
                            </button>
                            {doc.isVerified ? (
                                <button
                                    onClick={() => onAction(doc._id, "suspend")}
                                    disabled={loading}
                                    className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    Suspend
                                </button>
                            ) : doc.verificationStatus !== "rejected" ? (
                                <button
                                    onClick={() => onAction(doc._id, "approve")}
                                    disabled={loading}
                                    className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors"
                                >
                                    Approve
                                </button>
                            ) : (
                                <span className="text-xs text-red-400 font-bold">Rejected</span>
                            )}
                        </div>
                    </div>
                    {/* Tag Editor */}
                    {expandedTags === doc._id && (
                        <div className="border-t border-slate-100 p-5 bg-slate-50">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Specialization Tags</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {SPECIALIZATION_OPTIONS.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${tagInput.includes(tag)
                                            ? "bg-[#7BA1C7] text-white border-[#7BA1C7]"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-[#7BA1C7]"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => saveTag(doc._id)}
                                    className="px-4 py-2 bg-[#7BA1C7] text-white rounded-xl text-sm font-bold hover:bg-[#6990b5] transition-colors"
                                >
                                    Save Tags
                                </button>
                                <button onClick={() => setExpandedTags(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm font-bold">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function SlotManagement({ doctors, onBlockSlots }) {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [saving, setSaving] = useState(false);

    const verifiedDoctors = doctors.filter(d => d.isVerified);
    const doctor = verifiedDoctors.find(d => d._id === selectedDoctor);

    const allSlots = doctor?.time_slots?.length
        ? doctor.time_slots
        : ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

    const currentBlocked = doctor?.blockedSlots?.find(b => b.date === date)?.slots || [];

    useEffect(() => {
        setSelectedSlots(currentBlocked);
    }, [selectedDoctor, date]);

    const toggleSlot = (slot) => {
        setSelectedSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]);
    };

    const handleSave = async () => {
        if (!selectedDoctor) return;
        setSaving(true);
        await onBlockSlots(selectedDoctor, date, selectedSlots);
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Select Doctor</label>
                    <select
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7BA1C7]"
                        value={selectedDoctor || ""}
                        onChange={e => setSelectedDoctor(e.target.value)}
                    >
                        <option value="">Choose a doctor...</option>
                        {verifiedDoctors.map(d => (
                            <option key={d._id} value={d._id}>{d.name} — {d.specialty}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Select Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7BA1C7]"
                    />
                </div>
            </div>

            {selectedDoctor ? (
                <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="font-bold text-slate-800">Block Slots for {date}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Selected slots will be unavailable for booking</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Blocked</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-200 inline-block" /> Available</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {allSlots.map(slot => {
                            const isBlocked = selectedSlots.includes(slot);
                            return (
                                <button
                                    key={slot}
                                    onClick={() => toggleSlot(slot)}
                                    className={`py-3 rounded-2xl text-sm font-bold border-2 transition-all ${isBlocked
                                        ? "bg-red-50 text-red-500 border-red-200"
                                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-[#7BA1C7]"
                                        }`}
                                >
                                    {slot}
                                    {isBlocked && <span className="block text-xs mt-0.5 opacity-70">Blocked</span>}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-[#7BA1C7] text-white rounded-2xl font-bold hover:bg-[#6990b5] transition-colors disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                        Save Slot Override
                    </button>
                </div>
            ) : (
                <div className="py-12 text-center bg-white/50 rounded-[24px] border border-dashed border-slate-200">
                    <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 font-medium">Select a doctor to manage their availability</p>
                </div>
            )}
        </div>
    );
}

function Finance({ doctors, onAction, loading }) {
    const verified = doctors.filter(d => d.isVerified);
    const totalRevenue = verified.reduce((sum, d) => sum + (d.stats?.completed || 0) * (d.fee || 0), 0);
    const pendingPayout = verified.filter(d => d.payoutStatus === "pending").reduce((sum, d) => sum + (d.stats?.completed || 0) * (d.fee || 0), 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Platform Revenue</p>
                        <p className="text-2xl font-black text-slate-800">৳{totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pending Payouts</p>
                        <p className="text-2xl font-black text-slate-800">৳{pendingPayout.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {verified.map(doc => {
                    const earnings = (doc.stats?.completed || 0) * (doc.fee || 0);
                    return (
                        <div key={doc._id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                                    {doc.image ? <img src={doc.image} className="w-full h-full object-cover" alt={doc.name} /> :
                                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-sm">{doc.name?.[0]}</div>}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{doc.name}</p>
                                    <p className="text-xs text-slate-400">{doc.stats?.completed || 0} completed • ৳{doc.fee || 0}/appt</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Earnings</p>
                                    <p className="font-black text-slate-800">৳{earnings.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-xl ${doc.payoutStatus === "paid"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-amber-50 text-amber-600"}`}>
                                        {doc.payoutStatus === "paid" ? "Paid" : "Pending"}
                                    </span>
                                    <button
                                        onClick={() => onAction(doc._id, doc.payoutStatus === "paid" ? "markPending" : "markPaid")}
                                        disabled={loading}
                                        className="px-3 py-1 text-xs font-bold bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
                                    >
                                        {doc.payoutStatus === "paid" ? "Mark Pending" : "Mark Paid"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {verified.length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-sm italic">No verified doctors yet</div>
                )}
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DoctorsManagement() {
    const [tab, setTab] = useState("pending");
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/doctors");
            if (!res.ok) throw new Error("Failed to fetch doctors");
            setDoctors(await res.json());
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

    const handleAction = async (doctorId, action, specializations) => {
        setActionLoading(true);
        try {
            await fetch("/api/admin/doctors", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doctorId, action, specializations }),
            });
            await fetchDoctors();
        } catch (e) { console.error(e); } finally {
            setActionLoading(false);
        }
    };

    const handleBlockSlots = async (doctorId, date, slots) => {
        await fetch("/api/admin/doctors", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ doctorId, date, slots }),
        });
        await fetchDoctors();
    };

    const pendingCount = doctors.filter(d => d.verificationStatus === "pending" || (!d.isVerified && d.verificationStatus !== "rejected")).length;

    const tabs = [
        { id: "pending", label: "Pending Approvals", icon: Clock, count: pendingCount },
        { id: "all", label: "All Doctors", icon: Users, count: doctors.length },
        { id: "slots", label: "Slot Management", icon: Calendar },
        { id: "finance", label: "Finance", icon: DollarSign },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctors Management</h1>
                    <p className="text-slate-500 mt-1">Verify, tag, schedule, and track medical professionals</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                        <Stethoscope className="w-5 h-5 text-[#7BA1C7]" />
                        <span className="text-sm font-bold text-slate-600">{doctors.filter(d => d.isVerified).length} Verified</span>
                    </div>
                    <button
                        onClick={fetchDoctors}
                        disabled={loading}
                        className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium">
                    <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {tabs.map(t => (
                    <TabButton key={t.id} {...t} active={tab === t.id} onClick={setTab} />
                ))}
            </div>

            {/* Tab Content */}
            {loading ? (
                <div className="py-20 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#7BA1C7] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {tab === "pending" && <PendingApprovals doctors={doctors} onAction={handleAction} loading={actionLoading} />}
                    {tab === "all" && <AllDoctors doctors={doctors} onAction={handleAction} loading={actionLoading} />}
                    {tab === "slots" && <SlotManagement doctors={doctors} onBlockSlots={handleBlockSlots} />}
                    {tab === "finance" && <Finance doctors={doctors} onAction={handleAction} loading={actionLoading} />}
                </>
            )}
        </div>
    );
}
