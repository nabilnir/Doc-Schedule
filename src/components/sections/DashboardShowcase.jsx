"use client";

import React from 'react';
import { LayoutDashboard, Users, TrendingUp, History } from 'lucide-react';

const DashboardShowcase = () => {
    return (
        <section className="py-[120px] bg-white overflow-hidden" id="dashboards">
            <div className="container mx-auto max-w-[1440px] px-8">
                <div className="flex flex-col items-center text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-[#F5F5F7] px-4 py-2 rounded-full border border-[#E5E5E5] mb-8">
                        <LayoutDashboard className="w-4 h-4 text-[#7BA1C7]" />
                        <span className="text-[15px] font-semibold text-[#1A1A1A]">Multi-tenant Dashboards</span>
                    </div>
                    <h2 className="text-[56px] font-bold leading-[1.1] mb-8">
                        Isolated views for <span className="text-[#7BA1C7]">Doctors</span> & <span className="text-[#7BA1C7]">Patients</span>.
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Doctor Dashboard Card */}
                    <div className="bento-card bg-[#F5F5F7] border border-[#E5E5E5] flex flex-col group hover:shadow-2xl transition-all duration-500">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Doctor Panel</h3>
                                <p className="text-[#666666]">Manage schedules, track earnings, and view daily serials.</p>
                            </div>
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-[#E5E5E5] flex-grow">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-xs text-[#666666] mb-1">Total Bookings</p>
                                    <p className="text-2xl font-bold">124</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-xs text-[#666666] mb-1">Total Revenue</p>
                                    <p className="text-2xl font-bold">$6,200</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0 text-sm">
                                        <span className="font-medium">Patient #{100 + i}</span>
                                        <span className="text-[#7BA1C7] font-bold">10:00 AM</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Patient Dashboard Card */}
                    <div className="bento-card bg-black text-white flex flex-col group hover:shadow-2xl transition-all duration-500">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-2xl font-bold mb-2 text-white">Patient Hub</h3>
                                <p className="text-white/60">Track medical history, appointments, and report uploads.</p>
                            </div>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black">
                                <History className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex-grow">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-[#7BA1C7] rounded-full"></div>
                                <div>
                                    <p className="text-sm font-bold">John Doe</p>
                                    <p className="text-xs text-white/40">Upcoming: Oct 20, 2026</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-[#7BA1C7] rounded-full"></div>
                                        <span className="text-sm">Prescription_Oct10.pdf</span>
                                    </div>
                                    <span className="text-[10px] text-white/40">Added 2 days ago</span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between opacity-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                        <span className="text-sm">Old_Report_v1.pdf</span>
                                    </div>
                                    <span className="text-[10px] text-white/40">2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardShowcase;
