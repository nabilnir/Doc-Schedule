"use client";

import Link from 'next/link';
import { Mail, Lock, ChevronRight, User } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#85A9D2] via-[#A8C4E5] to-[#F5F5F7] flex flex-col items-center justify-center p-4 relative">

            {/* Logo / Header */}
            <div className="mb-6 flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg text-[#3CA9DB] font-bold text-lg">
                        D
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">DocSchedule</span>
                </Link>
            </div>

            <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col items-center text-center mb-6">
                        {/* Avatar Circle */}
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-[#F5F5F7]">
                            <div className="w-full h-full rounded-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                                <User className="w-8 h-8 text-blue-200 mt-1" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold mb-1 tracking-tight">Welcome to DocSchedule</h1>
                        <p className="text-[#666666] text-sm">Enter your email to begin.</p>
                    </div>

                    <form className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-800 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="doctor@docschedule.com"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] focus:ring-4 focus:ring-[#3CA9DB]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[13px] font-bold text-gray-800">Password</label>
                                <Link href="#" className="text-xs font-semibold text-[#3CA9DB] hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] focus:ring-4 focus:ring-[#3CA9DB]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                />
                            </div>
                        </div>

                        <button className="w-full py-3.5 bg-[#3CA9DB] text-white rounded-xl font-bold text-base hover:bg-[#3498C5] transition-all shadow-[0_8px_16px_rgba(60,169,219,0.3)] active:scale-[0.98]">
                            Continue
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-4">
                        <p className="text-[#666666] text-sm">
                            Don't have an account? <Link href="/register" className="text-[#3CA9DB] font-bold hover:underline">Sign up for free</Link>
                        </p>
                        <p className="text-[#666666]/50 text-xs">
                            Need help? <Link href="#" className="text-[#3CA9DB]/70 font-semibold hover:underline">Contact Us</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Global Footer */}
            <div className="mt-8 text-[#666666]/70 text-[13px] font-medium">
                © 2026 DocSchedule App
            </div>

            {/* Chat button mockup (optional, but in the screenshot) */}
            <div className="fixed bottom-6 right-6 w-14 h-14 bg-[#333] rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
            </div>
        </div>
    );
}
