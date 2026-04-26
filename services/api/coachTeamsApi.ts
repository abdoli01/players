import { baseApi } from "./baseApi";
import {
    CoachTeam,
    CreateCoachTeamDto,
    UpdateCoachTeamDto,
    CoachTeamSearchParams,
} from "@/types/coachTeam";

export const coachTeamsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /coach-teams
        createCoachTeam: builder.mutation<CoachTeam, CreateCoachTeamDto>({
            query: (body) => ({
                url: "/coach-teams",
                method: "POST",
                body,
            }),
            invalidatesTags: ["COACH_TEAMS"],
        }),

        // GET /coach-teams
        getCoachTeams: builder.query<CoachTeam[], void>({
            query: () => "/coach-teams",
            providesTags: ["COACH_TEAMS"],
        }),

        // GET /coach-teams/search
        searchCoachTeams: builder.query<
            CoachTeam[],
            CoachTeamSearchParams
        >({
            query: (params) => ({
                url: "/coach-teams/search",
                params,
            }),
            providesTags: ["COACH_TEAMS"],
        }),

        // GET /coach-teams/{id}
        getCoachTeamById: builder.query<CoachTeam, string>({
            query: (id) => `/coach-teams/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "COACH_TEAMS", id },
            ],
        }),

        // PATCH /coach-teams/{id}
        updateCoachTeam: builder.mutation<
            CoachTeam,
            { id: string; body: UpdateCoachTeamDto }
        >({
            query: ({ id, body }) => ({
                url: `/coach-teams/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["COACH_TEAMS"],
        }),

        // DELETE /coach-teams/{id}
        deleteCoachTeam: builder.mutation<void, string>({
            query: (id) => ({
                url: `/coach-teams/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["COACH_TEAMS"],
        }),

    }),
});

export const {
    useCreateCoachTeamMutation,
    useGetCoachTeamsQuery,
    useSearchCoachTeamsQuery,
    useGetCoachTeamByIdQuery,
    useUpdateCoachTeamMutation,
    useDeleteCoachTeamMutation,
} = coachTeamsApi;