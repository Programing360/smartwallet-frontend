"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { authClient, signUp } from "@/app/lib/auth-client";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type PasswordStrengthLevel = "weak" | "medium" | "strong";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

interface PasswordStrengthResult {
  level: PasswordStrengthLevel;
  percentage: number;
}

/* ------------------------------------------------------------------ */
/*  Password strength calculator                                       */
/*  Scores: length >= 8 → +1, uppercase → +1, digit → +1, symbol → +1 */
/*  weak: score < 3 | medium: score 3 | strong: score >= 4             */
/* ------------------------------------------------------------------ */

function getPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) return { level: "weak", percentage: 0 };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 3) return { level: "weak", percentage: 33 };
  if (score <= 5) return { level: "medium", percentage: 66 };
  return { level: "strong", percentage: 100 };
}

/* ------------------------------------------------------------------ */
/*  Client-side validation                                             */
/* ------------------------------------------------------------------ */

function validateFields(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  agreed: boolean
): FormErrors {
  const errors: FormErrors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password || password.length < 8 || !/[0-9]/.test(password)) {
    errors.password =
      "Password must be at least 8 characters and include a number";
  }

  if (!confirmPassword || password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!agreed) {
    errors.terms = "You must agree to the Terms of Service and Privacy Policy";
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PasswordStrengthBar({
  strength,
}: {
  strength: PasswordStrengthResult;
}) {
  const colorMap: Record<PasswordStrengthLevel, string> = {
    weak: "bg-red-500",
    medium: "bg-amber-500",
    strong: "bg-emerald-500",
  };

  const labelMap: Record<PasswordStrengthLevel, string> = {
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
  };

  const textColorMap: Record<PasswordStrengthLevel, string> = {
    weak: "text-red-500",
    medium: "text-amber-500",
    strong: "text-emerald-500",
  };

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((segment) => (
          <div
            key={segment}
            className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
          >
            <motion.div
              className={`h-full rounded-full ${
                strength.percentage >= segment * 33
                  ? colorMap[strength.level]
                  : ""
              }`}
              initial={{ width: 0 }}
              animate={{
                width:
                  strength.percentage >= segment * 33
                    ? "100%"
                    : segment === 1 && strength.percentage > 0
                      ? `${Math.min(strength.percentage, 33)}%`
                      : "0%",
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>
      {strength.percentage > 0 && (
        <p className={`mt-1 text-xs ${textColorMap[strength.level]}`}>
          {labelMap[strength.level]}
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

export default function RegisterPage() {
  const router = useRouter();

  /* ---- form state ---- */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  /* ---- ui state ---- */
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /* ---- derived ---- */
  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  const isFormValid = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password.length >= 8 &&
      /[0-9]/.test(password) &&
      password === confirmPassword &&
      agreed
    );
  }, [name, email, password, confirmPassword, agreed]);

  /* ---- handlers ---- */
  const handleBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const allErrors = validateFields(
        name,
        email,
        password,
        confirmPassword,
        agreed
      );
      setErrors((prev) => ({
        ...prev,
        [field]: allErrors[field as keyof FormErrors],
      }));
    },
    [name, email, password, confirmPassword, agreed]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const formErrors = validateFields(
      name,
      email,
      password,
      confirmPassword,
      agreed
    );
    setErrors(formErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    if (Object.keys(formErrors).length > 0) return;

    setIsLoading(true);

    try {
      /* ---- swap this block for an RTK Query mutation hook ---- */
      const { error: signUpError } = await authClient.signUp.email({
        name: name.trim(),
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (signUpError) {
        setServerError(
          signUpError.message || "Registration failed. Please try again."
        );
      } else {
        setIsSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      {/*  LEFT SIDE — Registration Form                                  */}
      {/* -------------------------------------------------------------- */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* -------- success state -------- */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
              >
                <CheckCircle2
                  size={72}
                  className="text-emerald-500"
                  strokeWidth={1.5}
                />
              </motion.div>
              <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
                Account created!
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Redirecting you to sign in...
              </p>
            </motion.div>
          ) : (
            /* -------- form state -------- */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-[440px]"
            >
              {/* logo */}
              <Link href="/" className="mb-8 inline-flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                  <span className="text-sm font-bold text-white">S</span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  SmartWallet AI
                </span>
              </Link>

              {/* heading */}
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Start tracking your money with AI-powered insights
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
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => handleBlur("name")}
                      className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 ${
                        touched.name && errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-300 focus:border-indigo-500 dark:border-slate-700"
                      }`}
                    />
                  </div>
                  {fieldError("name")}
                </div>

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
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
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

                  {/* password strength indicator */}
                  {password.length > 0 && (
                    <PasswordStrengthBar strength={passwordStrength} />
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 ${
                        touched.confirmPassword && errors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-300 focus:border-indigo-500 dark:border-slate-700"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {fieldError("confirmPassword")}
                </div>

                {/* Terms checkbox */}
                <div>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => {
                        setAgreed(e.target.checked);
                        if (touched.terms) {
                          setErrors((prev) => ({
                            ...prev,
                            terms: e.target.checked
                              ? undefined
                              : "You must agree to the Terms of Service and Privacy Policy",
                          }));
                        }
                      }}
                      onBlur={() => handleBlur("terms")}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {fieldError("terms")}
                </div>

                {/* submit button */}
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

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
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* sign-in link */}
              <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Log in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  RIGHT SIDE — Branded Visual Panel                                */}
      {/* ---------------------------------------------------------------- */}
      <div className="pointer-events-none relative hidden w-[45%] overflow-hidden lg:block xl:w-1/2">
        {/* gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900" />

        {/* abstract decorative shapes */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-white/5 blur-2xl" />

        {/* content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="max-w-md text-center"
          >
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
              Join thousands tracking smarter
            </h2>
            <p className="mt-4 text-lg text-indigo-200">
              Get AI-powered insights into your spending habits and take control
              of your financial future.
            </p>

            {/* floating stat cards */}
            <div className="mt-10 space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mx-auto flex max-w-xs items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">
                    Smart categorization
                  </p>
                  <p className="text-xs text-indigo-200">
                    Automatic transaction tags
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mx-auto flex max-w-xs items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                  <AlertCircle size={20} className="text-amber-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">
                    Budget alerts
                  </p>
                  <p className="text-xs text-indigo-200">
                    Stay on track with notifications
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
