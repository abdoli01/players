import { baseApi } from "./baseApi"
import {
    TournamentSeason,
    CreateTournamentSeasonDto,
    UpdateTournamentSeasonDto,
    TournamentSeasonSearchParams,
} from "@/types/tournamentSeason"

export const tournamentSeasonsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /tournament-seasons
        createTournamentSeason: builder.mutation<
            TournamentSeason,
            CreateTournamentSeasonDto
        >({
            query: (body) => ({
                url: "/tournament-seasons",
                method: "POST",
                body,
            }),
            invalidatesTags: ["TOURNAMENT_SEASONS"],
        }),

        // GET /tournament-seasons
        getTournamentSeasons: builder.query<
            TournamentSeason[],
            void
        >({
            query: () => "/tournament-seasons",
            providesTags: ["TOURNAMENT_SEASONS"],
        }),

        // GET /tournament-seasons/search
        searchTournamentSeasons: builder.query<
            TournamentSeason[],
            TournamentSeasonSearchParams
        >({
            query: (params) => ({
                url: "/tournament-seasons/search",
                params,
            }),
            providesTags: ["TOURNAMENT_SEASONS"],
        }),

        // GET /tournament-seasons/{id}
        getTournamentSeasonById: builder.query<
            TournamentSeason,
            string
        >({
            query: (id) => `/tournament-seasons/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "TOURNAMENT_SEASONS", id },
            ],
        }),

        // PATCH /tournament-seasons/{id}
        updateTournamentSeason: builder.mutation<
            TournamentSeason,
            { id: string; body: UpdateTournamentSeasonDto }
        >({
            query: ({ id, body }) => ({
                url: `/tournament-seasons/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["TOURNAMENT_SEASONS"],
        }),

        // DELETE /tournament-seasons/{id}
        deleteTournamentSeason: builder.mutation<void, string>({
            query: (id) => ({
                url: `/tournament-seasons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TOURNAMENT_SEASONS"],
        }),

    }),
})
