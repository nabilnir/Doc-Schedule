"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock,
  Settings,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  UserCircle,
  Stethoscope,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/sections/Navbar"; 
import Footer from "@/components/sections/Footer";

export default function SmartSchedulingPage() {
  const [activeSlots, setActiveSlots] = useState([
    true,
    false,
    true,
    false,
    true,
    true,
  ]);

  // Demo animation for the slot grid
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlots((prev) => prev.map(() => Math.random() > 0.5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F7] selection:bg-[#7BA1C7] selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative pt-[120px] pb-20 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[#7BA1C7]/5 -skew-y-3 transform origin-top-left -z-10"></div>
          <div className="container mx-auto px-6 lg:px-12 max-w-[1440px]">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Text Content */}
              <div className="lg:w-1/2 space-y-6 flex flex-col items-start text-left relative z-10 w-full lg:max-w-[600px] xl:max-w-none">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F0F8] text-[#3A6B9C] font-semibold text-sm">
                  <Zap className="w-4 h-4 fill-current" />
                  Smart Scheduling
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-[#1A1A1A] leading-[1.1]">
                  Your Calendar on <span className="text-[#7BA1C7]">Autopilot.</span>
                </h1>
                <p className="text-lg md:text-xl text-[#666666] leading-relaxed max-w-2xl">
                  Say goodbye to manual slot creation and double-bookings. Set
                  your rules once, and our engine dynamically generates available
                  times for your patients.
                </p>
                <div className="pt-4 flex items-center gap-4">
                  <Link
                    href="/"
                    className="bg-[#2A2A2A] text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>

              {/* Interactive Visual */}
              <div className="lg:w-1/2 relative w-full flex justify-center mt-12 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#7BA1C7]/20 to-transparent rounded-[40px] blur-3xl -z-10"></div>
                <div className="w-full max-w-md bg-white p-8 rounded-[32px] shadow-2xl border border-gray-100 relative group overflow-hidden">
                   {/* Background Decoration */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#7BA1C7]/10 to-transparent rounded-bl-[100px] -z-0 blur-lg transition-transform duration-700 group-hover:scale-110"></div>
                  
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 relative z-10">
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl">Dr. Sarah's Schedule</h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">Today, Oct 15</p>
                    </div>
                    <div className="w-12 h-12 bg-[#F0F7FF] rounded-full flex items-center justify-center border border-[#7BA1C7]/20">
                      <Stethoscope className="w-6 h-6 text-[#7BA1C7]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    {["09:00 AM", "10:00 AM", "11:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"].map(
                      (time, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-2xl border-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-center min-h-[80px] ${
                            activeSlots[i]
                              ? "bg-white border-[#7BA1C7] shadow-md transform scale-[1.02] hover:-translate-y-1"
                              : "bg-gray-50 border-transparent opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm md:text-base font-bold ${
                                activeSlots[i]
                                  ? "text-[#3A6B9C]"
                                  : "text-gray-400"
                              }`}
                            >
                              {time}
                            </span>
                            {activeSlots[i] ? (
                              <CheckCircle2 className="w-5 h-5 text-[#7BA1C7]" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                          {/* Shimmer effect for active */}
                          {activeSlots[i] && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] animate-[shimmer_2s_infinite]"></div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- How It Works Steps --- */}
        <section className="py-24 bg-[#F5F5F7] relative">
          <div className="container mx-auto px-6 lg:px-12 max-w-[1440px]">
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-6 tracking-tight">
                How It Works
              </h2>
              <p className="text-[#666666] text-lg md:text-xl">
                Three simple steps to automate your clinic's booking workflow and eliminate manual errors completely.
              </p>
            </div>

            <div className="relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 z-0 border-t-2 border-dashed border-gray-400 opacity-50"></div>

              <div className="grid md:grid-cols-3 gap-12 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white rounded-full shadow-xl border-4 border-[#F5F5F7] flex items-center justify-center mb-8 transform group-hover:-translate-y-2 transition-transform duration-300 relative">
                     <div className="absolute inset-0 bg-blue-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 opacity-20"></div>
                     <Settings className="w-10 h-10 text-[#7BA1C7] relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Define Rules</h3>
                  <p className="text-gray-600 text-base leading-relaxed max-w-[280px]">
                    Set your working days, your exact start and end times, and how long each consultation lasts.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white rounded-full shadow-xl border-4 border-[#F5F5F7] flex items-center justify-center mb-8 transform group-hover:-translate-y-2 transition-transform duration-300 relative">
                     <div className="absolute inset-0 bg-blue-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 opacity-20"></div>
                     <CalendarDays className="w-10 h-10 text-[#3A6B9C] relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Engine Generates</h3>
                  <p className="text-gray-600 text-base leading-relaxed max-w-[280px]">
                    Our proprietary system calculates and creates perfectly carved-out time slots matching your availability exactly.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-[#7BA1C7] rounded-full shadow-xl border-4 border-[#F5F5F7] flex items-center justify-center mb-8 transform group-hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
                     <div className="absolute inset-0 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 opacity-20"></div>
                     <ShieldCheck className="w-10 h-10 text-white relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Conflict Free</h3>
                  <p className="text-gray-600 text-base leading-relaxed max-w-[280px]">
                    As patients book, specific slots vanish instantly in real-time. Double bookings are mathematically impossible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Public Profile Showcase --- */}
        <section className="py-24 bg-black text-white relative overflow-hidden min-h-[600px] flex items-center">
          <div className="container mx-auto px-6 lg:px-12 max-w-[1440px] relative z-20">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#7BA1C7]/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3A6B9C]/20 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4"></div>

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Profile Card UI Mockup */}
              <div className="order-2 lg:order-1 relative group mx-auto w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7BA1C7]/30 to-transparent rounded-[40px] -m-4 -z-10 group-hover:m-[2px] transition-all duration-500 opacity-0 group-hover:opacity-100 blur-xl"></div>
                <div className="bg-[#111111] border border-white/10 p-8 rounded-[32px] backdrop-blur-xl shadow-2xl relative z-10 transform transition-transform duration-500 hover:scale-[1.02] hover:border-white/20">
                  <div className="flex flex-col items-center text-center mt-4">
                    <UserCircle className="w-24 h-24 text-[#7BA1C7] mb-6 drop-shadow-lg" />
                    <h4 className="text-3xl font-bold text-white mb-2">Dr. Jane Doe</h4>
                    <p className="text-gray-400 font-medium tracking-wide">Cardiologist Speciliast</p>
                  </div>
                  
                  <div className="mt-10 px-4">
                     <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>
                     <div className="flex items-center justify-between bg-black/50 p-4 rounded-2xl border border-white/10 hover:border-[#7BA1C7]/50 transition-colors cursor-pointer group/link">
                       <span className="text-gray-300 font-mono text-sm px-2 truncate group-hover/link:text-white transition-colors">docschedule.com/dr-jane</span>
                       <div className="bg-white/10 p-2 rounded-lg group-hover/link:bg-[#7BA1C7] transition-colors">
                           <LinkIcon className="w-4 h-4 text-white" />
                       </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Public Profile Text */}
              <div className="order-1 lg:order-2 space-y-8 flex flex-col items-start lg:pl-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-[#7BA1C7] border border-white/10 font-medium text-sm">
                  <UserCircle className="w-4 h-4" />
                  Your Digital Front Door
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white">
                  Share Your Availability <br className="hidden md:block" /> Everywhere.
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                  Generated slots are published instantly to a clean, mobile-optimized public profile. Patients can book directly from your customized URL without creating an account.
                </p>
                <ul className="space-y-5 pt-6 w-full max-w-md">
                  {[
                    "Zero-setup beautiful design",
                    "Custom slug URL for your practice",
                    "Frictionless mobile-first scheduling flow",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#7BA1C7]/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-[#7BA1C7]" />
                      </div>
                      <span className="text-gray-200 font-medium text-[15px]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-24 md:py-32 bg-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-[#7BA1C7]/[0.02] bg-[size:30px_30px]"></div>
            <div className="container mx-auto px-6 max-w-4xl relative z-10 flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">Ready to toss the paper diary?</h2>
                <p className="text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed">Join innovative doctors using Smart Scheduling to reclaim hours of administrative time every single week.</p>
                
                <Link
                    href="/"
                    className="inline-flex items-center gap-3 bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-black hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                    Back to Home
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </section>
      </main>
    </div>
  );
}
