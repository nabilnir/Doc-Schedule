"use client";

import React from 'react';
import { ChevronDown, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] w-full border-b border-transparent bg-white/80 backdrop-blur-[10px] transition-all duration-300">
      <div className="mx-auto flex h-[80px] max-w-[1440px] items-center justify-between px-6 md:px-[60px]">
        {/* Left Side: Logo and Navigation Links */}
        <div className="flex items-center gap-10">
          {/* DocSchedule Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">DocSchedule</span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-8 lg:flex">
            <div className="group relative">
              <button className="flex items-center gap-1 text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]">
                Features
                <ChevronDown className="h-4 w-4 text-[#1A1A1A]" />
              </button>
            </div>
            <a href="/pricing" className="text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]">
              Pricing
            </a>
            <a href="/all-doctors" className="text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]">
              For Doctors
            </a>
          </div>
        </div>

        {/* Desktop Auth Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 h-[44px] px-6 rounded-full bg-black text-[15px] font-medium text-white shadow-lg transition-all duration-300 hover:bg-red-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="px-4 py-2 text-[15px] font-medium text-[#1A1A1A] transition-colors hover:text-[#666666]">
                Login
              </a>
              <a
                href="/register"
                className="flex h-[44px] items-center justify-center rounded-full bg-black px-6 text-[15px] font-medium text-white shadow-lg transition-all duration-300 hover:bg-[#333333]"
              >
                Sign up
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-[#1A1A1A]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-[80px] left-0 right-0 bg-white border-b border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-6 gap-6">
            <a href="#features" onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#1A1A1A]">Features</a>
            <a href="#pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#1A1A1A]">Pricing</a>
            <a href="/all-doctors" onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#1A1A1A]">For Doctors</a>
            <div className="h-px bg-gray-100 w-full my-2" />
            <div className="flex flex-col gap-4">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg font-medium text-[#1A1A1A]">
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }); }}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white text-center py-4 rounded-2xl font-bold"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#1A1A1A]">Login</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="bg-black text-white text-center py-4 rounded-2xl font-bold">Sign up</Link>
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
