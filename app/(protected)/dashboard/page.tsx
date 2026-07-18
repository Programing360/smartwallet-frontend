"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, animate, useMotionValue } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Tag,
  Sparkles,
  Plus,
  Upload,
  FileBarChart,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { Skeleton } from "@heroui/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetDashboardSummaryQuery } from "@/store/api/transactionApi";
import { useGetLatestReportQuery } from "@/store/api/aiApi";
import type {
  DashboardSummary,
  DailySpending,
} from "@/store/api/transactionApi";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDateLong(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Category → fill colour used in both the pie chart and recent-transaction dots */
const CATEGORY_COLORS: Record<string, string> = {
  food: "#F59E0B",
  transport: "#3B82F6",
  bills: "#8B5CF6",
  shopping: "#EC4899",
  entertainment: "#F43F5E",
  other: "#64748B",
};

/* ------------------------------------------------------------------ */
/*  CountUp — animates a number from 0 → target using Framer Motion    */
/* ------------------------------------------------------------------ */

function CountUp({
  value,
  prefix = "",
  duration = 1.2,
}: {
  value: number;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controls = animate(mv, value, {
      duration,
      onUpdate: (latest) => {
        el.textContent = `${prefix}${Math.round(latest).toLocaleString()}`;
      },
    });
    return () => controls.stop();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [value, duration, prefix]);

  return <span ref={ref}>{prefix}0</span>;
}

/* ------------------------------------------------------------------ */
/*  Framer Motion stagger variants                                     */
/* ------------------------------------------------------------------ */

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Custom Recharts tooltip (avoids `any`)                             */
/* ------------------------------------------------------------------ */

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: DailySpending }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeletons                                                          */
/* ------------------------------------------------------------------ */

function KPICardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-8 w-32 rounded-lg" />
      <Skeleton className="mt-2 h-3 w-28 rounded-lg" />
    </div>
  );
}

function ChartSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <Skeleton className="mb-4 h-6 w-40 rounded-lg" />
      <Skeleton className={`${height} w-full rounded-lg`} />
    </div>
  );
}

