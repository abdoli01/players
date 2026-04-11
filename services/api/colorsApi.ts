// services/colorsApi.ts

import { baseApi } from "./baseApi";
import {
    Color,
    CreateColorDto,
    UpdateColorDto,
} from "@/types/color";

export const colorsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ایجاد رنگ جدید
        createColor: builder.mutation<Color, CreateColorDto>({
            query: (body) => ({
                url: "/colors",
                method: "POST",
                body,
            }),
            invalidatesTags: ["COLORS"],
        }),

        // دریافت لیست رنگ‌ها
        getColors: builder.query<Color[], void>({
            query: () => "/colors",
            providesTags: ["COLORS"],
        }),

        // دریافت رنگ پیش‌فرض
        getDefaultColor: builder.query<Color, void>({
            query: () => "/colors/default",
            providesTags: ["COLORS"],
        }),

        // ویرایش رنگ پیش‌فرض
        updateDefaultColor: builder.mutation<Color, UpdateColorDto>({
            query: (body) => ({
                url: "/colors/default",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["COLORS"],
        }),

        // دریافت یک رنگ با id
        getColorById: builder.query<Color, string>({
            query: (id) => `/colors/${id}`,
            providesTags: (_result, _error, id) => [{ type: "COLORS", id }],
        }),

        // ویرایش رنگ
        updateColor: builder.mutation<Color, { id: string; body: UpdateColorDto }>({
            query: ({ id, body }) => ({
                url: `/colors/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["COLORS"],
        }),

        // حذف رنگ
        deleteColor: builder.mutation<void, string>({
            query: (id) => ({
                url: `/colors/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["COLORS"],
        }),

    }),
});

export const {
    useCreateColorMutation,
    useGetColorsQuery,
    useGetDefaultColorQuery,
    useUpdateDefaultColorMutation,
    useGetColorByIdQuery,
    useUpdateColorMutation,
    useDeleteColorMutation,
} = colorsApi;