"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileBarChart,
  TrendingUp,
  TrendingDown,
  Wallet,
  Sparkles,
  ArrowRight,
  Upload,
} from "lucide-react";
import { Skeleton } from "@heroui/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useGetDashboardSummaryQuery } from "@/store/api/transactionApi";
import { useGetLatestReportQuery } from "@/store/api/aiApi";
import { formatCurrency } from "@/lib/formatters";
import type { CategoryBreakdown } from "@/store/api/transactionApi";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const CATEGORY_COLORS: Record<string, string> = {
  food: "#F59E0B",
  transport: "#3B82F6",
  bills: "#8B5CF6",
  shopping: "#EC4899",
  entertainment: "#F43F5E",
  other: "#64748B",
};

function getCategoryColor(category: string): string {
  const normalized = category?.toLowerCase() || "other";
  return CATEGORY_COLORS[normalized] ?? CATEGORY_COLORS.other;
}

/* ------------------------------------------------------------------ */
/*  Skeletons                                                          */
/* ------------------------------------------------------------------ */

function ReportsSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="h-4 w-64 rounded-lg" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
          >
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="mt-3 h-8 w-32 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <Skeleton className="mb-4 h-6 w-40 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Framer Motion variants                                             */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ReportsPage() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetDashboardSummaryQuery();

  const {
    data: report,
    isLoading: reportLoading,
    isError: reportError,
  } = useGetLatestReportQuery();

  if (summaryLoading) return <ReportsSkeleton />;

  const hasTransactions =
    summary?.hasTransactions ?? (summary?.recentTransactions?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8"
      >
        {/* ====== Header ====== */}
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Financial overview and AI-powered insights
          </p>
        </motion.div>

        {/* ====== Financial Summary KPIs ====== */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {/* Total Income */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Income
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(summary?.totalIncome)}
            </p>
          </div>

          {/* Total Expense */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Expense
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/10">
                <TrendingDown className="h-5 w-5 text-rose-500" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(summary?.totalExpense)}
            </p>
          </div>

          {/* Net Savings */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Net Savings
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                <Wallet className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <p
              className={`mt-3 text-2xl font-bold ${
                (summary?.netSavings ?? 0) >= 0
                  ? "text-slate-900 dark:text-white"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatCurrency(summary?.netSavings)}
            </p>
          </div>
        </motion.div>

        {/* ====== AI Report Card ====== */}
        <motion.div
          variants={fadeUp}
          className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800/50 dark:bg-indigo-950/30"
        >
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">
              AI Financial Report
            </h2>
          </div>

          {reportLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-lg bg-indigo-200/60 dark:bg-indigo-800/30" />
              <Skeleton className="h-4 w-3/4 rounded-lg bg-indigo-200/60 dark:bg-indigo-800/30" />
              <Skeleton className="h-4 w-1/2 rounded-lg bg-indigo-200/60 dark:bg-indigo-800/30" />
            </div>
          ) : reportError ? (
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              Unable to load AI report. Please try again later.
            </p>
          ) : report ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                {report.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-indigo-800 dark:text-indigo-200">
                {report.insight}
              </p>
              <p className="mt-3 text-xs text-indigo-400 dark:text-indigo-500">
                Generated{" "}
                {new Date(report.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                No AI report available yet. Upload a bank statement to generate
                a personalized financial report with AI-powered insights.
              </p>
              <Link
                href="/reports/upload"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                <Upload className="h-4 w-4" />
                Upload Statement
              </Link>
            </div>
          )}
        </motion.div>

        {/* ====== Category Breakdown ====== */}
        <motion.div
          variants={fadeUp}
          className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Spending by Category
          </h2>

          {summaryError ? (
            <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Unable to load category data
            </p>
          ) : (summary?.categoryBreakdown ?? []).length > 0 ? (
            <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
              {/* Donut chart */}
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary?.categoryBreakdown ?? []}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="amount"
                      nameKey="category"
                      isAnimationActive
                      animationDuration={600}
                    >
                      {(summary?.categoryBreakdown ?? []).map((entry) => (
                        <Cell
                          key={entry.category}
                          fill={getCategoryColor(entry.category)}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {(summary?.categoryBreakdown ?? []).map((entry) => (
                  <div key={entry.category} className="flex items-center gap-3">
                    <span
                      className="inline-block h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor: getCategoryColor(entry.category),
                      }}
                    />
                    <span className="flex-1 truncate text-sm capitalize text-slate-700 dark:text-slate-300">
                      {entry.category}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(entry.amount)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {entry.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No spending data available yet. Add transactions to see your
                category breakdown.
              </p>
              <Link
                href="/transactions/add"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Add Your First Transaction
              </Link>
            </div>
          )}
        </motion.div>

        {/* ====== CTA ====== */}
        {!hasTransactions && (
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-600 dark:bg-slate-800"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10">
              <FileBarChart className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              Start building your financial picture
            </h3>
            <p className="mt-2 mx-auto max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Add transactions and upload bank statements to see detailed
              reports and AI-powered insights about your spending habits.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/transactions/add"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-700"
              >
                Add Transaction
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/reports/upload"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Upload className="h-4 w-4" />
                Upload Statement
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
