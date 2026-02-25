"use client";
import UnderDevelopment from "@/components/UnderDevelopment";
import { BarChart3 } from "lucide-react";

export default function AnalyticsDashboard() {
    return (
        <UnderDevelopment
            title="Platform Analytics"
            description="Deep dive into clinic performance and patient engagement metrics. Analytical tools are on the way."
            icon={BarChart3}
        />
    );
}
