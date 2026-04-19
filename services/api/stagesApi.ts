// services/stagesApi.ts

import { baseApi } from "./baseApi";
import {
    Stage,
    CreateStageDto,
    UpdateStageDto,
    StageSearchParams,
} from "@/types/stage";

export const stagesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ایجاد مرحله
        createStage: builder.mutation<Stage, CreateStageDto>({
            query: (body) => ({
                url: "/stages",
                method: "POST",
                body,
            }),
            invalidatesTags: ["STAGES"],
        }),

        // دریافت لیست مراحل
        getStages: builder.query<Stage[], void>({
            query: () => "/stages",
            providesTags: ["STAGES"],
        }),

        // جستجو مراحل
        searchStages: builder.query<Stage[], StageSearchParams>({
            query: (params) => ({
                url: "/stages/search",
                params,
            }),
            providesTags: ["STAGES"],
        }),

        // دریافت مرحله با id
        getStageById: builder.query<Stage, string>({
            query: (id) => `/stages/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "STAGES", id },
            ],
        }),

        // ویرایش مرحله
        updateStage: builder.mutation<
            Stage,
            { id: string; body: UpdateStageDto }
        >({
            query: ({ id, body }) => ({
                url: `/stages/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["STAGES"],
        }),

        // حذف مرحله
        deleteStage: builder.mutation<void, string>({
            query: (id) => ({
                url: `/stages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["STAGES"],
        }),
    }),
});

export const {
    useCreateStageMutation,
    useGetStagesQuery,
    useSearchStagesQuery,
    useGetStageByIdQuery,
    useUpdateStageMutation,
    useDeleteStageMutation,
} = stagesApi;