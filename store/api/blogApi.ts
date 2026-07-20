import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type BlogCategory =
  | "budgeting"
  | "saving"
  | "investing"
  | "debt_management"
  | "financial_planning"
  | "ai_finance";

export type BlogSortOption = "newest" | "oldest" | "quickest_read";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  category: BlogCategory;
  author: string;
  readTimeMinutes: number;
  tags: string[];
  publishedAt: string;
}

export interface BlogsResponse {
  blogs: Blog[];
  total: number;
  totalPages: number;
}

export interface BlogQueryParams {
  search: string;
  category: string;
  sort: BlogSortOption;
  page: number;
  limit?: number;
}

/** Extended blog model returned by the detail endpoint */
export interface BlogDetail extends Blog {
  content: string;
  keyTakeaways: string[];
}

/* ------------------------------------------------------------------ */
/*  API slice                                                          */
/* ------------------------------------------------------------------ */

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  }),
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogsResponse, BlogQueryParams>({
      query: ({ search, category, sort, page, limit = 12 }) => ({
        url: "/blogs",
        params: { search, category, sort, page, limit },
      }),
      transformResponse: (response: {
        success: boolean;
        data: BlogsResponse;
      }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.blogs.map(({ _id }) => ({
                type: "Blog" as const,
                _id,
              })),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),

    getBlogBySlug: builder.query<BlogDetail, string>({
      query: (slug) => `/blogs/${slug}`,
      transformResponse: (response: {
        success: boolean;
        data: BlogDetail;
      }) => response.data,
      providesTags: (_result, _error, slug) => [
        { type: "Blog", _id: slug },
      ],
    }),

    getRelatedBlogs: builder.query<Blog[], string>({
      query: (slug) => `/blogs/${slug}/related`,
      transformResponse: (response: {
        success: boolean;
        data: Blog[];
      }) => response.data,
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useGetRelatedBlogsQuery,
} = blogApi;
