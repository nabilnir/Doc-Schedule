"use client";

import React from 'react';
import { Calendar, RefreshCw, Smartphone, Check } from 'lucide-react';

const GoogleSyncSection = () => {
    return (
        <section className="py-20 md:py-[120px] bg-black text-white overflow-hidden" id="google-sync">
            <div className="container mx-auto max-w-[1440px] px-6 md:px-8">
                <div className="flex flex-col items-center text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 mb-8">
                        <RefreshCw className="w-4 h-4 text-[#7BA1C7] animate-spin-slow" />
                        <span className="text-[15px] font-semibold text-[#7BA1C7] uppercase tracking-wider">Never Miss a Connection</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-[56px] font-bold leading-[1.1] mb-8">
                        Syncs with <span className="text-[#7BA1C7]">Google Calendar</span>.
                    </h2>
                    <p className="text-base md:text-[20px] text-white/60 max-w-[800px]">
                        Once a booking is confirmed, it's automatically added to your existing calendar. No scheduling conflicts, ever.
                    </p>
                </div>

                <div className="relative max-w-[1000px] mx-auto">
                    {/* Visual: Phone Mockup with Google Calendar */}
                    <div className="relative z-10 flex justify-center">
                        <div className="w-[280px] md:w-[300px] h-[550px] md:h-[600px] bg-[#1A1A1A] rounded-[50px] md:rounded-[60px] border-8 border-[#333] p-1 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 md:w-40 h-6 md:h-8 bg-[#333] rounded-b-3xl z-20"></div>
                            <div className="bg-white h-full w-full rounded-[40px] md:rounded-[50px] p-4 md:p-6 text-black">
                                <div className="flex justify-between items-center mb-8 pt-4">
                                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">31</div>
                                    <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-[10px] font-bold text-blue-600 uppercase">10:00 AM</p>
                                        <p className="text-sm font-bold">Team Meeting</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-2xl shadow-md animate-pulse">
                                        <p className="text-[10px] font-bold text-blue-600 uppercase">11:30 AM</p>
                                        <p className="text-sm font-bold">DocSchedule: Sarah J.</p>
                                        <div className="mt-2 flex items-center gap-1">
                                            <Check className="w-3 h-3 text-blue-600" />
                                            <span className="text-[10px] text-blue-600">Synced</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">01:00 PM</p>
                                        <p className="text-sm font-bold">Lunch Break</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Icons */}
                        <div className="flex absolute top-20 -left-6 md:-left-20 w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl shadow-2xl items-center justify-center transform -rotate-12 z-20">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <div className="flex absolute bottom-40 -right-6 md:-right-20 w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl shadow-2xl items-center justify-center transform rotate-12 z-20">
                            <Smartphone className="w-8 h-8 md:w-10 md:h-10 text-gray-800" />
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default GoogleSyncSection;
