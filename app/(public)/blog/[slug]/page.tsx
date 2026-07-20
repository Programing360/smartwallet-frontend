"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  Share2,
  Bookmark,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  Skeleton,
} from "@heroui/react";
import {
  useGetBlogBySlugQuery,
  useGetRelatedBlogsQuery,
  type Blog,
  type BlogCategory,
} from "@/store/api/blogApi";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ToastMessage = { id: number; text: string } | null;

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORY_ACCENT: Record<
  BlogCategory,
  { border: string; bg: string; text: string; darkBorder: string; darkBg: string; darkText: string }
> = {
  budgeting: {
    border: "border-l-indigo-500",
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    darkBorder: "dark:border-l-indigo-400",
    darkBg: "dark:bg-indigo-900/40",
    darkText: "dark:text-indigo-400",
  },
  saving: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    darkBorder: "dark:border-l-emerald-400",
    darkBg: "dark:bg-emerald-900/40",
    darkText: "dark:text-emerald-400",
  },
  investing: {
    border: "border-l-amber-500",
    bg: "bg-amber-100",
    text: "text-amber-700",
    darkBorder: "dark:border-l-amber-400",
    darkBg: "dark:bg-amber-900/40",
    darkText: "dark:text-amber-400",
  },
  debt_management: {
    border: "border-l-rose-500",
    bg: "bg-rose-100",
    text: "text-rose-700",
    darkBorder: "dark:border-l-rose-400",
    darkBg: "dark:bg-rose-900/40",
    darkText: "dark:text-rose-400",
  },
  financial_planning: {
    border: "border-l-violet-500",
    bg: "bg-violet-100",
    text: "text-violet-700",
    darkBorder: "dark:border-l-violet-400",
    darkBg: "dark:bg-violet-900/40",
    darkText: "dark:text-violet-400",
  },
  ai_finance: {
    border: "border-l-cyan-500",
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    darkBorder: "dark:border-l-cyan-400",
    darkBg: "dark:bg-cyan-900/40",
    darkText: "dark:text-cyan-400",
  },
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
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Skeleton loading                                                   */
/* ------------------------------------------------------------------ */

function DetailSkeleton() {
  return (
    <div>
      {/* hero skeleton */}
      <Skeleton className="h-[55vh] w-full rounded-none" />
      <div className="mx-auto max-w-3xl px-4 -mt-20 relative z-10 pb-20">
        <Skeleton className="mb-4 h-6 w-32 rounded-full" />
        <Skeleton className="mb-3 h-10 w-3/4 rounded-lg" />
        <Skeleton className="mb-6 h-5 w-full rounded-lg" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-28 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-4 px-4 pb-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full rounded-lg" />
        ))}
        <Skeleton className="h-4 w-2/3 rounded-lg" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Not Found                                                          */
/* ------------------------------------------------------------------ */

function BlogNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
        <AlertCircle className="h-10 w-10 text-rose-500" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
        Article Not Found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The article you&aposre looking for does not a post exist or may have
        been removed.
      </p>
      <Link
        href="/blog"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Related article card (reuses listing page style)                    */
/* ------------------------------------------------------------------ */

