"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

const SmartSlotBento = () => {
    const [activeSlots, setActiveSlots] = useState([true, false, true, false, true, true]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlots(prev => prev.map(() => Math.random() > 0.5));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-[120px] bg-white overflow-hidden" id="features">
            <div className="container mx-auto max-w-[1440px] px-8">
                {/* Section Heading */}
                <div className="flex flex-col items-center mb-[60px]">
                    <h2 className="text-[56px] font-semibold tracking-[-0.02em] leading-[1.2] text-[#1A1A1A] text-center mb-6">
                        Intelligent <span className="text-[#7BA1C7]">Slot Generation</span>
                    </h2>
                    <p className="text-[20px] text-[#666666] text-center max-w-[600px]">
                        Automatically create available time slots based on your working hours and preferences.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[700px]">

                    {/* Bento Card 1: Slot Engine */}
                    <div className="md:col-span-8 bento-card bg-[#F5F5F7] flex flex-col relative group overflow-hidden">
                        <div className="mb-6 relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#E5E5E5] mb-4">
                                <Clock className="w-4 h-4 text-[#7BA1C7]" strokeWidth={2.5} />
                                <span className="text-[15px] font-medium text-[#1A1A1A]">Scheduling Engine</span>
                            </div>
                            <h3 className="text-[32px] font-semibold leading-[1.3] text-[#1A1A1A] max-w-[400px]">
                                Smart Slot Generation based on your availability
                            </h3>
                        </div>

                        {/* Visual: Slot Grid */}
                        <div className="flex-grow flex items-center justify-center py-8">
                            <div className="grid grid-cols-3 gap-4 w-full max-w-[500px]">
                                {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"].map((time, i) => (
                                    <div
                                        key={i}
                                        className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col items-center gap-2 ${activeSlots[i]
                                                ? "bg-white border-[#7BA1C7] shadow-lg scale-105"
                                                : "bg-gray-100 border-transparent opacity-50"
                                            }`}
                                    >
                                        <span className={`text-sm font-bold ${activeSlots[i] ? "text-[#7BA1C7]" : "text-gray-400"}`}>
                                            {time}
                                        </span>
                                        {activeSlots[i] && <CheckCircle2 className="w-4 h-4 text-[#7BA1C7]" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto relative z-10">
                            <p className="text-[#666666] mb-6 max-w-[300px]">Define your hours, we handle the rest with conflict checking.</p>
                            <a href="#" className="inline-flex items-center text-[15px] font-medium text-[#1A1A1A] hover:opacity-70 transition-opacity bg-white px-6 py-3 rounded-full shadow-sm">
                                How it works <ChevronRight className="ml-1 w-4 h-4" />
                            </a>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#7BA1C7]/10 to-transparent rounded-bl-[100px] -z-0"></div>
                    </div>

                    {/* Bento Card 2: Public Profile */}
                    <div className="md:col-span-4 bento-card bg-black text-white flex flex-col relative overflow-hidden group">
                        <div className="mb-6 relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 mb-4">
                                <Calendar className="w-4 h-4 text-[#7BA1C7]" strokeWidth={2.5} />
                                <span className="text-[15px] font-medium text-white">Public Profile</span>
                            </div>
                            <h3 className="text-[28px] font-semibold leading-[1.3] text-white">
                                Your professional booking page
                            </h3>
                        </div>

                        {/* Visual: Profile Link UI */}
                        <div className="flex-grow flex items-center justify-center">
                            <div className="w-full bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-[#7BA1C7] rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="w-24 h-3 bg-white/20 rounded-full"></div>
                                        <div className="w-16 h-2 bg-white/10 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                                    <span className="text-xs text-white/60 truncate">docschedule.com/dr-sarah</span>
                                    <div className="w-4 h-4 bg-white/20 rounded"></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto relative z-10">
                            <p className="text-white/60 mb-6">A clean, professional URL to share with your patients anywhere.</p>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#7BA1C7]/20 rounded-full blur-3xl"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SmartSlotBento;
