"use client";

import React from "react";
import Link from "next/link";
import { Wallet, Globe, MessageSquare, ExternalLink, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "API", href: "/api-docs" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Status", href: "/status" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { name: "GitHub", href: "https://github.com", icon: <Globe size={20} /> },
    { name: "Twitter", href: "https://twitter.com", icon: <MessageSquare size={20} /> },
    { name: "LinkedIn", href: "https://linkedin.com", icon: <ExternalLink size={20} /> },
    { name: "Email", href: "mailto:hello@smartwallet.ai", icon: <Mail size={20} /> },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Wallet size={20} />
              </div>
              <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                SmartWallet<span className="text-indigo-600">AI</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Track your money, let AI do the thinking. Take control of your finances with intelligent insights.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold capitalize text-slate-900 dark:text-white">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 py-6 dark:border-slate-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy {currentYear} SmartWallet AI. All rights reserved.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Built with AI for smarter financial decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
