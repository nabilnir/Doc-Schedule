<<<<<<< HEAD
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
=======
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
    <main className="min-h-screen bg-white">
>>>>>>> 07ee21ef4ab17750eeaede76ecb24498e476e7c5
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
