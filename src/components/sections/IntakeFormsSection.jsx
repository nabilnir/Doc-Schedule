"use client";

import React from 'react';
import { PencilLine, ListChecks, HeartPulse, FileText } from 'lucide-react';

const IntakeFormsSection = () => {
    return (
        <section className="py-20 md:py-[120px] bg-white overflow-hidden" id="intake-forms">
            <div className="container mx-auto max-w-[1440px] px-6 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Visual: Intake Form Mockup */}
                    <div className="relative">
                        <div className="bg-white rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-2xl border border-[#E5E5E5] transform hover:-rotate-1 transition-transform">
                            <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Patient Intake Form</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase">Primary Symptoms</label>
                                    <div className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#7BA1C7] outline-none min-h-[100px] text-sm italic">
                                        "Constant back pain for 3 days..."
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-400 uppercase">Medical History</label>
                                    <div className="flex gap-4">
                                        <div className="flex-1 p-4 bg-[#F0F7FF] border border-[#7BA1C7]/20 rounded-2xl flex items-center justify-between">
                                            <span className="text-sm font-medium">Diabetes</span>
                                            <div className="w-5 h-5 bg-[#7BA1C7] rounded-full flex items-center justify-center">
                                                <CheckIcon className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 p-4 bg-gray-50 border border-transparent rounded-2xl flex items-center justify-between">
                                            <span className="text-sm font-medium">Asthma</span>
                                            <div className="w-5 h-5 border border-gray-200 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-2xl opacity-60">
                                    <FileText className="w-5 h-5" />
                                    <span className="text-sm">Old_Prescription.pdf uploaded</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative */}
                        <div className="hidden md:flex absolute -bottom-10 -left-10 w-24 h-24 bg-black rounded-3xl items-center justify-center text-white transform -rotate-12 shadow-xl">
                            <PencilLine className="w-10 h-10" />
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-[#F5F5F7] px-4 py-2 rounded-full border border-[#E5E5E5] mb-8">
                            <ListChecks className="w-4 h-4 text-[#7BA1C7]" />
                            <span className="text-[15px] font-semibold text-[#1A1A1A]">Digital Intake</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-[56px] font-bold leading-[1.1] text-[#1A1A1A] mb-8">
                            Prepare before the <span className="text-[#7BA1C7]">consultation</span>.
                        </h2>
                        <p className="text-base md:text-[20px] text-[#666666] leading-relaxed mb-10">
                            Collect custom patient information, symptoms, and medical history during the booking process.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shrink-0">
                                    <HeartPulse className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">Comprehensive History</h4>
                                    <p className="text-[#666666]">Doctors arrive prepared with full context of the patient's condition.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

const CheckIcon = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default IntakeFormsSection;
