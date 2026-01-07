import { baseApi } from "./baseApi"
import {
    TeamSeasonToTournamentSeason,
    CreateTeamSeasonToTournamentSeasonDto,
    UpdateTeamSeasonToTournamentSeasonDto,
    TeamSeasonToTournamentSeasonSearchParams,
} from "@/types/teamSeasonToTournamentSeason"

export const teamSeasonToTournamentSeasonsApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({

            // POST /team-season-to-tournament-seasons
            createTeamSeasonToTournamentSeason: builder.mutation<
                TeamSeasonToTournamentSeason,
                CreateTeamSeasonToTournamentSeasonDto
            >({
                query: (body) => ({
                    url: "/team-season-to-tournament-seasons",
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["TEAM_SEASON_TO_TOURNAMENT_SEASONS"],
            }),

            // GET /team-season-to-tournament-seasons
            getTeamSeasonToTournamentSeasons: builder.query<
                TeamSeasonToTournamentSeason[],
                void
            >({
                query: () => "/team-season-to-tournament-seasons",
                providesTags: ["TEAM_SEASON_TO_TOURNAMENT_SEASONS"],
            }),

            // GET /team-season-to-tournament-seasons/search
            searchTeamSeasonToTournamentSeasons: builder.query<
                TeamSeasonToTournamentSeason[],
                TeamSeasonToTournamentSeasonSearchParams
            >({
                query: (params) => ({
                    url: "/team-season-to-tournament-seasons/search",
                    params,
                }),
                providesTags: ["TEAM_SEASON_TO_TOURNAMENT_SEASONS"],
            }),

            // GET /team-season-to-tournament-seasons/{id}
            getTeamSeasonToTournamentSeasonById: builder.query<
                TeamSeasonToTournamentSeason,
                string
            >({
                query: (id) =>
                    `/team-season-to-tournament-seasons/${id}`,
                providesTags: (_result, _error, id) => [
                    {
                        type: "TEAM_SEASON_TO_TOURNAMENT_SEASONS",
                        id,
                    },
                ],
            }),

            // PATCH /team-season-to-tournament-seasons/{id}
            updateTeamSeasonToTournamentSeason: builder.mutation<
                TeamSeasonToTournamentSeason,
                {
                    id: string
                    body: UpdateTeamSeasonToTournamentSeasonDto
                }
            >({
                query: ({ id, body }) => ({
                    url: `/team-season-to-tournament-seasons/${id}`,
                    method: "PATCH",
                    body,
                }),
                invalidatesTags: ["TEAM_SEASON_TO_TOURNAMENT_SEASONS"],
            }),

            // DELETE /team-season-to-tournament-seasons/{id}
            deleteTeamSeasonToTournamentSeason: builder.mutation<
                void,
                string
            >({
                query: (id) => ({
                    url: `/team-season-to-tournament-seasons/${id}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["TEAM_SEASON_TO_TOURNAMENT_SEASONS"],
            }),

        }),
    })

export const {
    useCreateTeamSeasonToTournamentSeasonMutation,
    useGetTeamSeasonToTournamentSeasonsQuery,
    useSearchTeamSeasonToTournamentSeasonsQuery,
    useGetTeamSeasonToTournamentSeasonByIdQuery,
    useUpdateTeamSeasonToTournamentSeasonMutation,
    useDeleteTeamSeasonToTournamentSeasonMutation,
} = teamSeasonToTournamentSeasonsApi
