import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ------------------------------------------------------------------ */
/*  Types — mirrors the backend interfaces                              */
/* ------------------------------------------------------------------ */

export interface ClassificationResult {
  category: string;
  confidence: "low" | "medium" | "high";
}

export interface TopCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface AIReport {
  id: string;
  title: string;
  summary: string;
  insight: string;
  topCategories: TopCategory[];
  insights: string[];
  transactionCount: number;
  month: string;
  createdAt: string;
}

export interface AnalyzeFileResponse {
  imported: number;
  lowConfidenceCount: number;
  needsReviewCount: number;
  analysisPending: boolean;
  report: AIReport | null;
}

/* ------------------------------------------------------------------ */
/*  AI API slice                                                       */
/* ------------------------------------------------------------------ */

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
    credentials: "include",
    prepareHeaders: async (headers) => {
      if (typeof window !== "undefined") {
        const { getUserToken } = await import("./session");
        const token = await getUserToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["AIReport"],
  endpoints: (builder) => ({
    classifyTransaction: builder.mutation<
      ClassificationResult,
      { title: string; description?: string }
    >({
      query: (body) => ({
        url: "/ai/classify",
        method: "POST",
        body,
      }),
    }),

    /**
     * Upload a CSV, PDF, or image file for analysis.
     * RTK Query will set Content-Type to multipart/form-data automatically
     * when the body is a FormData instance — do NOT set it manually.
     */
    analyzeFile: builder.mutation<AnalyzeFileResponse, FormData>({
      query: (body) => ({
        url: "/ai/analyze-file",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AIReport"],
    }),

    getLatestReport: builder.query<AIReport | null, void>({
      query: () => "/ai/reports/latest",
      providesTags: ["AIReport"],
    }),

    getReportByMonth: builder.query<AIReport | null, string>({
      query: (month) => `/ai/reports/${month}`,
      providesTags: (_result, _error, month) => [
        { type: "AIReport", id: month },
      ],
    }),
  }),
});

export const {
  useClassifyTransactionMutation,
  useAnalyzeFileMutation,
  useGetLatestReportQuery,
  useGetReportByMonthQuery,
} = aiApi;
