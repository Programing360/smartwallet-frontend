"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronDown, Wallet, ShieldCheck, BarChart3, LineChart, Sun, Moon } from "lucide-react";

interface SlideData {
  id: number;
  title: string;
  amount: string;
  change: string;
  isPositive: boolean;
  insight: string;
  type: "income" | "expense" | "savings";
}

const slideData: SlideData[] = [
  {
    id: 1,
    title: "Monthly Expenses",
    amount: "$1,240.50",
    change: "-12% from last month",
    isPositive: true,
    insight: "AI Insight: You saved $140 this week by cutting down on dining out. Keep it up!",
    type: "expense",
  },
  {
    id: 2,
    title: "Total Net Worth",
    amount: "$24,850.00",
    change: "+8.4% growth",
    isPositive: true,
    insight: "AI Insight: Your investments are outperforming your target by 2.3% this quarter.",
    type: "income",
  },
  {
    id: 3,
    title: "Automated Savings",
    amount: "$4,500.00",
    change: "On track for goal",
    isPositive: true,
    insight: "AI Insight: At this rate, you will reach your 'Emergency Fund' goal 3 weeks early.",
    type: "savings",
  },
];

export default function Hero(): React.JSX.Element {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  // Set initial state to false for Light Mode by default
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideData.length);
    }, 6000); // 6s Auto Slider Loop

    return () => clearInterval(timer);
  }, []);

  return (
    <section className={`relative min-h-[70vh] flex flex-col justify-between items-center overflow-hidden px-4 sm:px-6 lg:px-8 py-12 md:py-16 transition-colors duration-500 font-sans ${
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* Background SVG Grid Pattern Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.35]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDarkMode ? "rgba(79, 70, 229, 0.15)" : "rgba(79, 70, 229, 0.08)"} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Ambient Radial Glass Glow Filters */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[120px] transition-colors duration-500 ${
          isDarkMode ? "bg-indigo-600/15" : "bg-indigo-500/10"
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full blur-[120px] transition-colors duration-500 ${
          isDarkMode ? "bg-emerald-600/15" : "bg-emerald-500/10"
        }`} />
      </div>

      {/* Mode Switcher Control Top Right Corner */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-xl border transition-all duration-300 backdrop-blur-md ${
            isDarkMode 
              ? "bg-slate-900/40 border-slate-800 text-amber-400 hover:bg-slate-800/60" 
              : "bg-white/50 border-slate-200 text-indigo-600 hover:bg-slate-100/80 shadow-sm"
          }`}
          aria-label="Toggle layout mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 my-auto">
        
        {/* Left Side Component: Structured Content with Bottom-to-Top Keyframe Animation */}
        <div className="flex flex-col space-y-6 text-center lg:text-left animate-[slideUp_0.8s_ease-out_forwards]">
          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border rounded-full backdrop-blur-md ${
              isDarkMode 
                ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" 
                : "text-indigo-600 bg-indigo-50 border-indigo-200"
            }`}>
              <Sparkles className="w-3.5 h-3.5" /> Powered by Smart AI
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Track Your Money, <br />
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
              isDarkMode ? "from-indigo-400 to-emerald-400" : "from-indigo-600 to-emerald-500"
            }`}>
              Let AI Do the Thinking
            </span>
          </h1>

          <p className={`max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed ${
            isDarkMode ? "text-slate-400" : "text-slate-600"
          }`}>
            Connect your accounts securely. Experience automatic transaction categorization, instant budgeting limits, and personalized wealth-building insights driven by artificial intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/register"
              className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 group shadow-lg ${
                isDarkMode 
                  ? "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-indigo-600/20" 
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-600/10"
              }`}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold border rounded-xl transition-all duration-200 backdrop-blur-md flex items-center justify-center gap-2 ${
                isDarkMode 
                  ? "text-slate-300 bg-slate-900/50 hover:bg-slate-800/80 border-slate-800" 
                  : "text-slate-700 bg-white/60 hover:bg-slate-100 border-slate-200"
              }`}
            >
              Try Demo
            </Link>
          </div>

          <div className={`flex items-center justify-center lg:justify-start gap-2 text-xs ${
            isDarkMode ? "text-slate-500" : "text-slate-400"
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>No credit card required. Bank-grade 256-bit security.</span>
          </div>
        </div>

        {/* Right Side Component: Infinite Slider Module with 6s Transition Loop & Deep Glass Effects */}
        <div className="relative w-full max-w-md mx-auto lg:max-w-none flex justify-center items-center h-[340px]">
          {slideData.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute w-full max-w-lg transition-all duration-700 ease-in-out ${
                  isActive
                    ? "opacity-100 scale-100 translate-x-0 pointer-events-auto z-20"
                    : "opacity-0 scale-95 translate-x-8 pointer-events-none z-10"
                }`}
              >
                {/* Primary Glass Panel Card Interface */}
                <div className={`border backdrop-blur-xl rounded-xl p-6 shadow-2xl transition-colors duration-500 ${
                  isDarkMode 
                    ? "bg-slate-900/40 border-slate-800/80 shadow-black/40" 
                    : "bg-white/40 border-white/60 shadow-slate-200/50"
                }`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 border rounded-xl ${
                        isDarkMode 
                          ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" 
                          : "bg-indigo-50 border-indigo-100 text-indigo-600"
                      }`}>
                        {slide.type === "expense" && <Wallet className="w-5 h-5" />}
                        {slide.type === "income" && <LineChart className="w-5 h-5" />}
                        {slide.type === "savings" && <BarChart3 className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className={`text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-slate-500" : "text-slate-400"
                        }`}>{slide.title}</p>
                        <h3 className="text-2xl font-bold mt-0.5">{slide.amount}</h3>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 font-medium rounded-full border ${
                      isDarkMode 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-emerald-50 border-emerald-200 text-emerald-600"
                      }`}>
                      {slide.change}
                    </span>
                  </div>

                  {/* Programmatic Graphic Visual Chart Workspace */}
                  <div className="space-y-3 pt-2">
                    <div className={`flex justify-between text-xs font-mono ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}>
                      <span>MON</span>
                      <span>WED</span>
                      <span>FRI</span>
                      <span>SUN</span>
                    </div>
                    <div className="h-20 flex items-end justify-between gap-3 pt-1">
                      <div className={`w-full rounded-t-md transition-all duration-1000 ease-out delay-100 ${
                        isDarkMode ? "bg-slate-800/80" : "bg-slate-200"
                      } ${isActive ? "h-[45%]" : "h-0"}`} />
                      <div className={`w-full bg-indigo-500/40 rounded-t-md transition-all duration-1000 ease-out delay-200 ${isActive ? "h-[75%]" : "h-0"}`} />
                      <div className={`w-full rounded-t-md transition-all duration-1000 ease-out delay-300 ${
                        isDarkMode ? "bg-slate-800/80" : "bg-slate-200"
                      } ${isActive ? "h-[30%]" : "h-0"}`} />
                      <div className={`w-full bg-emerald-500/40 rounded-t-md transition-all duration-1000 ease-out delay-400 ${isActive ? "h-[90%]" : "h-0"}`} />
                    </div>
                  </div>
                </div>

                {/* Overlapping Floating Sub-Card for Deep Layering Composition */}
                <div className={`absolute -bottom-6 -right-4 sm:-right-6 max-w-[280px] border backdrop-blur-xl rounded-xl p-4 shadow-xl transform transition-all duration-1000 delay-300 ${
                  isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                } ${
                  isDarkMode 
                    ? "bg-slate-950/80 border-slate-800 text-slate-300" 
                    : "bg-white/90 border-slate-200 text-slate-700"
                }`}>
                  <div className="flex items-start gap-2.5">
                    <div className={`p-1.5 border rounded-lg shrink-0 mt-0.5 ${
                      isDarkMode 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-emerald-50 border-emerald-200 text-emerald-600"
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs leading-relaxed font-medium">
                      {slide.insight}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Slider Pagination Controls */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slideData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide 
                    ? "w-6 bg-indigo-500" 
                    : isDarkMode ? "w-1.5 bg-slate-700 hover:bg-slate-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Show layout segment ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Structural Navigation Link Feature */}
      <div className="w-full flex justify-center pt-8 z-10">
        <div className={`flex flex-col items-center gap-1 transition-colors duration-200 cursor-pointer group ${
          isDarkMode ? "text-slate-600 hover:text-slate-400" : "text-slate-400 hover:text-slate-600"
        }`}>
          <span className="text-[10px] font-semibold tracking-widest uppercase opacity-80">Explore Platform</span>
          <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* Inline Layout Structural Animation Config Styles */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}