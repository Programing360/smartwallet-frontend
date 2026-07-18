"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  Utensils,
  Car,
  Receipt,
  ShoppingBag,
  Film,
  MoreHorizontal,
  Calendar,
  Tag,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@heroui/react";
import { Badge } from "@heroui/react";
import { Skeleton } from "@heroui/react";
import {
  useGetTransactionByIdQuery,
  useGetRelatedTransactionsQuery,
  type TransactionDetail,
  type Transaction,
  type TransactionCategory,
} from "@/store/api/transactionApi";
import { formatCurrency } from "@/lib/formatters";

/* ------------------------------------------------------------------ */
/*  Category → icon / color mapping (mirrors listing page)             */
/* ------------------------------------------------------------------ */

const CATEGORY_MAP: Record<
  TransactionCategory,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  auto: {
    icon: <Sparkles size={20} />,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    label: "Auto",
  },
  food: {
    icon: <Utensils size={20} />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    label: "Food",
  },
  transport: {
    icon: <Car size={20} />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    label: "Transport",
  },
  bills: {
    icon: <Receipt size={20} />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    label: "Bills",
  },
  shopping: {
    icon: <ShoppingBag size={20} />,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 dark:bg-pink-900/30",
    label: "Shopping",
  },
  entertainment: {
    icon: <Film size={20} />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    label: "Entertainment",
  },
  other: {
    icon: <MoreHorizontal size={20} />,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
    label: "Other",
  },
};

