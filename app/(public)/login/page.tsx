"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";

interface FormErrors {
  email?: string;
  password?: string;
}

const DEMO_EMAIL = "demo@smartwallet.ai";
const DEMO_PASSWORD = "demo1234";

function validateFields(email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!password || password.length === 0) {
    errors.password = "Password is required";
  }
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoFilling, setIsDemoFilling] = useState(false);

  // 1. Form Submit Handler (Email & Password with Better-Auth)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isDemoFilling) return;

    const formErrors = validateFields(email, password);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    setIsLoading(true);
    const toastId = toast.loading("Verifying credentials...");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setIsLoading(false);
        toast.update(toastId, {
          render: result.error.message || "Invalid email or password",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      toast.update(toastId, {
        render: "Welcome back! Redirecting...",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      router.push("/dashboard");
    } catch {
      setIsLoading(false);
      toast.dismiss(toastId);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // 2. Google OAuth Login Handler
  const handleGoogleLogin = async () => {
    if (isLoading || isDemoFilling) return;
    setIsLoading(true);
    const toastId = toast.loading("Connecting to Google Secure Gate...");

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setIsLoading(false);
        toast.update(toastId, {
          render: result.error.message || "Google authentication failed",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch {
      setIsLoading(false);
      toast.dismiss(toastId);
      toast.error("Failed to initialize Google Login.");
    }
  };

  // 3. Demo Data Typer Handler
  const handleDemoLogin = useCallback(() => {
    if (isLoading || isDemoFilling) return;
    setIsDemoFilling(true);
    setErrors({});
    
    let charIndex = 0;
    setEmail("");
    setPassword("");

    const typeEmail = () => {
      charIndex++;
      setEmail(DEMO_EMAIL.slice(0, charIndex));
      if (charIndex < DEMO_EMAIL.length) {
        setTimeout(typeEmail, 30);
      } else {
        charIndex = 0;
        setTimeout(typePassword, 150);
      }
    };

    const typePassword = () => {
      charIndex++;
      setPassword(DEMO_PASSWORD.slice(0, charIndex));
      if (charIndex < DEMO_PASSWORD.length) {
        setTimeout(typePassword, 35);
      } else {
        setIsDemoFilling(false);
        toast.info("Demo credentials filled! Ready to Log In.", { autoClose: 2000 });
      }
    };

    setTimeout(typeEmail, 100);
  }, [isLoading, isDemoFilling]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            SmartWallet AI
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Log in to continue tracking your finances
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isDemoFilling}
                className={`w-full rounded-xl border bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition dark:text-white ${
                  errors.email ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 focus:border-indigo-500 dark:border-slate-700"
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isDemoFilling}
                className={`w-full rounded-xl border bg-transparent py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition dark:text-white ${
                  errors.password ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 focus:border-indigo-500 dark:border-slate-700"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || isDemoFilling}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Demo Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading || isDemoFilling}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-800/60 dark:bg-emerald-950/20 dark:text-emerald-400"
        >
          {isDemoFilling ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Typing credentials...
            </>
          ) : (
            <>
              <Zap size={18} />
              Try Demo Account
            </>
          )}
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs font-medium text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading || isDemoFilling}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}