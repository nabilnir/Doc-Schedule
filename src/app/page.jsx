import Navbar from "@/components/sections/Navbar";
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
import Footer from "@/components/sections/Footer";

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
};
