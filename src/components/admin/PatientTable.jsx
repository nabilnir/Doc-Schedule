"use client";

import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Eye, UserX, UserCheck,
    ArrowUpDown, Calendar
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function PatientTable({ onViewDetails }) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchPatients();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [search, sortBy, order]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/patients?search=${search}&sortBy=${sortBy}&order=${order}`);
            if (res.ok) {
                const data = await res.json();
                setPatients(data);
            }
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (patientId, currentStatus) => {
        try {
            const res = await fetch('/api/admin/patients', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: patientId, isBlocked: !currentStatus })
            });
            if (res.ok) {
                setPatients(patients.map(p =>
                    p._id === patientId ? { ...p, isBlocked: !currentStatus } : p
                ));
            }
        } catch (error) {
            console.error("Failed to toggle status:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by name, email, or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-11 border-slate-100 focus:ring-[#7BA1C7] rounded-xl"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full md:w-48 h-11 border-slate-100 rounded-xl bg-white shadow-none">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <SelectValue placeholder="Sort by" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                            <SelectItem value="createdAt">Registration Date</SelectItem>
                            <SelectItem value="fullName">Name</SelectItem>
                            <SelectItem value="lastAppointmentDate">Last Appointment</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 border-slate-100 rounded-xl hover:bg-slate-50"
                        onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                    >
                        <ArrowUpDown className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="py-5 px-6 font-bold text-slate-800 text-xs uppercase tracking-wider">Patient</th>
                                <th className="py-5 px-6 font-bold text-slate-800 text-xs uppercase tracking-wider">Contact Info</th>
                                <th className="py-5 px-6 font-bold text-slate-800 text-xs uppercase tracking-wider">Registration</th>
                                <th className="py-5 px-6 font-bold text-slate-800 text-xs uppercase tracking-wider">Status</th>
                                <th className="py-5 px-6 font-bold text-slate-800 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="py-8 px-6">
                                            <div className="h-12 bg-slate-50 rounded-2xl w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : patients.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-slate-400 font-medium italic">
                                        No patients found Matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                patients.map((patient) => (
                                    <tr key={patient._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#7BA1C7]">
                                                    {patient?.fullName?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{patient?.fullName || 'Unknown Patient'}</p>
                                                    <p className="text-[11px] text-slate-400 capitalize">{patient.role || 'Patient'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-slate-600">{patient.email}</p>
                                            <p className="text-[11px] text-slate-400">{patient.phone || 'No phone'}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="font-medium">
                                                    {new Date(patient.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <Badge className={patient.isBlocked ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}>
                                                    {patient.isBlocked ? 'Suspended' : 'Active'}
                                                </Badge>
                                                <Switch
                                                    checked={!patient.isBlocked}
                                                    onCheckedChange={() => toggleStatus(patient._id, patient.isBlocked)}
                                                    className="data-[state=checked]:bg-emerald-500"
                                                />
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-[#7BA1C7]/10 hover:text-[#7BA1C7] rounded-xl"
                                                onClick={() => onViewDetails(patient._id)}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
