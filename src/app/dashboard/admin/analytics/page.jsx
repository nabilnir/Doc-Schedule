"use client";
import React, { useState, useEffect } from "react";
import {
    Users, UserCheck, UserX, TrendingUp, Calendar,
    ShieldCheck, Activity, AlertTriangle, RefreshCw,
    CheckCircle, Clock, BarChart3
} from "lucide-react";


// ─── Utility Components ──────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color = "blue", loading }) {
    const colorMap = {
        blue: { bg: "bg-blue-50", icon: "text-[#7BA1C7]", ring: "ring-blue-100" },
        emerald: { bg: "bg-emerald-50", icon: "text-emerald-500", ring: "ring-emerald-100" },
        red: { bg: "bg-red-50", icon: "text-red-500", ring: "ring-red-100" },
        amber: { bg: "bg-amber-50", icon: "text-amber-500", ring: "ring-amber-100" },
    };
    const c = colorMap[color];
    return (
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 flex items-start gap-4 group hover:shadow-md transition-shadow duration-200">
            <div className={`w-12 h-12 rounded-2xl ${c.bg} ring-4 ${c.ring} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${c.icon}`} />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                {loading ? (
                    <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse mt-1" />
                ) : (
                    <p className="text-3xl font-black text-slate-800">{value ?? "—"}</p>
                )}
                {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
            </div>
        </div>
    );
}

function HealthBar({ label, value, status, icon: Icon, detail }) {
    const isGood = value >= 80;
    const isMid = value >= 50 && value < 80;
    const color = isGood ? "emerald" : isMid ? "amber" : "red";
    const barColor = isGood ? "bg-emerald-500" : isMid ? "bg-amber-400" : "bg-red-500";
    const textColor = isGood ? "text-emerald-600" : isMid ? "text-amber-600" : "text-red-600";
    const bgColor = isGood ? "bg-emerald-50" : isMid ? "bg-amber-50" : "bg-red-50";

    return (
        <div className={`p-5 rounded-[20px] border border-slate-100 bg-white`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${textColor}`} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-sm">{label}</p>
                        {detail && <p className="text-xs text-slate-400">{detail}</p>}
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${bgColor} ${textColor}`}>
                    {value}%
                </div>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-2 ${barColor} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

function PieChart({ active, inactive, rate }) {
    const total = active + inactive;
    if (total === 0) return (
        <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">No data</div>
    );

    // Simple SVG donut chart
    const r = 70;
    const cx = 90, cy = 90;
    const circumference = 2 * Math.PI * r;
    const activeDash = (active / total) * circumference;
    const inactiveDash = circumference - activeDash;

    return (
        <div className="flex items-center gap-8 justify-center">
            <div className="relative">
                <svg width="180" height="180" viewBox="0 0 180 180">
                    {/* Background ring */}
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="22" />
                    {/* Active segment */}
                    <circle
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="22"
                        strokeDasharray={`${activeDash} ${inactiveDash}`}
                        strokeDashoffset={circumference / 4}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.8s ease" }}
                    />
                    {/* Inactive segment */}
                    <circle
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke="#fca5a5"
                        strokeWidth="22"
                        strokeDasharray={`${inactiveDash} ${activeDash}`}
                        strokeDashoffset={-(activeDash) + circumference / 4}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-black text-slate-800">{rate}%</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Engaged</p>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-emerald-500" />
                    <div>
                        <p className="text-sm font-bold text-slate-800">{active} Active</p>
                        <p className="text-xs text-slate-400">Booked at least once</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-300" />
                    <div>
                        <p className="text-sm font-bold text-slate-800">{inactive} Inactive</p>
                        <p className="text-xs text-slate-400">Never booked</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/admin/stats/analytics");
            if (!res.ok) throw new Error("Failed to fetch analytics");
            const data = await res.json();
            setAnalytics(data);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAnalytics(); }, []);

    const e = analytics?.engagement;
    const h = analytics?.systemHealth;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Analytics</h1>
                    <p className="text-slate-500 mt-1">Patient engagement & system health overview</p>
                </div>
                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Updated {lastUpdated.toLocaleTimeString()}
                        </p>
                    )}
                    <button
                        onClick={fetchAnalytics}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    {error}
                </div>
            )}

            {/* ─── Section 1: Patient Engagement Metrics ─── */}
            <section>
                <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#7BA1C7]" />
                    Patient Engagement
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard
                        icon={TrendingUp}
                        label="New Signups Today"
                        value={loading ? null : e?.newSignupsToday}
                        sub="Registered in last 24h"
                        color="blue"
                        loading={loading}
                    />
                    <StatCard
                        icon={Users}
                        label="Total Patients"
                        value={loading ? null : e?.totalPatients}
                        sub="All registered patients"
                        color="blue"
                        loading={loading}
                    />
                    <StatCard
                        icon={UserCheck}
                        label="Active Patients"
                        value={loading ? null : e?.activePatients}
                        sub="Have booked at least once"
                        color="emerald"
                        loading={loading}
                    />
                    <StatCard
                        icon={UserX}
                        label="Inactive Patients"
                        value={loading ? null : e?.inactivePatients}
                        sub="Never booked"
                        color="amber"
                        loading={loading}
                    />
                </div>
            </section>

            {/* ─── Section 2: Engagement Pie Chart ─── */}
            <section className="bg-white border border-slate-100 rounded-[28px] shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-[#7BA1C7]" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800">Active vs. Inactive Patients</h2>
                        <p className="text-xs text-slate-400">Based on appointment history</p>
                    </div>
                </div>
                <div className="h-48 flex items-center justify-center">
                    {loading ? (
                        <div className="w-10 h-10 border-4 border-[#7BA1C7] border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <PieChart
                            active={e?.activePatients ?? 0}
                            inactive={e?.inactivePatients ?? 0}
                            rate={e?.engagementRate ?? 0}
                        />
                    )}
                </div>
            </section>

            {/* ─── Section 3: System Health ─── */}
            <section>
                <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    System Health — Last 7 Days
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <>
                            <div className="h-24 bg-slate-100 rounded-[20px] animate-pulse" />
                            <div className="h-24 bg-slate-100 rounded-[20px] animate-pulse" />
                        </>
                    ) : (
                        <>
                            <HealthBar
                                icon={CheckCircle}
                                label="Booking Success Rate"
                                value={h?.bookingSuccessRate ?? 100}
                                detail={`${h?.bookingSuccess ?? 0} succeeded / ${h?.bookingError ?? 0} failed (${h?.totalBookingAttempts ?? 0} total)`}
                            />
                            <HealthBar
                                icon={ShieldCheck}
                                label="Authentication Stability"
                                value={h?.authStability ?? 100}
                                detail={`${h?.authErrors ?? 0} auth errors detected`}
                            />
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
