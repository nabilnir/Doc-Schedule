import Image from "next/image";


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
