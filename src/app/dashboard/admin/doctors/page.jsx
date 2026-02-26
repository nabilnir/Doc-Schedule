"use client";
import UnderDevelopment from "@/components/UnderDevelopment";
import { UserPlus } from "lucide-react";

export default function DoctorsManagement() {
    return (
        <UnderDevelopment
            title="Doctors Management"
            description="Verify and manage medical professional profiles. Our vetting system is currently in development."
            icon={UserPlus}
        />
    );
}
