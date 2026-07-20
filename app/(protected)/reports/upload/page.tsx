"use client";

/*
 * Reports Upload Page
 * This component is rendered INSIDE the existing protected layout shell
 * (app/(protected)/layout.tsx) which provides auth gating and the sidebar.
 * Do NOT include any navbar/sidebar markup here — only page content.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  FileImage,
  X,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  Lightbulb,
  Download,
  CheckCircle2,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, Skeleton } from "@heroui/react";
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
import { jsPDF } from "jspdf";
import { useAnalyzeFileMutation, useGetLatestReportQuery, type AIReport } from "@/store/api/aiApi";
import { formatCurrency } from "@/lib/formatters";
import { toast } from "react-toastify";

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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPTED_EXTENSIONS = [".csv", ".pdf", ".png", ".jpg", ".jpeg", ".webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function isAcceptedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function getFileIcon(fileName: string) {
  const ext = fileName.toLowerCase();
  if (ext.endsWith(".csv")) return FileSpreadsheet;
  if (ext.endsWith(".pdf")) return FileText;
  return FileImage;
}

function getFileTypeLabel(fileName: string): string {
  const ext = fileName.toLowerCase();
  if (ext.endsWith(".csv")) return "CSV";
  if (ext.endsWith(".pdf")) return "PDF";
  return "Image";
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
/*  Processing Steps — UX simulation                                    */
/*  NOTE: The actual upload is a single backend call. The step          */
/*  progression below is simulated with timed state changes purely      */
/*  for UX feedback. The mutation resolving is the real completion.      */
/* ------------------------------------------------------------------ */

function getProcessingSteps(fileType: string): string[] {
  if (fileType === "image") {
    return [
      "Uploading file...",
      "Extracting text with OCR...",
      "Classifying with AI...",
      "Generating insights...",
    ];
  }
  if (fileType === "pdf") {
    return [
      "Uploading file...",
      "Parsing PDF document...",
      "Classifying with AI...",
      "Generating insights...",
    ];
  }
  return [
    "Uploading file...",
    "Parsing CSV rows...",
    "Classifying with AI...",
    "Generating insights...",
  ];
}

function ProcessingIndicator({ fileType }: { fileType: string }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getProcessingSteps(fileType);

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 800),
      setTimeout(() => setActiveStep(2), 2200),
      setTimeout(() => setActiveStep(3), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            {i < activeStep ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            ) : i === activeStep ? (
              <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            ) : (
              <div className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-600" />
            )}
            <span
              className={`text-sm ${
                i <= activeStep
                  ? "font-medium text-slate-900 dark:text-white"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        This may take a moment while AI analyzes your spending...
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  KPI stat card — matches dashboard style exactly                     */
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

function ReportDisplay({
  report,
  needsReviewCount,
}: {
  report: AIReport;
  needsReviewCount?: number;
}) {
  const totalExpense =
    report.topCategories?.reduce((sum, c) => sum + c.amount, 0) ?? 0;

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

/* ------------------------------------------------------------------ */
/*  Download PDF — generates a simple text-based PDF report             */
/* ------------------------------------------------------------------ */

function downloadPdfReport(report: AIReport) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("SmartWallet AI — Financial Report", 20, y);
  y += 10;

  if (report.month) {
    doc.setFontSize(10);
    doc.text(`Report period: ${report.month}`, 20, y);
    y += 8;
  }

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date(report.createdAt).toLocaleDateString()}`, 20, y);
  y += 12;

  /* Summary */
  doc.setFontSize(12);
  doc.text("Summary", 20, y);
  y += 7;
  doc.setFontSize(10);
  const summaryLines = doc.splitTextToSize(report.summary, 170);
  doc.text(summaryLines, 20, y);
  y += summaryLines.length * 5 + 8;

  /* Top Categories Table */
  doc.setFontSize(12);
  doc.text("Top Spending Categories", 20, y);
  y += 7;
  doc.setFontSize(10);

  /* Table header */
  doc.text("Category", 20, y);
  doc.text("Amount", 100, y);
  doc.text("%", 150, y);
  y += 6;
  doc.line(20, y, 180, y);
  y += 4;

  for (const cat of report.topCategories ?? []) {
    doc.text(cat.category, 20, y);
    doc.text(formatCurrency(cat.amount), 100, y);
    doc.text(`${cat.percentage}%`, 150, y);
    y += 6;
  }
  y += 6;

  /* Insights */
  if (report.insights?.length) {
    doc.setFontSize(12);
    doc.text("Savings Insights", 20, y);
    y += 7;
    doc.setFontSize(10);
    for (const insight of report.insights) {
      const lines = doc.splitTextToSize(`• ${insight}`, 170);
      doc.text(lines, 20, y);
      y += lines.length * 5 + 2;
    }
  }

  doc.save(`smartwallet-report-${report.month ?? "latest"}.pdf`);
}

