// services/api/teamsApi.ts
import { baseApi } from "./baseApi";
import {
    Team,
    CreateTeamDto,
    UpdateTeamDto,
    TeamSearchParams,
} from "@/types/team";

export const teamsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /teams
        createTeam: builder.mutation<Team, CreateTeamDto>({
            query: (body) => ({
                url: "/teams",
                method: "POST",
                body,
            }),
            invalidatesTags: ["TEAMS"],
        }),

        // GET /teams
        getTeams: builder.query<Team[], void>({
            query: () => "/teams",
            providesTags: ["TEAMS"],
        }),

        // GET /teams/search
        searchTeams: builder.query<Team[], TeamSearchParams>({
            query: (params) => ({
                url: "/teams/search",
                params,
            }),
            providesTags: ["TEAMS"],
        }),

        // GET /teams/{id}
        getTeamById: builder.query<Team, string>({
            query: (id) => `/teams/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "TEAMS", id },
            ],
        }),

        // PATCH /teams/{id}
        updateTeam: builder.mutation<
            Team,
            { id: string; body: UpdateTeamDto }
        >({
            query: ({ id, body }) => ({
                url: `/teams/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["TEAMS"],
        }),

        // DELETE /teams/{id}
        deleteTeam: builder.mutation<void, string>({
            query: (id) => ({
                url: `/teams/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TEAMS"],
        }),

    }),
});

export const {
    useCreateTeamMutation,
    useGetTeamsQuery,
    useSearchTeamsQuery,
    useGetTeamByIdQuery,
    useUpdateTeamMutation,
    useDeleteTeamMutation,
} = teamsApi;
