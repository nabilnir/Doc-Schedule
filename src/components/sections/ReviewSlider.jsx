"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";

export default function ReviewSlider() {
  const [reviews, setReviews] = useState([]);

  // Fetching data from public folder
  useEffect(() => {
    fetch("/reviews.json")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, []);

  return (
    <section
      className="py-20 md:py-[120px] bg-white overflow-hidden"
      id="reviews"
    >
      {/* Custom CSS for Active Card Focus Effect & Equal Height */}
      <style>{`
        .review-swiper {
          padding-top: 20px !important;
          padding-bottom: 40px !important;
        }
        .review-swiper .swiper-slide {
          height: auto !important; /* Forces equal height for all slides */
          transition: transform 0.5s ease, opacity 0.5s ease;
          opacity: 0.4; /* পাশের কার্ডগুলো একটু ঝাপসা থাকবে */
          transform: scale(0.85); /* পাশের কার্ডগুলো একটু ছোট থাকবে */
        }
        .review-swiper .swiper-slide-active {
          opacity: 1; /* মাঝের কার্ড পুরোপুরি ক্লিয়ার থাকবে */
          transform: scale(1); /* মাঝের কার্ড নরমাল সাইজে থাকবে */
        }
      `}</style>

      {/* Main Container - Matched with your other sections */}
      <div className="container mx-auto max-w-[1440px] px-6 md:px-8">
        {/* Section Heading - Matched with your styles */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#F0F7FF] px-4 py-2 rounded-full border border-[#7BA1C7]/20 mb-8">
            <span className="text-[15px] font-semibold text-[#7BA1C7] uppercase tracking-wider">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-[56px] font-bold leading-[1.1] mb-8">
            Loved by <span className="text-[#7BA1C7]">Doctors</span> and{" "}
            <span className="text-[#7BA1C7]">Patients</span>.
          </h2>
          <p className="text-base md:text-[20px] text-[#666666] max-w-[800px]">
            See how DocSchedule is transforming healthcare management and
            simplifying bookings for everyone.
          </p>
        </div>

        {/* Swiper Slider */}
        <div className="relative">
          <Swiper
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              // Mobile
              320: {
                slidesPerView: 1.1,
                spaceBetween: 20,
              },
              // Tablet
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              // Desktop (3 Cards perfectly spaced with generous width)
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            modules={[Autoplay]}
            className="w-full review-swiper"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                {/* Review Card Design - h-full ensures equal height */}
                <div className="bg-[#F5F5F7] border border-[#E5E5E5] rounded-[30px] md:rounded-[40px] p-8 md:p-10 flex flex-col justify-between h-full group hover:border-[#7BA1C7]/30 transition-colors duration-300 text-left">
                  <div>
                    {/* Rating Stars */}
                    <div className="flex gap-1 text-yellow-500 mb-6 text-xl">
                      {Array.from({ length: Math.floor(review.rating) }).map(
                        (_, i) => (
                          <span key={i}>★</span>
                        ),
                      )}
                      {review.rating % 1 !== 0 && <span>★</span>}
                    </div>
                    {/* Comment */}
                    <p className="text-[#666666] text-base md:text-[17px] leading-relaxed">
                      {review.comment}
                    </p>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#E5E5E5]">
                    <Image
                      src={review.image}
                      alt={review.name}
                      width={64}
                      height={64}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover shadow-sm bg-white p-1"
                    />
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">
                        {review.name}
                      </h4>
                      <p className="text-sm md:text-[15px] text-[#7BA1C7] font-medium">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
