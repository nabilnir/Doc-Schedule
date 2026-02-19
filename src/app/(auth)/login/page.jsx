"use client";

import React from 'react';
import { Mail, Lock, ChevronRight } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
            <div className="w-full max-w-[480px] bg-white rounded-[40px] shadow-2xl border border-[#E5E5E5] overflow-hidden">
                <div className="p-12">
                    <div className="flex flex-col items-center text-center mb-10">
                        <a href="/" className="mb-8">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">D</span>
                            </div>
                        </a>
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-[#666666]">Sign in to manage your healthcare connections.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase ml-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="doctor@docschedule.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#7BA1C7] focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-2">
                                <label className="text-sm font-bold text-gray-400 uppercase">Password</label>
                                <a href="#" className="text-xs font-bold text-[#7BA1C7] hover:underline">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#7BA1C7] focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl">
                            Sign In
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-[#666666]">Don't have an account? <a href="/register" className="text-black font-bold hover:underline">Sign up for free</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
