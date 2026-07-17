"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Loader2, CheckCircle2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FormStatus = "idle" | "loading" | "success" | "error";

interface NewsletterFormState {
  email: string;
  error: string;
  status: FormStatus;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function NewsletterCTA() {
  const [form, setForm] = useState<NewsletterFormState>({
    email: "",
    error: "",
    status: "idle",
  });

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, email: e.target.value, error: "" }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!form.email.trim() || !isValidEmail(form.email)) {
        setForm((prev) => ({
          ...prev,
          error: "Please enter a valid email address",
        }));
        return;
      }

      setForm((prev) => ({ ...prev, status: "loading", error: "" }));

      /* ---- simulate API call — swap for real mutation later ---- */
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setForm((prev) => ({ ...prev, status: "success" }));
    },
    [form.email]
  );

  /* ================================================================= */
  /*  RENDER                                                            */
  /* ================================================================= */

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-indigo-600 dark:bg-indigo-700"
      >
        <div className="grid items-center gap-10 px-8 py-14 sm:px-12 md:grid-cols-2 md:gap-12 lg:px-16">
          {/* ------------------------------------------------------------ */}
          {/*  Left — Headline + CTA buttons                                 */}
          {/* ------------------------------------------------------------ */}
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Start Making Smarter Money Decisions&nbsp;Today
            </h2>
            <p className="mt-4 text-base leading-relaxed text-indigo-100 sm:text-lg">
              Join thousands of users who track, budget, and save smarter with
              AI-powered insights — completely free to get started.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.15, ease: "easeOut" }}>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                >
                  Get Started Free
                  <ArrowRight size={16} />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.15, ease: "easeOut" }}>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                >
                  Try Demo
                </Link>
              </motion.div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/*  Right — Newsletter form                                       */}
          {/* ------------------------------------------------------------ */}
          <div>
            <AnimatePresence mode="wait">
              {form.status === "success" ? (
                /* -------- success state -------- */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-6 py-5 backdrop-blur-sm"
                >
                  <CheckCircle2 size={24} className="text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Subscribed!
                    </p>
                    <p className="mt-0.5 text-xs text-indigo-200">
                      We&apos;ll send you monthly money tips — no spam, ever.
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* -------- form state -------- */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="mb-3 block text-sm font-medium text-indigo-100">
                    <Mail size={14} className="mr-1.5 inline-block" />
                    Get monthly money tips
                  </label>

                  <form
                    onSubmit={handleSubmit}
                    className="flex gap-2 sm:gap-3"
                    noValidate
                  >
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={form.email}
                        onChange={handleEmailChange}
                        placeholder="you@example.com"
                        disabled={form.status === "loading"}
                        className={`w-full rounded-xl border bg-white/10 px-4 py-3 text-sm text-white placeholder-indigo-200 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 ${
                          form.error
                            ? "border-red-400/60 focus:border-red-400"
                            : "border-white/20 focus:border-white/40"
                        } disabled:opacity-50`}
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.15, ease: "easeOut" }}>
                      <button
                        type="submit"
                        disabled={form.status === "loading"}
                        className="inline-flex h-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 disabled:opacity-50 sm:px-6"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {form.status === "loading" ? (
                            <motion.span
                              key="spinner"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex items-center"
                            >
                              <Loader2 size={18} className="animate-spin" />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="text"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="hidden sm:inline"
                            >
                              Subscribe
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {/* always-visible icon fallback for mobile */}
                        {form.status !== "loading" && (
                          <Mail size={18} className="sm:hidden" />
                        )}
                      </button>
                    </motion.div>
                  </form>

                  {/* validation error */}
                  <AnimatePresence>
                    {form.error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 text-xs text-red-200"
                      >
                        {form.error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <p className="mt-3 text-xs text-indigo-300/80">
                    No spam, unsubscribe at any time. We respect your privacy.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
