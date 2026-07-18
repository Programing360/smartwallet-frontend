import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getUserToken } from "./session";

/* ------------------------------------------------------------------ */
/*  Types — mirrors the backend ClassificationResult interface          */
/* ------------------------------------------------------------------ */

export interface ClassificationResult {
  category: string;
  confidence: "low" | "medium" | "high";
}

export interface AIReport {
  id: string;
  title: string;
  insight: string;
  createdAt: string;
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
        const token = await getUserToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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

    getLatestReport: builder.query<AIReport | null, void>({
      query: () => "/ai/reports/latest",
    }),
  }),
});

export const { useClassifyTransactionMutation, useGetLatestReportQuery } =
  aiApi;
