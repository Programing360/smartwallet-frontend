"use client";

import React, { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Loader2,
  Zap,
} from "lucide-react";
import { authClient, signIn } from "@/app/lib/auth-client";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormErrors {
  email?: string;
  password?: string;
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Demo credentials                                                   */
/* ------------------------------------------------------------------ */

const DEMO_EMAIL = "demo@smartwallet.ai";
const DEMO_PASSWORD = "Demo@1234";

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function LoginPage() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  /* ---- form state ---- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ---- ui state ---- */
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoFilling, setIsDemoFilling] = useState(false);

  /* ---- handlers ---- */
  const handleBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const allErrors = validateFields(email, password);
      setErrors((prev) => ({
        ...prev,
        [field]: allErrors[field as keyof FormErrors],
      }));
    },
    [email, password],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const formErrors = validateFields(email, password);
    setErrors(formErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(formErrors).length > 0) return;

    setIsLoading(true);

    try {
      /* ---- swap this block for an RTK Query mutation hook ---- */
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
        callbackURL: "/dashboard",
      });

      console.log(data);

      if (error) {
        setServerError(error.message || "Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---- demo account handler ---- */
  const handleDemoLogin = useCallback(() => {
    setIsDemoFilling(true);
    setServerError("");
    setErrors({});
    setTouched({});

    let charIndex = 0;

    /* type out email character by character */
    const typeEmail = () => {
      charIndex++;
      setEmail(DEMO_EMAIL.slice(0, charIndex));
      if (charIndex < DEMO_EMAIL.length) {
        setTimeout(typeEmail, 25);
      } else {
        /* once email is filled, type password */
        charIndex = 0;
        typePassword();
      }
    };

    const typePassword = () => {
      charIndex++;
      setPassword(DEMO_PASSWORD.slice(0, charIndex));
      if (charIndex < DEMO_PASSWORD.length) {
        setTimeout(typePassword, 30);
      } else {
        /* done typing — brief pause then focus password for visual confirmation */
        setIsDemoFilling(false);
        setTimeout(() => {
          passwordRef.current?.focus();
        }, 300);
      }
    };

    /* start typing immediately */
    setEmail("");
    setPassword("");
    setTimeout(typeEmail, 200);
  }, []);

  /* ---- inline helper for rendering field errors ---- */
  const fieldError = (field: keyof FormErrors) =>
    touched[field] && errors[field] ? (
      <p className="mt-1.5 text-xs text-red-500">{errors[field]}</p>
    ) : null;

  /* ================================================================= */
  /*  RENDER                                                            */
  /* ================================================================= */

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
      {/* -------------------------------------------------------------- */}
      {/*  LEFT SIDE — Login Form                                         */}
      {/* -------------------------------------------------------------- */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[420px]"
        >
          {/* logo — visible on mobile/tablet only, hidden on lg+ since it appears in the right panel */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 lg:hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              SmartWallet AI
            </span>
          </Link>

          {/* heading */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Log in to continue tracking your finances
          </p>

          {/* server error banner */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-5 overflow-hidden"
              >
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span className="flex-1">{serverError}</span>
                  <button
                    type="button"
                    onClick={() => setServerError("")}
                    className="flex-shrink-0 text-red-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 ${
                    touched.email && errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-300 focus:border-indigo-500 dark:border-slate-700"
                  }`}
                />
              </div>
              {fieldError("email")}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 ${
                    touched.password && errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-300 focus:border-indigo-500 dark:border-slate-700"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldError("password")}
            </div>

            {/* forgot password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Forgot password?
              </Link>
            </div>

            {/* submit button */}
            <button
              type="submit"
              disabled={isLoading || isDemoFilling}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* demo account button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading || isDemoFilling}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
          >
            {isDemoFilling ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Filling credentials...
              </>
            ) : (
              <>
                <Zap size={18} />
                Try Demo Account
              </>
            )}
          </button>

          {/* divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              or continue with
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* google button */}
          <button
            type="button"
            disabled={isLoading || isDemoFilling}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:border-slate-600 dark:bg-white dark:text-slate-800 dark:hover:bg-slate-100"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* sign-up link */}
          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  RIGHT SIDE — Branded Visual Panel                                */}
      {/* ---------------------------------------------------------------- */}
      <div className="pointer-events-none relative hidden w-[45%] overflow-hidden lg:block xl:w-1/2">
        {/* solid primary background */}
        <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-800" />

        {/* decorative floating shapes */}
        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-18px) rotate(2deg); }
          }
          @keyframes float-medium {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(-3deg); }
          }
          @keyframes float-fast {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-8px) scale(1.02); }
          }
          @media (prefers-reduced-motion: reduce) {
            .float-slow, .float-medium, .float-fast {
              animation: none !important;
            }
          }
        `}</style>

        {/* large background circle */}
        <div
          className="float-slow absolute -right-16 -top-16 h-80 w-80 rounded-full bg-white/[0.06]"
          style={{ animationDuration: "8s" }}
        />

        {/* decorative card stack — pure CSS shapes */}
        <div
          className="float-medium absolute right-12 top-[18%]"
          style={{ animationDuration: "6s" }}
        >
          <div className="h-44 w-64 rounded-2xl border border-white/[0.12] bg-white/[0.08] p-5 shadow-xl backdrop-blur-sm">
            <div className="mb-3 h-3 w-20 rounded-full bg-white/20" />
            <div className="mb-2 h-2.5 w-full rounded-full bg-white/10" />
            <div className="mb-2 h-2.5 w-4/5 rounded-full bg-white/10" />
            <div className="mb-4 h-2.5 w-3/5 rounded-full bg-white/10" />
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-400/30" />
              <div className="h-8 flex-1 rounded-lg bg-white/10" />
            </div>
          </div>
        </div>

        {/* second decorative card — overlapping */}
        <div
          className="float-fast absolute right-36 top-[42%]"
          style={{ animationDuration: "7s" }}
        >
          <div className="h-36 w-52 rounded-2xl border border-white/[0.12] bg-white/[0.06] p-5 shadow-xl backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-400/30" />
              <div className="space-y-1">
                <div className="h-2.5 w-20 rounded-full bg-white/20" />
                <div className="h-2 w-14 rounded-full bg-white/10" />
              </div>
            </div>
            <div className="mb-2 h-2.5 w-full rounded-full bg-white/10" />
            <div className="h-2.5 w-2/3 rounded-full bg-white/10" />
          </div>
        </div>

        {/* small floating accent card */}
        <div
          className="float-slow absolute bottom-[18%] left-12"
          style={{ animationDuration: "9s", animationDelay: "1s" }}
        >
          <div className="flex h-16 w-48 items-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 backdrop-blur-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/30">
              <div className="h-4 w-4 rounded-full bg-emerald-400/60" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 w-24 rounded-full bg-white/20" />
              <div className="h-2 w-16 rounded-full bg-white/10" />
            </div>
          </div>
        </div>

        {/* bottom decorative circle */}
        <div
          className="float-medium absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-white/[0.04]"
          style={{ animationDuration: "10s" }}
        />

        {/* content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="max-w-md text-center"
          >
            {/* logo */}
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
              Your money, finally organized
            </h2>
            <p className="mt-4 text-lg text-indigo-200">
              Log in to access your personalized dashboard, track spending, and
              let AI surface the insights that matter.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