function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <Skeleton className="mb-4 h-6 w-44 rounded-lg" />
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>

      {/* Two-column skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <ChartSkeleton />
          <ListSkeleton />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <Skeleton className="mb-4 h-6 w-32 rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
          <ChartSkeleton height="h-56" />
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <Skeleton className="mb-4 h-6 w-32 rounded-lg" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="mb-2 h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state — shown when user has zero transactions                */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-slate-600 dark:bg-slate-800"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10">
        <LayoutDashboard className="h-10 w-10 text-indigo-500" />
      </div>
      <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
        Start tracking your finances
      </h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Add your first transaction to see your financial overview,
        AI-powered insights, and spending analytics.
      </p>
      <Link
        href="/transactions/add"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4" />
        Add Your First Transaction
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section error — small inline banner that doesn't crash the page    */
/* ------------------------------------------------------------------ */

function SectionError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard page                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetDashboardSummaryQuery();

  const { data: report, isLoading: reportLoading } =
    useGetLatestReportQuery();

  /* ---- loading skeleton ---- */
  if (summaryLoading) return <DashboardSkeleton />;

  /* ---- full-page error ---- */
  if (summaryError || !summary) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <SectionError message="Failed to load dashboard data. Please try again later." />
      </div>
    );
  }

  /* ---- empty state: user has no transactions yet ---- */
  if (!summary.hasTransactions) return <EmptyState />;

  /* ---- derived values ---- */
  const greeting = getGreeting();
  const today = formatDateLong(new Date());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8"
      >
        {/* ====== Header ====== */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {greeting},{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                there
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {today}
            </p>
          </div>
          <Link
            href="/transactions/add"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </Link>
        </motion.div>

        {/* ====== KPI row ====== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* -- Total Income -- */}
          {/* Favourable = increase (emerald), Unfavourable = decrease (rose) */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Income
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              <CountUp value={summary.totalIncome} prefix="$" />
            </p>
            <p
              className={`mt-1 text-xs font-medium ${
                summary.percentChanges.income >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {summary.percentChanges.income >= 0 ? "+" : ""}
              {summary.percentChanges.income}% vs last month
            </p>
          </motion.div>

          {/* -- Total Expense -- */}
          {/* Favourable = decrease (emerald), Unfavourable = increase (rose) — opposite of income */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Expense
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/10">
                <TrendingDown className="h-5 w-5 text-rose-500" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              <CountUp value={summary.totalExpense} prefix="$" />
            </p>
            <p
              className={`mt-1 text-xs font-medium ${
                summary.percentChanges.expense <= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {summary.percentChanges.expense >= 0 ? "+" : ""}
              {summary.percentChanges.expense}% vs last month
            </p>
          </motion.div>

          {/* -- Net Savings -- */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Net Savings
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                <Wallet className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            {/* Negative savings get a warning tint */}
            <p
              className={`mt-3 text-2xl font-bold ${
                summary.netSavings >= 0
                  ? "text-slate-900 dark:text-white"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              <CountUp
                value={Math.abs(summary.netSavings)}
                prefix={summary.netSavings >= 0 ? "$" : "-$"}
              />
            </p>
            <p
              className={`mt-1 text-xs font-medium ${
                summary.percentChanges.savings >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {summary.percentChanges.savings >= 0 ? "+" : ""}
              {summary.percentChanges.savings}% vs last month
            </p>
          </motion.div>

          {/* -- Top Category -- */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Top Category
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                <Tag className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold capitalize text-slate-900 dark:text-white">
              {summary.topCategory.name}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              {formatCurrency(summary.topCategory.amount)} spent
            </p>
          </motion.div>
        </div>

        {/* ====== Two-column layout ====== */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* ---- Left column (~65%) ---- */}
          <div className="space-y-6 lg:col-span-3">
            {/* -- Spending Trend (area chart) -- */}
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Spending Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={summary.dailySpending}>
                    <defs>
                      <linearGradient
                        id="spendGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#F43F5E"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F43F5E"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E2E8F0"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => `$${v}`}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#F43F5E"
                      strokeWidth={2}
                      fill="url(#spendGradient)"
                      isAnimationActive
                      animationDuration={600}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* -- Recent Transactions -- */}
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Transactions
                </h3>
                <Link
                  href="/transactions"
                  className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {summary.recentTransactions.map((tx) => (
                  <Link
                    key={tx.id}
                    href={`/transactions/${tx.id}`}
                    className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${
                          CATEGORY_COLORS[tx.category] ?? "#64748B"
                        }18`,
                      }}
                    >
                      <Tag
                        className="h-4 w-4"
                        style={{
                          color: CATEGORY_COLORS[tx.category] ?? "#64748B",
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                        {tx.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {tx.category} ·{" "}
                        {new Date(tx.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        tx.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ---- Right column (~35%) ---- */}
          <div className="space-y-6 lg:col-span-2">
            {/* -- AI Insight -- */}
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800/50 dark:bg-indigo-950/30"
            >
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">
                  AI Insight
                </h3>
              </div>
              {reportLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-lg bg-indigo-200/60 dark:bg-indigo-800/30" />
                  <Skeleton className="h-4 w-3/4 rounded-lg bg-indigo-200/60 dark:bg-indigo-800/30" />
                </div>
              ) : report ? (
                <p className="text-sm leading-relaxed text-indigo-800 dark:text-indigo-200">
                  {report.insight}
                </p>
              ) : (
                <>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    Upload a bank statement to get personalized AI insights
                    about your spending patterns.
                  </p>
                  <Link
                    href="/reports"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Statement
                  </Link>
                </>
              )}
            </motion.div>

            {/* -- Spending by Category (donut) -- */}
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Spending by Category
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="amount"
                      nameKey="category"
                      isAnimationActive
                      animationDuration={600}
                    >
                      {summary.categoryBreakdown.map((entry) => (
                        <Cell
                          key={entry.category}
                          fill={
                            CATEGORY_COLORS[entry.category] ?? "#64748B"
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* custom legend below the chart */}
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                {summary.categoryBreakdown.map((entry) => (
                  <div
                    key={entry.category}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="inline-block h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[entry.category] ?? "#64748B",
                      }}
                    />
                    <span className="truncate text-xs capitalize text-slate-600 dark:text-slate-400">
                      {entry.category}
                    </span>
                    <span className="ml-auto text-xs font-medium text-slate-900 dark:text-white">
                      {entry.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* -- Quick Actions -- */}
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/transactions/add"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                    <Plus className="h-5 w-5 text-indigo-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    Add Transaction
                  </span>
                </Link>
                <Link
                  href="/reports"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                    <Upload className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    Upload Statement
                  </span>
                </Link>
                <Link
                  href="/reports"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
                    <FileBarChart className="h-5 w-5 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    View Reports
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
