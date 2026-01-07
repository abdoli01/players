import { baseApi } from "./baseApi"
import {
    TeamSeason,
    CreateTeamSeasonDto,
    UpdateTeamSeasonDto,
    TeamSeasonSearchParams,
} from "@/types/teamSeason"

export const teamSeasonsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /team-seasons
        createTeamSeason: builder.mutation<
            TeamSeason,
            CreateTeamSeasonDto
        >({
            query: (body) => ({
                url: "/team-seasons",
                method: "POST",
                body,
            }),
            invalidatesTags: ["TEAM_SEASONS"],
        }),

        // GET /team-seasons
        getTeamSeasons: builder.query<
            TeamSeason[],
            void
        >({
            query: () => "/team-seasons",
            providesTags: ["TEAM_SEASONS"],
        }),

        // GET /team-seasons/search
        searchTeamSeasons: builder.query<
            TeamSeason[],
            TeamSeasonSearchParams
        >({
            query: (params) => ({
                url: "/team-seasons/search",
                params,
            }),
            providesTags: ["TEAM_SEASONS"],
        }),

        // GET /team-seasons/{id}
        getTeamSeasonById: builder.query<
            TeamSeason,
            string
        >({
            query: (id) => `/team-seasons/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "TEAM_SEASONS", id },
            ],
        }),

        // PATCH /team-seasons/{id}
        updateTeamSeason: builder.mutation<
            TeamSeason,
            { id: string; body: UpdateTeamSeasonDto }
        >({
            query: ({ id, body }) => ({
                url: `/team-seasons/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["TEAM_SEASONS"],
        }),

        // DELETE /team-seasons/{id}
        deleteTeamSeason: builder.mutation<
            void,
            string
        >({
            query: (id) => ({
                url: `/team-seasons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TEAM_SEASONS"],
        }),

    }),
})

export const {
    useCreateTeamSeasonMutation,
    useGetTeamSeasonsQuery,
    useSearchTeamSeasonsQuery,
    useGetTeamSeasonByIdQuery,
    useUpdateTeamSeasonMutation,
    useDeleteTeamSeasonMutation,
} = teamSeasonsApi
