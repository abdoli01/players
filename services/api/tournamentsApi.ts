// services/api/tournamentsApi.ts
import { baseApi } from "./baseApi";
import {
    Tournament,
    CreateTournamentDto,
    UpdateTournamentDto,
    TournamentSearchParams,
} from "@/types/tournament";

export const tournamentsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /tournaments
        createTournament: builder.mutation<Tournament, CreateTournamentDto>({
            query: (body) => ({
                url: "/tournaments",
                method: "POST",
                body,
            }),
            invalidatesTags: ["TOURNAMENTS"],
        }),

        // GET /tournaments
        getTournaments: builder.query<Tournament[], void>({
            query: () => "/tournaments",
            providesTags: ["TOURNAMENTS"],
        }),

        // GET /tournaments/search
        searchTournaments: builder.query<Tournament[], TournamentSearchParams>({
            query: (params) => ({
                url: "/tournaments/search",
                params,
            }),
            providesTags: ["TOURNAMENTS"],
        }),

        // GET /tournaments/{id}
        getTournamentById: builder.query<Tournament, string>({
            query: (id) => `/tournaments/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "TOURNAMENTS", id },
            ],
        }),

        // PATCH /tournaments/{id}
        updateTournament: builder.mutation<
            Tournament,
            { id: string; body: UpdateTournamentDto }
        >({
            query: ({ id, body }) => ({
                url: `/tournaments/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["TOURNAMENTS"],
        }),

        // DELETE /tournaments/{id}
        deleteTournament: builder.mutation<void, string>({
            query: (id) => ({
                url: `/tournaments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TOURNAMENTS"],
        }),

    }),
});

export const {
    useCreateTournamentMutation,
    useGetTournamentsQuery,
    useSearchTournamentsQuery,
    useGetTournamentByIdQuery,
    useUpdateTournamentMutation,
    useDeleteTournamentMutation,
} = tournamentsApi;
