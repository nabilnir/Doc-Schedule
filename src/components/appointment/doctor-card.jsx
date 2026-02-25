"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BookingSystem from "./booking-system";
import { cn } from "@/lib/utils";

export default function DoctorCard({ doctor }) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!doctor) return null;

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-6 transition-all duration-300">
      <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full">
          <Image
            src={doctor.image || "https://i.ibb.co/RGh95m3d/portrait-happy-ethnic-student-cheerful-600nw-2163470599.webp"}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover"
            alt={doctor.name}
          />
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.designation} • {doctor.specialty}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full px-6 h-12">View Profile</Button>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn("rounded-full px-8 h-12 font-bold", isExpanded ? "bg-slate-100 text-slate-600" : "bg-[#7BA1C7] text-white")}
          >
            {isExpanded ? "Close" : "Book Now"}
          </Button>
        </div>
      </div>
      {isExpanded && <div className="p-8 pt-0"><BookingSystem doctor={doctor} /></div>}
    </div>
  );
}