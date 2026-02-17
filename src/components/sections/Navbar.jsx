"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] w-full border-b border-transparent bg-white/80 backdrop-blur-[10px] transition-all duration-300">
      <div className="mx-auto flex h-[80px] max-w-[1440px] items-center justify-between px-8 md:px-[60px]">
        {/* Left Side: Logo and Navigation Links */}
        <div className="flex items-center gap-10">
          {/* DocSchedule Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">DocSchedule</span>
            </div>
          </a>

          {/* Nav Items */}
          <div className="hidden items-center gap-8 lg:flex">
             <div className="group relative">
                <button className="flex items-center gap-1 text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]">
                  Features
                  <ChevronDown className="h-4 w-4 text-[#1A1A1A]" />
                </button>
             </div>
            <a 
              href="#pricing" 
              className="text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]"
            >
              Pricing
            </a>
            <a 
              href="#doctors" 
              className="text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]"
            >
              For Doctors
            </a>
          </div>
        </div>

        {/* Right Side: Auth Actions */}
        <div className="flex items-center gap-4">
          <a 
            href="/login" 
            className="px-4 py-2 text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]"
          >
            Login
          </a>
          <a 
            href="/register" 
            className="flex h-[44px] items-center justify-center rounded-full bg-white px-6 text-[15px] font-medium text-[#1A1A1A] shadow-[0px_2px_4px_rgba(0,0,0,0.05)] border border-[#E5E5E5] transition-all duration-300 hover:bg-[#F5F5F7] hover:border-[#D1D1D1]"
          >
            Sign up
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
