// services/seasonsApi.ts
import { baseApi } from "./baseApi";
import {
    Season,
    CreateSeasonDto,
    UpdateSeasonDto,
    SeasonSearchParams,
} from "@/types/season";

export const seasonsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /seasons
        createSeason: builder.mutation<Season, CreateSeasonDto>({
            query: (body) => ({
                url: "/seasons",
                method: "POST",
                body,
            }),
            invalidatesTags: ["SEASONS"],
        }),

        // GET /seasons
        getSeasons: builder.query<Season[], void>({
            query: () => "/seasons",
            providesTags: ["SEASONS"],
        }),

        // GET /seasons/search
        searchSeasons: builder.query<Season[], SeasonSearchParams>({
            query: (params) => ({
                url: "/seasons/search",
                params,
            }),
            providesTags: ["SEASONS"],
        }),

        // GET /seasons/{id}
        getSeasonById: builder.query<Season, string>({
            query: (id) => `/seasons/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "SEASONS", id },
            ],
        }),

        // PATCH /seasons/{id}
        updateSeason: builder.mutation<
            Season,
            { id: string; body: UpdateSeasonDto }
        >({
            query: ({ id, body }) => ({
                url: `/seasons/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SEASONS"],
        }),

        // DELETE /seasons/{id}
        deleteSeason: builder.mutation<void, string>({
            query: (id) => ({
                url: `/seasons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SEASONS"],
        }),

    }),
});

export const {
    useCreateSeasonMutation,
    useGetSeasonsQuery,
    useSearchSeasonsQuery,
    useGetSeasonByIdQuery,
    useUpdateSeasonMutation,
    useDeleteSeasonMutation,
} = seasonsApi;
