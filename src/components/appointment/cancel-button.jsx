"use client";
import { useState } from "react";
import { toast } from "sonner";
import { parse, set, isAfter, subHours } from "date-fns";

export default function CancelButton({ appointmentId, appointmentDate, timeSlot }) {
    const [loading, setLoading] = useState(false);

    const checkCancellable = () => {
        // ১. Database theke Date niai
        const baseDate = new Date(appointmentDate);
        
        // ২. TimeSlot parse kori (e.g. "02:20 AM")
        const parsedTime = parse(timeSlot, 'hh:mm a', new Date());
        
        // ৩. Full Appointment DateTime banai
        const fullAppointmentTime = set(baseDate, {
            hours: parsedTime.getHours(),
            minutes: parsedTime.getMinutes(),
            seconds: 0
        });

        const now = new Date();

        // ৪. Logic: Appointment-ti ekhon theke thik ২ ghanta porer ki na (Future check)
        // Appointment Time theke ২ ghanta bhigh korle j somoy hoy, sheta ekhonkar cheye boro hote hobe
        const deadline = subHours(fullAppointmentTime, 2);
        
        return isAfter(deadline, now);
    };

    const isAllowed = checkCancellable();

    const handleCancel = async () => {
        if (!confirm("Are you sure?")) return;
        setLoading(true);
        
        try {
            const res = await fetch("/api/appointments/cancel", {
                method: "POST",
                body: JSON.stringify({ appointmentId }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                toast.success("Cancelled successfully");
                window.location.reload();
            } else {
                const data = await res.json();
                toast.error(data.error);
            }
        } catch (err) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCancel}
            disabled={!isAllowed || loading}
            className={`text-[10px] uppercase tracking-tighter font-bold px-3 py-1.5 rounded-lg transition-all 
                ${isAllowed 
                    ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100" 
                    : "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"}`}
        >
            {loading ? "..." : isAllowed ? "Cancel" : "Locked"}
        </button>
    );
}