"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

export default function OurStorySection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#e8f6f5] to-slate-50 dark:from-slate-950 dark:via-teal-950/10 dark:to-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 pointer-events-none">
        <div className="w-[450px] h-[450px] bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Content */}
          <div
            className="lg:col-span-7 space-y-6 text-slate-700 dark:text-slate-300"
            data-aos="fade-right"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Our Story
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              SmartWallet was born from a simple observation: managing personal
              finances in India is unnecessarily complicated. Bank SMS messages
              flood our phones, expenses slip through the cracks, and most
              people have no clear picture of where their money goes.
            </p>

            <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              We set out to change that. Built by a team passionate about
              financial technology, SmartWallet combines the power of smart
              automation with intuitive design to make money management
              effortless.
            </p>

            <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              What started as a simple expense tracker has evolved into a
              comprehensive financial companion trusted by over 100,000 users
              across India and beyond. Our journey has been driven by one goal:
              to help every Indian take control of their financial future.
            </p>
          </div>

          {/* Right Image Container */}
          <div
            className="lg:col-span-5 flex justify-center lg:justify-end"
            data-aos="fade-left"
            data-aos-delay="150"
          >
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-800 transition-transform duration-300 hover:scale-[1.01]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" // Replace with your team/office image path
                alt="SmartWallet Team Working Together"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
