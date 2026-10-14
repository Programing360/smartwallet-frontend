"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";

interface PricingSectionProps {
  isDarkMode?: boolean;
}

export default function PricingSection({
  isDarkMode = true,
}: PricingSectionProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      className={`py-20 px-4 transition-colors duration-300 bg-[#e8f6f5] text-slate-900  dark:bg-[#0b1015]`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 dark:text-white">
            Simple, Transparent <br></br>
            <span className="bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p
            className={`text-sm sm:text-base ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
          >
            Choose the plan that works best for you. Start free and upgrade
            anytime.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Free Plan */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className={`flex flex-col justify-between p-8 rounded-3xl  transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-[0_10px_25px_-5px_#1c2125] ${
              isDarkMode
                ? "dark:bg-[#132529] dark:text-white border-slate-800/80 backdrop-blur-md"
                : "bg-white border-slate-200"
            }`}
          >
            <div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Free</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-sm font-medium text-slate-400">
                    INR
                  </span>
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    0
                  </span>
                </div>
                <span
                  className={`text-xs mt-1 block ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                >
                  Forever free
                </span>
              </div>

              <div
                className={`border-t my-6 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
              />

              {/* Feature List */}
              <ul className="space-y-4 text-sm mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Basic expense tracking
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Manual transaction entry
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    3-month transaction history
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Standard categories
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Basic reports
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Single device
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-slate-500 line-through">
                    SMS auto-import
                  </span>
                </li>
              </ul>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-2xl text-sm font-semibold transition-colors duration-200 border ${
                isDarkMode
                  ? "bg-slate-900 hover:bg-slate-800 text-white border-slate-700"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
              }`}
            >
              Get Started Free
            </button>
          </div>

          {/* Premium Monthly Plan (Most Popular Highlighted Card) */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className={`relative flex flex-col justify-between p-8 rounded-4xl shadow-cyan-800 transition-all duration-300 scale-105 hover:scale-[1.06] shadow-[0_15px_30px_-5px_#1c2125] bg-[#e0e1f1] text-black dark:text-white dark:bg-linear-to-b from-[#20293e] to-[#201724]`}
          >
            {/* Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-teal-400 to-indigo-500 text-white text-xs font-semibold rounded-full uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div>
              <div className="text-center mb-6 pt-2">
                <h3 className="text-lg font-semibold mb-2">Premium Monthly</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-sm font-medium text-slate-400">
                    INR
                  </span>
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    149
                  </span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <span
                  className={`text-xs mt-1 block ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  Full access to all features
                </span>
              </div>

              <div
                className={`border-t my-6 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
              />

              {/* Feature List */}
              <ul className="space-y-4 text-sm mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-slate-600 ">Everything in Free</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Unlimited transaction history
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    SMS auto-import (50+ banks)
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Advanced reports and charts
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Custom categories and tags
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Export to PDF, CSV, Excel
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Cloud sync across devices
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Priority customer support
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Ad-free experience
                  </span>
                </li>
              </ul>
            </div>

            <button className="w-full py-3.5 px-4 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 shadow-lg shadow-teal-500/25 transition-all duration-200">
              Start Premium
            </button>
          </div>

          {/* Premium Annual Plan */}
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className={`flex flex-col justify-between p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-[0_10px_25px_-5px_#1c2125] ${
              isDarkMode
                ? "dark:bg-[#132529] border-slate-800/80 backdrop-blur-md dark:text-white"
                : "bg-white border-slate-200 transition-all duration-500 ease-in-out hover:scale-105"
            }`}
          >
            <div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Premium Annual</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-sm font-medium text-slate-400">
                    INR
                  </span>
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    1,249
                  </span>
                  <span className="text-xs text-slate-400">/year</span>
                </div>
                <span className="text-xs mt-1 block text-teal-400 font-medium">
                  Save 17% (2 months free)
                </span>
              </div>

              <div
                className={`border-t my-6 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
              />

              {/* Feature List */}
              <ul className="space-y-4 text-sm mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Everything in Premium Monthly
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    2 months free
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Family sharing (up to 5 members)
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Early access to new features
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Priority feature requests
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span
                    className={isDarkMode ? "text-slate-600" : "text-slate-700"}
                  >
                    Exclusive annual member benefits
                  </span>
                </li>
              </ul>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-2xl text-sm font-semibold transition-colors duration-200 border ${
                isDarkMode
                  ? "bg-slate-900 hover:bg-slate-800 text-white border-slate-700"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
              }`}
            >
              Best Value
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
