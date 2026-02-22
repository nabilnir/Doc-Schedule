"use client";

import React from 'react';
import { UploadCloud, FileJson, Image as ImageIcon, CheckCircle } from 'lucide-react';

const ReportsSection = () => {
    return (
        <section className="py-20 md:py-[120px] bg-black text-white overflow-hidden" id="reports">
            <div className="container mx-auto max-w-[1440px] px-6 md:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-20">

                    {/* Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="inline-flex items-center gap-2 bg-[#7BA1C7] text-white px-4 py-2 rounded-full mb-8">
                            <UploadCloud className="w-4 h-4" />
                            <span className="text-[15px] font-semibold uppercase tracking-wider">Cloud Storage</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-[56px] font-bold leading-[1.1] mb-8">
                            Smart <span className="text-[#7BA1C7]">Medical Report</span> management.
                        </h2>
                        <p className="text-base md:text-[20px] text-white/60 leading-relaxed mb-10">
                            Patients can upload previous prescriptions and lab reports via <span className="text-white font-bold italic">Cloudinary</span> for instant doctor review.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                                <ImageIcon className="w-5 h-5 text-[#7BA1C7]" />
                                <span className="font-medium">Images</span>
                            </div>
                            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                                <FileJson className="w-5 h-5 text-[#7BA1C7]" />
                                <span className="font-medium">PDFs</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual: Upload UI */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#7BA1C7] to-black rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative bg-[#1A1A1A] rounded-[30px] md:rounded-[40px] p-8 md:p-12 border border-white/10">
                                <div className="border-2 border-dashed border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 flex flex-col items-center text-center space-y-4 hover:border-[#7BA1C7] transition-colors cursor-pointer">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center">
                                        <UploadCloud className="w-8 h-8 md:w-10 md:h-10 text-[#7BA1C7]" />
                                    </div>
                                    <div>
                                        <p className="text-lg md:text-xl font-bold">Drag & Drop Reports</p>
                                        <p className="text-white/40 text-sm">Max size: 10MB (PDF, JPG, PNG)</p>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                                <FileJson className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="text-sm">Blood_Test_Results.pdf</span>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-[#7BA1C7]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReportsSection;
