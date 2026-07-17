"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="bg-gradient-to-br from-indigo-600 to-purple-700 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Stay ahead of your finances
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
          Get weekly AI-powered financial tips, market insights, and exclusive feature updates delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 rounded-xl border border-transparent bg-white/10 px-4 py-3 text-white placeholder-indigo-200 backdrop-blur-sm transition-colors focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
          >
            Subscribe
            <Send size={16} />
          </button>
        </form>
        <p className="mt-4 text-sm text-indigo-200">
          No spam, unsubscribe at any time. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
