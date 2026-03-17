"use client";
import React, { useState, useEffect } from "react";
import PatientTable from "@/components/admin/PatientTable";
import PatientDetailsModal from "@/components/admin/PatientDetailsModal";
import { Users, TrendingUp, UserCheck, Activity } from "lucide-react";

function QuickStatPill({ icon: Icon, label, value, loading, color = "blue" }) {
    const colorMap = {
        blue: "bg-blue-50 text-[#7BA1C7]",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
    };
    return (
        <div className="flex items-center gap-2 bg-white border border-slate-100 shadow-sm rounded-2xl px-4 py-2.5">
            <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                {loading ? (
                    <div className="h-4 w-10 bg-slate-100 rounded animate-pulse mt-0.5" />
                ) : (
                    <p className="text-sm font-black text-slate-800">{value ?? "—"}</p>
                )}
            </div>
        </div>
    );
}

export default function PatientsDashboard() {
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);

    const handleViewDetails = (id) => {
        setSelectedPatientId(id);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch("/api/admin/stats/analytics");
                if (res.ok) setAnalytics(await res.json());
            } catch { /* silently fail */ } finally {
                setAnalyticsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const e = analytics?.engagement;
    const h = analytics?.systemHealth;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Patients Management
                        </h1>
                        <p className="text-slate-500 mt-1">Monitor and moderate patient accounts</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                        <Users className="w-5 h-5 text-[#7BA1C7]" />
                        <span className="text-sm font-bold text-slate-600">Patient Directory</span>
                    </div>
                </div>

                {/* Quick Stats Strip */}
                <div className="flex flex-wrap gap-3">
                    <QuickStatPill
                        icon={TrendingUp}
                        label="New Today"
                        value={e?.newSignupsToday}
                        loading={analyticsLoading}
                        color="blue"
                    />
                    <QuickStatPill
                        icon={Users}
                        label="Total Patients"
                        value={e?.totalPatients}
                        loading={analyticsLoading}
                        color="blue"
                    />
                    <QuickStatPill
                        icon={UserCheck}
                        label="Active Patients"
                        value={`${e?.activePatients ?? "—"} (${e?.engagementRate ?? "—"}%)`}
                        loading={analyticsLoading}
                        color="emerald"
                    />
                    <QuickStatPill
                        icon={Activity}
                        label="Booking Success"
                        value={`${h?.bookingSuccessRate ?? "—"}%`}
                        loading={analyticsLoading}
                        color="emerald"
                    />
                </div>
            </div>

            <PatientTable onViewDetails={handleViewDetails} />

            <PatientDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                patientId={selectedPatientId}
            />
        </div>
    );
}
