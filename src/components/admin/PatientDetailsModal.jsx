"use client";

import React, { useState, useEffect } from 'react';
import {
    X, Calendar, ClipboardList, FileText,
    User, Phone, Mail, Activity, Clock
} from 'lucide-react';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PatientDetailsModal({ isOpen, onClose, patientId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && patientId) {
            fetchPatientDetails();
        } else {
            setData(null);
            setError(null);
        }
    }, [isOpen, patientId]);

    const fetchPatientDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/admin/patients/${patientId}`);
            if (res.ok) {
                const result = await res.json();
                setData(result);
            } else {
                setError("Could not load patient details. Please try again.");
            }
        } catch (error) {
            console.error("Failed to fetch patient details:", error);
            setError("A network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-[32px] bg-slate-50 shadow-2xl">
                <div className="sr-only">
                    <DialogTitle>Patient Details - {data?.patient?.fullName || 'Loading...'}</DialogTitle>
                    <DialogDescription>Detailed medical history and profile for the selected patient.</DialogDescription>
                </div>
                {/* Accessibility: Title and Description are already in DialogHeader or sr-only above if loading */}
                {loading ? (
                    <div className="h-[500px] flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-[#7BA1C7] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="h-[400px] flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                            <X className="w-8 h-8" />
                        </div>
                        <p className="text-slate-600 font-medium mb-4">{error}</p>
                        <Button onClick={fetchPatientDetails} variant="outline" className="rounded-xl border-slate-200">
                            Try Again
                        </Button>
                    </div>
                ) : data && (
                    <div className="flex flex-col h-full max-h-[90vh]">
                        {/* Header Profile Section */}
                        <DialogHeader className="p-8 bg-white border-b border-slate-100 text-left">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-20 h-20 rounded-[28px] bg-[#7BA1C7] flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-[#7BA1C7]/20">
                                        {data.patient?.fullName?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <DialogTitle className="text-2xl font-bold text-slate-800">{data.patient?.fullName || 'Unknown Patient'}</DialogTitle>
                                        <DialogDescription className="sr-only">Detailed medical history and profile for the selected patient.</DialogDescription>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            <Badge variant="secondary" className="bg-slate-50 text-slate-500 rounded-lg px-2 py-1">
                                                ID: {String(data.patient._id).slice(-6).toUpperCase()}
                                            </Badge>
                                            <Badge className={data.patient.isBlocked ? "bg-red-50 text-red-600 rounded-lg" : "bg-emerald-50 text-emerald-600 rounded-lg"}>
                                                {data.patient.isBlocked ? 'Suspended Account' : 'Verified Profile'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                                <InfoItem icon={Mail} label="Email Address" value={data.patient.email} className="break-all" />
                                <InfoItem icon={Phone} label="Phone Number" value={data.patient.phone || 'N/A'} />
                                <InfoItem icon={Calendar} label="Member Since" value={new Date(data.patient.createdAt).toLocaleDateString()} />
                            </div>
                        </DialogHeader>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 p-8 bg-slate-50">
                            <StatBox
                                icon={Calendar}
                                label="Total Appointments"
                                value={data.stats.totalAppointments}
                                color="blue"
                            />
                            <StatBox
                                icon={ClipboardList}
                                label="Active Prescriptions"
                                value={data.stats.activePrescriptions}
                                color="emerald"
                            />
                            <StatBox
                                icon={FileText}
                                label="Medical Reports"
                                value={data.stats.totalReports}
                                color="amber"
                            />
                        </div>

                        {/* Scrollable Content */}
                        <ScrollArea className="flex-1 px-8 pb-8">
                            <div className="space-y-8">
                                <HistorySection
                                    title="Recent Appointments"
                                    items={data.history.appointments}
                                    renderItem={(app) => (
                                        <div key={app._id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                                    <Activity className="w-5 h-5 text-[#7BA1C7]" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{app.doctorName || 'General Consultation'}</p>
                                                    <p className="text-xs text-slate-400">{new Date(app.appointmentDate).toLocaleDateString()} • {app.timeSlot}</p>
                                                </div>
                                            </div>
                                            <Badge className={app.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}>
                                                {app.status}
                                            </Badge>
                                        </div>
                                    )}
                                />

                                <HistorySection
                                    title="Medical Reports"
                                    items={data.history.reports}
                                    renderItem={(report) => (
                                        <div key={report._id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-amber-500" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{report.reportName}</p>
                                                    <p className="text-xs text-slate-400">{new Date(report.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-blue-500 font-bold hover:bg-blue-50">
                                                View PDF
                                            </Button>
                                        </div>
                                    )}
                                />
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function InfoItem({ icon: Icon, label, value, className = "" }) {
    return (
        <div className={`flex items-start gap-3 ${className}`}>
            <div className="p-2.5 bg-slate-50 rounded-xl shrink-0">
                <Icon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-slate-700 break-all">{value}</p>
            </div>
        </div>
    );
}

function StatBox({ icon: Icon, label, value, color }) {
    const colors = {
        blue: "bg-blue-500",
        emerald: "bg-emerald-500",
        amber: "bg-amber-500"
    };
    return (
        <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${colors[color]} opacity-[0.03] rounded-bl-full`} />
            <Icon className={`w-5 h-5 mb-3 ${color === 'blue' ? 'text-blue-500' : color === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}`} />
            <p className="text-2xl font-black text-slate-800">{value}</p>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{label}</p>
        </div>
    );
}

function HistorySection({ title, items, renderItem }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-slate-800">{title}</h3>
                <Badge variant="outline" className="rounded-md border-slate-200 text-slate-400">
                    {items.length}
                </Badge>
            </div>
            <div className="space-y-3">
                {items.length > 0 ? (
                    items.map(renderItem)
                ) : (
                    <div className="py-8 text-center bg-white/50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-sm text-slate-400 font-medium italic">No records found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
