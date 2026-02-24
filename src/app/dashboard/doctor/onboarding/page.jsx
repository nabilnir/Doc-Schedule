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
        time_slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                // Trigger session update to refresh role
                await update({
                    user: {
                        ...session.user,
                        role: "doctor"
                    }
                });
                router.push("/dashboard");
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
                <Card className="border-none shadow-2xl shadow-blue-100 rounded-[40px] overflow-hidden bg-white/80 backdrop-blur-xl">
                    <CardHeader className="p-10 text-center">
                        <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-50 rotate-3 transform transition-transform hover:rotate-0">
                            <Stethoscope className="w-12 h-12 text-blue-600" />
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
                            </div>

                            <FormGroup label="Profile Image URL" icon={Camera} id="image">
                                <Input
                                    className="rounded-2xl h-14 bg-slate-50/50 border-none focus-visible:ring-blue-500 text-slate-400 text-sm"
                                    placeholder="https://..."
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                />
                            </FormGroup>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center font-bold animate-pulse">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl text-xl font-black shadow-2xl shadow-blue-200 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
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
                <Icon className="w-4 h-4 text-blue-500" />
                <Label htmlFor={id} className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {label}
                </Label>
            </div>
            {children}
        </div>
    );
}
