"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Phone, Calendar, Hash, Activity } from "lucide-react";

export default function PatientProfile({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const id = params.id;
  const router = useRouter();
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPatient() {
      try {
        setLoading(true);
        const res = await fetch(`/api/patients/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setPatient(data);
      } catch (err) {
        setPatient(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) getPatient();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground text-sm font-medium">Loading patient data...</p>
    </div>
  );

  if (!patient) return (
    <div className="p-20 text-center border-2 border-dashed rounded-[32px] m-6 bg-slate-50">
      <p className="text-slate-500 font-bold">No patient found with this ID.</p>
      <Button onClick={() => router.back()} className="mt-4 rounded-xl">Back to Dashboard</Button>
    </div>
  );

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()} className="rounded-full shadow-sm bg-white">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-4 py-2 rounded-full uppercase tracking-widest">
          ID: {id}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none shadow-2xl rounded-[40px] bg-white overflow-hidden">
          <div className="h-24 bg-blue-600 w-full" />
          <CardHeader className="flex flex-col items-center -mt-12">
            <div className="h-24 w-24 rounded-[28px] bg-white p-1.5 shadow-lg">
              <div className="h-full w-full rounded-[20px] bg-blue-50 flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-black mt-4 text-slate-800">{patient.name}</CardTitle>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase">{patient.gender}</span>
              <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-full uppercase">{patient.age} Years</span>
            </div>
          </CardHeader>
          <CardContent className="pb-10 pt-4">
             <Button variant="secondary" className="w-full rounded-2xl text-xs font-bold h-12">Edit Patient Details</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] bg-white p-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2"><Phone className="h-3 w-3" /> Phone</p>
              <p className="text-lg font-bold text-slate-700">{patient.phone}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2"><Calendar className="h-3 w-3" /> Last Visit</p>
              <p className="text-lg font-bold text-slate-700">{new Date(patient.lastVisit).toLocaleDateString()}</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-[30px] sm:col-span-2 flex items-center justify-between border border-blue-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2"><Activity className="h-3 w-3" /> Visit History</p>
                <p className="text-sm text-slate-500 font-medium italic">Total number of consultations</p>
              </div>
              <p className="text-5xl font-black text-blue-600 pr-4">{patient.totalVisits}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}