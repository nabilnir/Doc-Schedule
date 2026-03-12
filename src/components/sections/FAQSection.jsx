"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "How do I book an appointment with a doctor?",
            answer: "Simply visit our platform, browse available doctors, select your preferred time slot, and complete the booking. You'll receive a confirmation email with all the details. The entire process takes less than 2 minutes."
        },
        {
            question: "Is my patient data secure?",
            answer: "Yes, we prioritize patient privacy and security. All data is encrypted and stored securely following HIPAA compliance standards. We use industry-leading security protocols to protect your sensitive medical information."
        },
        {
            question: "Can I reschedule or cancel my appointment?",
            answer: "Of course! You can reschedule or cancel your appointment up to 24 hours before the scheduled time through your dashboard. Simply navigate to your appointments and click the reschedule or cancel option."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, Mastercard, American Express), digital wallets, and bank transfers. All payments are processed securely through our encrypted payment gateway."
        },
        {
            question: "How does the email reminder system work?",
            answer: "You'll receive automated email reminders 24 hours and 1 hour before your appointment. These reminders include all relevant appointment details and a direct link to join or reschedule if needed."
        },
        {
            question: "Can doctors access my medical history during consultation?",
            answer: "Yes, if you've uploaded medical reports or prescriptions during your intake form, the doctor can access them during the consultation. This helps them provide better and more informed care."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-20 md:py-[120px] bg-white overflow-hidden" id="faq">
            <div className="container mx-auto max-w-[1440px] px-6 md:px-8">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-[#F5F5F7] px-4 py-2 rounded-full border border-[#E5E5E5] mb-6">
                        <HelpCircle className="w-4 h-4 text-[#7BA1C7]" />
                        <span className="text-[15px] font-semibold text-[#1A1A1A]">Frequently Asked</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-[56px] font-bold leading-[1.1] text-[#1A1A1A] mb-6 max-w-[900px]">
                        Common Questions <span className="text-[#7BA1C7]">Answered</span>.
                    </h2>
                    <p className="text-base md:text-[20px] text-[#666666] leading-relaxed max-w-[700px]">
                        Find answers to frequently asked questions about our platform, appointments, and services.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-[900px] mx-auto">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-[#E5E5E5] rounded-[20px] overflow-hidden transition-all duration-300 hover:border-[#7BA1C7]/50 hover:shadow-lg"
                            >
                                {/* Question Button */}
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 md:px-8 py-5 md:py-6 bg-white hover:bg-[#F5F5F7] transition-colors flex items-center justify-between group"
                                >
                                    <span className="text-left text-base md:text-lg font-semibold text-[#1A1A1A] group-hover:text-[#7BA1C7] transition-colors">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-[#7BA1C7] shrink-0 transition-transform duration-300 ${
                                            activeIndex === index ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {/* Answer */}
                                {activeIndex === index && (
                                    <div className="px-6 md:px-8 pb-6 bg-[#F5F5F7] border-t border-[#E5E5E5]">
                                        <p className="text-base text-[#666666] leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CTA Footer */}
                    <div className="mt-12 p-8 md:p-10 bg-[#F0F7FF] border border-[#7BA1C7]/20 rounded-[30px] text-center">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
                            Still have questions?
                        </h3>
                        <p className="text-base md:text-lg text-[#666666] mb-6">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <a
                            href="mailto:support@docschedule.com"
                            className="inline-block px-8 py-3 bg-[#7BA1C7] text-white rounded-full font-semibold hover:bg-[#6a8fb0] transition-colors duration-300"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
