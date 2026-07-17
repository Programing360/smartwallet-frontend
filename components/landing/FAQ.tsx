"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mail } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FaqItem {
  question: string;
  answer: string;
}

/* ------------------------------------------------------------------ */
/*  FAQ content                                                        */
/* ------------------------------------------------------------------ */

const faqs: FaqItem[] = [
  {
    question: "Is my financial data secure?",
    answer:
      "Yes. Every connection uses bank-level AES-256 encryption in transit and at rest, and we never store your banking credentials. Authentication is handled via short-lived JWT tokens with automatic rotation, so your session stays protected without sacrificing convenience.",
  },
  {
    question: "How accurate is the AI categorization?",
    answer:
      "SmartWallet AI's auto-classification engine correctly assigns transactions to the right category roughly 96% of the time. It learns from your edits, so every manual correction makes future predictions even more precise for your specific spending patterns.",
  },
  {
    question: "Can I import transactions from my bank?",
    answer:
      "Absolutely. You can upload a CSV or Excel export directly from your bank's online portal, and SmartWallet AI will parse, deduplicate, and categorize every transaction in seconds — no manual entry required.",
  },
  {
    question: "Is SmartWallet AI free to use?",
    answer:
      "The core experience — unlimited transaction tracking, budget creation, and AI insights — is completely free with no hidden fees. A Pro tier is available for users who want advanced forecasting, multi-currency support, and priority support.",
  },
  {
    question: "Can I edit categories the AI assigns?",
    answer:
      "Anytime. Click any transaction, choose a different category or create a custom one, and the AI will learn from that change. Your overrides directly improve future auto-categorization accuracy.",
  },
  {
    question: "Does it work on mobile devices?",
    answer:
      "Yes. SmartWallet AI is fully responsive and works great on phones and tablets through your mobile browser. There's no app to install — just log in and you get the same dashboard, charts, and insights on any screen size.",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FaqCard({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const paddedIndex = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      className={`group rounded-xl border bg-white px-6 py-5 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900 ${
        isOpen
          ? "border-l-2 border-l-indigo-500 border-slate-200 dark:border-l-indigo-500 dark:border-slate-700"
          : "border-slate-200 dark:border-slate-700"
      }`}
    >
      {/* question button */}
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-4 text-left"
        aria-expanded={isOpen}
      >
        {/* numbered prefix */}
        <span className="mt-0.5 flex-shrink-0 text-xs font-semibold text-slate-400 dark:text-slate-500">
          {paddedIndex}
        </span>

        <span className="flex-1 text-base font-medium text-slate-900 dark:text-white">
          {item.question}
        </span>

        {/* plus → cross via rotation */}
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="mt-0.5 flex-shrink-0 text-slate-400 group-hover:text-indigo-500"
        >
          <Plus size={18} />
        </motion.span>
      </button>

      {/* animated answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pl-8 pt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          {/* ------------------------------------------------------------ */}
          {/*  Left — Sticky heading block                                   */}
          {/* ------------------------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-md text-base text-slate-600 dark:text-slate-400">
              Quick answers to the most common things people ask before signing
              up for SmartWallet&nbsp;AI.
            </p>

            {/* mini contact card */}
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950">
                <Mail
                  size={18}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Still have questions?
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            </Link>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/*  Right — Accordion list                                        */}
          {/* ------------------------------------------------------------ */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FaqCard
                key={faq.question}
                item={faq}
                index={index}
                isOpen={activeIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
