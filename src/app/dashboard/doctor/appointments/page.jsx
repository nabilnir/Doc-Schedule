"use client";
import UnderDevelopment from "@/components/UnderDevelopment";
import { CalendarCheck2 } from "lucide-react";

export default function DoctorAppointments() {
    return (
        <UnderDevelopment
            title="My Appointments"
            description="View and manage your upcoming patient consultations. Your schedule management tool is coming soon."
            icon={CalendarCheck2}
        />
    );
}
