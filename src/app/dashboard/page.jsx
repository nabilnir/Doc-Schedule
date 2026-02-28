"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BarChart3, Users, CalendarCheck2, Clock,
  TrendingUp, PlusCircle, ArrowRight, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session?.user?.role === "doctor") {
      checkDoctorProfile();
    } else {
      setLoading(false);
    }
  }, [session, status]);

  const checkDoctorProfile = async () => {
    try {
      const res = await fetch("/api/user/check-doctor-profile");
      const data = await res.json();
      setHasProfile(data.hasProfile);
    } catch (err) {
      console.error("Check profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#7BA1C7] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const role = session?.user?.role || "patient";

  if (role === "doctor" && !hasProfile) {
    return <DoctorOnboardingPrompt />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-slate-500 mt-1 capitalize">{role} Dashboard Overview</p>
        </div>
        <Button className="bg-black hover:bg-slate-800 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]">
          <PlusCircle className="w-5 h-5 mr-2 text-[#7BA1C7]" />
          {role === "admin" ? "Admit User" : role === "doctor" ? "Add Slot" : "Book Appointment"}
        </Button>
      </div>

      {role === "admin" && <AdminView />}
      {role === "doctor" && <DoctorView />}
      {role === "patient" && <PatientView />}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function DoctorOnboardingPrompt() {
  const router = useRouter();
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-xl w-full border-none shadow-2xl shadow-slate-100 rounded-[32px] overflow-hidden bg-white">
        <div className="h-2 bg-[#7BA1C7] w-full" />
        <CardHeader className="pt-10 px-10 pb-0 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-[#7BA1C7]" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-slate-800">Complete Your Profile</CardTitle>
          <p className="text-slate-500 mt-4 text-lg leading-relaxed">
            Welcome to the medical team! To start consulting and managing appointments, we need a few details about your expertise and schedule.
          </p>
        </CardHeader>
        <CardContent className="p-10 text-center">
          <Button
            onClick={() => router.push("/dashboard/doctor/onboarding")}
            className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            Start Onboarding
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="mt-6 text-sm text-slate-400 font-medium italic">
            Estimated time: 2 minutes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Patients" value="1,284" icon={Users} color="blue" trend="+12%" />
      <StatCard title="Total Doctors" value="48" icon={Activity} color="emerald" trend="+3%" />
      <StatCard title="Appointments" value="856" icon={CalendarCheck2} color="amber" trend="+18%" />
      <StatCard title="Revenue" value="$12,450" icon={TrendingUp} color="violet" trend="+24%" />
      <div className="md:col-span-2 lg:col-span-4 h-64 bg-white rounded-[32px] border border-slate-100 flex items-center justify-center text-slate-400 font-medium italic shadow-sm">
        Admin Analytics Charts Coming Soon...
      </div>
    </div>
  );
}

function DoctorView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Today's Appointments" value="8" icon={CalendarCheck2} color="blue" />
      <StatCard title="Total Consultations" value="142" icon={Users} color="emerald" />
      <StatCard title="Average Rating" value="4.9/5" icon={Activity} color="amber" />
      <div className="md:col-span-3 h-64 bg-white rounded-[32px] border border-slate-100 flex items-center justify-center text-slate-400 font-medium italic shadow-sm">
        Doctor Schedule Timeline Coming Soon...
      </div>
    </div>
  );
}

function PatientView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-none shadow-xl shadow-slate-100 rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden group">
        <CardContent className="p-8 relative">
          <Clock className="absolute right-[-20px] top-[-20px] w-48 h-48 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          <p className="text-blue-100 font-bold uppercase tracking-[2px] text-xs mb-2">Upcoming</p>
          <h3 className="text-2xl font-bold mb-6 italic">Next Appointment</h3>
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-[#7BA1C7] font-bold">D</div>
            <div>
              <p className="font-bold">Dr. Sarah Connor</p>
              <p className="text-sm text-blue-100">Tomorrow at 10:30 AM</p>
            </div>
          </div>
          <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-slate-900 rounded-xl h-12 font-bold transition-all">
            Join Meeting
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <StatCard title="Active Prescriptions" value="3" icon={Activity} color="emerald" />
        <StatCard title="Medical Reports" value="12" icon={BarChart3} color="amber" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }) {
  const colors = {
    blue: "bg-slate-50 text-[#7BA1C7] shadow-slate-50",
    emerald: "bg-emerald-50 text-emerald-600 shadow-emerald-100",
    amber: "bg-amber-50 text-amber-600 shadow-amber-100",
    violet: "bg-violet-50 text-violet-600 shadow-violet-100",
  };
  return (
    <Card className="border-none shadow-lg shadow-slate-50 rounded-[24px] bg-white hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl", colors[color])}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>}
        </div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}