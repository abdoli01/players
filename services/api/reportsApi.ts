// services/reportsApi.ts
import { baseApi } from "./baseApi";
import {
    ReportKeyDto,
    ReportResponseDto,
    GetReportKeywordsParams,
    GetReportParams,
} from "@/types/report";

export const reportsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ----------------------------------
        // GET /reports/keyword
        // دریافت لیست کلیدواژه‌های گزارش
        // ----------------------------------
        getReportKeywords: builder.query<
            ReportKeyDto[],
            GetReportKeywordsParams
        >({
            query: (params) => ({
                url: "/reports/keyword",
                params,
            }),
            providesTags: ["REPORTS"],
        }),

        // ----------------------------------
        // GET /reports
        // دریافت داده گزارش
        // ----------------------------------
        getReport: builder.query<
            ReportResponseDto,
            GetReportParams
        >({
            query: (params) => ({
                url: "/reports",
                params,
            }),
            providesTags: ["REPORTS"],
        }),

    }),
});

export const {
    useGetReportKeywordsQuery,
    useGetReportQuery,
} = reportsApi;