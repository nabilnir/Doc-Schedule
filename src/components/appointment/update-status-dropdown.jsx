"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateAppointmentStatus } from "@/app/actions/doctor-appointments";
import { Check, X, Clock, UserCheck } from "lucide-react";

export default function UpdateStatusDropdown({ appointmentId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus || "pending");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);
    
    const toastId = toast.loading("Updating status...");
    
    const res = await updateAppointmentStatus(appointmentId, newStatus);
    
    if (res.success) {
      toast.success("Status updated successfully!", { id: toastId });
    } else {
      toast.error(res.error || "Failed to update status", { id: toastId });
      setStatus(currentStatus); // revert on failure
    }
    
    setIsUpdating(false);
  };

  return (
    <div className="relative inline-block w-40">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`w-full appearance-none px-3 py-1.5 rounded-full text-xs font-bold capitalize outline-none cursor-pointer transition-colors shadow-sm
          ${status === 'confirmed' ? "bg-emerald-50 text-emerald-700 border border-emerald-200 focus:ring-emerald-500 hover:bg-emerald-100" : ""}
          ${status === 'pending'   ? "bg-amber-50  text-amber-700  border border-amber-200  focus:ring-amber-500 hover:bg-amber-100" : ""}
          ${status === 'cancelled' ? "bg-red-50    text-red-700    border border-red-200    focus:ring-red-500 hover:bg-red-100" : ""}
          ${status === 'completed' ? "bg-blue-50   text-blue-700   border border-blue-200   focus:ring-blue-500 hover:bg-blue-100" : ""}
        `}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      
      {/* Visual icon overlay to represent the dropdown state */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        {isUpdating ? (
          <div className="h-3 w-3 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
        ) : (
          <svg className={`h-4 w-4 
            ${status === 'confirmed' ? "text-emerald-500" : ""}
            ${status === 'pending'   ? "text-amber-500" : ""}
            ${status === 'cancelled' ? "text-red-500" : ""}
            ${status === 'completed' ? "text-blue-500" : ""}
          `} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </div>
  );
}
