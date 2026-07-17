"use client";

import React from "react";
import { UserPlus, CreditCard, Brain, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Create Account",
    description: "Sign up in seconds with your email. No credit card required to get started.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Connect Accounts",
    description: "Securely link your bank accounts and credit cards for automatic tracking.",
    icon: CreditCard,
  },
  {
    step: "03",
    title: "AI Analysis",
    description: "Our AI analyzes your spending patterns and identifies opportunities to save.",
    icon: Brain,
  },
  {
    step: "04",
    title: "Grow Wealth",
    description: "Follow personalized recommendations to optimize your finances and build wealth.",
    icon: TrendingUp,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            How SmartWallet AI works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Get started in four simple steps and let AI transform your financial life.
          </p>
        </div>
        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-indigo-500 to-purple-500 lg:block" />
          <div className="grid gap-12 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
                  <step.icon size={28} />
                </div>
                <div className="mt-6">
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    Step {step.step}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
