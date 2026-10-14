"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loading() {
  const [isVisible, setIsVisible] = useState(true);

  // ইউজার পেজ রিলোড দিলে জোরপূর্বক মিনিমাম ২ সেকেন্ড লোডিং স্ক্রিন ধরে রাখবে
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // 2000ms = 2 Seconds

    return () => clearTimeout(timer);
  }, []);

  // অ্যানিমেশন কনফিগারেশন
  const containerVariants = {
    animate: { transition: { staggerChildren: 0.2 } },
  };

  const dotVariants = {
    initial: { y: 0, opacity: 0.4 },
    animate: {
      y: [0, -8, 0],
      opacity: [0.4, 1, 0.4],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-4 transition-colors duration-300 dark:bg-slate-950"
        >
          <div className="relative flex flex-col items-center max-w-sm w-full text-center">
            
            {/* --- Brand Geometric Morphing Spinner --- */}
            <div className="relative flex h-24 w-24 items-center justify-center">
              {/* Glowing pulsing aura */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-xl dark:bg-indigo-500/5"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Background Rotating Ring */}
              <motion.div
                className="absolute h-20 w-20 rounded-2xl border-2 border-slate-100 dark:border-slate-900"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              {/* Accent Tracking Orbit Block */}
              <motion.div
                className="absolute h-20 w-20 rounded-2xl border-t-2 border-r-2 border-indigo-600 dark:border-indigo-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Inner Brand Emblem Logo Core */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30"
              >
                <span className="text-lg font-bold text-white">S</span>
              </motion.div>
            </div>

            {/* --- Text & System Status Loader --- */}
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-base font-semibold tracking-tight text-slate-900 dark:text-white"
            >
              Analyzing your ecosystem
            </motion.h3>

            {/* Syncing Status Subtext with Staggered Dots */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
            >
              <span>Fetching real-time insights</span>
              <motion.span 
                variants={containerVariants}
                animate="animate"
                className="inline-flex gap-0.5"
              >
                {[1, 2, 3].map((dot) => (
                  <motion.span
                    key={dot}
                    
                    className="h-1 w-1 rounded-full bg-indigo-600 dark:bg-indigo-400"
                  />
                ))}
              </motion.span>
            </motion.div>

            {/* --- Micro Shimmer Skeletal Track --- */}
            <div className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}