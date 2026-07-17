"use client";

import React from "react";
import { Users, DollarSign, TrendingUp, Star } from "lucide-react";

const stats = [
  { name: "Active Users", value: "50K+", icon: Users, color: "text-indigo-600 dark:text-indigo-400" },
  { name: "Transactions Tracked", value: "$2B+", icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400" },
  { name: "Average Savings", value: "23%", icon: TrendingUp, color: "text-purple-600 dark:text-purple-400" },
  { name: "User Rating", value: "4.9/5", icon: Star, color: "text-amber-600 dark:text-amber-400" },
];

export default function Stats() {
  return (
    <section className="bg-white py-24 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <stat.icon size={24} className={stat.color} />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {stat.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
