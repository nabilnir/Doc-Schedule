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
            className="relative min-h-[700px] md:min-h-[900px] flex flex-col items-center pt-[100px] md:pt-[140px] px-6 overflow-hidden hero-gradient"
        >
            {/* Decorative Blur Background Element */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FFFFFF] blur-[120px] rounded-full"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-[1440px] w-full flex flex-col items-center text-center">
                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-[-0.04em] text-[#1A1A1A] max-w-[900px] mb-6">
                    Smart Healthcare, <span className="text-[#7BA1C7]">Simplified</span>.
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-[20px] leading-[1.5] text-[#1A1A1A] max-w-[700px] mb-10 px-4 md:px-0">
                    Simplify your practice with <span className="font-semibold">automated scheduling</span>. <br className="hidden md:block" />
                    Give patients a <span className="font-semibold">seamless booking experience</span>. <br className="hidden md:block" />
                    <span className="font-semibold">Focus on care</span>, not on administrative tasks.
                </p>

                {/* Primary CTA */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0">
                    <a
                        href="/register"
                        className="btn-primary flex items-center justify-center px-8 md:px-10 py-[12px] md:py-[14px] bg-black text-white rounded-full text-base md:text-lg font-medium hover:scale-[1.02] transition-transform duration-300 shadow-lg"
                    >
                        Start for free
                    </a>
                    <a
                        href="#demo"
                        className="btn-secondary flex items-center justify-center px-8 md:px-10 py-[12px] md:py-[14px] bg-white text-black border border-[#E5E5E5] rounded-full text-base md:text-lg font-medium hover:bg-[#F5F5F7] transition-colors duration-300"
                    >
                        View Demo
                    </a>
                </div>
            </div>

            {/* Visual Component: Scheduling Preview */}
            <div className="mt-12 md:mt-20 relative w-full max-w-[1200px] flex justify-center perspective-[1000px] mb-10 md:mb-0">
                <div className="relative w-full h-[300px] md:h-[500px] flex justify-center items-end">
                    <div className="relative w-full max-w-[1000px] h-[400px] md:h-[600px] bg-white rounded-t-[30px] md:rounded-t-[40px] shadow-2xl border-t border-x border-[#E5E5E5] overflow-hidden transform translate-y-10 group hover:translate-y-0 transition-transform duration-700">
                        {/* Mock Dashboard UI */}
                        <div className="flex h-full">
                            {/* Sidebar Mock - Hidden on small mobile */}
                            <div className="hidden sm:block w-32 md:w-64 border-r border-[#E5E5E5] bg-[#F5F5F7] p-4 md:p-6 space-y-4">
                                <div className="w-16 md:w-32 h-3 md:h-4 bg-gray-200 rounded-full mb-6 md:mb-8"></div>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center gap-2 md:gap-3">
                                            <div className="w-4 md:w-6 h-4 md:h-6 bg-gray-200 rounded-md"></div>
                                            <div className="w-12 md:w-24 h-2 md:h-3 bg-gray-200 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Main Content Mock */}
                            <div className="flex-1 p-4 md:p-8">
                                <div className="flex justify-between items-center mb-6 md:mb-10">
                                    <div className="w-32 md:w-48 h-6 md:h-8 bg-gray-100 rounded-lg"></div>
                                    <div className="flex gap-2 md:gap-4">
                                        <div className="w-16 md:w-32 h-8 md:h-10 bg-[#7BA1C7] rounded-full opacity-20"></div>
                                        <div className="w-16 md:w-32 h-8 md:h-10 bg-black rounded-full"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={`h-24 md:h-40 bg-[#F5F5F7] rounded-xl md:rounded-2xl p-4 md:p-6 ${i === 3 ? 'hidden md:block' : ''}`}>
                                            <div className="w-8 md:w-12 h-8 md:h-12 bg-white rounded-lg md:rounded-xl mb-3 md:mb-4"></div>
                                            <div className="w-16 md:w-24 h-3 md:h-4 bg-gray-200 rounded-full mb-2 md:mb-3"></div>
                                            <div className="w-10 md:w-16 h-2 md:h-3 bg-gray-200 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 md:mt-10 h-32 md:h-64 bg-[#F5F5F7] rounded-xl md:rounded-2xl"></div>
                            </div>
                        </div>

                        {/* Popover "Booking Confirmed" */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl md:rounded-3xl shadow-soft p-6 md:p-10 border border-[#E5E5E5] z-20 animate-in fade-in zoom-in-95 duration-1000 flex flex-col items-center w-[90%] max-w-[360px] md:max-w-none">
                            <div className="w-12 md:w-16 h-12 md:h-16 bg-[#F0F7FF] rounded-full flex items-center justify-center mb-4 md:mb-6">
                                <svg width="24" height="24" className="md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="#7BA1C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Booking Confirmed!</h3>
                            <p className="text-center text-[#666666] mb-6 md:mb-8 text-sm md:text-base">Dr. Sarah Johnson • Tomorrow at 10:00 AM</p>
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                                <div className="px-6 py-2 bg-[#F5F5F7] rounded-full text-xs md:text-sm font-medium text-center">Add to Calendar</div>
                                <div className="px-6 py-2 bg-black text-white rounded-full text-xs md:text-sm font-medium text-center">Instructions</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
