"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarSection = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [selectedDay, setSelectedDay] = useState(2); // Wednesday

    return (
        <section className="py-[120px] bg-[#F5F5F7]" id="calendar">
            <div className="container mx-auto max-w-[1440px] px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Content */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 bg-[#7BA1C7]/10 px-4 py-2 rounded-full border border-[#7BA1C7]/20 mb-8">
                            <CalendarIcon className="w-4 h-4 text-[#7BA1C7]" />
                            <span className="text-[15px] font-semibold text-[#7BA1C7] uppercase tracking-wider">Real-Time Calendar</span>
                        </div>
                        <h2 className="text-[56px] font-bold leading-[1.1] text-[#1A1A1A] mb-8">
                            Seamless <span className="text-[#7BA1C7]">interactive</span> calendar.
                        </h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="mt-1 w-6 h-6 bg-black rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-white text-xs font-bold">1</span>
                                </div>
                                <div>
                                    <h4 className="text-[20px] font-bold text-[#1A1A1A] mb-2">Instant Availability</h4>
                                    <p className="text-[#666666] leading-relaxed">Patients see exactly when you are available. No more phone calls or back-and-forth emails.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 w-6 h-6 bg-black rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-white text-xs font-bold">2</span>
                                </div>
                                <div>
                                    <h4 className="text-[20px] font-bold text-[#1A1A1A] mb-2">Automated Conflict Checking</h4>
                                    <p className="text-[#666666] leading-relaxed">The system automatically blocks overlapping appointments and syncs with your Google Calendar.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual: Calendar UI */}
                    <div className="order-1 lg:order-2 perspective-[2000px]">
                        <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-[#E5E5E5] transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-bold">October 2026</h3>
                                <div className="flex gap-2">
                                    <button className="p-2 border border-[#E5E5E5] rounded-full hover:bg-gray-50"><ChevronLeft className="w-5 h-5" /></button>
                                    <button className="p-2 border border-[#E5E5E5] rounded-full hover:bg-gray-50"><ChevronRight className="w-5 h-5" /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-4 mb-8">
                                {days.map((day, i) => (
                                    <div key={day} className="text-center text-sm font-semibold text-[#666666]">
                                        {day}
                                    </div>
                                ))}
                                {Array.from({ length: 31 }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDay(i)}
                                        className={`h-12 w-full rounded-2xl flex items-center justify-center text-sm font-medium transition-all ${selectedDay === i
                                                ? "bg-black text-white shadow-xl scale-110"
                                                : i % 4 === 0 ? "bg-[#F0F7FF] text-[#7BA1C7] hover:bg-black hover:text-white" : "text-gray-300 pointer-events-none"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-[#E5E5E5]">
                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-[#666666]">12 slots available this week</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CalendarSection;
