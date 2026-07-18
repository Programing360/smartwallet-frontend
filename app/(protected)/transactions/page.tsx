"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Utensils,
  Car,
  Receipt,
  ShoppingBag,
  Film,
  MoreHorizontal,
  ArrowUpDown,
  Calendar,
  Tag,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import {
  useGetTransactionsQuery,
  type Transaction,
  type TransactionCategory,
  type SortOption,
  type DateRange,
} from "@/store/api/transactionApi";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FilterState {
  search: string;
  category: string;
  dateRange: DateRange;
  sort: SortOption;
  page: number;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 12;

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "bills", label: "Bills" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
] as const;

const DATE_RANGE_OPTIONS = [
  { value: "all" as DateRange, label: "All Time" },
  { value: "month" as DateRange, label: "This Month" },
  { value: "30days" as DateRange, label: "Last 30 Days" },
  { value: "90days" as DateRange, label: "Last 90 Days" },
] as const;

const SORT_OPTIONS = [
  { value: "newest" as SortOption, label: "Newest First" },
  { value: "oldest" as SortOption, label: "Oldest First" },
  { value: "amount_high" as SortOption, label: "Amount: High to Low" },
  { value: "amount_low" as SortOption, label: "Amount: Low to High" },
] as const;

/* ------------------------------------------------------------------ */
/*  Category → icon / color mapping                                     */
/* ------------------------------------------------------------------ */

const CATEGORY_MAP: Record<
  TransactionCategory,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  auto: {
    icon: <Sparkles size={18} />,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    label: "Auto",
  },
  food: {
    icon: <Utensils size={18} />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    label: "Food",
  },
  transport: {
    icon: <Car size={18} />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    label: "Transport",
  },
  bills: {
    icon: <Receipt size={18} />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    label: "Bills",
  },
  shopping: {
    icon: <ShoppingBag size={18} />,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 dark:bg-pink-900/30",
    label: "Shopping",
  },
  entertainment: {
    icon: <Film size={18} />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    label: "Entertainment",
  },
  other: {
    icon: <MoreHorizontal size={18} />,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
    label: "Other",
  },
};

/* ------------------------------------------------------------------ */
/*  Custom debounce hook                                               */
/* ------------------------------------------------------------------ */

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}

/* ------------------------------------------------------------------ */
/*  Skeleton card                                                      */
/* ------------------------------------------------------------------ */

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* icon placeholder */}
      <div className="mb-4 h-10 w-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      {/* title */}
      <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      {/* badge */}
      <div className="mb-4 h-5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      {/* amount */}
      <div className="mb-2 h-5 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      {/* date */}
      <div className="mb-4 h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      {/* divider */}
      <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Transaction card                                                   */
/* ------------------------------------------------------------------ */

function TransactionCard({
  transaction,
  index,
}: {
  transaction: Transaction;
  index: number;
}) {
  const cat = CATEGORY_MAP[transaction.category] ?? CATEGORY_MAP.other;
console.log(transaction);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04, ease: "easeOut" }}
      className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-lg/5"
    >
      {/* icon */}
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${cat.bg} ${cat.color}`}>
        {cat.icon}
      </div>

      {/* title */}
      <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
        {transaction.title}
      </h3>

      {/* category badge */}
      <span className="mt-1.5 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {cat.label}
      </span>

      {/* amount */}
      <p
        className={`mt-3 text-lg font-bold ${
          transaction.type === "income"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-400"
        }`}
      >
        {transaction.type === "income" ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </p>

      {/* date */}
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {formatDate(transaction.date)}
      </p>

      {/* view details */}
      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Link
          href={`/transactions/${transaction?._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <FileText size={14} />
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
        <Tag size={28} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        No transactions found
      </h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Try adjusting your filters or search terms, or add a new transaction to
        get started.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={onClear}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Clear Filters
        </button>
        <Link
          href="/transactions/add"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Transaction
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pagination                                                         */
/* ------------------------------------------------------------------ */

function PaginationControls({
  current,
  total,
  onPageChange,
}: {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (total <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        Previous
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-slate-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              p === current
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        Next
      </button>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function TransactionsPage() {
  /* ---- filter / search / sort state ---- */
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  /* debounce search 400ms */
  const debouncedSearch = useDebounce(searchInput, 400);

  /* reset to page 1 when any filter changes */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, dateRange, sort]);

  /* ---- RTK Query ---- */
  const { data, isLoading, isFetching, error } = useGetTransactionsQuery({
    search: debouncedSearch,
    category,
    dateRange,
    sort,
    page,
  });

  const transactions = data?.transactions ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.total ?? 0;

  const isInitialLoading = isLoading;
  const isRefetching = isFetching && !isLoading;

  /* ---- clear all filters ---- */
  const clearFilters = useCallback(() => {
    setSearchInput("");
    setCategory("all");
    setDateRange("all");
    setSort("newest");
    setPage(1);
  }, []);

  const hasActiveFilters =
    searchInput !== "" ||
    category !== "all" ||
    dateRange !== "all" ||
    sort !== "newest";

  /* ---- select base class ---- */
  const selectClass =
    "rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-indigo-500";

  /* ================================================================= */
  /*  RENDER                                                            */
  /* ================================================================= */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ------------------------------------------------------------ */}
        {/*  Header                                                       */}
        {/* ------------------------------------------------------------ */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Transactions
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isInitialLoading
                ? "Loading..."
                : `${totalCount} transaction${totalCount !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link
            href="/transactions/add"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Transaction
          </Link>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Toolbar                                                      */}
        {/* ------------------------------------------------------------ */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search transactions..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* category filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* date range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className={selectClass}
          >
            {DATE_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* sort */}
          <div className="relative">
            <ArrowUpDown
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className={`${selectClass} pl-8`}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* active filters indicator */}
        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Filters active
            </span>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:hover:bg-indigo-900"
            >
              <X size={12} />
              Clear all
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/*  Error state                                                  */}
        {/* ------------------------------------------------------------ */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
            Failed to load transactions. Please check your connection and try
            again.
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/*  Transaction grid / skeleton / empty                           */}
        {/* ------------------------------------------------------------ */}
        <div className="mt-8">
          {isInitialLoading ? (
            /* skeleton grid */
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            /* data grid with crossfade on refetch */
            <div
              className={`transition-opacity duration-200 ${
                isRefetching ? "pointer-events-none opacity-60" : "opacity-100"
              }`}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {transactions.map((t, i) => (
                    <TransactionCard key={t._id} transaction={t} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Pagination                                                   */}
        {/* ------------------------------------------------------------ */}
        {!isInitialLoading && transactions.length > 0 && (
          <PaginationControls
            current={page}
            total={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