/* ------------------------------------------------------------------ */
/*  Main Upload Page                                                   */
/* ------------------------------------------------------------------ */

export default function ReportsUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [analyzeFile, { isLoading: isAnalyzing }] = useAnalyzeFileMutation();
  const { data: existingReport, isLoading: reportLoading } = useGetLatestReportQuery();

  const [resultReport, setResultReport] = useState<AIReport | null>(null);
  const [needsReviewCount, setNeedsReviewCount] = useState(0);

  /* Clean up image preview URL on unmount or file change */
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleFileSelect = useCallback((file: File) => {
    if (!isAcceptedFile(file)) {
      toast.warn("Please select a CSV, PDF, PNG, JPG, or WebP file");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.warn("File size must be under 10 MB");
      return;
    }

    /* Clean up old preview */
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);

    setSelectedFile(file);

    /* Create thumbnail preview for images */
    if (file.type.startsWith("image/")) {
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
    }
  }, [imagePreviewUrl]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await analyzeFile(formData).unwrap();
      if (response.report) {
        setResultReport(response.report);
        setNeedsReviewCount(response.needsReviewCount ?? 0);
      } else if (existingReport) {
        setResultReport(existingReport);
        setNeedsReviewCount(0);
      }
    } catch {
      /* error is handled by RTK Query */
    }
  }, [selectedFile, analyzeFile, existingReport]);

  const activeReport = resultReport ?? existingReport;
  const showUpload = !activeReport && !isAnalyzing;

  const fileIcon = selectedFile ? getFileIcon(selectedFile.name) : Upload;
  const fileTypeLabel = selectedFile ? getFileTypeLabel(selectedFile.name) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* ====== Header ====== */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Link
            href="/reports"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Upload Bank Statement
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Upload a CSV, PDF, or image file to auto-classify transactions and generate an AI spending report
          </p>
        </motion.div>

        {/* ====== Processing State ====== */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800"
          >
            <ProcessingIndicator fileType={fileTypeLabel ?? "CSV"} />
          </motion.div>
        )}

        {/* ====== Upload Zone (shown when no report and not analyzing) ====== */}
        {showUpload && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Card className="border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <CardContent className="p-6">
                {selectedFile ? (
                  /* ---- File selected — show details + actions ---- */
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {/* Image thumbnail or file icon */}
                      {imagePreviewUrl ? (
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600">
                          <img
                            src={imagePreviewUrl}
                            alt="File preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                          {(() => {
                            const Icon = fileIcon;
                            return <Icon className="h-6 w-6 text-indigo-500" />;
                          })()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {selectedFile.name}
                          </p>
                          <span className="inline-flex shrink-0 items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                            {fileTypeLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreviewUrl(null);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                        title="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleAnalyze}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-700"
                      >
                        <Sparkles className="h-4 w-4" />
                        Analyze
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ---- Dropzone ---- */
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-16 text-center transition-colors ${
                      isDragOver
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                        : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:border-indigo-500 dark:hover:bg-slate-700/30"
                    }`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10">
                      <Upload className="h-7 w-7 text-indigo-500" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {isDragOver
                        ? "Drop your file here"
                        : "Drag & drop your bank statement"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      or{" "}
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        browse files
                      </span>
                    </p>
                    <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                      Supports CSV, PDF, PNG, JPG, and WebP files up to 10 MB
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-700">
                        <FileSpreadsheet className="h-3.5 w-3.5" />
                        CSV
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-700">
                        <FileText className="h-3.5 w-3.5" />
                        PDF
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-700">
                        <FileImage className="h-3.5 w-3.5" />
                        Image
                      </span>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                    e.target.value = "";
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ====== Report Display (shown after analysis or when existing report loaded) ====== */}
        {activeReport && !isAnalyzing && (
          <>
            <ReportDisplay report={activeReport} needsReviewCount={needsReviewCount} />

            {/* Download + Re-upload row */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => downloadPdfReport(activeReport)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Download className="h-4 w-4" />
                Download PDF Report
              </button>
              <button
                onClick={() => {
                  setResultReport(null);
                  setSelectedFile(null);
                  setImagePreviewUrl(null);
                  setNeedsReviewCount(0);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-700"
              >
                <Upload className="h-4 w-4" />
                Upload Another Statement
              </button>
            </div>
          </>
        )}

        {/* ====== Loading skeleton for existing report ====== */}
        {reportLoading && !isAnalyzing && (
          <div className="space-y-6">
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800/50 dark:bg-indigo-950/30">
              <Skeleton className="mb-3 h-6 w-40 rounded-lg bg-indigo-200/60 dark:bg-indigo-800/30" />
              <Skeleton className="h-4 w-full rounded-lg bg-indigo-200/60 dark:bg-indigo-800/30" />
              <Skeleton className="mt-2 h-4 w-2/3 rounded-lg bg-indigo-200/60 dark:bg-indigo-800/30" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
                >
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="mt-3 h-8 w-32 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
