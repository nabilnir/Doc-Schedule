"use client";

import React, { useRef } from "react";
import { ChevronDown, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [isFeaturesOpen, setIsFeaturesOpen] = React.useState(false);

  // Animation Refs
  const mobileDrawerRef = useRef(null);
  const mobileFeaturesRef = useRef(null);

  // 1. MAIN DRAWER ANIMATION
  // This handles the sliding menu background and staggering the links
  useGSAP(() => {
    if (isOpen) {
      // Background entry
      gsap.fromTo(
        mobileDrawerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      // Staggered list items entry
      gsap.fromTo(
        ".menu-item-stagger",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.1 }
      );
    }
  }, [isOpen]);

  // 2. FEATURES ACCORDION ANIMATION
  // This handles the inner dropdown within the mobile menu
  useGSAP(() => {
    if (isFeaturesOpen) {
      gsap.to(mobileFeaturesRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.fromTo(
        ".mobile-feature-item",
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.1 }
      );
    } else {
      gsap.to(mobileFeaturesRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, { scope: mobileFeaturesRef, dependencies: [isFeaturesOpen] });

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] w-full border-b border-gray-100 bg-white/80 backdrop-blur-[10px] transition-all duration-300">
      <div className="mx-auto flex h-[80px] max-w-[1440px] items-center justify-between px-6 md:px-[60px]">
        {/* Left Side: Logo and Navigation Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">
                DocSchedule
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-8 lg:flex">
            <div className="group relative">
              <button className="flex items-center gap-1 text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]">
                Features
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <div className="invisible absolute left-0 top-full z-50 mt-3 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-lg opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-gray-400">For Doctors</p>
                  <a href="#slot-generation" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Intelligent Slot Generation</a>
                  <a href="#calendar" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Calendar & Video Consultation</a>
                  <a href="#intake-forms" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Patient Intake Form</a>
                </div>
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-gray-400">For Patients</p>
                  <a href="#booking-page" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Easy Appointment Booking</a>
                  <a href="#reports" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Reports & Email Reminders</a>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Platform</p>
                  <a href="#payments" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Payments & Automation</a>
                </div>
              </div>
            </div>

            <Link href="/pricing" className="text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]">Pricing</Link>
            <Link href="/all-doctors" className="text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]">For Doctors</Link>
          </div>
        </div>

        {/* Desktop Auth Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 h-[44px] px-6 rounded-full bg-black text-[15px] font-medium text-white shadow-lg transition-all duration-300 hover:bg-red-600">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="px-4 py-2 text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]">Login</a>
              <a href="/register" className="flex h-[44px] items-center justify-center rounded-full bg-black px-6 text-[15px] font-medium text-white shadow-lg transition-all duration-300 hover:bg-[#333333]">Sign up</a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2 text-[#1A1A1A] hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div 
          ref={mobileDrawerRef}
          className="lg:hidden absolute top-[80px] left-0 right-0 bg-white border-b border-gray-100 shadow-2xl"
        >
          <div className="flex flex-col p-6 gap-6 max-h-[85vh] overflow-y-auto">
            
            {/* STAGGERED ITEM 1: Features */}
            <div className="menu-item-stagger">
              <button
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className="flex w-full items-center justify-between py-2 text-lg font-bold text-[#1A1A1A] active:opacity-60 transition-opacity"
              >
                Features
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isFeaturesOpen ? "rotate-180 text-blue-600" : ""}`} />
              </button>

              <div ref={mobileFeaturesRef} className="overflow-hidden opacity-0 h-0">
                <div className="mt-4 space-y-6 border-l-2 border-gray-100 ml-1 pl-4 mb-2">
                  <div className="mobile-feature-item">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-500">For Doctors</p>
                    <div className="space-y-4 flex flex-col">
                        <a href="#slot-generation" onClick={() => setIsOpen(false)} className="text-[15px] text-gray-600 font-medium active:text-black">Intelligent Slot Generation</a>
                        <a href="#calendar" onClick={() => setIsOpen(false)} className="text-[15px] text-gray-600 font-medium active:text-black">Calendar & Video Consultation</a>
                        <a href="#intake-forms" onClick={() => setIsOpen(false)} className="text-[15px] text-gray-600 font-medium active:text-black">Patient Intake Form</a>
                    </div>
                  </div>

                  <div className="mobile-feature-item">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-green-500">For Patients</p>
                    <div className="space-y-4 flex flex-col">
                        <a href="#booking-page" onClick={() => setIsOpen(false)} className="text-[15px] text-gray-600 font-medium active:text-black">Easy Appointment Booking</a>
                        <a href="#reports" onClick={() => setIsOpen(false)} className="text-[15px] text-gray-600 font-medium active:text-black">Reports & Email Reminders</a>
                    </div>
                  </div>

                  <div className="mobile-feature-item">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-purple-500">Platform</p>
                    <a href="#payments" onClick={() => setIsOpen(false)} className="block text-[15px] text-gray-600 font-medium active:text-black">Payments & Automation</a>
                  </div>
                </div>
              </div>
            </div>

            {/* STAGGERED ITEM 2 & 3: Other Links */}
            <Link href="/pricing" onClick={() => setIsOpen(false)} className="menu-item-stagger text-lg font-bold text-[#1A1A1A]">
              Pricing
            </Link>
            <Link href="/all-doctors" onClick={() => setIsOpen(false)} className="menu-item-stagger text-lg font-bold text-[#1A1A1A]">
              For Doctors
            </Link>
            
            <div className="menu-item-stagger h-px bg-gray-100 w-full my-1" />
            
            {/* STAGGERED ITEM 4: Auth Actions */}
            <div className="menu-item-stagger flex flex-col gap-4 pb-2">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A]">
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </Link>
                  <button 
                    onClick={() => { setIsOpen(false); signOut({ callbackUrl: "/" }); }} 
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-bold active:scale-[0.97] transition-transform"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-semibold text-[#1A1A1A] py-2">
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setIsOpen(false)} 
                    className="bg-black text-white text-center py-4 rounded-2xl font-bold shadow-lg active:scale-[0.97] transition-transform"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;