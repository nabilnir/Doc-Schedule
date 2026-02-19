"use client";

import React, { useState } from 'react';
import { User, Phone, Mail, Lock, ChevronRight, Stethoscope, UserCircle } from 'lucide-react';

export default function RegisterPage() {
    const [role, setRole] = useState('patient');

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
            <div className="w-full max-w-[560px] bg-white rounded-[40px] shadow-2xl border border-[#E5E5E5] overflow-hidden">
                <div className="p-12">
                    <div className="flex flex-col items-center text-center mb-10">
                        <a href="/" className="mb-8">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">D</span>
                            </div>
                        </a>
                        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                        <p className="text-[#666666]">Join the future of healthcare scheduling.</p>
                    </div>

                    {/* Role Selector */}
                    <div className="flex gap-4 mb-10">
                        <button
                            onClick={() => setRole('patient')}
                            className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'patient' ? 'border-black bg-black text-white shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                        >
                            <UserCircle className="w-6 h-6" />
                            <span className="text-sm font-bold">Patient</span>
                        </button>
                        <button
                            onClick={() => setRole('doctor')}
                            className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'doctor' ? 'border-black bg-black text-white shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                        >
                            <Stethoscope className="w-6 h-6" />
                            <span className="text-sm font-bold">Doctor</span>
                        </button>
                    </div>

                    <form className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase ml-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#7BA1C7] focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase ml-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#7BA1C7] focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase ml-2">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#7BA1C7] focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase ml-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#7BA1C7] focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="col-span-2 mt-4">
                            <button className="w-full py-5 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl">
                                Register as {role === 'patient' ? 'Patient' : 'Doctor'}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-[#666666]">Already have an account? <a href="/login" className="text-black font-bold hover:underline">Sign in</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
