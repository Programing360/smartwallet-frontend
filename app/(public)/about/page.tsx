"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Target,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@heroui/react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ValueCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TeamMember {
  initials: string;
  name: string;
  role: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const VALUES: ValueCard[] = [
  {
    icon: <Target size={28} className="text-indigo-600 dark:text-indigo-400" />,
    title: "Simplicity First",
    description:
      "We believe managing money should feel effortless. Our interface removes the clutter so you can see what matters — where your money goes and how to keep more of it.",
  },
  {
    icon: (
      <ShieldCheck size={28} className="text-emerald-600 dark:text-emerald-400" />
    ),
    title: "Privacy & Security",
    description:
      "Your financial data stays yours. We use bank-grade encryption, never sell your information, and give you full control over what gets stored and shared.",
  },
  {
    icon: (
      <Sparkles size={28} className="text-amber-600 dark:text-amber-400" />
    ),
    title: "AI That Actually Helps",
    description:
      "Not just buzzwords. Our AI classifies transactions instantly, spots spending patterns, and surfaces insights you can act on — without you lifting a finger.",
  },
];

/* NOTE: Replace these with real team info before final submission. */
const TEAM: TeamMember[] = [
  {
    initials: "AR",
    name: "Aisha Rahman",
    role: "Founder & Developer",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  },
  {
    initials: "KM",
    name: "Kian Morris",
    role: "Product Designer",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  {
    initials: "SP",
    name: "Sara Patel",
    role: "AI & Data Engineer",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  {
    initials: "DL",
    name: "Daniel Lee",
    role: "Backend Developer",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  },
];

const COMPARISONS = [
  "Automatic AI categorization vs manually tagging every expense",
  "Real-time spending insights vs waiting until month-end to review a spreadsheet",
  "Smart alerts that catch unusual activity before it becomes a problem",
  "One dashboard for all accounts instead of juggling multiple apps and files",
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  /* AOS — reuses the same init pattern from the transaction detail page.
     If AOS is ever moved to a global provider, remove this local init. */
  useEffect(() => {
    AOS.init({
      duration: 400,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ================================================================ */}
      {/*  1. HERO / INTRO BAND                                            */}
      {/* ================================================================ */}
      <section
        className="relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 lg:px-8"
        data-aos="fade-up"
        data-aos-once="true"
      >
        {/* subtle background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400">
            About Us
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Making Financial Clarity
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
              Accessible to Everyone
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Most people know they should track their spending, but manually
            logging every coffee, subscription, and grocery run is exhausting.
            SmartWallet AI removes that friction — our AI classifies
            transactions instantly, reveals where your money really goes, and
            gives you the confidence to make smarter financial decisions without
            the spreadsheet headaches.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  2. OUR STORY                                                    */}
      {/* ================================================================ */}
      <section
        className="px-4 py-20 sm:px-6 lg:px-8"
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-once="true"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* text */}
          <div className="space-y-5">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Our Story
            </h2>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
              SmartWallet AI started as a weekend side project. Our founder was
              spending hours every month reconciling bank statements and
              categorizing expenses in a spreadsheet — a ritual that felt
              increasingly pointless in a world powered by machine learning. The
              question was simple: why can&apos;t software do this automatically?
            </p>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
              That frustration became a prototype. A small script that
              auto-tagged transactions by merchant name. Then a dashboard with
              charts. Then an AI engine that could infer categories from
              descriptions alone. Friends started asking to use it, and we
              realized the problem was universal.
            </p>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
              Today SmartWallet AI is a full platform used by thousands of
              people who want clarity over their finances without the manual
              grind. We&apos;re still a small team, still obsessed with reducing
              friction, and still building the tool we originally wanted for
              ourselves.
            </p>
          </div>

          {/* decorative shapes — matches the layered rounded-shape style from the auth pages */}
          <div className="relative hidden h-80 lg:block">
            {/* gradient backdrop */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900" />

            {/* floating blurred shapes with slow animation */}
            <div
              className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
              style={{ animation: "floatShape 8s ease-in-out infinite" }}
            />
            <div
              className="absolute -bottom-16 -left-8 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl"
              style={{ animation: "floatShape 10s ease-in-out infinite reverse" }}
            />
            <div
              className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-white/5 blur-2xl"
              style={{ animation: "floatShape 12s ease-in-out infinite" }}
            />

            {/* content on top */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <span className="text-2xl font-bold text-white">S</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                From spreadsheet to AI
              </h3>
              <p className="mt-3 max-w-xs text-sm text-indigo-200">
                What started as a personal hackathon grew into a platform that
                helps thousands take control of their finances.
              </p>
            </div>
          </div>
        </div>

        {/* CSS for floating shape animation — respects prefers-reduced-motion */}
        <style jsx global>{`
          @keyframes floatShape {
            0%,
            100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-18px) scale(1.04);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes floatShape {
              0%,
              100% {
                transform: none;
              }
            }
          }
        `}</style>
      </section>

      {/* ================================================================ */}
      {/*  3. MISSION / VALUES GRID                                        */}
      {/* ================================================================ */}
      <section
        className="px-4 py-20 sm:px-6 lg:px-8"
        data-aos="fade-up"
        data-aos-delay="150"
        data-aos-once="true"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              What We Stand For
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
              Three principles guide every decision we make — from the features
              we build to the way we handle your data.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value) => (
              <Card
                key={value.title}
                className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-transform duration-200 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  4. HOW WE'RE DIFFERENT                                          */}
      {/* ================================================================ */}
      <section
        className="px-4 py-20 sm:px-6 lg:px-8"
        data-aos="fade-up"
        data-aos-delay="200"
        data-aos-once="true"
      >
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              How We&apos;re Different
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              SmartWallet AI replaces the manual overhead of tracking money
              with intelligence that works in the background.
            </p>

            <ul className="mt-8 space-y-4">
              {COMPARISONS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  5. TEAM SECTION                                                 */}
      {/* ================================================================ */}
      <section
        className="px-4 py-20 sm:px-6 lg:px-8"
        data-aos="fade-up"
        data-aos-delay="250"
        data-aos-once="true"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Meet the Team
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              A small, focused team building the finance tool we always wanted.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center transition-transform duration-200 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold ${member.color}`}
                >
                  {member.initials}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  6. CTA BAND — mirrors the NewsletterCTA visual treatment         */}
      {/* ================================================================ */}
      <section
        className="px-4 pb-24 pt-4 sm:px-6 lg:px-8"
        data-aos="fade-up"
        data-aos-delay="300"
        data-aos-once="true"
      >
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-indigo-600 dark:bg-indigo-700">
          <div className="flex flex-col items-center gap-8 px-8 py-14 sm:px-12 lg:flex-row lg:justify-between lg:px-16">
            <div className="max-w-lg text-center lg:text-left">
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                Ready to take control of your money?
              </h2>
              <p className="mt-3 text-indigo-100">
                Join thousands of users who track, budget, and save smarter —
                completely free to get started.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="shrink-0"
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
