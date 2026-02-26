"use client";
import UnderDevelopment from "@/components/UnderDevelopment";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
    return (
        <UnderDevelopment
            title="Patient Messaging"
            description="Communicate directly and securely with your healthcare providers. This feature will be live soon."
            icon={MessageSquare}
        />
    );
}
