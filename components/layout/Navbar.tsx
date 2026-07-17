"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ArrowRightLeft,
  PlusCircle,
  PieChart,
  Wallet,
  Settings,
  UserCircle,
} from "lucide-react";
import { useClientSession } from "@/app/lib/session";
import { authClient } from "@/app/lib/auth-client";

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "U";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isPending } = useClientSession();
  const isLoggedIn = !isPending && !!user;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeDropdown = useCallback(() => {
    setIsProfileDropdownOpen(false);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    }
    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileDropdownOpen, closeDropdown]);

  useEffect(() => {
    const handlePopState = () => {
      closeDropdown();
      closeMobileMenu();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [closeDropdown, closeMobileMenu]);

  const handleLogout = async () => {
    closeDropdown();
    closeMobileMenu();
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const loggedOutLinks: { name: string; href: string; icon?: React.ReactNode }[] = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const loggedInLinks: { name: string; href: string; icon?: React.ReactNode }[] = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Transactions", href: "/transactions", icon: <ArrowRightLeft size={18} /> },
    { name: "Add Transaction", href: "/add-transaction", icon: <PlusCircle size={18} className="text-emerald-500" /> },
    { name: "Reports", href: "/reports", icon: <PieChart size={18} /> },
  ];

  const navLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;
  const isActive = (href: string) => pathname === href;

  const initials = getInitials(user?.name, user?.email);
  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-black/80 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Wallet size={20} />
              </div>
              <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                SmartWallet<span className="text-indigo-600">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2 lg:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
                  }`}
                >
                  {isLoggedIn ? link?.icon : null}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {!isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    ref={triggerRef}
                    onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white select-none">
                      {initials}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
                    >
                      {/* User Info Header */}
                      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-700/60">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-base font-bold text-white select-none">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {displayName}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {displayEmail}
                          </p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={closeDropdown}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/50"
                        >
                          <UserCircle size={18} className="text-slate-400 dark:text-slate-500" />
                          Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={closeDropdown}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/50"
                        >
                          <LayoutDashboard size={18} className="text-slate-400 dark:text-slate-500" />
                          Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          onClick={closeDropdown}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/50"
                        >
                          <Settings size={18} className="text-slate-400 dark:text-slate-500" />
                          Settings
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-slate-100 px-3 py-3 dark:border-slate-700/60">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 px-4 py-2.5 text-sm font-medium text-red-600 shadow-sm backdrop-blur-sm transition-all hover:from-red-100 hover:to-red-200 hover:text-red-700 hover:shadow-md dark:border-red-800/40 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-400 dark:hover:from-red-900/50 dark:hover:to-red-800/50 dark:hover:text-red-300"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-black md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium ${
                  isActive(link.href)
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
                }`}
              >
                {isLoggedIn ? link?.icon : null}
                {link.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-200 pb-3 pt-4 dark:border-slate-800">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white select-none">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-medium leading-none text-slate-900 dark:text-white">
                      {displayName}
                    </div>
                    <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                      {displayEmail}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
                  >
                    <UserCircle size={18} />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                  <div className="mx-2 my-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 px-4 py-2.5 text-sm font-medium text-red-600 shadow-sm backdrop-blur-sm transition-all hover:from-red-100 hover:to-red-200 hover:text-red-700 hover:shadow-md dark:border-red-800/40 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-400 dark:hover:from-red-900/50 dark:hover:to-red-800/50 dark:hover:text-red-300"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 px-5 py-3">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block text-center text-base font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="block rounded-xl bg-indigo-600 px-4 py-2 text-center text-base font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
