
import Hero from "@/components/sections/Hero";
import DashboardShowcase from "@/components/sections/DashboardShowcase";
import SmartSlotBento from "@/components/sections/SmartSlotBento";
import PublicBookingSection from "@/components/sections/PublicBookingSection";
import CalendarSection from "@/components/sections/CalendarSection";
import GoogleSyncSection from "@/components/sections/GoogleSyncSection";
import PaymentGatewaySection from "@/components/sections/PaymentGatewaySection";
import IntakeFormsSection from "@/components/sections/IntakeFormsSection";
import ReportsSection from "@/components/sections/ReportsSection";
import EmailRemindersSection from "@/components/sections/EmailRemindersSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
     
      <Hero />
      <DashboardShowcase />
      <SmartSlotBento />
      <PublicBookingSection />
      <CalendarSection />
      <GoogleSyncSection />
      <PaymentGatewaySection />
      <IntakeFormsSection />
      <ReportsSection />
      <EmailRemindersSection />
    </main>
  );
}
