// services/teamLevelsApi.ts
import { baseApi } from "./baseApi";
import {
    TeamLevel,
    CreateTeamLevelDto,
    UpdateTeamLevelDto,
    TeamLevelSearchParams,
} from "@/types/teamLevel";

export const teamLevelsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /team-levels
        createTeamLevel: builder.mutation<TeamLevel, CreateTeamLevelDto>({
            query: (body) => ({
                url: "/team-levels",
                method: "POST",
                body,
            }),
            invalidatesTags: ["TEAM_LEVELS"],
        }),

        // GET /team-levels
        getTeamLevels: builder.query<TeamLevel[], void>({
            query: () => "/team-levels",
            providesTags: ["TEAM_LEVELS"],
        }),

        // GET /team-levels/search
        searchTeamLevels: builder.query<TeamLevel[], TeamLevelSearchParams>({
            query: (params) => ({
                url: "/team-levels/search",
                params,
            }),
            providesTags: ["TEAM_LEVELS"],
        }),

        // GET /team-levels/{id}
        getTeamLevelById: builder.query<TeamLevel, string>({
            query: (id) => `/team-levels/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "TEAM_LEVELS", id },
            ],
        }),

        // PATCH /team-levels/{id}
        updateTeamLevel: builder.mutation<
            TeamLevel,
            { id: string; body: UpdateTeamLevelDto }
        >({
            query: ({ id, body }) => ({
                url: `/team-levels/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["TEAM_LEVELS"],
        }),

        // DELETE /team-levels/{id}
        deleteTeamLevel: builder.mutation<void, string>({
            query: (id) => ({
                url: `/team-levels/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TEAM_LEVELS"],
        }),

    }),
});

export const {
    useCreateTeamLevelMutation,
    useGetTeamLevelsQuery,
    useSearchTeamLevelsQuery,
    useGetTeamLevelByIdQuery,
    useUpdateTeamLevelMutation,
    useDeleteTeamLevelMutation,
} = teamLevelsApi;
