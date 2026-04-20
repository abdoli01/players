import { baseApi } from "./baseApi";
import {
    MatchPlayer,
    CreateMatchPlayerDto,
    UpdateMatchPlayerDto,
    MatchPlayerSearchParams,
} from "@/types/matchPlayer";

export const matchPlayersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // POST /match-players
        createMatchPlayer: builder.mutation<MatchPlayer, CreateMatchPlayerDto>({
            query: (body) => ({
                url: "/match-players",
                method: "POST",
                body,
            }),
            invalidatesTags: ["MATCH_PLAYERS"],
        }),

        // GET /match-players
        getMatchPlayers: builder.query<MatchPlayer[], void>({
            query: () => "/match-players",
            providesTags: ["MATCH_PLAYERS"],
        }),

        // GET /match-players/search
        searchMatchPlayers: builder.query<
            MatchPlayer[],
            MatchPlayerSearchParams
        >({
            query: (params) => ({
                url: "/match-players/search",
                params,
            }),
            providesTags: ["MATCH_PLAYERS"],
        }),

        // GET /match-players/{id}
        getMatchPlayerById: builder.query<MatchPlayer, string>({
            query: (id) => `/match-players/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "MATCH_PLAYERS", id },
            ],
        }),

        // PATCH /match-players/{id}
        updateMatchPlayer: builder.mutation<
            MatchPlayer,
            { id: string; body: UpdateMatchPlayerDto }
        >({
            query: ({ id, body }) => ({
                url: `/match-players/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["MATCH_PLAYERS"],
        }),

        // DELETE /match-players/{id}
        deleteMatchPlayer: builder.mutation<void, string>({
            query: (id) => ({
                url: `/match-players/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MATCH_PLAYERS"],
        }),
    }),
});

export const {
    useCreateMatchPlayerMutation,
    useGetMatchPlayersQuery,
    useSearchMatchPlayersQuery,
    useGetMatchPlayerByIdQuery,
    useUpdateMatchPlayerMutation,
    useDeleteMatchPlayerMutation,
} = matchPlayersApi;