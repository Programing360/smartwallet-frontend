"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is SmartWallet AI free to use?",
    answer: "Yes! SmartWallet AI offers a generous free tier that includes all core features. Premium plans are available for advanced AI insights and unlimited transactions.",
  },
  {
    question: "How does the AI analysis work?",
    answer: "Our AI uses machine learning algorithms to analyze your spending patterns, identify trends, and provide personalized recommendations to help you save money and reach your financial goals.",
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. We use bank-level encryption (AES-256) and never store your banking credentials. Your data is protected with industry-standard security measures and we are SOC 2 compliant.",
  },
  {
    question: "Can I connect multiple bank accounts?",
    answer: "Yes, you can connect unlimited bank accounts, credit cards, and other financial institutions. SmartWallet AI supports over 10,000 financial institutions worldwide.",
  },
  {
    question: "How accurate are the predictions?",
    answer: "Our AI predictions have shown 94% accuracy for monthly expense forecasting. The accuracy improves over time as the system learns from your specific spending patterns.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-24 dark:bg-black">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Everything you need to know about SmartWallet AI.
          </p>
        </div>
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-base font-medium text-slate-900 dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`ml-4 flex-shrink-0 text-slate-500 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
