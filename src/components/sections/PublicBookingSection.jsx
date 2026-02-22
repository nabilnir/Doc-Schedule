"use client";

import React from 'react';
import { User, Shield, Share2, Globe } from 'lucide-react';

const PublicBookingSection = () => {
    return (
        <section className="py-20 md:py-[120px] bg-white overflow-hidden" id="booking-page">
            <div className="container mx-auto max-w-[1440px] px-6 md:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Visual: Profile Page Mockup */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative z-10 bg-[#F5F5F7] rounded-[30px] md:rounded-[40px] p-2 border border-[#E5E5E5] shadow-2xl overflow-hidden group">
                            <div className="bg-white rounded-[28px] md:rounded-[38px] p-6 md:p-10">
                                <div className="flex flex-col items-center text-center space-y-4 mb-10">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#7BA1C7]/20 shadow-xl">
                                        <img
                                            src="/homepage/Melona Wills.jpg"
                                            alt="Dr. Melona Wills"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold">Dr. Melona Wills</h4>
                                        <p className="text-[#666666]">Cardiologist • 12 years exp.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">BDS</span>
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">FCPS</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-4 bg-[#F5F5F7] rounded-2xl border border-transparent group-hover:border-[#7BA1C7] transition-colors">
                                        <p className="text-sm font-bold mb-2 uppercase tracking-wide text-[#7BA1C7]">Select Service</p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Initial Consultation</span>
                                            <span className="text-sm font-bold">$50</span>
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:scale-[1.02] transition-transform">
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-6 -right-6 bg-white shadow-xl rounded-2xl p-4 border border-[#E5E5E5] z-20 animate-bounce">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Globe className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-sm font-bold">Live in 5 minutes</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="inline-flex items-center gap-2 bg-[#F5F5F7] px-4 py-2 rounded-full border border-[#E5E5E5] mb-6 md:mb-8">
                            <User className="w-4 h-4 text-[#7BA1C7]" />
                            <span className="text-[13px] md:text-[15px] font-semibold text-[#1A1A1A]">Public Booking Page</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-[56px] font-bold leading-[1.1] text-[#1A1A1A] mb-6 md:mb-8">
                            A <span className="text-[#7BA1C7]">professional URL</span> for your practice.
                        </h2>
                        <p className="text-base md:text-[20px] text-[#666666] leading-relaxed mb-10">
                            Each doctor gets a unique, SEO-optimized public profile where patients can view schedules, specialties, and book directly.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-[#F0F7FF] rounded-2xl flex items-center justify-center text-[#7BA1C7]">
                                    <Share2 className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold">Share Anywhere</h4>
                                <p className="text-[#666666]">Link your profile in social media, business cards, or your clinic's website.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-[#F0F7FF] rounded-2xl flex items-center justify-center text-[#7BA1C7]">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold">Secure Booking</h4>
                                <p className="text-[#666666]">End-to-end encrypted booking flow ensuring patient data privacy.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PublicBookingSection;
