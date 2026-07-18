"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Check,
  Loader2,
  ChevronDown,
  X,
  AlertTriangle,
  Utensils,
  Car,
  Receipt,
  ShoppingBag,
  Film,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import {
  useGetTransactionsQuery,
  useUpdateTransactionCategoryMutation,
  useDeleteTransactionMutation,
  useBulkDeleteTransactionsMutation,
  type Transaction,
  type TransactionCategory,
} from "@/store/api/transactionApi";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SaveStatus = "idle" | "saving" | "saved";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 15;

const CATEGORY_OPTIONS: { value: TransactionCategory; label: string }[] = [
  { value: "auto", label: "Auto (AI will detect)" },
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "bills", label: "Bills" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

const CATEGORY_COLORS: Record<
  TransactionCategory,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  auto: {
    icon: <Sparkles size={14} />,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    label: "Auto",
  },
  food: {
    icon: <Utensils size={14} />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    label: "Food",
  },
  transport: {
    icon: <Car size={14} />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    label: "Transport",
  },
  bills: {
    icon: <Receipt size={14} />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    label: "Bills",
  },
  shopping: {
    icon: <ShoppingBag size={14} />,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 dark:bg-pink-900/30",
    label: "Shopping",
  },
  entertainment: {
    icon: <Film size={14} />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    label: "Entertainment",
  },
  other: {
    icon: <MoreHorizontal size={14} />,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
    label: "Other",
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}

/* ------------------------------------------------------------------ */
/*  Modal                                                              */
/* ------------------------------------------------------------------ */

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  danger,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onCancel}
          />
          {/* dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                    danger
                      ? "bg-rose-100 dark:bg-rose-900/30"
                      : "bg-amber-100 dark:bg-amber-900/30"
                  }`}
                >
                  <AlertTriangle
                    size={20}
                    className={
                      danger
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                    danger
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline category editor                                             */
/* ------------------------------------------------------------------ */

function CategoryCell({
  transaction,
  onSaved,
}: {
  transaction: Transaction;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [updateCategory] = useUpdateTransactionCategoryMutation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cat = CATEGORY_COLORS[transaction.category] ?? CATEGORY_COLORS.other;

  /* close dropdown on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = async (newCat: TransactionCategory) => {
    if (newCat === transaction.category) {
      setOpen(false);
      return;
    }
    setOpen(false);
    setStatus("saving");
    try {
      await updateCategory({ id: transaction.id, category: newCat }).unwrap();
      setStatus("saved");
      onSaved();
      setTimeout(() => setStatus("idle"), 1000);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <span className={`flex items-center gap-1 ${cat.color}`}>
          {cat.icon}
          {cat.label}
        </span>
        <ChevronDown size={12} className="text-slate-400" />
      </button>

      {/* saving/saved indicator */}
      <AnimatePresence>
        {status !== "idle" && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute -right-8 top-1/2 -translate-y-1/2"
          >
            {status === "saving" ? (
              <Loader2 size={14} className="animate-spin text-indigo-500" />
            ) : (
              <Check size={14} className="text-emerald-500" />
            )}
          </motion.span>
        )}
      </AnimatePresence>

      {/* dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-30 mt-1 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            {CATEGORY_OPTIONS.filter((o) => o.value !== "auto").map((opt) => {
              const c = CATEGORY_COLORS[opt.value];
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    transaction.category === opt.value
                      ? "font-medium text-indigo-600 dark:text-indigo-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className={c.color}>{c.icon}</span>
                  {opt.label}
                  {transaction.category === opt.value && (
                    <Check size={14} className="ml-auto text-indigo-500" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
          <td className="px-4 py-3">
            <div className="h-4 w-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </td>
          <td className="px-4 py-3">
            <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </td>
        </tr>
      ))}
    </>
  );
}

function SkeletonCards() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-5 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="flex gap-2">
              <div className="h-7 w-7 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="h-7 w-7 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
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
  onPageChange: (p: number) => void;
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
    <nav className="mt-8 flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        Previous
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`d-${i}`} className="px-2 text-slate-400">
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

export default function ManageTransactionsPage() {
  /* ---- filter / page state ---- */
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  /* ---- RTK Query ---- */
  const { data, isLoading, isFetching } = useGetTransactionsQuery({
    search: debouncedSearch,
    category,
    dateRange: "all",
    sort: "newest",
    page,
    limit: PAGE_SIZE,
  });

  const transactions = data?.transactions ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.total ?? 0;

  /* ---- selection ---- */
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allOnPageSelected =
    transactions.length > 0 && transactions.every((t) => selected.has(t.id));

  const toggleAll = () => {
    if (allOnPageSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(transactions.map((t) => t.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* ---- single delete ---- */
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();

  const handleSingleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTransaction(deleteTarget.id).unwrap();
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
      setDeleteTarget(null);
    } catch {
      /* error handled by RTK Query */
    }
  };

  /* ---- bulk delete ---- */
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkDelete, { isLoading: isBulkDeleting }] =
    useBulkDeleteTransactionsMutation();

  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    try {
      await bulkDelete(ids).unwrap();
      setSelected(new Set());
      setShowBulkModal(false);
    } catch {
      /* error handled by RTK Query */
    }
  };

  /* ---- select class for filter ---- */
  const selectClass =
    "rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";

  const isInitialLoading = isLoading;

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
              Manage Transactions
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
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
          >
            <option value="all">All Categories</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="bills">Bills</option>
            <option value="shopping">Shopping</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Bulk actions bar                                             */}
        {/* ------------------------------------------------------------ */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex items-center gap-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 dark:border-indigo-800 dark:bg-indigo-950/30">
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  {selected.size} selected
                </span>
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700"
                >
                  <Trash2 size={14} />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
                >
                  Clear selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------------ */}
        {/*  Data — loading / empty / populated                            */}
        {/* ------------------------------------------------------------ */}
        <div className="mt-6">
          {isInitialLoading ? (
            <>
              {/* skeleton table (desktop) */}
              <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                    <tr>
                      <th className="w-12 px-4 py-3" />
                      <th className="px-4 py-3 font-medium text-slate-500">Title</th>
                      <th className="px-4 py-3 font-medium text-slate-500">Category</th>
                      <th className="px-4 py-3 font-medium text-slate-500">Amount</th>
                      <th className="px-4 py-3 font-medium text-slate-500">Date</th>
                      <th className="w-24 px-4 py-3 font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <SkeletonRows />
                  </tbody>
                </table>
              </div>
              {/* skeleton cards (mobile) */}
              <div className="md:hidden">
                <SkeletonCards />
              </div>
            </>
          ) : transactions.length === 0 ? (
            /* empty state */
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Search size={24} className="text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No transactions found
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Try adjusting your search or filter, or add a new transaction.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    setSearchInput("");
                    setCategory("all");
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
          ) : (
            <>
              {/* ------------------------------------------------------------ */}
              {/*  Desktop table                                                */}
              {/* ------------------------------------------------------------ */}
              <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                    <tr>
                      <th className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={allOnPageSelected}
                          onChange={toggleAll}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                        />
                      </th>
                      <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                        Title
                      </th>
                      <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                        Category
                      </th>
                      <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                        Amount
                      </th>
                      <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                        Date
                      </th>
                      <th className="w-24 px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {transactions.map((t) => {
                        const cat =
                          CATEGORY_COLORS[t.category] ?? CATEGORY_COLORS.other;
                        return (
                          <motion.tr
                            key={t.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selected.has(t.id)}
                                onChange={() => toggleOne(t.id)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                              />
                            </td>
                            <td className="max-w-[200px] truncate px-4 py-3 font-medium text-slate-900 dark:text-white">
                              <span className="inline-flex items-center gap-2">
                                <span className={cat.color}>{cat.icon}</span>
                                {t.title}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <CategoryCell
                                transaction={t}
                                onSaved={() => {}}
                              />
                            </td>
                            <td
                              className={`px-4 py-3 font-semibold ${
                                t.type === "income"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {t.type === "income" ? "+" : "-"}
                              {formatCurrency(t.amount)}
                            </td>
                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                              {formatDate(t.date)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Link
                                  href={`/transactions/${t.id}`}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                                  title="View"
                                >
                                  <Eye size={16} />
                                </Link>
                                <button
                                  onClick={() => setDeleteTarget(t)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* ------------------------------------------------------------ */}
              {/*  Mobile card list                                             */}
              {/* ------------------------------------------------------------ */}
              <div className="space-y-3 md:hidden">
                <AnimatePresence>
                  {transactions.map((t) => {
                    const cat =
                      CATEGORY_COLORS[t.category] ?? CATEGORY_COLORS.other;
                    return (
                      <motion.div
                        key={t.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selected.has(t.id)}
                            onChange={() => toggleOne(t.id)}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                {t.title}
                              </h3>
                              <span
                                className={`flex-shrink-0 text-sm font-bold ${
                                  t.type === "income"
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {t.type === "income" ? "+" : "-"}
                                {formatCurrency(t.amount)}
                              </span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cat.bg} ${cat.color}`}
                              >
                                {cat.icon}
                                {cat.label}
                              </span>
                              <span className="text-xs text-slate-400">
                                {formatDate(t.date)}
                              </span>
                            </div>

                            {/* inline category editor (mobile) */}
                            <div className="mt-2">
                              <CategoryCell
                                transaction={t}
                                onSaved={() => {}}
                              />
                            </div>

                            {/* actions */}
                            <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                              <Link
                                href={`/transactions/${t.id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                              >
                                <Eye size={14} />
                                View
                              </Link>
                              <button
                                onClick={() => setDeleteTarget(t)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
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

      {/* ---------------------------------------------------------------- */}
      {/*  Single delete modal                                             */}
      {/* ---------------------------------------------------------------- */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this transaction?"
        description="This action can't be undone. The transaction will be permanently removed."
        confirmLabel="Delete"
        danger
        loading={isDeleting}
        onConfirm={handleSingleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ---------------------------------------------------------------- */}
      {/*  Bulk delete modal                                               */}
      {/* ---------------------------------------------------------------- */}
      <ConfirmModal
        open={showBulkModal}
        title={`Delete ${selected.size} transaction${selected.size !== 1 ? "s" : ""}?`}
        description="This action can't be undone. All selected transactions will be permanently removed."
        confirmLabel={`Delete ${selected.size}`}
        danger
        loading={isBulkDeleting}
        onConfirm={handleBulkDelete}
        onCancel={() => setShowBulkModal(false)}
      />
    </div>
  );
}
