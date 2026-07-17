"use client";

import React from "react";
import { Brain, Shield, BarChart3, Zap, Wallet, Bell } from "lucide-react";

const features = [
  {
    name: "AI-Powered Insights",
    description: "Get personalized financial insights and recommendations powered by advanced AI algorithms.",
    icon: Brain,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    name: "Smart Budgeting",
    description: "Automatically categorize expenses and create budgets that adapt to your spending habits.",
    icon: Wallet,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    name: "Real-time Tracking",
    description: "Monitor your transactions in real-time with instant notifications and alerts.",
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    name: "Advanced Analytics",
    description: "Visualize your financial data with beautiful charts and comprehensive reports.",
    icon: BarChart3,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    name: "Bank-level Security",
    description: "Your data is encrypted and protected with industry-standard security measures.",
    icon: Shield,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-900/30",
  },
  {
    name: "Smart Alerts",
    description: "Receive intelligent alerts about unusual spending, upcoming bills, and savings opportunities.",
    icon: Bell,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-24 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything you need to manage your finances
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Powerful features designed to help you take control of your money and build wealth over time.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
            >
              <div className={`inline-flex rounded-xl p-3 ${feature.bg}`}>
                <feature.icon size={24} className={feature.color} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                {feature.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
