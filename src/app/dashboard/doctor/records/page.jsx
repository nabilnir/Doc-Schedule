"use client";
import UnderDevelopment from "@/components/UnderDevelopment";
import { ClipboardList } from "lucide-react";

export default function PatientRecords() {
    return (
        <UnderDevelopment
            title="Patient Records"
            description="Access and update clinical history securely. The records management system is currently being built."
            icon={ClipboardList}
        />
    );
}
