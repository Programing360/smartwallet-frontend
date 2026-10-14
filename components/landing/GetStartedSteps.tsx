"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface StepItem {
  number: string;
  title: string;
  description: string;
}

const stepsData: StepItem[] = [
  {
    number: "1",
    title: "Download the App",
    description: "Get SmartWallet from the Play Store or App Store for free.",
  },
  {
    number: "2",
    title: "Create Your Account",
    description: "Sign up in seconds with your email or phone number.",
  },
  {
    number: "3",
    title: "Enable SMS Parsing",
    description: "Optionally enable SMS to auto-import your bank transactions.",
  },
  {
    number: "4",
    title: "Start Saving",
    description: "Set budgets and reach your financial goals easily.",
  },
];

export default function GetStartSteps() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#d8f0ee] dark:from-slate-950 dark:via-teal-950/10 dark:to-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Background ambient glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Get Started in{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Start managing your finances smarter in just a few minutes.
          </p>
        </div>

        {/* Steps Grid / Timeline Container */}
        <div className="relative">
          {/* Connecting Line behind the circles (Visible on large screens) */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] -translate-y-1/2 h-[2px] bg-teal-200/60 dark:bg-teal-800/40 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {stepsData.map((step, index) => (
              <div
                key={step.number}
                data-aos="fade-up"
                data-aos-delay={index * 150}
                className="flex flex-col items-center text-center group"
              >
                {/* Step Circle with Gradient Ring & Shadow */}
                <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-900/50 shadow-lg shadow-teal-500/5 dark:shadow-teal-950/30 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-teal-400 dark:group-hover:border-teal-600 transition-all duration-300">
                  <span className="text-2xl font-bold bg-gradient-to-br from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                    {step.number}
                  </span>
                </div>

                {/* Step Content */}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
