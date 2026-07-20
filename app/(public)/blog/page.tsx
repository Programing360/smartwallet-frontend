"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Calendar,
  Clock,
  ArrowRight,
  X,
  BookOpen,
} from "lucide-react";
import {
  Skeleton,
  Select,
  Label,
  Description,
  Header,
  ListBox,
  SearchField,
} from "@heroui/react";
import {
  useGetBlogsQuery,
  type Blog,
  type BlogSortOption,
  type BlogCategory,
} from "@/store/api/blogApi";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                 */
/* ------------------------------------------------------------------ */
type BlogCategoryFilter = "all" | BlogCategory;

const CATEGORY_OPTIONS: { id: BlogCategoryFilter; label: string }[] = [
  { id: "all", label: "All Categories" },
  { id: "budgeting", label: "Budgeting" },
  { id: "saving", label: "Saving" },
  { id: "investing", label: "Investing" },
  { id: "debt_management", label: "Debt Management" },
  { id: "financial_planning", label: "Financial Planning" },
  { id: "ai_finance", label: "AI & Finance" },
];

const SORT_OPTIONS: { id: BlogSortOption; label: string }[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "quickest_read", label: "Quickest Read" },
];

const CATEGORY_COLORS: Record<
  BlogCategory,
  { bg: string; text: string; darkBg: string; darkText: string; border: string }
> = {
  budgeting: { bg: "bg-indigo-50", text: "text-indigo-700", darkBg: "dark:bg-indigo-950/40", darkText: "dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-900/50" },
  saving: { bg: "bg-emerald-50", text: "text-emerald-700", darkBg: "dark:bg-emerald-950/40", darkText: "dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-900/50" },
  investing: { bg: "bg-blue-50", text: "text-blue-700", darkBg: "dark:bg-blue-950/40", darkText: "dark:text-blue-400", border: "border-blue-200 dark:border-blue-900/50" },
  debt_management: { bg: "bg-rose-50", text: "text-rose-700", darkBg: "dark:bg-rose-950/40", darkText: "dark:text-rose-400", border: "border-rose-200 dark:border-rose-900/50" },
  financial_planning: { bg: "bg-amber-50", text: "text-amber-700", darkBg: "dark:bg-amber-950/40", darkText: "dark:text-amber-400", border: "border-amber-200 dark:border-amber-900/50" },
  ai_finance: { bg: "bg-purple-50", text: "text-purple-700", darkBg: "dark:bg-purple-950/40", darkText: "dark:text-purple-400", border: "border-purple-200 dark:border-purple-900/50" },
};

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  budgeting: "Budgeting",
  saving: "Saving",
  investing: "Investing",
  debt_management: "Debt Management",
  financial_planning: "Financial Planning",
  ai_finance: "AI & Finance",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Skeleton UI                                                       */
/* ------------------------------------------------------------------ */
function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-slate-900 dark:bg-slate-900/50">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="flex flex-1 flex-col p-6 space-y-3">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-6 w-full rounded-lg" />
        <Skeleton className="h-4 w-5/6 rounded-lg" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Blog Card Component                                               */
