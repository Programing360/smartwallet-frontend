"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  ImageIcon,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  useAddTransactionMutation,
  type TransactionType,
  type TransactionCategory,
} from "@/store/api/transactionApi";
import { useClassifyTransactionMutation } from "@/store/api/aiApi";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FormFieldErrors = {
  title?: string;
  amount?: string;
  date?: string;
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORY_OPTIONS: { value: TransactionCategory; label: string }[] = [
  { value: "auto", label: "Auto (AI will detect)" },
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "bills", label: "Bills" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function validate(
  title: string,
  amount: string,
  date: string,
): FormFieldErrors {
  const errors: FormFieldErrors = {};
  if (!title || title.trim().length < 2)
    errors.title = "Title must be at least 2 characters";
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
    errors.amount = "Please enter a valid positive amount";
  if (!date) errors.date = "Date is required";
  return errors;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function TypeToggle({
  value,
  onChange,
}: {
  value: TransactionType;
  onChange: (v: TransactionType) => void;
}) {
  return (
    <div className="relative flex overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
      {/* sliding indicator */}
      <motion.div
        className={`absolute inset-y-0 w-1/2 rounded-xl ${
          value === "expense"
            ? "bg-rose-50 dark:bg-rose-950/50"
            : "bg-emerald-50 dark:bg-emerald-950/50"
        }`}
        animate={{ x: value === "expense" ? 0 : "100%" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <button
        type="button"
        onClick={() => onChange("expense")}
        className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors ${
          value === "expense"
            ? "text-rose-600 dark:text-rose-400"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        Expense
      </button>
      <button
        type="button"
        onClick={() => onChange("income")}
        className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors ${
          value === "income"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        Income
      </button>
    </div>
  );
}

function ImagePreview({ url }: { url: string }) {
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!url) {
      setValid(false);
      setError(false);
      return;
    }
    /* quick check — the img onLoad/onError below handles the real validation */
    setValid(false);
    setError(false);
  }, [url]);

  if (!url) return null;

  return (
    <div className="mt-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Transaction receipt preview"
        className="h-24 w-24 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
        onLoad={() => setValid(true)}
        onError={() => {
          setValid(false);
          setError(true);
        }}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">Could not load image</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function AddTransactionPage() {
  const router = useRouter();

  /* ---- form state ---- */
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TransactionCategory>("auto");
  const [imageUrl, setImageUrl] = useState("");

  /* ---- ui state ---- */
  const [errors, setErrors] = useState<FormFieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  /* ---- AI detection state ---- */
  const [isDetecting, setIsDetecting] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);
  const [aiError, setAiError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- RTK Query mutations ---- */
  const [addTransaction, { isLoading: isSubmitting }] =
    useAddTransactionMutation();
  const [classifyTransaction] = useClassifyTransactionMutation();

  /* ---- AI category detection via real Gemini endpoint ---- */
  const runAiDetection = useCallback(
    async (titleValue: string) => {
      if (category !== "auto" || titleValue.trim().length < 2) return;

      setIsDetecting(true);
      setAiError(false);
      try {
        const result = await classifyTransaction({
          title: titleValue.trim(),
        }).unwrap();

        /* only apply if user hasn't manually changed category while we waited */
        if (category === "auto") {
          setCategory(result.category as TransactionCategory);
          setAiSuggested(true);
        }
      } catch {
        /* AI failure is non-critical — leave category as "auto" and show subtle hint */
        setAiError(true);
      } finally {
        setIsDetecting(false);
      }
    },
    [category, classifyTransaction],
  );

  /* debounce AI detection while typing (only when category is auto) */
  useEffect(() => {
    if (category !== "auto" || title.trim().length < 2) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }
    debounceRef.current = setTimeout(() => {
      runAiDetection(title);
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [title, category, runAiDetection]);

  /* clear AI badge if user manually changes category */
  const handleCategoryChange = (val: TransactionCategory) => {
    setCategory(val);
    if (val !== "auto") setAiSuggested(false);
  };

  /* ---- blur handler ---- */
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(title, amount, date);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field as keyof FormFieldErrors],
    }));
  };

  /* ---- submit ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const fieldErrors = validate(title, amount, date);
    setErrors(fieldErrors);
    setTouched({ title: true, amount: true, date: true });

    if (Object.keys(fieldErrors).length > 0) return;

    const transationInfo = {
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date,
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
    };

    try {
      /* ---- RTK Query mutation — swap this block for useAddTransactionMutation ---- */
      await addTransaction({
        title: title.trim(),
        amount: Number(amount),
        type,
        category,
        date,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
      }).unwrap();

      setIsSuccess(true);
      setTimeout(() => router.push("/transactions"), 800);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to add transaction. Please try again.";
      setServerError(msg);
    }
  };

  /* ---- inline field error ---- */
  const fieldError = (field: keyof FormFieldErrors) =>
    touched[field] && errors[field] ? (
      <p className="mt-1.5 text-xs text-red-500">{errors[field]}</p>
    ) : null;

  /* ---- shared input classes ---- */
  const inputBase =
    "w-full rounded-xl border bg-white py-2.5 pl-4 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500";
  const inputNormal =
    "border-slate-300 focus:border-indigo-500 dark:border-slate-700";
  const inputError = "border-red-500 focus:border-red-500";

  /* ================================================================= */
  /*  RENDER                                                            */
  /* ================================================================= */

  /* success state */
  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
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
              size={64}
              className="mx-auto text-emerald-500"
              strokeWidth={1.5}
            />
          </motion.div>
          <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
            Transaction added!
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Redirecting to transactions...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-[640px] px-4 sm:px-6">
        {/* ------------------------------------------------------------ */}
        {/*  Header                                                       */}
        {/* ------------------------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Link
            href="/transactions"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft size={16} />
            Back to Transactions
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Add Transaction
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Log a new income or expense
          </p>
        </motion.div>

        {/* ------------------------------------------------------------ */}
        {/*  Form card                                                    */}
        {/* ------------------------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"
        >
          {/* server error banner */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-6 overflow-hidden"
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type toggle */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Type
              </label>
              <TypeToggle value={type} onChange={setType} />
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Grocery shopping at Shwapno"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleBlur("title")}
                className={`${inputBase} ${
                  touched.title && errors.title ? inputError : inputNormal
                }`}
              />
              {fieldError("title")}
            </div>

            {/* Amount + Date — two columns on desktop */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ৳
                  </span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={() => handleBlur("amount")}
                    className={`${inputBase} pl-8 ${
                      touched.amount && errors.amount ? inputError : inputNormal
                    }`}
                  />
                </div>
                {fieldError("amount")}
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onBlur={() => handleBlur("date")}
                  className={`${inputBase} ${
                    touched.date && errors.date ? inputError : inputNormal
                  }`}
                />
                {fieldError("date")}
              </div>
            </div>

            {/* Short description */}
            <div>
              <label
                htmlFor="shortDesc"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Short Description
              </label>
              <input
                id="shortDesc"
                type="text"
                placeholder="Optional one-liner"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className={`${inputBase} ${inputNormal}`}
              />
            </div>

            {/* Full description */}
            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Full Description
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Add more detail about this transaction..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputBase} resize-none ${inputNormal}`}
              />
            </div>

            {/* Category + AI detection */}
            <div>
              <label
                htmlFor="category"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    handleCategoryChange(e.target.value as TransactionCategory)
                  }
                  className={`${inputBase} pr-8 ${inputNormal}`}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* AI suggested badge */}
                <AnimatePresence>
                  {aiSuggested && category !== "auto" && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                      className="absolute right-10 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400"
                    >
                      <Sparkles size={12} />
                      AI suggested
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* AI detecting indicator */}
              <AnimatePresence>
                {isDetecting && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 flex items-center gap-2 text-xs text-indigo-500 dark:text-indigo-400"
                  >
                    <Sparkles size={14} className="animate-pulse" />
                    AI is detecting category...
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI error hint — non-blocking, subtle */}
              <AnimatePresence>
                {aiError && !isDetecting && category === "auto" && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 text-xs text-amber-600 dark:text-amber-400"
                  >
                    Couldn&apost auto-detect — please choose a category
                  </motion.p>
                )}
              </AnimatePresence>

              {/* hint text */}
              <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <Sparkles size={12} />
                Leave as default and we&aposll auto-suggest a category based on
                your title using AI
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="imageUrl"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Receipt Image URL
              </label>
              <div className="relative">
                <ImageIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="imageUrl"
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={`${inputBase} pl-10 ${inputNormal}`}
                />
              </div>
              <ImagePreview url={imageUrl} />
            </div>

            {/* divider */}
            <div className="border-t border-slate-100 dark:border-slate-800" />

            {/* submit + cancel */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/transactions"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Transaction"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
