import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DocSchedule – Smart Healthcare, Simplified",
  description: "Multi-tenant Doctor Appointment Booking and Scheduling SaaS Platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
         <Navbar />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Footer></Footer>
      </body>
    </html>
  );
}
