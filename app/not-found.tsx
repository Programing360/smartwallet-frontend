"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, HelpCircle, Compass } from "lucide-react";
import { Card, Button, Input } from "@heroui/react";

const HELPFUL_LINKS = [
  {
    icon: <Home size={18} className="text-indigo-600 dark:text-indigo-400" />,
    title: "Go Home",
    description: "Return to the main dashboard",
    href: "/",
  },
  {
    icon: (
      <Compass size={18} className="text-emerald-600 dark:text-emerald-400" />
    ),
    title: "Explore Features",
    description: "See what our platform offers",
    href: "/#features",
  },
  {
    icon: (
      <HelpCircle size={18} className="text-violet-600 dark:text-violet-400" />
    ),
    title: "Support Desk",
    description: "Get assistance from our team",
    href: "/contact",
  },
];

export default function NotFoundPage() {
  return (
    <main className="relative min-h-screen bg-slate-50 overflow-hidden flex items-center justify-center px-4 py-24 transition-colors duration-300 dark:bg-[#020618] sm:px-6 lg:px-8">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none dark:bg-indigo-500/5" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-2xl text-center z-10">
        {/* Animated Big 404 Header */}
        <div className="relative inline-block">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="text-[120px] font-black tracking-tighter text-slate-200 leading-none select-none dark:text-slate-800/40 sm:text-[180px]"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400"
            >
              Lost in Space
            </motion.p>
          </div>
        </div>

        {/* Text Details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-2"
        >
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Page Not Found
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-slate-600 dark:text-slate-400">
            The page you are looking for does not post exist, has been moved, or
            is temporarily unavailable.
          </p>
        </motion.div>

        {/* Quick Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 max-w-md mx-auto"
        >
          <Input
            type="search"
            aria-label="Search site"
            placeholder="Search for pages, documents..."
            className={
              "border-slate-200 bg-white/70 hover:border-indigo-400 focus-within:!border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-indigo-500"
            }
          />
        </motion.div>

        {/* Helpful Alternatives Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 grid gap-4 text-left sm:grid-cols-3"
        >
          {HELPFUL_LINKS.map((link) => (
            <Card
              key={link.title}
              className="border border-slate-200/60 bg-white/60 backdrop-blur-md transition-all duration-300 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/40 cursor-pointer rounded-4xl shadow-2xl"
            >
              <div className="p-4 flex flex-col justify-between h-full min-h-[120px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50/50 border border-indigo-100/30 dark:bg-indigo-950/30 dark:border-indigo-500/10">
                  {link.icon}
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
                    {link.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 line-clamp-2">
                    {link.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex justify-center"
        >
          <Link href={"/"}>
            <Button
              size="lg"
              className="font-semibold cursor-pointer text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Back to Safety
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
