import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openRunde = localFont({
  src: [
    {
      path: "../../public/fonts/open-runde/OpenRunde-Regular-BF64ee9c6978988.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-runde/OpenRunde-Medium-BF64ee9c695513a.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-runde/OpenRunde-Semibold-BF64ee9c69788f3.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-runde/OpenRunde-Bold-BF64ee9c696534f.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-runde",
});

export const metadata = {
  title: "DocSchedule – Smart Healthcare, Simplified",
  description: "Multi-tenant Doctor Appointment Booking and Scheduling SaaS Platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openRunde.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