/* ------------------------------------------------------------------ */
function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  const catColors = CATEGORY_COLORS[blog.category] ?? CATEGORY_COLORS.budgeting;
  const catLabel = CATEGORY_LABELS[blog.category] ?? blog.category;
  const isFeatured = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-slate-800/60 dark:bg-slate-900/60 ${
        isFeatured ? "md:col-span-2 lg:flex-row" : ""
      }`}
    >
      <div className={`relative overflow-hidden aspect-[16/10] ${isFeatured ? "w-full lg:max-w-[45%]" : "w-full"}`}>
        <Image
          src={blog.coverImageUrl}
          alt={blog.title}
          fill
          priority={isFeatured}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="mb-3">
          <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium tracking-wide shadow-sm backdrop-blur-sm ${catColors.bg} ${catColors.text} ${catColors.darkBg} ${catColors.darkText} ${catColors.border}`}>
            {catLabel}
          </span>
        </div>

        <Link href={`/blog/${blog.slug}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          <h3 className={`font-bold text-slate-900 tracking-tight dark:text-white transition-colors duration-200 ${
            isFeatured ? "text-xl sm:text-2xl" : "text-lg line-clamp-2"
          }`}>
            {blog.title}
          </h3>
        </Link>

        <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2 dark:text-slate-400">
          {blog.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-xs font-medium text-slate-400 dark:text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <User size={14} className="text-slate-300 dark:text-slate-600" />
            {blog.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-300 dark:text-slate-600" />
            {formatDate(blog.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className="text-slate-300 dark:text-slate-600" />
            {blog.readTimeMinutes} min read
          </span>
        </div>

        <div className="mt-4 pt-1">
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400"
          >
            Read Full Article
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State Component                                             */
/* ------------------------------------------------------------------ */
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 max-w-md mx-auto text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
        <BookOpen size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">No articles matched</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        We couldn&apos;t find any matching publications. Try adjusting your input parameters.
      </p>
      <button
        onClick={onClear}
        className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm"
      >
        Reset Filters
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pagination Component                                              */
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
    <nav className="mt-16 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="rounded-xl border border-slate-200/70 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 shadow-sm"
      >
        Previous
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-slate-400 font-medium">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[40px] h-10 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              p === current
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="rounded-xl border border-slate-200/70 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 shadow-sm"
      >
        Next
      </button>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                               */
/* ------------------------------------------------------------------ */
export default function BlogPage() {
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<BlogCategoryFilter>("all");
  const [sort, setSort] = useState<BlogSortOption>("newest");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, sort]);

  const { data, isLoading, isFetching, error } = useGetBlogsQuery({
    search: debouncedSearch,
    category,
    sort,
    page,
  });

  const blogs = data?.blogs ?? [];
  const totalPages = data?.totalPages ?? 1;

  const isInitialLoading = isLoading;
  const isRefetching = isFetching && !isLoading;

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setCategory("all");
    setSort("newest");
    setPage(1);
  }, []);

  const hasActiveFilters = searchInput !== "" || category !== "all" || sort !== "newest";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 selection:bg-indigo-500 selection:text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="relative mx-auto max-w-5xl text-center mb-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl rounded-full -z-10" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-700 backdrop-blur-sm dark:border-indigo-800/60 dark:bg-indigo-950/30 dark:text-indigo-400">
            Insights Portal
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl bg-clip-text">
            Financial Knowledge Hub
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            Smart budgeting metrics, market updates, and leveraging modern AI frameworks to accelerate your financial freedom.
          </p>
        </div>

        {/* CONTROLS / TOOLBAR */}
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200/60 bg-white/60 p-4 shadow-xl shadow-slate-200/10 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60 dark:shadow-none mb-8">
          <div className="flex flex-col gap-4 md:flex-row items-center w-full">
            
            {/* SearchField Compound Architecture */}
            <div className="w-full md:flex-1">
              <SearchField 
                value={searchInput} 
                onChange={setSearchInput}
                className="w-full"
              >
                <Label className="sr-only">Search articles</Label>
                <SearchField.Group className="relative flex items-center w-full h-11 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all duration-200">
                  <SearchField.SearchIcon className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                  <SearchField.Input 
                    placeholder="Search resources, topics, articles..." 
                    className="w-full h-full pl-11 pr-10 bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
                  />
                  {searchInput && (
                    <SearchField.ClearButton className="absolute right-3 p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <X size={14} />
                    </SearchField.ClearButton>
                  )}
                </SearchField.Group>
                <Description className="sr-only">Search articles filtering input description</Description>
              </SearchField>
            </div>

            {/* Custom Select Form Components using requested layout syntax */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              
              {/* Category Dropdown */}
              <Select 
                selectedKey={category} 
                onSelectionChange={(key) => setCategory((key ? String(key) : "all") as BlogCategoryFilter)}
                className="w-full sm:w-48"
              >
                <Label className="sr-only">Category</Label>
                <Select.Trigger className="flex items-center justify-between w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 outline-none">
                  <Select.Value>
                    {CATEGORY_OPTIONS.find(o => o.id === category)?.label}
                  </Select.Value>
                  <Select.Indicator />
                </Select.Trigger>
                <Description className="sr-only">Filter list by category sorting logic</Description>
                <Select.Popover className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl mt-1 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <ListBox className="p-1 space-y-0.5 max-h-64 overflow-y-auto outline-none">
                    {CATEGORY_OPTIONS.map((opt) => (
                      <ListBox.Item 
                        key={opt.id} 
                        id={opt.id}
                        className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors outline-none select-none ${
                          category === opt.id 
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400" 
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <Label>{opt.label}</Label>
                        <Description className="sr-only">{opt.label} filter option</Description>
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              {/* Sorting Dropdown */}
              <Select 
                selectedKey={sort} 
                onSelectionChange={(key) => setSort((key ? String(key) : "newest") as BlogSortOption)}
                className="w-full sm:w-44"
              >
                <Label className="sr-only">Sort By</Label>
                <Select.Trigger className="flex items-center justify-between w-full h-11 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 outline-none">
                  <Select.Value>
                    {SORT_OPTIONS.find(o => o.id === sort)?.label}
                  </Select.Value>
                  <Select.Indicator />
                </Select.Trigger>
                <Description className="sr-only">Ordering sequence for system posts</Description>
                <Select.Popover className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl mt-1 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <ListBox className="p-1 space-y-0.5 outline-none">
                    {SORT_OPTIONS.map((opt) => (
                      <ListBox.Item 
                        key={opt.id} 
                        id={opt.id}
                        className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors outline-none select-none ${
                          sort === opt.id 
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400" 
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <Label>{opt.label}</Label>
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

            </div>
          </div>

          {/* Active Filtering badging row */}
          {hasActiveFilters && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Filters:</span>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:hover:bg-indigo-900"
              >
                <X size={12} />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="mx-auto max-w-7xl mb-8 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-sm font-medium text-red-600 backdrop-blur-sm dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            Network sync down. Failed to load publications. Please check your parameters.
          </div>
        )}

        {/* ARTICLES GRID */}
        <div className="mx-auto max-w-7xl">
          {isInitialLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <div className={`transition-opacity duration-300 ${isRefetching ? "pointer-events-none opacity-40" : "opacity-100"}`}>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {blogs.map((blog, i) => (
                    <BlogCard key={blog._id || i} blog={blog} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {!isInitialLoading && blogs.length > 0 && (
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