const CATEGORY_MAP_LARGE: Record<
  TransactionCategory,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  auto: {
    icon: <Sparkles size={28} />,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  food: {
    icon: <Utensils size={28} />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
  transport: {
    icon: <Car size={28} />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  bills: {
    icon: <Receipt size={28} />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  shopping: {
    icon: <ShoppingBag size={28} />,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 dark:bg-pink-900/30",
  },
  entertainment: {
    icon: <Film size={28} />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  other: {
    icon: <MoreHorizontal size={28} />,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncateId(id: string): string {
  if (id.length <= 12) return id;
  return `${id.slice(0, 8)}...${id.slice(-4)}`;
}

/* ------------------------------------------------------------------ */
/*  AI insight mock text by category                                   */
/* ------------------------------------------------------------------ */

const AI_INSIGHTS: Record<TransactionCategory, string> = {
  auto: "This AI-classified transaction has been accurately categorized based on its description and amount patterns.",
  food: "This food expense is 12% higher than your average food spending this month. Consider meal prepping to reduce costs.",
  transport: "Your transport spending has increased by 8% compared to last month. Carpooling could save you roughly $45/month.",
  bills: "This bill is within your typical range. Setting up autopay can help you avoid late fees and maintain a good payment record.",
  shopping: "This shopping expense is 20% above your monthly average. You might want to review your recent purchases in this category.",
  entertainment: "Entertainment spending is trending up this month. You've spent 15% more on leisure activities than last month.",
  other: "This transaction has been categorized automatically. You can recategorize it for more accurate spending insights.",
};

/* ------------------------------------------------------------------ */
/*  Not Found state                                                    */
/* ------------------------------------------------------------------ */

function TransactionNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
        <AlertCircle className="h-10 w-10 text-rose-500" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
        Transaction Not Found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The transaction you&apos;re looking for doesn&apos;t exist or may have
        been removed.
      </p>
      <Link
        href="/transactions"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Transactions
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton loading layout                                            */
/* ------------------------------------------------------------------ */

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Back link skeleton */}
      <Skeleton className="h-5 w-48 rounded-lg" />

      {/* Header card skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-2/3 rounded-lg" />
            <Skeleton className="h-5 w-1/3 rounded-lg" />
            <Skeleton className="h-4 w-28 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* Overview skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <Skeleton className="mb-4 h-6 w-32 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="mt-2 h-4 w-5/6 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-3/4 rounded-lg" />
      </div>

      {/* Key info skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <Skeleton className="mb-4 h-6 w-40 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20 rounded-lg" />
              <Skeleton className="h-5 w-32 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* AI insight skeleton */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800/50 dark:bg-indigo-950/30">
        <Skeleton className="mb-3 h-5 w-32 rounded-lg bg-indigo-200/60 dark:bg-indigo-800/30" />
        <Skeleton className="h-4 w-full rounded-lg bg-indigo-200/60 dark:bg-indigo-800/30" />
        <Skeleton className="mt-2 h-4 w-2/3 rounded-lg bg-indigo-200/60 dark:bg-indigo-800/30" />
      </div>

      {/* Related skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-44 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <Skeleton className="mb-3 h-9 w-9 rounded-lg" />
              <Skeleton className="mb-2 h-4 w-3/4 rounded-lg" />
              <Skeleton className="mb-2 h-3 w-1/2 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Copy-to-clipboard button with animation                            */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard write failed silently */
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
      title="Copy transaction ID"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
          >
            <Check size={12} />
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1"
          >
            <Copy size={12} />
            Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Related transaction mini-card                                      */
/* ------------------------------------------------------------------ */

function RelatedCard({ transaction }: { transaction: Transaction }) {
  const cat = CATEGORY_MAP[transaction.category] ?? CATEGORY_MAP.other;
  const isIncome = transaction.type === "income";

  return (
    <Link href={`/transactions/${transaction._id}`} className="block">
      <div className="group rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-lg/5">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cat.bg}`}
          >
            <span className={cat.color}>{cat.icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {transaction.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatDateShort(transaction.date)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge
            variant="soft"
            size="sm"
            className="capitalize"
          >
            {cat.label}
          </Badge>
          <p
            className={`text-sm font-bold ${
              isIncome
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function TransactionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  /* ---- RTK Query ---- */
  const {
    data: tx,
    isLoading,
    isError,
  } = useGetTransactionByIdQuery(id, { skip: !id });

  const { data: related = [] } = useGetRelatedTransactionsQuery(
    { category: tx?.category ?? "", excludeId: id },
    { skip: !tx }
  );

  /* ---- AOS init — remove this useEffect if AOS is already initialised globally in the root layout ---- */
  useEffect(() => {
    AOS.init({
      duration: 400,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  /* ---- loading state ---- */
  if (isLoading) return <DetailSkeleton />;

  /* ---- error / not-found state ---- */
  if (isError || !tx) return <TransactionNotFound />;

  const cat = CATEGORY_MAP[tx.category] ?? CATEGORY_MAP.other;
  const catLarge =
    CATEGORY_MAP_LARGE[tx.category] ?? CATEGORY_MAP_LARGE.other;
  const isIncome = tx.type === "income";
  const displayDescription =
    tx.fullDescription || tx.description || "No description provided.";
  const insight =
    AI_INSIGHTS[tx.category] ??
    "Transaction has been recorded. Continue tracking for AI-powered insights.";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* ====== Back Link ====== */}
        <Link
          href="/transactions"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={16} />
          Back to Transactions
        </Link>

        {/* ====== Header Card ====== */}
        <Card
          data-aos="fade-up"
          data-aos-once="true"
          className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Banner image — only shown if imageUrl exists */}
          {tx.imageUrl && (
            <div className="relative w-full overflow-hidden rounded-t-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tx.imageUrl}
                alt={tx.title}
                className="h-48 w-full object-cover sm:h-64"
              />
            </div>
          )}

          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              {/* Left: icon + title + meta */}
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${catLarge.bg}`}
                >
                  <span className={catLarge.color}>{catLarge.icon}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {tx.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="soft" size="sm" className="capitalize">
                      {cat.label}
                    </Badge>
                    {tx.aiClassified && (
                      <Badge
                        variant="soft"
                        size="sm"
                        color="accent"
                        className="gap-1"
                      >
                        <Sparkles size={10} />
                        AI Classified
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar size={14} />
                    {formatDate(tx.date)}
                  </p>
                </div>
              </div>

              {/* Right: amount */}
              <div className="sm:text-right">
                <p
                  className={`text-3xl font-bold ${
                    isIncome
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </p>
                <p
                  className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
                    isIncome
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isIncome ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {isIncome ? "Income" : "Expense"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====== Overview / Description ====== */}
        {displayDescription && (
          <Card
            data-aos="fade-up"
            data-aos-delay="150"
            data-aos-once="true"
            className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
          <CardContent className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <FileText size={18} className="text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Overview
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {displayDescription}
            </p>
          </CardContent>
          </Card>
        )}

        {/* ====== Key Information ====== */}
        <Card
          data-aos="fade-up"
          data-aos-delay="250"
          data-aos-once="true"
          className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Tag size={18} className="text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Key Information
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Type */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Type
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-white">
                  {isIncome ? (
                    <TrendingUp size={14} className="text-emerald-500" />
                  ) : (
                    <TrendingDown size={14} className="text-rose-500" />
                  )}
                  {isIncome ? "Income" : "Expense"}
                </p>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Category
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium capitalize text-slate-900 dark:text-white">
                  <span className={cat.color}>{cat.icon}</span>
                  {cat.label}
                </p>
              </div>

              {/* Date Added */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Date Added
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                  {formatDate(tx.date)}
                </p>
              </div>

              {/* Source */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Source
                </p>
                <p className="mt-1 text-sm font-medium capitalize text-slate-900 dark:text-white">
                  {tx.source === "csv" ? "CSV Import" : "Manual Entry"}
                </p>
              </div>

              {/* Transaction ID */}
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Transaction ID
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <code className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {truncateId(tx._id)}
                  </code>
                  <CopyButton text={tx._id} />
                </div>
              </div>

              {/* AI Confidence */}
              {tx.aiClassified && tx.aiConfidence && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    AI Classification
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {tx.aiConfidence === "high" ? (
                      <ShieldCheck size={14} className="text-emerald-500" />
                    ) : tx.aiConfidence === "medium" ? (
                      <ShieldCheck size={14} className="text-amber-500" />
                    ) : (
                      <ShieldAlert size={14} className="text-rose-500" />
                    )}
                    <span className="text-sm font-medium capitalize text-slate-900 dark:text-white">
                      {tx.aiConfidence} confidence
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ====== AI Insight ====== */}
        <div
          data-aos="fade-up"
          data-aos-delay="350"
          data-aos-once="true"
          className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800/50 dark:bg-indigo-950/30"
        >
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-300">
              AI Insight
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-indigo-800 dark:text-indigo-200">
            {insight}
          </p>
        </div>

        {/* ====== Related Transactions ====== */}
        {related.length > 0 && (
          <div
            data-aos="fade-up"
            data-aos-delay="450"
            data-aos-once="true"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Related Transactions
              </h2>
              <Link
                href="/transactions"
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View All
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <RelatedCard key={r._id} transaction={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
