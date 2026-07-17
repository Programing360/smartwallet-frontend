"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  initials: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    text: "The auto-categorization feature alone saved me hours every month. I used to spend weekends sorting receipts — now SmartWallet AI does it the moment I import my CSV export.",
    rating: 5,
    initials: "SJ",
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
  },
  {
    name: "Michael Chen",
    role: "Freelance Developer",
    text: "As a freelancer with irregular income, having AI-powered budget tracking that actually learns my spending patterns has been a game-changer for tax planning.",
    rating: 5,
    initials: "MC",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  {
    name: "Priya Sharma",
    role: "Marketing Manager",
    text: "I imported three years of bank transactions in one go and the AI nailed almost every category on the first pass. The insights dashboard is genuinely useful, not just pretty charts.",
    rating: 5,
    initials: "PS",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  },
  {
    name: "David Okafor",
    role: "Restaurant Owner",
    text: "Running a restaurant means expenses everywhere. SmartWallet AI lets me track food costs, payroll, and vendor payments in one place — and the AI flags unusual charges before they become problems.",
    rating: 5,
    initials: "DO",
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
  },
  {
    name: "Emma Lindqvist",
    role: "Graduate Student",
    text: "On a tight student budget, every dollar counts. The budget alerts keep me honest, and the spending trends showed me I was overspending on subscriptions I'd completely forgotten about.",
    rating: 5,
    initials: "EL",
    color: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400",
  },
  {
    name: "James Whitfield",
    role: "Freelance Photographer",
    text: "I used to juggle spreadsheets for personal and business finances. Now everything lives in SmartWallet AI — CSV imports handle my card statements, and the AI splits personal from business automatically.",
    rating: 5,
    initials: "JW",
    color: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CARD_WIDTH = 380;   // px – matches the min-w on each card
const CARD_GAP  = 24;     // px – matches gap-6
const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

/* ------------------------------------------------------------------ */
/*  Star row                                                           */
/* ------------------------------------------------------------------ */

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className="fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* ---- update arrow enabled state ---- */
  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  /* ---- arrow scroll (smooth) ---- */
  const scroll = useCallback((direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const offset = direction === "left" ? -SCROLL_STEP : SCROLL_STEP;
    el.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ------------------------------------------------------------ */}
        {/*  Heading                                                      */}
        {/* ------------------------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Loved by People Who Take Their Money Seriously
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Real feedback from users who replaced spreadsheets with smarter,
            AI-powered tracking.
          </p>
        </motion.div>

        {/* ------------------------------------------------------------ */}
        {/*  Carousel                                                     */}
        {/* ------------------------------------------------------------ */}
        <div className="relative mt-14">
          {/* left / right arrows — hidden on small screens */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:flex"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:flex"
          >
            <ChevronRight size={18} />
          </button>

          {/* scrollable track */}
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollbarWidth: "none" }}   /* Firefox */
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                className="min-w-[340px] max-w-[380px] flex-1 snap-start rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900 sm:min-w-[380px]"
              >
                {/* quote icon */}
                <Quote
                  size={24}
                  className="mb-4 text-slate-300 dark:text-slate-600"
                />

                {/* testimonial text */}
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* star rating */}
                <div className="mt-5">
                  <Stars count={t.rating} />
                </div>

                {/* reviewer */}
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${t.color}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* hide native scrollbar across browsers */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