function RelatedCard({ blog }: { blog: Blog }) {
  const accent = CATEGORY_ACCENT[blog.category] ?? CATEGORY_ACCENT.budgeting;
  const catLabel = CATEGORY_LABELS[blog.category] ?? blog.category;

  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-lg/5">
        {/* cover image */}
        <div className="relative aspect-video w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.coverImageUrl}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${accent.bg} ${accent.text} ${accent.darkBg} ${accent.darkText}`}
          >
            {catLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-base font-bold text-slate-900 dark:text-white">
            {blog.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
            {blog.excerpt}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <User size={12} />
              {blog.author}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {blog.readTimeMinutes} min read
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const contentRef = useRef<HTMLDivElement>(null);

  /* ---- local UI state ---- */
  const [bookmarked, setBookmarked] = useState(false);
  const [toast, setToast] = useState<ToastMessage>(null);
  const toastCounter = useRef(0);

  /* ---- RTK Query ---- */
  const {
    data: blog,
    isLoading,
    isError,
  } = useGetBlogBySlugQuery(slug, { skip: !slug });

  // console.log(blog);

  const { data: related = [] } = useGetRelatedBlogsQuery(slug, {
    skip: !slug,
  });

  /* ---- AOS init ---- */
  useEffect(() => {
    AOS.init({
      duration: 400,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Reading progress bar                                               */
  /*  useScroll tracks the viewport scroll position relative to the     */
  /*  document; useSpring smooths the raw 0→1 value to avoid jerky     */
  /*  jumps as the user scrolls.                                        */
  /* ------------------------------------------------------------------ */

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  /* ---- helpers ---- */
  const showToast = (text: string) => {
    toastCounter.current += 1;
    const id = toastCounter.current;
    setToast({ id, text });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 2500);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Failed to copy link");
    }
  };

  /* ---- loading / error ---- */
  if (isLoading) return <DetailSkeleton />;
  if (isError || !blog) return <BlogNotFound />;

  const accent = CATEGORY_ACCENT[blog.category] ?? CATEGORY_ACCENT.budgeting;
  const catLabel = CATEGORY_LABELS[blog.category] ?? blog.category;
  const pullQuote = extractPullQuote(blog.content);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* ================================================================ */}
      {/*  READING PROGRESS BAR                                            */}
      {/*  Thin bar pinned to the top of the viewport, fills left→right   */}
      {/*  as the user scrolls through the article.                       */}
      {/* ================================================================ */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-[3px] origin-left bg-indigo-600 dark:bg-indigo-400"
        style={{ scaleX }}
      />

      {/* ================================================================ */}
      {/*  FULL-BLEED HERO                                                 */}
      {/*  Edge-to-edge cover image with a dark gradient overlay.         */}
      {/*  Title, category badge, and meta sit on top of the gradient.    */}
      {/* ================================================================ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[55vh] w-full overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={blog.coverImageUrl}
          alt={blog.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* gradient overlay — darkens bottom third for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* back link — floating pill, top-left */}
        <Link
          href="/blog"
          className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:left-8 sm:top-8"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {/* overlaid text — title, badge, meta */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-10 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto max-w-3xl"
          >
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${accent.bg} ${accent.text} ${accent.darkBg} ${accent.darkText}`}
            >
              {catLabel}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              {blog.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <User size={14} />
                {blog.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(blog.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} />
                {blog.readTimeMinutes} min read
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ================================================================ */}
      {/*  CONTENT AREA — share rail + article column                      */}
      {/*  On xl+ screens, a sticky rail of icon buttons sits to the left. */}
      {/*  On smaller screens it's hidden (the share actions collapse).   */}
      {/* ================================================================ */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* -------------------------------------------------------------- */}
          {/*  STICKY SHARE RAIL (desktop only, xl+)                         */}
          {/*  Positioned sticky so it stays visible while reading.         */}
          {/*  Hidden below xl breakpoint via the parent flex layout.       */}
          {/* -------------------------------------------------------------- */}
          <aside className="hidden xl:flex xl:w-12 xl:shrink-0 xl:flex-col xl:items-center xl:gap-4 xl:pt-48">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
              title="Share this article"
            >
              <Share2 size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBookmarked((b) => !b)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors ${
                bookmarked
                  ? "border-indigo-300 bg-indigo-50 text-indigo-600 dark:border-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
              }`}
              title={bookmarked ? "Bookmarked" : "Bookmark this article"}
            >
              <Bookmark
                size={18}
                className={bookmarked ? "fill-current" : ""}
              />
            </motion.button>
          </aside>

          {/* -------------------------------------------------------------- */}
          {/*  ARTICLE CONTENT COLUMN                                        */}
          {/* -------------------------------------------------------------- */}
          <article ref={contentRef} className="min-w-0 flex-1">
            <div className="mx-auto max-w-3xl">
              {/* excerpt */}
              <p className="text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                {blog.excerpt}
              </p>

              {/* -------------------------------------------------------- */}
              {/*  PULL QUOTE — styled first sentence of 2nd paragraph     */}
              {/*  Adds visual rhythm with a category-colored left border.  */}
              {/* -------------------------------------------------------- */}
              {pullQuote && (
                <blockquote
                  className={`my-8 border-l-4 ${accent.border} ${accent.darkBorder} py-1 pl-6 text-xl font-semibold italic leading-relaxed text-slate-800 dark:text-slate-200`}
                >
                  &ldquo{pullQuote}&rdquo
                </blockquote>
              )}

              {/* article body — rendered as HTML from the backend */}
              <div
                className="prose prose-lg max-w-none text-slate-700 dark:prose-invert dark:text-slate-300
                  prose-headings:text-slate-900 dark:prose-headings:text-white
                  prose-a:text-indigo-600 dark:prose-a:text-indigo-400
                  prose-strong:text-slate-900 dark:prose-strong:text-white
                  prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* -------------------------------------------------------- */}
              {/*  KEY TAKEAWAYS                                            */}
              {/* -------------------------------------------------------- */}
              {blog.keyTakeaways && blog?.keyTakeaways.length > 0 && (
                <div
                  data-aos="fade-up"
                  data-aos-once="true"
                  data-aos-duration="400"
                  className={`mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900`}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircle2
                      size={20}
                      className="text-emerald-500"
                    />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Key Takeaways
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {blog.keyTakeaways.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-emerald-500"
                        />
                        <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/*  TAGS ROW                                                 */}
              {/* -------------------------------------------------------- */}
              {blog.tags.length > 0 && (
                <div
                  data-aos="fade-up"
                  data-aos-once="true"
                  data-aos-duration="400"
                  data-aos-delay="100"
                  className="mt-10 flex flex-wrap gap-2"
                >
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/*  AUTHOR CARD                                              */}
              {/* -------------------------------------------------------- */}
              <div
                data-aos="fade-up"
                data-aos-once="true"
                data-aos-duration="400"
                data-aos-delay="150"
                className="mt-12 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
                  <User size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {blog.author}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Author
                  </p>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/*  RELATED ARTICLES                                          */}
            {/* ---------------------------------------------------------- */}
            {related.length > 0 && (
              <div
                data-aos="fade-up"
                data-aos-once="true"
                data-aos-duration="400"
                data-aos-delay="200"
                className="mt-16"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Related Articles
                  </h2>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    View All
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.slice(0, 3).map((r) => (
                    <RelatedCard key={r._id} blog={r} />
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  TOAST NOTIFICATION — slides in/out at bottom-center            */}
      {/* ================================================================ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl dark:bg-slate-100 dark:text-slate-900"
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Content helpers                                                    */
/* ------------------------------------------------------------------ */

/**
 * Extract a pull-quote from the blog content.
 * Heuristic: take the first sentence of the second <p> tag if it exists
 * and is long enough to be a strong statement.
 */
function extractPullQuote(html: string): string | null {
  if (!html) return null;
  const paragraphs = html.match(/<p[^>]*>(.*?)<\/p>/gi);
  if (!paragraphs || paragraphs.length < 2) return null;
  const secondPara = paragraphs[1].replace(/<[^>]+>/g, "").trim();
  /* only show as pull-quote if the sentence is substantial */
  if (secondPara.length < 40) return null;
  /* extract first sentence (up to first period or 200 chars) */
  const firstSentence = secondPara.split(/\.\s/)[0]?.trim();
  if (!firstSentence || firstSentence.length < 40) return null;
  return firstSentence.endsWith(".")
    ? firstSentence.slice(0, -1)
    : firstSentence;
}
