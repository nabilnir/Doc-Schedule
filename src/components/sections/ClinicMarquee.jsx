"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

const BrandMarquee = () => {
  const carouselRef = useRef(null);
  const trackRef = useRef(null);

  const brandLogos = [
    {
      name: "Mayo Clinic",
      url: "/brand/MayoClinic.jpg",
    },
    {
      name: "Cleveland Clinic",
      url: "/brand/Cleveland_Clinic.jpg",
    },
    {
      name: "Johns Hopkins",
      url: "/brand/JohnsHopkins.jpg",
    },
    {
      name: "UnitedHealthcare",
      url: "/brand/UnitedHealthcare.jpg",
    },
    {
      name: "Mount Sinai",
      url: "/brand/MountSinai.jpg",
    },
    {
      name: "Kaiser Permanente",
      url: "/brand/Kaiser-Permanente.jpg",
    },
    {
      name: "Abbott",
      url: "/brand/abbott-laboratories.jpg",
    },
    {
      name: "Novartis",
      url: "/brand/novartis-logo.avif",
    },
    {
      name: "Sanofi",
      url: "/brand/Sanofi.jpg",
    },
    {
      name: "Roche",
      url: "/brand/roche-logo.jpg",
    },
  ];

  useGSAP(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const brandElements = track.children;

    const itemWidth = 180;
    const gap = 80;
    const singleSetWidth = (itemWidth + gap) * brandLogos.length;

    gsap.set(track, { x: 0 });

    const animation = gsap.to(track, {
      x: -singleSetWidth,
      duration: 35,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % singleSetWidth),
      },
    });

    const handleMouseEnter = () => animation.pause();
    const handleMouseLeave = () => animation.play();

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("mouseenter", handleMouseEnter);
      carousel.addEventListener("mouseleave", handleMouseLeave);
    }

    gsap.from(carouselRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(brandElements, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.05,
      ease: "power3.out",
      delay: 0.2,
    });

    return () => {
      if (carousel) {
        carousel.removeEventListener("mouseenter", handleMouseEnter);
        carousel.removeEventListener("mouseleave", handleMouseLeave);
      }
      animation.kill();
    };
  }, []);

  return (
    <section
      className="py-20 md:py-[120px] bg-white overflow-hidden"
      id="partners"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#F0F7FF] px-4 py-2 rounded-full border border-[#7BA1C7]/20 mb-8">
            <div className="w-2 h-2 bg-[#7BA1C7] rounded-full animate-pulse"></div>
            <span className="text-[15px] font-semibold text-[#7BA1C7] uppercase tracking-wider">
              Global Network
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[56px] font-bold leading-[1.1] mb-8">
            Trusted by Leading{" "}
            <span className="text-[#7BA1C7]">Healthcare Brands</span>.
          </h2>

          <p className="text-base md:text-[20px] text-[#666666] max-w-[800px]">
            Collaborating with world-class hospitals and medical institutions to
            digitize and simplify healthcare management.
          </p>
        </div>

        {/* Carousel Container */}
        <div ref={carouselRef} className="relative mt-8">
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="overflow-hidden py-4">
            <div
              ref={trackRef}
              className="flex items-center will-change-transform"
              style={{
                width: "fit-content",
                gap: "80px",
                transform: "translate3d(0, 0, 0)",
              }}
            >
              {[...brandLogos, ...brandLogos].map((brand, index) => (
                <div
                  key={`brand-${index}`}
                  className="group shrink-0 relative flex items-center justify-center cursor-pointer"
                  style={{ width: "180px", height: "80px" }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={brand.url}
                      alt={`${brand.name} logo`}
                      fill
                      sizes="(max-width: 768px) 100vw, 180px"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandMarquee;
