import { baseApi } from "./baseApi";
import {
    Round,
    CreateRoundDto,
    UpdateRoundDto,
    RoundSearchParams,
} from "@/types/round";

export const roundsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ایجاد راند
        createRound: builder.mutation<Round, CreateRoundDto>({
            query: (body) => ({
                url: "/rounds",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ROUNDS"],
        }),

        // دریافت لیست راندها
        getRounds: builder.query<Round[], void>({
            query: () => "/rounds",
            providesTags: ["ROUNDS"],
        }),

        // جستجو راندها
        searchRounds: builder.query<Round[], RoundSearchParams>({
            query: (params) => ({
                url: "/rounds/search",
                params,
            }),
            providesTags: ["ROUNDS"],
        }),

        // دریافت راند با id
        getRoundById: builder.query<Round, string>({
            query: (id) => `/rounds/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "ROUNDS", id },
            ],
        }),

        // ویرایش راند
        updateRound: builder.mutation<
            Round,
            { id: string; body: UpdateRoundDto }
        >({
            query: ({ id, body }) => ({
                url: `/rounds/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["ROUNDS"],
        }),

        // حذف راند
        deleteRound: builder.mutation<void, string>({
            query: (id) => ({
                url: `/rounds/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ROUNDS"],
        }),
    }),
});

export const {
    useCreateRoundMutation,
    useGetRoundsQuery,
    useSearchRoundsQuery,
    useGetRoundByIdQuery,
    useUpdateRoundMutation,
    useDeleteRoundMutation,
} = roundsApi;