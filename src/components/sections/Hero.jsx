"use client";

import React from 'react';
import Image from 'next/image';

/**
 * Hero Section for DocSchedule
 * Adapted from appointment-app-clone-frontend
 */
const Hero = () => {
    return (
        <section
            className="relative min-h-[900px] flex flex-col items-center pt-[140px] px-6 overflow-hidden hero-gradient"
        >
            {/* Decorative Blur Background Element */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FFFFFF] blur-[120px] rounded-full"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-[1440px] w-full flex flex-col items-center text-center">
                {/* Headline */}
                <h1 className="text-[72px] font-bold leading-[1.1] tracking-[-0.04em] text-[#1A1A1A] max-w-[900px] mb-6">
                    Smart Healthcare, <span className="text-[#7BA1C7]">Simplified</span>.
                </h1>

                {/* Subtext */}
                <p className="text-[20px] leading-[1.5] text-[#1A1A1A] max-w-[700px] mb-10">
                    Simplify your practice with <span className="font-semibold">automated scheduling</span>. <br />
                    Give patients a <span className="font-semibold">seamless booking experience</span>. <br />
                    <span className="font-semibold">Focus on care</span>, not on administrative tasks.
                </p>

                {/* Primary CTA */}
                <div className="flex gap-4">
                    <a
                        href="/register"
                        className="btn-primary flex items-center justify-center px-10 py-[14px] bg-black text-white rounded-full text-lg font-medium hover:scale-[1.02] transition-transform duration-300 shadow-lg"
                    >
                        Start for free
                    </a>
                    <a
                        href="#demo"
                        className="btn-secondary flex items-center justify-center px-10 py-[14px] bg-white text-black border border-[#E5E5E5] rounded-full text-lg font-medium hover:bg-[#F5F5F7] transition-colors duration-300"
                    >
                        View Demo
                    </a>
                </div>
            </div>

            {/* Visual Component: Scheduling Preview */}
            <div className="mt-20 relative w-full max-w-[1200px] flex justify-center perspective-[1000px]">
                <div className="relative w-full h-[500px] flex justify-center items-end">
                    <div className="relative w-[1000px] h-[600px] bg-white rounded-t-[40px] shadow-2xl border-t border-x border-[#E5E5E5] overflow-hidden transform translate-y-10 group hover:translate-y-0 transition-transform duration-700">
                        {/* Mock Dashboard UI */}
                        <div className="flex h-full">
                            {/* Sidebar Mock */}
                            <div className="w-64 border-r border-[#E5E5E5] bg-[#F5F5F7] p-6 space-y-4">
                                <div className="w-32 h-4 bg-gray-200 rounded-full mb-8"></div>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
                                            <div className="w-24 h-3 bg-gray-200 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Main Content Mock */}
                            <div className="flex-1 p-8">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="w-48 h-8 bg-gray-100 rounded-lg"></div>
                                    <div className="flex gap-4">
                                        <div className="w-32 h-10 bg-[#7BA1C7] rounded-full opacity-20"></div>
                                        <div className="w-32 h-10 bg-black rounded-full"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-40 bg-[#F5F5F7] rounded-2xl p-6">
                                            <div className="w-12 h-12 bg-white rounded-xl mb-4"></div>
                                            <div className="w-24 h-4 bg-gray-200 rounded-full mb-3"></div>
                                            <div className="w-16 h-3 bg-gray-200 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 h-64 bg-[#F5F5F7] rounded-2xl"></div>
                            </div>
                        </div>

                        {/* Popover "Booking Confirmed" */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-soft p-10 border border-[#E5E5E5] z-20 animate-in fade-in zoom-in-95 duration-1000 flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#F0F7FF] rounded-full flex items-center justify-center mb-6">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7BA1C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                            <p className="text-center text-[#666666] mb-8">Dr. Sarah Johnson • Tomorrow at 10:00 AM</p>
                            <div className="flex gap-4">
                                <div className="px-6 py-2 bg-[#F5F5F7] rounded-full text-sm font-medium">Add to Calendar</div>
                                <div className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium">View Instructions</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
