"use client";

import { motion } from "framer-motion";
import {
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Wallet,
  Lightbulb,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetLatestReportQuery, type AIReport } from "@/store/api/aiApi";
import { formatCurrency } from "@/lib/formatters";

/* ------------------------------------------------------------------ */
/*  Shared variants                                                    */
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
/*  Chart Tooltip                                                      */
/* ------------------------------------------------------------------ */

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      {label && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold text-slate-900 dark:text-white">
          {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  KPI stat card                                                      */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Report Display                                                     */
/* ------------------------------------------------------------------ */

export default function ReportDisplay({
  report,
  needsReviewCount,
}: {
  report: AIReport;
  needsReviewCount?: number;
}) {

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ---- Review Banner ---- */}
      {(needsReviewCount ?? 0) > 0 && (
        <motion.div
          variants={fadeUp}
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800/50 dark:bg-amber-950/30"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {needsReviewCount} transaction{needsReviewCount !== 1 ? "s" : ""} may need review
            </p>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Some transactions extracted from your file had low AI confidence.
              Please review the imported transactions and correct categories if needed.
            </p>
          </div>
        </motion.div>
      )}

      {/* ---- AI Summary Card ---- */}
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
        <p className="text-sm leading-relaxed text-indigo-800 dark:text-indigo-200">
          {report.summary}
        </p>
        {report.month && (
          <p className="mt-3 text-xs text-indigo-400 dark:text-indigo-500">
            Report for{" "}
            {(() => {
              const [y, m] = report.month.split("-");
              const d = new Date(Number(y), Number(m) - 1);
              return d.toLocaleString("en-US", { month: "long", year: "numeric" });
            })()}
          </p>
        )}
      </motion.div>

      {/* ---- KPI Row ---- */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label="Transactions Imported"
          value={String(report.transactionCount)}
          icon={FileText}
          iconBg="bg-slate-100 dark:bg-slate-700"
          iconColor="text-slate-500 dark:text-slate-400"
        />
        <StatCard
          label="Top Spending Category"
          value={report.topCategories?.[0]?.category ?? "N/A"}
          icon={BarChart3}
          iconBg="bg-purple-50 dark:bg-purple-500/10"
          iconColor="text-purple-500"
        />
        <StatCard
          label="Highest Category Spend"
          value={formatCurrency(report.topCategories?.[0]?.amount)}
          icon={TrendingDown}
          iconBg="bg-rose-50 dark:bg-rose-500/10"
          iconColor="text-rose-500"
        />
        <StatCard
          label="Categories Tracked"
          value={String(report.topCategories?.length ?? 0)}
          icon={Wallet}
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
          iconColor="text-indigo-500"
        />
      </motion.div>

      {/* ---- Charts Row ---- */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {/* Donut — Spending by Category */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Spending by Category
          </h3>
          {(report.topCategories?.length ?? 0) > 0 ? (
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="h-56 w-full sm:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={report.topCategories ?? []}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="amount"
                      nameKey="category"
                      isAnimationActive
                      animationDuration={600}
                    >
                      {(report.topCategories ?? []).map((entry) => (
                        <Cell
                          key={entry.category}
                          fill={getCategoryColor(entry.category)}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-3 sm:w-1/2">
                {(report.topCategories ?? []).map((entry) => (
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
            <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No category data available
            </p>
          )}
        </div>

        {/* Bar — Category Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Category Breakdown
          </h3>
          {(report.topCategories?.length ?? 0) > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.topCategories ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="category"
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
                  <Bar
                    dataKey="amount"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive
                    animationDuration={600}
                  >
                    {(report.topCategories ?? []).map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={getCategoryColor(entry.category)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No data available for chart
            </p>
          )}
        </div>
      </motion.div>

      {/* ---- Insights ---- */}
      {(report.insights?.length ?? 0) > 0 && (
        <motion.div
          variants={fadeUp}
          className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Savings Insights
            </h3>
          </div>
          <div className="space-y-3">
            {report.insights.map((insight, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
              >
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
