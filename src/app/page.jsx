import CalendarSection from "@/components/sections/CalendarSection";
import DashboardShowcase from "@/components/sections/DashboardShowcase";
import EmailRemindersSection from "@/components/sections/EmailRemindersSection";
import GoogleSyncSection from "@/components/sections/GoogleSyncSection";
import Hero from "@/components/sections/Hero";
import IntakeFormsSection from "@/components/sections/IntakeFormsSection";
import Navbar from "@/components/sections/Navbar";
import PaymentGatewaySection from "@/components/sections/PaymentGatewaySection";
import PublicBookingSection from "@/components/sections/PublicBookingSection";
import ReportsSection from "@/components/sections/ReportsSection";
import SmartSlotBento from "@/components/sections/SmartSlotBento";
import Image from "next/image";
import { Footer } from "react-day-picker";


export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />
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
      <Footer />
    </main>
  );
}
