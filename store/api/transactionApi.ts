import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getUserToken } from "./session";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "auto"
  | "food"
  | "transport"
  | "bills"
  | "shopping"
  | "entertainment"
  | "other";

export interface CreateTransactionPayload {
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
}

export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  aiTag: string;
  date: string;
  description: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  totalPages: number;
}

export type SortOption = "newest" | "oldest" | "amount_high" | "amount_low";

export type DateRange = "all" | "month" | "30days" | "90days";

export interface TransactionQueryParams {
  search: string;
  category: string;
  dateRange: DateRange;
  sort: SortOption;
  page: number;
  limit?: number;
}

/* ------------------------------------------------------------------ */
/*  Dashboard summary types                                            */
/* ------------------------------------------------------------------ */

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface DailySpending {
  date: string;
  amount: number;
}

export interface RecentTransaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
}

export interface PercentChange {
  income: number;
  expense: number;
  savings: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  topCategory: { name: string; amount: number };
  percentChanges: PercentChange;
  dailySpending: DailySpending[];
  categoryBreakdown: CategoryBreakdown[];
  recentTransactions: RecentTransaction[];
  hasTransactions: boolean;
}


export interface TransactionApiResponse {
  success: boolean;
  data: TransactionsResponse;
}


/* ------------------------------------------------------------------ */
/*  API slice                                                          */
/* ------------------------------------------------------------------ */

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
    credentials: "include",
    prepareHeaders: async (headers) => {
      if (typeof window !== "undefined") {
        const token = await getUserToken();
        console.log(token);
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Transaction"],
  endpoints: (builder) => ({
    /* ---- query ---- */
    getTransactions: builder.query<
      TransactionsResponse,
      TransactionQueryParams
    >({
      query: ({ search, category, dateRange, sort, page, limit = 12 }) => ({
        url: "/transactions",
        params: { search, category, dateRange, sort, page, limit },
      }),
      transformResponse: (response: TransactionApiResponse) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.transactions.map(({ _id }) => ({
                type: "Transaction" as const,
                _id,
              })),
              { type: "Transaction", _id: "LIST" },
            ]
          : [{ type: "Transaction", _id: "LIST" }],
    }),

    /* ---- dashboard ---- */
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => "/transactions/dashboard",
      providesTags: [{ type: "Transaction", id: "LIST" }],
    }),

    /* ---- mutations ---- */
    addTransaction: builder.mutation({
      query: (body) => ({
        url: "/transactions",
        method: "POST",
        body,
      }),
    }),

    updateTransactionCategory: builder.mutation<
      Transaction,
      { id: string; category: TransactionCategory }
    >({
      query: ({ id, category }) => ({
        url: `/transactions/${id}/category`,
        method: "PATCH",
        body: { category },
      }),
      /* invalidate the specific item + the list so both pages refetch */
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Transaction", id },
        { type: "Transaction", id: "LIST" },
      ],
    }),

    deleteTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Transaction", id },
        { type: "Transaction", id: "LIST" },
      ],
    }),

    bulkDeleteTransactions: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: "/transactions/bulk-delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: (_result, _error, ids) => [
        ...ids.map((id) => ({ type: "Transaction" as const, id })),
        { type: "Transaction", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetDashboardSummaryQuery,
  useAddTransactionMutation,
  useUpdateTransactionCategoryMutation,
  useDeleteTransactionMutation,
  useBulkDeleteTransactionsMutation,
} = transactionApi;
