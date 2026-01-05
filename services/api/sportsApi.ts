// services/sportsApi.ts
import { baseApi } from "./baseApi";
import {
    Sport,
    CreateSportDto,
    UpdateSportDto,
    SportSearchParams,
} from "@/types/sport";

export const sportsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ایجاد ورزش جدید
        createSport: builder.mutation<Sport, CreateSportDto>({
            query: (body) => ({
                url: "/sports",
                method: "POST",
                body,
            }),
            invalidatesTags: ["SPORTS"],
        }),

        // دریافت لیست ورزش‌ها
        getSports: builder.query<Sport[], void>({
            query: () => "/sports",
            providesTags: ["SPORTS"],
        }),

        // جستجو ورزش‌ها
        searchSports: builder.query<Sport[], SportSearchParams>({
            query: (params) => ({
                url: "/sports/search",
                params,
            }),
            providesTags: ["SPORTS"],
        }),

        // دریافت یک ورزش با id
        getSportById: builder.query<Sport, string>({
            query: (id) => `/sports/${id}`,
            providesTags: (_result, _error, id) => [{ type: "SPORTS", id }],
        }),

        // به‌روزرسانی ورزش
        updateSport: builder.mutation<Sport, { id: string; body: UpdateSportDto }>({
            query: ({ id, body }) => ({
                url: `/sports/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SPORTS"],
        }),

        // حذف ورزش
        deleteSport: builder.mutation<void, string>({
            query: (id) => ({
                url: `/sports/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SPORTS"],
        }),

    }),
});

export const {
    useCreateSportMutation,
    useGetSportsQuery,
    useSearchSportsQuery,
    useGetSportByIdQuery,
    useUpdateSportMutation,
    useDeleteSportMutation,
} = sportsApi;
