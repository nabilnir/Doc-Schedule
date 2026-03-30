"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { User, Calendar, Clock, Phone, Mail, Activity, Search } from "lucide-react";
import { toast } from "sonner";

export default function DoctorAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch("/api/doctor/appointments");
                const data = await res.json();
                if (res.ok) {
                    setAppointments(data);
                } else {
                    toast.error(data.error);
                }
            } catch (err) {
                toast.error("Failed to load appointments");
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const filteredApps = appointments.filter(app => 
        app.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center font-bold">Loading Appointments...</div>;

    return (
        <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Patient Requests</h1>
                    <p className="text-slate-500">Manage your upcoming consultations and patient details.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search patient name..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                        <div key={app._id} className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {app.patientName[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{app.patientName}</h3>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                            app.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                                            app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right text-xs text-slate-400">
                                    Booked on: {format(new Date(app.createdAt), "MMM dd, yyyy")}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium">{format(new Date(app.appointmentDate), "PPP")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium">{app.timeSlot}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium">{app.patientAge} Years • {app.patientGender}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium">Blood: {app.patientBloodGroup}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-2 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold">Contact Email</span>
                                    <span className="text-sm text-blue-600 font-medium">{app.patientEmail}</span>
                                </div>
                                <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                                    View Full History
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed">
                        <p className="text-slate-400">No appointments found for the selected criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}