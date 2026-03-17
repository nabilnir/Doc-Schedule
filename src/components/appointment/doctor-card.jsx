"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookingSystem from "./booking-system";
import { isValidImageUrl, cn } from "@/lib/utils";
import { toast } from "sonner"; // ba apnar favorite toast library

export default function DoctorCard({ doctor, existingBooking }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  if (!doctor) return null;

  const imageUrl = isValidImageUrl(doctor.image)
    ? doctor.image
    : "https://i.ibb.co/RGh95m3d/portrait-happy-ethnic-student-cheerful-600nw-2163470599.webp";

  // --- Cancellation Logic ---
  const checkCanCancel = (startTime) => {
    if (!startTime) return false;
    const now = new Date();
    const apptTime = new Date(startTime);
    const diffInHours = (apptTime - now) / (1000 * 60 * 60);
    return diffInHours >= 2;
  };

  const handleCancel = async () => {
    if (!existingBooking?._id) return;
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setIsCancelling(true);
    try {
      const res = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: existingBooking._id }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Booking cancelled & email sent!");
        window.location.reload(); 
      } else {
        toast.error(data.error || "Failed to cancel");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = existingBooking ? checkCanCancel(existingBooking.startTime) : false;

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-6 transition-all duration-300">
      <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full">
          <Image
            src={imageUrl}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover"
            alt={doctor.name}
          />
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.designation} • {doctor.specialty}</p>
            {existingBooking && (
              <p className="text-xs font-semibold text-blue-500 mt-1">
                Scheduled: {new Date(existingBooking.startTime).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Cancel Button: Sudhu jodi booking thake tokhon dekhabe */}
          {existingBooking && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={!canCancel || isCancelling}
              className={cn(
                "rounded-full px-6 h-12 font-bold",
                !canCancel && "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300"
              )}
            >
              {isCancelling ? "Processing..." : canCancel ? "Cancel" : "Locked (<2h)"}
            </Button>
          )}

          <Link href={`/all-doctors/${doctor._id || doctor.id}`}>
            <Button variant="outline" className="rounded-full px-6 h-12 cursor-pointer">
              View Profile
            </Button>
          </Link>

          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "rounded-full px-8 h-12 font-bold cursor-pointer",
              isExpanded ? "bg-slate-100 text-slate-600" : "bg-[#7BA1C7] text-white"
            )}
          >
            {isExpanded ? "Close" : "Book Now"}
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-8 pt-0">
          <BookingSystem doctor={doctor} />
        </div>
      )}
    </div>
  );
}