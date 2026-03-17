"use client";

import React from 'react';
import { Mail, Bell, Zap, BellRing } from 'lucide-react';

const EmailRemindersSection = () => {
    return (
        <section className="py-20 md:py-[120px] bg-white overflow-hidden" id="reminders">
            <div className="container mx-auto max-w-[1440px] px-6 md:px-8">
                <div className="flex flex-col items-center text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-[#F0F7FF] px-4 py-2 rounded-full border border-[#7BA1C7]/20 mb-8">
                        <Zap className="w-4 h-4 text-[#7BA1C7]" fill="currentColor" />
                        <span className="text-[15px] font-semibold text-[#7BA1C7] uppercase tracking-wider">Powered by Resend</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-[56px] font-bold leading-[1.1] mb-8">
                        Automated <span className="text-[#7BA1C7]">Email Reminders</span>.
                    </h2>
                    <p className="text-base md:text-[20px] text-[#666666] max-w-[800px]">
                        Keep patients informed with systematic notifications for booking confirmations and pre-appointment alerts.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <div className="p-8 md:p-10 bg-[#F5F5F7] rounded-[30px] md:rounded-[40px] border border-[#E5E5E5] space-y-4 md:space-y-6 group hover:translate-y-[-10px] transition-transform duration-500">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm">
                            <Mail className="w-6 h-6 md:w-7 md:h-7 text-[#7BA1C7]" />
                        </div>
                        <h4 className="text-xl md:text-2xl font-bold">Booking Confirmation</h4>
                        <p className="text-[#666666] text-sm md:text-base">Instant emails sent to both doctor and patient with appointment details.</p>
                    </div>

                    <div className="p-8 md:p-10 bg-[#F5F5F7] rounded-[30px] md:rounded-[40px] border border-[#E5E5E5] space-y-4 md:space-y-6 group hover:translate-y-[-10px] transition-transform duration-500 delay-100">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm">
                            <Bell className="w-6 h-6 md:w-7 md:h-7 text-[#7BA1C7]" />
                        </div>
                        <h4 className="text-xl md:text-2xl font-bold">2-Hour Reminder</h4>
                        <p className="text-[#666666] text-sm md:text-base">Automatic alerts sent before the session to reduce no-shows by up to 40%.</p>
                    </div>

                    <div className="p-8 md:p-10 bg-[#F5F5F7] rounded-[30px] md:rounded-[40px] border border-[#E5E5E5] space-y-4 md:space-y-6 group hover:translate-y-[-10px] transition-transform duration-500 delay-200">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm">
                            <BellRing className="w-6 h-6 md:w-7 md:h-7 text-[#7BA1C7]" />
                        </div>
                        <h4 className="text-xl md:text-2xl font-bold">Post-Session Follow-up</h4>
                        <p className="text-[#666666] text-sm md:text-base">Request feedback or share digital prescriptions automatically.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmailRemindersSection;
