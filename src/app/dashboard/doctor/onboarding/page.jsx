"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Stethoscope, GraduationCap, Building2,
    Phone, DollarSign, Clock, Camera, Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DoctorOnboarding() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: session?.user?.name || "",
        designation: "",
        education: "",
        specialty: "",
        experience: "",
        hospital: "",
        phone: session?.user?.phone || "",
        fee: "",
        image: session?.user?.image || "",
        registrationNumber: "",
        time_slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
    });

    const AVAILABLE_SLOTS = [
        "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
        "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
        "08:00 PM", "09:00 PM"
    ];

    const toggleTimeSlot = (slot) => {
        setForm(prev => {
            const slots = prev.time_slots || [];
            if (slots.includes(slot)) {
                return { ...prev, time_slots: slots.filter(s => s !== slot) };
            } else {
                return {
                    ...prev, time_slots: [...slots, slot].sort((a, b) => {
                        return AVAILABLE_SLOTS.indexOf(a) - AVAILABLE_SLOTS.indexOf(b);
                    })
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.time_slots || form.time_slots.length === 0) {
            setError("Please select at least one preferred time slot.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/user/doctor-onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                // Profile is now pending admin approval — do NOT update role yet
                setError("");
                alert("✅ Profile submitted successfully! Your account is pending admin approval. You will receive access once verified.");
            } else {
                setError(data.error || "Failed to save profile");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl mx-auto">
                <Card className="border-none shadow-2xl shadow-slate-100 rounded-[40px] overflow-hidden bg-white/80 backdrop-blur-xl">
                    <CardHeader className="p-10 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-50/50 rotate-3 transform transition-transform hover:rotate-0">
                            <Stethoscope className="w-12 h-12 text-[#7BA1C7]" />
                        </div>
                        <CardTitle className="text-4xl font-black text-slate-900 tracking-tight">Doctor Onboarding</CardTitle>
                        <CardDescription className="text-lg text-slate-500 mt-4 max-w-lg mx-auto leading-relaxed">
                            Join our prestigious network of medical professionals. Tell us about your expertise to start helping patients.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-10 pt-0">
                        <form onSubmit={handleSubmit} className="space-y-10">

                            {/* Personal & Professional Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormGroup label="Full Name" icon={Check} id="name">
                                    <Input
                                        className="rounded-2xl h-14 bg-slate-50/50 border-none focus-visible:ring-blue-500"
                                        placeholder="Dr. John Doe"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup label="Designation" icon={Building2} id="designation">
                                    <Input
                                        className="rounded-2xl h-14 bg-slate-50/50 border-none focus-visible:ring-blue-500"
                                        placeholder="Senior Consultant"
                                        value={form.designation}
                                        onChange={(e) => setForm({ ...form, designation: e.target.value })}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup label="Specialty" icon={Stethoscope} id="specialty">
                                    <Input
                                        className="rounded-2xl h-14 bg-slate-50/50 border-none focus-visible:ring-blue-500"
                                        placeholder="Cardiology"
                                        value={form.specialty}
                                        onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup label="Education" icon={GraduationCap} id="education">
                                    <Input
                                        className="rounded-2xl h-14 bg-slate-50/50 border-none focus-visible:ring-blue-500"
                                        placeholder="MBBS, MD"
                                        value={form.education}
                                        onChange={(e) => setForm({ ...form, education: e.target.value })}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup label="Experience" icon={Clock} id="experience">
                                    <Input
                                        className="rounded-2xl h-14 bg-slate-50/50 border-none focus-visible:ring-blue-500"
                                        placeholder="10+ Years"
                                        value={form.experience}
                                        onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup label="Hospital" icon={Building2} id="hospital">
                                    <Input
                                        className="rounded-2xl h-14 bg-slate-50/50 border-none focus-visible:ring-blue-500"
                                        placeholder="Central City Hospital"
                                        value={form.hospital}
                                        onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup label="Contact Phone" icon={Phone} id="phone">
                                    <Input
                                        className="rounded-2xl h-14 bg-slate-50/50 border-none focus-visible:ring-blue-500"
                                        placeholder="+1 234 567 890"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup label="Consultation Fee ($)" icon={DollarSign} id="fee">
                                    <Input
                                        type="number"
                                        className="rounded-2xl h-14 bg-slate-50/50 border-none focus-visible:ring-blue-500"
                                        placeholder="100"
                                        value={form.fee}
                                        onChange={(e) => setForm({ ...form, fee: e.target.value })}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup label="Medical Reg. Number" icon={Check} id="registrationNumber">
                                    <Input
                                        className="rounded-2xl h-14 bg-slate-50/50 border-none focus-visible:ring-blue-500"
                                        placeholder="BMDC-12345"
                                        value={form.registrationNumber}
                                        onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                                        required
                                    />
                                </FormGroup>
                            </div>

                            <FormGroup label="Profile Image URL" icon={Camera} id="image">
                                <Input
                                    className="rounded-2xl h-14 bg-slate-50/50 border-none focus-visible:ring-blue-500 text-slate-400 text-sm"
                                    placeholder="https://..."
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                />
                            </FormGroup>

                            {/* Time Slots Selection */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 ml-1">
                                    <Clock className="w-5 h-5 text-[#7BA1C7]" />
                                    <Label className="text-lg font-bold text-slate-700 tracking-wider">
                                        Preferred Time Slots
                                    </Label>
                                </div>
                                <p className="text-sm text-slate-500 ml-1">Select the times you are typically available for consultation.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                                    {AVAILABLE_SLOTS.map((slot) => {
                                        const isSelected = form.time_slots.includes(slot);
                                        return (
                                            <div
                                                key={slot}
                                                onClick={() => toggleTimeSlot(slot)}
                                                className={`cursor-pointer text-center py-2.5 rounded-2xl text-sm font-semibold border-2 transition-all ${isSelected
                                                    ? "bg-[#7BA1C7] border-[#7BA1C7] text-white shadow-md shadow-blue-100"
                                                    : "bg-white border-slate-100 text-slate-500 hover:border-[#7BA1C7]/30"
                                                    }`}
                                            >
                                                {slot}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center font-bold animate-pulse">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-black hover:bg-slate-800 text-white rounded-3xl text-xl font-black shadow-2xl shadow-slate-200 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "Save Profile & Enter Dashboard"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function FormGroup({ label, icon: Icon, id, children }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 ml-1">
                <Icon className="w-4 h-4 text-[#7BA1C7]" />
                <Label htmlFor={id} className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {label}
                </Label>
            </div>
            {children}
        </div>
    );
}
